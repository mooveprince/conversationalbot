var bunyan = require ("bunyan");
var logger = bunyan.createLogger ({
    name : "AppName",
    serializers: {
      req: bunyan.stdSerializers.req,
      res: bunyan.stdSerializers.res,
      err: bunyan.stdSerializers.err
    }
});

module.exports = logger;