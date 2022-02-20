const mongoose = require('mongoose');

const connect = () => {
    mongoose
        .connect(
            `mongodb://${process.env.MONGO_DB_ID}:${process.env.MONGO_DB_PWD}@13.125.157.182/myVelog?authSource=admin`,
            {
                ignoreUndefined: true,
            }
        )
        .catch((err) => console.log(err));
};
module.exports = connect;
