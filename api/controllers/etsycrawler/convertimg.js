const { PutObjectCommand, S3Client, PutObjectAclCommand } = require('@aws-sdk/client-s3');
const axios = require('axios');

const s3Client = new S3Client({
    endpoint: "https://nyc3.digitaloceanspaces.com", // Find your endpoint in the control panel, under Settings. Prepend "https://".
    forcePathStyle: false, // Configures to use subdomain/virtual calling format.
    region: "nyc3", // Must be "us-east-1" when creating new Spaces. Otherwise, use the region in your endpoint (e.g. nyc3).
    credentials: {
        accessKeyId: "DO00MBJ4Y3ELNMAXPWPN", // Access key pair. You can create access key pairs using the control panel or API.
        secretAccessKey: "s0/8AOiTHG3Ixc6Ay94L7SSfkNd4odLtiRgVxfIEbAU" // Secret access key defined through an environment variable.
    }
});

function generateUniqueId() {
    const timestamp = new Date().getTime();
    const randomPart = Math.random().toString(36).substring(2, 8);
    const uniqueId = `${timestamp}${randomPart}`;
    return uniqueId;
}
const uploadImage = async (url) => {
    try {
        const myRandomId = generateUniqueId();
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        // Step 3: Define the parameters for the object you want to upload.
        const params = {
            Bucket: "koreannewsfeeds", // The path to the directory you want to upload the object to, starting with your Space name.
            Key: `${myRandomId}.jpg`, // Object key, referenced whenever you want to access this file later.
            Body: Buffer.from(response.data),
            ContentType: "image/jpeg"
        };
        const data = await s3Client.send(new PutObjectCommand(params));
        const aclParams = {
            Bucket: "koreannewsfeeds", // Thay thế bằng tên Space của bạn.
            Key: `${myRandomId}.jpg`, // Tên tệp hình ảnh đã tải lên.
            ACL: 'public-read', // Đặt quyền truy cập là công khai
        };
        // Thực hiện cấu hình ACL
        await s3Client.send(new PutObjectAclCommand(aclParams));
        return `https://koreannewsfeeds.nyc3.digitaloceanspaces.com/${myRandomId}.jpg`
    } catch (error) {
        return "Url ảnh không thể convert!"
    }

};
module.exports = {
    friendlyName: "Index",
    description: "Index home",
    inputs: {
        urls: { type: "string" },
    },
    exits: {},
    fn: async function (inputs, exits) {
        const { urls } = inputs
        const data = []
        const fetchListingData = async () => {
            for (let url of urls.split(',')) {
                const newUrl = await uploadImage(url.replace(/\s/g, ''))
                data.push(newUrl)
            }
        }
        await fetchListingData()
        return exits.success(data)
    },
};

