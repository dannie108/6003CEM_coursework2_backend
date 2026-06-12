import passport from 'koa-passport';
import Koa from 'koa';
import json from 'koa-json'
import {router} from '../../src/routes/articles'
import request from 'supertest';

const app: Koa = new Koa();

app.use(json());
app.use(passport.initialize());
app.use(router.middleware());

app.listen(3000);

describe('Get / - a simple API endpoint',()=>{
    test('Get all article', async() => {
        const result = await request(app.callback()).get('/api/v1/articles');
        expect(result.statusCode).toEqual(200);
    })
});

describe('Post / - a simple API endpoint for adding test',()=>{
   xtest('Post an aritcle', async() => {
        const result = await request(app.callback()).post('/api/v1/articles')
                            .set({'Authorization': atob('123:123')})
                            .send({});
        expect(result.statusCode).toEqual(201);
    })
});