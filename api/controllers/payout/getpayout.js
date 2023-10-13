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
    const { startDate, endDate, status, iduser } = inputs;
    let payouts = [];
    if (status) {
      payouts = await Payout.find({
        date: {
          ">=": startDate,
          "<=": endDate,
        },
        status: status,
        iduser: iduser,
      });
    } else {
      payouts = await Payout.find({
        date: {
          ">=": startDate,
          "<=": endDate,
        },
        iduser: iduser,
      });
    }
    const accounts = await Account.find({ iduser: iduser });
    for (const payout of payouts) {
      const matchingAccount = accounts.find(
        (account) => account.id === payout.idaccount
      );
      if (matchingAccount) {
        payout.account = matchingAccount.account;
      }
    }

    return exits.success(payouts.reverse());
  },
};
