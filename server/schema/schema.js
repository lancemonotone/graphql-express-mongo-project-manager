// Mongoose models
const Project = require( '../models/Project' )
const Client = require( '../models/Client' )
const Status = require( '../models/Status' )

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
    GraphQLEnumType
} = require( 'graphql' )

// Status Type
const StatusType = new GraphQLObjectType( {
    name: 'Status',
    fields: () => ( {
        id: { type: GraphQLID },
        name: { type: GraphQLString }
    } )
} )

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
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: {
            type: StatusType,
            resolve: ( parent, args ) => Status.findById( parent.statusId )
        },
        client: {
            type: ClientType,
            resolve: ( parent, args ) => Client.findById( parent.clientId )
        }
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
        },
        statuses: {
            type: new GraphQLList( StatusType ),
            resolve: () => Status.find()
        },
        status: {
            type: StatusType,
            args: { id: { type: GraphQLID } },
            resolve: ( parent, args ) => Status.findById( args.id )
        }
    }
} )

const mutation = new GraphQLObjectType( {
    name: 'Mutation',
    fields: {
        // Add Client
        addClient: {
            type: ClientType,
            args: {
                name: { type: GraphQLNonNull( GraphQLString ) },
                email: { type: GraphQLNonNull( GraphQLString ) },
                phone: { type: GraphQLNonNull( GraphQLString ) }
            },
            resolve: ( parent, args ) => {
                const client = new Client( {
                    name: args.name,
                    email: args.email,
                    phone: args.phone
                } )

                return client.save()
            }
        },
        // Delete Client
        deleteClient: {
            type: ClientType,
            args: {
                id: { type: GraphQLNonNull( GraphQLID ) }
            },
            resolve: ( parent, args ) => {
                Project.find( { clientId: args.id } )
                    .then( ( projects ) => {
                        projects.forEach( ( project ) => {
                            project.remove()
                        } )
                    } )
                return Client.findByIdAndDelete( args.id )
            }
        },
        // Add Project
        addProject: {
            type: ProjectType,
            args: {
                name: { type: GraphQLNonNull( GraphQLString ) },
                description: { type: GraphQLNonNull( GraphQLString ) },
                clientId: { type: GraphQLNonNull( GraphQLID ) },
                statusId: { type: GraphQLNonNull( GraphQLID ) }
            },
            resolve: ( parent, args ) => {
                const project = new Project( {
                    name: args.name,
                    description: args.description,
                    statusId: args.statusId,
                    clientId: args.clientId
                } )

                return project.save()
            }

        },
        // Delete Project
        deleteProject: {
            type: ProjectType,
            args: {
                id: { type: GraphQLNonNull( GraphQLID ) }
            },
            resolve: ( parent, args ) => Project.findByIdAndRemove( args.id )
        },
        // Update Project
        updateProject: {
            type: ProjectType,
            args: {
                id: { type: GraphQLNonNull( GraphQLID ) },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                statusId: { type: GraphQLNonNull( GraphQLID ) },
                clientId: { type: GraphQLNonNull( GraphQLID ) }
            },
            resolve: ( parent, args ) => {
                return Project.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            name: args.name,
                            description: args.description,
                            statusId: args.statusId,
                            clientId: args.clientId
                        }
                    },
                    { new: true }
                )
            }
        },
        // Add Status
        addStatus: {
            type: StatusType,
            args: {
                name: { type: GraphQLNonNull( GraphQLString ) }
            },
            resolve: ( parent, args ) => {
                const status = new Status( {
                    name: args.name
                } )

                return status.save()
            }
        },
        // Delete Status
        deleteStatus: {
            type: StatusType,
            args: {
                id: { type: GraphQLNonNull( GraphQLID ) }
            },
            resolve: ( parent, args ) => Status.findByIdAndRemove( args.id )
        }
    }
} )

module.exports = new GraphQLSchema( {
    query: RootQuery,
    mutation
} )