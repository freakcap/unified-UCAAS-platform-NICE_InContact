var express = require("express");
var axios = require("axios");
var router = express.Router();
require("dotenv/config");
const request = require("request");
var authcode = null;
// url: "https://slack.com/api/oauth.v2.access?code=" + req.headers.authcode + "&client_id=" + process.env.slackClientID + "&client_secret=" +  process.env.slackClientSecret,


/* Authentication */
router.get("/auth", (req, res, next) => {
  var ac = req.headers.authcode;
   var options = {
     method: "POST",
     url: "https://slack.com/api/oauth.access?code=" + req.headers.authcode + "&client_id=" + process.env.slackClientID + "&client_secret=" +  process.env.slackClientSecret,
   };
     console.log(authcode);
   request(options, (error, response, body) => {
     if (error) {
       console.log("API Response Error: ", error);
     } else {
     //   body = JSON.parse(body);
       console.log("API call ", body);
       res.send(body);
     }
   });
 });
 
/* Get User by email */
router.get("/user", (req, res, next) => {
  var options = {
    method: "GET",
    url:
      "https://slack.com/api/users.lookupByEmail?email=" + req.headers.mailid,
    headers: { authorization: "Bearer " + req.headers.atoken },
  };
  request(options, (error, response, body) => {
    if (error) {
      console.log("API Response Error: ", error);
    } else {
      body = JSON.parse(body);
      console.log("User API call ", body);
      res.send(body);
    }
  });
});

/* Get details of logged in user */
router.get("/me", (req, res, next) => {
  console.log(req.headers.uid);
  var options = {
    method: "GET",
    url:
      "https://slack.com/api/users.info?user=" + req.headers.uid,
    headers: { authorization: "Bearer " + req.headers.atoken },
  };
  request(options, (error, response, body) => {
    if (error) {
      console.log("API Response Error: ", error);
    } else {
      body = JSON.parse(body);
      console.log("API call ", body);
      res.send(body);
    }
  });
});

/* Open a direct message channel with the target user */
router.get("/openconversation", (req, res, next) => {
  var options = {
    method: "POST",
    url: "https://slack.com/api/conversations.open",
    headers: {
      "content-type": "application/json",
      authorization: "Bearer " + req.headers.atoken,
    },
    body: { users: req.headers.userid },
    json: true,
  };
  request(options, (error, response, body) => {
    if (error) {
      console.log("API Response Error: ", error);
    } else {
      // body = JSON.parse(body);
      console.log("API call ", body);
      res.send(body);
    }
  });
});

/* Get Messages */
router.get("/messages", (req, res, next) => {
  var options = {
    method: "GET",
    url:
      "https://slack.com/api/conversations.history?channel=" +
      req.headers.cid,
    headers: { authorization: "Bearer " + req.headers.atoken },
  };
  request(options, (error, response, body) => {
    if (error) {
      console.log("API Response Error: ", error);
    } else {
      body = JSON.parse(body);
      console.log("API call ", body);
      res.send(body);
    }
  });
});

/* Send Message */
router.post("/sendmessage", (req, res, next) => {
  var options = {
    method: "POST",
    url: "https://slack.com/api/chat.postMessage",
    headers: {
      "content-type": "application/json",
      authorization: "Bearer " + req.headers.atoken,
    },
    body: { text: req.body.message, channel: req.body.to, as_user : "true" },
    json: true,
  };
  request(options, (error, response, body) => {
    if (error) {
      console.log("API Response Error: ", error);
    } else {
      console.log("body: ", body);
      res.send(body);
    }
  });
});

/* Get presence status */
router.get("/status", (req, res, next) => {
  console.log("Uid",req.headers.uidt);
  var options = {
    method: "GET",
    url:
      "https://slack.com/api/users.getPresence?user=" + req.headers.uid,
    headers: { authorization: "Bearer " + req.headers.atoken },
  };
  request(options, (error, response, body) => {
    if (error) {
      console.log("API Response Error: ", error);
    } else {
      body = JSON.parse(body);
      console.log("Status API call ", body);
      res.send(body);
    }
  });
});
module.exports = router;
