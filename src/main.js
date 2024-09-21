import './assets/main.scss';

import router from '@/router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import locale from 'element-plus/dist/locale/zh-cn';
import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-persistedstate-plugin';
import { createApp } from 'vue';
import App from './App.vue';


const persistedstate = createPersistedState()
const pinia = createPinia()
const app =createApp(App);

pinia.use(persistedstate)

app.use(pinia)
app.use(router)
app.use(ElementPlus,{locale})

app.mount('#app')
