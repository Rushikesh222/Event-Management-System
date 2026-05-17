const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const authRoutes = require('../routes/auth.routes');
const eventRoutes = require('../routes/event.routes');
const bookingRoutes = require('../routes/booking.routes');



app.use(express.json());

const allowedOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({
	origin: allowedOrigin,
	credentials: true,
	methods: ['GET','POST','PUT','DELETE','OPTIONS'],
	allowedHeaders: ['Content-Type','Authorization']
}));
    


app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/booking', bookingRoutes);


module.exports = app;