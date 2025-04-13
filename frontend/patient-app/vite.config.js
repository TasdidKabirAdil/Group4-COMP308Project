import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'patientApp',
      filename: 'remoteEntry.js',
      exposes: {
        './PatientDashboard': './src/components/PatientDashboard.jsx',
        './DailyInfoForm': './src/components/DailyInfoForm.jsx',
        './SymptomChecklist': './src/components/SymptomChecklist.jsx',
        './EmergencyAlert': './src/components/EmergencyAlert.jsx'
      },
      shared: ['react', 'react-dom', 'react-router-dom', '@apollo/client', 'graphql'],
    }),
  ],
  
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
});
