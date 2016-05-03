import {GraphQLObjectType, GraphQLString} from "graphql"
import AuthorsService from "../services/authors"
import Author from "./author"

const Comment = new GraphQLObjectType({
  name: "Comment",
  description: "Represent the type of a comment",
  fields: () => ({
    _id: { type: GraphQLString },
    content: { type: GraphQLString },
    author: {
      type: Author,
      resolve({ authorId }) {
        return AuthorsService.getSingleAuthor(authorId);
      }
    },
    timestamp: { type: GraphQLString }
  })
});

module.exports = Comment;
