const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const sendSMS = require('./sendSMS');

// Load environment variables
dotenv.config({ path: './config.env' });
const smsServer = () => {
  const app = express();

  // Handling uncaught exceptions
  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.name, err.message);
    console.error('Shutting down due to uncaught exception...');
    process.exit(1);
  });

  // Middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Serve static files from the 'client' directory
  app.use(express.static('client'));

  // Enable CORS if frontend and backend are on different ports
  const cors = require('cors');
  app.use(cors());

  // WaterData model
  const WaterData = mongoose.model('WaterData', new mongoose.Schema({
    capacity: Number,
    volume: Number,
    depth: Number,
    createdAt: { type: Date, default: Date.now }
  }));

  // Routes
  app.post('/data', async (req, res) => {
    const { capacity, volume, depth } = req.body;

    try {
      const waterData = new WaterData({ capacity, volume, depth });
      await waterData.save();
      console.log('Data saved to database:', waterData);

      let message;
      if (depth >= 25) {
        message = "The water level is high, just know that you will die soon if you stay there";
      } else if (depth >= 15 && depth <= 22) {
        message = "Water levels are moderate but soon you will need to start moving";
      } else {
        message = "Water levels are low";
      }
      sendSMS(message);

      res.status(200).json({
        status: 'success',
        message: 'Water level data received and saved',
        data: waterData
      });
    } catch (error) {
      console.error('Error saving data to database:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to save data',
        error: error.message
      });
    }
  });

  app.get('/water-data', async (req, res) => {
    try {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const waterData = await WaterData.find({ createdAt: { $gte: oneHourAgo } }).sort('createdAt');
      res.status(200).json({
        status: 'success',
        data: waterData
      });
    } catch (error) {
      console.error('Error fetching data from database:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch data',
        error: error.message
      });
    }
  });

  app.post('/incoming-messages', (req, res) => {
    const data = req.body;
    console.log(`Received message: \n ${JSON.stringify(data, null, 2)}`);
    res.sendStatus(200);
  });

  app.post('/delivery-reports', (req, res) => {
    const data = req.body;
    console.log(`Received report: \n ${JSON.stringify(data, null, 2)}`);
    res.sendStatus(200);
  });
  // Catch-all route for handling undefined routes
  app.all('*', (req, res, next) => {
    res.status(404).json({
      status: 'error',
      message: `Can't find ${req.originalUrl} on the server!`
    });
  });

  // Connect to MongoDB and start the server
  mongoose.connect(process.env.CONN_STR, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log('Connected to MongoDB');

      const PORT = process.env.PORT || 5000;
      const host = '0.0.0.0';
      const server = app.listen(PORT, host, () => {
        console.log(`App running on: http://${host}:${PORT}`);
      });

      // Handling unhandled rejections
      process.on('unhandledRejection', (err) => {
        console.error('Unhandled Rejection:', err.name, err.message);
        console.error('Shutting down due to unhandled rejection...');
        server.close(() => {
          process.exit(1);
        });
      });
    })
    .catch((err) => {
      console.error('Failed to connect to MongoDB:', err);
    });

  // Handling SIGTERM signal for graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      console.log('Process terminated!');
    });
  });
}