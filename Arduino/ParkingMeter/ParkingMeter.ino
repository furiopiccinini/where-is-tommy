/**
\file ParkingMeter.ino

\brief Tales for Makers - Where is Tommy? \n
Project: parking meter remake\n

Nicla Sense ME firmware to create the motion gestures sensor. Sensor data
are integrated to the required range of values and converted in a Json 
string.
The string is sent to the host via the USB-Serial interface

\note The fine tuning calibration changes the motion sensors reading frequency.
Changing the reading frequency the two-reading delta values has a different effect:\n
For example, if delta is 10.00 units to detect a motion gesture in one of the 
directions, increasing the frequency the time distance between two sequential
readings is shorter so the motion is detected when the user moves the controller
faster than when the frequency is longer.\n
The fine tuning calibration range is from the default minimum frequency POLL_FREQ and
the maximum value MAX_POLL_FREQ; this means that also when the fine tuning is set to
zero, there is a POLL_FREQ minimum delay in milliseconds between two sequential
sensor readings.\n
The polling frequency is expressed in milliseconds delay; this means that as much higher
is the polling frequency as longer is the beriod between two different readings.

\note <e>Potentiometer Calibration</e> \n
Get these values running the application with the _CALIBRATION_
defined in the main source. The min/max ranges of the potentiometer
are not really the absolute range of the analog port, depending on
the value of the potentiometer resistance. Read the max and min values and
update the preprocessor definitions POT_MIN and POT_MAX \n
Compile the application with _CALIBRATION_ defined and read the sensor 
values from the serial monitor, then undefine _CALIBRATION_ and recompile 
the application.

\author Enrico Miglino <enrico.miglino@gmail.com>
\date Apr 2022
\version 0.3
*/

#include "Arduino.h"
#include "Nicla_System.h"
#include "Arduino_BHY2.h"
#include "ParkingMeter.h"
#include "Streaming.h"

#undef _DEBUG_
#undef _CALIBRATION_
/** 
Sensors class instance - orientation
*/
Sensor device_orientation(SENSOR_ID_DEVICE_ORI);
/**
Orientation object to retrieve the ptich, roll and heading
punctual values.
*/
SensorOrientation orientation(SENSOR_ID_ORI);  
/**
Calibration pin (analog), connected to the 50K potentiomenter
*/
const int pinCalibration = A0;
/**
Button digital pin. The motion detection is working only when the red button is pressed.
*/
const int pinButton = GPIO3;

/** 
Status of the five gestures, according to the last sensor reading.
The sensor is used to read the dominant gesture direction, if any,
after the last reading. I a gesture is recognized(pitch, roll, heading)
the corresponding gesture direction is set to true.

\note. The sensor reading can be bigger or smaller respect to the previous
reading. When the difference is greater thant the minimum delta, the
corresponding value is set to true. Only one value can be true after a
motion detected.
*/
gestures motionDirection;

/**
Double value readings of the sensors updated every loop cycle
*/
niclaSensors sensorsReading;

/** 
Initialization
*/
void setup()
{
  pinMode(pinButton, INPUT);
  /** Serial initialization */
  Serial.begin(115200);
  /** Start the board */
  BHY2.begin();
  /** Initializare the orientation component of the sensor */
  orientation.begin();
  // Start RGB Led
  nicla::begin();
  nicla::leds.begin();  
  initReadings(); 
  flashLed();
}

