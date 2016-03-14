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

var AuthorsService = require('../services/authors');
var Author = require('./author');

const Comment = new GraphQLObjectType({
    name: "Comment",
    description: "Represent the type of a comment",
    fields: () => ({
        _id: {type: GraphQLString},
        content: {type: GraphQLString},
        author: {
            type: Author,
            resolve: function ({author}) {
                return AuthorsService.getSingleAuthor(author._id);
            }
        },
        timestamp: {type: GraphQLFloat}
    })
});

module.exports = Comment;