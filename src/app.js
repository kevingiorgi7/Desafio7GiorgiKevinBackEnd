import express from "express";
import { __dirname } from './utils.js'
import handlebars from 'express-handlebars'

//import cookieParser from "cookie-parser";
import session from 'express-session'
//import FileStore from "session-file-store";
import MongoStore from 'connect-mongo';

import './db/dbConfig.js'

// Import Routes
import viewsRouter from './routes/views.router.js'
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import sessionRouter from './routes/session.router.js';

import { productManager }  from './managers/products/ProductManagerMongo.js';

import passport from "passport";
import './passport/passportStrategies.js'

import { Server } from 'socket.io'



// Express
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// Public
app.use(express.static(__dirname+'/public'))


// Handlebars
app.engine('handlebars',handlebars.engine())
app.set('views',__dirname+'/views')
app.set('view engine','handlebars')


//app.use(cookieParser('secretKeyCookie')) 
// 'secretKeyCookie' se pone eso para las cookies firmadas

// Session con File System
/* const filestore = FileStore(session)
app.use(session({
    store: new filestore({
        path: __dirname+'/sessions',
        ttl: 15, //time to live
        retries: 0
    }),
    secret: 'secretSession',
    // cookie: {maxAge:60000},
    resave: false,
    saveUninitialized:false
})) */



// SESSION con MONGO
app.use(session({
    store: new MongoStore({
        mongoUrl: 'mongodb+srv://kevingiorgi777:1641.@cluster0.ppb7tkj.mongodb.net/ecommerce?retryWrites=true&w=majority',
        ttl:3600 //Segundos // Si no pongo nada, son 14 dias
    }),
    secret: 'secretSession',
    resave: false,
    saveUninitialized:false
}))

// Passport
app.use(passport.initialize())
app.use(passport.session())

// Routes
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/views',viewsRouter)
app.use('/api/sessions', sessionRouter) 



//Cookies 
/* 
app.get('/',(req,res)=>{
    res.send('Prueba  exitosa')
})
app.get('/guardarCookie',(req,res)=>{
    res.cookie('cookie2','segunda cookie'
    // ,{maxAge:5000} 5 segundos de expiracion  
    ).send()
})
app.get('/guardarCookieFirmada',(req,res)=>{
    res.cookie('cookiefirmada','primer cookie firmada',{signed:true}).send()
})
app.get('/leerCookie',(req,res)=>{
    console.log(req);
    //const {cookie1} = req.cookies
    res.json(
        //{message: 'leyendo cookie 1',cookie1}, 
        {message: 'leyendo cookies',...req.cookies,...req.signedCookies}
    )
})
app.get('/eliminarCookie',(req,res)=>{
    res.clearCookie('cookie1').send('eliminando coookie')
})
 */



// Puerto
const PORT = 8080
const httpServer = app.listen(PORT,()=>{
    console.log(`Escuchando al puerto ${PORT}`);
})


const socketServer = new Server(httpServer)

const products = await productManager.getProducts()

socketServer.on('connection', async socket=>{
    console.log(`Usuario conectado: ${socket.id}`);
    socket.on('disconnect',()=>{
        console.log(`Usuario desconectado: ${socket.id}`);
    })
    socket.on('addProduct', async (newProduct) => {
        const productAdded = await productManager.addProducts(newProduct);
        socketServer.emit('productAdded', productAdded);
    });
    socket.on('deleteProduct', async (productId) => {
        const productDeleted = await productManager.deleteProduct(Number(productId));
        socketServer.emit('productDeleted', productDeleted)

        const productsUpdated = await productManager.getProducts()
        console.log(productsUpdated);
        socketServer.emit('productDeleted', productsUpdated => {
            products = productsUpdated
        }); 
    });
}) 



