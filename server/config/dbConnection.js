import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();



const { Pool } = pg;

export const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT
});



export const dbConnection = async () => {
    try {
        await pool.query("SELECT NOW()");
        console.log(`✅ DATABASE SUCCESSFULLY CONNECTED`);
    } catch (error) {
        console.log(`❌ DATABASE CONNECTION ERROR: ${error.message}`);
        process.exit(1);
    }
};
