let express=require('express');
const { getUserData } = require('../../Controllers/Admin Controllers/getUserDatabase');



let user=express.Router();

user.get('/users',getUserData) //localhost:8000/admin/maxiwisedatabase/users

module.exports={user};