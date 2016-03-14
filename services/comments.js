'use strict';

var uuid = require('node-uuid');

class CommentsService {
    constructor() {
        this.comments = [];
    }

    getComments() {
        return this.comments;
    }

    getCommentsbyPost(postId) {
        return this.comments.filter(comment => comment.postId === postId);
    }

    getCommentsbyAuthor(authorId) {
        return this.comments.filter(comment => comment.authorId === authorId);
    }
    getSingleComment(commentId) {
        var comment = this.comments.filter(comment => comment._id === commentId)[0];

        return comment || null;
    }

    addComment(postId, info) {
        // prevent bad/duplicate data
        if (!info || this.comments.filter(comment => (comment.postId === info.postId && comment.content === info.content)).length > 0) {
            return null;
        }

        info.id = uuid.v4();

        this.comments.push(info);

        return info;
    }

    updateComment(commentId, info) {
        var comment = this.getSingleComment(commentId);
        if (comment) {
            comment.text = info.content ? info.content : comment.content;

            return true;
        }
        return false;
    }
}

var commentsService = new CommentsService();
module.exports = commentsService;