/** 
Application main loop
*/
void loop()
{
#ifdef _CALIBRATION_
  // For potentiometer calibration only. Need a serial output monitor
  calibratePot();
  // wait 2 milliseconds before the next loop for the analog-to-digital
  // converter to settle after the last reading:
  delay(500);
#else
  static auto pollFreq = millis();
  /** Adjusted POLL_FREQ value */
  unsigned long pFrequency;

  // Adjust the polling frequency with the fine tuning value
  pFrequency = POLL_FREQ; // + getCalibration();

  // Update function should be continuously polled
  BHY2.update();

  // Check for the frequency before updating the sensor data
  if ( (millis() - pollFreq >= pFrequency ) && (checkButton() == true) ){
    // Check if a motion has been detected and create the json
    // string
    if(checkDeltaToMotion()){
#ifdef _DEBUG_
      Serial.println("Motion detected");
      Serial.print(" pitch :");
      Serial.print(sensorsReading.pitch[1]);
      Serial.print(" roll :");
      Serial.print(sensorsReading.roll[1]);
      Serial.println("Motion flags: roll");
      Serial.print("left ");
      Serial.print(motionDirection.left);
      Serial.print(" right ");
      Serial.print(motionDirection.right);
      Serial.print(" up ");
      Serial.print(motionDirection.up);
      Serial.print(" down ");
      Serial.println(motionDirection.down);
#endif // Debug
      sendJson();

      // Reset the time counter
      pollFreq = millis();
    }
  }
#endif // Calibration
}

// -------------------------------------------------------------
// FUNCTIONS
// -------------------------------------------------------------

/**
Initializes the sensor readings.
*/
void initReadings() {
  int j;

  for(j = 0; j < 2; j++) {
    sensorsReading.roll[j] = 0;
    sensorsReading.pitch[j] = 0;
    sensorsReading.heading[j] = 0;
  }
}

void initMotionDirections() {
  motionDirection.right = false;
  motionDirection.left = false;
  motionDirection.up = false;
  motionDirection.down = false;
}

/**
Update the readings and swap the last value to 
the previous reading
*/
void updateReadings() {

  // Move last reading to previous
  sensorsReading.roll[0] = sensorsReading.roll[1];
  sensorsReading.pitch[0] = sensorsReading.pitch[1];
  sensorsReading.heading[0] = sensorsReading.heading[1];

  // Acquire the current value  
  sensorsReading.roll[1] = orientation.roll();
  sensorsReading.pitch[1] = orientation.pitch();
  sensorsReading.heading[1] = orientation.heading();

  // If we are on the first reading, duplicate the sensor value
  if(sensorsReading.roll[0] == 0)
    sensorsReading.roll[0] = sensorsReading.roll[1];

  if(sensorsReading.pitch[0] == 0)
    sensorsReading.pitch[0] = sensorsReading.pitch[1];

  if(sensorsReading.heading[0] == 0)
    sensorsReading.heading[0] = sensorsReading.heading[1];
}

/**
Calculate the three delta values between the last two readings, then
set the motionDirection structure accordingly.

\note The funciton does not implement multiple motions together. The first
detected valid direction is set.

@return true if a motion has been detected, else return false.
*/
bool checkDeltaToMotion() {
  /** Delta for last roll value */
  float dRoll;
  /** Delta for last pith value */
  float dPitch;
  /** Delta for last heading value (not used) */
  float dHeading;
  /**
  Motion detection return flag
  */
  bool motionDetected = false;

  // Reset the motion directions structure to false
  initMotionDirections();
  // Update the reading status
  updateReadings();

  // Calculate the delta values
  dRoll = sensorsReading.roll[1] - sensorsReading.roll[0];
  dPitch = sensorsReading.pitch[1] - sensorsReading.pitch[0];
  dHeading = sensorsReading.heading[1] - sensorsReading.heading[0];

#ifdef _DEBUG_
  Serial.print("Delta_pitch :");
  Serial.print(dPitch);
  Serial.print("Delta_roll :");
  Serial.println(dRoll);
#endif

  // Check for delta ranges. Get the biggest delta between roll and pitch
  if( (abs(dRoll) >= DELTA_ROLL) ) { // &&  (abs(dRoll) > abs(dPitch)) ){
    // Decide the roll direction for left/right
    if(dRoll > 0)
      motionDirection.right = true;
    else
      motionDirection.left = true;
    motionDetected = true;
  }
  else {
    if(abs(dPitch) >= DELTA_PITCH) {
        // Decide the ptich direction for up/down
      if(dPitch > 0)
        motionDirection.down = true;
      else
        motionDirection.up = true;
      motionDetected = true;
    }
  }

  return motionDetected;
}

