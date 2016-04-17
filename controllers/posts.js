'use strict';

import PostsService from "../services/posts";

class PostsController {
    constructor(router) {
        this.router = router;
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/', this.getPosts.bind(this));
        this.router.get('/:postId', this.getSinglePost.bind(this));
        this.router.post('/', this.addPost.bind(this));
        this.router.put('/:postId', this.putPost.bind(this));
    }

    getPosts(req, res) {
        var players = PostsService.getPosts();
        res.send(players);
    }

    getSinglePost(req, res) {
        var id = req.params.postId;
        var player = PostsService.getSinglePost(id);

        if (!player) {
            res.sendStatus(404);
        } else {
            res.send(player);
        }
    }

    putPost(req, res) {
        var id = req.params.postId;
        var existingPost = PostsService.getSinglePost(id);
        let postInfo = req.body;
        if (!existingPost) {
            if (PostsService.addPost(postInfo)) {
                res.sendStatus(201);
            } else {
                res.sendStatus(500);
            }
        } else {
            if (PostsService.updatePost(id, postInfo)) {
                res.sendStatus(204);
            } else {
                res.sendStatus(404);
            }
        }
    }

    addPost(req, res) {
        var postInfo = req.body;

        if (PostsService.addPost(postInfo)) {
            res.sendStatus(200);
        } else {
            res.sendStatus(500);
        }
    }
}

module.exports = PostsController;