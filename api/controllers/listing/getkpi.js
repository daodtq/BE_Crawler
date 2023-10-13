var DomParser = require("dom-parser");
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Ho_Chi_Minh');

module.exports = {
  friendlyName: "Index",
  description: "Index home.",
  inputs: {
    iduser: {
      type: "string",
    },
    startDate: {
      type: "number",
    },
    endDate: {
      type: "number",
    },
    currentPage: {
      type: "number",
    },
    search: {
      type: "string",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    const iduser = inputs.iduser;

    // Lấy ngày đầu tiên và cuối cùng của tháng hiện tại
    const currentMonthStart = moment().startOf("month").toDate();
    const currentMonthEnd = moment().endOf("month").toDate();

    try {
      //listing
      const count = await Listing.count({
        iduser: iduser,
        date: {
          ">=": currentMonthStart,
          "<=": currentMonthEnd,
        },
      });
      const user = await User.findOne({ id: iduser });
      const listing = user?.listing ? user?.listing : 0;

      //task
      const totalTasks = await Task.count({
        iduser: iduser,
        date: {
          ">=": currentMonthStart,
          "<=": currentMonthEnd,
        },
      });

      const completedTasks = await Task.count({
        iduser: iduser,
        status: true,
        date: {
          ">=": currentMonthStart,
          "<=": currentMonthEnd,
        },
      });

      const completionRate = `${(completedTasks / totalTasks) * 100}%`;

      //mesage
      const totalMessage = await Message.count({
        iduser: iduser,
        date: {
          ">=": currentMonthStart,
          "<=": currentMonthEnd,
        },
      });

      const compledMessage = await Message.count({
        iduser: iduser, 
        date: { ">=": currentMonthStart, "<=": currentMonthEnd },
        status: true,
      });
      const completionMessage = `${(compledMessage / totalMessage) * 100}%`;

      return exits.success({
        listing: `${count}/${listing}`,
        task: `${completedTasks}/${totalTasks}`,
        listingpercent: listing == 0 ? "100%" : `${(count / listing) * 100}%`,
        taskpercent: completionRate,
        message: completionMessage,
      });
    } catch (err) {
      return res.serverError(err);
    }
  },
};
