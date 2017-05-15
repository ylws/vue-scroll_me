/*
 * 名称：模拟滚动条控件/shineonScroll
 * 作者：ylws
 * 邮箱：474569696@qq.com
 * 日期：2017/5/2
 * 参数：
 * Param @father:scrollfather1//当前区域id
 * Param @soncontent:scrollson
 * Param @scroll_y:scroll_y
 * Param @scroll_ymove:scroll_ymove
 * Param @scroll_x:scroll_x
 * Param @scroll_xmove:scroll_xmove
 * Param @wheelxory:wheely //滚动类型wheelx轴，wheely轴
 * Param @wheelval ://滑轮上下滚动的值，1位向下，-1位向上
 * Param @marginstep :10//步长,请使用数字，true为自动
 * Param @marginstepbole :8//步长,请使用数字，true为自动
 * Param @getfatherid :whichscroll//获取当前滚动区域模块id的隐藏域id
 * Param @scrolltop:top/bottom 
 * Param @resetinit：//0代表不做处理，1代表重置
 * Param @smscrollfnprev: //手机端滚动回调方法前缀
 * Param @touchpreventDefault: //是否开启移动端禁用滚动条
 * Param @boleonclick: //触屏设备在终端chrome浏览器,强制转到touch监听,并添加滚轮监听
 * Param @scrollbottomfn: "topmax", //top值滚动到底部
 * Param @mousewheelflag: true//默认开启模拟滚动条滚动，body区域滚动条禁止
 * 
 */
