const aws = require("aws-sdk");
require("dotenv").config();

exports.handler = async function (event, context, callback) {
  try {
    console.log("Incoming Event: ", event);
    console.log("event.records[0].s3", event.Records[0].s3);
    console.log("other one", event.Records[0].s3.bucket.name);
    const bucket = event.Records[0].s3.bucket.name;
    const filename = decodeURIComponent(
      event.Records[0].s3.object.key.replace(/\+/g, " ")
    );
    const message = `File is uploaded in - ${bucket} -> ${filename}`;
    console.log(message);

    aws.config.setPromisesDependency();

    aws.config.update({
      accessKeyId: process.env.accessKeyId,
      secretAccessKey: process.env.secretAccessKey,
      region: "us-east-1",
    });

    const s3 = new aws.S3();

    async function getBucket() {
      console.log("Version 2");
      const fileContents = await s3.getObject(
        {
          Bucket: event.Records[0].s3.bucket.name,
          Key: event.Records[0].s3.object.key,
        },
        (err, data) => {
          if (err) return "error";
          console.log("DATA", data);
          console.log("DATA BODY", data.Body.toString());
          return data.Body.toString();
        }
      );
      console.log(fileContents);
    }
    const fileContents = getBucket();

    callback(null, message);
  } catch (error) {
    console.log(error);
  }
};
