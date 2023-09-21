import { Router } from "express";
import { productManager } from "../managers/products/ProductManagerMongo.js";
import { cartManager }  from "../managers/carts/CartsManagerMongo.js";
import { __dirname } from "../utils.js";

const router = Router();

// HOME HANDLEBARS
router.get("/", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        console.log(products);
        res.render("home", {
            products: products,
        });
    } catch (error) {
        throw res.status(500).json({
            error,
        });
    }
});

// PRODUCTS HANDLEBARS
router.get("/products", async (req, res) => {
    const {
        limit = 10, page = 1, sort, ...query
    } = req.query;
    try {
        console.log(req.query);

        const products = await productManager.paginateRender(
            limit,
            page,
            sort,
            query
        );
        const info = products.info;
        const payload = info.payload;
        res.render("products", {
            info,
            payload,
            user:req.session.user
        });
    } catch (error) {
        throw res.status(500).json({
            error
        });
    }
});


// DETAILS PRODUCTS HANDLEBARS
router.get("/products/:pid", async (req, res) => {
    const {pid} = req.params
    try {
        const product = await productManager.getProductById(pid);
        const title = product.title
        const description = product.description
        const price = product.price
        const code = product.code
        const stock = product.stock
        const category = product.category
        res.render("detailsProducts", {title, description, price, code, stock, category});
    } catch (error) {
        throw res.status(500).json({
            error
        });
    }
});

router.get("/carts/:cid", async (req, res) => {
    const {cid} = req.params
    try {
        const cart = await cartManager.getCartById(cid);
        const products = cart.products
        console.log(products);
        res.render("cart", {cid, products});
    } catch (error) {
        throw res.status(500).json({
            error
        });
    }
});


// REAL TIME PRODUCTS HANDELEBARS
router.get("/realtimeproducts", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render("realTimeProducts", {
            products: products,
        });
    } catch (error) {
        throw res.status(500).json({
            error,
        });
    }
});



// Sessions

const publicAcces = (req,res,next) =>{
    if(req.session.user) return res.redirect('/api/views/profile');
    next();
}

const privateAcces = (req,res,next)=>{
    if(!req.session.user) return res.redirect('/api/views/login');
    next();
}


router.get('/register',publicAcces,(req,res)=>{
    try {
        res.render('register')
    } catch (error) {
        throw res.status(500).json({
            error,
        });
    }
})

router.get('/login',publicAcces,(req,res)=>{
    try {
        res.render('login')
    } catch (error) {
        throw res.status(500).json({
            error,
        });
    }
})

router.get('/profile',privateAcces, (req,res)=>{
    try {
        console.log(req.session.user);
        res.render('profile',{user:req.session.user})
    } catch (error) {
        throw res.status(500).json({
            error,
        });
    }
})


export default router;
