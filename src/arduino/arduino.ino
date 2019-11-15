#define DATA_MAX_SIZE 32

/*
0: idle and ready
1: waiting for book id
2: searching or resetting, can't receive any other orders
*/
int state = 0;
char data[DATA_MAX_SIZE];

// handles messages sent by the server
void orderHandler () {
  if (!receiveData()) return;
  String cmd = String(data);
  // TODO: Write logic
  if (cmd == "hello") {
    Serial.println("Received hello!");
    sendResponse("hello back my dearest");
  } else {
    Serial.println("Unknown command");
  }
}

// Send a message to the server (e.g. status when a book is found)
void sendResponse (String msg) {
  Serial.println("NODE:" + msg);
}

// Receive messages from the server (e.g. requests to get a book)
bool receiveData () {
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

void setup () {
  Serial.begin(9600);
  Serial.println("Hello, world!");
}

void loop () {
  orderHandler();
  delay(100);
}
