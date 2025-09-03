const { getDefaultConfig } = require('@expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

// Get the default Expo Metro config
const defaultConfig = getDefaultConfig(__dirname);

// Apply NativeWind configuration
const config = withNativeWind(defaultConfig, {
  input: './global.css',
});

module.exports = config;