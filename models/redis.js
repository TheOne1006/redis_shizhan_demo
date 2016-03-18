var redis = require('redis');
var client = redis.createClient();

exports.throw = function (bottle, cb) {
  bottle.time = bottle.time || Date.now();
  console.log(bottle);

  // 随机生成id
  var bottleId  = Math.random().toString(16);
  var type = {male:5, female: 6};

  client.SELECT( type[bottle.type], function () {
    // 以 hash  类型
    client.HMSET( bottleId, bottle, function (err, result) {
      if(err) {
        return cb({code:0, msg:'过会再试试吧'});
      }
      // 过期时间1天
      client.EXPIRE(bottleId, 86400);
      // 成功
      cb({code:1, msg:result});
    })
  })
};


exports.pick = function (info, cb) {
  var type = {all: Math.round(Math.random()) ,male:5, female:6};
  info.type = info.type || 'all',

  // 根据请求类型获取不同数据库里的数据
  client.SELECT(type[info.type], function () {
    // 随机返回一个id
    client.RANDOMKEY(function (err, bottleId) {
      if(!bottleId) {
        return cb({code:0, msg:'什么也没有'});
      }

      client.HGETALL(bottleId, function (err, bottle) {
        if(err) {
          return cb({code:0, msg:'瓶子破了'});
        }

        cb({code:1, msg: bottle});
        client.DEL(bottleId);
      });

    });
  });
}
