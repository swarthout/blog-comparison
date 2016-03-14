import express from 'express';
//import schema from '/schema/index';

import { graphql } from 'graphql';
import bodyParser from 'body-parser';

let app = express();
let PORT = 3000;

// parse POST body as text
//app.use(bodyParser.text({type: 'application/graphql'}));
app.use(bodyParser.json());

//app.post('/graphql', (req, res) => {
//    // execute GraphQL
//    graphql(schema, req.body)
//        .then((result) => {
//            res.send(JSON.stringify(result, null, 2));
//        });
//});

var apiRouter = express.Router();
app.use('/api', apiRouter);

var authorsRouter = express.Router();
apiRouter.use('/authors', authorsRouter);

var commentsRouter = express.Router();
apiRouter.use('/comments', commentsRouter);

var postsRouter = express.Router();
apiRouter.use('/posts', postsRouter);

import AuthorsController from 'controllers/authors';
var ac = new AuthorsController(authorsRouter);

import CommentsController from 'controllers/comments';
var cc = new CommentsController(commentsRouter);

import PostsController from 'controllers/posts';
var pc = new PostsController(postsRouter);


let server = app.listen(PORT, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Blog Server listening at http://%s:%s', host, port);
});
