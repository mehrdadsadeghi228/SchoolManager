const BaseController=require('./base.Controller');
const { StudentFinallyExamModelOnTeacher, CourseMinExamModelOnTeacher, courseModelOnTeacher } = require("../model/course.model.Teacher");
const createHttpError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");

class CoursersControllerONTeacherClass extends BaseController{
    async getAllCourse(req,res,next){
        try {
            const requestAnswer = await courseModelOnTeacher.find({});
            if(!requestAnswer){
               return res.status(HttpStatus.NOT_ACCEPTABLE).json({
                    message:" the Course is Empty " 
                });

            }
            return res.status(HttpStatus.ACCEPTED).json({
                message:requestAnswer
            })
        } catch (error) {
         next(error)   
        }
    }
    async getSpecialCourse(req,res,next){
        try {
            const {name}=req.params;
            if(typeof name!==String) createHttpError.NotAcceptable(' name must have value and be a string ');
            const requestName = this.checkCourseExit(name)
            if(!requestName.name){
                return res.status(HttpStatus.NOT_ACCEPTABLE).json({
                    message:" the Course with this name dose not exist !." 

                });
            }
            
            return res.status(HttpStatus.ACCEPTED).json({
                message:" the Course with this name dose not exist !." 

            });

    
        } catch (error) {
         next(error)   
        }
    }
    async createCourse(req,res,next){
        try {
            const {name,measure}=req.body;
            const exist=this.checkCourseExit(name);
            if(exist){
                return res.status(HttpStatus.NOT_ACCEPTABLE).json({
                    message:"  this name  exist before !. " 

                });  
            }
            
            const CreateCourse= await courseModelOnTeacher.create({name,measure});
            
            return res.status(HttpStatus.ACCEPTED).json({
                message:"the course is create successfully .",
                data:CreateCourse
            });

        } catch (error) {
         next(error)   
        }
    }

    async checkCourseExit(name){
        try {
            const answer = await courseModelOnTeacher.findOne({name:name});
            
            return answer

        } catch (error) {
            next(error)
        }

    }
}

module.exports={
    CoursersControllerONTeacher:new CoursersControllerONTeacherClass()
}

