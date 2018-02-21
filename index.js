const APP_PORT = process.env.PORT || 8080;

express = require('express');
const app = express();

app.use(express.static('static'))
app.use(function(req, res) {
    res.status(404);
    res.send('404 File not found.');
    res.end();
});

app.get('/', function(req, res) {
    res.redirect('/test.html');
});

app.listen(APP_PORT, function() {
    console.log('Server started at port ' + APP_PORT);
});