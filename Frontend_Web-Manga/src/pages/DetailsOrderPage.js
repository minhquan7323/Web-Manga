import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as OrderService from '../services/OrderService.js'
import Loading from "../components/Loading/Loading.js";

function DetailsOrderPage() {
    const params = useParams()
    const { id } = params
    const navigate = useNavigate()
    const location = useLocation()
    const { state } = location

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

    return (
        <Loading isLoading={isLoading}>
            <h1>Details order page</h1>
            fullname: {detailsOrder?.shippingAddress?.fullName}
            <div>
                {detailsOrder?.orderItems?.map((order) => {
                    return (
                        <div key={order?._id}>
                            <img src={order?.image} width={200} />
                        </div>
                    )
                })}
            </div>
        </Loading>
    );
}

export default DetailsOrderPage;