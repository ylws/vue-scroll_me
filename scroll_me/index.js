import {CFCMScroll} from './src/Plugins_es6_scroll_2.0.js'
export default {
 	install: function(Vue) {
	 Object.defineProperty(Vue.prototype, '$Scroll', { value: CFCMScroll });
  }
}