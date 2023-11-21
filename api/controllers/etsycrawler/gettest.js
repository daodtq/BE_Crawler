const fetch = require('node-fetch');

module.exports = {
  friendlyName: "Index",

  description: "Index home.",

  inputs: {
    id: { type: "string" },
    status: { type: "string" },
  },

  exits: {},

  fn: async function (inputs, exits) {
    const allData = []
    let urls = [
      "https://mugman.co.za/wp/product/10-years-down-forever-to-go-tin-mug/",
      "https://mugman.co.za/wp/product/all-i-need-today-enamel-mug/",
      "https://mugman.co.za/wp/product/be-wild-and-wander-enamel-mug/",
      "https://mugman.co.za/wp/product/brandy-and-coke-enamel-mug/",
      "https://mugman.co.za/wp/product/brannas-is-nannas-enamel-mug/",
      "https://mugman.co.za/wp/product/camp-chaos-coordinator-enamel-mug/",
      "https://mugman.co.za/wp/product/camp-tent-stars-enamel-mug/",
      "https://mugman.co.za/wp/product/campers-gonna-camp-enamel-tin-coffee-mug-cup/",
      "https://mugman.co.za/wp/product/campfires-and-cocktails-enamel-mug/",
      "https://mugman.co.za/wp/product/camping-bff-enamel-tin-mug/",
      "https://mugman.co.za/wp/product/camping-hair-dont-care-enamel-tin-coffee-mug/",
      "https://mugman.co.za/wp/product/camping-hair-dont-care-white-enamel-mug/",
      "https://mugman.co.za/wp/product/camping-is-my-therapy-enamel-mug/",
      "https://mugman.co.za/wp/product/camping-love-heart-enamel-mug/",
      "https://mugman.co.za/wp/product/camping-therapy-enamel-mug/",
      "https://mugman.co.za/wp/product/camping-vibes-only-enamel-mug/",
      "https://mugman.co.za/wp/product/camping-words-collage-enamel-mug/",
      "https://mugman.co.za/wp/product/christmas-closer-to-jolly-enamel-mug/",
      "https://mugman.co.za/wp/product/christmas-dont-stop-believing-enamel-mug/",
      "https://mugman.co.za/wp/product/christmas-getting-my-jingle-on-enamel-mug/",
      "https://mugman.co.za/wp/product/christmas-i-run-on-coffee-and-christmas-cheer-enamel-mug/",
      "https://mugman.co.za/wp/product/christmas-messy-and-bright-enamel-mug/",
      "https://mugman.co.za/wp/product/christmas-naughty-list-legend-enamel-mug/",
      "https://mugman.co.za/wp/product/christmas-santas-favorite-ho-ho-ho-enamel-mug/",
      "https://mugman.co.za/wp/product/christmas-with-my-gnomies-enamel-mug/",
      "https://mugman.co.za/wp/product/coffee-mountains-adventures-white-enamel-mug/",
      "https://mugman.co.za/wp/product/collect-memories-jar-of-memories-enamel-mug/",
      "https://mugman.co.za/wp/product/custom-white-enamel-sublimation-mug/",
      "https://mugman.co.za/wp/product/customised-white-tin-enamel-mug/",
      "https://mugman.co.za/wp/product/eat-sleep-camp-repeat-enamel-tin-coffee-mug/",
      "https://mugman.co.za/wp/product/every-camping-trip-tells-a-story-enamel-tin-mug/",
      "https://mugman.co.za/wp/product/explore-enamel-mug/",
      "https://mugman.co.za/wp/product/find-your-happy-place-enamel-mug/",
      "https://mugman.co.za/wp/product/forget-adulting-white-enamel-mug/",
      "https://mugman.co.za/wp/product/happiness-is-a-journey-white-enamel-mug/",
      "https://mugman.co.za/wp/product/happy-campers-english-enamel-mug/",
      "https://mugman.co.za/wp/product/happy-tin-year-tin-enamel-mug/",
      "https://mugman.co.za/wp/product/hepie-kampers-afrikaans-enamel-mug/",
      "https://mugman.co.za/wp/product/home-is-where-we-park-it-enamel-mug/",
      "https://mugman.co.za/wp/product/i-cant-i-have-the-world-to-see-enamel-mug/",
      "https://mugman.co.za/wp/product/i-hate-people-enamel-mug/",
      "https://mugman.co.za/wp/product/i-love-my-gs-motorcycle-enamel-mug/",
      "https://mugman.co.za/wp/product/i-never-dreamed-id-grow-up-enamel-mug/",
      "https://mugman.co.za/wp/product/i-tried-to-be-good-enamel-mug/",
      "https://mugman.co.za/wp/product/i-worked-my-whole-life-and-all-i-got-tin-mug/",
      "https://mugman.co.za/wp/product/if-the-campers-rocking-enamel-mug/",
      "https://mugman.co.za/wp/product/just-an-old-happy-camper-enamel-mug/",
      "https://mugman.co.za/wp/product/the-camping-queen-enamel-mug/",
      "https://mugman.co.za/wp/product/life-is-better-around-the-campfire-enamel-tin-mug/",
      "https://mugman.co.za/wp/product/life-is-better-around-the-campfire-enamel-tin-mug-2/",
      "https://mugman.co.za/wp/product/life-is-better-around-the-campfire-enamel-tin-mug-3/",
      "https://mugman.co.za/wp/product/life-is-better-around-the-campfire-white-enamel-mug/",
      "https://mugman.co.za/wp/product/life-is-better-at-the-campfire-enamel-mug/",
      "https://mugman.co.za/wp/product/life-is-good-in-the-trailerhood-enamel-mug/",
      "https://mugman.co.za/wp/product/living-the-camping-life-enamel-mug/",
      "https://mugman.co.za/wp/product/living-the-camping-life-enamel-mug-2/",
      "https://mugman.co.za/wp/product/lost-in-the-mountains-enamel-tin-mug/",
      "https://mugman.co.za/wp/product/making-memories-one-campsite-at-a-time-enamel-mug/",
      "https://mugman.co.za/wp/product/my-hart-is-vanni-plaas-white-enamel-mug/",
      "https://mugman.co.za/wp/product/queen-of-the-trailerpark-enamel-mug/",
      "https://mugman.co.za/wp/product/stay-wild-enamel-tin-camping-mug/",
      "https://mugman.co.za/wp/product/sunset-fishing-enamel-mug/",
      "https://mugman.co.za/wp/product/the-best-days-are-spent-camping-enamel-mug-2/",
      "https://mugman.co.za/wp/product/the-best-days-are-spent-camping-enamel-tin-coffee-mug/",
      "https://mugman.co.za/wp/product/the-best-days-are-spent-camping-enamel-tin-mug-1/",
      "https://mugman.co.za/wp/product/the-perfect-blend-enamel-mug/",
      "https://mugman.co.za/wp/product/they-went-to-south-africa-enamel-mugy/",
      "https://mugman.co.za/wp/product/this-is-my-adventure-seeking-enamel-mug/",
      "https://mugman.co.za/wp/product/this-is-my-camping-mug/",
      "https://mugman.co.za/wp/product/weekend-forecast-camping-enamel-tin-mug/",
      "https://mugman.co.za/wp/product/why-yes-i-do-sleep-around-enamel-mug/",
      "https://mugman.co.za/wp/product/welcome-to-our-campsite-enamel-coffee-mug/",
      "https://mugman.co.za/wp/product/welcome-to-our-campsite-enamel-coffee-mug-1/",
      "https://mugman.co.za/wp/product/welcome-to-our-firepit-enamel-mug/",
      "https://mugman.co.za/wp/product/what-happens-around-the-campsite-enamel-coffee-mug/",
      "https://mugman.co.za/wp/product/you-dont-have-to-be-crazy-to-camp-with-us-enamel-mug/"
    ];

    try {
      // Địa chỉ URL của trang cần lấy dữ liệu

      for (let _urls of urls) {
        // Sử dụng fetch để gửi yêu cầu GET đến trang
        const response = await fetch(_urls);

        // Kiểm tra xem yêu cầu có thành công hay không
        if (!response.ok) {
          throw new Error('Không thể tải trang.');
        }

        // Trả về dữ liệu dưới dạng văn bản
        const html = await response.text();

        // Bạn có thể xử lý nội dung HTML ở đây
        // Ví dụ: sử dụng thư viện cheerio để parse HTML và lấy các URL
        const cheerio = require('cheerio');
        const $ = cheerio.load(html);

        const imageUrl = $('.image-item > a > img').attr('src');
        const title = $('.product_title').text();
        const descriptionHtml = $('#tab-description').html();
        const price = $('.woocommerce-Price-amount').first().text();
        allData.push({title,descriptionHtml,price,imageUrl})
      }
      return exits.success(allData);
    } catch (error) {
      return exits.success({
        status: "fail",
        message: `Lổi không xác định!`,
      });
    }
  },
};
