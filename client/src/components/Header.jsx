import logo from '../assets/logo.svg'

const Header = () => {
    return (
        <div>
            <nav className="navbar bg-light mb-4 p-0">
                <div className="container">
                    <a href="/" className="navbar-brand d-flex">
                        <img src={ logo } alt="GraphQL logo"/>
                        Project Management
                    </a>
                </div>
            </nav>
        </div>
    )
}

export default Header
