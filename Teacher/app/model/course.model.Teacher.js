const mongoose=require("mongoose");
const courseSchema = new mongoose.Schema({
    name:{
        type:String ,
        require:true,
        unique:true,
    },
    measure:{
        type:Number,
        default:1,
        min:1 , max:4
    }
}
,{
    timestamps:true
});

const finallyExamSchema = new mongoose.Schema({
    courseId:{
        type:mongoose.Types.ObjectId ,
        require:true,
        unique:true ,
    },
    finallyScore:{
        type:Number,
        min:0,
        max:100
    },
    minTermScore:{
        type:Number,
        min:0,
        max:100 
    },
    theNumberOfSessionsAbsentFromClass:{
        type:Number,
        default:0,
        min:0,
        max:16
    },
    finalExamDate:{
        type:Date
    }
});

const MinExamSchema =new mongoose.Schema({
    idCourse:{
        type:mongoose.Types.ObjectId ,
        require:true,
        unique:true,
    },
    finallyScore:{
        type:Number,
        min:0,
        max:100
    },
    StudentScore:{
        type:Number,
        min:0,
        max:100 
    },
    ExamDate:{
        type:Date
    }
});


module.exports={
    courseModelOnTeacher:mongoose.model('courseModelOnTeacher',courseSchema),
    CourseMinExamModelOnTeacher:mongoose.model('CourseMinExamModelOnTeacher',MinExamSchema),
    StudentFinallyExamModelOnTeacher:mongoose.model('StudentFinallyExamModelOnTeacher',finallyExamSchema)
}

