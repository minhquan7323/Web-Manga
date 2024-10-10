import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Loading from '../Loading/Loading'
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import * as UserService from '../../services/UserService'
import { resetUser } from '../../redux/userSlide';
const Header = () => {
    const user = useSelector((state) => state.user)

    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false)
    const handleSignOut = async () => {
        setIsLoading(true)
        await UserService.signOutUser()
        dispatch(resetUser())
        setIsLoading(false)
    }
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
                        <Form.Control type="search" placeholder="Search" className="me-2" aria-label="Search" />
                        <Button variant="outline-success">Search</Button>
                    </Form>
                    <Loading isLoading={isLoading}>
                        {user?.name ? (
                            <>
                                <OverlayTrigger
                                    trigger="click"
                                    key={'bottom'}
                                    placement={'bottom'}
                                    overlay={
                                        <Popover id={`popover-positioned-${'bottom'}`}>
                                            {/* <Popover.Header as="h3">{`Popover ${'bottom'}`}</Popover.Header> */}
                                            <Popover.Body>
                                                <div>
                                                    info acc
                                                </div>
                                                <div onClick={handleSignOut}>
                                                    log out acc
                                                </div>
                                            </Popover.Body>
                                        </Popover>
                                    }
                                >
                                    <Navbar.Text className='header-user'>
                                        <span className='header-user-icon'>
                                            <i className="fa-solid fa-user"></i>
                                        </span>
                                        <span className='header-user-name'>
                                            Hi, {user.name}
                                        </span>

                                    </Navbar.Text>
                                </OverlayTrigger>

                            </>
                        ) : (
                            <NavLink to="/signin" className='nav-link signin-button'>
                                <Button variant="primary">Sign In</Button>
                            </NavLink>
                        )}
                    </Loading>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
