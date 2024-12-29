import { useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'

function Footer() {
    const adminPath = useLocation().pathname.startsWith('/system/admin')
    const user = useSelector((state) => state.user)
    const navigate = useNavigate()

    const handleClickNav = (type) => {
        if (type === 'myorder') {
            navigate(`/myorder`, {
                state: {
                    id: user?.id,
                    access_token: user?.access_token
                }
            })
        } else if (type === 'profileuser') {
            navigate('/profileuser', {
                state: {
                    id: user?.id,
                    access_token: user?.access_token
                }
            })
        }
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    return (
        <>
            {!adminPath ? (
                <footer>
                    <div className="bg footer">
                        <div className="footer-inner">
                            <div className="container" style={{ maxWidth: '100%', margin: '0 auto' }}>
                                <div className="row" style={{ paddingTop: '10PX' }}>
                                    <div className="col-4" style={{ borderRight: '1px solid black' }}>
                                        <div>
                                            <h3 style={{ fontWeight: 'bold', color: '#009990' }}>Manga Shop</h3>
                                        </div>
                                        <div style={{ fontSize: 14 }}>
                                            <p>

                                                273 An D. Vuong, Ward 3, District 5, Ho Chi Minh City
                                            </p>
                                            <p>
                                                <b>Manga Shop</b> accepts online orders and delivers to your door. We do NOT support ordering and receiving goods directly at the office or all Manga Shop Systems nationwide.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div>
                                            <h6 style={{ fontWeight: 'bold', paddingBottom: '15px' }}>CONTACT</h6>
                                        </div>
                                        <div style={{ fontSize: 14 }}>
                                            <p>
                                                <i class="fa-solid fa-phone"></i>
                                                0123 456 789
                                            </p>
                                            <p>
                                                <i class="fa-solid fa-envelope"></i>
                                                mangashop@gmail.com
                                            </p>
                                            <p>
                                                <i class="fa-solid fa-location-dot"></i>
                                                273 An D. Vuong, District 5, HCM City
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div>
                                            <h6 style={{ fontWeight: 'bold', paddingBottom: '15px' }}>MY ACCOUNT</h6>
                                        </div>
                                        <div style={{ fontSize: 14 }}>
                                            <p onClick={() => handleClickNav('profileuser')} style={{ cursor: 'pointer' }}>
                                                <i class="fa-solid fa-user"></i>
                                                Account details
                                            </p>
                                            <p onClick={() => handleClickNav('myorder')} style={{ cursor: 'pointer' }}>
                                                <i class="fa-solid fa-receipt"></i>
                                                Purchase history
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            ) : null}
        </>
    );
}

export default Footer;
