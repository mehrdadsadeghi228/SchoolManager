const { CourseRoute } = require('./Course/coures.router');

const route=require('express').Router();


route.use("course",CourseRoute)


module.exports={
    AllRoute:route
}