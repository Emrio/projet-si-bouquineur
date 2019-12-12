#ifndef NODEIO_H
#define NODEIO_H

#include <Arduino.h>
#define DATA_MAX_SIZE 32

class NodeIO {
private:
  char data[DATA_MAX_SIZE];

public:
  NodeIO ();
  void sendData (String msg); // Send a message to the server (e.g. status when a book is found)
  bool fetchData (); // Receive messages from the server (e.g. requests to get a book)
  String getData ();
};

#endif /* NODEIO_H */
