import Koa from "koa";
import Router, {RouterContext} from "koa-router";
import logger from "koa-logger";
import json from "koa-json";
import serve from "koa-static";
import path from "path";

import { router as articles } from "./routes/articles";
import { router as users } from "./routes/users";
import { router as special } from "./routes/special";
import cors from '@koa/cors';

const app:Koa = new Koa();
const router: Router = new Router();

app.use(cors());
app.use(logger());
app.use(json());
app.use(router.routes());
app.use(articles.routes());
app.use(users.routes());
app.use(special.routes());
// app.use(serve(path.join(__dirname, "docs")));
app.use(serve("./docs"));



app.use(async(ctx:RouterContext, next:any) => {
    try{
        await next();
        if( ctx.status === 404 ){
            ctx.status = 404;
            ctx.body = { err: "No such endpoint existed"};
        }
    }catch (err:any){
        ctx.body = { err:err };
    }
})

app.listen(10888, () => {
    console.log("Web Server Started (port 10888)");
})