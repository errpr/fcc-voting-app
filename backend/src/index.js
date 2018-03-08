require('dotenv').config();
const express = require('express');

app = express();

app.get('/', (req, res) => {
    res.send("Hello");
});

const listener = app.listen(process.env.PORT, function () {
    console.log('Your app is listening on port ' + listener.address().port);
});