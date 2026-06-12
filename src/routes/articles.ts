import Router, {RouterContext} from 'koa-router';
import bodyParser from 'koa-bodyparser';
import * as model from '../models/articles';
import { basicAuth } from '../controllers/auth';
import { validateArticle } from '../controllers/validation';

const router = new Router({prefix: '/api/v1/articles'});

const getAll = async (ctx: RouterContext, next: any) => {
    const articles = await model.getAll();
    if (articles.length) {
        ctx.body = articles;
    }else {
        ctx.body = {}
    }
    await next();
}

const getById = async (ctx:RouterContext, next: any) => {
    const id = Number(ctx.params.id);
    const articles = await model.getAll();
    const index = articles.findIndex((a: any) => a.id === id);

    if (!Number.isInteger(id) || id <= 0 || index === -1) {

        ctx.status = 400;
        ctx.body = "Invild ID";

    }
    else {
        const article = await model.getById(id);
        if (article.length){
            ctx.body = article[0];
        } else {
            ctx.status = 404;
        }
    }
    await next();
}

/*
{
    "title": "testing",
    "fullText": "testing article"
}
*/

const createArticle = async (ctx:RouterContext, next: any) => {
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

/*
interface Article {
    title: string,
    allText: string
}
*/

const updateArticle = async (ctx: RouterContext, next: any) => {
    const body = ctx.request.body;
    const id = Number(ctx.params.id);
    const articles = await model.getAll();
    const index = articles.findIndex((a: any) => a.id === id);

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

const deleteArticle = async (ctx: RouterContext, next: any) => {
    const id = Number(ctx.params.id);
    const articles = await model.getAll();
    const index = articles.findIndex((a: any) => a.id === id);

    if (!Number.isInteger(id) || id <= 0 || index === -1) {

        ctx.status = 400;
        ctx.body = "Invild ID";

    }
    else {
        const result = await model.del(id);
        if(result.status == 201){
            ctx.status = 201;
            ctx.body = {
                message: "Removed article " + id
            };
        }else{
            ctx.status = 500;
            ctx.body = {err: "delete data failed"};
        }
    }
    await next();
}

// List the routes here

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', basicAuth, bodyParser(), validateArticle, createArticle);
router.put('/:id', basicAuth, bodyParser(), validateArticle, updateArticle);
router.delete('/:id', basicAuth,  deleteArticle);

export { router };
