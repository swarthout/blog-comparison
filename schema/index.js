import * as _ from 'underscore';

var {Post, Category} = require('./post');
var Comment = require('./comment');
var Author = require('./author');

var PostsService = require('../services/posts');
var CommentsService = require("../services/comments");
var AuthorsService = require('../services/authors');

import {
    GraphQLList,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLInt,
    GraphQLFloat,
    GraphQLEnumType,
    GraphQLNonNull,
    GraphQLInterfaceType
} from 'graphql';


const Query = new GraphQLObjectType({
    name: 'BlogSchema',
    description: "Root of the Blog Schema",
    fields: () => ({
        posts: {
            type: new GraphQLList(Post),
            description: "List of posts in the blog",
            args: {
                category: {type: Category}
            },
            resolve(source, {category}) {
                if (category) {
                    return PostsService.getPosts().filter(post => post.category === category);
                } else {
                    return PostsService.getPosts();
                }
            }
        },

        latestPost: {
            type: Post,
            description: "Latest post in the blog",
            resolve() {
                var posts = PostsService.getPosts().sort((a, b) => {
                    var bTime = new Date(b.timestamp).getTime();
                    var aTime = new Date(a.timestamp).getTime();

                    return bTime - aTime;
                });

                return posts[0];
            }
        },

        recentPosts: {
            type: new GraphQLList(Post),
            description: "Recent posts in the blog",
            args: {
                count: {type: new GraphQLNonNull(GraphQLInt), description: 'Number of recent items'}
            },
            resolve(source, {count}) {
                var posts = PostsService.getPosts().sort((a, b) => {
                    var bTime = new Date(b.timestamp).getTime();
                    var aTime = new Date(a.timestamp).getTime();

                    return bTime - aTime;
                });

                return posts.slice(0, count);
            }
        },

        post: {
            type: Post,
            description: "Post by _id",
            args: {
                _id: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(source, {_id}) {
                return PostsService.getSinglePost(_id);
            }
        },

        authors: {
            type: new GraphQLList(Author),
            description: "Available authors in the blog",
            resolve() {
                return AuthorsService.getAuthors();
            }
        },

        author: {
            type: Author,
            description: "Author by _id",
            args: {
                _id: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(source, {_id}) {
                return AuthorsService.getSingleAuthor(_id);
            }
        }
    })
});

const Mutation = new GraphQLObjectType({
    name: "BlogMutations",
    fields: {
        createPost: {
            type: Post,
            description: "Create a new blog post",
            args: {
                title: {type: new GraphQLNonNull(GraphQLString)},
                content: {type: new GraphQLNonNull(GraphQLString)},
                summary: {type: GraphQLString},
                category: {type: Category},
                authorId: {type: new GraphQLNonNull(GraphQLString), description: "Id of the author"}
            },
            resolve(source, args) {
                let post = _.clone(args);

                if (!AuthorsService.getSingleAuthor(post.authorId)) {
                    throw new Error("No such author: " + post.authorId);
                }

                if (!post.summary) {
                    post.summary = post.content.substring(0, 100);
                }

                post.timestamp = new Date().toString();

                PostsService.addPost(post);
                return post;
            }
        },

        createAuthor: {
            type: Author,
            description: "Create a new author",
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(source, {name}) {

                AuthorsService.addAuthor(name);
                return name;
            }
        },
        createComment: {
            type: Comment,
            description: "Comment on a blog post",
            args: {
                postId: {type: new GraphQLNonNull(GraphQLString), description: "Id of the post"},
                content: {type: new GraphQLNonNull(GraphQLString)},
                authorId: {type: new GraphQLNonNull(GraphQLString), description: "Id of the author"}
            },
            resolve(source, args) {
                let comment = _.clone(args);
                if (!PostsService.getSinglePost(postId)) {
                    throw new Error("No such post: " + comment.postId);
                }
                comment.timestamp = new Date().toString();
                CommentsService.addComment(comment.postId, comment);
                return comment;
            }
        }
    }
});

const Schema = new GraphQLSchema({
    query: Query,
    mutation: Mutation
});

module.exports = Schema;