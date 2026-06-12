//auth.ts
import passport from "koa-passport";
import { BasicStrategy } from "passport-http";
import { RouterContext } from "koa-router";

import * as users from '../models/users';

//{username:xxx, password:...}, password
const verifyPassword = (user:any, password:string) => {
    return user.password === password;
}

// passport.use(new BasicStrategy(async (username:string, password:string, done) => {
//     if(username === "admin" && password === "password") {
//         done(null, {username: "admin"});
//     } else {
//         done(null, false);
//     }
// }));

passport.use(new BasicStrategy(async (username:string, password:string, done) => {
    let result: any[] = [];
    try{
        result = await users.findByUsername(username);
    } catch (error) {
        console.error(`Error during authentication for user ${username}:${error}`);
        done(null, false);
    }
    
    if(result.length){
        const user = result[0]; //[{username:xxx, password:...}]
        //{username:xxx, password:...}, password
        if(verifyPassword(user, password)) {
            done(null, {user: user});
        } else {
            console.log(`Password incorrect for ${username}`);
            done(null, false);
        }
    } else {
        console.log(`No user found with username ${username}`);
        done(null, false);
    }

}))

export const basicAuth = async (ctx: RouterContext, next:any) => {
    await passport.authenticate("basic", {session: false})(ctx, next);
    // const auth = passport.authenticate("basic", {session: false});
    // await auth(ctx, next);
    if (ctx.status == 401) {
        ctx.body = {
            message: 'you are not authorized'
        };
    } else {
        // ctx.body = {
        //     message: 'you are passed'
        // };
        return ctx.state;
    };
}