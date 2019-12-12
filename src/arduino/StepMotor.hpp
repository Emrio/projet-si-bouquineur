#ifndef STEPMOTOR_H
#define STEPMOTOR_H

#include <Arduino.h>

class StepMotor {
private:
  const int A = 8, B = 11, C = 12, D = 13;
  int speed = 1;
  void cw ();
  void ccw ();

public:
  StepMotor ();
  void setSpeed (int _speed);
  void step (bool clockwise);
};

#endif /* STEPMOTOR_H */
