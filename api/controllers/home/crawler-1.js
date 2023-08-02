const { type } = require('os');
const axios = require('axios');
module.exports = {


  friendlyName: 'Crawler 1',


  description: '',


  inputs: {
    url: { type: "string" }
  },


  exits: {

  },


  fn: async function (inputs, exits) {

    // All done.

    const res1 =
      fetch(inputs.url, {
        "headers": {
          "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "accept-language": "vi,en;q=0.9",
          "cache-control": "max-age=0",
          "sec-ch-ua": "\"Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"115\", \"Chromium\";v=\"115\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "document",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "none",
          "sec-fetch-user": "?1",
          "upgrade-insecure-requests": "1",
          "cookie": "_gcl_au=1.1.502723946.1690899600; _ga=GA1.1.574883684.1690899600; ln_or=eyI1MDkzNTYyIjoiZCJ9; _rdt_uuid=1690899600815.e14a5da8-5f56-4cfb-b58e-2107568f5bd4; _pin_unauth=dWlkPVpUWTNNekEyWVRNdE9UazJZaTAwWm1FNExXSmhZbU10TnpSbU9XSmxNVFk0WmpJMw; _tt_enable_cookie=1; _ttp=snuUxNFLH0ca9zyt3pi4QRsrKK5; fingerprint=QhVFUeIXwoKfSuWwWPkAjQ3hQDxNz2uLI3LXvOGU; cjConsent=MHxOfDB8Tnww; cjLiveRampLastCall=2023-08-01T14:20:02.208Z; cjUser=fb8e1f82%2D07c8%2D4eee%2Da981%2D1d6d20834668; __stripe_mid=50d6e105-c702-473f-9754-a13cac846005c3a105; __stripe_sid=c0e82dad-2c67-4c47-aebf-25ae145efd43df6971; _ga_5Q57T3BBYZ=GS1.1.1690899600.1.1.1690901424.0.0.0; __kla_id=eyIkcmVmZXJyZXIiOnsidHMiOjE2OTA4OTk2MDEsInZhbHVlIjoiIiwiZmlyc3RfcGFnZSI6Imh0dHBzOi8vcHJpbnRlcnZhbC5jb20vIn0sIiRsYXN0X3JlZmVycmVyIjp7InRzIjoxNjkwOTAxNDI1LCJ2YWx1ZSI6IiIsImZpcnN0X3BhZ2UiOiJodHRwczovL3ByaW50ZXJ2YWwuY29tLyJ9fQ==; _uetsid=807414f0307611ee8e2397ea09314b61; _uetvid=807400e0307611ee960dc5de9ac2a6a7; _derived_epik=dj0yJnU9Z2dvNV83czNpaEs4Q055enFGTEU3YTdCUjk5MEhUQVUmbj16QnV2QnlYd1Z5ZVplQVowdkV0V3Z3Jm09MSZ0PUFBQUFBR1RKRzdJJnJtPTEmcnQ9QUFBQUFHVEpHN0kmc3A9Mg; laravel_session=eyJpdiI6Im5aYW0wNEl1QzFuSUhyU2xVMmFQRXc9PSIsInZhbHVlIjoiZjhZZXRXQVlSMldtbkxZcExzRTAwV1ptQys0OTVLZlhcL2hPa3hjVHQ0TzZGbldkRUh5dHBqaXdISVFoZ0ZZZXhqZnlCKyswUkc3XC8xWHpUclVsNWtXQT09IiwibWFjIjoiNzcwNThjZWRjNTljYTczYTUyNzRmYzc3YzA4ZjBjYTE3ZjY5MWNhMTFmNzA0NmFhNzM1MzY0ZGU2YzU5NTBlNiJ9"
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET"
      });
    const text = await res1.text();
    console.log(text);
    // let res = await axios(config)
    // let data = res.data;
    return exits.success(text)


  }
};
