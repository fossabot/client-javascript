const fs = require('fs');
const glob = require('glob');
const os = require('os');
const RestClient = require('./rest');
const pjson = require('./../package.json');

const MIN = 3;
const MAX = 256;
const PJSON_VERSION = pjson.version;
const PJSON_NAME = pjson.name;

const getIdFormFileName = (filename) => {
    const launchNumberAndId = filename.match(/#\d+-(.*)/)[0];
    const launchIdWithExtensionTmp = launchNumberAndId.split('-')[1];
    const launchId = launchIdWithExtensionTmp.split('.')[0];

    return launchId;
};


module.exports = {
    formatName(name) {
        const len = name.length;
        // eslint-disable-next-line no-mixed-operators
        return ((len < MIN) ? (name + new Array(MIN - len + 1).join('.')) : name).slice(-MAX);
    },

    now() {
        return new Date().valueOf();
    },

    getServerResult(url, request, options, method) {
        return RestClient
            .request(method, url, request, options);
    },

    readLaunchesFromFile() {
        const files = glob.sync('rplaunch-*.tmp');
        const ids = files.map(getIdFormFileName);

        return ids;
    },

    saveLaunchIdToFile(launchName, launchNumber, launchId) {
        const filename = `rplaunch-${launchName}-#${launchNumber}-${launchId}.tmp`;
        fs.open(filename, 'w', (err) => {
            if (err) {
                throw err;
            }
        });
    },

    getSystemAttribute() {
        const osType = os.type();
        const osArchitecture = os.arch();
        const RAMSize = os.totalmem();
        const nodeVersion = process.version;
        const systemAttr = [{
            key: 'client',
            value: `${PJSON_NAME}|${PJSON_VERSION}`,
            system: true,
        }, {
            key: 'os',
            value: `${osType}|${osArchitecture}`,
            system: true,
        }, {
            key: 'RAMSize',
            value: RAMSize,
            system: true,
        }, {
            key: 'nodeJS',
            value: nodeVersion,
            system: true,
        }];

        return systemAttr;
    },
};
