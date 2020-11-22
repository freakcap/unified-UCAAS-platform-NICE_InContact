var express = require('express');
var router = express.Router();
require('dotenv/config')
const request = require('request')

router.get('/', (req, res) => {

  if (req.query.code) {
      let url = 'https://zoom.us/oauth/token?grant_type=authorization_code&code=' + req.query.code + '&redirect_uri=' + process.env.redirectURL;

      request.post(url, (error, response, body) => {

          body = JSON.parse(body);
          console.log(`access_token: ${body.access_token}`);
          console.log(`refresh_token: ${body.refresh_token}`);

          if (body.access_token) {
              request.get('https://api.zoom.us/v2/users/me', (error, response, body) => {
                  if (error) {
                      console.log('API Response Error: ', error)
                  } else {
                      body = JSON.parse(body);
                      console.log('API call ', body);
                      var JSONResponse = '<pre><code>' + JSON.stringify(body, null, 2) + '</code></pre>'
                      res.send(`
                          <style>
                              @import url('https://fonts.googleapis.com/css?family=Open+Sans:400,600&display=swap');@import url('https://necolas.github.io/normalize.css/8.0.1/normalize.css');html {color: #232333;font-family: 'Open Sans', Helvetica, Arial, sans-serif;-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;}h2 {font-weight: 700;font-size: 24px;}h4 {font-weight: 600;font-size: 14px;}.container {margin: 24px auto;padding: 16px;max-width: 720px;}.info {display: flex;align-items: center;}.info>div>span, .info>div>p {font-weight: 400;font-size: 13px;color: #747487;line-height: 16px;}.info>div>span::before {content: "👋";}.info>div>h2 {padding: 8px 0 6px;margin: 0;}.info>div>p {padding: 0;margin: 0;}.info>img {background: #747487;height: 96px;width: 96px;border-radius: 31.68px;overflow: hidden;margin: 0 20px 0 0;}.response {margin: 32px 0;display: flex;flex-wrap: wrap;align-items: center;justify-content: space-between;}.response>a {text-decoration: none;color: #2D8CFF;font-size: 14px;}.response>pre {overflow-x: scroll;background: #f6f7f9;padding: 1.2em 1.4em;border-radius: 10.56px;width: 100%;box-sizing: border-box;}
                          </style>
                          <div class="container">
                              <div class="info">
                                  <img src="${body.pic_url}" alt="User photo" />
                                  <div>
                                      <span>Hello World!</span>
                                      <h2>${body.first_name} ${body.last_name}</h2>
                                      <p>${body.role_name}, ${body.company}</p>
                                  </div>
                              </div>
                              <div class="response">
                                  <h4>JSON Response:</h4>
                                  <a href="https://marketplace.zoom.us/docs/api-reference/zoom-api/users/user" target="_blank">
                                      API Reference
                                  </a>
                                  ${JSONResponse}
                              </div>
                          </div>
                      `);
                  }
              }).auth(null, null, true, body.access_token);

          } else {
          }

      }).auth(process.env.clientID, process.env.clientSecret);

      return;

  }
  res.redirect('https://zoom.us/oauth/authorize?response_type=code&client_id=' + process.env.clientID + '&redirect_uri=' + process.env.redirectURL)
})

module.exports = router;
