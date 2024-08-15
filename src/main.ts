import { createApp } from 'vue'
import '@/src/style.css'
import 'primeicons/primeicons.css'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import App from '@/src/App.vue'
import router from '@/src/router';

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
app.mount('#app');