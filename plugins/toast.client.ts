import Toast, { POSITION, TYPE } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import '~/assets/css/toast.css'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(Toast, {
        transition: 'Vue-Toastification__fade',
        position: POSITION.BOTTOM_CENTER,
        draggable: false,
        // icon: false,
        toastDefaults: {
            [TYPE.ERROR]: { timeout: false, closeOnClick: false, toastClassName: 'alert-base alert-error' },
            [TYPE.SUCCESS]: { timeout: 2000, toastClassName: 'alert-base alert-success' },
            [TYPE.INFO]: { timeout: 2000, toastClassName: 'alert-base alert-info' },
            [TYPE.WARNING]: { timeout: 3000, toastClassName: 'alert-base alert-warning' },
        },
    })
})
