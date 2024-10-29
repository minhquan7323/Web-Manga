import { useQuery } from "@tanstack/react-query"
import * as OrderService from '../services/OrderService.js'
import Loading from "../components/Loading/Loading.js"
import { useLocation, useNavigate } from "react-router-dom"
import { useMutationHooks } from '../hooks/useMutationHook.js'
import * as message from "../components/Message/Message"
import { useEffect } from "react"

function MyOrderPage() {
    const location = useLocation()
    const navigate = useNavigate()
    const { state } = location

    const fetchAllMyOrder = async () => {
        const res = await OrderService.getAllDetailsOrder(state?.id, state?.access_token)
        return res.data
    }

    const queryOrder = useQuery({
        queryKey: ['orders'],
        queryFn: fetchAllMyOrder,
        retry: 3,
        retryDelay: 1000,
        enabled: Boolean(state?.id && state?.access_token)
    })

    const { isLoading, data } = queryOrder

    const renderProduct = (orderItems) => {
        return orderItems?.map((item) => {
            return (
                <img key={item?._id} src={item?.image} width={50} alt="Product" />
            )
        })
    }

    const mutationCancel = useMutationHooks(
        async (data) => {
            const { id, access_token, orderItems } = data
            const res = await OrderService.cancelOrder(id, access_token, orderItems)
            return res
        }
    )
    const { data: dataCancel, isSuccess: isSuccessCancel, isError: isErrorCancel } = mutationCancel
    const isLoadingCancel = mutationCancel.isPending

    const handleDetailsOrder = (id) => {
        navigate(`/detailsorder/${id}`, {
            state: {
                access_token: state?.access_token
            }
        })
    }
    const handleCancelOrder = (order) => {
        mutationCancel.mutate({ id: order?._id, access_token: state?.access_token, orderItems: order?.orderItems }, {
            onSuccess: () => {
                queryOrder.refetch()
            }
        })
    }

    useEffect(() => {
        if (isSuccessCancel && dataCancel?.status === 'OK')
            message.success()
        else if (isErrorCancel)
            message.error()
    }, [isSuccessCancel, isErrorCancel])

    return (
        <Loading isLoading={isLoading || isLoadingCancel}>
            <h1>MyOrderPage</h1>
            {data?.map((order) => {
                return (
                    <div key={order?._id}>
                        <h1>key: {order?._id}</h1>
                        {renderProduct(order?.orderItems)}
                        <h1>delivery: {order?.delivery ? 'roi' : 'chua'}</h1>
                        <h1>isPaid: {order?.isPaid ? 'roi' : 'chua'}</h1>
                        <button onClick={() => handleCancelOrder(order)}>calcel order</button>
                        <button onClick={() => handleDetailsOrder(order?._id)}>details</button>
                    </div>
                )
            })}
        </Loading>
    )
}

export default MyOrderPage
