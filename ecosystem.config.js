module.exports = {
  apps: [
    {
      name: 'server',
      script: 'build/index.js',
      automation: false,
      instances: '4',
      max_restarts: 5,
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
