
'use strict';

const aws = require('aws-sdk');

const dynamoDbClient = new aws.DynamoDB.DocumentClient();

module.exports.getById = async event => {

  var params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      'id': event.pathParameters.id
    }
  };

  return new Promise((resolve, reject) => {
    
    dynamoDbClient.get(params, function (err, data) {
      
      if (err) {
        console.log(err);
        reject(err);
      }
      else {

        if (data.Item) {
          const response = {
            statusCode: 200,
            body: JSON.stringify(data.Item)
          };

          resolve(response);
        }
        else {
          const response = {
            statusCode: 404,
            body: null
          };

          resolve(response);
        }
      }
      
    });

  });
};