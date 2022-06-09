import { gql } from '@apollo/client'

export const GET_STATUSES = gql`
    query getStatuses {
        statuses {
            id
            name
        }
    }
`