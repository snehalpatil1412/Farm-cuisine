import userModels from "../models/userModels.js";
import { comparePassword, hashPassword } from "../utils/authUtils.js";
import JWT from "jsonwebtoken";
import { requireSignIn } from "../middleware/authMiddleware.js";


export const registerController = async (req, res) => {
    try {
        const {name,email,password,phone,address} = req.body;
        //validation
        if(!name){
            return res.send({error:"Name is required"});
        }
        if(!email){
            return res.send({error:"Email is required"});
        }
        if(!password){
            return res.send({error:"Password is required"});
        }
        if(!phone){
            return res.send({error:"Phone no is required"});
        }
        if(!address){
            return res.send({error:"Address is required"});
        }

        //check user
        const existingUser = await userModels.findOne({ email });
       
        //existing user
        if(existingUser){
            return res.status(200).send({
                success:true,
                message:"User already exists please login",

            });
        }

        //register user
        const hashedPassword = await hashPassword(password);
        //save
        const user = await new userModels({
            name,
            email,
            phone,
            address,
            password:hashedPassword
        }).save();

        res.status(201).send({
            success:true,
            message:"user register successfully",
            user
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            succes:false,
            message:"Error in registeration",
            error
        })  ;  
    }
} ;

//POST LOGIN
export const loginController = async(req, res) => {
    try {
        const{ email,password } = req.body
        //validation
        if(!email || !password){
            return res.status(404).send({
                success:false,
                message:'Email and password are required'
            });           
        }
        //check user
        const user = await userModels.findOne({email});
        //validation
        if(!user){
            return res.status(404).send({
                succes:false,
                message:'Email is not register'
            });
        }
        
        //compare password
        const match = await comparePassword(password,user.password);
        //validation
        if(!match){
            return res.status(200).send({
                success:false,
                message:'Invalid password'
            });
        }

        //token
        const token = await JWT.sign({_id:user._id}, process.env.JWT_SECRET, {expiresIn:'7d'});
        res.status(200).send({
            success:true,
            message:'Login successfully',
            user:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address
            },
            token
        });


    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in login",
            error
        })
    }
};

//test controller
export const testController = (req , res) => {
    try{
        res.send('protected route');
    }catch(error){
        console.log(error);
        res.send({ error });
    }
};