// models/AppSchema.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AppSchema = new Schema(
  {
    pod_name: {
      type: String,
      required: true
    },
    cpu_usage: {
      type: Number,
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
    mem_percentage: {
      type: Number,
      required: true
    },
    date: { type: Date, default: Date.now }
},
  { collection: "app2" }
);
module.exports = App = mongoose.model("App2", AppSchema);