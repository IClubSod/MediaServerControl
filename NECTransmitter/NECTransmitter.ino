#include <IRremote.h>

IRsend irsend;
char command[9];

void setup()
{
  Serial.begin(9600);
  command[8] = 0;
}

unsigned long dataForCommand(char command[8])
{
  unsigned long data = 0x00000000;
  data = strtoul(command, NULL, 16);
  return data;
}

void serialEvent()
{
  // Read bytes until we receive a newline or there is no data available
  while(Serial.available())
  {
    char inputByte = (char)Serial.read();
    if (inputByte == '\n')
      break;
  }
  
  // Now read an 8 byte command code
  if (8 == Serial.readBytes(command, 8))
  {
    unsigned long commandData = dataForCommand(command);
    if (commandData != 0)
    {
      Serial.print("Received command: 0x");
      Serial.println(commandData, HEX);
      irsend.sendNEC(commandData, 32);
    }
  }
}

void loop()
{
}
