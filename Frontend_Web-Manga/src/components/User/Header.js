import Button from 'react-bootstrap/Button'
import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Loading from '../Loading/Loading'
import { useNavigate, NavLink, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import * as UserService from '../../services/UserService'
import * as message from "../../components/Message/Message.js";
import { resetUser } from '../../redux/userSlide'

const Header = () => {
    const user = useSelector((state) => state.user)
    const [userName, setUserName] = useState('')
    const [userAvatar, setUserAvatar] = useState('')
    const navigate = useNavigate()

    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false)

    const [showPopover, setShowPopover] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        setUserName(user?.name || '');
        setUserAvatar(user?.avatar || '');
        setIsLoading(false);
    }, [user?.name, user?.avatar]);

    const handleSignOut = async () => {
        setIsLoading(true);
        await UserService.signOutUser();
        message.success();
        navigate('/')
        dispatch(resetUser());
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_id');
        setIsLoading(false);
        setShowPopover(false);
    }

    const handleProfileUser = () => {
        navigate('/profileuser')
        setShowPopover(false)
    }
    const handleSystemManagement = () => {
        navigate('/system/admin')
        setShowPopover(false)
    }
    const adminPath = useLocation().pathname.startsWith('/system/admin')
    return (
        <Navbar expand="lg" className="bg-body-tertiary fixed-top" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
            <Container fluid>
                <Navbar.Brand>Logo</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse id="navbarScroll">
                    {!adminPath ? (
                        <>
                            <Nav className="me-auto my-2 my-lg-0">
                                <NavLink to="/" className='nav-link'>Home</NavLink>
                                <NavLink to="/Product" className='nav-link'>Product</NavLink>
                                <NavLink to="/Cart" className='nav-link'>Cart</NavLink>
                            </Nav>
                            <Form className="d-flex item-center">
                                <Form.Control type="search" placeholder="Search" className="me-2" aria-label="Search" />
                                <Button variant="outline-success">Search</Button>
                            </Form>
                        </>
                    ) : null}
                </Navbar.Collapse>
                <Navbar.Collapse id="navbarScroll" style={{ flexGrow: 'unset' }}>
                    <Loading isLoading={isLoading}>
                        {user?.access_token ? (
                            <>
                                <OverlayTrigger
                                    trigger="click"
                                    key={'bottom'}
                                    placement={'bottom'}
                                    overlay={
                                        <Popover id={`popover-positioned-${'bottom'}`}>
                                            {/* <Popover.Header as="h3">{`Popover ${'bottom'}`}</Popover.Header> */}
                                            <Popover.Body>
                                                <div className='header-account'>
                                                    <div onClick={handleProfileUser}>
                                                        info acc
                                                    </div>
                                                    <div onClick={handleSignOut}>
                                                        log out acc
                                                    </div>
                                                    {user?.isAdmin ? (
                                                        <div onClick={handleSystemManagement}>
                                                            system management
                                                        </div>
                                                    ) : (<></>)}

                                                </div>
                                            </Popover.Body>
                                        </Popover>
                                    }
                                    show={showPopover}
                                    onToggle={(nextShow) => setShowPopover(nextShow)}
                                >
                                    <Navbar.Text className='header-user'>
                                        <span className='header-user-icon'>
                                            {userAvatar ? (
                                                <img src={userAvatar} alt="avatar" style={{ height: '32px' }} />
                                            ) : (
                                                <i className="fa-solid fa-user"></i>
                                            )}
                                        </span>
                                        <span className='header-user-name'>
                                            Hi, {userName}
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
    )
}

export default Header