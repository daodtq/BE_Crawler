var DomParser = require("dom-parser");
module.exports = {
  friendlyName: "Index",

  description: "Index home.",

  inputs: {
    id: { type: "string" },
    status: { type: "string" },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      await Message.updateOne({ id: inputs.id }).set({status: inputs.status});
      return exits.success({
        status: "success",
        message: `Update trạng thái thành công!`,
      });
    } catch (error) {
      return exits.success({
        status: "fail",
        message: `Lổi không xác định!`,
      });
    }
  },
};
