const BaseController = require('./base.Controller');
const { StudentFinallyExamModelOnTeacher, CourseMinExamModelOnTeacher, courseModelOnTeacher } = require("../model/course.model.Teacher");
const createHttpError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const { StudentModelOnTeacher } = require('../model/student.model.Teacher');
const studentModelTeacher = require('../model/student.model.Teacher');
const initRedis = require('../utils/initRedis');
require('dotenv').config();

class StudentsControllerONTeacherClass extends BaseController {
    async getAllStudentsName(req, res, next) {
        try {
            const requestAnswer = await StudentModelOnTeacher.find({});
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
    async getSpecialStudentsNames(req, res, next) {
        try {
            const { name } = req.params;
            if (typeof name !== String) createHttpError.NotAcceptable(' name must have value and be a string ');
            const requestName = this.checkCourseExit(name)
            if (!requestName.name) {
                return res.status(HttpStatus.NOT_ACCEPTABLE).json({
                    message: " the student with this name dose not exist !."

                });
            }

            return res.status(HttpStatus.ACCEPTED).json({
                message: " the student with this name dose not exist !."

            });


        } catch (error) {
            next(error)
        }
    }

    async createStudent(req, res, next) {
        try {
            const { name, lastName, course,mobileParent,mobile,email} = req.body;
            const exist = this.checkCourseExit(name);
            if (exist) {
                return res.status(HttpStatus.NOT_ACCEPTABLE).json({
                    message: " this name exist before !. "
                    
                });
            }
            
            const CreateCourse = await StudentModelOnTeacher.create( { name, lastName, course,mobileParent,mobile,email});

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
    async checkStudentExit(name) {
        try {
            const answer = await StudentModelOnTeacher.findOne({ name: name });

            return answer

        } catch (error) {
            next(error)
        }

    }



}

module.exports = {
    StudentsControllerONTeacher: new StudentsControllerONTeacherClass()
}

