##
# Import statements
import json, random, sys

##
# Create a random numer in the 0-100 range
r1 = random.randint(0, 100)

##
# Print the data in stringified json format
newdata = {'value': r1}
print(json.dumps(newdata))
sys.exit()