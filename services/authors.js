'use strict';

import uuid from "node-uuid"

class AuthorsService {
  constructor () {
    this.authors = [
      {
        _id: "0",
        name: "Scott"
      }

    ];
  }

  getAuthors () {
    return this.authors;
  }

  getSingleAuthor (authorId) {
    var author = this.authors.filter(author => author._id === authorId)[ 0 ];

    return author || null;
  }

  addAuthor (name) {
    // prevent bad/duplicate data
    if (!name) {
      return null;
    }
    var author = {};
    author.name = name;
    author.id = uuid.v4();

    this.authors.push(author);

    return author;
  }

  updateAuthor (authorId, info) {
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
