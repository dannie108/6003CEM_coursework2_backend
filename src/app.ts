import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import { router as user } from "./routes/users";
import { router as movie } from "./routes/movies";
import serve from "koa-static";
import Router from "koa-router";

const app = new Koa();
const router = new Router();

app.use(cors());
app.use(bodyParser());


app.use(user.routes());
app.use(user.allowedMethods());
app.use(movie.routes());
app.use(movie.allowedMethods());


router.get("/", (ctx) => {
  ctx.body = {
    message: "Hello from localhost!",
    status: "ok",
    time: new Date().toISOString()
  };
});
app.use(router.routes()).use(router.allowedMethods());


app.use(async (ctx, next) => {
  try {
    await next();
    if (ctx.status === 404) {
      ctx.status = 404;
      ctx.body = { err: "No such endpoint existed" };
    }
  } catch (err: any) {
    ctx.status = err.status || 500;
    ctx.body = { err: err.message || "Internal server error" };
  }
});

app.use(serve("./docs"));

export default app;
