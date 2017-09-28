const path = require('path');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const appPath = (...names) => path.join(process.cwd(), ...names);

//This will be merged with the config from the flavor
module.exports = {
  entry: {
    main: [appPath('src', 'index.ts')]
  },
  output: {
    filename: 'bundle.[hash].js',
    path: appPath('build'),
  },
  plugins: [
    new ProgressBarPlugin(),
  ]
};
