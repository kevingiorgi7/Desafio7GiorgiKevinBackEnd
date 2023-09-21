/* const manager = new CartsManager("Carts.json");

// GET
router.get('/', async (req,res)=>{
    try {
        const carts = await manager.getCarts()
        res.status(200).json({ message: 'Carts', carts})
    } catch (error) {
        throw res.status(500).json({ error }) 
    }
})

router.get('/:cid', async (req,res)=>{
    const {cid} = req.params
    try {
        const cart = await manager.getCartsByID(+cid)
        res.status(200).json({ message: 'Cart', cart: cart})
    } catch (error) {
        throw res.status(500).json({ error }) 
    }
})

// POST
router.post('/',async(req,res)=>{
    try {
        const createCart = await manager.createCart()
        res.status(200).json({message: 'Cart', cart: createCart})
    } catch (error) {
        throw res.status(500).json({ error }) 
    }
})

router.post('/:cid/products/:pid',async(req,res)=>{
    const {cid,pid} = req.params
    try {
        const addProduct = await manager.addProduct(+cid,pid)
        res.status(200).json({message:'Producto agregado',product: addProduct})
    } catch (error) {
        throw res.status(500).json({ error }) 
    }
})


// DELETE 
//Borrar un carrito
router.delete('/:cid', async (req,res)=>{
    const { cid } = req.params
    try {
        const cartDeleted = await manager.deleteCart(+cid)
        res.status(200).json({ message: 'Cart deleted', product: cartDeleted })
    } catch (error) {
        throw res.status(500).json({ error })
    }
})
// Borrar un producto de un carrito
router.delete('/:cid/products/:pid', async (req,res)=>{
    const {cid,pid} = req.params
    try {
        const productDeleted = await manager.deleteProductCart(+cid,pid)
        res.status(200).json({ message: 'Product deleted', product: productDeleted })
    } catch (error) {
        throw res.status(500).json({ error })
    }
}) */


import {Router} from "express";
import { cartManager } from "../managers/carts/CartsManagerMongo.js";

const router = Router()


// Obtener todos los carritos
router.get('/', async(req,res)=>{
    try {
        const carts = await cartManager.getCarts()
        if(carts.length){
            res.status(200).json({message:'Carts', carts})
        } else {
            res.status(200).json({message:'No carts found'})
        }
    } catch (error) {
        res.status(500).json({error})
    }
})
// Obtener un carrito por ID
router.get('/:id',async(req,res)=>{
    const {id} = req.params
    try {
        const cart = await cartManager.getCartById(id)
        if(!cart){
            res.status(400).json({message: 'Invalid ID'})
        } else {
            res.status(200).json({message: cart})
        }
    } catch (error) {
        res.status(500).json({error: "Carrito no encontreado"})
    }
})
// Crear un nuevo carrito
router.post('/',async(req,res)=>{
    try {
        const newCart = await cartManager.createCart(req.body)
        res.status(200).json({message: 'New Cart', newCart})
    } catch (error) {
        res.status(500).json({error: "El carrito no se creó"})
    }
})
// Borrar un carrito por ID
router.delete('/:cid',async(req,res)=>{
    const {cid} = req.params
    try {
        const cartDeleted = await cartManager.deleteCart(cid)
        if(!cid){
            return res.status(400).json({message: 'Invalid ID'});
        }
    res.status(200).json({message: 'Cart Deleted', cartDeleted})
    } catch (error) {
        res.status(500).json({error: "El carrito no se borró"})
    }
})
// Agregar una CANTIDAD de un producto por ID a un carrito por ID
router.post('/:cid/products/:pid',async(req,res)=>{
    const {cid,pid} = req.params
    const {newQuantity = 1} = req.query
    try {
        if (!newQuantity || isNaN(newQuantity)) {
            return res.status(400).json({ error: 'Cantidad no válida' });
        }
        const addProduct = await cartManager.addProduct(cid,pid,newQuantity)
        if (!addProduct) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.status(200).json({message:'Producto agregado', product: addProduct})
    } catch (error) {
        res.status(500).json({error: "Carrito no actualizado"})
    }
})
// Borrar un producto por ID de un carrito por ID
router.delete('/:cid/products/:pid', async(req,res)=>{
    const {cid,pid} = req.params
    try {
        const productDeleted = await cartManager.deleteProductCart(cid,pid)
        res.status(200).json({message:'Producto eliminado', product: productDeleted})
    } catch (error) {
        res.status(500).json({error: "Carrito no actualizado"})
    }
})

// Actualizar carrito
router.put('/:cid', async (req, res) => {
    const {cid} = req.params
    const productsNew = req.body
    try {
        const cart = await cartManager.updateCart(cid, productsNew); 
        res.status(200).json({message:'Carrito actualizado', product: cart})
    } catch (error) {
        res.status(500).json({error: "Carrito no actualizado"})
    }
});

//Actualizar cantidad de un producto del carrito
router.put('/:cid/products/:pid', async (req, res) => {
    const {cid,pid} = req.params
    const newQuantity = req.body.quantity
    try {
        if (!newQuantity || isNaN(newQuantity)) {
            return res.status(400).json({ error: 'Cantidad no válida' });
        }
        const cart = await cartManager.updateQuantity(cid,pid,newQuantity)
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.status(200).json({message:'Cantidad actualizada', cart: cart})
    } catch (error) {
        res.status(500).json({error: "Cantidad no actualizada"})
    }
});

//Vaciar Carrito
router.delete('/clear/:cid',async(req,res)=>{
    const {cid} = req.params
    try {
        const cart = await cartManager.clearCart(cid)
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.status(200).json({message: 'Cart Empty', cart})
    } catch (error) {
        res.status(500).json({error: "El carrito no se vació"})
    }
})

export default router