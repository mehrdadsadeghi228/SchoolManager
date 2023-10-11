
const Controller = require("../../base.Controller");
const { AdminModel } = require('../../models/admin.model');
const { newHashPass, codeERSali, compareHashPass } = require('../../utils/utils');
const { sendingEmailService } = require('../../utils/email');
const { StatusCodes: HttpStatus } = require("http-status-codes");
const { SignAccessToken, SignRefreshToken, VerifyRefreshToken } = require('../../middlewares/checkAuth');
const createHttpError = require('http-errors');
const { check, validationResult } = require('express-validator');
const { TeacherModelOnTeacher } = require('../../../model/techer.model.Teacher');


class TeacherAuthManager extends Controller {

    async addAdmin(req, res, next) {
        try {
            const errorValidator = validationResult(req);

            if (!errorValidator.isEmpty()) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    statusCodes: HttpStatus.INTERNAL_SERVER_ERROR,
                    validator_Message: errorValidator
                });
            }
            const { name,lastName, mobile, email } = req.body;
            const hashPass = newHashPass(password);

            const resultSearching = await TeacherModelOnTeacher.findOne({ name:name });
            if (resultSearching) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    statusCodes: HttpStatus.BAD_REQUEST,
                    message: "teacher name is used before "
                });
            }
            const resultAddingAdmin = await TeacherModelOnTeacher.create({ name,lastName, mobile, email,hashPass })
            sendingEmailService("merhrdadsadeghi769@gamil.com", "mehrdadsadeghi79@outlook.com", "Teacher was create with ", resultAddingAdmin);
            return res.status(HttpStatus.OK).json({
                statusCodes: HttpStatus.OK,
                user: "Teacher was Create " + resultAddingAdmin
            });

        } catch (error) {
            next(error)
        }
    }

    async SendsVerifyEmailAdmin(req, res, next) {
        try {
            const { name } = req.teacher;
            const resultSearching = this.checkSTeacherExit(name)
            if (!resultSearching) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    statusCodes: HttpStatus.BAD_REQUEST,
                    message: "user name is not exist "
                });
            }
            const code3 = codeERSali()
            await TeacherModelOnTeacher.findByIdAndUpdate({ _id: resultSearching._id }, {
                '$set': { 'otpEmail.code': code3 }
            });
            sendingEmailService("merhrdadsadeghi769@gamil.com", resultSearching.email, "code For verify email ", ` the code is ${code3}`);
            return res.status(HttpStatus.OK).json({
                statusCodes: HttpStatus.OK,
                message: `the code is ${code3} sends to emails `
            });

        } catch (error) {
            next(error)
        }
    }

    async getVerifyEmailCode(req, res, next) {
     try {
            const { name } = req.teacher;
            const { codeEmails } = req.body;
            const resultSearching = this.checkSTeacherExit(name)
            if (!resultSearching) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    statusCodes: HttpStatus.BAD_REQUEST,
                    where: location,
                    message: "teacher name is not exist "
                });
            }

            if (!codeEmails) { createHttpError.NotImplemented('code receive can Not br empty '); }
            if (resultSearching.otpEmail.code == codeEmails) {
                const resultCodeEmail = await TeacherModelOnTeacher.findByIdAndUpdate({ _id: resultSearching._id }, {
                    isEmail: true
                });
                return res.status(HttpStatus.NOT_ACCEPTABLE).json({
                    statusCodes: HttpStatus.NOT_ACCEPTABLE,
                    where: location,
                    message: " Email is Verify thanks " + resultCodeEmail._id
                });
            }
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                statusCodes: HttpStatus.INTERNAL_SERVER_ERROR,
                where: location,
                message: " there was a problem the code is not right or server in issus"
            });
     } catch (error) {
             next(error)
     }
    }
    async DeleteAdmin(req, res, next) {
        try {
            const { name } = req.Admin;
            const resultSearching = this.checkSTeacherExit(name)
            if (!resultSearching) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    statusCodes: HttpStatus.BAD_REQUEST,
                    message: "Teacher name is not exist "
                });
            }
            if(resultSearching.isEmail){
                const resultQueryForDelete = await TeacherModelOnTeacher.findOneAndUpdate({ userName }, { Active: false });
                return res.status(HttpStatus.OK).json({
                    statusCodes: HttpStatus.OK,
                    message: "Teacher was deleted . "
                });
            }
            
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                statusCodes: HttpStatus.INTERNAL_SERVER_ERROR,
                message: " there was a problem in your Auth OR not right or server in issus"
            });

        } catch (error) {
            next(error)
        }
    }

    async VerifyAdmin(req, res, next) {
        try {
            const {name } = req.Admin;
            const resultSearching = this.checkSTeacherExit(name)
            if (!resultSearching) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    statusCodes: HttpStatus.BAD_REQUEST,
                    where: location,
                    message: "Teacher name is not exist "
                });
            }
            if (!resultSearching.Active) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    statusCodes: HttpStatus.BAD_REQUEST,
                    where: location,
                    message: "Teacher name is delete before "
                });
            }

            if (resultSearching.isEmail) {
                   return res.status(HttpStatus.ACCEPTED).json({
                        statusCodes: HttpStatus.ACCEPTED,
                        message: "email And mobile Are Verify ."
                   });
                } else {
                    res.status(HttpStatus.BAD_REQUEST).json({
                        statusCodes: HttpStatus.BAD_REQUEST,
                        message: "email Or mobile is not verified ."
                    });
                }

            }

         catch (error) {
            next(error)
        }
    }

    async loginAdmin(req, res, next) {
        try {

            const { name,password} = req.body
            const resultSearching = this.checkSTeacherExit(name);
            if (!resultSearching) {
                return res.status(HttpStatus.NOT_ACCEPTABLE).json({
                    statusCodes: HttpStatus.NOT_ACCEPTABLE,
                    message: "teacher name is not exist "
                });
            }
            if (!resultSearching.Active) {
                return res.status(HttpStatus.NOT_ACCEPTABLE).json({
                    statusCodes: HttpStatus.NOT_ACCEPTABLE,
                    message: "teacher name is delete before "
                });
            }
            const HashingInput = newHashPass(password);
            if (resultSearching.hashPass === HashingInput) {
                const accessToken = await SignAccessToken(resultSearching._id)
                const refreshToken = await SignRefreshToken(resultSearching._id);
                return res.status(HttpStatus.OK).json({
                    statusCodes: HttpStatus.OK,
                    where: location,
                    Modified: resultSearching.isModified,
                    tokenAccess: accessToken,
                    RefreshToken: refreshToken,
                    Data: resultSearching._id + resultSearching.userName
                });
            }
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                statusCodes: HttpStatus.INTERNAL_SERVER_ERROR,
                where: location,
                Data: "login is not Success we have Issus:"
            });
        } catch (error) {
            next(error)
        }
    }
    async requestChangePasswordAdmin(req, res, next) {
        try {

            const code = codeERSali();
            const { name } = req.body;
            const updateUserCode = this.checkSTeacherExit(name)
            if (!updateUserCode.Active) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    statusCodes: HttpStatus.BAD_REQUEST,
                    message: " teacher name is delete before "
                });
            }
            const updateModel = TeacherModelOnTeacher.findOneAndUpdate({ name }, {
                '$set': { 'otpMobile.code': code }
            });
            res.status(HttpStatus.BAD_REQUEST).json({
                statusCodes: HttpStatus.BAD_REQUEST,
                message: `the code is ${code} for verify mobile`
            });


        } catch (error) {
            next(error)
        }
    }
    async changePasswordAdmin(req, res, next) {
        try {

            const { username, newPass, code } = req.body;
            const updateUserCode = this.checkSTeacherExit(name)
            if (!updateUserCode.Active) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    statusCodes: HttpStatus.BAD_REQUEST,
                    message: " teacher name is delete before "
                });
            }
            const temp = updateUserCode.otpMobile.code;
            if (temp) {
                const pass = newHashPass(newPass);
                console.log(pass);
                const updateAdmin = await AdminModel.findByIdAndUpdate({ _id: updateUserCode._id }, {
                    '$set': { password: pass }
                });
                const token = await SignRefreshToken(updateAdmin._id)
                return res.status(HttpStatus.ACCEPTED).json({
                    statusCodes: HttpStatus.ACCEPTED,
                    message: "pass changed ",
                    refreshToken: token
                });
            }
            else {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    statusCodes: HttpStatus.BAD_REQUEST,
                    message: "teacher name is not exist Or some thing have problem"
                });
            }

        } catch (error) {
            next(error)
        }
    }
    logOut(req, res, next) {
        try {
            var location = '/AdminManager/logOut';
            req.Admin.destroy()
            return res.status(HttpStatus.ACCEPTED).json({
                statusCodes: HttpStatus.ACCEPTED,
                message: " Your Are Logout "
            });
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
    TeacherAuthManager: new TeacherAuthManager
}