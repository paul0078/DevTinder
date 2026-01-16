const mongoose = require("mongoose");

const Database = async () => {
    await mongoose.connect("mongodb+srv://malachitti99_db_user:mala_daisy%402499@sample-project.pz2lgqa.mongodb.net/DevTinder"); // it will create DevTinder in Db
}

module.exports = Database;

