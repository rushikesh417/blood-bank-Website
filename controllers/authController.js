const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs")
const jwt= require("jsonwebtoken");


const registerController = async (req ,res) => {
    try{
         const existingUser = await userModel.findOne({email:req.body.email})
         // validation

         if(existingUser){
            return res.status(200).send({
                success : false,
                message :"user is already exists"
            })
         }

         //hashing  the password with bcrypt
         const salt = await bcrypt.genSalt(10)
         const hashedPassword = await bcrypt.hash(req.body.password,salt) 
         req.body.password = hashedPassword

         //rest data
         const user = new userModel(req.body)
         await user.save()
         return res.status(201).send({
            success : true,
            message:"Registration successful",
            user
         })

    } catch (error){
        console.log(error)
        res.status(500).send({
            success:false,
            message :'Error in register api',
            error
        })
    }
}


const loginController  = async (req,res) => {

    try{
        const user = await userModel.findOne({email:req.body.email});
        if(!user){
            return res.status(404).send({
                success:false,
                message:'not found'
            })
        }

        if(user.role !== req.body.role){
            return res.status(500).send({
                success:false,
                message:'role doesnt match'
            })
        }

        //comparing the password
        const comparePass = await bcrypt.compare(req.body.password , user.password);
        if (!comparePass ){
            return res.status(500).send ({
                success:false,
                message:'wrong credentials'
            })
        }

        //creating the token
        const token = jwt.sign({ userID : user._id} , process.env.JWT_SECRET , {
            expiresIn :"1d",
        });
        return res.status(200).send({
            success:true,
            message:`Welcome ${user.name}`,
            token,
            user,
        })


    } catch (error){
        console.log(error)
        res.status(500).send({
            success:false,
            message :'Error in login api',
            error
        })
    }

}


//GET CURRENT USER
const currentUserController = async (req, res) => {
    try {
    //   console.log("userId:", req.body);
      const user = await userModel.findOne({ _id: req.body.userId });
      
      return res.status(200).send({
        success: true,
        message: "User Fetched Successfully",
        user:user
      });

    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "unable to get current user",
        error,
      });
    }
  };

module.exports ={registerController ,loginController ,currentUserController}