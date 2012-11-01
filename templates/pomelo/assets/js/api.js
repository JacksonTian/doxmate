(function(){
	//绑定参数
	Function.prototype._$bind = function(){
    var _args = arguments,
        _object = arguments[0],
        _function = this;
    return function(){
        var _argc = [].slice.call(_args,1);
        [].push.apply(_argc,arguments);
        return _function.apply(_object||window,_argc);
    };
	};
	//获取节点
	var getNodeById=function(_id){
    return document.getElementById(_id);
	};
	//获取含有class的节点
	var getNodesByClassName=function(_element,_className){
    if(!!_element.getElementsByClassName){
        return _element.getElementsByClassName(_className);
    }else{
        var _nodes=_element.getElementsByTagName("*");
        var _targetNodes=new Array();
        for(var i=0,len=_nodes.length;i<len;i++){
            if(hasClass(_nodes[i],_className)){_targetNodes.push(_nodes[i]);}
        }
        return _targetNodes;
    }
	};
	//获取指定tag的节点
	var getNodesByTagName=function(_element,_tagName){
			return _element.getElementsByTagName(_tagName);
	}
	//添加事件
	var addEvent=function(_element,_type,_handler){
    if(_element.addEventListener){
        _element.addEventListener(_type,_handler,false);
    }else if(_element.attachEvent){
        _element.attachEvent("on"+_type,_handler);
    }else{
        _element["on"+_type]=_handler;
    }
	};
	//移除事件
	var removeEvent=function(_element,_type,_handler){
    if(_element.removeEventListener){
        _element.removeEventListener(_type,_handler,false);
    }else if(_element.detachEvent){
        _element.detachEvent("on"+_type,_handler);
    }else{
        _element["on"+_type]=null;
    }
	};
	//获取事件对象
	var getEvent=function(_event){
    return _event?_event:window.event;
	};
	//获取触发节点
	var getTarget=function(_event){
    return _event.target || _event.srcElement;
	};
	//阻止默认事件处理程序
	var preventDefault=function(_event){
    if(!!_event.preventDefault){
        _event.preventDefault();
    }else{
        _event.returnValue=false;
    }
	};
	//阻止冒泡
	var stopPropagation=function(_event){
    if(!!_event.stopPropagation){
        _event.stopPropagation();
    }else{
        _event.cancelBubble=true;
    }
	};
	//判断含有class
	var hasClass=function(_element,_class){
    if(typeof _element.className=="string"){
        return _element.className.match(new RegExp('(\\s|^)'+_class+'(\\s|$)'));
    }
    return false;
	};
	//删除class
	var removeClass=function(_element,_class){
    if(hasClass(_element,_class)){
        var _reg=new RegExp('(\\s|^)'+_class+'(\\s|$)');
        _element.className = _element.className.replace(_reg,' ');
    }
	};
	//添加class
	var addClass=function(_element,_class){
    if(!hasClass(_element,_class)){_element.className+=" "+_class;}
	};
	//获取计算样式
	var getComputedStyle=function(_element){
		if(!!document.defaultView){
			if(!!document.defaultView.getComputedStyle)return document.defaultView.getComputedStyle(_element);
		}
		return _element.currentStyle
	};
	
	//常量
	var isIE = (document.all) ? true : false;
	var isIE6 = isIE && ([/MSIE (\d)\.0/i.exec(navigator.userAgent)][0][1] == 6);
	
	//页面逻辑
	var page={
		init:function(){
			this.__getNode();
			this.__initEvent();
		},
		__getNode:function(){
			this.__pageBody=getNodesByClassName(document.body,"m-wrap")[0];
			this.__methods=getNodesByClassName(this.__pageBody,"method");
			this.__nav=getNodesByClassName(this.__pageBody,"m-nav")[0];
			this.__navs=getNodesByTagName(this.__nav,"a");
			this.__methodsTop={};
			for(var i=0,l=this.__methods.length;i<l;i++){
				//处理method名字一样的情况，加上class名字
				this.__methods[i].id=this.__methods[i].parentNode.id+'_'+this.__methods[i].id;
				this.__methodsTop[this.__methods[i].id]=this.__getNodeTop(this.__methods[i]);
			}
			this.__navMinTop=this.__getNodeTop(this.__nav);
			this.__navMaxTop=this.__getNodeTop(this.__nav.parentNode.parentNode)+this.__nav.parentNode.parentNode.clientHeight;
			this.__searchInput=getNodeById('search-input');
			this.__searchInput.value='Search';
			this.__arrow=getNodesByClassName(document.body,'m-arrow')[0];
			this.__showArrow();

		},
		__initEvent:function(){
			for(var i=0,l=this.__navs.length;i<l;i++){
				var _node=this.__navs[i];
				if(hasClass(_node,"cap")){
					addEvent(_node,"click",this.__onNavCapClick._$bind(this));
					//处理method名字一样的情况，加上class名字
					var _tmpUl=getNodesByTagName(_node.parentNode.parentNode,"ul")[0];
					var _tmpNavs=getNodesByTagName(_tmpUl,"a");
					for(var i2=0,l2=_tmpNavs.length;i2<l2;i2++){
						var _tmpNode=_tmpNavs[i2];
						_tmpNode.target=_node.target+'_'+_tmpNode.target;
					}
				}
				else{addEvent(_node,"click",this.__onNavClick._$bind(this));}
			}
			addEvent(window,"scroll",this.__onWindowScroll._$bind(this));
			addEvent(this.__searchInput,'focus',this.__onSearchFocus._$bind(this));
			addEvent(this.__searchInput,'blur',this.__onSearchBlur._$bind(this));
			addEvent(this.__arrow,'click',this.__onArrowClick._$bind(this));
		},
		__getNodeTop:function(_element){
			var _actualTop=_element.offsetTop;
			var _current=_element.offsetParent;
			while(_current !== null){
				_actualTop+=_current.offsetTop;
				_current=_current.offsetParent;
			}
			return _actualTop;
		},
		__onNavCapClick:function(_event){
			var _target=getTarget(getEvent(_event));
			var _ul=getNodesByTagName(_target.parentNode.parentNode,"ul")[0];
			if(hasClass(_ul,"f-dn"))removeClass(_ul,"f-dn");
			else addClass(_ul,"f-dn");
			preventDefault(getEvent(_event));
		},
		__onNavClick:function(_event){
			var _target=getTarget(getEvent(_event));
			var offset=this.__methodsTop[_target.target]-140>0?this.__methodsTop[_target.target]-140:0;
			document.documentElement.scrollTop=offset;
			document.body.scrollTop=offset;
			preventDefault(getEvent(_event));
		},
		__showCurrentSectionNav:function(){
			var _scrollTop= Math.max(document.documentElement.scrollTop,document.body.scrollTop);
			var _minTop=0;
			var _targetId="";
			for(var _o in this.__methodsTop){
				var _tmpTop=this.__methodsTop[_o];
				if(_tmpTop<=_scrollTop+140 && _tmpTop>_minTop){
					_minTop=_tmpTop;
					_targetId=_o;
				}
			}
			for(var i=0,l=this.__navs.length;i<l;i++){
				var _tmpNode=this.__navs[i];
				var _tmpCapNode=null;
				if(hasClass(_tmpNode,"cap")){
					_tmpCapNode=_tmpNode;
					var _tmpUl=getNodesByTagName(_tmpCapNode.parentNode.parentNode,"ul")[0];
					addClass(_tmpUl,'f-dn');
					var _tmpNavs=getNodesByTagName(_tmpUl,"a");
					for(var i2=0,l2=_tmpNavs.length;i2<l2;i2++){
						_tmpNode=_tmpNavs[i2];
						if(hasClass(_tmpNode.parentNode,"current"))removeClass(_tmpNode.parentNode,"current");
						if(_tmpNode.target==_targetId){
							addClass(_tmpNode.parentNode,"current");
							removeClass(_tmpUl,"f-dn");
						}
					}
				}
			}
		},
		__ajustSectionNav:function(){
	      	var _scrollTop= Math.max(document.documentElement.scrollTop,document.body.scrollTop);
	      	_scrollTop+=121;
	     	var _navHeight=this.__nav.clientHeight;
	   	    if(_scrollTop<=this.__navMinTop){
	   	    	if(this.__navFixed){
	   	    		if(isIE6)removeClass(this.__nav,'m-nav-ie6fixed');
	   	    		else removeClass(this.__nav,'m-nav-fixed');
	        		this.__navFixed=false;
	        	}
	        	if(this.__nav.style.top!=0)this.__nav.style.top=0;
	        }else if(_scrollTop<(this.__navMaxTop-_navHeight)){
	        	if(!this.__navFixed){
	        		if(isIE6){addClass(this.__nav,'m-nav-ie6fixed');}
	        		else{this.__nav.style.top='121px';addClass(this.__nav,'m-nav-fixed');}
	        		this.__navFixed=true;
	        	}
	        }else{
	        	if(this.__navFixed){
	        		if(isIE6)removeClass(this.__nav,'m-nav-ie6fixed');
	        		else removeClass(this.__nav,'m-nav-fixed');
	        		this.__navFixed=false;
	        	}
	        	this.__nav.style.top=this.__navMaxTop-this.__navMinTop-_navHeight+"px";
	        }
		},
		__showArrow:function(){
			var _scrollTop= Math.max(document.documentElement.scrollTop,document.body.scrollTop);
			if(_scrollTop!=0 && !this.__arrowShowed){
				removeClass(this.__arrow,'f-dn');
				this.__arrowShowed=true;
			}else if(_scrollTop==0 && this.__arrowShowed){
				addClass(this.__arrow,'f-dn');
				this.__arrowShowed=false;
			}

		},
		__onWindowScroll:function(_event){
			this.__showArrow();
			this.__showCurrentSectionNav();
			this.__ajustSectionNav();
		},
		__onSearchFocus:function(_event){
			if(this.__searchInput.value=='Search')this.__searchInput.value='';
		},
		__onSearchBlur:function(_event){
			if(this.__searchInput.value=='')this.__searchInput.value='Search';
		},
		__onArrowClick:function(_event){
			document.documentElement.scrollTop=0;
			document.body.scrollTop=0;
			preventDefault(getEvent(_event));
		}
	};
	page.init();
})();