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
            resolve({authorId}) {
                return AuthorsService.getSingleAuthor(authorId);
            }
        },
        timestamp: {type: GraphQLString}
    })
});

module.exports = Comment;