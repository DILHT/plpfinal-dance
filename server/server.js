import app from './express.js';
import connectDB from './config/db.js';
import config from './config/config.js';

connectDB();

const PORT = config.port || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
});

