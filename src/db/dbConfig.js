import mongoose from 'mongoose';

const URI = 'mongodb+srv://kevingiorgi777:1641.@cluster0.ppb7tkj.mongodb.net/ecommerce?retryWrites=true&w=majority';

mongoose.connect(URI)
.then(()=>console.log('Conectado a la base de datos'))
.catch(error=>console.log(error))




/* import mongoose from "mongoose";

const URI = 'mongodb+srv://kevingiorgi777:1641.@cluster0.ppb7tkj.mongodb.net/ecommerce?retryWrites=true&w=majority';

mongoose.connect(URI)
.then(() => console.log("Conectado a la base de datos"))
.catch((error) => console.log(error)); */