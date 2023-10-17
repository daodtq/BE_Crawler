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
    valuedate: {type: "string"}
  },

  exits: {},

  fn: async function (inputs, exits) {
    let sheet
    if(inputs.valuedate){
      sheet = await Sheet.find({valuedate: inputs.valuedate})
    }
    else{ sheet = await Sheet.find({valuedate: moment().format("MM/YYYY")});}
    return exits.success(sheet.reverse());
  },
};
