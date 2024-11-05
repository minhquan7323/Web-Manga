const Product = require('../models/ProductModel')

const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const { name, image, type, price, stock, description } = newProduct
        try {
            const checkProduct = await Product.findOne({
                name: name
            })
            if (checkProduct !== null) {
                resolve({
                    status: 'ERR',
                    message: 'The name of product is already'
                })
            }
            const newProduct = await Product.create({
                name,
                image,
                type,
                price,
                stock,
                description
            })
            if (newProduct) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: newProduct
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}

const updateProduct = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            })

            if (checkProduct === null) {
                resolve({
                    status: 'ERR',
                    message: 'The product is not defined'
                })
            }

            const updateProduct = await Product.findByIdAndUpdate(id, data, { new: true })

            resolve({
                status: 'OK',
                message: 'Update product success',
                data: updateProduct
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

const detailsProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findOne({ _id: id })

            if (product === null) {
                return resolve({
                    status: 'ERR',
                    message: 'The product is not defined'
                })
            }

            resolve({
                status: 'OK',
                message: 'Success',
                data: product
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({ _id: id })

            if (checkProduct === null) {
                return resolve({
                    status: 'ERR',
                    message: 'The product is not defined'
                })
            }

            await Product.findByIdAndDelete(id)

            resolve({
                status: 'OK',
                message: 'Delete product success'
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteManyProducts = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Product.deleteMany({ _id: ids })

            resolve({
                status: 'OK',
                message: 'Delete products success'
            })
        } catch (e) {
            reject(e)
        }
    })
}

const allProduct = (limit, page, sort, filter, searchQuery) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = {}
            if (searchQuery) {
                query['name'] = { '$regex': searchQuery, '$options': 'i' }
            }
            if (filter) {
                filter.forEach((f, index) => {
                    if (index % 2 === 0) {
                        query[f] = { '$regex': filter[index + 1], '$options': 'i' }
                    }
                })
            }

            const totalProduct = await Product.countDocuments()
            const totalProductFilter = await Product.countDocuments(query)

            let productQuery = Product.find(query)
            if (sort) {
                const objectSort = {}
                objectSort[sort[1]] = sort[0]
                productQuery = productQuery.sort(objectSort)
            }

            productQuery = productQuery.limit(limit).skip((page - 1) * limit)
            const allProduct = await productQuery

            resolve({
                status: 'OK',
                message: 'Success',
                data: allProduct,
                totalProduct,
                totalProductFilter,
                currentPage: Number(page),
                totalPage: Math.ceil(totalProductFilter / limit)
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllTypeProduct = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allType = await Product.distinct('type')
            resolve({
                status: 'OK',
                message: 'Success',
                data: allType
            })
        } catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    createProduct,
    updateProduct,
    detailsProduct,
    deleteProduct,
    allProduct,
    deleteManyProducts,
    getAllTypeProduct
}