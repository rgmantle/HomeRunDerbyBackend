const { Client } = require('pg');

const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'newPassword'
});

async function createUser({ name, email, entry }) {
    try {
        const { rows } = await client.query(`
            INSERT INTO users(name, email, entry) 
            VALUES ($1, $2, $3)
            ON CONFLICT (name) DO NOTHING;
        `, [ name, email, entry ]);

        return rows
    } catch (error) {
        throw error;
    }
}

async function getAllUsers() {
    const { rows } = await client.query(
        `SELECT id, name 
        FROM users
        `);

    return rows;
}

module.exports = {
    client,
    getAllUsers,
    createUser,
}