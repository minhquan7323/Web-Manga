import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Loading from '../Loading/Loading.js'
import { useNavigate, NavLink, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import * as UserService from '../../services/UserService.js'
import * as message from "../Message/Message.js"
import { resetUser } from '../../redux/userSlide.js'
import { searchProduct } from '../../redux/productSlide.js'

const Header = () => {
    const user = useSelector((state) => state.user)
    const order = useSelector((state) => state.order)
    const [userName, setUserName] = useState('')
    const [userAvatar, setUserAvatar] = useState('')
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false)
    const [showPopover, setShowPopover] = useState(false)
    const [navbarExpanded, setNavbarExpanded] = useState(false)
    const [search, setSearch] = useState('')

    useEffect(() => {
        setIsLoading(true)
        setUserName(user?.name || '')
        setUserAvatar(user?.avatar || '')
        setIsLoading(false)
    }, [user?.name, user?.avatar])

    const handleSignOut = async () => {
        setIsLoading(true)
        await UserService.signOutUser()
        message.success()
        navigate('/')
        dispatch(resetUser())
        localStorage.removeItem('access_token')
        localStorage.removeItem('user_id')
        setIsLoading(false)
        setShowPopover(false)
        setNavbarExpanded(false)
    }
    const handleNavhidden = () => {
        setShowPopover(false)
        setNavbarExpanded(false)
    };
    const handleClickNav = (type) => {
        if (type === 'myorder') {
            navigate(`/myorder`, {
                state: {
                    id: user?.id,
                    access_token: user?.access_token
                }
            })
        } else if (type === 'admin') {
            navigate('/system/admin')
        } else if (type === 'profileuser') {
            navigate('/profileuser', {
                state: {
                    id: user?.id,
                    access_token: user?.access_token
                }
            })
        } else {
            handleSignOut()
        }
        handleNavhidden()
    }

    const adminPath = useLocation().pathname.startsWith('/system/admin')

    const onSearch = () => {
        dispatch(searchProduct(search))
    }

    return (
        <Navbar expand="lg" className="bg-body-tertiary fixed-top" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }} expanded={navbarExpanded}>
            <Container fluid>

                <Navbar.Brand ><NavLink to="/" className='nav-link' onClick={() => handleNavhidden()}>Logo</NavLink></Navbar.Brand>
                <Navbar.Toggle onClick={() => setNavbarExpanded(!navbarExpanded)} />
                <Navbar.Collapse id="navbarScroll">
                    {!adminPath ? (
                        <>
                            <Nav className="me-auto my-2 my-lg-0">
                                <NavLink to="/" className='nav-link' onClick={() => handleNavhidden()}>Home</NavLink>
                                <NavLink to="/Product" className='nav-link' onClick={() => handleNavhidden()}>Product</NavLink>
                                <NavLink className='nav-link position-relative' to="/Cart" onClick={() => handleNavhidden()}>
                                    Cart <i className="fas fa-cart-shopping"></i>
                                    {order?.orderItems?.length > 0 ? (
                                        <span>
                                            <Badge className='translate-middle badge rounded-pill' style={{ marginLeft: '5px', minWidth: '22px', padding: '5px' }} bg="warning" text="dark">
                                                {order?.orderItems?.length}
                                            </Badge>
                                        </span>
                                    ) : null}
                                </NavLink>
                            </Nav>
                            <Form className="d-flex item-center">
                                <Form.Control
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    type="search"
                                    placeholder="Search here"
                                    className="me-2"
                                    aria-label="Search"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                                <Button variant="outline-success" onClick={onSearch} >
                                    Search
                                </Button>
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
                                                    <div onClick={() => handleClickNav('profileuser')}>
                                                        User information
                                                    </div>
                                                    <div onClick={() => handleClickNav('myorder')}>
                                                        My order
                                                    </div>
                                                    {user?.isAdmin ? (
                                                        <div onClick={() => handleClickNav('admin')}>
                                                            System management
                                                        </div>
                                                    ) : (<></>)}
                                                    <div onClick={() => handleClickNav()}>
                                                        Sign out
                                                    </div>
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
                                                <img src={userAvatar} alt="avatar" />
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
                                <Button variant="primary" onClick={() => setNavbarExpanded(false)}>Sign In</Button>
                            </NavLink>
                        )}
                    </Loading>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header