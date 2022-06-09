import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { GET_PROJECT } from '../../queries/projectQueries'
import { UPDATE_PROJECT } from '../../mutations/projectMutations'
import { GET_CLIENTS } from '../../queries/clientQueries'
import { GET_STATUSES } from '../../queries/statusQueries'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Spinner from '../Spinner'
import { FaEdit } from 'react-icons/fa'

const UpdateProjectForm = ( { project } ) => {
    const { loading: loadingStatuses, error: errorStatuses, data: dataStatuses } = useQuery( GET_STATUSES )
    const { loading: loadingClients, error: errorClients, data: dataClients } = useQuery( GET_CLIENTS )

    const [ name, setName ] = useState( project.name )
    const [ description, setDescription ] = useState( project.description )
    const [ statusId, setStatusId ] = useState( project.status.id )
    const [ clientId, setClientId ] = useState( project.client.id )
    const [ validated, setValidated ] = useState( false )

    const [ updateProject ] = useMutation( UPDATE_PROJECT, {
        variables: { id: project.id, name, description, statusId, clientId },
        refetchQueries: [ { query: GET_PROJECT, variables: { id: project.id } } ]
    } )

    const [ show, setShow ] = useState( false )
    const handleClose = () => setShow( false )
    const handleShow = () => {
        setValidated( false )
        setShow( true )
    }

    const handleSubmit = e => {
        e.preventDefault()
        e.stopPropagation()
        const form = e.currentTarget
        if ( form.checkValidity() === false ) {
        } else {
            updateProject()
                .then( res => {
                    handleClose()
                } )
                .catch( err => {
                        console.log( err )
                    }
                )
        }
        setValidated( true )
    }

    if ( loadingClients || loadingStatuses ) return <Spinner/>
    if ( errorClients || errorStatuses ) return <p>Error: { errorClients.message || errorStatuses.message }</p>

    const data = { ...dataStatuses, ...dataClients }

    return (
        <>
            <Button variant="secondary" onClick={ handleShow } className="d-flex align-items-center">
                <FaEdit className="me-2"/>Edit Project
            </Button>

            <Modal show={ show } onHide={ handleClose } animation={ true }>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Project</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={ validated } onSubmit={ handleSubmit }>
                        <Form.Group className={ 'mb-3' } controlId={ 'formProjectName' }>
                            <Form.Label>Name</Form.Label>
                            <Form.Control type={ 'text' }
                                          required
                                          placeholder={ 'Enter name' }
                                          value={ name }
                                          onChange={ e => setName( e.target.value ) }
                                          autoComplete={ 'turnoff' }/>
                            <Form.Control.Feedback type={ 'invalid' }>Please enter a name.</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className={ 'mb-3' } controlId={ 'formProjectDescription' }>
                            <Form.Label>Description</Form.Label>
                            <Form.Control as={ 'textarea' }
                                          required
                                          rows={ 4 }
                                          placeholder={ 'Enter description' }
                                          value={ description }
                                          onChange={ e => setDescription( e.target.value ) }
                                          autoComplete={ 'turnoff' }/>
                            <Form.Control.Feedback
                                type={ 'invalid' }>Please enter a valid description.</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className={ 'mb-3' } controlId={ 'formProjectStatus' }>
                            <Form.Label>Status</Form.Label>
                            <Form.Select className={ 'mb-3' }
                                         required
                                         arial-label={ 'Select client' }
                                         value={ statusId }
                                         onChange={ e => setStatusId( e.target.value ) }>
                                { data.statuses && data.statuses.map( status => (
                                    <option key={ status.id } value={ status.id }>{ status.name }</option>
                                ) ) }
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className={ 'mb-3' } controlId={ 'formProjectClient' }>
                            <Form.Label>Client</Form.Label>
                            <Form.Select className={ 'mb-3' }
                                         required
                                         arial-label={ 'Select client' }
                                         value={ clientId }
                                         onChange={ e => setClientId( e.target.value ) }>
                                <option value={ '' }>Select</option>
                                { data.clients && data.clients.map( client => (
                                    <option key={ client.id } value={ client.id }>{ client.name }</option>
                                ) ) }
                            </Form.Select>
                        </Form.Group>
                        <Button variant={ 'secondary' } type={ 'submit' }>Save Project</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default UpdateProjectForm