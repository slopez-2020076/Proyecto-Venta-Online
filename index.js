'use strict'

const mongoConfig = require('./config/mongoConfig');
const app = require('./config/app');
const port = 3200;

mongoConfig.init();
app.listen(port, ()=>{
    console.log(`Server http run in port ${port}`);
});