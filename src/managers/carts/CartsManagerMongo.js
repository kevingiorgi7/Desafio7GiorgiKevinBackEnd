import { cartsModel } from "../../db/models/carts.model.js";

import { productManager } from "../products/ProductManagerMongo.js"; 

class CartManager {
    // Obtener todos los carritos
    async getCarts(){
        try {
            const carts = await cartsModel.find({})
            return carts
        } catch (error) {
            throw error
        }
    }
    // Obtener un carrito por ID
    async getCartById(id){
        try {
            const cart = await cartsModel.findById(id).lean().populate('products.product',['title','description','price','stock','category'])
            if(!cart){
                return {"ERROR":`El Carrito con ID ${id} no existe o no es un número`}
            } 
            return cart
        } catch (error) {
            throw error
        }
    }
    // Guardar los cambios de un carrito
    async saveCart(cart) {
        try {
            await cart.save();
            return cart;
        } catch (error) {
            throw error
        }
    }
    // Crear un nuevo carrito
    async createCart(obj){
        try {
            const newCart = await cartsModel.create(obj)
            return newCart
            /* const newCart = new cartsModel();
            await newCart.save();
            return "Cart created"; */
        } catch (error) {
            throw error
        }
    }
    // Borrar un carrito por ID
    async deleteCart(cid){
        try {
            const cartDeleted = await cartsModel.findByIdAndDelete(cid)
            if(!cartDeleted){
                return {"ERROR":`El Carrito con ID ${id} no existe o no es un número`}
            }
            return cartDeleted
        } catch (error) {
            throw error
        }
    }
    // Agregar una CANTIDAD de un producto por ID a un carrito por ID
    async addProduct(cid, pid, newQuantity){
        try {
            const cart = await cartsModel.findById(cid)
            const product = cart.products.find((p)=>p.product.equals(pid));
            if (product) {
                product.quantity += newQuantity
            } else {
                cart.products.push({ product: pid, quantity: newQuantity });
            }
            await this.saveCart(cart)
            return {"product added to cart": cart}
        } catch (error) {
            throw error
        }
    }
    // Borrar un producto por ID de un carrito por ID
    async deleteProductCart(cid,pid){
        try {
            const cart = await cartsModel.findById(cid)
            if (!cart) {throw new Error('Carrito no encontrado')};
            cart.products = cart.products.filter(p=> !p.product.equals(pid));
            await this.saveCart(cart);
            /*const cart = await cartsModel.findById(cid)
            if (!cart) {throw new Error('Carrito no encontrado')};
            const response = await cartsModel.updateOne({_id:cid},{$pull:{products:{_id:pid}}})
            return response */
        } catch (error) {
            throw error
        }
    }

    //Actualizar carrito
    async updateCart(cid, productsNew) {
        try {
            const cart = await cartsModel.findById(cid)
            cart.products.push(productsNew);
            await this.saveCart(cart);
            return cart;
        } catch (error) {
            throw error
        }
    }

    //Actualizar cantidad de un producto del carrito
    async updateQuantity(cid, pid, newQuantity){
        try {
            const cart = await cartsModel.findById(cid);
            const product = cart.products.find((p)=>p.product.equals(pid));
            if (product) {
                product.quantity = newQuantity
            } else {
                cart.products.push({ product: pid, quantity: newQuantity });
            }
            await this.saveCart(cart)
            return {"Quantity updated": cart}
        } catch (error) {
            throw error
        }
    }

    //Vaciar un carrito 
    async clearCart(cid){
        try {
            const cart = await cartsModel.findById(cid);
            cart.products = [];
            await this.saveCart(cart);
            return cart;
        } catch (error) {
            throw error
        }
    }






}


export const cartManager = new CartManager() 