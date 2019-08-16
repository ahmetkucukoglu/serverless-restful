'use strict';

const aws = require('aws-sdk');

const dynamoDbClient = new aws.DynamoDB.DocumentClient();

module.exports.update = async event => {

  const json = JSON.parse(event.body);

  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      'id': event.pathParameters.id
    },
    UpdateExpression: 'set #namek = :namev, description = :description, price = :price',
    ConditionExpression: 'id = :id',
    ExpressionAttributeNames: {
      '#namek': 'name'
    },
    ExpressionAttributeValues: {
      ':id': event.pathParameters.id,
      ':namev': json.name,
      ':description': json.description,
      ':price': json.price
    }
  };

  return new Promise((resolve, reject) => {

    dynamoDbClient.update(params, function (err, data) {
      
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