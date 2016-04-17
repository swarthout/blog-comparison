'use strict';

import uuid from "node-uuid";

class CommentsService {
    constructor() {
        this.comments = [
            {
                _id: "0",
                content: "great post!",
                authorId: "0",
                timestamp: null,
                postId: "0"
            }

        ];
    }

    getComments(postId) {
        return this.comments.filter(comment => comment.postId === postId);
    }

    getSingleComment(commentId) {
        var comment = this.comments.filter(comment => comment._id === commentId)[0];

        return comment || null;
    }

    addComment(postId, comment) {
        comment._id = uuid.v4();

        this.comments.push(comment);

        return comment;
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
