import {ShineonScroll} from './src/Plugins_es6_scroll_2.0.js'
export default {
 	install: function(Vue, name = '$Scroll') {
	 Object.defineProperty(Vue.prototype, name, { value: ShineonScroll });
  }
}