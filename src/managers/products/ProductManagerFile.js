import { existsSync, promises } from 'fs'

import { __dirname } from '../../utils.js'
const path = __dirname+'/Products.json'

export default class ProductManager {
    constructor(path) {
        this.path = path
    }

    async getProducts() {
        try {
            if (!existsSync(this.path)) {
                return []
            }
            const infoProducts = await promises.readFile(this.path, 'utf-8')
            return JSON.parse(infoProducts)
        } catch (error) {
            throw error
        }
    }

    async addProducts(objProduct) {
        try {
            const productsPrev = await this.getProducts()
            let id
            if (!productsPrev.length) {
                id = 1
            } else {
                id = productsPrev[productsPrev.length - 1].id + 1
            }
            // Condicional para campos obligatorios del producto
            if(
                !objProduct.title||
                !objProduct.description||
                !objProduct.code||
                !objProduct.price||
                !objProduct.status||
                !objProduct.stock||
                !objProduct.category) {
                    return {"Error": "Producto NO agregado. Faltan campos"}
                }
            // Condicional para evitar que se cree un ID manualmente
            if(objProduct.id || objProduct.ID || objProduct.Id || objProduct.iD) {
                return {"Error": 'Producto NO agregado. No se puede agregar un ID, se genera automaticamente'}
            }
            // Condicional para evitar que se cree un producto con un CODE ya existente
            const codeAdd = objProduct.code
            const codeExist = productsPrev.find(p=>p.code ===codeAdd)
            if(codeExist) {
                return {"Error": 'Producto NO agregado. El CODE ya existe'}
            }
            // Creacion de producto con el objeto + el ID autogenerado
            const productCreated = {...objProduct,id}
            // Agregar el producto al array de productos
            productsPrev.push(productCreated)
            await promises.writeFile(this.path, JSON.stringify(productsPrev))
            return productCreated
        } catch (error) {
            throw error
        }
    }

    async getProductsById(idFind) {
        try {
            const productsPrev = await this.getProducts()
            const idExist = productsPrev.find(e => e.id === idFind)
            if (!idExist) {
                return {"ERROR":`El ID ${idFind} no existe o no es un número`}
            }
            return  idExist
        } catch (error) {
            throw error
        }
    }

    async updateProduct(idUpdate, objUpdate) {
        try {
            const productsPrev = await this.getProducts()
            const productIndex = productsPrev.findIndex(e=>e.id === idUpdate) // Si da -1 es porque no encontro nada
            if(productIndex === -1) {
                return {'ERROR': `No se actualizó: El ID ${idUpdate} no fue encontrado`};
            }
            // Condicional para evitar que se cree un ID manualmente
            const product = productsPrev[productIndex]
            if(objUpdate.id || objUpdate.ID || objUpdate.Id || objUpdate.iD) {
                return {'ERROR': 'No se puede actualizar el ID'};
            }
            // Condicional para evitar que se cree un producto con un CODE ya existente
            const codeAdd = objUpdate.code
            const codeExist = productsPrev.find(p=>p.code ===codeAdd)
            if(codeExist) {
                return {"Error": 'Producto NO agregado. El CODE ya existe'}
            }
            // Actualizacion del producto
            const productUpdate = {...product,...objUpdate}
            productsPrev[productIndex] = productUpdate
            await promises.writeFile(this.path, JSON.stringify(productsPrev))
            return productUpdate
        } catch (error) {
            throw error
        }
    }

    async deleteProduct(idDelete) {
        try {
            const productsPrev = await this.getProducts()
            const productDelete = productsPrev.find(p=>p.id===idDelete)
            const newArrayProducts = productsPrev.filter(e => e.id !== idDelete)
            await promises.writeFile(this.path, JSON.stringify(newArrayProducts))
            return productDelete
        } catch (error) {
            throw error
        }
    }
}

