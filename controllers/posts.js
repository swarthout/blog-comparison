'use strict';

var PostsService = require('../services/posts');

class PostsController {
    constructor(router) {
        this.router = router;
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/', this.getPosts.bind(this));
        this.router.get('/:id', this.getSinglePost.bind(this));
        this.router.post('/', this.addPost.bind(this));
        this.router.put('/:id', this.putPost.bind(this));
    }

    getPosts(req, res) {
        var players = PostsService.getPosts();
        res.send(players);
    }

    getSinglePost(req, res) {
        var id = req.params.id;
        var player = PostsService.getSinglePost(id);

        if (!player) {
            res.sendStatus(404);
        } else {
            res.send(player);
        }
    }

    putPost(req, res) {
        var id = req.params.id;
        var existingPost = PostsService.getSinglePost(id);

        if (!existingPost) {
            let postInfo = req.body;
            postInfo.id = id;
            if (PostsService.addPost(postInfo)) {
                res.setHeader('Location', '/posts/' + id);
                res.sendStatus(201);
            } else {
                res.sendStatus(500);
            }
        } else {
            if (PostsService.updatePost(id, req.body)) {
                res.sendStatus(204);
            } else {
                res.sendStatus(404);
            }
        }
    }

    addPost(req, res) {
        var postInfo = req.body;

        if (PostsService.addPost(postInfo)) {
            res.setHeader('Location', '/posts/' + postInfo.id);
            res.sendStatus(200);
        } else {
            res.sendStatus(500);
        }
    }
}

module.exports = PostsController;