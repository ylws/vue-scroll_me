# 1.原生js文件导出实例化方法（可传参）
	export function CFCMScroll(param) {
		return new CFCMScroll(param)
	}
# 2.npm包index文件接收CFCMScroll参数，并把该参数添加到vue原型对象里面
	import {CFCMScroll} from './src/Plugins_es6_scroll_2.0.js'
	export default {
	 	install: function(Vue, name = '$Scroll') {
 		 Object.defineProperty(Vue.prototype, name, { value: CFCMScroll });
	  }
	}
# 3.发布npm包（eg:scroll_me）
# 4.npm安装scroll_me
# 5.在路由中引入CFCMescroll,并使用vue.use()安装js插件（安装 Vue.js 插件。如果插件是一个对象，必须提供 install 方法。如果插件是一个函数，它会被作为 install 方法。install 方法将被作为 Vue 的参数调用。）
	import CFCMScroll from 'scroll_me'
	Vue.use(CFCMScroll)
# 6.定义scroll.vue文件如下（需要注意的是，使用方法一定要放到mounted方法里面）
	<template>
		<div>
			{{msg}}
			<div class="scrollfather" id="scrollfather1" >
				<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p><p>7</p><p>8</p><p>9</p><p>0</p>
				<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p><p>7</p><p>8</p><p>9</p><p>0</p>
				<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p><p>7</p><p>8</p><p>9</p><p>0</p>
				<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p><p>7</p><p>8</p><p>9</p><p>0</p>
				<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p><p>7</p><p>8</p><p>9</p><p>0</p>
			</div>
		</div>
	</template>
	<script type="text/javascript">
	export default {
	  name: 'Scroll',
	  data () {
	    return {
	      msg: '滚动条信息'
	    }
	  },
	  mounted: function () {
	    console.log(this.$Scroll())
	  }
	}
	</script>
# 7.将该单文件放置到需要嵌入的组件即可。
# 注意事项：
	样式表需要自行引入。
	以上说明针对vue使用