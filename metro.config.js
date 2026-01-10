const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Allow SQL and TXT assets
config.resolver.assetExts.push('sql');

module.exports = config;
