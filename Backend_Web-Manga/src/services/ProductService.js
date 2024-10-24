const Product = require('../models/ProductModel')

const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const { name, image, type, price, stock, rating, description } = newProduct
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
                rating,
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
            const product = await Product.findOne({ _id: id });

            if (product === null) {
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
            const checkProduct = await Product.findOne({ _id: id });

            if (checkProduct === null) {
                return resolve({
                    status: 'ERR',
                    message: 'The product is not defined'
                });
            }

            await Product.findByIdAndDelete(id);

            resolve({
                status: 'OK',
                message: 'Delete product success'
            });
        } catch (e) {
            reject(e);
        }
    });
}

const deleteManyProducts = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Product.deleteMany({ _id: ids });

            resolve({
                status: 'OK',
                message: 'Delete products success'
            });
        } catch (e) {
            reject(e);
        }
    });
}

const allProduct = (limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalProduct = await Product.countDocuments();

            // if (filter) {
            //     const allProductFilter = await Product.find({ [filter[0]]: { '$regex': filter[1] } }).limit(limit).skip((page - 1) * limit)
            //     resolve({
            //         status: 'OK',
            //         message: 'Success',
            //         data: allProductFilter,
            //         totalProduct: totalProduct,
            //         currentPage: Number(page),
            //         totalPage: Math.ceil(totalProduct / limit)
            //     });
            // }
            if (filter) {
                const query = filter.map((f, index) => {
                    if (index % 2 === 0) {
                        return { [f]: { '$regex': filter[index + 1], '$options': 'i' } };
                    }
                    return null;
                }).filter(Boolean);

                const allProductFilter = await Product.find({ '$or': query }).limit(limit).skip((page - 1) * limit);

                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allProductFilter,
                    totalProduct: totalProduct,
                    currentPage: Number(page),
                    totalPage: Math.ceil(totalProduct / limit)
                });
            }

            if (sort) {
                const objectSort = {}
                objectSort[sort[1]] = sort[0]
                const allProductSort = await Product.find().sort(objectSort).limit(limit).skip((page - 1) * limit)
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allProductSort,
                    totalProduct: totalProduct,
                    currentPage: Number(page),
                    totalPage: Math.ceil(totalProduct / limit)
                });
            }

            const allProduct = await Product.find().limit(limit).skip((page - 1) * limit)
            resolve({
                status: 'OK',
                message: 'Success',
                data: allProduct,
                totalProduct: totalProduct,
                currentPage: Number(page),
                totalPage: Math.ceil(totalProduct / limit)
            });
        } catch (e) {
            reject(e);
        }
    });
}
const getAllTypeProduct = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allType = await Product.distinct('type')
            resolve({
                status: 'OK',
                message: 'Success',
                data: allType
            });
        } catch (e) {
            reject(e);
        }
    });
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