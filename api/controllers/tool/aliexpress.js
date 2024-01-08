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
                        "x-shopbase-access-token": "b18b6825626122ef4dc1e8fb3e2631aa668b770356dce2af213fda8c997cd34b",
                        "cookie": "_ga=GA1.1.1792510949.1703650164; ajs_group_id=null; _ga=GA1.3.1792510949.1703650164; _cioanonid=15521c4d-f018-8159-1db0-8bf8f3f47372; ajs_user_id=10480287; ajs_anonymous_id=%22b48d4260-e8b1-4d2b-9db5-887e71e3b9e2%22; _cioid=10480287; _gcl_au=1.1.1892393994.1703650262; Cookie-Consent=%7B%22accept_all%22%3Atrue%7D; X-Lang=en-us; _hjSessionUser_1386024=eyJpZCI6IjVhOGY4YzQ4LWJmYzYtNTEzNS05MTdmLTcxMzJjNTEzNmY1NiIsImNyZWF0ZWQiOjE3MDQ0MTkxMTM4OTEsImV4aXN0aW5nIjp0cnVlfQ==; ph_phc_Oww2eJIZyOJFKXXcHaEUZUi70qVB0Sp4J1Xnh8v8Bxa_posthog=%7B%22distinct_id%22%3A11255282%2C%22%24device_id%22%3A%22018ca976-79e4-7cff-916f-ccdce021f15f%22%2C%22%24user_state%22%3A%22identified%22%2C%22%24sesid%22%3A%5B1704679841817%2C%22018ce6d6-2019-7bf4-beff-2455fcedca88%22%2C1704679841817%5D%2C%22%24session_recording_enabled_server_side%22%3Atrue%2C%22%24console_log_recording_enabled_server_side%22%3Atrue%2C%22%24autocapture_disabled_server_side%22%3Afalse%2C%22%24active_feature_flags%22%3A%5B%5D%2C%22%24enabled_feature_flags%22%3A%7B%7D%2C%22%24feature_flag_payloads%22%3A%7B%7D%2C%22%24user_id%22%3A11255282%2C%22%24stored_person_properties%22%3A%7B%22email%22%3A%22egeadcompany.gmc%40gmail.com%22%2C%22name%22%3A%22Van%20Quang%22%7D%2C%22%24flag_call_reported%22%3A%7B%22posthog_web_builder%22%3A%5B%22undefined%22%5D%7D%7D; _gid=GA1.3.780232075.1704679842; auth-cookie=MTcwNDY3OTg0M3xEdi1CQkFFQ180SUFBUkFCRUFBQV85TF9nZ0FDQm5OMGNtbHVad3dUQUJGVFNFOVFYMEZEUTBWVFUxOVVUMHRGVGdaemRISnBibWNNUWdCQVlqRTRZalk0TWpVMk1qWXhNakpsWmpSa1l6RmxPR1ppTTJVeU5qTXhZV0UyTmpoaU56Y3dNelUyWkdObE1tRm1NakV6Wm1SaE9HTTVPVGRqWkRNMFlnWnpkSEpwYm1jTUV3QVJWVk5GVWw5QlEwTkZVMU5mVkU5TFJVNEdjM1J5YVc1bkRFSUFRR014WWpZelpXRTNZelUwWXpZME1qRTBaVGsxWkRZM05qY3lNalE0TldaaFl6QTBOall4TVdFd01qWXlOVE5pWW1GbU1XVTRORE0wTldJek56WTBaVGM9fJ5DHzkCFgE-RUvUcMCeLrgsVN4MnzIfE4-RA730p86z; sb_so=b18b6825626122ef4dc1e8fb3e2631aa668b770356dce2af213fda8c997cd34b; crisp-client%2Fsession%2Ff5c7331c-510d-4a08-bf62-8c63aeeb568e=session_4e2d4de4-b502-4ccc-b6d7-41dffd6332f9; hj_tc=20af6e86; _ga_K91SP82XV5=GS1.1.1704679842.11.1.1704679856.0.0.0",
                        "Referer": "https://socnauphuquoc.onshopbase.com/admin/apps/alidropcon/import-list?limit=20&order_status=awaiting_order",
                        "Referrer-Policy": "strict-origin-when-cross-origin"
                    },
                    "body": `{\"shop_id\":10480287,\"url\":\"${i}\"}`,
                    "method": "POST"
                });

                const jsonn = await response.json();
                console.log(jsonn)

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
                "x-shopbase-access-token": "b18b6825626122ef4dc1e8fb3e2631aa668b770356dce2af213fda8c997cd34b",
                "cookie": "_ga=GA1.1.1792510949.1703650164; ajs_group_id=null; _ga=GA1.3.1792510949.1703650164; _cioanonid=15521c4d-f018-8159-1db0-8bf8f3f47372; ajs_user_id=10480287; ajs_anonymous_id=%22b48d4260-e8b1-4d2b-9db5-887e71e3b9e2%22; _cioid=10480287; _gcl_au=1.1.1892393994.1703650262; Cookie-Consent=%7B%22accept_all%22%3Atrue%7D; X-Lang=en-us; _hjSessionUser_1386024=eyJpZCI6IjVhOGY4YzQ4LWJmYzYtNTEzNS05MTdmLTcxMzJjNTEzNmY1NiIsImNyZWF0ZWQiOjE3MDQ0MTkxMTM4OTEsImV4aXN0aW5nIjp0cnVlfQ==; ph_phc_Oww2eJIZyOJFKXXcHaEUZUi70qVB0Sp4J1Xnh8v8Bxa_posthog=%7B%22distinct_id%22%3A11255282%2C%22%24device_id%22%3A%22018ca976-79e4-7cff-916f-ccdce021f15f%22%2C%22%24user_state%22%3A%22identified%22%2C%22%24sesid%22%3A%5B1704679841817%2C%22018ce6d6-2019-7bf4-beff-2455fcedca88%22%2C1704679841817%5D%2C%22%24session_recording_enabled_server_side%22%3Atrue%2C%22%24console_log_recording_enabled_server_side%22%3Atrue%2C%22%24autocapture_disabled_server_side%22%3Afalse%2C%22%24active_feature_flags%22%3A%5B%5D%2C%22%24enabled_feature_flags%22%3A%7B%7D%2C%22%24feature_flag_payloads%22%3A%7B%7D%2C%22%24user_id%22%3A11255282%2C%22%24stored_person_properties%22%3A%7B%22email%22%3A%22egeadcompany.gmc%40gmail.com%22%2C%22name%22%3A%22Van%20Quang%22%7D%2C%22%24flag_call_reported%22%3A%7B%22posthog_web_builder%22%3A%5B%22undefined%22%5D%7D%7D; _gid=GA1.3.780232075.1704679842; auth-cookie=MTcwNDY3OTg0M3xEdi1CQkFFQ180SUFBUkFCRUFBQV85TF9nZ0FDQm5OMGNtbHVad3dUQUJGVFNFOVFYMEZEUTBWVFUxOVVUMHRGVGdaemRISnBibWNNUWdCQVlqRTRZalk0TWpVMk1qWXhNakpsWmpSa1l6RmxPR1ppTTJVeU5qTXhZV0UyTmpoaU56Y3dNelUyWkdObE1tRm1NakV6Wm1SaE9HTTVPVGRqWkRNMFlnWnpkSEpwYm1jTUV3QVJWVk5GVWw5QlEwTkZVMU5mVkU5TFJVNEdjM1J5YVc1bkRFSUFRR014WWpZelpXRTNZelUwWXpZME1qRTBaVGsxWkRZM05qY3lNalE0TldaaFl6QTBOall4TVdFd01qWXlOVE5pWW1GbU1XVTRORE0wTldJek56WTBaVGM9fJ5DHzkCFgE-RUvUcMCeLrgsVN4MnzIfE4-RA730p86z; sb_so=b18b6825626122ef4dc1e8fb3e2631aa668b770356dce2af213fda8c997cd34b; crisp-client%2Fsession%2Ff5c7331c-510d-4a08-bf62-8c63aeeb568e=session_4e2d4de4-b502-4ccc-b6d7-41dffd6332f9; hj_tc=20af6e86; _ga_K91SP82XV5=GS1.1.1704679842.11.1.1704679879.0.0.0",
                "Referer": "https://socnauphuquoc.onshopbase.com/admin/apps/alidropcon/import-list?limit=20&order_status=awaiting_order",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": `{\"ids\":[${id.join(",")}]}`,
            "method": "DELETE"
        });

        return exits.success(allData);
    }
}
