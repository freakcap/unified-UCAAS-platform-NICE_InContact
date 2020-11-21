var express = require('express');
var bodyParser  = require('body-parser');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/',function(req, res, next){
  if(!req) {
    res.sendStatus(404);
  }
  if(req.body.platform == "zoom"){
    res.redirect('/zoom/send',307);
  }
  else if(req.body.platform == "teams"){
    res.redirect('/teams',307);
  }
  else{
    res.sendStatus(404);
  }
});

module.exports = router;
