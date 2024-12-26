import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as OrderService from '../services/OrderService.js'
import Loading from "../components/Loading/Loading.js";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { convertPrice } from "../utils.js";
import { format } from 'date-fns'
import parse from 'date-fns/parse'
import { orderContant } from "../contant.js";
import { useSelector } from "react-redux";

function DetailsOrderPage() {
    const params = useParams()
    const { id } = params
    const navigate = useNavigate()
    const location = useLocation()
    const { state } = location
    const user = useSelector((state) => state?.user)

    const fetchDetailsOrder = async () => {
        const res = await OrderService.getDetailsOrder(id, state?.access_token)
        return res.data
    }
    const queryOrder = useQuery({
        queryKey: ['order-details'],
        queryFn: fetchDetailsOrder,
        retry: 3,
        retryDelay: 1000,
        enabled: Boolean(id)
    })
    const { isLoading, data: detailsOrder } = queryOrder

    const handleClickNav = () => {
        navigate(`/myorder`, {
            state: {
                id: user?.id,
                access_token: user?.access_token
            }
        })
    }

    return (
        <Loading isLoading={isLoading}>
            <nav style={{ '--bs-breadcrumb-divider': '>' }} aria-label="breadcrumb">
                <ol className="breadcrumb m-0" style={{ paddingTop: 10, paddingLeft: 10 }}>
                    <li className="breadcrumb-item">
                        <a href="/" style={{ textDecoration: 'none', color: 'black' }}>
                            <b>Home</b>
                        </a>
                        <span> &gt; </span>
                        <a href="/profileuser" style={{ textDecoration: 'none', color: 'black' }}>
                            <b>Profile</b>
                        </a>
                        <span> &gt; </span>
                        <a onClick={handleClickNav} style={{ textDecoration: 'none', color: 'black' }}>
                            <b>Order</b>
                        </a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">&gt; Details</li>
                </ol>
            </nav>

            <Container className="my-order item-center" style={{ maxWidth: '100%', margin: '0 auto' }}>
                <Col xs={12} sm={12} md={9} lg={8} className="my-order-content-block">
                    <div className='my-order-content-right bg'>
                        <div className="my-order-delivery">
                        </div>
                        <div>
                            <Row className="g-2 item-center">
                                <div className="my-order-delivery">
                                    <span className="my-order-code">Order code: {detailsOrder?._id}</span>
                                    <span>{detailsOrder?.delivery ? 'Delivered' : 'In delivery'}</span>
                                </div>
                                <div>
                                    {detailsOrder?.shippingAddress?.fullName} - 0{detailsOrder?.shippingAddress?.phone} - {detailsOrder?.shippingAddress?.address}
                                </div>
                                <hr style={{ width: '100%', margin: '20px 0' }} />
                                {detailsOrder?.orderItems?.map((order) => {
                                    return (
                                        <Col xs={12} className="my-order-item" key={order._id}>
                                            <Row className="item-center">
                                                <Col xs={3} className='my-order-img'>
                                                    <img src={order.image} alt={order.name} />
                                                </Col>
                                                <Col xs={9} className='my-order-details'>
                                                    <div className='my-order-name'>
                                                        <span>{order.name}</span>
                                                    </div>
                                                    <div className="my-order-price-amount">
                                                        <span>{convertPrice(order.price)} VND</span>
                                                        <div>x{order.amount}</div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    )
                                })}
                                <hr style={{ width: '100%', margin: '20px 0' }} />
                                <div style={{ fontSize: 14, color: 'darkgray' }}>
                                    Create order at:
                                    {/* {format(new Date(detailsOrder.createdAt), ' HH:mm:ss dd/MM/yyyy')} */}
                                    {
                                        detailsOrder?.createdAt
                                            ? format(new Date(detailsOrder.createdAt), ' HH:mm:ss dd/MM/yyyy')
                                            : 'Unknown'
                                    }
                                </div>
                                <div style={{ justifyContent: 'flex-end' }}>
                                    <div>
                                        <div>
                                            <span>Item price: </span>
                                            <span>{convertPrice(detailsOrder?.itemsPrice)} VND</span>
                                        </div>
                                        <div>
                                            <span>Shipping fee: </span>
                                            <span>{convertPrice(detailsOrder?.shippingPrice)} VND</span>
                                        </div>
                                        <div>
                                            <span>Total: </span>
                                            <span>{convertPrice(detailsOrder?.totalPrice)} VND</span>
                                        </div>
                                        <hr style={{ width: '100%', margin: '20px 0' }} />
                                        Paid: {detailsOrder?.isPaid ? detailsOrder?.paymentMethod : 'Unpaid'}

                                    </div>
                                </div>
                                <div>
                                </div>
                            </Row>
                        </div>
                    </div>
                </Col>
            </Container>
        </Loading>
    );
}

export default DetailsOrderPage;