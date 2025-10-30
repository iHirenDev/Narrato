// const { getDefaultConfig } = require('@expo/metro-config');
// const { withNativeWind } = require('nativewind/metro');

// // Get the default Expo Metro config
// const defaultConfig = getDefaultConfig(__dirname);

// // Apply NativeWind configuration
// const config = withNativeWind(defaultConfig, {
//   input: './global.css',
// });

// module.exports = config;


const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
 
const config = getDefaultConfig(__dirname)
 
module.exports = withNativeWind(config, { input: './global.css' })