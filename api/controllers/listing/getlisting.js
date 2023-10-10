var DomParser = require("dom-parser");

module.exports = {
  friendlyName: "Index",
  description: "Index home.",
  inputs: {
    iduser: {
      type: "string",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    const existUser = await Listing.find({iduser: inputs.iduser });
    return exits.success(existUser);
  },
};
