var express = require('express');
const AWS = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');
var sampleJson = require('../sample.json');

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, S3_URL } = process.env;

const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: AWS_REGION
});

exports.getFiles = (req, res) => {
    const id = req.params.id;

    const bucketParams = {
        Bucket: "chets-bucket",
        Prefix: ""
    }
    // Call S3 to obtain a list of the objects in the bucket
    s3.listObjects(bucketParams, function (err, data) {
        if (err) {
            console.log("Error in fetching contents of Bucket: " + err);
            res.status(400).json("Error in fetching contents of Bucket: " + err)
        } else {
            let contents = [];

            data.Contents.forEach((file) => {
                if (file.Key.charAt(file.Key.length - 1) !== "/")
                    contents.push({
                        key: file.Key.split("/")[file.Key.split("/").length - 1],
                        modified: file.LastModified,
                        size: file.Size / 1000 + "KB",
                        file_url: S3_URL + "/" + file.Key
                    });
            })
            res.json({ success: true, files: contents })
        }
    });
}

exports.getProjects = (req, res) => {


    res.status(200).send(sampleJson);
}

exports.samplePostRoute = (req, res) => {
    const id = req.body.id;


    res.status(200).send("DONESH!");
}