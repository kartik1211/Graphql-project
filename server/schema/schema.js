const graphql = require('graphql');
const _ = require('lodash');
const Author = require('../models/Author');
const Book = require('../models/Book');

const { GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLList } = graphql;// destrcuturing we are grabbing GraphQLObjectType from this express-graphql package

// dummy data for books
// let books = [
//     { id: '1', name: 'Harry Potter', genre: 'Fiction', authorId: '1' },
//     { id: '2', name: 'Summer Child', genre: 'Sci-Fi', authorId: '2'  },
//     { id: '3', name: 'A day in paradise', genre: 'Non-Fiction', authorId: '3'  },
//     { id: '4', name: 'The Famous Five', genre: 'Fantasy', authorId: '2'  },
//     { id: '5', name: 'Blood Line ', genre: 'Crime', authorId: '3'  }
// ];

// // dummy data for authors
// let authors = [
//     { auth_id: '1', name: 'Steve Hamilton', age: 33 },
//     { auth_id: '2', name: 'Nancy Drew', age: 45 },
//     { auth_id: '3', name: 'Sydney Sheldon', age: 67 }
// ];

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: { type:AuthorType,
        resolve(parent, args) {
            console.log('parent', parent);// this will return book object for which id UI has hit
            // for eg. { id: '1', name: 'Harry Potter', genre: 'Fiction', authorId: '1' }
            // return _.find(authors, {auth_id: parent.authorId}); 
            // we want to match the book we have queried in that authorId(in parent)
            // with the args.id
            return Author.findById(parent.authorId);
        } }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        // books: {type: BookType, // it's not going to be BOOKType as an author
        // could have multiple books not just a single book.
        books: { type: new GraphQLList (BookType),
        resolve(parent, args){
            console.log('-parent-', parent);
            console.log('-args-', args);
            // return _.filter(books, {authorId:parent.auth_id})
            return Book.find({authorId:parent.id});
        }}
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                console.log(typeof (args.id));
                // code to get data from DB or anyother source using args.id
                // return _.find(books, { id: args.id });
                return Book.findById(args.id);
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // return _.find(authors, { auth_id: args.id });
                return Author.findById(args.id);
            }
        },
        books: {
            type: new GraphQLList(BookType), // The type will not be just a BookType(object), but a list of books
            resolve(parent, args){
                // return books;
                return Book.find({});
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args){
                // return authors;
                return Author.find({});
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)},
            },
            resolve(parent, args) {
                let author = new Author({
                    name:  args.name,
                    age: args.age
                });
               return author.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                genre: {type: new GraphQLNonNull(GraphQLString)},
                authorId : {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args){
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                })
                return book.save();
            }
        }
    }
})

// book(id:'123'){
//     name: '',
//     genre: ''
// }


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})