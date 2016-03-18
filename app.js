var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var redis = require('./models/redis.js');

var app = express();

app.set('port', process.env.PORT || 3000);

// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * 扔一个漂流瓶
 * --------------------
 * POST owner=xxx&type=xxx&content=xxx
 */
 app.post('/', function (req, res, next) {
   console.log(req.body);
   if(!(req.body.owner && req.body.type && req.body.content)) {
     if(!req.query.type && (['male','female'].indexOf(req.query.type) === -1)) {
       res.json({code:0, msg: '类型错误'});
       return res.end();
     }
     res.json({code:0, msg:'信息不完整'});
     return res.end();
   }

   redis.throw(req.body, function (result) {
     res.json(result);
   });
 });

 app.get('/', function (req, res, next) {
   console.log(req.query);
   if(!req.query.user) {
     res.json({code:0, msg:'信息不完整'});
     return res.end();
   }

   if(!req.query.type && (['male','female'].indexOf(req.query.type) === -1)) {
     res.json({code:0, msg: '类型错误'});
     return res.end();
   }

   redis.pick(req.query, function (result) {
     res.json(result);
     return res.end();
   });
 });

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
