var CronJob = require('cron').CronJob;
var { getSystemUsage } = require('./kubeAPIs');

var job = new CronJob('*/2 * * * *', function () {
    getSystemUsage();
}, null, true, 'America/Los_Angeles');

job.start();