const express = require('express');
const app = express();
const PORT = 3000;

//base route
app.get('/', (req, res)=>{
    res.send('Welcome to the Home Page');
});

app.listen(PORT, ()=>console.log('server running at http://localhost:' + PORT));
