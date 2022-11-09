const mongoose = require('mongoose')
const cloudinary = require('cloudinary');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const errorMiddleware = require('./middlewares/error');
const express = require('express')
const user = require('./routes/userRoute');
const product = require('./routes/productRoute');
const order = require('./routes/orderRoute');
const payment = require('./routes/paymentRoute');
const path = require('path')




const port = process.env.PORT || 4000;
const app = express()

dotenv.config()

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true})
.then(()=> {
    console.log('connected to db')
})
.catch((err)=> {
    console.log(err.message)
})

// UncaughtException Error
if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: './.env' });
}


app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());



app.use('/api/v1', user);
app.use('/api/v1', product);
app.use('/api/v1', order);
app.use('/api/v1', payment);

 process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    process.exit(1);
}); 


__dirname = path.resolve();
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    });
} else {
    app.get('/', (req, res) => {
        res.send('Server is Running! 🚀');
    });
}

// error middleware
app.use(errorMiddleware);




cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = app.listen(port, () => {
    console.log(`Server running on http://localhost: ${port}`)
});

// Unhandled Promise Rejection
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    server.close(() => {
        process.exit(1);
    });
});
