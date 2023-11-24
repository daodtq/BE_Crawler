var DomParser = require("dom-parser");
const bcrypt = require("bcryptjs")

module.exports = {
    friendlyName: "Index",
    description: "Index home.",
    inputs: {
        hash: { type: "string" },
    },
    exits: {},

    fn: async function (inputs, exits) {
        let { hash } = inputs
        const time = hash.slice(-10);
        hash = hash.slice(0, -10)
        let existAccount = [];
        let info = {}
        const fetchListingData = async () => {
            existAccount = await Google.find();
            for (const _existAccount of existAccount) {
                const result = await new Promise((resolve, reject) => {
                    bcrypt.compare(_existAccount.mail, hash, (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                });

                if (result) {
                    await Google.updateOne({ mail: _existAccount.mail }).set({ time });
                    info = _existAccount
                    return 0; // Thực hiện các hành động sau khi xác thực thành công
                }
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
