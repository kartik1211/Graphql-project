const express = require('express');
const app = express();
const graphqlHTTP = require('express-graphql');
const port = 4000;
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

// allow cross-origin-requests
app.use(cors());

mongoose.connect('add_your_mongo_uri', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
   }).then(() => {
    console.log('connected to database');
   });

app.use('/graphql', graphqlHTTP({
    schema, //schema:schema
    graphiql: true
}));

app.listen(port, ()=>{
    console.log(`listening for requests on ${port}`);
});
