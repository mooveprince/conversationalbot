var express = require('express');
var log = require ('../utility/logger');
var router = express.Router();

/* test url */
router.get('/test', function(req, res, next) {
  log.info ("Request for Test Resource");
  res.json ({'status': 'success', msg: 'You were able to get the response'});
  log.info ("Response sent for Test Resource")
});

module.exports = router;
