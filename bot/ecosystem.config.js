const applications = require('./libs/source/System/config').bots;

const apps = Object.keys(applications).map(name => ({
    name,
    script: 'index.js',
    watch: false,
    exec_mode: "cluster",
    max_memory_restart: "2G",
    env: {
        "FORCE_COLOR": "1",
    },
    cwd: applications[name].dir
}));

module.exports = {
    apps
};