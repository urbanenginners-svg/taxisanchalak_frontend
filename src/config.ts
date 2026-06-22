import { Platform } from 'react-native';

const LOCAL_HOST = Platform.select({
  android: '10.0.2.2',
  ios: 'localhost',
  default: 'localhost',
});

export const API_BASE_URL = `http://${LOCAL_HOST}:6010/api/v1`;
