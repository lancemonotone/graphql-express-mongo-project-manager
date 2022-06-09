import Projects from '../components/projects/Projects'
import AddClientForm from '../components/clients/AddClientForm'
import Clients from '../components/clients/Clients'
import AddProjectForm from '../components/projects/AddProjectForm'

const Home = () => {
    return (
        <>
            <div className="d-flex gap-3 mb-4">
                <AddClientForm/>
                <AddProjectForm/>
            </div>
            <Projects/>
            <hr/>
            <Clients/>
        </>
    )
}

export default Home