const cron = require("node-cron");
const { google } = require("googleapis");
const moment = require('moment');
const fetch = require('node-fetch');
const credentials = require("./credentials.json");
const sizeOf = require('image-size');
const { Readable } = require('stream');
const axios = require('axios');
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
          range: 'GMC!B:C',
        });

        const existingData = response.data.values || [];
        let nextRow = existingData.length + 1;

        const values = response.data.values;
        if (values && values.length > 0) {
          // Extract column B data and store it in an array
          const columnBData = values.map(row => {
            const modifiedRow = row[0] ? row[0].replace(/#/g, "") : null;
            const newRow = modifiedRow + row[1];
            return newRow;
          });
          for (let _data of data) {
            if (_data.billing.first_name == "Quang Đạo") {
              continue
            }
            let i = 0
            for (let idB of columnBData) {
              if (String(_data.id) + "Egeadcompany" == idB) {
                i = 1
                break
              }
            }
            if (i == 0) {
              let totalMoney = _data.total
              // if (_data.payment_method_title == "PayPal" || _data.payment_method_title == "Credit Card Payment using Paypal secure" || _data.payment_method_title == "PayPal") {
              //   totalMoney = _data.meta_data.find(item => item.key === "_cs_paypal_payout")?.value || 0
              // } else if ( _data.payment_method_title == "Card" || _data.payment_method_title == "Credit/Debit Card" ) {
              //   totalMoney = _data.meta_data.find(item => item.key === "_cs_stripe_payout")?.value || 0
              // } else {
              //   totalMoney = _data.meta_data.find(item => item.key === "_stripe_net")?.value || 0
              // }
              for (let items of _data.line_items) {
                let meta_data = ""
                for (let _meta_data of items.meta_data) {

                  if (_meta_data.display_key.includes("Custom") || _meta_data.display_key.includes("Please upload a picture") || _meta_data.display_key.includes("_reduced_stock")) {
                    continue
                  }
                  if (meta_data != "") {
                    meta_data = `${meta_data}, ${_meta_data.display_key}: ${_meta_data.display_value}`
                  } else {
                    meta_data = `${_meta_data.display_key}: ${_meta_data.display_value}`
                  }
                }
                let shipping = _data.shipping
                await sheets.spreadsheets.values.append({
                  spreadsheetId: spreadsheetId,
                  range: `GMC!A${nextRow}`,
                  valueInputOption: 'USER_ENTERED',
                  resource: {
                    values: [[moment(_data.date_created).format('MM/DD/YYYY'), `#${_data.id}`, "Egeadcompany", _data.payment_method_title == "Card" || _data.payment_method_title == "Credit/Debit Card" ? `Stripe${_data.meta_data.find(item => item.key === "_aff_stripe_proxy_url")?.value ? ":" + _data.meta_data.find(item => item.key === "_aff_stripe_proxy_url")?.value.replace("https://", "") : ""}` : _data.payment_method_title == "PayPal" || _data.payment_method_title == "Credit Card Payment using Paypal secure" ? `PayPal${_data.meta_data.find(item => item.key === "_aff_paypal_proxy_url")?.value ? ":" + _data.meta_data.find(item => item.key === "_aff_paypal_proxy_url")?.value.replace("https://", "") : ""}` : "Stripe", "", "", totalMoney, "", "", items.name, meta_data, "", items.sku, items.meta_data.find(item => item.key === "custom")?.value || "", items.meta_data.find(item => item.key === "customimage")?.value ? (JSON.parse(items.meta_data.find(item => item.key === "customimage")?.value))[0].url : items.meta_data.find(item => item.key === "headcustom")?.value ? (JSON.parse(items.meta_data.find(item => item.key === "headcustom")?.value))[0].url : "", "", `https://egeadcompany.com/?p=${items.product_id}`, items.quantity, `${shipping.first_name} ${shipping.last_name}`, `${shipping.address_1} ${shipping.address_2} ${shipping.city}, ${shipping.state} ${shipping.postcode}`, "", "", "", "", _data.billing.phone, _data.customer_note, _data.billing.email, "", "TA"]], // Thay thế bằng dữ liệu bạn muốn thêm vào
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
          range: 'GMC!B:C',
        });

        const existingData = response.data.values || [];
        let nextRow = existingData.length + 1;

        const values = response.data.values;
        if (values && values.length > 0) {
          // Extract column B data and store it in an array
          const columnBData = values.map(row => {
            const modifiedRow = row[0] ? row[0].replace(/#/g, "") : null;
            const newRow = modifiedRow + row[1];
            return newRow;
          });
          for (let _data of data) {
            if (_data.billing.first_name == "Quang Đạo") {
              continue
            }
            let i = 0
            for (let idB of columnBData) {
              if (String(_data.id) + "Alltopicsoflife" == idB) {
                i = 1
                break
              }
            }
            if (i == 0) {
              let totalMoney = _data.total
              // if (_data.payment_method_title == "PayPal" || _data.payment_method_title == "Credit Card Payment using Paypal secure" || _data.payment_method_title == "Paypal") {
              //   totalMoney = _data.meta_data.find(item => item.key === "_cs_paypal_payout")?.value || 0
              // } else if ( _data.payment_method_title == "Card" || _data.payment_method_title == "Credit/Debit Card" ) {
              //   totalMoney = _data.meta_data.find(item => item.key === "_cs_stripe_payout")?.value || 0
              // } else {
              //   totalMoney = _data.meta_data.find(item => item.key === "_stripe_net")?.value || 0;
              // }
              let first = 0
              for (let items of _data.line_items) {
                let shipping = _data.shipping
                await sheets.spreadsheets.values.append({
                  spreadsheetId: spreadsheetId,
                  range: `GMC!A${nextRow}`,
                  valueInputOption: 'USER_ENTERED',
                  resource: {
                    values: [[moment(_data.date_created).format('MM/DD/YYYY'), `#${_data.id}`, "Alltopicsoflife", _data.payment_method_title == "Card" || _data.payment_method_title == "Credit/Debit Card" ? `Stripe${_data.meta_data.find(item => item.key === "_aff_stripe_proxy_url")?.value ? ":" + _data.meta_data.find(item => item.key === "_aff_stripe_proxy_url")?.value.replace("https://", "") : ""}` : _data.payment_method_title == "PayPal" || _data.payment_method_title == "Credit Card Payment using Paypal secure" ? `PayPal${_data.meta_data.find(item => item.key === "_aff_paypal_proxy_url")?.value ? ":" + _data.meta_data.find(item => item.key === "_aff_paypal_proxy_url")?.value.replace("https://", "") : ""}` : "Stripe", "", "", first == 0 ? totalMoney : "", "", "", items.name, `${items.meta_data.find(item => item.key === "pa_type")?.display_value ? items.meta_data.find(item => item.key === "pa_type")?.display_value + " - " : ""}${items.meta_data.find(item => item.key === "pa_size")?.display_value}`, items.meta_data.find(item => item.key === "pa_color")?.display_value, items.sku, items.meta_data.find(item => item.key === "customname")?.display_value, items.meta_data.find(item => item.key === "customnumber")?.display_value, "", `https://alltopicsoflife.com/?p=${items.product_id}`, items.quantity, `${shipping.first_name} ${shipping.last_name}`, `${shipping.address_1} ${shipping.address_2} ${shipping.city}, ${shipping.state} ${shipping.postcode}`, "", "", "", "", _data.billing.phone, _data.customer_note, _data.billing.email, "", "TA"]], // Thay thế bằng dữ liệu bạn muốn thêm vào
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

async function CheckImageNotQuality() {
  const spreadsheetId = '1_nYQhMHPXqV2tEbQvRB9IK1pv-ThPUhlou0QwXyq5pQ';
  const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: 'Ảnh lỗi!B2:B',
    });
    const existingData = response.data.values || [];
    for (let [index, image] of existingData.entries()) {
      let width = 0
      let height = 0
      try {
        const response = await axios.get(image, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data);
        const dimensions = sizeOf(buffer);
        width = dimensions.width;
        if (width < 300 && height < 400) {
          await sheets.spreadsheets.batchUpdate({
            spreadsheetId: spreadsheetId,
            resource: {
              requests: [
                {
                  updateCells: {
                    rows: [
                      {
                        values: [
                          {
                            userEnteredFormat: {
                              backgroundColor: {
                                red: 1.0,
                                green: 0.0,
                                blue: 0.0,
                              },
                            },
                          },
                        ],
                      },
                    ],
                    fields: 'userEnteredFormat.backgroundColor',
                    start: {
                      sheetId: 1082321244,
                      rowIndex: index + 1,
                      columnIndex: 4,
                    },
                  },
                },
              ],
            },
          });
        }
      } catch (error) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: spreadsheetId,
          resource: {
            requests: [
              {
                updateCells: {
                  rows: [
                    {
                      values: [
                        {
                          userEnteredFormat: {
                            backgroundColor: {
                              red: 1.0,
                              green: 0.0,
                              blue: 0.0,
                            },
                          },
                        },
                      ],
                    },
                  ],
                  fields: 'userEnteredFormat.backgroundColor',
                  start: {
                    sheetId: 1082321244,
                    rowIndex: index + 1,
                    columnIndex: 3,
                  },
                },
              },
            ],
          },
        });
        console.log(error)
        continue
      }
    }
  } catch (error) {
    console.log(error)
  }
}



cron.schedule('30 * * * *', function () {
  CheckImageNotQuality();
});

cron.schedule('0 * * * *', function () {
  Egeadcompany();
});

cron.schedule('20 * * * *', function () {
  Alltopicsoflife()
});

