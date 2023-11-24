var DomParser = require("dom-parser");
const bcrypt = require("bcryptjs")

module.exports = {
    friendlyName: "Index",
    description: "Index home.",
    inputs: {
        email: { type: "string" },
        color: { type: "string" },
        size: { type: "string" },
        description: { type: "json" },
    },
    exits: {},

    fn: async function (inputs, exits) {
        let { color, size, email, description } = inputs
        let info
        const fetchListingData = async () => {
            try {
                if (color) {
                    await Google.updateOne({ mail: email }).set({ color });
                }
                if (size) {
                    await Google.updateOne({ mail: email }).set({ size });
                }
                if (description) {
                    await Google.updateOne({ mail: email }).set({ description });
                }
                info = await Google.findOne({ mail: email })
                return 0
            } catch (error) {
                console.log(error)
                return 1
            }
        }
        const res = await fetchListingData()
        if (res == 0) {
            return exits.success({ status: 0, size: info?.size, color: info?.color, description: info?.description });
        } else {
            return exits.success({ status: 1 });
        }
    },
};
