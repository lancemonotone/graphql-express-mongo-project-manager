// Mongoose models
const Project = require( '../models/Project' )
const Client = require( '../models/Client' )

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLSchema,
    GraphQLList
} = require( 'graphql' )

// Client Type
const ClientType = new GraphQLObjectType( {
    name: 'Client',
    fields: () => ( {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString }
    } )
} )

// Project Type
const ProjectType = new GraphQLObjectType( {
    name: 'Project',
    fields: () => ( {
        id: { type: GraphQLID },
        client: {
            type: ClientType,
            resolve: ( parent, args ) => Client.findById( parent.clientId )
        },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString }
    } )
} )

// Query
const RootQuery = new GraphQLObjectType( {
    name: 'RootQueryType',
    fields: {
        projects: {
            type: new GraphQLList( ProjectType ),
            resolve: () => Project.find()
        },
        project: {
            type: ProjectType,
            args: { id: { type: GraphQLID } },
            resolve: ( parent, args ) => Project.findById( args.id )
        },
        clients: {
            type: new GraphQLList( ClientType ),
            resolve: () => Client.find()
        },
        client: {
            type: ClientType,
            args: { id: { type: GraphQLID } },
            resolve: ( parent, args ) => Client.findById( args.id )
        }
    }
} )

module.exports = new GraphQLSchema( {
    query: RootQuery
} )