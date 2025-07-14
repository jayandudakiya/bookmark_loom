require('dotenv').config();
const { API_END_POINT_PREFIX } = require('./config/api');
const app = require('./app');
const passport = require('passport');
const PORT = process.env.PORT || 5000;
// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const bookmarkRoutes = require('./routes/bookmark.routes');

// Import necessary modules
const cors = require('cors');
const morgan = require('morgan');

// CORS options
const corsOptions = {
  origin: ['http://localhost:5173', 'https://bookmark-loom.vercel.app'], // your allowed origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // if you're using cookies or authentication
};
// app.use("/stripe/webhook/update", bodyParser.raw({ type: "application/json" }));
// Middleware setup and configuration
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(passport.initialize());

app.get('/', (res, req) => {
  req.send('Welcome To Express Js ');
});

// Use routes
app.use(API_END_POINT_PREFIX.AUTH, authRoutes);
app.use(API_END_POINT_PREFIX.USER, userRoutes);
app.use(API_END_POINT_PREFIX.BOOKMARK, bookmarkRoutes);
app.listen(PORT, () => {
  console.log(`🚀 Server running on port http://localhost:${PORT}`);
});
