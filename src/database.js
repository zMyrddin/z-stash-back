
const mongoose = require('mongoose');

/**
 * Connect or create & connect to a database.
 * @date 12/9/2023 - 4:24:25 PM
 *
 * @async
 * @returns
 */
async function databaseConnect(){
    try {
        await mongoose.connect('mongodb+srv://stashAdmin:T5aXMnj1HcZHQfHC@zstashdb.rxv1iv5.mongodb.net/?retryWrites=true&w=majority');
        console.log("Database connected!");
    } catch (error) {
        console.warn(`databaseConnect failed to connect to DB:\n${JSON.stringify(error)}`);
    }
}

module.exports = {
    databaseConnect
}