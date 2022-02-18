const mongoose = require("mongoose");

const connect = () => {
    mongoose.connect(`mongodb://bgg01578:wngus4582@13.125.157.182/myVelog?authSource=admin`, { ignoreUndefined: true }).catch(err => console.log(err));
};
module.exports = connect;