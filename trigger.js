'use strict';

const redis = require('redis');

const redisClient = redis.createClient({ url: '//' + process.env.REDIS_ENDPOINT + ':6379' });

module.exports.trigger = async event => {

  const promise = new Promise((resolve, reject) => {

    event.Records.forEach(record => {

      if (record.eventName == 'INSERT' || record.eventName == 'MODIFY') {
        const ad = {
          id: record.dynamodb.NewImage.id.S || record.dynamodb.OldImage.id.S,
          name: record.dynamodb.NewImage.name.S,
          description: record.dynamodb.NewImage.description.S,
          price: record.dynamodb.NewImage.price.N
        };

        const json = JSON.stringify(ad);

        redisClient.hset('Ads', ad.id, json, redisClient.print);
      }
      else if (record.eventName == 'REMOVE') {
        redisClient.hdel('Ads', record.dynamodb.OldImage.id.S, "field", redisClient.print);
      }

    });

    resolve(`Successfully processed ${event.Records.length} records.`);

  });

  return promise;
};