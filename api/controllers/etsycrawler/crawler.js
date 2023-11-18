const fetch = require('node-fetch');
const cheerio = require('cheerio');
const moment = require('moment');
const axios = require('axios');
const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
    "Referer": "https://www.etsy.com/",
    // Add other headers as necessary
}

const cookieArray = ["uaid=AkovfaFsGGxrMqIJiVB2YXz7JO9jZACCVN9Hj2F0tVJpYmaKkpVSbpinmbFuqolLlktBYUa6aaSxkWWBR5Chi7tuolItAwA.; user_prefs=yKI9KdE-ChiH5yRPnwMGdyinEnhjZACCVN9Hj2F0tFKYn4uSTl5pTo6OUmqebmiwkg5QCCpiBKFwEbEMAA..; fve=1699603171.0; _fbp=fb.1.1699603171961.3431392936605298; last_browse_page=https%3A%2F%2Fwww.etsy.com%2Fshop%2FAbelRucenLake; ua=531227642bc86f3b5fd7103a0c0b4fd6; _gcl_au=1.1.1755311406.1699603175; _ga=GA1.1.217590824.1699603175; _uetsid=16e28a107f9f11ee9f2fcd053bd4f4c2; _uetvid=a380b3e0369411eea45591d5d30cedf6; lantern=5daf979c-62a8-46c6-994a-7c2773420851; _pin_unauth=dWlkPVlqSTFPR0l5WVRZdE9EazJNQzAwTXpRd0xXSTBNREF0T0RSa05XWXhNV1l4WVRBeA; _ga_KR3J610VYM=GS1.1.1699603175.1.0.1699603178.57.0.0; datadome=dnaUfBuve16THyE6g~KILTh5b81sbblzE3IGNuDumTBjpeYyyM6pDfYUmJS8dMJf9LGm7bzGPgQylsKNKByLdGco_714C6fw~Fivhs7wBhV5NePvjOqH08ppRn4ho6M2",
    "uaid=Z5GsTQ3niKYKabm0WT_F0Mm0ONVjZACC1MCfnTC6Wqk0MTNFyUqp0jjAu8AnNDPD0a8oI9fTzDjLOzvesziv2NitSqmWAQA.; user_prefs=jd9j0yN94jxxvFqmQ0iRl-_KwTRjZACC1MCfnTA6Wik02EVJJ680J0dHKTVPNzRYSUcJRIBFjCAULiKWAQA.; fve=1699871113.0; _fbp=fb.1.1699871113879.7819293911513983; ua=531227642bc86f3b5fd7103a0c0b4fd6; _gcl_au=1.1.1037509165.1699871167; _ga=GA1.1.1992753955.1699871171; __pdst=412d4a169450415bb855cde086947017; lantern=cbbb6338-458d-47aa-9100-1f35e041b62f; _tt_enable_cookie=1; _ttp=-coioRZdR7lOr5nEcEm5U32W3VJ; _pin_unauth=dWlkPU1HVXhNVGMwWldFdE56SXpOaTAwTmpZeExUazVPR010Wm1Rd09HTTVaR1F4TlRjMw; wedding_session=FOYIKvevfuLwTfTNBcNzB1qx6JpjZACC1KC79-A0AA..; _uetvid=11904ba0820f11eea0948df67378d545; granify.uuid=a0120c5d-28a8-453d-9e3e-0c340e256b03; granify.session.qivBM=-1; _ga_KR3J610VYM=GS1.1.1700097186.7.1.1700097478.60.0.0; granify.new_user.qivBM=false; search_history_v2=_YqEb0m3V8BZtnmTpGoCwRqUwVVjZACC1MCfnWA67PjBaqXi1MSi5IzUYiWr6GqlwtLUokolK6X8orzE3NS8EiUdpZLM3NT44pLE3AIlK0NzAwNDCzMDE0sdpYzE4vii1OLSnBKg1pKi0tRaHST9QO2JeakY-s0sLS2NLE0szQnoT8kszkutxKrb3MDCBJvu2FoGAA..; num_listings_clicked_from_search=dIdHWaufBP9fv65lUJ9LP3FY0-hjZACC1LDjB2F0tVJ-UV5ibmpeiZKVQS0DAA..; datadome=xfIGHQf4ENe31VdRLMXnGb7JHdLe0OpOtDNWiGXQu~KHKzvVYGqSZEDQ5oFuBxIgQaUJoDXKapey3bSqotQHnQlpu~RHinIIALkI257PFtMLT4NE_fiJA3em_Ke0Zj9F",
    "uaid=tCsiiM_4zYcPiVsoy4TxLptoROhjZACC1AhjHhhdrVSamJmiZKVkUJkYmRVmkpysW-Zckuqake1falAV4JplEGCRo1TLAAA.; user_prefs=AOEhF2fLBBSlGmyfihRQn9CMpR1jZACC1AhjHhgdrRQa7KKkk1eak6OjlJqnGxqspKMEIsAiRhAKFxHLAAA.; fve=1700279052.0; _fbp=fb.1.1700279052616.9308906188077258; last_browse_page=https%3A%2F%2Fwww.etsy.com%2Fshop%2FCuTeesCustomShirts; exp_ebid=m=POrNGDRwUTRuCU7uobJ8vZpcemCjcndO0rM3K43BFM0%3D,v=C2y-0LYpqSI2mwGkHxVOIzqpjHT_vUrA; ua=531227642bc86f3b5fd7103a0c0b4fd6; _gcl_au=1.1.958624575.1700279065; _ga=GA1.1.1882288673.1700279066; _uetsid=c58a360085c411eeb536571488c93ae7; _uetvid=c58a3b5085c411ee8863af752d6648cc; __pdst=9ef2829534304e6bb3f5c81b50f11a65; lantern=9a8e957f-89b8-448c-8454-6dc78b07c963; _pin_unauth=dWlkPVlUbGxaR05tTkRndE1UVXpZeTAwTnpFd0xUZ3hObU10T1dOa1l6QmpNekV3TVdFeA; _tt_enable_cookie=1; _ttp=s3uq_MeYt237YZ9CwYuQRB3-qkf; _ga_KR3J610VYM=GS1.1.1700279065.1.0.1700279076.49.0.0; granify.uuid=028450d9-a21f-45f1-ad5b-018839fcfb37; granify.new_user.qivBM=true; datadome=ZCBz99Jp3Muyn~~8w~m8vzHeYDxTaEk8bnYlnq3pKKWd2qDUwfMNviOrgBirxf54Xo0rNnYVSqGMI8mYm2GsHQkL2OFo_ztEVzGmq9Jk0RawW3WL4RumWbYyb7UwJcCv; granify.session.qivBM=-1", "uaid=9kD5sJNCUQ0dEUW1LNLGNI8pqMRjZACC1AhjLhhdrVSamJmiZKUUERHuWe4TkWec7Wzm4REYWOTpV-hYkhIWUpnhqVTLAAA.; user_prefs=yBWk6F3rsojnNeGpqnM-k1ui06BjZACC1AhjLhgdrRQa7KKkk1eak6OjlJqnGxqspKMEIsAiRhAKFxHLAAA.; fve=1700279050.0; _fbp=fb.1.1700279050843.7416525340527682; last_browse_page=https%3A%2F%2Fwww.etsy.com%2Fshop%2FCuTeesCustomShirts; exp_ebid=m=mpNiQ8cKhTTgEjGsPwKOKerChg4CWCX6lyc0Ovdm0Go%3D,v=l92yweZeaQiAa9hycOBV4lJrXck4wtbs; ua=531227642bc86f3b5fd7103a0c0b4fd6; _gcl_au=1.1.2138297451.1700279067; datadome=kf28AZrR796wlSTY9srUTPCEVFypvFgz0oBPuFokgYfL8vs_cvdsublD3oEX89rEKTnyqSCwLda0wwfrBG0W4jAJh6jF~9mLUSUOGCJAZzU8ILmTOhQFiFTU9KeCkG13; _ga=GA1.1.2954430.1700279074; _uetsid=ca1db91085c411eebdf45527b18bf979; _uetvid=ca1de9e085c411ee9df3655871b58205; __pdst=fa8ae3955af249578b73bafeee63f5f1; lantern=f3272bd1-ac47-47ad-a2d1-fd54b5f94baa; _pin_unauth=dWlkPU5XRTNZamhrT1dRdFpUVXpNeTAwTnpneExXRTVZemd0WWpCbVkyVmpaREJtTURGaw; _tt_enable_cookie=1; _ttp=FhC6mAh9Gb26j6VX6fapV-o3jr3; _ga_KR3J610VYM=GS1.1.1700279073.1.0.1700279079.54.0.0"
    , "uaid=YNmVurEnBhizNLsnOe_pPQld5_FjZACC1AhjThhdrVSamJmiZKUU5OdsERrkk2jmFpzhYRIfbJac7eHpkV1eVm5hqlTLAAA.; user_prefs=0FgMaRzLbuceT8VqQC7OeynYUfVjZACC1AhjThgdrRQa7KKkk1eak6OjlJqnGxqspKMEIsAiRhAKFxHLAAA.; fve=1700279049.0; _fbp=fb.1.1700279049695.4668370278936362; last_browse_page=https%3A%2F%2Fwww.etsy.com%2Fshop%2FCuTeesCustomShirts; exp_ebid=m=8IB%2FeHowkWsQk%2BOXKXr%2FMW8bY2cA7%2F3Mrx%2BXE7pdLA8%3D,v=i9mkU0HAiV3Fkq6oe2g1b_QDrjnMt7lD; ua=531227642bc86f3b5fd7103a0c0b4fd6; _gcl_au=1.1.925049482.1700279069; datadome=_7g7ZCrEEqAtFUgf4VVCLG30TxEIgm7zdnOybL422yHnObo__0DDC5GLCr1wauc86icjswwLTj01_0fUg~fnQJzShuZLoy4oMq435q4inBmD6yFG_OOhpnvwQgh7zD2d; _ga=GA1.1.831919665.1700279077; _uetsid=cbde5d4085c411eea29bb344a4104732; _uetvid=cbde646085c411eeaf08598031f03116; __pdst=3aea41440f66447ca77340fc6f39974f; lantern=c7a3b531-0190-4be6-ac1b-a009a15ddc04; _pin_unauth=dWlkPU56ZGxaR0poTmprdE16ZGlNQzAwT1dReUxXSmhNREV0TnpJMk1HUXlZMk0wWWpFMw; _tt_enable_cookie=1; _ttp=HqDe4zO4ZLPSoGo2h8jKEBMGNR9; _ga_KR3J610VYM=GS1.1.1700279077.1.0.1700279085.52.0.0; granify.uuid=1170bce8-7a51-4115-818d-7369a942d229; granify.new_user.qivBM=true; granify.session.qivBM=-1"
    , "fve=1699495287.0; _fbp=fb.1.1699495287832.9039159996126582; ua=531227642bc86f3b5fd7103a0c0b4fd6; _gcl_au=1.1.1791133090.1699495293; _ga=GA1.1.104939601.1699495294; __pdst=71ac90d2b3224e799d4373fbb644489b; lantern=4eb41f7e-a110-47c2-89ca-fcae40f9b0ae; _pin_unauth=dWlkPU4yVmhOek0zWm1ZdE5EY3hPQzAwWXprMkxXRmtZMlF0TlRSbU9XRXpaakkyT1RReg; _tt_enable_cookie=1; _ttp=xnLwN3R4L_hqiX9stC7J5bpj_yD; _uetvid=e99353807ea311ee9d6aaf6de8e4e81f; user_prefs=gv64NDtgaw1k0a8efbE1tKg_BL5jZACCVB_bcgi9RjJaKTTYRUknrzQnR0cpNU83NFhJRwlEgEWMIBQuIpYBAA..; uaid=KAPmkDG-oz3HFhG_RJxl-VosgbJjZACCVB_bcjAdYcxRrVSamJmiZKUUkFdqFB9kkutlkZWva-JpFuGXGxRS4eykG-KUp1TLAAA.; last_browse_page=https%3A%2F%2Fwww.etsy.com%2Fshop%2FCuTeesCustomShirts; exp_ebid=m=EzL9pGGbs8hCpqvRkUTdhPKNZVkc8rTh7yALxZd27nM%3D,v=8N0vOXvTBsHecO8gW5biMX1lpnb7NsZe; datadome=gUJxGzBckAfkHZ_G1qn9ZKwab0YWEJMKMuyvAb5prvU96D29BIiY7s487FKrwpflIe0srCesjI1lHlMlE4MLP88h2v4wZDu5JQxHYyZJk~aSaX9avas4xdnap6gy1Vnn; _uetsid=c8e299f085c411ee95a297f98f63d6f1; _ga_KR3J610VYM=GS1.1.1700279070.3.0.1700279076.54.0.0; granify.uuid=f7f4df30-d8dc-4bba-a3da-6c119432b7c3; granify.new_user.qivBM=false; granify.session.qivBM=-1"
    , "user_prefs=bAY2JCmHzMG6KZrI6uIdArQMBlxjZACCVB87PRgdrRQa7KKkk1eak6OjlJqnGxqspKMEIsAiRhAKFxHLAAA.; fve=1699495471.0; _fbp=fb.1.1699495471181.1086493705674900; ua=531227642bc86f3b5fd7103a0c0b4fd6; _gcl_au=1.1.87083016.1699495479; _ga=GA1.1.556534341.1699495480; __pdst=0f5bd3272ea44e1fb43b962e4a412f17; lantern=49309958-ac47-456a-a09a-571a40b525f2; _tt_enable_cookie=1; _ttp=oAs2cGtbgSMv1hiOhAJ030gnVWE; _pin_unauth=dWlkPU5qY3pOVEF6WVRNdFlUSmpNaTAwTldSaExUbG1ZbVl0TkRRMU1tUmpPRE16TlRVeg; _uetvid=57b1bec07ea411eea3c02b97ecfafc8d; uaid=u35nsyCPxgWTaY445lq4yC1Gj6VjZACCVB87PTAdYcxWrVSamJmiZKVkZJCb7OoW7xtZnBXmV-CnW1FWHlDkVh7q7liRq1TLAAA.; last_browse_page=https%3A%2F%2Fwww.etsy.com%2Fshop%2FCuTeesCustomShirts; exp_ebid=m=iZGIvfV%2BpObHsDZEB6yDxEZhRvnp5wYbkRBM0H0NQZs%3D,v=RXzBPHutkqnYxhLt6wZOzyyRJxYdw0yE; datadome=0PJlHgAO_CwLNiP9~X2V86vll4V8i2iITsOcXZlTXvwSB3ut9NK9wOBRDc9NKDonRNBA_5DnHtFIoJCeMCgudX65zkoNjXSrri_e3W8tDhaF8~fZL4T2NGBt8tqSdS31; _uetsid=c8e26b4085c411ee9b5563dafb3a4f8e; _ga_KR3J610VYM=GS1.1.1700279072.2.0.1700279076.56.0.0; granify.uuid=2094f273-bff6-4261-8b2b-03455a20b20d; granify.new_user.qivBM=false; granify.session.qivBM=-1"
    , "fve=1698892749.0; _fbp=fb.1.1698892749920.5705227143492975; ua=531227642bc86f3b5fd7103a0c0b4fd6; _gcl_au=1.1.1404246717.1698892751; _ga=GA1.1.535387908.1698892752; lantern=fada988f-6d07-4a44-ac49-2ee41098bacd; _pin_unauth=dWlkPU9UZ3dPVEV4TldFdE1EUXdZeTAwTnpBekxXSTVObU10WmpFM1pEUXhZMk5oTWpsaw; __pdst=c90a8b993fbe414f967a91a5b9870905; _tt_enable_cookie=1; _ttp=ZWrDUlg5mURnIW5Oqk6TfNbflNZ; user_prefs=-MouoA_h2hLX1fXVoCv_3cHtD_ZjZACCVGfusxA6dnq0Umiwi5JOXmlOjo5Sap5uaLCSjhKIAIsYQShcRCwDAA..; wedding_session=QiSPHSU2T_iMLhjwmBec6bTy1iFjZACCVNffB-E0AA..; g_state={\"i_p\":1699850461886,\"i_l\":1}; search_history_v2=bfywmo7V7ZTp3-3ofIkScuknfPuNkEEKgzAQRfUmMmsLUUxihC4LPYBdlSJpHTBQtZ3EhYgn6KUb3BRawc5mFsN7_zNh4AeP-9eyTxROYFHTrUELxXmC54A0QgGH9kq9qZGwjkr0xxicabGyTrcPKBLJGFM5F0kMjbYVoR3uziscDTjHH09tbIdjZBtD7tshlFJcqpz95VilhZR8g-6p0y12q-lppkS6wZe7pfzPBzzPUyazVf4yB28.; uaid=TFY81q99ES5-egGxhYdmC59PNWxjZACCVGfus2A67NSOaqXSxMwUJSulPHen0tyKTJdkf7NyZ0O_3OL8cG8_V4PUyMS0KqVaBgA.; last_browse_page=https%3A%2F%2Fwww.etsy.com%2Fshop%2FCuTeesCustomShirts; exp_ebid=m=Jo%2BqIA%2Fv3oy%2FtNkSN6fvQyhYf6%2FblGSdSvs3JnJiI4c%3D,v=ZaEi7XChhbz37YI_wLPcJDWGgkSio0VX; _uetsid=b52c3b7085c411ee8ad3757f90e57d40; _uetvid=012f33e0792911ee94c769eb9dc5716d; _ga_KR3J610VYM=GS1.1.1700279039.32.0.1700279040.59.0.0; granify.uuid=32949934-910a-450b-ad19-b5dad171e976; granify.new_user.qivBM=false; granify.session.qivBM=-1; datadome=D9l5YqgZcTE_ZO~f7Zfp3kmv6Bhgqul9BKv86QbaNY1Y_AGunvBxVwZuv7MVPGsjyyFzuySVox7KsMKNgIYrz7M2TTV7U3UnyMNUdmTxfEwZ6IV_175J0KNGuZROi14h"
]

