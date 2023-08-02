import { createStore } from 'vuex'

import user from '~/store/modules/user.js'


const store = createStore({
    modules: {
        user
    }
})

export default store