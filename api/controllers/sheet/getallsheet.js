var DomParser = require("dom-parser");
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Ho_Chi_Minh');

module.exports = {
  friendlyName: "Index",
  description: "Index home.",
  inputs: {
    startDate: { type: "number" },
    endDate: { type: "number" },
    status: { type: "string" },
    iduser: { type: "string" },
  },

  exits: {},

  fn: async function (inputs, exits) {
    const sheet = await Sheet.find();
    return exits.success(sheet.reverse());
  },
};
