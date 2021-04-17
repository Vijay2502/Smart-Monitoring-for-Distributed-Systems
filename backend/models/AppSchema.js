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
    mem_usage: {
      type: Number,
      required: true
    },
},
  { collection: "app" }
);
module.exports = App = mongoose.model("App", AppSchema);