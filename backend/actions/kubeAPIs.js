var mongo = require("mongodb");
let mongoose = require("mongoose");
const App = require("../models/AppSchema");
const SystemData = require("../models/SysdataSchema");

const { MONGO_URL } = process.env;

// Connection URL
const url = MONGO_URL;

mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true); //issue with a depricated- found it
// mongoose.set("poolSize", 10);
mongoose
    .connect(url, { useNewUrlParser: true, poolSize: 10 })
    .then(() => console.log("Connected Successfully to MongoDB"))
    .catch(err => console.error(err));

let AppData = "";
mongo.connect(
    url,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    (err, client) => {
        if (err) {
            console.error(err);
            return;
        } else {
            console.log("Connected to mongodb");
            const db = client.db("application-data");
            AppData = db.collection("app");
        }
    }
);

const db = mongoose.connection;

var K8s = require('k8s')

var kubectl = K8s.kubectl({
    endpoint: process.env.KUBE_URL
    , version: '/api/v1',
    strictSSL: false
    // kubeconfig: "/usr/src/backend/actions/config.yaml"
});

const dateDiffInDays = (a) => {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    let b = new Date();
    a = new Date(a);

    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}


exports.getNamespaces = async (req, res) => {
    try {
        const data = await kubectl.command('get namespaces')// 1st command

        let [header, ...table] = resolveTable(data);

        table.pop();
        res.send({ header, table });

    } catch (error) {
        console.log('error', error)

    }
}

exports.getDeployments = async (req, res) => {

    try {
        const project = req.params.project;
        const data = await kubectl.command(`get deployments ${project !== "all" ? `-n ${project}` : `--all-namespaces`}`);

        let [header, ...table] = resolveTable(data);
        table.pop();

        res.send({ header, table });

    } catch (error) {
        console.log('error', error)
        if (error.includes("No resources found")) res.send({ header: [], table: [] });
        else res.status(500).send(error);
    }

}

exports.getPods = async (req, res) => {

    try {
        const project = req.params.project;
        const data2 = await kubectl.command(`get pods ${project !== "all" ? `-n ${project}` : `--all-namespaces`}`);

        let [header, ...table] = resolveTable(data2);
        table.pop();

        res.send({ header, table });

    } catch (error) {
        console.log('error', error)
        if (error.includes("No resources found")) res.send({ header: [], table: [] });
        else res.status(500).send(error);
    }
}

exports.getServices = async (req, res) => {
    try {
        const project = req.params.project;
        const data = await kubectl.command(`get services ${project !== "all" ? `-n ${project}` : `--all-namespaces`}`);

        let [header, ...table] = resolveTable(data);
        table.pop();

        res.send({ header, table });

    } catch (error) {
        console.log('error', error)
        if (error.includes("No resources found")) res.send({ header: [], table: [] });
        else res.status(500).send(error);
    }
}


exports.getSystemUsage = async (req, res) => {
    try {
        console.log("started");
        // const data = await kubectl.command('top node --use-protocol-buffers');
        const data = await kubectl.command('top node');

        let [header, ...table] = resolveTable(data);
        table.pop();

        let mongoData = [];

        for ([clusterName, cpu, cpu_usage, memory, memPerc] of table) {
            mongoData.push({
                pod_name: clusterName,
                cpu_usage: cpu_usage.split("%").length && +cpu_usage.split("%")[0] || 0,
                cpu: cpu && parseInt(cpu.match(/\d/g).join(''), 10) || 0,
                mem_usage: memory && parseInt(memory.match(/\d/g).join(''), 10) || 0,
                mem_percentage: memPerc && parseInt(memPerc.match(/\d/g).join(''), 10) || 0
            })
        }

        // console.log(mongoData);

        const results = await App.insertMany(mongoData);

        if (res)
            res.send({ header, table });
        else
            console.log("Added to db");

    } catch (error) {
        if (res)
            res.status(500).send(error);

        console.log("ERROR: ", error);
    }
}

exports.getPodSystemUsage = async (req, res) => {

    try {

        const deployments = await kubectl.command('get deployments');

        // const data = await kubectl.command('top pod');
        // const data = await kubectl.command('top pod -n kube-system --use-protocol-buffers');

        let [header, ...table] = resolveTable(deployments);
        table.pop();

        let finalData = {};

        let data = await kubectl.command(`top pods`);
        let [header2, ...table2] = resolveTable(data);
        table2.pop();

        for (let [name, ...other] of table) {
            finalData[name] = {
                name: "",
                cpu: 0,
                memory: 0
            };

            for (let i = 0; i < table2.length;) {
                let [currName, currCpu, currMemory] = table2[i];

                if (currName.startsWith(name)) {
                    finalData[name]["cpu"] += currCpu && parseInt(currCpu.match(/\d/g).join(''), 10) || 0;
                    finalData[name]["memory"] += currMemory && parseInt(currMemory.match(/\d/g).join(''), 10) || 0;
                    finalData[name]["name"] = currName;
                    table2.splice(i, 1);
                } else {
                    i++;
                }

            }
        }

        let mongoData = [];

        for (let key of Object.keys(finalData)) {
            mongoData.push({
                app_name: key,
                pod_name: finalData[key]["name"],
                cpu: finalData[key]["cpu"],
                mem_usage: finalData[key]["memory"],
            });
        }
        // console.log(mongoData);

        const results = await SystemData.insertMany(mongoData);

        if (res)
            res.send({ header, table });
        else
            console.log("Added to db pod data");


    } catch (error) {
        if (res)
            res.status(500).send(error);

        console.log("ERROR: ", error);

    }

}


exports.sampleRoute = async (req, res) => {

    try {
        const results = await App.deleteMany({ "date": { $gt: new Date(2021, 03, 20) } });

        res.send("Success!");

    } catch (error) {
        res.status(500).send("Error");
    }

}


let resolveTable = data => {
    data = data.split("\n");

    data = data.map(element => element.split(" ").filter(curr => curr !== ""));

    return data;
}