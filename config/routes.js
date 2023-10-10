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
  //account
  "POST /login": "account/login",
  "GET /getuser": "account/getuser",
  "POST /adduser": "account/adduser",
  "POST /removeuser": "account/removeuser",
  "POST /edituser": "account/edituser",
  //listing
  "GET /getlisting": "listing/getlisting",
  "GET /getalllisting": "listing/getalllisting",
  "POST /addlisting": "listing/addlisting",
  "POST /removelisting": "listing/removelisting",
  "POST /editlisting": "listing/editlisting",
  //task
  "GET /gettask": "task/gettask",
  "GET /gettaskuser": "task/gettaskuser",
  "POST /addtask": "task/addtask",
  "POST /removetask": "task/removetask",
  "POST /edittask": "task/edittask",
};
