import passport, { Passport } from "passport";
import { userModel } from "../db/models/users.model.js";
import { Strategy as LocalStrategy} from "passport-local";
import { Strategy as GitHubStrategy} from "passport-github2";
import { userManager } from "../managers/UsersManager.js";
import { compareData } from "../utils.js";


// Login LOCAL a traves de PASSPORT
passport.use('login',new LocalStrategy(
    async function(email,passport,done){
        try {
            const user = await userModel.findOne({email})
            if(!user){
                return done(null,false)
            }
            const passwordValid = await compareData(password,user.password)
            if(!passwordValid){
                return done(null,false)
            }
            return done(null,user)
        } catch (error) {
            done(error)
        }
    }
))

// Login con GIT HUB a traves de PASSPORT
passport.use(new GitHubStrategy({
        clientID: 'Iv1.a48078247b123013',
        clientSecret: '0972be9b865a5dab43890629b9b0499928fd4d3a',
        callbackURL: "http://localhost:8080/api/sessions/github"
    },
    async function (accessToken, refreshToken, profile, done) {
        try {
            const userExist = await userManager.findUser(profile.username)
            if(!userExist){
                return done(null,false)
            }
            const newUser = {
                first_name: profile.displayName.split(' ') [0],
                last_name: profile.displayName.split(' ') [1],
                email: profile.username,
                age: ' ',
                password: ' '
            }
            const result = await userManager.create(newUser)
            return done(null,result)
        } catch (error) {
            done(error)
        }
        
    }
))



// user => id
passport.serializeUser((usuario,done)=>{
    done(null,usuario._id)
})

// id => user
passport.deserializeUser(async(id,done)=>{
    try {
        const user = await userModel.findById(id)
        done(null,user)
    } catch (error) {
        done(error)
    }
})