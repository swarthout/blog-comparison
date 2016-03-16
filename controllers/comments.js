'use strict';

var CommentsService = require('../services/comments');

class CommentsController {
    constructor(router) {
        this.router = router;
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/', this.getComments.bind(this));
        this.router.get('/:commentId', this.getSingleComment.bind(this));
        this.router.post('/', this.postComment.bind(this));
        this.router.put('/:commentId', this.putComment.bind(this));
    }

    getComments(req, res) {
        var postId = req.params.postId;
        var comments = CommentsService.getComments(postId);
        res.send(comments);
    }

    getSingleComment(req, res) {
        var commentId = req.params.commentId;
        var comment = CommentsService.getSingleComment(commentId);

        if (!comment) {
            res.sendStatus(404);
        } else {
            res.send(comment);
        }
    }

    putComment(req, res) {
        var commentId = req.params.commentId;
        var existingComment = CommentsService.getSingleComment(commentId);
        let commentInfo = req.body;
        if (!existingComment) {
            if (CommentsService.addComment(commentInfo)) {
                res.sendStatus(201);
            } else {
                res.sendStatus(500);
            }
        } else {
            if (CommentsService.updateComment(commentId, commentInfo)) {
                res.sendStatus(204);
            } else {
                res.sendStatus(404);
            }
        }
    }

    postComment(req, res) {
        var commentInfo = req.body;
        var postId = req.params.postId;
        if (CommentsService.addComment(postId, commentInfo)) {
            res.sendStatus(200);
        } else {
            res.sendStatus(500);
        }
    }
}

module.exports = CommentsController;