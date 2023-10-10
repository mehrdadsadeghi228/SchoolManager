const {CoursersControllerONTeacher} = require('../../controller/coursers.controller.teacher');

const route=require('express').Router();


route.get("getAllCourse",CoursersControllerONTeacher.getAllCourse);
route.get("getSpecialCourse",CoursersControllerONTeacher.getSpecialCourse);

route.post("CreateCourse",CoursersControllerONTeacher.createCourse);


module.exports={
    CourseRoute:route
}