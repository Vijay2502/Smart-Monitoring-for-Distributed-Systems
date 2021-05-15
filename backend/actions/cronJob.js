var CronJob = require('cron').CronJob;
var { getSystemUsage, getPodSystemUsage } = require('./kubeAPIs');

var job = new CronJob('*/2 * * * *', function () {
    getSystemUsage();
    getPodSystemUsage();
}, null, true, 'America/Los_Angeles');

job.start();