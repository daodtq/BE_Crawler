var DomParser = require("dom-parser");

module.exports = {
  friendlyName: "Index",

  description: "Index home.",

  inputs: {
    username: {
      type: "string",
    },
    password: {
      type: "string",
    },
    search: {
      type: "string",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    let users = await User.find({ permission: { "!=": 0 } });
    
    if (inputs?.search) {
      const search = inputs.search.toLowerCase();
      let filteredUsers = users.filter(
        (user) =>
          user.username.toLowerCase().includes(search) ||
          user.name.toLowerCase().includes(search)
      );
      return exits.success(filteredUsers);
    } else {
      return exits.success(users);
    }
  },
};
