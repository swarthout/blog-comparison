'use strict';

import uuid from "node-uuid"

class PostsService {
  constructor () {
    this.posts = [
      {
        _id: "0",
        title: "test",
        category: "other",
        content: "This is a test",
        timestamp: null,
        authorId: "0"
      }
    ];
  }

  getPosts () {
    return this.posts;
  }

  getSinglePost (postId) {
    var post = this.posts.filter(post => post._id === postId)[ 0 ];

    return post || null;
  }

  addPost (info) {
    // prevent a bit of bad/duplicate data
    if (!info || this.posts.filter(post => (post.content === info.content)).length > 0) {
      return null;
    }

    info._id = uuid.v4();

    this.posts.push(info);

    return info;
  }

  updatePost (postId, info) {
    var post = this.getSinglePost(postId);
    if (post) {
      post.content = info.content ? info.content : post.content;

      return true;
    }
    return false;
  }
}

var postsService = new PostsService();
module.exports = postsService;
