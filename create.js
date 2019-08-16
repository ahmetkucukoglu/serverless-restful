
'use strict';

const aws = require('aws-sdk');
const uuidv1 = require('uuid/v1');

const dynamoDbClient = new aws.DynamoDB.DocumentClient();

module.exports.create = async event => {

  const json = JSON.parse(event.body);

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      id: uuidv1(),
      name: json.name,
      description: json.description,
      price: json.price
    }
  };

  return new Promise((resolve, reject) => {
    
    dynamoDbClient.put(params, function (err, data) {
     
      if (err) {
        console.log(err);
        reject(err);
      }
      else {
        const response = {
          statusCode: 200,
          body: null
        };

        resolve(response);
      }

    });

  });
};