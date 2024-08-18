const sql = require('mysql');
const env = require('dotenv');

env.config();

const con = sql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});
const PORT = process.env.DB_PORT || 3000;

const DbCon = async () => {
    try {
        await con.connect(() => {
            console.log(`DB Connected on port :${PORT}`);
        });
    } catch (e) {
        console.log(e.message);
    }
};

module.exports = { DbCon, con };
