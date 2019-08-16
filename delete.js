'use strict';

const aws = require('aws-sdk');

const dynamoDbClient = new aws.DynamoDB.DocumentClient();

module.exports.delete = async event => {

  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      'id': event.pathParameters.id
    },
    ConditionExpression: 'id = :id',
    ExpressionAttributeValues: {
      ':id': event.pathParameters.id
    }
  };

  return new Promise((resolve, reject) => {
   
    dynamoDbClient.delete(params, function (err, data) {
     
      if (err) {
        console.log(err);

        if (err.code == 'ConditionalCheckFailedException') {
          const response = {
            statusCode: 404
          };

          resolve(response);
        }
        else {
          reject(err);
        }
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