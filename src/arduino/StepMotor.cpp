#include <Arduino.h>
#include "StepMotor.hpp"

StepMotor::StepMotor () {}

void StepMotor::setSpeed (int _speed) {
  speed = _speed;
}

void StepMotor::step (bool clockwise = false) {
  digitalWrite(9, HIGH);
  digitalWrite(10, HIGH);
  if (clockwise) {
    this->cw();
  } else {
    this->ccw();
  }
  digitalWrite(9, LOW);
  digitalWrite(10, LOW);
}

void StepMotor::ccw () {
  digitalWrite(A, HIGH);
  digitalWrite(B, HIGH);
  digitalWrite(C, LOW);
  digitalWrite(D, LOW);
  delay(speed);

  digitalWrite(A, LOW);
  digitalWrite(B, HIGH);
  digitalWrite(C, HIGH);
  digitalWrite(D, LOW);
  delay(speed);

  digitalWrite(A, LOW);
  digitalWrite(B, LOW);
  digitalWrite(C, HIGH);
  digitalWrite(D, HIGH);
  delay(speed);

  digitalWrite(A, HIGH);
  digitalWrite(B, LOW);
  digitalWrite(C, LOW);
  digitalWrite(D, HIGH);
  delay(speed);
}

void StepMotor::cw () {
  digitalWrite(A, HIGH);
  digitalWrite(B, LOW);
  digitalWrite(C, LOW);
  digitalWrite(D, HIGH);
  delay(speed);

  digitalWrite(A, LOW);
  digitalWrite(B, LOW);
  digitalWrite(C, HIGH);
  digitalWrite(D, HIGH);
  delay(speed);

  digitalWrite(A, LOW);
  digitalWrite(B, HIGH);
  digitalWrite(C, HIGH);
  digitalWrite(D, LOW);
  delay(speed);

  digitalWrite(A, HIGH);
  digitalWrite(B, HIGH);
  digitalWrite(C, LOW);
  digitalWrite(D, LOW);
  delay(speed);
}
