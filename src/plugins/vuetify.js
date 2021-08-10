import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify, {
  theme: {
    primary: '#000044',
    secondary: '#7E57C2',
    accent: '#0000FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#EF6C00',
  },
  iconfont: 'md',
  options: {
    customProperties: true,
  },
});
