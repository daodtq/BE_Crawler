// Trong file ViewController.js
const path = require('path');
var DomParser = require("dom-parser");

module.exports = {
    friendlyName: "Index",

    description: "Index home.",

    inputs: {
        id: { type: "string" },
    },

    exits: {},

    fn: async function (inputs, exits) {

        const filePath = path.resolve(sails.config.appPath,  "data.csv");
        // Phục vụ file tĩnh
        return this.res.download(filePath);
    },
};
