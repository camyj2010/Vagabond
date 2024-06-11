import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vagabond.app',
  appName: 'vagabond',
  webDir: 'build',
  plugins: {
    MediaCapture: {

    }
  }
};

export default config;
