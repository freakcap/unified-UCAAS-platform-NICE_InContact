var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Zoom endpoint');
});

router.post('/send',function(req, res, next){
  res.send("send endpoint");
});

module.exports = router;
