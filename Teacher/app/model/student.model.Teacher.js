const mongoose=require("mongoose");
const { StudentFinallyExamModelOnTeacher, CourseMinExamModelOnTeacher, courseModelOnTeacher } = require("./course.model.Teacher");

const StudentOnTeacherSchema =new  mongoose.Schema({
    name:{type:String,require:true},
    lastName:{type:String,require:true},
    course:{type:[courseModelOnTeacher] ,ref:"courseModelOnTeacher"},
    MinExam:{type:[CourseMinExamModelOnTeacher] ,ref:'CourseMinExamModelOnTeacher'},
    finalExam:{type:[StudentFinallyExamModelOnTeacher] ,ref:'StudentFinallyExamModelOnTeacher'},
    mobileParent:{type:Number,require:true},
    mobile:{type:String,require:true},
    email:{type:String},
    isEmail:{type:Boolean,default:false},
    isMobile:{type:Boolean,default:false},
    otpEmail:{
        type:Number,
        expire:1000
    }, 
    otpMobile:{
        type:Number,
        expire:1000
    }

},
{
    timestamps:true

});

module.exports={
    StudentModelOnTeacher:mongoose.model('StudentModelOnTeacher',StudentOnTeacherSchema)
}