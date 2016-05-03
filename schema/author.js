import {GraphQLObjectType, GraphQLString} from "graphql"

const Author = new GraphQLObjectType({
  name: "Author",
  description: "Represent the type of an author of a blog post or a comment",
  fields: () => ({
    _id: { type: GraphQLString },
    name: { type: GraphQLString }
  })
});

module.exports = Author;