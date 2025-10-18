import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

// Load .env from the current working directory (if present)
dotenv.config();

// Helper to remove surrounding single/double quotes that sometimes get added
// if users copy/paste values into .env and wrap them in quotes.
function stripQuotes(value) {
    if (!value) return value;
    return value.replace(/^['"]|['"]$/g, '');
}

const raw = process.env;
const PGUSER = stripQuotes(raw.PGUSER);
const PGPASSWORD = stripQuotes(raw.PGPASSWORD);
const PGHOST = stripQuotes(raw.PGHOST);
const PGDATABASE = stripQuotes(raw.PGDATABASE);
const PGPORT = stripQuotes(raw.PGPORT);
const DATABASE_URL = stripQuotes(raw.DATABASE_URL);

let connectionString = DATABASE_URL;

if (!connectionString) {
    const missing = [];
    if (!PGUSER) missing.push('PGUSER');
    if (!PGPASSWORD) missing.push('PGPASSWORD');
    if (!PGHOST) missing.push('PGHOST');
    if (!PGDATABASE) missing.push('PGDATABASE');
    if (!PGPORT) missing.push('PGPORT');

    if (missing.length) {
        throw new Error(`Missing required DB env vars: ${missing.join(', ')}.\n` +
            `Place them in a .env file (in the project root or current working dir) or set DATABASE_URL.`);
    }

    const encodedPassword = encodeURIComponent(PGPASSWORD);
    connectionString = `postgresql://${PGUSER}:${encodedPassword}@${PGHOST}:${PGPORT}/${PGDATABASE}?sslmode=require&channel_binding=require`;
}

// Export the Neon client (will throw if connectionString is not a valid URL)
export const sql = neon(connectionString);
