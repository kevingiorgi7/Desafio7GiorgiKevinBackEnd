import {
    productsModel
} from "../../db/models/products.model.js";


export class ProductManager {

    //PAGINATE 
    // Products Router
    async paginateFun(limit,page,sortPrice,query) {
        try {
            const result = await productsModel.paginate(
                query,
                {limit, page, sort:{price:sortPrice}}
            )
            const info = {
                status: result ? "Success" : "Error",
                count: result.totalDocs,
                payload: result.docs,
                totalPages: result.totalPages,
                page:page,
                prevPages: result.prevPage,
                nextPage: result.nextPage,
                hasNextPage: result.hasNextPage,
                hasPrevPage: result.hasPrevPage,
                nextLink: result.hasNextPage ? `http://localhost:8080/api/products/paginate?page=${result.nextPage}&limit=${limit}` : null,
                prevLink: result.hasPrevPage ? `http://localhost:8080/api/products/paginate?page=${result.prevPage}&limit=${limit}` : null,
            }
            return {info}
        } catch (error) {
            throw error
        }
    }

    // Views Router
    async paginateRender(limit,page,sortPrice,query) {
        try {
            const result = await productsModel.paginate(
                query,
                {limit, page, sort:{price:sortPrice}, lean: true,}
            )
            const info = {
                status: result ? "Success" : "Error",
                count: result.totalDocs,
                payload: result.docs,
                totalPages: result.totalPages,
                page:page,
                prevPages: result.prevPage,
                nextPage: result.nextPage,
                hasNextPage: result.hasNextPage,
                hasPrevPage: result.hasPrevPage,
                // FALTA PONER EL QUERY EN EL NEXT Y PREV LINK //
                nextLink: result.hasNextPage ? `http://localhost:8080/api/views/products?page=${result.nextPage}&limit=${limit}` : null,
                prevLink: result.hasPrevPage ? `http://localhost:8080/api/views/products?page=${result.prevPage}&limit=${limit}` : null,
            }
            return {info}
        } catch (error) {
            throw error
        }
    }



    async getProducts(){
        try {
            const products = await productsModel.find({}).lean()
            return products
        } catch (error) {
            throw error
        }
    } 

    async createProduct(obj) {
        try {
            const newProduct = await productsModel.create(obj)
            return newProduct
        } catch (error) {
            throw error
        }
    }
    async getProductById(id) {
        try {
            const product = await productsModel.findById(id)
            if (!product) {
                return {
                    "ERROR": `El Producto con ID ${id} no existe o no es un número`
                }
            }
            return product
        } catch (error) {
            throw error
        }
    }
    async updateOne(id, obj) {
        try {
            const UpdateProduct = await productsModel.updateOne({
                _id: id
            }, {
                ...obj
            })
            return UpdateProduct
        } catch (error) {
            throw error
        }
    }
    async deleteProduct(id) {
        try {
            const deleteProduct = await productsModel.findByIdAndDelete(id)
            return deleteProduct
        } catch (error) {
            throw error
        }
    }

    async findOne(obj) {
        try {
            const product = await productsModel.findOne(obj).explain('executionStats')
            return product
        } catch (error) {
            throw error
        }
    }

    async aggregationMet() {
        try {
            const response = await productsModel.aggregate([{
                    $match: {
                        price: {
                            $gt: 40000
                        }
                    }
                },
                //{$count:'Products with price more than 40000'}
                {
                    $group: {
                        _id: '$category',
                        category_count: {
                            $count: {}
                        },
                        promedio_precio: {
                            $avg: '$price'
                        }
                    }
                },
                {
                    $sort: {
                        category_count: -1
                    }
                },
                {
                    $match: {
                        promedio_precio: {
                            $gt: 50000
                        }
                    }
                }
            ])
            return response
        } catch (error) {
            throw error
        }
    }



}

export const productManager = new ProductManager()