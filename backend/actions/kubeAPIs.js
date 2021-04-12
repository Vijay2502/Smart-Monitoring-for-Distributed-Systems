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
        const { items } = await kubectl.command('get namespaces --output=json')// 1st command

        const data = items.reduce((a, b) => {
            let curr = {
                name: b["metadata"]["name"],
                status: b["status"]["phase"],
                age: `${dateDiffInDays(b["metadata"]["creationTimestamp"])} days`
            };

            a.push(curr);
            return a;
        }, [])


        res.send(data);

    } catch (error) {
        console.log('error', error)

    }
}


exports.getDeployments = async (req, res) => {

    try {
        const { items } = await kubectl.command('get deployments --all-namespaces --output=json');

        const data = items.reduce((a, b) => {
            let curr = {
                name: b["metadata"]["name"],
                available: b["status"]["availableReplicas"],
                ready: b["status"]["readyReplicas"],
                replicas: b["status"]["replicas"],
                age: `${dateDiffInDays(b["metadata"]["creationTimestamp"])} days`
            };

            if (!a[b["metadata"]["namespace"]]) a[b["metadata"]["namespace"]] = [];

            a[b["metadata"]["namespace"]].push(curr);
            return a;
        }, {})


        res.send(data);

    } catch (error) {
        res.status(500).send(error);
    }

}

exports.getPods = async (req, res) => {

    try {
        const { items } = await kubectl.command('get pods -n kube-system --output=json');

        const data = items.reduce((a, b) => {
            let curr = {
                name: b["metadata"]["name"],
                podIp: b["status"]["podIP"],
                hostIp: b["status"]["hostIP"],
                phase: b["status"]["phase"],
                age: `${dateDiffInDays(b["metadata"]["creationTimestamp"])} days`
            };

            if (!a[b["metadata"]["namespace"]]) a[b["metadata"]["namespace"]] = [];

            a[b["metadata"]["namespace"]].push(curr);
            return a;
        }, {})


        res.send(data);

    } catch (error) {
        res.status(500).send(error);
    }
}

exports.getServices = async (req, res) => {
    try {
        const { items } = await kubectl.command('get services -n kube-system --output=json')

        const data = items.reduce((a, b) => {
            let curr = {
                name: b["metadata"]["name"],
                externalTrafficPolicy: b["spec"]["externalTrafficPolicy"],
                clusterIp: b["spec"]["clusterIP"],
                type: b["spec"]["type"],
                age: `${dateDiffInDays(b["metadata"]["creationTimestamp"])} days`
            };

            if (!a[b["metadata"]["namespace"]]) a[b["metadata"]["namespace"]] = [];

            a[b["metadata"]["namespace"]].push(curr);
            return a;
        }, {})

        res.send(data);

    } catch (error) {
        res.status(500).send(error);
    }
}