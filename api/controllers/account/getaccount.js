var DomParser = require("dom-parser");

module.exports = {
  friendlyName: "Index",
  description: "Index home.",
  inputs: {
    id: { type: "string" },
    account: { type: "string" },
    iduser: { type: "string" },
    name: { type: "string" },
    status: { type: "string" },
    search: { type: "string" },
  },

  exits: {},

  fn: async function (inputs, exits) {
    let existAccount = [];
    if (inputs.search) {
      existAccount = await Account.find({
        account: { contains: inputs.search },
      });
    } else {
      existAccount = await Account.find();
    }

    return exits.success(existAccount.reverse());
  },
};
