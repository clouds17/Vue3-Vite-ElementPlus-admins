import { createStore } from 'vuex'

import user from '~/store/modules/user.js'
import commen from '~/store/modules/commen.js'
import home from '~/store/modules/home.js'


const store = createStore({
    modules: {
        user,
        commen,
        home
    }
})

export default store