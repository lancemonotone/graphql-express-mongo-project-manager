const mongoose = require( 'mongoose' )

const StatusSchema = new mongoose.Schema( {
    name: {
        type: String
    }
} )

module.exports = mongoose.model( 'Status', StatusSchema )