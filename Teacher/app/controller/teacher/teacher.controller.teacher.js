const BaseController = require('./base.Controller');
const createHttpError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const initRedis = require('../utils/initRedis');
const { TeacherModelOnTeacher } = require('../../model/techer.model.Teacher');
const { StudentModelOnTeacher } = require('../../model/student.model.Teacher');
require('dotenv').config();

class TeacherControllerONTeacherClass extends BaseController {
    async getAllTeachersName(req, res, next) {
        try {
            const requestAnswer = await TeacherModelOnTeacher.find({},{
                name:1,
                lastName:1
            });
            if (!requestAnswer) {
                return res.status(HttpStatus.NOT_ACCEPTABLE).json({
                    message: " the student is Empty "
                });
            }
            return res.status(HttpStatus.ACCEPTED).json({
                name: requestAnswer.name,
                lastName: requestAnswer.lastName
            });
        } catch (error) {
            next(error)
        }
    }
    async getSpecialTeachersNames(req, res, next) {
        try {
            const { name } = req.params;
            if (typeof name !== String) createHttpError.NotAcceptable(' name must have value and be a string ');
            const requestName = this.checkSTeacherExit(name)
            if (!requestName.name) {
                return res.status(HttpStatus.NOT_ACCEPTABLE).json({
                    message: " the Teacher with this name dose not exist !."

                });
            }

            return res.status(HttpStatus.ACCEPTED).json({
                message: " the Teacher with this name dose not exist !."

            });


        } catch (error) {
            next(error)
        }
    }

    async createTeacher(req, res, next) {
        try {
            const { name, lastName, course,mobile,email} = req.body;
            const exist = this.checkCourseExit(name);
            if (exist) {
                return res.status(HttpStatus.NOT_ACCEPTABLE).json({
                    message: " this name exist before !. "
                    
                });
            }
            
            const CreateCourse = await TeacherModelOnTeacher.create( { name, lastName, course,mobileParent,mobile,email});
            const tokenAccess =  CreatedJWT({id:CreateCourse._id,name:CreateCourse.name},process.env.KEYTOKEN);
            const RefreshToken = CreatedRefreshJWT({id:CreateCourse._id,name:CreateCourse.name},process.env.KEYREFRESH)
            const redisUser_mobile= `${CreateCourse.mobile}`;
            const redisUser_id= `${CreateCourse._id}`;

            const saveRefreshTokenOnRedis = initRedis.set(redisUser_mobile,RefreshToken);
            const saveAccessTokenOnRedis  = initRedis.set(redisUser_id,tokenAccess);

            return res.status(HttpStatus.ACCEPTED).json({
                message: "the student is create successfully .",
                data: CreateCourse,
                AccessToken:tokenAccess,
                RefreshToken:RefreshToken

            });

        } catch (error) {
            next(error)
        }
    }

    async addCourseForStudentAndTeacher(req,res,next){
        try {

            const { name , courseId,nameOfStudents} = req.body;
            const teacherId=req.teacher.id;
            const exist = await TeacherModelOnTeacher.findById(teacherId);
            const existStudents = await StudentModelOnTeacher.findOne({name:nameOfStudents});
            if (!exist && !existStudents) {
                return res.status(HttpStatus.NOT_ACCEPTABLE).json({
                    message: " this name exist before !. "
                    
                });
            }
            const t = existStudents.course;
                for (let index = 0; index < t.length; index++) {
                   if(courseId === t[index])
                  {
                    return res.status(HttpStatus.NOT_ACCEPTABLE).json({
                        message: " this course exist before for students !. "
                        
                    });
                  }  
                }
                const request = await StudentModelOnTeacher.findOneAndUpdate({name:nameOfStudents},{
                    '$push':{ course : courseId }
                });
            const t1 = exist.course;
                for (let index = 0; index < t1.length; index++) {
                   if(courseId === t1[index])
                  {
                    return res.status(HttpStatus.NOT_ACCEPTABLE).json({
                        message: " this course exist before for teacher !. "
                        
                    });
                  }  
                }

                const requestAdmin = await TeacherModelOnTeacher.findByIdAndUpdate({_id:teacherId},{
                    '$push':{ StudentCourse : courseId }
                });
                return res.status().json({
                    message:"add Course For Student And Teacher is successfully",
                    student:request,
                    teacher:requestAdmin
                })

        } catch (error) {
            next(error)
        }
    }
    async checkSTeacherExit(name) {
        try {
            const answer = await TeacherModelOnTeacher.findOne({ name: name });

            return answer

        } catch (error) {
            next(error)
        }

    }


}

module.exports = {
    TeacherControllerOnTeacher: new TeacherControllerONTeacherClass()
}

