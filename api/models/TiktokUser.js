/**
 * Flontaeclothing/index.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
    attributes: {
      id: { type: "string" },
      acc: { type: "string", required: true },
      value: { type: "string", required: true },
      rule: { type: "number", required: true },
    },
  };
  