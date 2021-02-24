import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'

//import { Select, Option, Radio, RadioGroup, ColorPicker,Popover} from 'element-ui';
import elementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import IDEColorPicker from '../packages/index'
import IDERelation from '../packages/index'
import IDEDataDialog from '../packages/index'
import IDETextStyle from '../packages/index'
import IDENumberRock from '../packages/index'
import IDEDataFilter from '../packages/index'
import './count.js';


//Vue.use(Select)
//Vue.use(Radio)
//Vue.use(ColorPicker)
//Vue.use(Option)
//Vue.use(RadioGroup)
//Vue.use(Popover)
Vue.use(elementUI)
Vue.use(IDEColorPicker)
Vue.use(IDERelation)
Vue.use(IDEDataDialog)
Vue.use(IDETextStyle)
Vue.use(IDENumberRock)
Vue.use(IDEDataFilter)


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
