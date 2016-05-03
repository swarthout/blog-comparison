GraphQL and REST Comparison
==================================

I first discovered GraphQL about three months ago when I was browsing Hacker News. I thought it was a pretty interesting technology. I built this project as a way of comparing a traditional REST style API with GraphQL to see their similarities, differences, and the key advantages that using GraphQL affords a developer.

#### Intuitive Queries ####
The main advantage of using GraphQL is it lets the developer query for data in a intuitive way, where the query response is almost identical to the query sent to the server. In a traditional REST workflow, if a developer using this demo application wanted to get a list of blog posts, with the title of the post, the authors name, and the list of comments for each post, with the comment and the commenters name for each comment. To get all of this information through the REST endpoints, one must do the following:
  1. Send a GET request to /posts/ to get a list of every post
  2. For each post, parse the response to find the id of the author
  3. Send another GET request to /authors/:id with the author's id to get the author information.
  4. Send yet another GET request to /posts/:id/comments for each post to get a list of comments.
  5. Send another GET request to /authors/:id with the commenter's id to get their information.

As you can see, to make this simple request, the developer has to send possibly dozens of HTTP requests, get lots of unnecessary information in the response bodies, and use a lot of client side logic to parse the responses and issue subsequent responses.

Since all of our data is completely normalized, this is an extreme example, but denormalizing our data (for example by inlining our author information in the post resource), we save multiple round trips from the server, but editing this author's information now requires a massive migration of the posts table in our database.

Another typical solution to this problem is to make ad-hoc endpoints, so if we wanted to get this exact data, we could make a /postsWithAuthorInfoAndComments/ endpoint that would do all of the joins for us on the server and give us exactly the data we want. However, this solution is brittle, because if we wanted to, for example, ask for the timestamp of each comment on the post, we would have to modify the server endpoint, which would in turn require the developer to make a new version of the endpoint, and now have to support both versions of the API.

Contrast this to GraphQL. If I want that exact same data, I would query the /graphql/ endpoint with the following query:

    {
      posts {
        title
        author {
          name
        }   
        comments {
          author {
            name
          }
          content
        }     
      }   
    }

Which would give a response like

    {
      "data": {
        "posts": [
          {
            "title": "Welcome to GraphQL!",
            "author": {
              "name": "Scott Swarthout"
            },
            "comments": [
              {
                "author": {
                  "name": "Mark Zuckerberg"
                },
                "content": "Great post!"
              }
            ]
          },
          {
            "title": "Programming is Cool...",
            "author": {
              "name": "Bill Gates"
            },
            "comments": [
              {
                "author": {
                  "name": "Steve Jobs"
                },
                "content": "I agree!"
              },
              {
                "author": {
                  "name": "John Carmack"
                },
                "content": "Hello world!"
              }
            ]
          }
        ]
      }
    }

The "shape" of the response is almost exactly the same as the "shape" of the query, and even though all of this data is normalized, only one request is needed to get all of the information. Also, if my needs change (like I need that timestamp on the comments), I can just modify my query to reflect my needs. There is a more intuitive mental model with GraphQL, that while all of these features can be imitated with traditional REST endpoints with query parameters and multiple responses, all of this comes with GraphQL out of the box.

#### Disadvantages ####

While GraphQL is great technology, it doesn't always make sense to replace REST with GrapQL. There are a number of applications where REST APIs provide a better value than GraphQL APIs. A few of these applications are:
1. External APIs - Since GraphQL servers require a special syntax that most app developers are not familiar with using, it would be difficult to promote usage of a GraphQL API for your external, public facing API. However, there is no reason why you could not use GraphQL internally, and then set up additional endpoints that serve a specific GrapQL query. For example, A RESTful route /posts/ could correspond to the GraphQL query shown above.
2. Large Existing APIs - Since GraphQL requires its own type system declarations and must be hooked up to query resolvers manually, it can be quite daunting to convert a large REST API to GraphQl. However, GraphQL is incrementally adoptable and GraphQL resolve functions can query existing REST endpoints. For example, instead of using JavaScript service methods in the query resolvers, it is perfectly reasonable to do something like:

        import rp from 'request-promise';
        // inside GraphQL Schema definition
        posts: {
            type: new GraphQLList(Post),
            description: "List of posts in the blog",
            resolve() {
                return rp("http://localhost:3000/api/posts/").then(posts => posts);
            }
        }

#### Conclusion ####
In conclusion, I found this exploration of GraphQL very informative and I look forward to using the technology more in the future. It is going to be hard to go back to a world without such easy queries and such helpful developer tools. I look forward to the future of GraphQL and its eventual widespread adoption.