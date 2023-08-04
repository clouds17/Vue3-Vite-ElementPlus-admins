import { createStore } from 'vuex'

import user from '~/store/modules/user.js'
import commen from '~/store/modules/commen.js'


const store = createStore({
    modules: {
        user,
        commen
    }
})

export default store