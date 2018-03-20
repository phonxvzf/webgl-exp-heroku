const APP_PORT = process.env.PORT || 8080;

express = require('express');
const app = express();
const body_parser = require('body-parser');

app.use(express.static('static'))
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());

app.get('/', function(req, res) {
    res.redirect('/test.html');
});

app.post('/debug', function(req, res) {
    console.log('someone posted: ');
    console.log(req.body);
});

app.use(function(req, res) {
    res.status(404);
    res.send('404 File not found.');
    res.end();
});

app.listen(APP_PORT, function() {
    console.log('Server started at port ' + APP_PORT);
});
