var DomParser = require("dom-parser");
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Ho_Chi_Minh');

module.exports = {
    friendlyName: "Index",
    description: "Index home.",
    inputs: {
        email: { type: "string" },
    },

    exits: {},

    fn: async function (inputs, exits) {
        let data = []
        try {
            const { email } = inputs
            if (email) {
                data = await Tiktok.find({ email })
            } else {
                data = await Tiktok.find()
            }
            return exits.success(data);
        } catch (error) {
            return exits.success(data);
        }
    },
};
