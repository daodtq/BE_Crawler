var DomParser = require("dom-parser");
const moment = require("moment/moment");

module.exports = {
  friendlyName: "Index",
  description: "Index home.",
  inputs: {
    id: { type: "string" },
    account: { type: "string" },
    iduser: { type: "string" },
    name: { type: "string" },
    status: { type: "string" },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      const data = await Account.find({ iduser: inputs.iduser })
      return exits.success(data);
    } catch (error) {
      return exits.success({
        status: "fail",
        message: `Lổi không xác định!`,
      });
    }
  },
};
