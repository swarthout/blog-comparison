var express = require('express');
var schema = require('./schema/index');

var graphql = require('graphql');
var graphqlHTTP = require('express-graphql');
var bodyParser = require('body-parser');

let app = express();
let PORT = 3000;

app.use(bodyParser.json());

app.use('/graphql', graphqlHTTP({schema: schema, graphiql: true}));

var apiRouter = express.Router();
app.use('/api', apiRouter);

var authorsRouter = express.Router();
apiRouter.use('/authors', authorsRouter);

var commentsRouter = express.Router();
apiRouter.use('/comments', commentsRouter);

var postsRouter = express.Router();
apiRouter.use('/posts', postsRouter);

var AuthorsController = require('./controllers/authors');
var ac = new AuthorsController(authorsRouter);

var CommentsController = require('./controllers/comments');
var cc = new CommentsController(commentsRouter);

var PostsController = require('./controllers/posts');
var pc = new PostsController(postsRouter);


let server = app.listen(PORT, function () {
    console.log('blog running at http://localhost:3000');
});
