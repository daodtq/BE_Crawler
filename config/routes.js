/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  "GET /flontaeclothing": "home/flontaeclothing",
  "GET /hawalili": "home/hawalili",
  "GET /crawler": "home/crawler",
  "GET /tiniven": "home/tiniven",
  "GET /amazon": "home/amazonold",
  "POST /res": "home/res",
  "GET /bot": "home/bot",
  "POST /login": "home/login",
};
