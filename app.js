const express = require('express');
const app = express();
const body = require('body-parser');
const routes = require('./routes/user');
app.use(express.static(__dirname))
app.use(routes)

const bodyparse = body.urlencoded({extended:false})
app.use(bodyparse)
const bookstoreRoutes = require('./controller/bookcontroll');
app.use('/api', bookstoreRoutes);

app.listen(8000,()=>{
    console.log("File Running and port running 8000");
})