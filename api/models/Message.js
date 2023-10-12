/**
 * Flontaeclothing/index.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    id: { type: "string" },
    idAccount: { type: "string", required: true },
    account: { type: "string", required: true },
    iduser: { type: "string", required: true },
    date: { type: "number", required: true },
    status: { type: "boolean", required: true },
  },
};
