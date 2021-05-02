const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SysdataSchema = new Schema(
    {
        app_name: {
            type: String,
            required: true
        },
        pod_name: {
            type: String,
            required: true
        },
        cpu: {
            type: Number,
            required: true
        },
        mem_usage: {
            type: Number,
            required: true
        },
        date: { type: Date, default: Date.now }
    },
    { collection: "sysData" }
);
module.exports = SystemData = mongoose.model("SystemData", SysdataSchema);