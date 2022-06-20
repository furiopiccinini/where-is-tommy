# @summary Tales for Makers - Where is Tommy? \n
# Project: parking meter remake\n

# The project is made with different tecnologies:

# ----- Nicla Sense ME board
#             |
#             |
#         Python script (this file)
#             |
#             |
#         Node.js server
#             |
#             |
#         React app

# At the root we have a Nicla Sense ME firmware to create the motion gestures sensor. Sensor data
# are integrated to the required range of values and converted in a JSON string.
# This JSON string is sent to the host via the USB-Serial interface and captured by HTTP
# the Node.js server.
# This script requires to install the pyserial and requests module. You can install it with pip using the following commands:
# python3 -m pip install pyserial
# python3 -m pip install requests

# NOTE: before running the script, be sure to get the port name for your board. You can run this command:
# ls /dev/cu.usb*
# Copy the name printed on the screen and replace the content of sPort variable.

# @author Furio Piccinini <furiopiccinini@gmail.com>
# Date Apr 2022
# @version 0.6
# @license: Apache

from re import X
import serial.tools.list_ports
import requests
import json

sPort = "/dev/cu.usbmodemED1DBDD72"  # On Mac - find this using >ls /dev/cu.usb*
print("\nSerial data for" + sPort + "\n")

serialData = serial.Serial(sPort, 115200)


def sendJsonData():
    url = "http://localhost:9000/api"
    headers = {"Content-Type": "application/json"}
    data = json.dumps(jsonData.decode("utf").rstrip("\r\n"))
    payloadRaw = data.lstrip('"').rstrip('"')
    payload = payloadRaw.replace("\\", "")
    response = requests.request("POST", url, headers=headers, data=payload)
    print(response.text)


while True:
    if serialData.inWaiting() > 0:
        jsonData = serialData.readline()
        # print(jsonData.decode("utf").rstrip("\n"))
        sendJsonData()
