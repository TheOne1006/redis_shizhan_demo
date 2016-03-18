var request = require('request');

request.post({
  url: 'http://127.0.0.1:3000/',
  json:{'owner' : 'theone', 'type' : 'male', 'content': '内容123'}
});

request.get({
  url: 'http://127.0.0.1:3000/?user=thtone12138&type=male'
}, function (err, res, body) {
  console.log(body);
});
