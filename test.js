const mongoose = require('mongoose');
require('dotenv').config();

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.v6y3ydk.mongodb.net/MoneyDB?retryWrites=true&w=majority&appName=Cluster0`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', (err) => {
    console.error("Error in connecting to Database", err);
});
db.once('open', () => {
    console.log("Connected to Database");

    const data = {
        "Category": "Test",
        "Amount": 100,
        "Info": "Test info",
        "Date": new Date()
    };

    db.collection('users').insertOne(data, (err, collection) => {
        if (err) {
            console.error("Error inserting record", err);
        } else {
            console.log("Record inserted successfully", collection);
        }
        mongoose.connection.close();
    });
});
