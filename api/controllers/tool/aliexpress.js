const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');
const moment = require('moment');
const axios = require('axios');
const csv = require('fast-csv');
module.exports = {
    friendlyName: "Index",
    description: "Index home",
    inputs: {
        urls: { type: "json" },
    },
    exits: {},
    fn: async function (inputs, exits) {
        const urls = inputs.urls
        let allData = []
        let id = []
        const fetchListingData = async () => {
            for (let i of urls) {
                console.log("is run")
                const response = await fetch("https://socnauphuquoc.onshopbase.com/admin/ali-dropship-connector/crawl.json", {
                    "headers": {
                        "accept": "*/*",
                        "accept-language": "vi,en;q=0.9",
                        "content-type": "text/plain;charset=UTF-8",
                        "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin",
                        "x-sb-captcha": "eyJzZXJ2aWNlIjoiZ29vZ2xlIn0=",
                        "x-sb-fp-hash": "9ae5b663315eaf535a0edc911d32f074",
                        "x-shopbase-access-token": "3f4352f9feb087e78c8fce4f20be243ecc6dcae4097a93127c4e73741d58aa97",
                        "cookie": "_ga=GA1.1.1792510949.1703650164; ajs_group_id=null; _ga=GA1.3.1792510949.1703650164; _cioanonid=15521c4d-f018-8159-1db0-8bf8f3f47372; ajs_user_id=10480287; ajs_anonymous_id=%22b48d4260-e8b1-4d2b-9db5-887e71e3b9e2%22; _cioid=10480287; _gcl_au=1.1.1892393994.1703650262; Cookie-Consent=%7B%22accept_all%22%3Atrue%7D; X-Lang=en-us; _gid=GA1.3.370531626.1704419041; crisp-client%2Fsession%2Ff5c7331c-510d-4a08-bf62-8c63aeeb568e=session_a3419a84-0aae-40a4-b6e5-c57c701c56b6; hj_tc=ec0c1805; ph_phc_Oww2eJIZyOJFKXXcHaEUZUi70qVB0Sp4J1Xnh8v8Bxa_posthog=%7B%22distinct_id%22%3A11255282%2C%22%24device_id%22%3A%22018ca976-79e4-7cff-916f-ccdce021f15f%22%2C%22%24user_state%22%3A%22identified%22%2C%22%24sesid%22%3A%5B1704419108001%2C%22018cd74a-9c03-7b3b-a57a-090c0397ed5f%22%2C1704419040259%5D%2C%22%24session_recording_enabled_server_side%22%3Atrue%2C%22%24console_log_recording_enabled_server_side%22%3Atrue%2C%22%24autocapture_disabled_server_side%22%3Afalse%2C%22%24active_feature_flags%22%3A%5B%5D%2C%22%24enabled_feature_flags%22%3A%7B%7D%2C%22%24feature_flag_payloads%22%3A%7B%7D%2C%22%24user_id%22%3A11255282%2C%22%24stored_person_properties%22%3A%7B%22email%22%3A%22egeadcompany.gmc%40gmail.com%22%2C%22name%22%3A%22Van%20Quang%22%7D%2C%22%24flag_call_reported%22%3A%7B%22posthog_web_builder%22%3A%5B%22undefined%22%5D%7D%7D; auth-cookie=MTcwNDQxOTExN3xEdi1CQkFFQ180SUFBUkFCRUFBQV85TF9nZ0FDQm5OMGNtbHVad3dUQUJGVFNFOVFYMEZEUTBWVFUxOVVUMHRGVGdaemRISnBibWNNUWdCQU0yWTBNelV5WmpsbVpXSXdPRGRsTnpoak9HWmpaVFJtTWpCaVpUSTBNMlZqWXpaa1kyRmxOREE1TjJFNU16RXlOMk0wWlRjek56UXhaRFU0WVdFNU53WnpkSEpwYm1jTUV3QVJWVk5GVWw5QlEwTkZVMU5mVkU5TFJVNEdjM1J5YVc1bkRFSUFRRFJpTURabU1qZ3dOV05oTlRReFpHRmtZVGhoTVRneVl6ZGxNVE5oT0dZeFpEazVNRFZtWldFeVpUTXlOVGd5TldJNE5qWTBaR05pTURFeU1tTmxaRGc9fMUPq45ttFtD3nMGOQBSHZruPUXGx_J7OK-wMqUST0TW; sb_so=3f4352f9feb087e78c8fce4f20be243ecc6dcae4097a93127c4e73741d58aa97; _hjSessionUser_1386024=eyJpZCI6IjVhOGY4YzQ4LWJmYzYtNTEzNS05MTdmLTcxMzJjNTEzNmY1NiIsImNyZWF0ZWQiOjE3MDQ0MTkxMTM4OTEsImV4aXN0aW5nIjpmYWxzZX0=; _hjIncludedInSessionSample_1386024=0; X-Buyer-AB-Test-Checked=true; _ga_K91SP82XV5=GS1.1.1704423030.4.1.1704423215.0.0.0",
                        "Referer": "https://socnauphuquoc.onshopbase.com/admin/apps/alidropcon/import-list",
                        "Referrer-Policy": "strict-origin-when-cross-origin"
                    },
                    "body": `{\"shop_id\":10480287,\"url\":\"${i}\"}`,
                    "method": "POST"
                });


                const jsonn = await response.json();
                const result = []

                if (jsonn.success == false) {
                    continue
                }
                jsonn.product.mapped_options.forEach(optionSet => {
                    // Tạo một đối tượng mới để lưu trữ kết quả
                    result.push(optionSet.name);
                });

                id.push(jsonn.product.id)
                allData.push({ url: i, title: jsonn.product.title, image: jsonn.product.images.map(image => image.src), description: jsonn.product.short_description, options: result, variable: jsonn.product.variants, GTIN: "", variant_images: jsonn.product.variant_images })
            }
        }
        await fetchListingData();

        await fetch("https://socnauphuquoc.onshopbase.com/admin/ali-dropship-connector/products.json?shop_id=10480287", {
            "headers": {
                "accept": "*/*",
                "accept-language": "vi,en;q=0.9",
                "content-type": "text/plain;charset=UTF-8",
                "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-sb-captcha": "eyJzZXJ2aWNlIjoiZ29vZ2xlIn0=",
                "x-sb-fp-hash": "9ae5b663315eaf535a0edc911d32f074",
                "x-shopbase-access-token": "cc3c8e309de98aa40eaa6bda8a1bcf805fb04793143a30742118a87e94df0544",
                "cookie": "_ga=GA1.1.1792510949.1703650164; ajs_group_id=null; _ga=GA1.3.1792510949.1703650164; _cioanonid=15521c4d-f018-8159-1db0-8bf8f3f47372; ajs_user_id=10480287; ajs_anonymous_id=%22b48d4260-e8b1-4d2b-9db5-887e71e3b9e2%22; _cioid=10480287; _gcl_au=1.1.1892393994.1703650262; Cookie-Consent=%7B%22accept_all%22%3Atrue%7D; X-Lang=en-us; _gid=GA1.3.370531626.1704419041; hj_tc=ec0c1805; _hjSessionUser_1386024=eyJpZCI6IjVhOGY4YzQ4LWJmYzYtNTEzNS05MTdmLTcxMzJjNTEzNmY1NiIsImNyZWF0ZWQiOjE3MDQ0MTkxMTM4OTEsImV4aXN0aW5nIjpmYWxzZX0=; X-Buyer-AB-Test-Checked=true; X-Global-Market-Currency=USD; crisp-client%2Fsession%2Ff5c7331c-510d-4a08-bf62-8c63aeeb568e=session_1cfb7fd8-8fea-4ce9-9cdd-0e5750f535cc; auth-cookie=MTcwNDQ0MTU3M3xEdi1CQkFFQ180SUFBUkFCRUFBQV85TF9nZ0FDQm5OMGNtbHVad3dUQUJGVFNFOVFYMEZEUTBWVFUxOVVUMHRGVGdaemRISnBibWNNUWdCQVkyTXpZemhsTXpBNVpHVTVPR0ZoTkRCbFlXRTJZbVJoT0dFeFltTm1PREExWm1Jd05EYzVNekUwTTJFek1EYzBNakV4T0dFNE4yVTVOR1JtTURVME5BWnpkSEpwYm1jTUV3QVJWVk5GVWw5QlEwTkZVMU5mVkU5TFJVNEdjM1J5YVc1bkRFSUFRRFJpTURabU1qZ3dOV05oTlRReFpHRmtZVGhoTVRneVl6ZGxNVE5oT0dZeFpEazVNRFZtWldFeVpUTXlOVGd5TldJNE5qWTBaR05pTURFeU1tTmxaRGc9fH6V_2DiIYHh4MboMehYM7Rp59HtN8-o9-ib1rlVx7u4; sb_so=cc3c8e309de98aa40eaa6bda8a1bcf805fb04793143a30742118a87e94df0544; crisp-client%2Fsocket%2Ff5c7331c-510d-4a08-bf62-8c63aeeb568e=0; ph_phc_Oww2eJIZyOJFKXXcHaEUZUi70qVB0Sp4J1Xnh8v8Bxa_posthog=%7B%22distinct_id%22%3A11255282%2C%22%24device_id%22%3A%22018ca976-79e4-7cff-916f-ccdce021f15f%22%2C%22%24user_state%22%3A%22identified%22%2C%22%24sesid%22%3A%5B1704442133736%2C%22018cd892-b9bc-7301-b8bc-f87e9b29d21e%22%2C1704440543676%5D%2C%22%24session_recording_enabled_server_side%22%3Atrue%2C%22%24console_log_recording_enabled_server_side%22%3Atrue%2C%22%24autocapture_disabled_server_side%22%3Afalse%2C%22%24active_feature_flags%22%3A%5B%5D%2C%22%24enabled_feature_flags%22%3A%7B%7D%2C%22%24feature_flag_payloads%22%3A%7B%7D%2C%22%24user_id%22%3A11255282%2C%22%24stored_person_properties%22%3A%7B%22email%22%3A%22egeadcompany.gmc%40gmail.com%22%2C%22name%22%3A%22Van%20Quang%22%7D%2C%22%24flag_call_reported%22%3A%7B%22posthog_web_builder%22%3A%5B%22undefined%22%5D%7D%7D; _ga_K91SP82XV5=GS1.1.1704440544.5.1.1704442136.0.0.0",
                "Referer": "https://socnauphuquoc.onshopbase.com/admin/apps/alidropcon/import-list",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": `{\"ids\":[${id.join(",")}]}`,
            "method": "DELETE"
        });

        return exits.success(allData);
    }
}