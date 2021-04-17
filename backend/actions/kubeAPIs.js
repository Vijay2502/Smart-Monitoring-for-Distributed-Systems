var K8s = require('k8s')

var kubectl = K8s.kubectl({
    endpoint: process.env.KUBE_URL
    , version: '/api/v1',
    strictSSL: false,
    "auth": {
        "token": process.env.KUBE_TOKEN
    }
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
        res.send({header, table});

    } catch (error) {
        console.log('error', error)

    }
}


exports.getDeployments = async (req, res) => {

    try {
        const data = await kubectl.command('get deployments --all-namespaces');

        let [header, ...table] = resolveTable(data);
        table.pop();

        res.send({header, table});

    } catch (error) {
        res.status(500).send(error);
    }

}

exports.getPods = async (req, res) => {

    try {
        const data2 = await kubectl.command('get pods --all-namespaces');

        let [header, ...table] = resolveTable(data2);
        table.pop();

        res.send({header, table});

    } catch (error) {
        res.status(500).send(error);
    }
}

exports.getServices = async (req, res) => {
    try {
        const data = await kubectl.command('get services -n kube-system');

        let [header, ...table] = resolveTable(data);  
        table.pop();      

        res.send({header, table});

    } catch (error) {
        res.status(500).send(error);
    }
}


exports.getSystemUsage = async (req, res) => {
    try {
        const data = await kubectl.command('top node');

        let [header, ...table] = resolveTable(data);  
        table.pop();      

        res.send({header, table});

    } catch (error) {
        res.status(500).send(error);
    }
}


let resolveTable = data => {
    data = data.split("\n");

    data = data.map(element => element.split(" ").filter(curr => curr !== ""));

    return data;
}