module.exports = {
    apps: [
        {
            name: 'notafacil',
            script: 'node_modules/.bin/next',
            args: 'start',
            instances: 'max',
            exec_mode: 'cluster',
            watch: false,
            max_memory_restart: '512M',
            min_uptime: '10s',
            max_restarts: 10,
            // NODE_ENV e PORT apenas — o Next.js carrega o .env automaticamente
            env: {
                NODE_ENV: 'production',
                PORT: 8002,
            },
        },
    ],
};
