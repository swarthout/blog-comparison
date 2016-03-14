'use strict';

var uuid = require('node-uuid');

class CommentsService {
    constructor() {
        this.comments = [];
    }

    getComments() {
        return this.comments;
    }

    getSingleComment(commentId) {
        var comment = this.comments.filter(p => p.id === commentId)[0];

        return comment || null;
    }

    addComment(postId, info) {
        // prevent a bit of bad/duplicate data
        if (!info || this.comments.filter(c => (c.postId === info.postId && c.text === info.text)).length > 0) {
            return null;
        }

        info.id = uuid.v4();

        this.comments.push(info);

        return info;
    }

    updateComment(commentId, info) {
        var comment = this.getSingleComment(commentId);
        if (comment) {
            comment.text = info.text ? info.text : comment.text;

            return true;
        }
        return false;
    }
}

var commentsService = new CommentsService();
export default commentsService;
