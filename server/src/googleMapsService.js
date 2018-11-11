const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_MAPS_API_KEY
});


const getDirections = (config) => {
  const { origin, destination } = config;
  return new Promise(async (resolve, reject) => {
    googleMapsClient.directions({
      origin,
      destination,
      mode: 'transit'
    }, (err, response) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

module.exports = {
  getDirections
}