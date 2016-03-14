'use strict';

var uuid = require('node-uuid');

class AuthorsService {
    constructor() {
        this.authors = [];
    }

    getAuthors() {
        return this.authors;
    }

    getSingleAuthor(authorId) {
        var author = this.authors.filter(p => p.id === authorId)[0];

        return author || null;
    }

    addAuthor(info) {
        // prevent a bit of bad/duplicate data
        if (!info || this.authors.filter(p => (p.firstName === info.firstName && p.lastName === info.lastName)).length > 0) {
            return null;
        }

        info.id = uuid.v4();

        this.authors.push(info);

        return info;
    }

    updateAuthor(authorId, info) {
        var author = this.getSingleAuthor(authorId);
        if (author) {
            author.firstName = info.firstName ? info.firstName : author.firstName;
            author.lastName = info.lastName ? info.lastName : author.lastName;
            author.displayName = info.displayName ? info.displayName : author.displayName;

            return true;
        }
        return false;
    }
}

var authorService = new AuthorsService();
export default authorService;
