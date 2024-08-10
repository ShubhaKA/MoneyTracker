require('dotenv').config();

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

// Connect to MongoDB Atlas Database
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.v6y3ydk.mongodb.net/MoneyDB?retryWrites=true&w=majority&appName=Cluster0`,{
    useNewUrlParser : true,
    useUnifiedTopology : true,
});
var db = mongoose.connection;

db.on('error', () => console.log("Error in Connecting to Database"));
db.once('open', () => console.log("Connected to Database"));

app.post("/tracker", (req, res) => {
    console.log("Received data:", req.body); 

    // Use the keys from the received data
    var category_select = req.body.category;   // Updated key
    var amt_input = req.body.amt;              // Updated key
    var info_input = req.body.info;            // Updated key
    var date_input = req.body.date;            // Updated key

    var data = {
        "Category": category_select,
        "Amount": amt_input,
        "Info": info_input,
        "Date": date_input
    };

    db.collection('users').insertOne(data, (err, collection) => {
        if (err) {
            console.log("Error inserting record", err);
            return res.status(500).send("An error occurred while adding data.");
        }
        console.log("Record inserted successfully:", collection);
        return res.status(200).send("Record added successfully");
    });
});

app.get("/", (req, res) => {
    res.set({
        "Allow-access-Allow-Origin": '*'
    });
    return res.redirect('index.html');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
