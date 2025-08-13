const express = require('express');
const bodyParser = require('body-parser');
const viewEngine = require('./config/viewEngine');
const bacSiRouter = require('./route/bacSiRouter');
const dichVuRouter = require('./route/dichVuRouter');
const tiepDonRouter = require('./route/tiepDonRouter');
const phieuKhamRouter = require('./route/phieuKhamRouter');
const dungCuRoutes = require('./route/dungCuRoutes');
const authRoutes = require('./route/authRouter');
const uploadRouter = require('./route/uploadRouter');

const connectDB = require('./config/connectDB');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const cron = require('node-cron');
const { RtcTokenBuilder, RtcRole } = require('agora-token');

require("dotenv").config();

let app = express();
let port = process.env.PORT || 6969;
const hostname = process.env.HOST_NAME;

const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;
connectDB();

// Cài đặt CORS
const allowedOrigins = [
    'http://localhost:4000', 
    'http://192.168.100.15:4000', 
    'http://10.70.135.123:3000', 
    'http://192.168.0.102:3000', 
    'http://10.70.134.108:3000',
    'http://10.72.178.187:3000',
    'http://10.70.131.231:3000',
    'http://10.70.131.24:3000',
    'http://10.40.133.54:3000',
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.options('*', cors()); 



// Config bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



// Config app
viewEngine(app);
// Định nghĩa các route cho API
app.use("/api/bacsi", bacSiRouter); 
app.use("/api/dichvu", dichVuRouter);
app.use("/api/tiepdon", tiepDonRouter);
app.use("/api/phieukham", phieuKhamRouter);
app.use("/api/dungcusudung", dungCuRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRouter); // Đặt đường dẫn cho uploaday


app.listen(port, () => {
    console.log("backend nodejs is running on the port:", port, `\n http://localhost:${port}`);
});
