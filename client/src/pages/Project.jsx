import { Link, useParams } from 'react-router-dom'
import { GET_PROJECT } from '../queries/projectQueries'
import { useQuery } from '@apollo/client'
import Spinner from '../components/Spinner'
import ClientInfo from '../components/clients/ClientInfo'
import DeleteProjectButton from '../components/projects/DeleteProjectButton'
import UpdateProjectForm from '../components/projects/UpdateProjectForm'

const Project = () => {
    const { id } = useParams()
    const { loading, error, data } = useQuery( GET_PROJECT, {
        variables: { id }
    } )

    if ( loading ) return <Spinner/>
    if ( error ) return <p>Error: { error.message }</p>

    return (
        <div className="mx-auto w-75 card p-5 d-flex align-content-center justify-content-center">
            <Link to={ '/' } className={ 'btn btn-light btn-sm w-25 d-inline ms-auto' }>Back</Link>
            <h1>{ data.project.name }</h1>
            <p>{ data.project.description }</p>

            <h5 className={ 'mt-3' }>Project Status</h5>
            <p className={ 'lead' }>{ data.project.status.name || null}</p>

            <ClientInfo client={ data.project.client }/>

            <div className={ 'd-flex mt-5 ms-auto justify-content-between gap-2' }>
                <UpdateProjectForm project={ data.project }/>
                <DeleteProjectButton projectId={ data.project.id }/>
            </div>
        </div>
    )
}

export default Project