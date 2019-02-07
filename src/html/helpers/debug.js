module.exports = function(options) {
    console.log("Current Context");
    console.log("====================");
    console.log(this);
    if (options) {
        console.log("Value");
        console.log("====================");
        console.log(options);
    }
};
