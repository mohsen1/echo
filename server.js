var app = require('express')();
var port = process.env.PORT || 3300;
var concat = require('concat-stream');

app.use(function(req, res, next) {
  req.pipe(concat(function(data){
    req.body = data;
    next();
  }));
});
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.post('*', function (req, res) {
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  res.set({'Content-Type': 'text/plain'});
  res.send([
    fullUrl,
    'Headers:',
    JSON.stringify(req.headers, null, 4),
    'Body:',
    req.body
  ].join('\n\n'));
});

app.get('*', function (req, res) {
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  res.set({'Content-Type': 'text/plain'});
  res.send([
    fullUrl,
    'Headers:',
    JSON.stringify(req.headers, null, 4)
  ].join('\n\n'));
});

app.listen(port, console.log);