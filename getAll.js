'use strict';

const redis = require('redis');

const redisClient = redis.createClient({ url: '//' + process.env.REDIS_ENDPOINT + ':6379' });

module.exports.getAll = async event => {

  const promise = new Promise((resolve, reject) => {
   
    redisClient.hgetall('Ads', function (err, data) {
      
      if (err) {
        console.log(err);
        reject(err);
      }
      else {
        var ads = [];

        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            const element = data[key];

            ads.push(JSON.parse(element));
          }
        }

        const response = {
          statusCode: 200,
          body: JSON.stringify(ads)
        };

        resolve(response);
      }

    });
    
  });

  return promise;
};