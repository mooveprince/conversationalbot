var express = require ('express');
var log = require ('../utility/logger');

var router = express.Router ();

router.get ("/", function (req, res) {
    log.error ("Request Made for an Invalid Path");
    res.json ({'status': 'faliure', msg: 'Not a valid path - 404'});
    log.info ("Sending the error response");
});

module.exports = router;