var express = require('express');
var axios = require("axios");
var router = express.Router();
require('dotenv/config')
const request = require('request')
var authcode = null;

router.get('/auth', (req, res, next) => {
    const encodedCredentials = Buffer.from(`${process.env.clientID}:${process.env.clientSecret}`).toString('base64');
    // console.log(req.headers.authdata);
    var tokenUrl = "https://zoom.us/oauth/token?grant_type=authorization_code&code=" + req.headers.authdata + "&redirect_uri=" + process.env.redirectURL + "/zoom_oauth_callback";
    axios.post(tokenUrl,
    {},
    {
        headers:{
        'Authorization' : "Basic " + encodedCredentials
        }
    }
    )
    .then((response) => {res.send(response.data)})
    .catch((error)=>{console.log(error)});
});

router.get('/user', (req, res, next) => {

    var options = {
        method: 'GET',
        url: 'https://api.zoom.us/v2/users/me',
        headers: {authorization:"Bearer "+ req.headers.atoken}
      };
      console.log(req.headers.atoken);
        request(options, (error, response, body) => {
            if (error) {
                console.log('API Response Error: ', error)
            } else {
                body = JSON.parse(body);
                console.log('API call ', body);
                res.send(body);
            }
        })
  });
  

router.get('/contacts', (req, res, next) => {
  var options = {
      method: 'GET',
      url: 'https://api.zoom.us/v2/chat/users/me/contacts',
      qs: {page_size: '10', type: 'external'},
      headers: {authorization:"Bearer "+ req.headers.atoken}
    };
      request(options, (error, response, body) => {
          if (error) {
              console.log('API Response Error: ', error)
          } else {
              body = JSON.parse(body);
              console.log('API call ', body);
              var JSONResponse = '<pre><code>' + JSON.stringify(body, null, 2) + '</code></pre>'
              res.send(body);
          }
      })
});

router.post('/send',function(req, res, next){
  res.send("send endpoint");
});

router.get('/messages', (req, res, next) => {
  //Enter Access Token
    console.log(req.headers.dt);
  var options = {
      method: 'GET',
      url: 'https://api.zoom.us/v2/chat/users/'+req.headers.id+'/messages?page_size=10',
      qs: {page_size: '30', to_contact: req.headers.to, date: req.headers.dt},
      headers: {authorization:"Bearer "+ req.headers.atoken}
    };
      request(options, (error, response, body) => {
          if (error) {
              console.log('API Response Error: ', error)
          } else {
              body = JSON.parse(body);
              console.log('API call ', body);
              res.send(body);
          }
      })
});
router.get('/test',(req,res,next)=>{
  res.send("hiii");
});

router.post('/sendmessage', (req, res, next) => {
  //Enter Access Token
  console.log(req.body.message);
  console.log("To",req.body.to);
  var options = {
      method: 'POST',
      url: 'https://api.zoom.us/v2/chat/users/'+req.headers.id+'/messages',//Enter UserID
      headers: {'content-type': 'application/json', authorization: "Bearer "+ req.headers.atoken},
      body: {message: req.body.message, to_contact: req.body.to },
      json: true
    };
      request(options, (error, response, body) => {
          if (error) {
              console.log('API Response Error: ', error)
          } else {
              console.log("body: ",body);
              res.send(body);
          }
      })
});


module.exports = router;