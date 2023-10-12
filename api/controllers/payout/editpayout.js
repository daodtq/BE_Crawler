var DomParser = require("dom-parser");
module.exports = {
  friendlyName: "Index",

  description: "Index home.",

  inputs: {
    id: { type: "string" },
    price: { type: "number" },
    idaccount: { type: "string" },
    status: { type: "boolean" },

  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      if(inputs.status){
        await Payout.updateOne({ id: inputs.id }).set({
          status: inputs.status,
        });
        return exits.success({
          status: "success",
          message: `Update Payload thành công!`,
        });
      }
      await Payout.updateOne({ id: inputs.id }).set({
        price: inputs.price,
        idaccount: inputs.idaccount,
      });
      return exits.success({
        status: "success",
        message: `Update Payload thành công!`,
      });
    } catch (error) {
      return exits.success({
        status: "fail",
        message: `Lổi không xác định!`,
      });
    }
  },
};
