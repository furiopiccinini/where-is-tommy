/**
\file ParkingMeter.h

\brief Constants and default values of the application

\author Enrico Miglino <enrico.miglino@gmail.com>
\date Apr 2022
\version 0.3
*/

/** 
Polling frequency to read the sensors. This is the base (minimum) reading frequency
to which is added the trimmer fine tuning reading value, never bigger than MAX_POLL_FREQ
*/
#define POLL_FREQ 20
/** Maximum polling requency (in millseconds) */
#define MAX_POLL_FREQ 250

/** Minimum analog value read from potentiometer (need calibration) */
#define POT_MIN 0
/** Maximum analog value read from potentiometer (need calibration) */
#define POT_MAX 1023
/** Value for pause in sampling, expressed as a delay, to avoid multiple readings */
#define samplePause 350
/**
Minimum delta value between two sequential readings to consider
the motion as a gesture. Delta reading is the absolute difference between two
sequential readings.
*/
#define DELTA_ROLL 5.00
/** 
Minimum delta value between two sequential readings to consider
the motion as a gesture. See the DELTA_ROLL note 
*/
#define DELTA_PITCH 5.00
/** 
Minimum delta value between two sequential readings to consider
the motion as a gesture. See the DELTA_ROLL note 
*/
#define DELTA_HEADING 5.00 // Not used

/** Number of sequential readings of the control button to check its stable status */
#define MAX_BUTTON_READS 10000

/** Json keyword */
#define J_RIGHT "\"right\": "
/** Json keyword */
#define J_LEFT  "\"left\": "
/** Json keyword */
#define J_UP  "\"up\": "
/** Json keyword */
#define J_DOWN  "\"down\": "
/** Json keyword */
#define J_OPEN "{"
/** Json keyword */
#define J_CLOSE "}"

enum ledColors {
  RED,
  GREEN,
  BLUE,
  OCRE,
  LIGHTBLUE
};

/**
 Defines all the parameters to manage the the sensors state and
 convert them dinamically to the corresponding motion sensor 
 directions.

 \note The direction state can be only a single value as evry gesture
if identified should correspond to a single action
*/
struct gestures {
  //! Direction current state
  bool right = false;
  //! Direction current state
  bool left = false;
  //! Direction current state
  bool up = false;
  //! Direction current state
  bool down = false;
};

/**
Last couple of reading values for the sensor parameters involved
in the gesture control (roll, pitch, heading).
*/
struct niclaSensors {
  float roll[2];
  float pitch[2];
  float heading[2];
};

/**
RGB LED color parameters
*/
struct rgbLEDColors {
  int red;
  int green;
  int blue;
};
