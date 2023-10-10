const mongoose= require("mongoose");
const { courseModelOnTeacher } = require("./coures.model.Techer");
const { StudentModelOnTeacher } = require("./student.model.Teacher");

const TeacherSchema =new  mongoose.Schema({
    StudentCourse:{type:[mongoose.Types.ObjectId],ref:"courseModelOnTeacher"},
    StudentNameOfCourse:{type:[mongoose.Types.ObjectId],ref:"StudentModelOnTeacher"},
    mobileParent:{type:Number,require:true},
    mobile:{type:String,require:true},
    email:{type:String},
    isEmail:{type:Boolean,default:false},
    otpEmail:{
        type:Number,
        expire:1000
    }
}); 


module.exports={
    TeacherModelOnTeacher:mongoose.model('TeacherModelOnTeacher',TeacherSchema)
}