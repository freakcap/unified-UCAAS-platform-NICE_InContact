var express = require('express');
var bodyParser  = require('body-parser');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/zoom', 307);
  // res.send(res.body);
});

router.post('/sendmessage',function(req, res, next){
  if(!req) {
    res.sendStatus(404);
  }
  if(req.body.platform == "zoom"){
    res.redirect('/zoom/sendmessage',307);
  }
  else if(req.body.platform == "teams"){
    res.redirect('/teams',307);
  }
  else{
    res.sendStatus(404);
  }
});

module.exports = router;