export default class {
	constructor(opt) {
		this.initVal(opt)
	}
	initVal(opt) {
		var defaultConfig = {
			"father": "scrollfather1", 
			"fatherclass":"scrollfather",
			"soncontent": "scrollson",
			"scroll_y": "scroll_y",
			"scroll_ymove": "scroll_ymove",
			"scroll_x": "scroll_x",
			"scroll_xmove": "scroll_xmove", 
			"wheelxory": "wheely", 
			"wheelval": 0, 
			"marginstep": 10, 
			"marginstepbole": 8,
			"getfatherid": "whichscroll", 
			"scrolltop": "top",
			"resetinit": 0, 
			"smscrollfnprev": "phone_", 
			"touchpreventDefault":false,
			"boleonclick": false, 
			"scrollbottomfn": "topmax",
			"mousewheelflag":true
		}
		var defaultinitConfig = {
			// y轴的高度计算:父元素高度-父元素的高度除以子元素总高；
			"hei_father":0,// 父元素（y轴）
			"hei_f_offhei":0,// 父元素距离顶部高度（y轴）hei_father_offheight
			"hei_f_offleft":0,// 父元素距离顶部高度（y轴）hei_fatheroffleft
			"hei_soncontent":0,// 子元素（y轴）
			"hei_scrolly":0,// 滚动条Y（y轴）
			"hei_nowposition_y":0,// 当前点击位置（y轴）
			"hei_scrolltop_y":0,// 滚动条距离顶部位置（y轴）
			"hei_nowposition_y_up":0,// (y轴）
			"hei_click_top":0,// 点击位置距离滚动条滑块顶部的高度（y轴）
			"hei_scroll_y_height":0,// 模拟滚动条top值（y轴）
			"hei_e_s_y_hei":0,// 除滑块以外的高度值（y轴）hei_exceptscrollyheight
			"hei_scrollheight":0,// 滑块每移动一像素，代表的实际margin-top距离（y轴）
			
			// x轴的宽度计算:父元素width-父元素的宽度除以子元素总宽；
			"wid_father":0,// 父元素（x轴）
			"wid_f_offwid":0,// 父元素距离左侧宽度（x轴）wid_fatheroffwidth
			"wid_soncontent":0,// 子元素（x轴）
			"wid_scrollx":0,// 滚动条X（x轴）
			"wid_nowposition_x":0,// 当前点击位置（x轴
			"wid_np_x_left":0,// x轴）wid_nowposition_x_left
			"wid_scrollleft_x":0,// 滚动条距离左侧位置（x轴）
			"wid_click_left":0,// 点击位置距离滚动条滑块左侧的宽度（x轴）
			"wid_scroll_x_width":0,// 模拟滚动条left值（x轴）
			"wid_e_s_wid":0,// 除滑块以外的宽度值（x轴）wid_exceptscrollxwidth
			"wid_scrollwidth":0, // 滑块每移动一像素，代表的实际margin-left距离（x轴）
		}
		this.cfg = {};
		Object.assign(this.cfg,defaultConfig,defaultinitConfig,opt);
		this.domFn();
		if(this.cfg.marginstep == true || this.cfg.marginstep == "true") {
			this.cfg.marginstep = this.getIdClass(this.cfg.father, this.cfg.soncontent).clientHeight / this.getId(this.cfg.father).clientHeight * 5;
			if(this.cfg.marginstep <= 5) {
				this.cfg.marginstep = 5;
			}
		}
		if(this.cfg.boleonclick) { //终端为移动设备，嵌套浏览器touch
			this.cfg.marginstep = this.cfg.marginstepbole;
		}
		if(this.cfg.resetinit) {
			if(this.cfg.wheelxory == "wheely") {
				this.getIdClass(this.cfg.father, this.cfg.soncontent).style.marginTop = '0px';
				this.getIdClass(this.cfg.father, this.cfg.scroll_y).style.top = '0px';
			} else if(this.cfg.wheelxory == "wheelx") {
				this.getIdClass(this.cfg.father, this.cfg.soncontent).style.marginLeft = '0px';
				this.getIdClass(this.cfg.father, this.cfg.scroll_x).style.left = '0px';
			}
			return;
		}
		if(this.getId(this.cfg.father).style.display == "none") { // 如果一开始为隐藏，则不再进行下面的操作,放置有的模拟滚动条默认为隐藏时，获取不到offset属性
			return false;
		} else {
			this.offsetval()
			this.init()
		}

	}
	domFn () {
		this.cfg.showObj = this.getId(this.cfg.father);
		this.cfg.showObj.setAttribute('class',this.cfg.fatherclass)
		let temp = this.cfg.showObj.innerHTML;
		let html = ``;
			html += `<div class="scrollson" >`
			html += temp;
			html +=`</div>
					<div class="scroll_ymove">
						<div class="scroll_y" ></div>
					</div>
					<div class="scroll_xmove">
						<div class="scroll_x"></div>
					</div>`
		
		this.cfg.showObj.innerHTML = html;
	}
	offsetval() {
		//y轴
		this.cfg.hei_f_offhei = this.getId(this.cfg.father).offsetTop;
		this.cfg.hei_father = this.getId(this.cfg.father).clientHeight;
		this.cfg.hei_soncontent = this.getIdClass(this.cfg.father, this.cfg.soncontent).clientHeight;
		//x轴
		this.cfg.wid_f_offwid = this.getId(this.cfg.father).offsetLeft;
		this.cfg.wid_father = this.getId(this.cfg.father).clientWidth;
		this.cfg.wid_soncontent = this.getIdClass(this.cfg.father, this.cfg.soncontent).clientWidth;

		this.getIdClass(this.cfg.father, this.cfg.scroll_ymove).style.height = this.getId(this.cfg.father).clientHeight;
		this.getIdClass(this.cfg.father, this.cfg.scroll_ymove).style.width = this.getId(this.cfg.father).clientWidth;
		//y轴
		if(this.cfg.hei_father < this.cfg.hei_soncontent) {
			this.getIdClass(this.cfg.father, this.cfg.scroll_ymove).style.display = 'block';
			this.getIdClass(this.cfg.father, this.cfg.scroll_y).style.display = 'block';
			this.cfg.hei_scrolly = this.cfg.hei_father * (this.cfg.hei_father / this.cfg.hei_soncontent);
			this.getIdClass(this.cfg.father, this.cfg.scroll_y).style.height = this.cfg.hei_scrolly + 'px';
		} else {
			this.getIdClass(this.cfg.father, this.cfg.scroll_ymove).style.display = 'none';
			this.getIdClass(this.cfg.father, this.cfg.scroll_y).style.display = 'none';
		}
		//x轴
		if(this.cfg.wid_father < this.cfg.wid_soncontent) {
			this.getIdClass(this.cfg.father, this.cfg.scroll_xmove).style.display = 'block';
			this.getIdClass(this.cfg.father, this.cfg.scroll_x).style.display = 'block';
			this.cfg.wid_scrollx = this.cfg.wid_father * (this.cfg.wid_father / this.cfg.wid_soncontent);
			this.getIdClass(this.cfg.father, this.cfg.scroll_x).style.width = this.cfg.wid_scrollx + 'px';
		} else {
			this.getIdClass(this.cfg.father, this.cfg.scroll_xmove).style.display = 'none';
			this.getIdClass(this.cfg.father, this.cfg.scroll_x).style.display = 'none';
		}
	}
	getId(id) {
		return document.getElementById(id)
	}
	getIdClass(id, classname) {
		return document.getElementById(id).querySelector('.' + classname)
	}
	wheely() {
		//执行一次mousemove事件
		//ie、chrome当top为0时，值为auto,需做处理
		if(this.getIdClass(this.cfg.father, this.cfg.scroll_y).style.display == 'auto' || this.getIdClass(this.cfg.father, this.cfg.scroll_y).style.display == '') {
			this.getIdClass(this.cfg.father, this.cfg.scroll_y).style.top = '0px'
		}
		var topval = this.getIdClass(this.cfg.father, this.cfg.scroll_y).style.top;
		this.cfg.hei_scroll_y_height = parseFloat(topval == '' ? 0 : topval);
		this.cfg.hei_e_s_y_hei = parseInt(this.cfg.hei_father - this.cfg.hei_scrolly);

		//计算滚动位置，子元素移动多长距离
		var minstep = (this.cfg.hei_soncontent - this.cfg.hei_father) / this.cfg.hei_e_s_y_hei;
		this.cfg.hei_scrollheight = this.cfg.hei_scroll_y_height * minstep;
		if(this.cfg.wheelval >= 0) {
			if(this.cfg.hei_scroll_y_height >= this.cfg.hei_e_s_y_hei) {
				this.getIdClass(this.cfg.father, this.cfg.scroll_y).style.top = this.cfg.hei_e_s_y_hei + "px";
				this.cfg.hei_scroll_y_height = this.cfg.hei_e_s_y_hei;
				this.getIdClass(this.cfg.father, this.cfg.soncontent).style.marginTop = (-this.cfg.hei_soncontent + this.cfg.hei_father) + "px";
				if(window[this.cfg.scrollbottomfn]) {
					window[this.cfg.scrollbottomfn](_this);
				}
			} else {
				//点击添加元素，滑轮滚动，出现滚动到底部有空白
				if((parseFloat(this.getIdClass(this.cfg.father, this.cfg.scroll_y).style.top) + parseFloat(this.getIdClass(this.cfg.father, this.cfg.scroll_y).style.height)) >= (parseFloat(this.cfg.hei_father) - this.cfg.marginstep)) {
					this.getIdClass(this.cfg.father, this.cfg.scroll_y).style.top = this.cfg.hei_e_s_y_hei + "px";
					this.cfg.hei_scroll_y_height = this.cfg.hei_e_s_y_hei;
					this.getIdClass(this.cfg.father, this.cfg.soncontent).style.marginTop = (-this.cfg.hei_soncontent + this.cfg.hei_father) + "px";
				} else {
					this.getIdClass(this.cfg.father, this.cfg.scroll_y).style.top = ((this.cfg.hei_scrollheight + this.cfg.marginstep) / minstep) + "px";
					this.cfg.hei_scroll_y_height = ((this.cfg.hei_scrollheight + this.cfg.marginstep) / minstep);
					this.getIdClass(this.cfg.father, this.cfg.soncontent).style.marginTop = (-this.cfg.hei_scrollheight - this.cfg.marginstep) + "px";
				}
			}
		} else if(this.cfg.wheelval < 0) {
			if(this.cfg.hei_scroll_y_height <= 0) {
				this.getIdClass(this.cfg.father, this.cfg.scroll_y).style.top = "0px";
				this.cfg.hei_scroll_y_height = 0;
				this.getIdClass(this.cfg.father, this.cfg.soncontent).style.marginTop = "0px";
			} else {
				if((this.cfg.hei_scroll_y_height - minstep / this.cfg.marginstep) <= 0) {
					this.getIdClass(this.cfg.father, this.cfg.scroll_y).style.top = "0px";
					this.cfg.hei_scroll_y_height = 0;
					this.getIdClass(this.cfg.father, this.cfg.soncontent).style.marginTop = "0px";
				} else {
					this.getIdClass(this.cfg.father, this.cfg.scroll_y).style.top = ((this.cfg.hei_scrollheight - this.cfg.marginstep) / minstep) + "px";
					this.cfg.hei_scroll_y_height = ((this.cfg.hei_scrollheight - this.cfg.marginstep) / minstep);
					this.getIdClass(this.cfg.father, this.cfg.soncontent).style.marginTop = (-this.cfg.hei_scrollheight + this.cfg.marginstep) + "px";
				}
			}
		}
	}
	wheelx() {
		//执行一次mousemove事件
		//ie、chrome当left为0时，值为auto,需做处理
		if(this.getIdClass(this.cfg.father, this.cfg.scroll_x).style.left == 'auto') {
			this.getIdClass(this.cfg.father, this.cfg.scroll_x).style.left = '0px';
		}
		var leftval = this.getIdClass(this.cfg.father, this.cfg.scroll_x).style.left;
		this.cfg.wid_scroll_x_width = parseInt(leftval == '' ? 0 : leftval);
		this.cfg.wid_e_s_wid = this.cfg.wid_father - this.cfg.wid_scrollx;
		//计算滚动位置，子元素移动多长距离
		let minstep = (this.cfg.wid_soncontent - this.cfg.wid_father) / this.cfg.wid_e_s_wid;
		this.cfg.wid_scrollwidth = this.cfg.wid_scroll_x_width * minstep;
		if(this.cfg.wheelval >= 0) {
			if(this.cfg.wid_scroll_x_width >= this.cfg.wid_e_s_wid) {
				this.getIdClass(this.cfg.father, this.cfg.scroll_x).style.left = this.cfg.wid_e_s_wid + 'px';
				this.cfg.wid_scroll_x_width = this.cfg.wid_e_s_wid;
				this.getIdClass(this.cfg.father, this.cfg.soncontent).style.marginLeft = (-this.cfg.wid_soncontent + this.cfg.wid_father) + "px";
				if(window[this.cfg.scrollbottomfn]) {
					window[this.cfg.scrollbottomfn](_this);
				}
			} else {
				if((this.cfg.wid_scroll_x_width + parseInt(this.getIdClass(this.cfg.father, this.cfg.scroll_x).clientWidth)) >= (this.cfg.wid_father - this.cfg.marginstep)) {
					this.getIdClass(this.cfg.father, this.cfg.scroll_x).style.left = this.cfg.wid_e_s_wid + 'px';
					this.cfg.wid_scroll_x_width = this.cfg.wid_e_s_wid;
					this.getIdClass(this.cfg.father, this.cfg.soncontent).style.marginLeft = (-this.cfg.wid_soncontent + this.cfg.wid_father) + "px";
				} else {
					this.getIdClass(this.cfg.father, this.cfg.scroll_x).style.left = ((this.cfg.wid_scrollwidth + this.cfg.marginstep) / minstep) + "px";
					this.cfg.wid_scroll_x_width = ((this.cfg.wid_scrollwidth + this.cfg.marginstep) / minstep);
					this.getIdClass(this.cfg.father, this.cfg.soncontent).style.marginLeft = (-this.cfg.wid_scrollwidth - this.cfg.marginstep) + "px";
				}
			}
		} else if(this.cfg.wheelval < 0) {
			if(this.cfg.wid_scroll_x_width <= 0) {
				this.getIdClass(this.cfg.father, this.cfg.scroll_x).style.left = '0px';
				this.cfg.wid_scroll_x_width = 0;
				this.getIdClass(this.cfg.father, this.cfg.soncontent).style.marginLeft = "0px";
			} else {
				if((this.cfg.wid_scroll_x_width - minstep / this.cfg.marginstep) <= 0) {
					this.getIdClass(this.cfg.father, this.cfg.scroll_x).style.left = '0px';
					this.cfg.wid_scroll_x_width = 0;
					this.getIdClass(this.cfg.father, this.cfg.soncontent).style.marginLeft = "0px";
				} else {
					this.getIdClass(this.cfg.father, this.cfg.scroll_x).style.left = ((this.cfg.wid_scrollwidth - this.cfg.marginstep) / minstep) + "px";
					this.cfg.wid_scroll_x_width = ((this.cfg.wid_scrollwidth - this.cfg.marginstep) / minstep);
					this.getIdClass(this.cfg.father, this.cfg.soncontent).style.marginLeft = (-this.cfg.wid_scrollwidth + this.cfg.marginstep) + "px";
				}
			}
		}
	}
	scrollings() {
		var _this = this;
		var idval = ""; // 获取当前鼠标指向元素的id也就是opt['father']
		var soncobj = this.getId(this.cfg.father).querySelectorAll("." + this.cfg.soncontent);
		for(let i = 0; i < soncobj.length; i++) {
			soncobj[i].onmouseover = function() {
				_this.cfg.father = idval = _this.getId(_this.cfg.getfatherid).value = this.parentElement.getAttribute("id");
				_this.cfg.wheelxory = _this.getId(idval).getAttribute("wheelxory");
				let fatherhei = _this.getId(idval).clientHeight;
				let fatherwid = _this.getId(idval).clientWidth;
				if((fatherhei < this.clientHeight && _this.cfg.wheelxory == "wheely") || (fatherhei > this.clientHeight && _this.cfg.wheelxory == "wheely" && top.location.href != location.href) || (fatherwid < this.clientWidth && _this.cfg.wheelxory == "wheelx") || (fatherwid > this.clientWidth && opt.cfg.wheelxory == "wheelx" && top.location.href != location.href)) {
					if(_this.cfg.mousewheelflag) {
						document.body.onmousewheel = function() {
							return false
						};
					}
				} else {
					document.body.onmousewheel = null;
				}
				_this.smscrollfn = _this.smscrollfnprv + idval;
			}
		}
		this.offsetval()
		if(this.cfg.wheelxory == "wheely") {
			this.wheely()
		} else if(this.cfg.wheelxory == "wheelx") {
			this.wheelx()
		}
		if(window[this.smscrollfn]) {
			window[this.smscrollfn](this.cfg.father, this.cfg.wheelval);
		}
	}
	onmouseclick() {
		if(!(navigator.userAgent.match(/(iPhone|Android|iPad)/i))) {
			//鼠标事件添加
			//y轴
			var sf, sfwid, sfhei, flag;
			sf = this.getId(this.cfg.getfatherid).value; //获取当前点击元素的父元素id
			sfwid = this.getId(sf).clientWidth; //获取当前元素的宽度
			sfhei = this.getId(sf).clientHeight; //获取当前元素的高度
			flag = false; //默认设置移动开关为关闭状态
			this.smscrollfn = this.smscrollfnprv + sf;
			let _this = this;
			if(this.cfg.wheelxory == 'wheely') {

			}
			this.getId(sf).querySelector("." + this.cfg.scroll_y).onmousedown = function(e) {
				e = window.event || e;
				if(e.preventDefault) {
					e.preventDefault();
				} else {
					e.returnValue = false;
				}
				flag = true;
				_this.cfg.hei_nowposition_y = (e.pageY || e.clientY); //获取当前点击点的位置
				//ie、chrome当top为0时，值为auto,需做处理
				let styletop = this.style.top;
				if(styletop == "auto") {
					styletop = '0px'
				}
				_this.cfg.hei_scroll_y_height = parseInt(styletop);
				//前点击点距离顶部的位置
				_this.cfg.hei_click_top = _this.cfg.hei_nowposition_y - _this.cfg.hei_f_offhei - _this.cfg.hei_scroll_y_height;
				if(flag) {
					var sfleft, sftop, eleft, etop;
					document.onmousemove = function(e) {
						e = window.event || e;
						if(e.preventDefault) {
							e.preventDefault();
							e.stopPropagation();
						} else {
							e.returnValue = false;
							e.cancelBubble = true;
						}
						//y轴
						_this.cfg.hei_scroll_y_height = parseInt(_this.getIdClass(_this.cfg.father, _this.cfg.scroll_y).style.top);
						_this.cfg.hei_nowposition_y_up = e.pageY || e.clientY; //获取移动点的坐标
						_this.cfg.hei_scrolltop_y = _this.cfg.hei_nowposition_y_up - _this.cfg.hei_f_offhei - _this.cfg.hei_click_top;
						_this.cfg.hei_e_s_y_hei = _this.cfg.hei_father - _this.cfg.hei_scrolly;
						_this.cfg.hei_soncontent = _this.getIdClass(_this.cfg.father, _this.cfg.soncontent).clientHeight; //鼠标移动到两个同时存在的模拟滚动条时，会被覆盖掉，需重置
						_this.cfg.hei_father = _this.getId(_this.cfg.father).clientHeight; //鼠标移动到两个同时存在的模拟滚动条时，会被覆盖掉，需重置
						//计算滚动位置，子元素移动多长距离
						_this.cfg.hei_scrollheight = _this.cfg.hei_scroll_y_height * ((_this.cfg.hei_soncontent - _this.cfg.hei_father) / _this.cfg.hei_e_s_y_hei);
						if(_this.cfg.hei_scrolltop_y <= 0) {
							_this.getIdClass(_this.cfg.father, _this.cfg.scroll_y).style.top = '0px'
							_this.getIdClass(_this.cfg.father, _this.cfg.soncontent).style.marginTop = '0px'
						} else if(_this.cfg.hei_scrolltop_y >= _this.cfg.hei_e_s_y_hei) {
							_this.getIdClass(_this.cfg.father, _this.cfg.scroll_y).style.top = _this.cfg.hei_e_s_y_hei + "px";
							_this.getIdClass(_this.cfg.father, _this.cfg.soncontent).style.marginTop = -(_this.cfg.hei_soncontent - _this.cfg.hei_father) + 'px'
							if(window[_this.smsscrollbottomfn]) {
								window[_this.smsscrollbottomfn](_this);
							}
						} else {
							_this.getIdClass(_this.cfg.father, _this.cfg.scroll_y).style.top = _this.cfg.hei_scrolltop_y + "px";
							_this.getIdClass(_this.cfg.father, _this.cfg.soncontent).style.marginTop = -_this.cfg.hei_scrollheight + 'px'
						}
					}
				}

			}

			//x轴
			this.getId(sf).querySelector("." + this.cfg.scroll_x).onmousedown = function(e) {
				e = window.event || e;
				if(e.preventDefault) {
					e.preventDefault();
				} else {
					e.returnValue = false;
				}
				flag = true;
				_this.cfg.wid_nowposition_x = (e.pageX || e.clientX); //获取当前点击点的位置
				//ie、chrome当left为0时，值为auto,需做处理
				let styleleft = this.style.left;
				if(styleleft == "auto" || styleleft == '') {
					styleleft = '0px'
				}
				_this.cfg.wid_scroll_x_width = parseInt(styleleft);
				//前点击点距离顶部的位置
				_this.cfg.wid_click_left = _this.cfg.wid_nowposition_x - _this.cfg.wid_f_offwid - _this.cfg.wid_scroll_x_width;
				if(flag) {
					document.onmousemove = function(e) {
						var e = window.event || e;
						if(e.preventDefault) {
							e.preventDefault();
							e.stopPropagation();
						} else {
							e.returnValue = false;
							e.cancelBubble = true;
						}
						//x轴
						_this.cfg.wid_scroll_x_width = parseInt(_this.getIdClass(sf, _this.cfg.scroll_x).style.left);
						_this.cfg.wid_np_x_left = e.pageX || e.clientX; //获取移动点的坐标
						_this.cfg.wid_scrollleft_x = _this.cfg.wid_np_x_left - _this.cfg.wid_f_offwid - _this.cfg.wid_click_left;
						_this.cfg.wid_e_s_wid = _this.cfg.wid_father - _this.cfg.wid_scrollx;
						_this.cfg.wid_soncontent = _this.getIdClass(sf, _this.cfg.soncontent).clientWidth; //鼠标移动到两个同时存在的模拟滚动条时，会被覆盖掉，需重置
						_this.cfg.wid_father = _this.getId(sf).clientWidth; //鼠标移动到两个同时存在的模拟滚动条时，会被覆盖掉，需重置
						//计算滚动位置，子元素移动多长距离
						_this.cfg.wid_scrollwidth = _this.cfg.wid_scroll_x_width * ((_this.cfg.wid_soncontent - _this.cfg.wid_father) / _this.cfg.wid_e_s_wid);
						if(_this.cfg.wid_scrollleft_x <= 0) {
							_this.getIdClass(sf, _this.cfg.scroll_x).style.left = '0px';
							_this.getIdClass(sf, _this.cfg.soncontent).style.marginLeft = '0px';
						} else if(_this.cfg.wid_scrollleft_x >= _this.cfg.wid_e_s_wid) {
							_this.getIdClass(sf, _this.cfg.scroll_x).style.left = _this.cfg.wid_e_s_wid + "px";
							_this.getIdClass(sf, _this.cfg.soncontent).style.marginLeft = -(_this.cfg.wid_soncontent - _this.cfg.wid_father) + "px";
							if(window[_this.smsscrollbottomfn]) {
								window[_this.smsscrollbottomfn](_this);
							}
						} else {
							_this.getIdClass(sf, _this.cfg.scroll_x).style.left = _this.cfg.wid_scrollleft_x + "px";
							_this.getIdClass(sf, _this.cfg.soncontent).style.marginLeft = -_this.cfg.wid_scrollwidth + "px";
						}
					}
				}
			}
			document.onmouseup = function() {
				flag = false;
				document.body.onmousewheel = null;
				document.onmousemove = null;
				if(window[this.smscrollfn]) {
					window[this.smscrollfn](sf, _this.cfg.wheelval);
				}
			};
		}
	}
	addElement() {
		this.offsetval()
		//需要获取子元素总的高度；重新计算滚动条每像素代表的实际margin距离和滚动条高度增加后，重新赋值
		if(this.cfg.wheelxory == "wheely") {
			this.cfg.hei_scrolly = this.cfg.hei_father * (this.cfg.hei_father / this.cfg.hei_soncontent);
			this.getIdClass(this.cfg.father, this.cfg.scroll_y).style.height = this.cfg.hei_scrolly + 'px'
			this.cfg.hei_e_s_y_hei = parseInt(this.cfg.hei_father - this.cfg.hei_scrolly);
			//计算滚动位置，子元素移动多长距离
			var minstep = (this.cfg.hei_soncontent - this.cfg.hei_father) / this.cfg.hei_e_s_y_hei;
			var margintopval = Math.abs(parseFloat(this.getIdClass(this.cfg.father, this.cfg.soncontent).style.marginTop));
			this.getIdClass(this.cfg.father, this.cfg.scroll_y).style.top = margintopval / minstep + "px";
			this.cfg.hei_scroll_y_height = margintopval / minstep;
		} else if(this.cfg.wheelxory == "wheelx") {
			this.cfg.wid_scrollx = this.cfg.wid_father * (this.cfg.wid_father / this.cfg.wid_soncontent);
			this.getIdClass(this.cfg.father, this.cfg.scroll_x).style.width = this.cfg.wid_scrollx + 'px'
			this.wid_e_s_x_wid = parseInt(this.cfg.wid_father - this.cfg.wid_scrollx);
			//计算滚动位置，子元素移动多长距离
			var minstep = (this.cfg.wid_soncontent - this.cfg.wid_father) / this.wid_e_s_x_wid;
			var marginleftval = Math.abs(parseFloat(this.getIdClass(this.cfg.father, this.cfg.soncontent).style.marginLeft));
			this.getIdClass(this.cfg.father, this.cfg.scroll_x).style.left = margintopval / minstep + "px";
			this.cfg.wid_scroll_x_width = margintopval / minstep
		}
	}
	scrollFunc(that) {
		return function(e) {
			var idval = "";
			var ev = window.event || e;
			var funx, funy, fatherx, fathery, sf;

			funx = ev.pageX || ev.clientX;
			funy = ev.pageY || ev.clientY;
			sf = that.getId(that.cfg.getfatherid).value;
			var fatherhei = that.getId(sf).clientHeight;
			var fatherwid = that.getId(sf).clientWidth;
			var sonhei = that.getIdClass(sf, that.cfg.soncontent).clientHeight;
			var sonwid = that.getIdClass(sf, that.cfg.soncontent).clientWidth;
			that.getIdClass(sf, that.cfg.soncontent).style.transitionDuration = '0s';//设置动画效果时长为0
			if((fatherhei < sonhei && that.cfg.wheelxory == "wheely") || (fatherhei > sonhei && that.cfg.wheelxory == "wheely" && top.location.href != location.href) || (fatherwid < sonwid && that.cfg.wheelxory == "wheelx") || (fatherwid > sonwid && that.cfg.wheelxory == "wheelx" && top.location.href != location.href)) {
				if(that.cfg.mousewheelflag) {
					document.body.onmousewheel = function() {
						return false
					};
				}
				if(document.getElementById(sf).offsetTop != undefined) {
					fathery = that.getoffset(that.getId(sf)).top;
					fatherx = that.getoffset(that.getId(sf)).left;
					if(funx == undefined) {
						funx = fatherx;
					}
					if(funy == undefined) {
						funy = fathery;
					}
					if(funx >= fatherx && funx <= (fatherx + sonwid) && funy >= fathery && funy <= (fathery + sonhei)) {
						if(ev.wheelDelta) { //IE/Opera/Chrome
							var thisvalue = parseInt(ev.wheelDelta);
							that.cfg.father = sf;
							if(thisvalue > 0) {
								that.cfg.wheelval = -1;
							} else {
								that.cfg.wheelval = 1;
							}
						} else if(ev.detail) { //Firefox
							var thisvalue = parseInt(ev.detail);
							that.cfg.father = sf;
							if(thisvalue >= 0) {
								that.cfg.wheelval = 1;
							} else {
								that.cfg.wheelval = -1;
							}
						}
						that.scrollings();
					} else {
						document.body.onmousewheel = null;
					}
				}
			} else {
				document.body.onmousewheel = null;
			}
		}
	}
	getStyle(el, name ){
	　 　 if(window.getComputedStyle){
	　 　 　 return window.getComputedStyle(el, null)[name];
	　 　 }else{
	　 　 　 return el.currentStyle[name];
	　 　 }
	}
	getoffset (Node, offset) {
	     if (Node==null) {//当该节点为body节点时，结束递归
	        return offset;
	    }
	    if (!offset) {
	        offset = {};
	        offset.top = 0;
	        offset.left = 0;
	    }
	    var nodeposition = this.getStyle(Node, 'position' );
	    if(nodeposition == "absolute" ||nodeposition == "relative" || nodeposition == "fixed"){
	     	if(Node.getBoundingClientRect&&navigator.userAgent.toLowerCase().match(/.(msie)/)!=null){
		    	offset.top += Node.getBoundingClientRect.top;
		   		offset.left += Node.getBoundingClientRect.left;
		   		return offset;
		    }
		    else
		    {
		    	 offset.top += Node.offsetTop;
		   		 offset.left += Node.offsetLeft;
		    }
	     }else{
	     	offset.top += 0;
		   	offset.left += 0;
	     }
	    return this.getoffset(Node.parentElement, offset);//向上累加offset里的值
	}
	init() {
		var _this = this;
		if(!document.querySelector("." + this.cfg.getfatherid)) {
			var inputdom = document.createElement('input');
			inputdom.setAttribute('type', 'hidden')
			inputdom.setAttribute('class', this.cfg.getfatherid)
			inputdom.setAttribute('id', this.cfg.getfatherid)
			inputdom.setAttribute('value', this.cfg.father)
			document.body.appendChild(inputdom)
		}
		this.getId(this.cfg.father).setAttribute('wheelxory', this.cfg.wheelxory)
		this.getId(this.cfg.getfatherid).value = this.cfg.father
		this.scrollings();
		this.addElement();
		this.onmouseclick();
		this.scrollFunc();

		if((navigator.userAgent.match(/(iPhone|Android|iPad|Mobile|uc)/i)) || this.smsboleonclick) {
			var listenid = document.getElementById(this.cfg.father);
			var _this = this;
			listenid.addEventListener("touchstart", function() {
				_this.touchStart(_this)
			}, false);
			listenid.addEventListener("touchmove", function() {
				_this.touchMove(_this)
			}, false);
			listenid.addEventListener("touchend", function() {
				_this.touchEnd(_this)
			}, false);

			if(this.smsboleonclick) {
				if(navigator.userAgent.toLowerCase().match(/firefox/) != null) {
					document.addEventListener('DOMMouseScroll', this.scrollFunc, false);
				} else {
					window.onmousewheel = document.onmousewheel = this.scrollFunc;
				}
			}
		} else {
			/*注册事件web端*/
			if(document.addEventListener) { //W3C
				if(navigator.userAgent.toLowerCase().match(/firefox/) != null) {
					document.addEventListener('DOMMouseScroll', function(e) {
						_this.scrollFunc(_this)(e)
					}, false);
				} else {
					window.onmousewheel = document.onmousewheel = function(e) {
						_this.scrollFunc(_this)(e)
					};
				}
			}
		}
		if(this.cfg.scrolltop == "top") {
			this.getIdClass(this.cfg.father, this.cfg.soncontent).style.marginTop = '0px'
			this.getIdClass(this.cfg.father, this.cfg.scroll_y).style.top = '0px'
		} else if(this.cfg.scrolltop == "bottom" && this.getId(this.cfg.father).clientHeight <= this.getIdClass(this.cfg.father, this.cfg.soncontent).clientHeight) {
			var scrolltop = this.getId(this.cfg.father).clientHeight - this.getIdClass(this.cfg.father, this.cfg.scroll_y).clientHeight;
			var margintop = this.getIdClass(this.cfg.father, this.cfg.soncontent).clientHeight - this.getId(this.cfg.father).clientHeight;
			this.getIdClass(this.cfg.father, this.cfg.soncontent).style.marginTop = -margintop + 'px'
			this.getIdClass(this.cfg.father, this.cfg.scroll_y).style.top = scrolltop + 'px'
		}
	}
	touchStart() {
		var ev = window.event || e;
		//阻止网页默认动作（即网页滚动）
		if(this.cfg.touchpreventDefault) {
			document.body.ontouchstart = function(e) {
				var ev = window.event || e;
				ev.preventDefault();
				ev.stopPropagation();
			}
			ev.preventDefault();
		}
		this.cfg.wheelxory = this.getId(this.cfg.father).getAttribute("wheelxory");
		window.touch = ev.touches[0]; // 获取第一个触点
		var x = Number(touch.pageX); // 页面触点X坐标
		var y = Number(touch.pageY); // 页面触点Y坐标
		//记录触点初始位置
		this.startX = x;
		this.startY = y;
		this.lastX = x;
		this.lastY = y;

	}
	touchMove(e) {
		var ev = window.event || e;
		var father = this.cfg.father;
		var fatherhei = this.getId(this.cfg.father).clientHeight;
		var fatherwid = this.getId(this.cfg.father).clientWidth;
		var sonhei = this.getIdClass(this.cfg.father, this.cfg.soncontent).clientHeight;
		var sonwid = this.getIdClass(this.cfg.father, this.cfg.soncontent).clientWidth;
		if((fatherhei >= sonhei && this.cfg.wheelxory == "wheely") || (fatherwid > sonwid && this.cfg.wheelxory == "wheelx")) {
			return false;
		}
		if(this.cfg.touchpreventDefault) {
			document.body.ontouchmove = function(e) {
				var ev = window.event || e;
				ev.preventDefault();
				ev.stopPropagation();
			} //解决移动端其他浏览器问题
			ev.preventDefault(); //解决移动端现代浏览器问题
		}
		var touch = ev.touches[0]; //获取第一个触点
		this.lastX = Number(touch.pageX); //页面触点X坐标
		this.lastY = Number(touch.pageY); //页面触点Y坐标
		var ylength, xlength;
		ylength = this.lastY - this.startY;
		xlength = this.lastX - this.startX;
		if(Math.abs(ylength) > Math.abs(xlength)) { //垂直方向
			if(ylength >= 0) {
				this.cfg.wheelval = -1;
			} else {
				this.cfg.wheelval = 1;
			}
		} else { //水平方向
			if(xlength >= 0) {
				this.cfg.wheelval = -1;
			} else {
				this.cfg.wheelval = 1;
			}

		}
		this.scrollings();
	}
	touchEnd(e) {
		var ev = window.event || e;
		this.cfg.touchpreventDefaultflag = true;

		if(Math.abs(this.lastY) - Math.abs(this.startY) >= 5 || Math.abs(this.lastX) - Math.abs(this.startX) >= 5) {
			this.cfg.touchpreventDefaultflag = false;
		}
		document.body.ontouchstart = null;
		document.body.ontouchmove = null;
		if(window["scrollTouchPreventDefault"]) {
			if(this.cfg.touchpreventDefaultflag) {
				window["scrollTouchPreventDefault"](this.cfg.father);
			}
		}
	}
}
export function ShineonScroll(param) {
	return new shineonScroll(param)
}