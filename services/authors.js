'use strict';

var uuid = require('node-uuid');

class AuthorsService {
    constructor() {
        this.authors = [
            {
                _id: "0",
                name: "Scott"
            }

        ];
    }

    getAuthors() {
        return this.authors;
    }

    getSingleAuthor(authorId) {
        var author = this.authors.filter(author => author._id === authorId)[0];

        return author || null;
    }

    addAuthor(info) {
        // prevent bad/duplicate data
        if (!info || this.authors.filter(author => (author.name === info.name)).length > 0) {
            return null;
        }

        info.id = uuid.v4();

        this.authors.push(info);

        return info;
    }

    updateAuthor(authorId, info) {
        var author = this.getSingleAuthor(authorId);
        if (author) {
            author.name = info.name ? info.name : author.name;
            return true;
        }
        return false;
    }
}

var authorService = new AuthorsService();
module.exports = authorService;
