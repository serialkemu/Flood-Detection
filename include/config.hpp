#ifndef CONFIG_HPP_
#define CONFIG_HPP_

#define DEBUG 1
#define DEBUG_PRINT(x) do { if (DEBUG) Serial.print(x); } while (0)
#define DEBUG_PRINTLN(x) do { if (DEBUG) Serial.println(x); } while (0)

#define SERVER_SEND_INTERVAL 5000

// HC-SR04 ultrasonic sensor
#define TRIGGER_PIN 17
#define ECHO_PIN 16
#define MAX_DISTANCE 400

// Bucket dimensions
#define DAM_HEIGHT 30
#define DAM_RADIUS 16

#endif /* CONFIG_HPP_ */