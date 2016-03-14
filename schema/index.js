import * as _ from 'underscore';

var {Post, Category} = require('./post');
var Comment = require('./comment');
var Author = require('./author');

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
            resolve: function (source, {category}) {
                if (category) {
                    return _.filter(PostsList, post => post.category === category);
                } else {
                    return PostsList;
                }
            }
        },

        latestPost: {
            type: Post,
            description: "Latest post in the blog",
            resolve: function () {
                PostsList.sort((a, b) => {
                    var bTime = new Date(b.date['$date']).getTime();
                    var aTime = new Date(a.date['$date']).getTime();

                    return bTime - aTime;
                });

                return PostsList[0];
            }
        },

        recentPosts: {
            type: new GraphQLList(Post),
            description: "Recent posts in the blog",
            args: {
                count: {type: new GraphQLNonNull(GraphQLInt), description: 'Number of recent items'}
            },
            resolve: function (source, {count}) {
                PostsList.sort((a, b) => {
                    var bTime = new Date(b.date['$date']).getTime();
                    var aTime = new Date(a.date['$date']).getTime();

                    return bTime - aTime;
                });

                return PostsList.slice(0, count)
            }
        },

        post: {
            type: Post,
            description: "Post by _id",
            args: {
                _id: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve: function (source, {_id}) {
                return _.filter(PostsList, post => post._id === _id)[0];
            }
        },

        authors: {
            type: new GraphQLList(Author),
            description: "Available authors in the blog",
            resolve: function () {
                return _.values(AuthorsMap);
            }
        },

        author: {
            type: Author,
            description: "Author by _id",
            args: {
                _id: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve: function (source, {_id}) {
                return AuthorsMap[_id];
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
                _id: {type: new GraphQLNonNull(GraphQLString)},
                title: {type: new GraphQLNonNull(GraphQLString)},
                content: {type: new GraphQLNonNull(GraphQLString)},
                summary: {type: GraphQLString},
                category: {type: Category},
                author: {type: new GraphQLNonNull(GraphQLString), description: "Id of the author"}
            },
            resolve: function (source, args) {
                let post = _.clone(args);
                var alreadyExists = _.findIndex(PostsList, p => p._id === post._id) >= 0;
                if (alreadyExists) {
                    throw new Error("Post already exists: " + post._id);
                }

                if (!AuthorsMap[post.author]) {
                    throw new Error("No such author: " + post.author);
                }

                if (!post.summary) {
                    post.summary = post.content.substring(0, 100);
                }

                post.comments = [];
                post.date = {$date: new Date().toString()}

                PostsList.push(post);
                return post;
            }
        },

        createAuthor: {
            type: Author,
            description: "Create a new author",
            args: {
                _id: {type: new GraphQLNonNull(GraphQLString)},
                name: {type: new GraphQLNonNull(GraphQLString)},
                twitterHandle: {type: GraphQLString}
            },
            resolve: function (source, args) {
                let author = _.clone(args);
                if (AuthorsMap[args._id]) {
                    throw new Error("Author already exists: " + author._id);
                }

                AuthorsMap[author._id] = author;
                return author;
            }
        }
    }
});

const Schema = new GraphQLSchema({
    query: Query,
    mutation: Mutation
});

module.exports = Schema;