var express = require("express");
var axios = require("axios");
var router = express.Router();
require("dotenv/config");
const request = require("request");
var authcode = null;
// url: "https://slack.com/api/oauth.v2.access?code=" + req.headers.authcode + "&client_id=" + process.env.slackClientID + "&client_secret=" +  process.env.slackClientSecret,

router.get("/auth", (req, res, next) => {
 var ac = req.headers.authcode;
  var options = {
    method: "POST",
    url: "https://slack.com/api/oauth.access?code=" + req.headers.authcode + "&client_id=" + process.env.slackClientID + "&client_secret=" +  process.env.slackClientSecret,
  };
  //   console.log(authcode);
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

module.exports = router;
