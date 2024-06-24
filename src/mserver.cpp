#include "mserver.hpp"

MServer::MServer()
{
  this->lastDataLogTime = 0;
}

void MServer::connect()
{
}

MServer::MServer(String serverUrl)
{
  this->serverUrl = serverUrl;
  this->lastDataLogTime = 0;
}

void MServer::sendData(String data)
{
  if (WiFi.status() == WL_CONNECTED)
  {
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.POST(data);
    if (httpResponseCode > 0)
    {
      String response = http.getString();

      if (httpResponseCode == 200)
      {
        DEBUG_PRINT("Response: ");
        DEBUG_PRINTLN(response);
        lastDataLogTime = millis();
      }
      else
      {
        DEBUG_PRINT("Server response: ");
        DEBUG_PRINTLN(response);
      }
    }
    else
    {
      DEBUG_PRINT("Error code: ");
      DEBUG_PRINTLN(httpResponseCode);
    }
    http.end();
  }
}

long MServer::getLastDataLogTime()
{
  return lastDataLogTime;
}

void MServer::setServerUrl(String serverUrl)
{
  this->serverUrl = serverUrl;
}