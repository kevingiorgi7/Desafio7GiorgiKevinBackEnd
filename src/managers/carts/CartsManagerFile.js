import { existsSync, promises } from 'fs'
import ProductManager from "../products/ProductManagerFile.js";
const manager = new ProductManager("Products.json");

import { __dirname } from '../../utils.js'
const path = __dirname+'/Carts.json'

export default class CartsManager {
    constructor(path) {
        this.path = path
    }
    async getCarts(){
        try {
            if (!existsSync(this.path)) {
                return []
            }
            const carts = await promises.readFile(this.path, 'utf-8')
            return JSON.parse(carts)
        } catch (error) {
            throw error
        }
    }
    async getCartsByID(id){
        try {
            const carts = await this.getCarts()
            const cart = carts.find(e=>e.id===id)
            if (!cart) {
                return {"ERROR":`El ID ${id} no existe o no es un número`}
            }
            return cart
        } catch (error) {
            throw error
        }
    }
    async createCart() {
        try {
            const cartsPrev = await this.getCarts()
            let id
            if (!cartsPrev.length) {
                id = 1
            } else {
                id = cartsPrev[cartsPrev.length - 1].id + 1
            } 
            const newCart = { products: [] ,id}
            cartsPrev.push(newCart)
            await promises.writeFile(this.path, JSON.stringify(cartsPrev))
            return newCart
        } catch (error) {
            throw error
        }
    }

    async addProduct(cid,pid){
        try {
            //Corroborar la existencia de un carrito con ese ID
            const carts = await this.getCarts()
            const cart = carts.find(c=>c.id===cid) //const cart = await this.getCartsByID(cid) -> de esa forma no funciona, no se porque
            if(!cart){return {"ERROR":`El Carrito con ID ${cid} no existe o no es un número`}} 
            //Corroborar la existencia de un producto con ese ID
            const products = await manager.getProducts() 
            const productExist = products.find(p=>p.id===(+pid))
            if(!productExist){return {"ERROR":`El Producto con ID ${pid} no existe o no es un número`}}
            // Corroborar si el producto ya existe en ese carrito
            const cartIndex = cart.products.findIndex(e=>e.productID===pid)
            if(cartIndex===-1){ //si en findindex no encuentra nada, arroja -1
                cart.products.push({
                    productID: pid,
                    quantity: 1
                })
            } else {
                cart.products[cartIndex].quantity++
            } 
            await promises.writeFile(this.path, JSON.stringify(carts))
            return cart
        } catch (error) {
            throw error
        }
    }
    async deleteProductCart(cid,pid){
        try {
            //Corroborar la existencia de un carrito con ese ID
            const carts = await this.getCarts()
            const cart = carts.find(c=>c.id===cid) //const cart = await this.getCartsByID(cid) -> de esa forma no funciona, no se porque
            if(!cart){return {"ERROR":`El Carrito con ID ${cid} no existe o no es un número`}} 
            // Corroborar si el producto existe en el carrito
            const cartIndex = cart.products.findIndex(e=>e.productID===pid)
            if(cartIndex===-1){ //si en findindex no encuentra nada, arroja -1
                return {"ERROR":`El Producto con ID ${pid} no existe en el Carrito con ID ${cid} o no es un número`}
            }
            // Eliminar el producto del carrito
            cart.products.splice(cartIndex,1)
            await promises.writeFile(this.path, JSON.stringify(carts))
            return cart
        } catch (error) {
            throw error
        }
    }

    async deleteCart(idDelete) {
        try {
            const carts = await this.getCarts()
            const cartDelete = carts.find(p=>p.id===idDelete)
            if(!cartDelete){
                return {"ERROR":`El Carrito con ID ${idDelete} no existe o no es un número`}
            }
            const newArrayCarts = carts.filter(e => e.id !== idDelete)
            await promises.writeFile(this.path, JSON.stringify(newArrayCarts))
            return cartDelete 
        } catch (error) {
            throw error
        }
    }

}

