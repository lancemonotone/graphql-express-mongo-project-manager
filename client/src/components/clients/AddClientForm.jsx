import { useState } from 'react'
import { FaUser } from 'react-icons/fa'
import { useMutation } from '@apollo/client'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { ADD_CLIENT } from '../../mutations/clientMutations'
import { GET_CLIENTS } from '../../queries/clientQueries'

const AddClientForm = () => {
    const [ name, setName ] = useState( '' )
    const [ email, setEmail ] = useState( '' )
    const [ phone, setPhone ] = useState( '' )

    const [ addClient, { loading, error } ] = useMutation( ADD_CLIENT, {
        variables: { name, email, phone },
        update: ( cache, { data: { addClient } } ) => {
            const { clients } = cache.readQuery( { query: GET_CLIENTS } )
            cache.writeQuery( {
                query: GET_CLIENTS,
                data: { clients: [ ...clients, addClient ] }
            } )
        }
    } )

    const [ validated, setValidated ] = useState( false )

    const [ show, setShow ] = useState( false )
    const handleClose = () => setShow( false )
    const handleShow = () => {
        setName( '' )
        setEmail( '' )
        setPhone( '' )
        setValidated( false )
        setShow( true )
    }

    const handleSubmit = e => {
        e.preventDefault()
        e.stopPropagation()
        const form = e.currentTarget
        if ( form.checkValidity() === false ) {
        } else {
            addClient()
                .then( res => {
                    handleClose()
                } )
        }
        setValidated( true )
    }

    return (
        <>
            <Button variant="secondary" onClick={ handleShow }>
                <div className="d-flex align-items-center">
                    <FaUser className="me-2"/>Add Client
                </div>
            </Button>

            <Modal show={ show } onHide={ handleClose } animation={ true }>
                <Modal.Header closeButton>
                    <Modal.Title>Add Client</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form noValidate validated={ validated } onSubmit={ handleSubmit }>
                        <Form.Group className={ 'mb-3' } controlId={ 'formClientName' }>
                            <Form.Label>Name</Form.Label>
                            <Form.Control type={ 'text' }
                                          required
                                          placeholder={ 'Enter name' }
                                          value={ name }
                                          onChange={ e => setName( e.target.value ) }
                                          autoComplete={ 'turn' }/>
                            <Form.Control.Feedback type={ 'invalid' }>Please enter a name.</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className={ 'mb-3' } controlId={ 'formClientEmail' }>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type={ 'email' }
                                          required
                                          placeholder={ 'Enter email' }
                                          value={ email }
                                          onChange={ e => setEmail( e.target.value ) }
                                          autoComplete={ 'turnoff' }/>
                            <Form.Control.Feedback
                                type={ 'invalid' }>Please enter a valid email.</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className={ 'mb-3' } controlId={ 'formClientPhone' }>
                            <Form.Label>Phone</Form.Label>
                            <Form.Control type={ 'text' }
                                          required
                                          pattern={ '[0-9]{3}-[0-9]{3}-[0-9]{4}' }
                                          placeholder={ 'Enter phone' }
                                          value={ phone }
                                          onChange={ e => setPhone( e.target.value ) }
                                          autoComplete={ 'turnoff' }/>
                            <Form.Control.Feedback type={ 'invalid' }>Please enter a phone: xxx-xxx-xxxx.</Form.Control.Feedback>
                        </Form.Group>
                        <Button variant={ 'secondary' } type={ 'submit' }>Add Client</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default AddClientForm
