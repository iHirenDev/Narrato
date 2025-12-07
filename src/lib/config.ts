import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra ?? {};
export default {
    openai_api_key: extra.openai_api_key,
    deepseek_api_key: extra.deepseek_api_key,
    gemini_ai_api_key: extra.gemini_ai_api_key
  };