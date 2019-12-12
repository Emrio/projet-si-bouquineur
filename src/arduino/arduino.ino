#include "NodeIO.hpp"
#include "StepMotor.hpp"

StepMotor stepper;
NodeIO node;

/*
  0: idle and ready
  1: waiting for book id
  2: searching or resetting, can't receive any other orders
*/
int state = 0;

// handles messages sent by the server
void orderHandler () {
  if (!node.fetchData()) return;
  String cmd = String("hello");
  // TODO: Write logic
  if (cmd == "hello") {
    Serial.println("Received hello!");
    node.sendData("hello back my dearest");
  } else {
    Serial.println("Unknown command");
  }
}

void setup () {
  Serial.begin(9600);
  Serial.println("Hello, world!");
}

void loop () {
  orderHandler();
  delay(100);
}
