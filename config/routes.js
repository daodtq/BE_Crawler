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
  //user
  "POST /login": "user/login",
  "GET /getuser": "user/getuser",
  "POST /adduser": "user/adduser",
  "POST /removeuser": "user/removeuser",
  "POST /edituser": "user/edituser",
  //listing
  "GET /getlisting": "listing/getlisting",
  "GET /getalllisting": "listing/getalllisting",
  "GET /getkpi": "listing/getkpi",
  "POST /addlisting": "listing/addlisting",
  "POST /removelisting": "listing/removelisting",
  "POST /editlisting": "listing/editlisting",
  //task
  "GET /gettask": "task/gettask",
  "GET /gettaskuser": "task/gettaskuser",
  "POST /addtask": "task/addtask",
  "POST /removetask": "task/removetask",
  "POST /edittask": "task/edittask",
  //account
  "GET /getaccount": "account/getaccount",
  "GET /getaccountuser": "account/getaccountuser",
  "POST /addaccount": "account/addaccount",
  "POST /removeaccount": "account/removeaccount",
  "POST /editaccount": "account/editaccount",
  //message
  "GET /getmessage": "message/getmessage",
  "POST /editmessage": "message/editmessage",
  //payout
  "GET /getpayout": "payout/getpayout",
  "GET /getallpayout": "payout/getallpayout",
  "POST /addpayout": "payout/addpayout",
  "POST /editpayout": "payout/editpayout",
  "POST /removepayout": "payout/removepayout",
  //sheet
  "GET /getallsheet": "sheet/getallsheet",
  "GET /getmonthsheet": "sheet/getmonth",

  //crawler
  "POST /crawler": "etsycrawler/crawler",
  "GET /tiktok": "etsycrawler/getTiktok",
  "GET /printevaldisney": "etsycrawler/crawlerdisney",
  "GET /joyboxfactory": "etsycrawler/joyboxfactory",
  "GET /simplewootovarible": "etsycrawler/simplewootovarible",
  "GET /link": "etsycrawler/crawlerlink",
  "GET /woo": "etsycrawler/crawlerwooapi",
  "GET /shopify": "etsycrawler/crawlershopify",
  "GET /listtiktok": "etsycrawler/getlisttiktok",

  //login gooogle
  "POST /logingg": "account/toolaccount",
  "POST /edittool": "account/edittoolaccount",
  "POST /convert": "etsycrawler/convertimg",
  "POST /convert2": "etsycrawler/convertimgupload",

  //tool
  "POST /addvariable": "tool/addvariable",
  "POST /delvariable": "tool/delvariable",
  "GET /getvariable": "tool/getvariable",

  //tool
  "POST /teepublic": "tool/teepublic",
  "POST /redbubble": "tool/redbubble",

  'GET /downloads': 'tool/download',
  'POST /aliexpress': 'tool/aliexpress'
};
