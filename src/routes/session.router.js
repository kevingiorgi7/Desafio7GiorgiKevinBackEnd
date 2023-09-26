// SESSION
import {Router} from "express";
import {userModel} from "../db/models/users.model.js"
import { userManager } from "../managers/UsersManager.js";
import { hashData } from "../utils.js";
import { compareData } from "../utils.js";
import passport from "passport";


const router = Router()

router.post('/register',async(req,res)=>{
    try {
        const {first_name, last_name, email, age, password} = req.body

        if(!first_name || !last_name || !email || !age || !password){
            return res.status(400).json({status:"error",message:'Some data is missing'})
        }

        const userExist = await userManager.findUser({email});
        if(userExist){
            return res.status(400).json({status:"error",message:`El E-Mail ${email} ya está registrado`})
        }
        const hashPassword = await hashData(password)
        const newUser = {...req.body, password:hashPassword}

        if(email==="adminCoder@coder.com") {
            newUser.isAdmin = true
        }

        const result = await userManager.create(newUser);

        res.status(200).send({status:"success",payload:result})
    } catch (error) {
        throw res.status(500).json({
            error
        });
    }

})

router.post('/login',async(req,res)=>{
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({status:"error",message:'Some data is missing'})
        }
        const user = await userModel.findOne({email})
        //Corroborar si existe
        if(!user) {
            return res.status(400).send({status:"error", error:"El email no esta registrado"});
        }
        // Validar contraseña
        const passwordValid = await compareData(password,user.password)
        if(!passwordValid){
            return res.status(401).json({message:'Email o Contraseña no valida'})
        }
        // Si existe, crea una SESSION
        req.session.user = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            admin: user.isAdmin
        }
        res.send({status:"success",payload: req.res.user, message:"Logueado"})
    } catch (error) {
        throw res.status(500).json({
            error,
        });
    }
})

router.get('/logout',(req,res)=>{
    req.session.destroy(err=>{
        if(err) return res.status(500).send({status:"error",error:"No pudo cerrar sesion"})
        res.redirect('/api/views/login')
    })
})

// Passport Github
router.get(
    "/githubRegister", 
    passport.authenticate("github",{scope: ["user:username"]})
);

router.get(
    "/github", 
    passport.authenticate("github",{
        failureRedirect: "/api/views/login",
        successRedirect:"/api/views/profilePassport",
    })
    /*  ,(req,res)=>{
        console.log(req.user, 'n3');
        console.log(req.session);
        res.send('123 Probando')
    } */
    );



export default router