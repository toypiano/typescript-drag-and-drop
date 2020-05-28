const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/app.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'dist', // for serving js file from the memory
  },
  devtool: 'inline-source-map', // need to set "sourceMap": true in tsconfig.json
  module: {
    rules: [
      {
        // Test .ts file with regex and pass them into ts-loader excluding node_modules
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    // resolve modules with these extensions in order
    extensions: ['.ts', '.js'],
  },
};
