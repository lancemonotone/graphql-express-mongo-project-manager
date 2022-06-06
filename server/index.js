const express = require( 'express' )
const colors = require('colors')
require( 'dotenv' ).config()
const connectDb = require('./config/db')
const { graphqlHTTP } = require( 'express-graphql' )
const schema = require( './schema/schema' )
const { connect } = require( 'mongoose' )
const port = process.env.PORT || 5000
const app = express()

connectDb()

app.use(
    '/graphql',
    graphqlHTTP( {
        schema,
        graphiql: process.env.NODE_ENV === 'development'
    } )
)

app.listen( port, console.log( `Server running on port ${ port }` ) )