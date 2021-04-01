var express = require('express');

exports.sampleRoute = (req, res) => {
    const id = req.params.id;

    console.log("Sample Route", id);

    res.status(200).send("DONESH!");
}

exports.samplePostRoute = (req, res) => {
    const id = req.body.id;

    console.log("Sample Route", id);

    res.status(200).send("DONESH!");
}