#ifndef M_SERVER_HPP_
#define M_SERVER_HPP_

#include <WiFi.h>
#include <HTTPClient.h>
#include "credentials.hpp"
#include "config.hpp"

class MServer
{
public:
  /**
   * @brief Construct a new MServer object
   */
  MServer();

  /**
   * @brief Construct a new MServer object
   * @param serverUrl The absolute URL of the server
   */
  MServer(String serverUrl);

  /**
   * @brief Connect to the server
   */
  void connect();

  /**
   * @brief Send data to the server
   * @param data The data to be sent to the server. It should be a stringified JSON data
   */
  void sendData(String data);

  /**
   * @brief Get the last time data was received by the server relative to the board's millis()
   * @return long The last time data was received by the server
   */
  long getLastDataLogTime();

  /**
   * @brief Set the server URL
   * @param serverUrl The absolute URL of the server
   */
  void setServerUrl(String serverUrl);

private:
  String serverUrl;
  long lastDataLogTime;  // last time data was received by the server
  HTTPClient http;
};

#endif  // M_SERVER_HPP_
