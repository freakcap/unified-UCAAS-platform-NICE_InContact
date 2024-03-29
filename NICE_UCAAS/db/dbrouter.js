var express = require('express');
var bodyParser  = require('body-parser');
var router = express.Router();
require('dotenv/config')

var AWS = require("aws-sdk");

// using dynamodb local
let awsConfig = {
    "region": "us-west-2",
    "endpoint": "http://localhost:8000",
};
AWS.config.update(awsConfig);
var tableName = "AddressBook";

/* format of table item */
/****
    {
        "UserId": string,
        "first_name": string,
        "last_name": string,
        "zoom": {
            "email" : string,
        }
    }
*****/

/* GET home page. */
/* Retrieve */
router.get('/contacts', function(req, res, next) {
    let docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: tableName,
        FilterExpression: 'attribute_exists(#fn)',
        ExpressionAttributeNames: {
            "#fn": "first_name",
        },
    };
    docClient.scan(params, function(err, data) {
    if (err) {
        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
        res.send(data);
    }
    });

    // docClient.get(params, function(err, data) {
    //     if (err) {
    //         console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
    //     } else {
    //         console.log(" item:", JSON.stringify(data, null, 2));
    //     }
    // });
});

/*GET single*/
router.get('/get/:id',function(req,res, next){
    let docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName : tableName,
        Key: {
            "UserId" : req.params.id
        },
        Expression: 'attribute_exists(#fn)',
        ExpressionAttributeNames: {
            "#fn": "first_name",
        },
    }
    docClient.get(params, function(err, data){
        if(err){
            console.log("Unable to get item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("item found.");
            console.log("Item : ", JSON.stringify(data, null, 2));
            res.send(data);
        }
    })
});

/* Create */
router.post('/add',function(req, res, next){
    let docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: tableName,
        Item:{
            "UserId": req.body.userid,
            "first_name": req.body.firstname,
            "last_name": req.body.lastname,
            "zoom":{
                "email": req.body.zoom.email
            },
            "slack":{
                "email": req.body.slack.email
            }
        }
    };

    docClient.put(params, function(err, data) {
                    if (err) {
                        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                    } else {
                        console.log(" Item added");
                        res.status(200);
                        res.send("added",200);
                    }
                });
});

/* Update */
router.post('/update',function(req, res, next){
  
});

/* Delete */
router.post('/delete',function(req, res, next){
    let docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: tableName,
        Item:{
            "UserId": req.body.userid,
        }
    };
    docClient.put(params, function(err, data) {
        if (err) {
            console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log(" Item deleted");
            res.send("item deleted");
        }
    });
});

module.exports = router;
