const mongoose= require("mongoose");

const TeacherSchema =new mongoose.Schema({
    name:{type:String,require:true,unique:true},
    lastName:{type:String,require:true},
    StudentCourse:{type:[mongoose.Types.ObjectId],ref:"courseModelOnTeacher"},
    StudentNameOfCourse:{type:[mongoose.Types.ObjectId],ref:"StudentModelOnTeacher"},
    mobile:{type:String,require:true},
    email:{type:String},
    Active:{type:Boolean,default:false},
    isEmail:{type:Boolean,default:false},
    hashPass:{type:String,default:false},
    otpEmail:{type:Object ,default:{
        code:11111,
        expireIn:0
    }
} 
}); 


module.exports={
    TeacherModelOnTeacher:mongoose.model('TeacherModelOnTeacher',TeacherSchema)
}