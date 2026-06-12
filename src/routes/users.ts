import Router, {RouterContext} from 'koa-router';
import bodyParser from 'koa-bodyparser';
import * as model from '../models/users';
import { basicAuth } from '../controllers/auth';
import { validateUser } from '../controllers/validation';

const router = new Router({prefix: '/api/v1/users'});

const getUsername = async (ctx: RouterContext, next: any) => {
    // 容錯：支援 ctx.state.user 為字串或物件
    let username: string | undefined;
    if (typeof ctx.state.user === 'string') {
        username = ctx.state.user;
    } else if (ctx.state.user && typeof ctx.state.user === 'object') {
        // 常見情況：ctx.state.user = { user: {...} } 或 { username: '...' }
        username = ctx.state.user.username ?? ctx.state.user.user?.username;
    }

    if (!username) {
        ctx.status = 400;
        ctx.body = { err: 'No username in state' };
        await next();
        return;
    }

    const user = await model.findByUsername(username);
    if (user.length) {
        ctx.body = user;
    } else {
        ctx.body = {};
    }
    await next();
}


const getAll = async (ctx: RouterContext, next: any) => {
    const users = await model.getAll();
    if (users.length) {
        ctx.body = users;
    }else {
        ctx.body = {}
    }
    await next();
}

const getById = async (ctx:RouterContext, next: any) => {
    const id = Number(ctx.params.id);
    const users = await model.getById(id);
    const index = users.findIndex((a: any) => a.id === id);

    if (!Number.isInteger(id) || id <= 0 || index === -1) {

        ctx.status = 400;
        ctx.body = "Invild ID";

    }
    else {
        const user = await model.getById(id);
        if (users.length){
            ctx.body = user[0];
        } else {
            ctx.status = 404;
        }
    }
    await next();
}


const createUser = async (ctx:RouterContext, next: any) => {
    const body = ctx.request.body;
    const result = await model.add(body);
    if (result.status == 201) {
        ctx.status = 201;
        ctx.body = body;
    }else {
        ctx.status = 500;
        ctx.body = {err: "insert data failed"}
    }
    await next();
}

const updateUser = async (ctx: RouterContext, next: any) => {
    const body = ctx.request.body;
    const id = Number(ctx.params.id);
    const users = await model.getById(id);
    const index = users.findIndex((a: any) => a.id === id);

    if (!Number.isInteger(id) || id <= 0 || index === -1) {

        ctx.status = 400;
        ctx.body = "Invild ID";

    }
    else {
        const result = await model.update(id,body);
        if(result.status == 201){
            ctx.status = 201;
            ctx.body = body;
        }else{
            ctx.status = 500;
            ctx.body = {err: "update data failed"};
        }
    }

    await next();
}

const deleteUser = async (ctx: RouterContext, next: any) => {
    const id = Number(ctx.params.id);
    const users = await model.getById(id);
    const index = users.findIndex((a: any) => a.id === id);

    if (!Number.isInteger(id) || id <= 0 || index === -1) {

        ctx.status = 400;
        ctx.body = "Invild ID";

    }
    else {
        const result = await model.del(id);
        if(result.status == 201){
            ctx.status = 201;
            ctx.body = {
                message: "Removed user " + id
            };
        }else{
            ctx.status = 500;
            ctx.body = {err: "delete data failed"};
        }
    }
    await next();
}

// List the routes here

router.get('/', basicAuth, getUsername);
router.get('/:id', basicAuth, getById);
router.post('/', bodyParser(), validateUser, createUser);
router.put('/:id', basicAuth, bodyParser(), validateUser, updateUser);
router.delete('/:id', basicAuth, deleteUser);

export { router };
