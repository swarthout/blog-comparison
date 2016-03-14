'use strict';

import CommentsService from '../services/comments';

export default class CommentsController {
    constructor(router) {
        this.router = router;
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/', this.getComments.bind(this));
        this.router.get('/:id', this.getSingleComment.bind(this));
        this.router.post('/', this.postComment.bind(this));
        this.router.put('/:id', this.putComment.bind(this));
    }

    getComments(req, res) {
        var players = CommentsService.getComments();
        res.send(players);
    }

    getSingleComment(req, res) {
        var id = req.params.id;
        var player = CommentsService.getSingleComment(id);

        if (!player) {
            res.sendStatus(404);
        } else {
            res.send(player);
        }
    }

    putComment(req, res) {
        var id = req.params.id;
        var existingComment = CommentsService.getSingleComment(id);

        if (!existingComment) {
            let commentInfo = req.body;
            commentInfo.id = id;
            if (CommentsService.addComment(commentInfo)) {
                res.setHeader('Location', '/comments/' + id);
                res.sendStatus(201);
            } else {
                res.sendStatus(500);
            }
        } else {
            if (CommentsService.updateComment(id, req.body)) {
                res.sendStatus(204);
            } else {
                res.sendStatus(404);
            }
        }
    }

    postComment(req, res) {
        var commentInfo = req.body;

        if (CommentsService.addComment(commentInfo)) {
            res.setHeader('Location', '/comments/' + commentInfo.id);
            res.sendStatus(200);
        } else {
            res.sendStatus(500);
        }
    }
}

//module.exports = PlayersController;