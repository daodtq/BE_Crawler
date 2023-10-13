var DomParser = require("dom-parser");
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Ho_Chi_Minh');

module.exports = {
  friendlyName: "Index",
  description: "Index home.",
  inputs: {
    iduser: { type: "string" },
    status: { type: "string" },
  },

  exits: {},

  fn: async function (inputs, exits) {
    // const {id, idAccount, iduser, status}  = inputs
    let existAccount = await Message.find({
      iduser: inputs.iduser,
      date: moment().startOf("day").format("x"),
    });
    if (existAccount.length) {
      return exits.success(existAccount);
    } else {
      const res = await Account.find({
        iduser: inputs.iduser,
        status: "active",
      });
      res.map(
        async (e) =>
          await Message.create({
            idAccount: e.id,
            iduser: inputs.iduser,
            account: e.account,
            date: moment().startOf("day").format("x"),
            status: false,
          })
      );
      setTimeout(async () => {
        existAccount = await Message.find({
          iduser: inputs.iduser,
          date: moment().startOf("day").format("x"),
        });
        return exits.success(existAccount);
      }, 1000);
      
    }
  },
};
