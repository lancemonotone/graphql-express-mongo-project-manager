const mongoose = require( 'mongoose' )

const ProjectSchema = new mongoose.Schema( {
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client'
    },
    name: {
        type: String
    },
    description: {
        type: String
    },
    statusId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Status'
    }
} )

module.exports = mongoose.model( 'Project', ProjectSchema )