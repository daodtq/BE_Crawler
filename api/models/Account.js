/**
 * Flontaeclothing/index.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
    attributes: {
      id: { type: "string" },
      account: { type: "string", required: true },
      iduser: { type: "string", required: true },
      name: { type: "string", required: true },
      status: { type: "string", defaultsTo: 'active',},
    },
  };
  