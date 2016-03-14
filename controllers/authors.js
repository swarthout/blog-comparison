'use strict';

import AuthorsService from '../services/authors';

export default class AuthorsController {
    constructor(router) {
        this.router = router;
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/', this.getAuthors.bind(this));
        this.router.get('/:id', this.getSingleAuthor.bind(this));
        this.router.post('/', this.postAuthor.bind(this));
        this.router.put('/:id', this.putAuthor.bind(this));
    }

    getAuthors(req, res) {
        var players = AuthorsService.getAuthors();
        res.send(players);
    }

    getSingleAuthor(req, res) {
        var id = req.params.id;
        var player = AuthorsService.getSingleAuthor(id);

        if (!player) {
            res.sendStatus(404);
        } else {
            res.send(player);
        }
    }

    putAuthor(req, res) {
        var id = req.params.id;
        var existingPlayer = AuthorsService.getSingleAuthor(id);

        if (!existingPlayer) {
            let playerInfo = req.body;
            playerInfo.id = id;
            if (AuthorsService.addAuthor(playerInfo)) {
                res.setHeader('Location', '/authors/' + id);
                res.sendStatus(201);
            } else {
                res.sendStatus(500);
            }
        } else {
            if (AuthorsService.updateAuthor(id, req.body)) {
                res.sendStatus(204);
            } else {
                res.sendStatus(404);
            }
        }
    }

    postAuthor(req, res) {
        var authorInfo = req.body;

        if (AuthorsService.addAuthor(authorInfo)) {
            res.setHeader('Location', '/authors/' + authorInfo.id);
            res.sendStatus(200);
        } else {
            res.sendStatus(500);
        }
    }
}

//module.exports = PlayersController;