/**
Create the Json string and send it to the serial
*/
void sendJson(){
  Serial << J_OPEN << J_RIGHT << motionDirection.right << ", " << 
          J_LEFT << motionDirection.left << ", " << 
          J_UP << motionDirection.up << ", " << 
          J_DOWN << motionDirection.down <<
          J_CLOSE << endl;
}

/**
Read the analog value from the potentiometer and map it to the min/max
range of the fine tuning for the sensor readings.

\return The calibration value in milliseconds to add to the current ms frequency
value.
*/
unsigned long getCalibration() {
  /** Potentiometer analog reading */
  int potCalibration;
  /** frequency calibration value */
  int freqCalibration;

  // read the calibration pin
  potCalibration = analogRead(pinCalibration);
  // Map the reading value
  freqCalibration = map(potCalibration, POT_MIN, POT_MAX, 1, (MAX_POLL_FREQ - POLL_FREQ));

  return freqCalibration;
}

// -------------------------------------------------------------
// BUTTON
// -------------------------------------------------------------

/**
Check the button status and change the RGB LED color, accordingly.

\note To avoid erratically readings the status of the digital pin is read
MAX_BUTTON_READS times and if the value is not stable the button is considered
in off state.

\return true if the button is pressed, else return false.
*/
bool checkButton() {
  /** Button status */
  bool isButton;
  /** digital pin readings accumulator */
  int buttonState;
  int j;

  buttonState = 0;
  for(j = 0; j < MAX_BUTTON_READS; j++) {
   if(digitalRead(pinButton) == HIGH) {
     buttonState++;
   }
  }

  if(buttonState == MAX_BUTTON_READS) {
    setColor(true, BLUE);
    isButton = true;
  } 
  else {
    setColor(true, RED);
    isButton = false;
  }

  return isButton;
}

// -------------------------------------------------------------
// LED COLOR
// -------------------------------------------------------------

/**
Set the predefined colors to the RGB LED. If the isOn is true, the RGB LED is
powered on else it is set to off.

\param isOn Flag to set the LED on or Off.
\param color The led color. Only if isOn is true, the setting has effect
*/
void setColor(bool isOn, ledColors color){
  /** Color structure with colors patterns */
  rgbLEDColors rgbColors;

    // Check if the flag is set, else disable the RGB LED
    if(isOn){
      switch(color) {
        case   RED:
        rgbColors.red = 0xff;
        rgbColors.green = 0x01;
        rgbColors.blue = 0x01;
        break;
        case GREEN:
        rgbColors.red = 0x00;
        rgbColors.green = 0xff;
        rgbColors.blue = 0x05;
        break;
        case BLUE:
        rgbColors.red = 0x01;
        rgbColors.green = 0x01;
        rgbColors.blue = 0xff;
        break;
        case OCRE:
        rgbColors.red = 0xa8;
        rgbColors.green = 0x7b;
        rgbColors.blue = 0x14;
        break;
        case LIGHTBLUE:
        rgbColors.red = 0x00;
        rgbColors.green = 0x08;
        rgbColors.blue = 0x14;
        break;
        default:
        rgbColors.red = 0xff;
        rgbColors.green = 0xff;
        rgbColors.blue = 0xff;
        break;
      }
      // Set the LED to color
      nicla::leds.setColor(rgbColors.red, rgbColors.green, rgbColors.blue);
    } else {
      // Disable the LED
      nicla::leds.setColor(off);
    }
}

/**
Flash the LED to start colors at initialization
*/
void flashLed() {
  setColor(true, RED);
  delay(250);
  setColor(true, GREEN);
  delay(250);
  setColor(true, OCRE);
  delay(250);
}

// -------------------------------------------------------------
// POTENTIOMETER CALIBRATION
// -------------------------------------------------------------

/**
Calibrate the potentiometer. When this function run the application features
are disabled.

\note This calibration function should be used to detect max and min values
of the potentiometer analog read to set the two 
*/
#ifdef _CALIBRATION_
void calibratePot(){
  int sensorValue = 0;
  
  // read the analog value:
  sensorValue = analogRead(pinCalibration);

  // print the results to the Serial Monitor:
  Serial.print("potentiometer = ");
  Serial.println(sensorValue);
}
#endif