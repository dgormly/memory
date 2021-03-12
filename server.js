const express = require('express');
const app = express();
var path = require('path');
const cors = require("cors")
app.use(cors());

// For parsing application/json 
app.use(express.json()); 

app.get('/upload', (req, res) => {
    res.send({success:true});
});


app.listen(3000, () => console.log('Gator app listening on port 3000!'));