module.exports = {
    friendlyName: "Index",
    description: "Index home",
    inputs: {
        urls: { type: "json" },
        category: { type: "string" },
        price: { type: "number" }
    },
    exits: {},
    fn: async function (inputs, exits) {
        const { urls, category, price } = inputs;
        const data = [];
        let stt = 0
        let dataError = 0
        let i = 2
        const existsTitle = []
        const fetchListingData = async (url, index) => {
            const generateCookie = () => {
                const randomIndex = Math.floor(Math.random() * cookieArray.length);
                return cookieArray[randomIndex];
            };
            let title, description, image, listingId;
            let retries = 5; // Số lần thử lại tối đa
            const coookie = generateCookie()
            while (retries > 0) {
                try {
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            ...headers,
                            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                            "accept-language": "vi,en;q=0.9",
                            "cache-control": "max-age=0",
                            "sec-fetch-dest": "document",
                            "sec-fetch-mode": "navigate",
                            "sec-fetch-site": "none",
                            "sec-fetch-user": "?1",
                            "upgrade-insecure-requests": "1",
                            "cookie": coookie
                        }, referrerPolicy: "strict-origin-when-cross-origin", body: null
                    });
                    if (!response.ok) {
                        dataError += 1
                        throw new Error(`Request failed with status ${response.status}`);
                    }
                    const body = await response.text();
                    const $ = await cheerio.load(body);
                    listingId = $('[data-listing-id]').attr('data-listing-id');
                    let titleSelector = "#listing-page-cart > div:nth-child(4) > h1";
                    const descriptionSelector = "#wt-content-toggle-product-details-read-more > p";
                    const imageSelector = ".carousel-image";
                    title = $(titleSelector).text().trim();
                    if (!title) {
                        titleSelector = "#listing-page-cart > div.wt-mb-xs-1 > h1";
                        title = $(titleSelector).text().trim();
                    }
                    description = $(descriptionSelector).text().trim();
                    image = [];
                    $(imageSelector).each((index1, element) => {
                        let img = $(element).attr("data-src-zoom-image");
                        image.push(img)
                    })

                    if (title && description && image.length > 0) {
                        if (existsTitle.includes(title)) {
                            title = `${title} ${index}`
                        }
                        existsTitle.push(title)
                        break;
                    }
                } catch (error) {
                    console.error("Request failed:", error.message);
                }

                retries--;
            }
            if (retries === 0) {
                console.error("Exceeded maximum retries. Unable to fetch valid data.");
                dataError += 1
                return;
            }
            stt++
            // Sau khi vòng lặp kết thúc và có dữ liệu hợp lệ, bạn có thể sử dụng dữ liệu ở đây
            data.push(["T-shirts (601302)", null, title, description, "0.45", "3", "10", 10, null, "UPC (3)", null, "S", "White", null, 18, "50", `${moment().unix()}${stt}`, image?.[0] || null, image?.[1] || null, image?.[2] || null, image?.[3] || null, image?.[4] || null, image?.[5] || null, image?.[6] || null, image?.[7] || null, image?.[8] || null, "https://crawleretsy.nyc3.digitaloceanspaces.com/fe3fd85de2294c7a873a534f8719601a~tplv-omjb5zjo8w-origin-jpeg.jpeg", null, null, null, null, null, null, null, null, null, null, null, "Active"])
        }
        await Promise.all(urls.map((url, index) => fetchListingData(url, index)));
        await ListTiktok.create({ type: category, data, price })
        return exits.success({ data, dataError: `${urls.length - dataError}/${urls.length}` });
    },
};

