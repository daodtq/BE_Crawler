var DomParser = require("dom-parser");
module.exports = {
  friendlyName: "Index",

  description: "Index home.",

  inputs: {
    id: { type: "string" },
    username: { type: "string"},
    iduser: { type: "string"},
    name: { type: "string"},
    task: { type: "string"},
    status: { type: "string" },
    date: { type: "number"},
    note: { type: "string" },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      await Task.updateOne({ id: inputs.id }).set(inputs);
      return exits.success({
        status: "success",
        message: `Sửa Task thành công!`,
      });
    } catch (error) {
      console.log(error)
      return exits.success({
        status: "fail",
        message: `Lổi không xác định!`,
      });
    }
  },
};
