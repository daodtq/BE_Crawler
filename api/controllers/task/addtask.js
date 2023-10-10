var DomParser = require("dom-parser");

module.exports = {
  friendlyName: "Index",

  description: "Index home.",

  inputs: {
    task: { type: "string" },
    date: { type: "number" },
    employees: { type: "json" },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      inputs.employees.map(async(row) => {
        const user = await User.findOne({id:row})
        await Task.create({
          task: inputs.task,
          date: inputs.date,
          iduser: row,
          username: user.username,
          name: user.name,
          status: false
        });
      });
      return exits.success({
        message: "Thêm Task thành công!",
        status: "success",
      });
    } catch (e) {
      console.log(e);
      return exits.success({
        message: "Lổi không xác định!",
        status: "fail",
      });
    }
  },
};
