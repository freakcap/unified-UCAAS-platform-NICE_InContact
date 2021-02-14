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
        }
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
            }
        }
    };

    // // check whether contact already present

    // var getParams = {
    //     TableName : tableName,
    //     Key: {
    //         "UserId" : req.body.userid
    //     }
    // }
    // var getResult;
    // docClient.get(getParams, function(err, data){
    //     if(err){
    //         console.log(JSON.stringify(err,null,2));
    //         docClient.put(params, function(err, data) {
    //             if (err) {
    //                 console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
    //             } else {
    //                 console.log(" Item added");
    //                 res.send("item added");
    //             }
    //         });
    //     } else {
    //         console.log("item found.");
    //         console.log("Item : ", JSON.stringify(data, null, 2));
    //         console.log((data.hasOwnProperty('first_name')));
    //         if(data.get('Item').hasOwnProperty('first_name')){
    //             res.send("Userid already exists");
    //         }
    //         else{
    //             docClient.put(params, function(err, data) {
    //                 if (err) {
    //                     console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
    //                 } else {
    //                     console.log();
    //                     console.log(" Item added");
    //                     res.send("item added");
    //                 }
    //             });
    //         }
    //     }
    // })

    docClient.put(params, function(err, data) {
                    if (err) {
                        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                    } else {
                        console.log(" Item added");
                        res.send("item added");
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
