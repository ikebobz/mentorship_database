const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js', // Entry point of your application
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory
    filename: 'bundle.js', // Output bundle file name
    publicPath: '/', // Base path for all assets
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Transpile JavaScript and JSX files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/, // Handle CSS files
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i, // Handle image files
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // Use your existing HTML file as a template
      templateParameters: {
        PUBLIC_URL: process.env.PUBLIC_URL || '/',
      },
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // Serve files from the dist directory
    },
    port: 3000, // Port for the development server
    hot: true, // Enable hot module replacement
    historyApiFallback: true, // Enable client-side routing support
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Resolve these file extensions
    fallback: {
        vm: require.resolve('vm-browserify'), 
        crypto: require.resolve('crypto-browserify'), // Polyfill for crypto
        stream: require.resolve('stream-browserify'), // Polyfill for stream (if needed)
        buffer: require.resolve('buffer/'), // Polyfill for buffer (if needed)
      },
  },
};