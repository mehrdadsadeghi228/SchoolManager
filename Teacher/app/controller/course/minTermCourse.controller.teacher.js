const BaseController=require('../base.Controller');
const { StudentFinallyExamModelOnTeacher, CourseMinExamModelOnTeacher, courseModelOnTeacher } = require("../../model/course.model.Teacher");
const createHttpError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");

class CoursersControllerONTeacherClass extends BaseController{
    async getAllMinTermCourse(req,res,next){
        try {
            const requestAnswer = await CourseMinExamModelOnTeacher.find({});
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
    async getSpecialMinTermCourse(req,res,next){
        try {
            const {idCourse}=req.params;
            if(typeof idCourse!==String) createHttpError.NotAcceptable(' name must have value and be a string ');
            const requestName = this.checkCourseIdExit(idCourse)
            if(!requestName.idCourse){
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
    async createMinTermCourse(req,res,next){
        try {
            const {idCourse,finallyScore,StudentScore,ExamDate}=req.body;
            const exist=this.checkCourseIdExit(idCourse);
            if(exist){
                return res.status(HttpStatus.NOT_ACCEPTABLE).json({
                    message:"  this idCourse  exist before !. " 

                });  
            }
            
            const CreateCourse = await CourseMinExamModelOnTeacher.create({idCourse,finallyScore,StudentScore,ExamDate});
            
            return res.status(HttpStatus.ACCEPTED).json({
                message:"the Course Min Exam is create successfully .",
                data:CreateCourse
            });

        } catch (error) {
         next(error)   
        }
    }

    async checkCourseIdExit(idCourse){
        try {
            const answer = await CourseMinExamModelOnTeacher.findOne({idCourse:idCourse});
            
            return answer

        } catch (error) {
            next(error)
         }

    }
}

module.exports={
    CoursersControllerONTeacher:new CoursersControllerONTeacherClass()
}

