const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
app.set('trust proxy', 1); // trust the nginx proxy (when in production)

app.use(helmet());

const allowedOrigins = process.env.CORS_ORIGINS ?
    process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim()) :
    ['http://localhost:5173'];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Blocked by CORS policy'));
        }
    },
    credentials: true,
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const rateLimiter = require('./middleware/rateLimiter');
app.use(rateLimiter);

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

const accountRouter = require('./routes/account');
const decksRouter = require('./routes/decks');
const cardsRouter = require('./routes/cards');
const dungeonsRouter = require('./routes/dungeons');

app.use('/api/account', accountRouter);
app.use('/api/decks', decksRouter);
app.use('/api/cards', cardsRouter);
app.use('/api/dungeons', dungeonsRouter);

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

app.listen(3000, '0.0.0.0', () => {
    console.log('Backend running on port 3000');
});
