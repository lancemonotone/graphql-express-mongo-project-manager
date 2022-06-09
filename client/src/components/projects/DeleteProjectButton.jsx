import { useNavigate } from 'react-router-dom'
import { FaTrash } from 'react-icons/fa'
import { useMutation } from '@apollo/client'
import { DELETE_PROJECT } from '../../mutations/projectMutations'
import { GET_PROJECTS } from '../../queries/projectQueries'


const DeleteProjectButton = ( { projectId } ) => {
    const navigate = useNavigate()
    const [ deleteProject ] = useMutation( DELETE_PROJECT, {
        variables: { id: projectId }
    } )

    const deleteProjectHandler = () => {
        deleteProject()
            .then( res => {
                navigate( '/' )
            } )
            .catch( err => {
                console.log( err )
            } )
    }

    return (
        <button onClick={ deleteProjectHandler } className={ 'd-flex align-items-center btn btn-danger btn-sm' }>
            <FaTrash className="me-2"/> Delete Project
        </button>
    )
}

export default DeleteProjectButton