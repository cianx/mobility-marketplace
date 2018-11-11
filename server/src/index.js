require('dotenv').load();
const express = require('express')
const app = express()
const port = 3000

const { getDirections } = require('./googleMapsService');

const mockData = {
  bids: [
    {
      fare: 1125,
      legs: [
        {
          provider: 'Scooter',
          ticketId: 'c175a637-e033-48fa-bda6-205be1744a96',
          fare: 350,          
          "start_address": "598 Nimitz Dr Broadmoor, CA 94015",
          "start_location": {
            "lat": 37.6932066,
            "lng": -122.4824939
          },
          "end_address": "Colma Station",
          "end_location": {
            "lat": 37.6846223,
            "lng": -122.4684417
          },
        },
        {
          provider: 'BART',
          ticketId: '9000b219-e793-4218-998b-159045d44787',
          fare: 225,
          "start_address": "Colma Station",
          "start_location": {
            "lat": 37.6846223,
            "lng": -122.4684417
          },
          "end_address": "Embarcadero",
          "end_location": {
            "lat": 37.7947087,
            "lng": -122.4144961
          },
        },
        {
          provider: 'Uber',
          ticketId: 'cba3eccd-6a76-44d5-adbd-437e541eabc1'
          fare: 550,
          "start_address": "Embarcadero",
          "start_location": {
            "lat": 37.7947087,
            "lng": -122.4144961
          },
          "end_address": "Fisherman's Wharf",
          "end_location": {
            "lat": 37.8081269,
            "lng": -122.4253858
          },
        }
      ]
    },
    {
      fare: 2050,
      legs: [
        {
          type: 'Uber',
          fare: 2050,
          "start_address": "598 Nimitz Dr Broadmoor, CA 94015",
          "start_location": {
            "lat": 37.6932066,
            "lng": -122.4824939
          },
          "end_address": "Fisherman's Wharf",
          "end_location": {
            "lat": 37.8081269,
            "lng": -122.4253858
          },
        }
      ]
    }    
  ]
};

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/transitMock', async (req, res) => {
  res.json(mockData);
});

app.get('/transit', async (req, res) => {
  const { from, to } = req.query;
  try {
    const result = await getDirections({
      origin: from,
      destination: to
    });    
    res.json(result.json);  
  } catch (err) {
    console.error('error:', err);
  }
});

app.listen(port, () => console.log(`Server listening on port ${port}!`))