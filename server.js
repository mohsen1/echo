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
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods',
    'GET,PUT,POST,DELETE,HEAD,OPTIONS,TRACE,CONNECT');
  next();
});

function echo(req, res) {
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  res.set({'Content-Type': 'text/plain'});
  var items = [
    req.method.toUpperCase(),
    fullUrl,
    'Headers:',
    JSON.stringify(req.headers, null, 4)
  ];
  if (req.body) {
    items.push('Body:');
    items.push(req.body);
  }
  res.send(items.join('\n\n'));
}

// Echo all RFC 2616 verbs
app.get('*', echo);
app.post('*', echo);
app.put('*', echo);
app.head('*', echo);
app.delete('*', echo);
app.options('*', echo);
app.trace('*', echo);
app.connect('*', echo);
app.head('*', echo);

app.listen(port, console.log);