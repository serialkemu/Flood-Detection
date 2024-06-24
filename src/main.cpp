#include <Arduino.h>
#include <WiFi.h>
#include <NewPing.h>
#include <ArduinoJson.h>
#include "credentials.hpp"
#include "config.hpp"
#include "mserver.hpp"
#include "utils.hpp"

MServer server(SERVER_URL);
NewPing sonar(TRIGGER_PIN, ECHO_PIN, MAX_DISTANCE);

double damCapacity;

void setup()
{
  if (DEBUG)
  {
    Serial.begin(115200);
  }
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  DEBUG_PRINT("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED)
  {
    DEBUG_PRINT(".");
    delay(100);
  }
  DEBUG_PRINTLN("");
  DEBUG_PRINTLN("Connected to the WiFi network");
  DEBUG_PRINT("IP Address: ");
  DEBUG_PRINTLN(WiFi.localIP());

  damCapacity = calculateCapacity(DAM_HEIGHT);
}

void loop()
{
  long depth = DAM_HEIGHT - sonar.ping_cm();
  double newVolume = calculateCapacity(depth);

  DEBUG_PRINT("Depth: ");
  DEBUG_PRINTLN(depth);
  delay(500);

  if (millis() - server.getLastDataLogTime() > SERVER_SEND_INTERVAL)
  {
    JsonDocument doc;
    doc["capacity"] = damCapacity;
    doc["volume"] = newVolume;
    doc["depth"] = depth;
    String data;
    serializeJson(doc, data);
    DEBUG_PRINT("Data: ");
    DEBUG_PRINTLN(data);

    server.sendData(data);
    DEBUG_PRINT("Last data log time: ");
    DEBUG_PRINTLN(server.getLastDataLogTime());
  }
}
