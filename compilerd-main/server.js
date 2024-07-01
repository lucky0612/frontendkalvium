require('./envloader')(); // Load environment variables

const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
const baseRouter = require('./router.js'); // Import your router configuration
const { respond, l } = require('./loader.js').helpers; // Ensure your loader is correctly configured

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '2mb', parameterLimit: 1000000 }));
app.use(compression());
app.use(helmet());
app.use(cors());

// Log all API requests (excluding /api/)
app.use(morgan('REQUEST [:date[clf]] ":method :url HTTP/:http-version" :status :user-agent', {
    immediate: true,
    skip: function (req) { return (req.path === '/api/'); }
}));

// Serve static files from the 'frontend' folder
app.use(express.static(path.join(__dirname, 'frontend')));

// API routes
app.use('/api/', baseRouter); // Define your base router for API endpoints

// Default route
app.get('/', (req, res) => {
    res.send('Compiler is up and working');
});

// Error handling middleware for JSON parsing errors
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return respond(res, 400, { message: 'Invalid JSON found' });
    }
    next();
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    l.info(`Server started at port: ${PORT}`);
});
