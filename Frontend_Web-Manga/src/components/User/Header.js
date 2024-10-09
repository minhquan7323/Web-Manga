import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
const Header = () => {
    const user = useSelector((state) => state.user)
    return (
        <Navbar expand="lg" className="bg-body-tertiary fixed-top" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
            <Container fluid>
                <Navbar.Brand>Logo</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse id="navbarScroll">
                    <Nav className="me-auto my-2 my-lg-0">
                        <NavLink to="/" className='nav-link'>Home</NavLink>
                        <NavLink to="/Product" className='nav-link'>Product</NavLink>
                        <NavLink to="/Cart" className='nav-link'>Cart</NavLink>
                    </Nav>
                    <Form className="d-flex item-center">
                        <Form.Control
                            type="search"
                            placeholder="Search"
                            className="me-2"
                            aria-label="Search"
                        />
                        <Button variant="outline-success">Search</Button>
                    </Form>
                    {user?.name ? (
                        <Navbar.Text className='header-user'>
                            <span className='header-user-icon'>
                                <i class="fa-solid fa-user"></i>
                            </span>
                            <span className='header-user-name'>
                                Hi, {user.name}
                            </span>
                        </Navbar.Text>
                    ) : (
                        <NavLink to="/signin" className='nav-link signin-button'>
                            <Button className="btn btn-primary">
                                Sign In
                            </Button>
                        </NavLink>
                    )}

                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;