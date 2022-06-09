import { gql } from '@apollo/client'

export const DELETE_PROJECT = gql`
    mutation deleteProject($id: ID!) {
        deleteProject(id: $id) {
            id
        }
    }
`

export const ADD_PROJECT = gql`
    mutation addProject($name: String!, $description: String!, $statusId: ID!, $clientId: ID!) {
        addProject(name: $name, description: $description, statusId: $statusId, clientId: $clientId) {
            id
            name
            description
            status {
                name
                id
            }
            client {
                name
                id
            }
        }
    }
`

export const UPDATE_PROJECT = gql`
    mutation updateProject($id: ID!, $name: String!, $description: String!, $statusId: ID!, $clientId: ID!) {
        updateProject(id: $id, name: $name, description: $description, statusId: $statusId, clientId: $clientId) {
            id
            name
            description
            status {
                name
                id
            }
            client {
                name
                id
            }
        }
    }
`