const { Client } = require('pg');

const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'newPassword'
});

async function createUser({ name, email, entry }) {
    try {
        const { rows: [user] } = await client.query(`
            INSERT INTO users(name, email, entry) 
            VALUES ($1, $2, $3)
            ON CONFLICT (name) DO NOTHING;
        `, [ name, email, entry ]);

        return user
    } catch (error) {
        throw error;
    }
}

async function updateUser(id, fields = {}) {

    const setString = Object.keys(fields).map(
        (key, index) => `"${ key }" =$${ index + 1}`
    ).join(', ');

    if (setString.length === 0) {
        return;
    }

    try {
        const { rows: [ user ] } = await client.query(`
        UPDATE users
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
        `, Object.values(fields));

        return user;
    } catch (error) {
        throw error
    }
}

async function getAllUsers() {
    try {
    const { rows } = await client.query(
        `SELECT * 
        FROM users
        `);

    return rows;
} catch (error) {
    throw error;
    }
}

async function getUserById(userId) {
    try {
        const { rows: [ user ] } = await client.query(`
            SELECT id, name, email, entry
            FROM users 
            WHERE id=${ userId };
            `);
        if (!user) {
            return null
        }

        user.entries = await getEntriesByUser(userId);

        return user
    } catch (error) {
        throw error
    }
}

async function createEntry({
    entryId,
    poolaone,
    poolbone,
    poolbtwo,
    poolcone,
    poolctwo,
    poolcthree
}) {
    try {
        const { rows: [entry]} = await client.query(`
        INSERT INTO entries("entryId", poolaone, poolbone, poolbtwo, poolcone, poolctwo, poolcthree)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [entryId, poolaone, poolbone, poolbtwo, poolcone, poolctwo, poolcthree]);

        return entry
    } catch (error) {
        throw error
    }
}

async function updateEntry(id, fields = {}) {

    const setString = Object.keys(fields).map(
        (key, index) => `"${ key }" =$${ index + 1}`
    ).join(', ');

    if (setString.length === 0) {
        return;
    }

    try {
        const { rows: [ entry ] } = await client.query(`
        UPDATE entries
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
        `, Object.values(fields));

        return entry;
    } catch (error) {
        throw error
    }
}

async function getAllEntries() {
    try {
        const { rows } = await client.query(
        `SELECT * 
        FROM entries
        `);

    return rows;
    
        } catch (error) {
            throw error
        }
}

async function getEntriesByUser(userId) {
    try {
        const {rows} = await client.query( `
            SELECT * FROM entries
            WHERE "entryId"=${userId};
            `);
        
        return rows
    } catch (error) {
        throw error
    }
}


module.exports = {
    client,
    getAllUsers,
    createUser,
    updateUser,
    createEntry,
    updateEntry,
    getAllEntries,
    getEntriesByUser,
    getUserById
}