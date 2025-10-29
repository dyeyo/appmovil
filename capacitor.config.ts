import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.InmobiliApp.app',   
  appName: 'InmobiliApp',        
  webDir: 'www',
  android: {
    adjustMarginsForEdgeToEdge: 'auto',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,   
      resizeOnFullScreen: true,
      launchAutoHide: true,         
      backgroundColor: '#0A0A0A',   
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,            
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
    },
  },
};

export default config;
