const { 
    client,
    getAllUsers,
    createUser,
    updateUser,
    createEntry,
    updateEntry,
    getAllEntries,
    getEntriesByUser,
    getUserById
} = require('./index');

async function dropTables() {
    try {
        console.log("Starting to drop tables...");

       await client.query(`
       DROP TABLE IF EXISTS totals;
       DROP TABLE IF EXISTS players;
       DROP TABLE IF EXISTS entries;
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
            entry varchar(255) NOT NULL,
            paid BOOLEAN DEFAULT false
        );
        CREATE TABLE entries (
            id SERIAL PRIMARY KEY,
            "entryId" INTEGER REFERENCES users(id),
            poolaone varchar(255),
            poolbone varchar(255),
            poolbtwo varchar(255),
            poolcone varchar(255),
            poolctwo varchar(255),
            poolcthree varchar(255) 
        );
        CREATE TABLE players (
            id SERIAL PRIMARY KEY,
            mlb_id INTEGER UNIQUE,
            fg_id INTEGER UNIQUE,
            first_name varchar(255),
            last_name varchar(255),
            prev_yr INTEGER,
            this_pred INTEGER,
            team varchar(255),
            groupcode varchar(255)
        );
        CREATE TABLE totals (
            id SERIAL PRIMARY KEY,
            "entryId" INTEGER REFERENCES entries(id),
            "playerId" INTEGER REFERENCES players(id)

        )
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

        await createUser({ name: 'Graig Mantle', email: 'graig.mantle@gmail.com', entry: 'Captain Dinger'});
        await createUser({ name: 'Brandon Brown', email: 'brandon.brown22@gmail.com', entry: 'Commissioner'});
        await createUser({ name: 'Greg Carathimas', email: 'greg.carathimas@gmail.com', entry: 'Greek Greg'});

        console.log("Finished creating users!");
    } catch(error) {
        console.error("Error creating users!");
        throw error;
    }
}

async function createInitialEntries() {
    try {
        const [graig, brandon, greg] = await getAllUsers();

        await createEntry({ 
            entryId: graig.id, 
            poolaone: 'Aaron Judge', 
            poolbone: 'Hunter Renfroe', 
            poolbtwo: 'Giancarlo Stanton', 
            poolcone: 'Jake Cronenworth',
            poolctwo: 'Mike Yazstremski',
            poolcthree: 'Joey Votto'
        });
        await createEntry({ 
            entryId: brandon.id, 
            poolaone: 'Mike Trout', 
            poolbone: 'Christian Yelich', 
            poolbtwo: 'Mitch Haniger', 
            poolcone: 'Javier Baez',
            poolctwo: 'Spencer Torkelson',
            poolcthree: 'Adam Duvall'
        });
        await createEntry({ 
            entryId: greg.id, 
            poolaone: 'Vladimir Guerrero', 
            poolbone: 'Shohei Ohtani', 
            poolbtwo: 'Seth Brown', 
            poolcone: 'DJ Lemahieu',
            poolctwo: 'Gleyber Torres',
            poolcthree: 'Rafael Devers'
        });

        console.log("Finished creating entries!");
    } catch(error) {
        console.error("Error creating entries!");
        throw error;
    }
}

async function rebuildDB() {
    try {
        client.connect();

        await dropTables();
        await createTables();
        await createInitialUsers();
        await createInitialEntries();
    } catch (error) {
        console.error(error);
    } 
}

async function testDB() {
    try {
        console.log("Starting to test database...");

        console.log('Calling getAllUsers');
        const users = await getAllUsers();
        console.log("Result:", users);

        console.log('Calling getAllEntries');
        const entries = await getAllEntries();
        console.log("Result:", entries);

        console.log('Calling update on users[0]');
        const updateUserResult = await updateUser(users[0].id, {
            entry: 'Home Run Homer',
            paid: true
        });
        console.log('Result:', updateUserResult);

        console.log('Calling update on entries[0]');
        const updateEntryResult = await updateEntry(entries[0].id, {
            poolaone: 'Kyle Schwarber',
            poolcthree: 'Fernando Tatis'
        });
        console.log('Result:', updateEntryResult);

        console.log("Calling getUserById with 2");
        const graig = await getUserById(2);
        console.log("Result:", graig);

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