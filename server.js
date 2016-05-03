import express from "express"
import schema from "./schema/index"
import graphqlHTTP from "express-graphql"
import bodyParser from "body-parser"
import AuthorsController from "./controllers/authors"
import PostsController from "./controllers/posts"
import CommentsController from "./controllers/comments"
let app = express();
let PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.redirect('/graphql');
});

app.use('/graphql', graphqlHTTP({ schema: schema, graphiql: true }));

let apiRouter = express.Router();
app.use('/api', apiRouter);

let authorsRouter = express.Router();
apiRouter.use('/authors', authorsRouter);

let postsRouter = express.Router();
apiRouter.use('/posts', postsRouter);

let commentsRouter = express.Router({ mergeParams: true });
postsRouter.use('/:postId/comments', commentsRouter);

var ac = new AuthorsController(authorsRouter);

var pc = new PostsController(postsRouter);

var cc = new CommentsController(commentsRouter);

app.listen(PORT, function () {
  console.log(`blog running at http://localhost:${PORT}`);
});
