const cron = require("node-cron");
const { google } = require("googleapis");
const moment = require('moment');
const fetch = require('node-fetch');
const credentials = require("./credentials.json");
function Egeadcompany() {
  const spreadsheetId = '1ZjoiBf3OnyYf_LDXQiBPz-ook6g3TjoAZKuhDbMZK00';
  const startOfYesterday = moment().subtract(1, 'days').startOf('day').toISOString();
  const endOfToday = moment().endOf('day').toISOString();
  const url = `https://egeadcompany.com/wp-json/wc/v3/orders?consumer_key=ck_43f8651fe96477d02a2fa1e800b23b6ac6305520&consumer_secret=cs_7483ec0ad6159f3aa2ed2746de88c88903d45648&status=processing&after=${startOfYesterday}&before=${endOfToday}`
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(async data => {
      const auth = new google.auth.JWT({
        email: credentials.client_email,
        key: credentials.private_key,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
      const sheets = google.sheets({ version: 'v4', auth });

      try {
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId: spreadsheetId,
          range: 'GMC!B:B',
        });

        const existingData = response.data.values || [];
        let nextRow = existingData.length + 1;

        const values = response.data.values;
        if (values && values.length > 0) {
          // Extract column B data and store it in an array
          const columnBData = values.map(row => row[0] ? row[0].replace(/#/g, "") : null);
          for (let _data of data) {
            if (_data.billing.first_name == "Quang Đạo") {
              continue
            }
            let i = 0
            for (let idB of columnBData) {
              if (String(_data.id) == idB) {
                i = 1
                break
              }
            }
            if (i == 0) {
              let totalMoney = data.total
              if (_data.payment_method_title == "Paypal") {
                totalMoney = _data.meta_data.find(item => item.key === "_cs_paypal_payout").value
              } else {
                totalMoney = _data.meta_data.find(item => item.key === "_stripe_net").value;
              }
              for (let items of _data.line_items) {
                let meta_data = ""
                for (let _meta_data of items.meta_data) {
                  if (meta_data != "") {
                    meta_data = `${meta_data}, ${_meta_data.display_key}: ${_meta_data.display_value}`
                  } else {
                    meta_data = `${_meta_data.display_key}: ${_meta_data.display_value}`
                  }
                }
                let shipping = _data.shipping
                console.log(_data)
                await sheets.spreadsheets.values.append({
                  spreadsheetId: spreadsheetId,
                  range: `GMC!A${nextRow}`,
                  valueInputOption: 'RAW',
                  resource: {
                    values: [[moment(_data.date_created).format('DD/MM/YYYY'), `#${_data.id}`, "Egeadcompany", _data.payment_method_title, "", "", totalMoney, "", "", items.name, meta_data, "", "", items.meta_data.find(item => item.key === "custom")?.value || "", items.meta_data.find(item => item.key === "customimage")?.value ? (JSON.parse(items.meta_data.find(item => item.key === "customimage")?.value))[0].url : items.meta_data.find(item => item.key === "headcustom")?.value ? (JSON.parse(items.meta_data.find(item => item.key === "headcustom")?.value))[0].url : "", "", `https://egeadcompany.com/?p=${items.product_id}`, items.quantity, `${shipping.first_name} ${shipping.last_name}`, `${shipping.address_1} ${shipping.address_2} ${shipping.city}, ${shipping.state} ${shipping.postcode}`, "", "", "", "", _data.billing.phone, _data.customer_note, _data.billing.email, "", "TA"]], // Thay thế bằng dữ liệu bạn muốn thêm vào
                  },
                });
                nextRow++
              }
            }
          }

        } else {
          console.log('No data found in column B.');
        }
      } catch (error) {
        console.log(error);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function Koreannewsfeeds() {
  const spreadsheetId = '1ZjoiBf3OnyYf_LDXQiBPz-ook6g3TjoAZKuhDbMZK00';
  const startOfYesterday = moment().subtract(1, 'days').startOf('day').toISOString();
  const endOfToday = moment().endOf('day').toISOString();
  const url = `https://koreannewsfeeds.com/wp-json/wc/v3/orders?consumer_key=ck_5a0378a496b6dac5214b11e9dffce61e52305000&consumer_secret=cs_5b4090e07388a45930f4229571493e4c497563b2&status=processing&after=${startOfYesterday}&before=${endOfToday}`
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(async data => {
      const auth = new google.auth.JWT({
        email: credentials.client_email,
        key: credentials.private_key,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
      const sheets = google.sheets({ version: 'v4', auth });

      try {
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId: spreadsheetId,
          range: 'GMC!B:B',
        });

        const existingData = response.data.values || [];
        let nextRow = existingData.length + 1;

        const values = response.data.values;
        if (values && values.length > 0) {
          // Extract column B data and store it in an array
          const columnBData = values.map(row => row[0] ? row[0].replace(/#/g, "") : null);
          for (let _data of data) {
            if (_data.billing.first_name == "Quang Đạo") {
              continue
            }
            let i = 0
            for (let idB of columnBData) {
              if (String(_data.id) == idB) {
                i = 1
                break
              }
            }
            if (i == 0) {
              let totalMoney = data.total
              if (_data.payment_method_title == "PayPal" || _data.payment_method_title == "Paypal") {
                totalMoney = _data.meta_data.find(item => item.key === "_cs_paypal_payout").value
              } else {
                totalMoney = _data.meta_data.find(item => item.key === "_stripe_net").value;
              }
              let first = 0
              for (let items of _data.line_items) {
                let shipping = _data.shipping
                await sheets.spreadsheets.values.append({
                  spreadsheetId: spreadsheetId,
                  range: `GMC!A${nextRow}`,
                  valueInputOption: 'RAW',
                  resource: {
                    values: [[moment(_data.date_created).format('DD/MM/YYYY'), `#${_data.id}`, "Koreannewsfeeds", _data.payment_method_title, "", "", first == 0 ? totalMoney : "", "", "", items.name, `${items.meta_data.find(item => item.key === "pa_type")?.display_value} - ${items.meta_data.find(item => item.key === "pa_size")?.display_value}`, items.meta_data.find(item => item.key === "pa_color")?.display_value, "", "", "", "", `https://koreannewfeeds.com/?p=${items.product_id}`, items.quantity, `${shipping.first_name} ${shipping.last_name}`, `${shipping.address_1} ${shipping.address_2} ${shipping.city}, ${shipping.state} ${shipping.postcode}`, "", "", "", "", _data.billing.phone, _data.customer_note, _data.billing.email, "", "TA"]], // Thay thế bằng dữ liệu bạn muốn thêm vào
                  },
                });
                nextRow++
                first++
              }
            }
          }

        } else {
          console.log('No data found in column B.');
        }
      } catch (error) {
        console.log(error);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function Alltopicsoflife() {
  const spreadsheetId = '1ZjoiBf3OnyYf_LDXQiBPz-ook6g3TjoAZKuhDbMZK00';
  const startOfYesterday = moment().subtract(1, 'days').startOf('day').toISOString();
  const endOfToday = moment().endOf('day').toISOString();
  const url = `https://alltopicsoflife.com/wp-json/wc/v3/orders?consumer_key=ck_7006cbe71362f83948af91e55aa877f4a2bf0c8c&consumer_secret=cs_7c6544b7ac1ed84cdb2f73ec41fa5172b865304c&status=processing&after=${startOfYesterday}&before=${endOfToday}`
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(async data => {
      const auth = new google.auth.JWT({
        email: credentials.client_email,
        key: credentials.private_key,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
      const sheets = google.sheets({ version: 'v4', auth });

      try {
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId: spreadsheetId,
          range: 'GMC!B:B',
        });

        const existingData = response.data.values || [];
        let nextRow = existingData.length + 1;

        const values = response.data.values;
        if (values && values.length > 0) {
          // Extract column B data and store it in an array
          const columnBData = values.map(row => row[0] ? row[0].replace(/#/g, "") : null);
          for (let _data of data) {
            if (_data.billing.first_name == "Quang Đạo") {
              continue
            }
            let i = 0
            for (let idB of columnBData) {
              if (String(_data.id) == idB) {
                i = 1
                break
              }
            }
            if (i == 0) {
              let totalMoney = data.total
              if (_data.payment_method_title == "PayPal" || _data.payment_method_title == "Paypal") {
                totalMoney = _data.meta_data.find(item => item.key === "_cs_paypal_payout").value
              } else {
                totalMoney = _data.meta_data.find(item => item.key === "_stripe_net").value;
              }
              let first = 0
              for (let items of _data.line_items) {
                let shipping = _data.shipping
                await sheets.spreadsheets.values.append({
                  spreadsheetId: spreadsheetId,
                  range: `GMC!A${nextRow}`,
                  valueInputOption: 'RAW',
                  resource: {
                    values: [[moment(_data.date_created).format('DD/MM/YYYY'), `#${_data.id}`, "Alltopicsoflife", _data.payment_method_title, "", "", first == 0 ? totalMoney : "", "", "", items.name, `${items.meta_data.find(item => item.key === "pa_type")?.display_value} - ${items.meta_data.find(item => item.key === "pa_size")?.display_value}`, items.meta_data.find(item => item.key === "pa_color")?.display_value, "", "", "", "", `https://alltopicsoflife.com/?p=${items.product_id}`, items.quantity, `${shipping.first_name} ${shipping.last_name}`, `${shipping.address_1} ${shipping.address_2} ${shipping.city}, ${shipping.state} ${shipping.postcode}`, "", "", "", "", _data.billing.phone, _data.customer_note, _data.billing.email, "", "TA"]], // Thay thế bằng dữ liệu bạn muốn thêm vào
                  },
                });
                nextRow++
                first++
              }
            }
          }

        } else {
          console.log('No data found in column B.');
        }
      } catch (error) {
        console.log(error);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

cron.schedule('0 * * * *', function () {
  Egeadcompany();
});

cron.schedule('10 * * * *', function () {
  Koreannewsfeeds()
});

cron.schedule('20 * * * *', function () {
  Alltopicsoflife()
});

