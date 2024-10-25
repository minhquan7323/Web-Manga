import axios from "axios"

export const axiosJWT = axios.create()

// export const getAllProduct = async (search, limit) => {
//     let res = {}
//     if (search?.length > 0) {
//         res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getall?filter=name&filter=${search}&limit=${limit}`)
//     } else {
//         res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getall?limit=${limit}`)
//     }
//     return res.data
// }
export const getAllProduct = async (search, types, limit, page) => {
    let res = {}
    let filterParams = []
    if (search?.length > 0) {
        filterParams.push(`filter=name&filter=${search}`)
    }
    if (types?.length > 0) {
        types.forEach(type => {
            filterParams.push(`filter=type&filter=${type}`)
        })
    }
    if (page) {
        filterParams.push(`page=${page}`)
    }
    if (limit) {
        filterParams.push(`limit=${limit}`)
    }
    const queryString = filterParams.length > 0 ? `&${filterParams.join('&')}` : ''
    res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getall?${queryString}`)
    return res.data
}


export const getTypeProduct = async (types) => {
    const filterParams = types.map(type => `filter=type&filter=${type}`).join('&')
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getall?${filterParams}`)
    return res.data
}

export const getAllTypeProduct = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getalltypeproduct`)
    return res.data
}

export const createProduct = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/product/create`, data)
    return res.data
}

export const updateProduct = async (id, data, access_token) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/product/update/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getDetailsProduct = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/details/${id}`)
    return res.data
}

export const deleteProduct = async (id, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/product/delete/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const deleteManyProducts = async (ids, access_token) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/product/deletemany`, ids, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}