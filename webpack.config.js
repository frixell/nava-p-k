const path = require('path');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (process.env.NODE_ENV === 'test') {
    require('dotenv').config({ path: '.env.test' });
} else if (process.env.NODE_ENV === 'development') {
    require('dotenv').config({ path: '.env.development' });
}

module.exports = (env) => {
    const isProduction = env === "production";
    const CSSExtract = new MiniCssExtractPlugin({
        filename: 'styles.css'
    });
    
    return {
        entry: './src/app.js',
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
            fallback: {
                "buffer": false,
                "stream": false,
                "util": false,
                "assert": false,
                "path": false,
                "zlib": false,
                "querystring": false,
                "url": false,
                "crypto": false,
                "http": false,
                "https": false,
                "os": false,
                "fs": false,
                "async_hooks": false
            }
        },
        devtool: 'inline-source-map',
        output: {
            filename: 'bundle.js',
            path: path.join(__dirname, 'public', 'dist')
        },
        module: {
            rules: [{
                test: /\.(ts|tsx)$/,
                use: [
                    {
                        loader: 'babel-loader'
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true
                        }
                    }
                ],
                exclude: /node_modules/
            }, {
                loader: 'babel-loader',
                test: /\.js$/,
                exclude: /node_modules/
            }, {
                test: /\.s?css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            url: false
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            }]
        },
        plugins: [
            new CompressionPlugin({
                test: /\.(js|css)$/,
                algorithm: 'gzip',
                //deleteOriginalAssets: true
            }),
            CSSExtract,
            new webpack.DefinePlugin({
                'process.env.FIREBASE_API_KEY': JSON.stringify(process.env.FIREBASE_API_KEY),
                'process.env.FIREBASE_AUTH_DOMAIN': JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN),
                'process.env.FIREBASE_DATABASE_URL': JSON.stringify(process.env.FIREBASE_DATABASE_URL),
                'process.env.FIREBASE_PROJECT_ID': JSON.stringify(process.env.FIREBASE_PROJECT_ID),
                'process.env.FIREBASE_STORAGE_BUCKET': JSON.stringify(process.env.FIREBASE_STORAGE_BUCKET),
                'process.env.FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(process.env.FIREBASE_MESSAGING_SENDER_ID),
                'process.env.GOOGLE_MAPS_API_KEY': JSON.stringify(process.env.GOOGLE_MAPS_API_KEY)
            })
        ],
        devtool: isProduction ? 'source-map' : 'inline-source-map',
        devServer: {
            port: 8080,
            static: {
                directory: path.join(__dirname, 'public')
            },
            historyApiFallback: true,
            devMiddleware: {
                publicPath: '/dist/'
            }
        }
    }
};