const product1 = {
    title: 'Sensor',
    description: 'Sensor de estacionamiento trasero marca toyota',
    price: 50000,
    thumbnail:[`./media/sensor/foto1.jpg`, `./media/sensor/foto2.jpg`, `./media/sensor/foto3.jpg`],
    code: '113355',
    stock: 20,
    status: true,
    category: 'yaris'
}
const product2 = {
    title: 'Barra',
    description: 'Barra anti vuelco marca toyota',
    price: 90000,
    thumbnail:[`./media/barra/foto1.jpg`, `./media/barra/foto2.jpg`, `./media/barra/foto3.jpg`],
    code: '779911',
    stock: 17,
    status: true,
    category: 'hilux'
}
const product3 = {
    title: 'Cobertor',
    description: 'Cobertor caja marca toyota',
    price: 30000,
    thumbnail:[`./media/cobertor/foto1.jpg`, `./media/cobertor/foto2.jpg`, `./media/cobertor/foto3.jpg`],
    code: '335577',
    stock: 9,
    status: true,
    category: 'hilux'
}
const product4 = {
    title: 'Gancho De Arrastre',
    description: 'Enganche para arrastre de cargas',
    price: 130000,
    thumbnail:[`./media/gancho/foto1.jpg`, `./media/gancho/foto2.jpg`, `./media/gancho/foto3.jpg`],
    code: '557799',
    stock: 15,
    status: true,
    category: 'hilux'
}
const product5 = {
    title: 'Embellecedor cromado de manija',
    description: 'Embellecedor de manijas de apertura de puertas',
    price: 40000,
    thumbnail:[`./media/embellecedor/foto1.jpg`, `./media/embellecedor/foto2.jpg`, `./media/embellecedor/foto3.jpg`],
    code: '224466',
    stock: 25,
    status: true,
    category: 'corolla'
}
const product6 = {
    title: 'Tuercas De Seguridad',
    description: 'Tuercas De Seguridad',
    price: 20000,
    thumbnail:[`./media/tuercas/foto1.jpg`, `./media/tuercas/foto2.jpg`, `./media/tuercas/foto3.jpg`],
    code: '880022',
    stock: 50,
    status: true,
    category: 'yaris'
}
const product7 = {
    title: 'Cargador inalámbrico',
    description: 'Cargador inalámbrico marca toyota',
    price: 100000,
    thumbnail:[`./media/cargador/foto1.jpg`, `./media/cargador/foto2.jpg`, `./media/cargador/foto3.jpg`],
    code: '446688',
    stock: 2,
    status: true,
    category: 'corolla'
}
const product8 = {
    title: 'Llanta',
    description: 'Llanta de aleación 18¨',
    price: 80000,
    thumbnail:[`./media/llanta/foto1.jpg`, `./media/llanta/foto2.jpg`, `./media/llanta/foto3.jpg`],
    code: '668822',
    stock: 16,
    status: true,
    category: 'yaris'
}
const product9 = {
    title: 'Zócalo de aluminio',
    description: 'Embellecedor y protector de zócalos del vehículo',
    price: 30000,
    thumbnail:[`./media/zocalo/foto1.jpg`, `./media/zocalo/foto2.jpg`, `./media/zocalo/foto3.jpg`],
    code: '135246',
    stock: 5,
    status: true,
    category: 'corolla'
}
const product10 = {
    title: 'Porta Bicicleta',
    description: 'Accesorio para el transporte simple y seguro de bicicletas',
    price: 45000,
    thumbnail:[`./media/portabici/foto1.jpg`, `./media/portabici/foto2.jpg`, `./media/portabici/foto3.jpg`],
    code: '798017',
    stock: 1,
    status: true,
    category: 'hilux'
}

const objUpdate = {
    price: 70000,
    stock: 10
}

/* async function prueba() {

    const manager = new ProductManager('Products.json')
    await manager.addProducts(product1)
    await manager.addProducts(product2)
    await manager.addProducts(product3)
    await manager.addProducts(product4)
    await manager.addProducts(product5)
    await manager.addProducts(product6)
    await manager.addProducts(product7)
    await manager.addProducts(product8)
    await manager.addProducts(product9)
    await manager.addProducts(product10)
    //await manager.getProductsById(1)
    //await manager.getProductsById(20)
    //await manager.deleteProduct(2)
    //await manager.updateProduct(1,objUpdate)

    const products = await manager.getProducts()
    console.log(products);
}

prueba()
 */