import { useState } from 'react'
import { FaList } from 'react-icons/fa'
import { gql, useMutation, useQuery } from '@apollo/client'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { ADD_PROJECT } from '../../mutations/projectMutations'
import { GET_PROJECTS } from '../../queries/projectQueries'
import Spinner from '../Spinner'
import { GET_STATUSES } from '../../queries/statusQueries'
import { GET_CLIENTS } from '../../queries/clientQueries'

const AddProjectForm = () => {
    const { loading: loadingStatuses, error: errorStatuses, data: dataStatuses } = useQuery( GET_STATUSES )
    const { loading: loadingClients, error: errorClients, data: dataClients } = useQuery( GET_CLIENTS )

    const [ name, setName ] = useState( '' )
    const [ description, setDescription ] = useState( '' )
    const [ statusId, setStatusId ] = useState( '' )
    const [ clientId, setClientId ] = useState( '' )

    const [ addProject ] = useMutation( ADD_PROJECT, {
        variables: { name, description, statusId, clientId },
        update: ( cache, { data: { addProject } } ) => {
            const { projects } = cache.readQuery( { query: GET_PROJECTS } )
            cache.writeQuery( {
                query: GET_PROJECTS,
                data: { projects: [ ...projects, addProject ] }
            } )
        }
    } )

    const [ validated, setValidated ] = useState( false )

    const [ show, setShow ] = useState( false )
    const handleClose = () => setShow( false )
    const handleShow = () => {
        setName( '' )
        setDescription( '' )
        setStatusId( '' )
        setClientId( '' )
        setValidated( false )
        setShow( true )
    }

    const handleSubmit = e => {
        e.preventDefault()
        e.stopPropagation()
        const form = e.currentTarget
        if ( form.checkValidity() === false ) {
        } else {
            addProject()
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
            <Button variant="secondary" onClick={ handleShow }>
                <div className="d-flex align-items-center">
                    <FaList className="me-2"/>Add Project
                </div>
            </Button>

            <Modal show={ show } onHide={ handleClose } animation={ true }>
                <Modal.Header closeButton>
                    <Modal.Title>Add Project</Modal.Title>
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
                                         arial-label={ 'Select status' }
                                         // value={ statusId }
                                         defaultValue={ data.statuses[ 0 ].id }
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

                        <Button variant={ 'secondary' } type={ 'submit' }>Add Project</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default AddProjectForm
