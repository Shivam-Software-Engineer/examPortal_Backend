let express=require('express');
const { user } = require('./Admin/userDB');

let admin=express.Router();

admin.use('/maxiwisedatabase',user) //localhost:8000/admin/maxiwisedatabase

module.exports={admin};