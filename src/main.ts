import { createApp } from 'vue'
import '@/src/style.css'
import 'primeicons/primeicons.css'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import App from '@/src/App.vue'
import ToastService from 'primevue/toastservice';
import router from '@/src/router';
import { setupAxiosInterceptors } from './services/interceptors';

const app = createApp(App);
app.use(PrimeVue, {
	theme: {
		preset: Aura,
		options: {
			prefix: 'p',
			darkModeSelector: 'disabled',
		}
	}
});
app.use(router);
app.use(ToastService);
app.mount('#app');

setupAxiosInterceptors();