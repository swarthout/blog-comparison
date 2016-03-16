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

var PostsService = require('../services/posts');
var CommentsService = require('../services/comments');
var AuthorsService = require('../services/authors');

var Author = require('./author');
var Comment = require('./comment');

const Category = new GraphQLEnumType({
    name: "Category",
    description: "A Category for a Post",
    values: {
        POLITICS: {value: "politics"},
        TECHNOLOGY: {value: "technology"},
        SPORTS: {value: "sports"},
        OTHER: {value: 'other'}
    }
});

const Post = new GraphQLObjectType({
    name: "Post",
    description: "A Blog Post",
    fields: () => ({
        _id: {type: GraphQLString},
        title: {type: GraphQLString},
        category: {type: Category},
        summary: {type: GraphQLString},
        content: {type: GraphQLString},
        timestamp: {type: GraphQLString},
        comments: {
            type: new GraphQLList(Comment),
            args: {
                limit: {type: GraphQLInt, description: "Limit the number of comments returning"}
            },
            resolve: function (post, {limit}) {
                if (limit >= 0) {
                    return CommentsService.getComments(post._id).slice(0, limit);
                }

                return CommentsService.getComments(post._id);
            }
        },
        author: {
            type: Author,
            resolve: function ({authorId}) {
                return AuthorsService.getSingleAuthor(authorId);
            }
        }
    })
});

module.exports = {
    Post: Post,
    Category: Category
};