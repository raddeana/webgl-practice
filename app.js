var express = require('express');
var app = express();

app.use(express.static('pages'));
app.listen(3000);