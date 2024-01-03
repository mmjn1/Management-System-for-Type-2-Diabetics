const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/assets/css/custom', to: 'static/css' }
            ]
        })
    ]
}