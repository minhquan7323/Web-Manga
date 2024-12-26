const Product = require('../models/ProductModel')
const Category = require('../models/CategoryModel')

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
            const product = await Product.findOne({ _id: id }).populate('type', 'name');

            if (!product) {
                return resolve({
                    status: 'ERR',
                    message: 'The product is not defined'
                });
            }

            resolve({
                status: 'OK',
                message: 'Success',
                data: product
            });
        } catch (e) {
            reject(e);
        }
    });
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
            const query = {};

            // Lọc theo search query
            if (searchQuery) {
                query['name'] = { '$regex': searchQuery, '$options': 'i' };
            }

            // Lọc theo loại sản phẩm (type)
            if (filter && Array.isArray(filter)) {
                filter.forEach((f, index) => {
                    if (index % 2 === 0 && f === 'type') {
                        query['type'] = { '$in': filter[index + 1].split(',') };
                    }
                });
            }

            const totalProduct = await Product.countDocuments();
            const totalProductFilter = await Product.countDocuments(query);

            let productQuery = Product.find(query)
                .populate('type', 'name') // Lấy thông tin chi tiết của danh mục
                .limit(limit)
                .skip((page - 1) * limit);

            if (sort) {
                const objectSort = {};
                objectSort[sort[1]] = sort[0] === 'asc' ? 1 : -1;
                productQuery = productQuery.sort(objectSort);
            }

            const allProduct = await productQuery;

            resolve({
                status: 'OK',
                message: 'Success',
                data: allProduct,
                totalProduct,
                totalProductFilter,
                currentPage: Number(page),
                totalPage: Math.ceil(totalProductFilter / limit)
            });
        } catch (e) {
            reject(e);
        }
    });
}


// const getAllTypeProduct = () => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const allType = await Product.distinct('type')
//             resolve({
//                 status: 'OK',
//                 message: 'Success',
//                 data: allType
//             })
//         } catch (e) {
//             reject(e)
//         }
//     })
// }
const getAllTypeProduct = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allCategories = await Category.find()
            const allTypesInProducts = await Product.distinct('type')
            resolve({
                status: 'OK',
                message: 'Success',
                data: {
                    categories: allCategories,
                    types: allTypesInProducts,
                }
            })
        } catch (e) {
            reject({
                status: 'ERROR',
                message: e.message || 'Failed to fetch data',
            })
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