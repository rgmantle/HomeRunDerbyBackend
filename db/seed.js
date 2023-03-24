const { 
    client,
    getAllUsers,
    createUser
} = require('./index');

async function dropTables() {
    try {
        console.log("Starting to drop tables...");

       await client.query(`
            DROP TABLE IF EXISTS users;
       `);

       console.log('Finished dropping tables!')

    } catch (error) {
        console.error('Error dropping tables!')
       throw error;
    }
}

async function createTables() {
    try {
       console.log("Starting to build tables...");

       await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            name varchar(255) UNIQUE NOT NULL,
            email varchar(255) NOT NULL,
            entry varchar(255) NOT NULL
        );
       `);
       console.log('Finished building tables!')

    } catch (error) {
        console.error('Error building tables!')
       throw error;
    }
}

async function createInitialUsers() {
    try {
        console.log("Starting to create users....");

        const graig = await createUser({ name: 'Graig Mantle', email: 'graig.mantle@gmail.com', entry: 'Captain Dinger'});

        console.log(graig);

        console.log("Finished creating users!");
    } catch(error) {
        console.error("Error creating users!");
        throw error;
    }
}

async function rebuildDB() {
    try {
        client.connect();

        await dropTables();
        await createTables();
        await createInitialUsers();
    } catch (error) {
        console.error(error);
    } 
}

async function testDB() {
    try {
        console.log("Starting to test database...");

        const users = await getAllUsers();
        console.log("getAllUsers:", users);

        console.log("Finished tests!")
    } catch (error) {
        console.error('Error testing the database!');
        throw error
    }
}

rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());