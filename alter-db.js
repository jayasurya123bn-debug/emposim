const { sql } = require('@vercel/postgres');

async function run() {
    try {
        console.log('Altering table...');
        await sql`ALTER TABLE registrations ALTER COLUMN payment_screenshot TYPE TEXT;`;
        console.log('Done!');
    } catch (err) {
        console.error('Error altering table:', err);
    }
}

run();
