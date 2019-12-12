#include <Arduino.h>
#include "NodeIO.hpp"

NodeIO::NodeIO () {}

void NodeIO::sendData (String msg) {
  Serial.println("NODE:" + msg);
}

bool NodeIO::fetchData () {
  static char endMarker = '\n';
  char receivedChar;
  int i = 0;
  memset(data, 32, sizeof(data));
  while(Serial.available() > 0) {
    receivedChar = Serial.read();
    if (receivedChar == endMarker) {
      data[i] = '\0';
      return true;
    }
    data[i] = receivedChar;
    i++;
    if (i >= DATA_MAX_SIZE) break;
  }
  memset(data, 32, sizeof(data));
  return false;
}

String NodeIO::getData () {
  return this->data;
}
