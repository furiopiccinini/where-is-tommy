#!/bin/sh
#
# User interface autostart. This command is launched on boot and initializa
# the GUI showing the browser in kiosk mode.
# All the initializazion steps to make the browser view efficient, like 
# starting node-red should be exectued first.
#
# Author: Enrico Miglino <enrico.miglino@gmail.com>
# Version: 0.1.1
# Date: July 2021
# Lic. Gnu Lesser LGPL 3.0

# Start the browser with the node-red dashboard.
/usr/bin/chromium-browser \
--kiosk \
--noerrdialogs \
--disable-pinch \
http://pioutside.local:1880/ui/#!/0

