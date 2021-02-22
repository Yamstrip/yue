//"use strict";
let yue = window .yue = function ( ) {
	return yue
}
//设置请求url
yue .url = function ( fx ) {
	yue .geturls = fx
}
yue .urls = "?"
yue .geturl = function ( obj ) {
	let app = [ ]
	for ( let i in obj ) {
		app .push ( `${i}=${obj[i]}` )
	}
	return yue .urls + app .join ( "&" )
}
yue .objs = { }
//返回对象实例
yue .obj = function ( name ) {
	if ( yue .objs [ name ] ) {
		return yue .objs [ name ]
	}
	let obj = { }
	obj .func = [ ]
	obj .data = { }
	obj .set = function ( d , n ) {
		if ( typeof d === `object` ) {
			for ( let i in d ) {
				if ( d [ i ] == undefined ) {
					obj .data [ i ] = true
				} else {
					obj .data [ i ] = d [ i ]
				}
			}
		}
		obj .data [ d ] = n
	}
	obj .get = yue .pipe .return ( function ( d , n ) {
		return obj .data [ d ]
	} )
	//本地数据
	obj .send = yue .pipe .into ( function ( name , data ) {
		//data ?
		if ( data == undefined ) {
			data = { }
		}
		let fx = { }
		yue .get ( {
			type: "yue_obj_data",
			name,
			data
		} )
		.default ( function ( d , st ) {
			if ( fx .default ) {
				fx .default ( d , st )
			}
		} )
		.false ( function ( d , st ) {
			if ( fx .false ) {
				fx .false ( d .data, st )
			}
		} )
		.true ( function ( d , st ) {
			if ( fx .true ) {
				fx .true ( d .data , st )
			}
		} )
		return yue .pipe ( {
			default: function ( f ) {
				fx .default = f
			},
			false: function ( f ) {
				fx .false = f
			},
			true: function ( f ) {
				fx .true = f
			}
		} )
	} )
	//local
	obj .local = yue .pipe .into ( function ( Name ) {
		let val = obj .getlocal ( Name )
		return yue .pipe .into ( {
			true: function ( fx ) {
				if ( val !== null ) {
					fx ( val )
				}
			},
			false: function ( fx ) {
				if ( val == null ) {
					fx ( undefined )
				}
			},
			default: function ( fx ) {
				fx ( val )
			}
		} )
	} )
	//get local
	obj .getlocal = yue .pipe .return ( function ( Name ) {
		try {
			let d = JSON .parse ( localStorage .getItem ( "yue_obj_" + name + "_" + Name ) )
			if ( d .stime ) {
				if ( Date .now ( ) - d .time > d .stime ) {
					localStorage .removeItem ( "yue_obj_" + name + "_" + Name )
					return null
				}
			}
			//alert("suc:"+d.data)
			return d .data
		} catch ( e ) {
			return null
		}
	} )
	obj .setlocal = function ( Name , data , time ) {
		let stime
		try {
			if ( ( Number ( time ) + "" ) != "NaN" ) {
				stime = Number ( time )
			}
			let saver = {
				data,
				stime,
				time: Date .now ( )
			}
			localStorage .setItem ( "yue_obj_" + name + "_" + Name , JSON .stringify ( saver ) )
		} catch ( e ) {
			
		}
	}
	obj .clearlocal = obj .removelocal = function ( Name ) {
		try {
			localStorage .removeItem ( "yue_obj_" + name + "_" + Name )
		} catch ( e ) {
			
		}
	}
	yue .objs [ name ] = obj
	return yue .pipe ( obj )
}

yue .get = function ( OBJ , bol ) {
	let code = 0
	let obj = {
		
	}
	let call = function ( d , f ) {
		if ( obj .default ) {
			obj .default ( d , f )
		}
		if ( obj .true && d .type == true ) {
			obj .true ( d .data, f )
		} else
		if ( obj .false && ( d .type == false , f == 404 ) ) {
			obj .false ( d .data, f )
		}
	}
	let o = new XMLHttpRequest ( )
	obj .req_type = "get"
	//alert(yue.geturl(OBJ))
	if ( bol !== null ) {
		OBJ .req_type = "get"
		OBJ .random_time = Math .random ( )
	}
	o .open ( `GET`, bol !== null ? yue .geturl ( OBJ ) : OBJ , true )
	o .onreadystatechange = function ( e ) {
		//alert(o.status)
		if ( o .readyState == 4 ) {
			if ( code == 0 ) {
				code = 1
			}
			if ( code == 1 ) {
				let data = o .responseText
				if ( bol !== null ) {
					try {
						data = JSON .parse ( data )
					} catch ( e ) {
						data = {
							type: "text",
							data
						}
					}
				}
				//try+
				try {
					call ( data , o .status )
				} catch ( e ) {
					alert ( e .stack )
				}
			}
		}
	}
	o .send ( )
	return yue .pipe (
		{
			true: function ( fx ) {
				obj .true = fx
			},
			false: function  ( fx ) {
				obj .false = fx
			},
			default: function ( fx ) {
				obj .default = fx
			},
			timeout: function ( fx , time ) {
				o .ontimeout = fx
				o .timeout = time
			}
		}
	)
}
//post
yue .post = function ( OBJ , data , nu ) {
	let ajax = new XMLHttpRequest ( )
	obj .req_type = "post"
	let obj = {
		
	}
	if ( nu !== null ) {
		OBJ .req_type = "post"
		OBJ .random_time = Math .random ( )
	}
	let call = function ( d ) {
		if ( obj .true && d .type == false ) {
			obj .true ( d .data , f )
		} else
		if ( obj .false && d .type == false ) {
			obj .false ( d .data , f )
		}
		if ( obj .default ) {
			obj .default ( d , f )
		}
	}
	// 使用post请求
	ajax .open ( 'post' , nu == null ? OBJ : yue .geturl ( OBJ ) )
	//ajax .setRequestHeader ( "Content-type","application/json" )
	// 格式type=3&bin=998字符串的格式
	ajax .send ( data )
	ajax .onreadystatechange = function ( ) {
		if ( ajax .readyState == 4 && ( ajax .status == 200 || ajax .status == 0 ) ) {
			//console.log(ajax.responseText);
			let str = ajax.responseText
			//将json字符串转换为json对象
			try {
				obj = JSON .parse ( str )
				call ( obj , ajax .status )
			} catch ( e ) {
				call ( {
					type: "text",
					data: str
				} , ajax .status )
			}
		}
	}
	return yue .pipe (
		yue,
		{
			default: function ( fx ) {
				obj .default = fx
			},
			true: function ( fx ) {
				obj .true = fx
			},
			false: function ( fx ) {
				obj .false = fx
			},
			timeout: function ( fx , time ) {
				ajax .ontimeout = fx
				ajax .timeout = time
			},
			send: function ( data ) {
				ajax .send ( data )
			}
		}
	)
}
//Wait
yue .wait = function ( ) {
	try{
	if ( ! yue .wait_obj ) {
		let d = $ ( `<div></div>` )
		d .css ( {
			height: 0,
			position: "fixed",
			width: "100%",
			whiteSpace: "nowrap",
			overflowX: "hidden",
			zIndex: 9999,
			top: 0,
			backgroundColor: "white"
		} )
		$ ( "body" ) .append ( d )
		yue .wait_obj = d
	}
	yue .wait_obj .html ( "" )
	yue .wait_obj .css ( "height" , "4.5px" )
	let css = {
		height: "4.5px",
		position: "absolute",
		left: 0,
		top: 0,
		width: "0%",
		transitionDuration: "0.5s",
		backgroundColor: "#2adbbe"
	}
	
	//循环体
	let Time = 2800
	yue .wait_ints = function ( ) {
		let time1 = Time * 2 / 3
		let time2 = Time * 1 / 3
		//ITE
		yue .wait_obj .html ( "" )
		let p1 = 0
		let p2 = 0
		let p3 = 0
		let p4 = 0
		let m = 30
		let sm = 100 / m
		
		let l1 = $ ( "<div></div>" )
		let l2 = $ ( "<div></div>" )
		
		yue .wait_obj .append ( l1 )
		yue .wait_obj .append ( l2 )
		//CSS
		
		l1 .css ( css )
		l2 .css ( css )
				
		
		for ( let i = 0; i < m; i ++ ) {
			//第一个处理
			let ro = i
			setTimeout ( function ( ) {
				l1 .css ( {
					left: ( ro * ro * 0.05 * sm -15 ) + "%" ,
					width: ( ro * ro * 0.1 * sm - 15 ) + "%"
				} )
			}, time1 * ( ro / m ) )
			//第二个处理
			setTimeout ( function ( ) {
				l2 .css ( {
					left: ( ro * ro * 0.4 * sm - 60 ) + "%",
					width: ( 300 - ro * sm ) + "%"
				} )
			}, time2 * ( ro / m ) + time1 - 100 )
		}
	}
	yue .wait_ints ( )
	yue .wait_int = setInterval ( function ( ) {
		try {
			yue .wait_ints ( )
		} catch ( e ) {
			alert (e)
		}
	} , Time + 100 )
	} catch (e){
		alert(e.stack)
	}
	return yue
}
//local
yue .local = function ( src ) {
	let d = yue .getlocal ( src )
	return yue .pipe ( {
		true: function ( fx ) {
			if ( d ) {
				fx ( d )
			}
		},
		false: function ( fx ) {
			if ( ! d ) {
				fx ( d )
			}
		},
		default: function ( fx ) {
			fx ( d )
		}
	} )
}

yue .getlocal = function ( name ) {
	try {
		let d = JSON .parse ( localStorage .getItem ( name ) )
		if ( d .stime ) {
			if ( Date .now ( ) - d .time > d .stime ) {
				localStorage .removeItem ( name )
				return null
			}
		}
		//alert("suc:"+d.data)
		return d .data
	} catch ( e ) {
		return null
	}
}
yue .setlocal = function ( name , data , time ) {
	let stime
	try {
		if ( ( Number ( time ) + "" ) != "NaN" ) {
			stime = Number ( time )
		}
		let saver = {
			data,
			stime,
			time: Date .now ( )
		}
		localStorage .setItem ( name , JSON .stringify ( saver ) )
		//alert(name)
	} catch ( e ) {
		//alert(e)
	}
}

yue .close_wait = function ( ) {
	setTimeout ( function ( ) {
		yue .wait_obj .css ( "height" , "0px" )
	}, 2000 )
	clearInterval ( yue .wait_int )
	return yue
}
//下载
yue .download = yue .down = function ( name , data ) {
	var aTag = document .createElement ( "a" ) 
	var blob = new Blob ( [ data ] )
	aTag .download = name
	aTag .href = URL .createObjectURL ( blob )
	aTag .click ( )
	URL .revokeObjectURL ( blob )
	return yue
}
//模块化对象
yue .loaddata = { }
yue .load = function ( id , src ) {
	let obj = { }
	let call = function ( d ) {
		if ( obj .true && d .type == true ) {
			obj .true ( d )
		} else
		if ( obj .false && d .type == false ) {
			obj .false ( d )
		} 
		if ( obj .default ) {
			obj .default ( d )
		}
	}
	let F = {
		true: function ( fx ) {
			obj .true = fx
		},
		false: function ( fx ) {
			obj .false = fx
		},
		default: function ( fx ) {
			obj .default = fx
		},
		timeout: function ( fx , time ) {
			gets .timeout ( fx , time )
		}
	}
	id = $ ( id )
	if ( id .attr ( "yc_load" ) == src ) {
		return yue .pipe ( F )
	}
	yue .wait ( )
	if ( yue .loaddata [ src ] ) {
		id .attr ( "yc_load" , src )
		id .css ( {
			transitionDuration: "0.5s",
			opacity: 1
		} )
		setTimeout ( function ( ) {
			id .css ( {
				opacity: 0
			} )
			setTimeout ( function ( ) {
				if ( yue .loadfunc_ ) {
					yue .loadfunc_ ( )
				}
				id .html ( yue .loaddata [ src ] )
				id .css ( {
					opacity: 1
				} )
				setTimeout ( function ( ) {
					yue .close_wait ( )
				} , 500 )
			}, 500 )
		} , 1 )
		return
	}
	//alert(yue .geturl ( ) .replace ( "?" , "" ) + "/" + src )
	let gets = yue .get ( yue .geturl ( ) .replace ( "?" , "" ) + "/" + src , null , null )
	.default ( function ( d , s ) {
		id .attr ( "yc_load" , src )
		if ( s == 404 || s == 0 ) {
			//alert(d)
			let D = yue [ "404" ]
			yue .loaddata [ src ] = D
			id .html ( D )
			yue .close_wait ( )
			return
		}
		//数据
		try {
			let ary = [ ]
			id .css ( {
				opacity: 0
			} )
			setTimeout ( function ( ) {
				id .html ( d + "" )
				if ( yue .loadfunc_ ) {
					yue .loadfunc_ ( )
				}
				setTimeout ( function ( ) {
					id .css ( "opacity" , 1 )
					yue .close_wait ( )
				}, 500 )
			}, 200 )
		} catch ( e ) {
			alert(e.stack)
			setTimeout ( function ( ) {
				yue .close_wait ( )
			}, 1000 )
		}
	} )
	.timeout ( function ( ) {
		yue .close_wait ( )
	}, 5 * 1000 )
}

yue .loadfunc = function ( fx ) {
	yue .loadfunc_ = fx
}
//绑定对象
yue .bind = function ( dom ) {
	if ( dom == undefined ) {
		dom = "html"
	}
	dom = $ ( dom )
	//迭代参数
	/*
	switch 开关
	*/
	//switch
	dom .find ( "[yue-switch]" ) .get ( ) .forEach ( s => {
		s = $ ( s )
		//名称
		if ( s .attr ( "yue_switch_install" ) ) {
			return
		}
		s .attr ( "yue_switch_install" , true )
		let name = yue .ast ( s .attr ( "yue-switch" ) )
		//open
		let on = yue .ast ( s .attr ( "yue-on" ) )
		//close
		let off = yue .ast ( s .attr ( "yue-off"  ) )
		//pcopen
		let onpc = yue .ast ( s .attr ( "yue-onpc" ) )
		//pclose 
		let offpc = yue .ast ( s .attr ( "yue-offpc" ) )
		//peopen
		let onpe = yue .ast ( s .attr ( "yue-onpe" ) )
		//peclose
		let offpe = yue .ast ( s .attr ( "yue-offpe" ) )
		//state
		let state = yue .ast ( s .attr ( "yue-state" ) )
		let open = yue .ast ( s .attr ( "yue-open" ) )
		let close = yue .ast ( s .attr ( "yue-close" ) )
		let chose = yue .ast ( s .attr ( "yue-chose" ) )
		let dom = s
		//yue-open
		
		if ( ! name ) {
			yue .log .html ( s, "missName: " + yue .log .now ( s ) )
		}
		if ( ! state ) {
			state = "close"
		}
		let obj = yue .obj ( name )
		if ( ! obj .get ( "switch" ) ) {
			obj .set ( "switch", [ ] )
		}
		let code = function ( dom , call ) {
			let css = function ( code , time ) {
				if ( time ) {
					setTimeout ( function ( ) {
						dom .css ( code )
					}, time )
				} else {
					dom .css ( code )
				}
			}
			let script = function ( code ) {
				try {
					eval ( code )
				} catch ( e ) {
					yue .log .error ( "Switch>" + name , e .stack )
					yue .log .error ( "Switch>" + name , yue .log .now ( dom ) )
				}
			}
			call ( {
				script,
				css
			} )
		}
		obj .get ( "switch" ) .push ( {
			name,
			on,
			off,
			onpc,
			offpc,
			onpe,
			offpe,
			open,
			close,
			chose,
			state,
			dom
		} )
		//class
		
		obj .set ( "open" , function ( data ) {
			if ( data == undefined ) {
				data = obj .get ( "switch" ) 
			}
			data .forEach ( dom => {
				dom .state = "open"
				code ( dom .dom , function ( obj ) {
					if ( dom .on ) {
						obj .script ( dom .on )
					}
					if ( dom .onpe && yue .window == "pe" ) {
						obj .script ( dom .onpe )
					}
					if ( dom .onpc && yue .window == "pc" ) {
						obj .script ( dom .onpc )
					}
				} )
			} )
		} )
		
		obj .set ( "close" , function ( data ) {
			if ( data == undefined ) {
				data = obj .get ( "switch" )
			}
			data .forEach ( dom => {
				dom .state = "close"
				code ( dom .dom , function ( obj ) {
					if ( dom .off ) {
						obj .script ( dom .off )
					}
					if ( dom .offpe && yue .window == "pe" ) {
						obj .script ( dom .offpe )
					}
					if ( dom .offpc && yue .window == "pc" ) {
						obj .script ( dom .offpc )
					}
				} )
			} )
		} )
		
		obj .set ( "chose" , function ( ) {
			//alert(obj.get("switch").length)
			obj .get ( "switch" ) .forEach ( dom => {
				if ( dom .state == "open" ) {
					obj .get ( "close" ) ( [ dom ] )
				} else 
				//if ( dom .state == "close" ) {
					obj .get ( "open" ) ( [ dom ] )
				//}
			} )
		} )
		
		
		
		if ( open !== undefined ) {
			s .click ( function ( ) {
				obj .get ( "open" ) ( )
			} )
		} else
		if ( close !== undefined ) {
			s .click ( function ( ) {
				obj .get ( "close" ) ( )
			} )
		} else
		if ( chose !== undefined ) {
			s .click ( function ( ) {
				obj .get ( "chose" ) ( )
			} )
		}
		//覆盖state
		obj .set ( "state" , state )
		//open函数
		//统一开关
	} )
	//Cards pepc自适应
	if ( yue .window == "pc" ) dom .find ( "[cards]" ) .get ( ) .forEach ( s => {
		//alert(s)
		s = $ ( s )
		//bind leval
		
		let level = 0
		s .children ( ) .get ( ) .forEach ( k => {
			k = $ ( k )
			//
			if ( k .attr ( "level" ) ) {
				let d = k .attr ( "level" )
				if ( d < 99999 && d >= 0 ) {
					level += Number ( d )
				} else {
					d += 1
				}
			} else {
				level ++
			}
		} )
		let w = s .width ( )
		let l = s .children ( ) .length 
		let t = s .offset ( ) .top
		let f = -1
		s .children ( ) .get ( ) .forEach ( k => {
			k = $ ( k )
			let L = 0
			if ( k .attr ( "level" ) ) {
				let d = k .attr ( "level" )
				if ( d < 99999 && d >= 0 ) {
					L = Number ( d )
				} else {
					L += 1
				}
			} else {
				L = 1
			}
			f ++
			k .attr ( "ui_window" , "pc" )
			k .css ( {
				width: `calc(${( L / level * 100 )}% - 10px)`,
				marginLeft: 5,
				marginRight: 5,
				display: "inline-block"
			} )
		} )
	} )
	//bind事件
	dom .find ( "[yue-bind]" ) .get ( ) .forEach ( s => {
		s = $ ( s )
		let name = s .attr ( "yue-bind" )
		let d = s .attr ( "yue-data" )
		let type = s .attr ( "yue-type" )
		//绑定自定义事件
		let obj = yue .obj ( name )
		if ( s .attr ( "yue_bind_install" ) ) {
			return
		}
		//数据绑定
		let binddata = s .attr ( "bind-data" )
		let bindtype = s .attr ( "bind-type" )
		
		if ( binddata && bindtype && yue .bind .lib [ name ] !== undefined ) {
			switch ( bindtype ) {
				case "text": s .text ( binddata .replace ( "$data" , yue .bind .lib [ name ] ) )
				break
				case "class": s .attr ( "class", binddata .replace ( "$data" , yue .bind .lib [ name ] ) )
				break
				case "val": s .val ( binddata .replace ( "$data" , yue .bind .lib [ name ] ) )
				break
				case "value": s .val ( binddata .replace ( "$data" , yue .bind .lib [ name ] ) )
				break
			}
		}
		
		//s .attr ( "yue_bind_install" , true )
		if ( ! obj .get ( "bind" ) ) {
			obj .set ( "bindlib" , { } )
			obj .set ( "bind" , function ( name, fx ) {
				obj .get ( "bindlib" ) [ name ] = fx
			} )
		}
	} )
	return yue
}

//event
yue .onban = function ( name , call ) {
	//on
	return yue .on ( name ) .res ( function ( data ) {
		if ( data .type = "ban" ) {
			call ( data )
		}
	} )
}


//onemitremove
yue .onlib = { }
yue .on = function ( name , Func ) {
	if ( yue .onlib [ name ] ) {
		return yue .onlib [ name ] .add ( Func )
	}
	let func = { }
	let id = 0
	
	yue .onlib [ name ] = yue .pipe ( {
		add: yue .pipe .into ( function ( fx ) {
			id ++
			let jd = id
			func [ jd ] = Func
			return yue .pipe ( {
				remove: function ( ) {
					delete func [ jd ]
				}
			} )
		} ),
		emit: function ( data ) {
			for ( let i in func ) {
				func [ i ] ( data )
			}
		}
	} )
	return yue .onlib [ name ] .add ( func )
}

yue .removeon = yue .exiton = function ( name , id ) {
	if ( name ._gettype_ ( ) == "yue_on_func" ) {
		name .remove ( )
		return
	}
	//remove
	if ( yue .onlib [ name ] ) {
		delete yue .onlib [ name ]
	}
}
yue .emit = function ( name , data ) {
	if ( yue .onlib [ name ] ) {
		yue .onlib [ name ] .emit ( data )
	}
}


yue .log = function ( str ) {
	if ( yue .log .accept ) {
		console .log ( str )
		if ( yue .window == "pe" ) {
			alert ( str )
		}
	}
}
yue .log .error = function ( tag , data ) {
	yue .log ( "程序为我们创建了一个错误:" + tag + "\n" + data )
}

yue .log .html = function ( s , str ) {
	let info = yue .html .info ( s )
}

yue .log .ban = function ( ) {
	yue .log .accept = false
}
yue .log .accept = true
yue .log .fat = function ( dom ) {
	let fat = $ ( "<div></div>" )
	fat .append ( dom .clone ( ) )
	return fat .html ( )
}
yue .log .now = function ( dom ) {
	let fat = $ ( "<div></div>" )
	let v = dom .clone ( )
	v .html ( "..." )
	fat .append ( v )
	return fat .html ( )
}
yue .window = function ( ) {
	var sUserAgent = navigator.userAgent.toLowerCase();
	var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
	var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
	var bIsMidp = sUserAgent.match(/midp/i) == "midp";
	var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
	var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
	var bIsAndroid = sUserAgent.match(/android/i) == "android";
	var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
	var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
	if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
		yue .window = "pe"
	} else {
		yue .window = "pc"
	}
}
yue .window ( )

//ast
yue .ast = function ( name ) {
	//it will consider in the future. 
	return name
	//,undefined
	if ( name == undefined || name == null || name == false || name == true || name == Infinity ) {
		return null
	}
	//ast解析
	name = yue .ast .ite ( name , {
		line: 0,
		index: 0,
		len: 0
	} )
}
yue .ast .ite = function ( str, conf ) {
	let data = [ ]
	//无回溯。害)
	while ( conf .len < str .length -1 ) {
		let is = true
		for ( let i in yue .ast .parse ) {
			let data = yue .ast .ite1 ( str, conf, yue .ast .parse [ i ] )
			conf .len += 999
			if ( data == false ) {
				continue
			} else {
				is = true
				data .push ( data .data )
				conf .len += data .len
			}
		}
	}
}
yue .ast .ite1 = function ( str , conf, data ) {
	//type
	if ( ! yue .ast .func [ data .name ] ) {
		yue .log ( "error ast name:" + data .name )
		return false
	}
}
//没修完再见
yue .ast .parse = [
	{
		name: "ignore",
		type: "string",
		data: [
			{
				type: "string",
				data: [
					" ",
					"\n",
					";",
					"\t",
					"\s"
				]
			}
		]
	},
	{
		type: "func",
		data: [
			{
				type: "chuck",
				break: "("
			},
			{
				type: "code",
				break: ")"
			}
		]
	},
	{
		type: "text",
		data: [
			{
				type: "string",
				data: [
					"\"",
					"`",
					"'"
				],
				name: "a"
			},
			{
				type: "chuck",
				break: [
					"`",
					"'",
					"\""
				],
				func: function ( d ) {
					if ( d .break !== d .get ( "a" ) ) {
						return false
					}
				}
			}
		]
	}
]
//
yue .ast .func = {
	
}

//html操作
yue .html = { }
yue .html .substr = function ( str , end ) {
	//substrHTML区间
	str = $ ( str )
	end = $ ( end )
	//for.sunstr
	let dom = str .clone ( ) .html ( "" )
	//alert(yue.log.now(dom))
	let rec = function ( last ) {
		
	}
	
}
yue .html .info = function ( node ) {
	node = $ ( node )
	let sub = yue .html .substr ( "html" , node )
	
}

//获取数据
yue .getdata = function ( name , time ) {
	time = time == undefined ? time : 0
	let call = [ ]
	setTimeout ( function ( ) {
		yue .get ( {
			type: "getdata",
		} )
		.res ( function ( data ) {
			for ( let i in call ) {
				call [ i ] ( data .data )
			}
		} )
	} ,time )
	return {
		res: function ( fx ) {
			if ( typeof fx === "function" ) {
				call .push ( fx )
			}
		}
	}
}
//和谐的弹窗
yue .alert = function ( data, time ) {
	let page = {
		attr: {
			"ui_back": true,
			"ui_style": true
		},
		script: function ( dom ) {
			yue .style .install ( dom )
		},
		name: "card",
		node: [
			{
				pecss: {
					padding:"20px 13.5px 20px 13.5px"
				},
				pccss: {
					padding:"30px 19px 30px 19px"
				},
				css: {
					height: "90%"
				},
				node: [
					{
						name: "h",
						data: {
							text: "提示"
						}
					},
					{
						name: "text",
						data: {
							text: data
						}
					}
				]
			},
			{
				css: {
					borderTop: "1px solid rgba(0,0,0,0.1)",
					margin:"10px 0 10px 0",
					height: "10%"
				},
				node: [
					{
						name: "button",
						data: {
							text: "关闭"
						},
						css: {
							borderRadius: "5px",
							color: "white",
							backgroundColor: "#5cb85c"
						},
						script: function ( dom ) {
							yue .wave .install ( dom )
							dom .click ( function ( ) {
								page .remove ( 500 )
							} )
						}
					}
				]
			}
		],
		css: {
			boxShadow: "0 0 999px 999px rgba(0,0,0,0.6)",
			borderRadius: "5px",
			zIndex: 25
		}
	}
	if ( time < 9999999 && time > 0 ) {
		page .node .push ( {
			type: "wait",
			time: Number ( time ),
			end: function ( ) {
				page .close ( )
			}
		} )
	}
	page = yue .ui ( page , 500 ,
	{
		opacity: 0
	},
	{
		opacity: 1
	} )
	setTimeout(function(){
		//alert(yue.log.fat(page.dom[0]))
	},1000)
}

//ui
yue .ui = function ( data , time , scss , ecss ) {
	try {
		let f = yue .ui .create ( data , [ ] )
		for ( let i in f .script ) {
			try {
				f .script [ i ] ( )
			} catch ( e ) {
				yue .log ( "Error脚本:" + e .stack )
			}
		}
		if ( time < 999999 && time > 0 ) {
			let Scss = {
				opacity: 0
			}
			let Ecss = {
				opacity: 1
			}
			if ( scss ) {
				for ( let i in scss ) {
					Scss [ i ] = scss [ i ]
				}
			}
			if ( ecss ) {
				for ( let i in ecss ) {
					Ecss [ i ] = ecss [ i ]
				}
			}
			for ( let i in f .dom ) {
				let g = f .dom [ i ]
				g .css ( Scss )
				setTimeout ( function ( ) {
					g .css ( "transitionDuration" , ( time / 1000 ) + "s" )
				} )
				setTimeout ( function ( ) {
					g .css ( Ecss )
				}, time )
			}
		}
		return f
	} catch ( e ) {
		yue .log ( "ErrorUI:" + e .stack )
	}
}
yue .ui .create = function ( data , script , last ) {
	if ( ! Array .isArray ( data ) ) {
		data = [ data ]
	}
	let y = yue .ui .lib
	for ( let i in data ) {
		let d = data [ i ]
		if ( typeof d === "object" ) {
			if ( y [ d .name ] ) {
				if ( ! Array .isArray ( y [ d .name ] ) ) {
					y [ d .name ] = [ y [ d .name ] ]
				}
				let e_d = y [ d .name ]
				if ( ! Array .isArray ( e_d ) ) {
					e_d = [ e_d ]
				}
				let sd = d
				e_d .forEach ( function ( s ) {
				let ed = s
				//alert(JSON.stringify(ed))
				for ( let j in ed ) {
					if ( sd [ j ] == undefined ) {
						sd [ j ] = ed [ j ]
					} else {
						let ED = ed [ j ]
						let SD = sd [ j ]
						//string.not
						if ( Array .isArray ( SD ) ) {
							if ( Array .isArray ( ED ) ) {
								for ( let I = 0; I < ED .length; I ++ ) {
									SD .push ( ED )
								}
							} else {
								SD .push ( ED )
							}
						} else
						if ( typeof SD === "object" && typeof ED === "object" && ! Array .isArray ( ED ) ) {
							for ( let I in ED ) {
								SD [ I ] = ED [ I ]
							}
						} else
						if ( typeof SD === "string" && ED === "string" ) {
							sd [ j ] = SD + ED
						} else
						if ( typeof SD === "function" && typeof ED === "function" ) {
							//alert(3)
							sd [ j ] = [ 
								SD,
								ED
							]
						}
					}
				}
				} )
			}
			let dom = yue .ui .make ( d )
			if ( last !== undefined ) {
				last .append ( dom )
			} else {
				d .dom = dom
			}
			for ( let I in dom .script ) {
				script .push ( dom .script [ I ] )
			}
			if ( d .node ) {
				let D = yue .ui .create ( d .node, script, dom )
				for ( let I in D .script ) {
					script .push ( D .script [ I ] )
				}
			}
		}
	}
	let ld = [ ]
	if ( last == undefined ) {
		for ( let i in data ) {
			if ( data [ i ] .dom ) {
				//alert(yue.log.fat(data[i].dom))
				$ ( "body" ) .append ( data [ i ] .dom )
				ld .push ( data [ i ] .dom )
			}
		}
		return yue .pipe ( {
			script,
			dom: ld,
			remove: function ( time ) {
				if ( time ) {
					for ( let i in ld ) {
						let g = ld [ i ]
						g .css ( {
							opacity: 1,
							transitionDuration: ( time / 1000 ) + "s"
						} )
						setTimeout ( function ( ) {
							g .css ( {
								opacity: 0
							} )
							setTimeout ( function ( ) {
								g .remove ( )
							}, time )
						}, 10 )
					}
				} else {
					for ( let i in ld ) {
						ld [ i ] .remove ( )
					}
				}
			}
		} )
	}
	return data
}
yue .ui .lib = { }
yue .ui .set = function ( name , data ) {
	yue .ui .lib [ name ] = data
}
yue .ui .delete = function ( name ) {
	delete yue .ui .lib [ name ]
}
yue .ui .make = function ( str ) {
	//autocss
	let tag = str .tag ? str .tag : "div"
	let dom = $ ( `<${tag}></${tag}>` ) 
	//css
	if ( str .css ) {
		dom .css ( str .css )
	}
	//alert(JSON.stringify(str))
	//pecss
	if ( str .pecss !== undefined && yue .window == "pe" ) {
		dom .css ( str .pecss )
	}
	if ( str .pccss && yue .window == "pc" ) {
		dom .css ( str .pccss )
	}
	//attr
	if ( str .attr ) {
		dom .attr ( str .attr )
	}
	//peattr
	if ( str .peattr && yue .window == "pe" ) {
		dom .attr ( str .peattr )
	}
	if ( str .pcattr && yue .window == "pc" ) {
		dom .attr ( str .pcattr )
	}
	//script
	dom .script = [ ]
	if ( typeof str .script === "function" ) {
		dom .script .push ( function ( ) {
			str .script ( dom )
		} )
	}
	
	else
	if ( Array .isArray ( str .script ) ) {
		for ( let i in str .script ) {
			dom .script .push ( function ( ) {
				str .script [ i ] ( dom )
			} )
		}
	}
	
	if ( typeof str .pescript === "function" ) {
		dom .script .push ( function ( ) {
			if ( yue .window == "pe" ) {
				str .pescript ( dom )
			}
		} )
	}
	
	else
	if ( Array .isArray ( str .pescript ) ) {
		//alert(1)
		for ( let i in str .pescript ) {
			dom .script .push ( function ( ) {
				if ( yue .window == "pe" ) {
					str [ i ] .pescript ( dom )
				}
			} )
		}
	}
	
	if ( typeof str .pcscript === "function" ) {
		dom .script .push ( function ( ) {
			if ( yue .window == "pc" ) {
				str .pcscript ( dom )
			}
		} )
	}
	
	else
	if ( Array .isArray ( str .pcscript ) ) {
		for ( let i in str .pcscript ) {
			dom .script .push ( function ( ) {
				if ( yue .window == "pc" ) {
					str [ i ] .pcscript ( dom )
				}
			} )
		}
	}
	//data,
	if ( str .data ) {
		if ( str .set ) {
			for ( let i in str .set ) {
				if ( str .data [ i ] !== undefined ) {
					str .set [ i ] ( str .data [ i ] , str, dom )
				}
			}
		}
	}
	//text
	if ( str .text ) {
		dom .text ( str .text )
	}
	if ( str .html ) {
		dom .html ( str .html )
	}
	//script
	/*
	for ( let i in dom .script ) {
		dom .script [ i ] ( dom )
	}
	*/
	return dom
}
yue .ui .stylelib = { }
yue .ui .addstyle = function ( name , obj ) {
	if ( ! ( typeof name === "object" ) ) {
		name = {
			[ name ]: obj
		}
	}
	for ( let i in name ) {
		if ( yue .ui .stylelib [ i ] ) {
			yue .ui .stylelib [ i ] .remove ( )
		}
		let m = function ( d ) {
			let t = [ ]
			for ( let i in d ) {
				t .push ( `${i}:${d[i]}` )
			}
			return t .join ( ";" )
		}
		yue .ui .stylelib [ i ] = $ ( `<style>${i}{${m(name[i])}}</style>` )
		$ ( "html" ) .append ( yue .ui .stylelib [ i ] )
	}
}

yue .ui .addstyle ( "测试" , {
	padding: "3px 8px 6px 1px"
} )


/*
yue .ui .css = function ( dom , css ) {
	let H = screen .height
	let W = screen .width
	let h = $ ( "html" ) .height ( )
	let w = $ ( "html" ) .width ( )
	alert(H+","+W+","+h+","+w)
	for ( let i in css ) {
		if ( i [ 0 ] == "$" ) {
			css [ i ] = css [ i ] .replace ( `px` , `` )
			if ( i == "width" | ) {
				
			}
		}
	}
}
*/
//alert
yue .ui .set ( "card" , [
	{
		tag: "div",
		pecss: {
			left: "10%", 
			top: "10%",
			width: "calc(80% - 20px)",
			maxHeight: "80%"
		},
		pccss: {
			left: "30%",
			top: "25%",
			width: "calc(40% - 40px)",
			maxHeight: "50%"
		},
		css: {
			overflow: "scroll",
			position: "fixed"
			//boxShadow: "0 0 5px 1px rgba(0,0,0,0.3)"
		},
		attr: {
			"ui_style": 1,
			"ui_back": 1
		},
		script: function ( dom ) {
			yue .style .load ( dom )
		}
	}
] )
yue .ui .set ( "text" , [
	{
		tag: "p",
		set: {
			text: function ( data , dom ) {
				dom .html = data
			}
		},
		text: "a"
	}
] )
yue .ui .set ( "h" , [
	{
		tag: "h1",
		set: {
			text: function ( data , dom ) {
				dom .html = data
			}
		}
	}
] )
yue .ui .set ( "button" , [
	{
		attr: {
			"ui_wave": "true",
			"alert_button": "true"
		},
		css: {
			"display": "inline-block",
			"padding": "6px 16px 6px 16px",
			"fontSize": "18px",
			"float": "right",
			"margin": "10px 10px 10px 0px",
			"boxShadow": "0 0 3px 1px rgba(0,0,0,0.1)"
		},
		set: {
			text: function ( data , dom ) {
				dom .text = data
			}
		}
	}
] )
/*
yue .ui .addstyle ( "[alert_button]" , {
	"background-color": "rgba(0,0,0,0)",
	"opacity": 1
} )
yue .ui .addstyle ( "[alert_button]:hover" , {
	"opacity": 0.9,
	"transition-Duration": "0.5s",
	"background-color": "rgba(0,0,0,0.2)"
} )
//主题
*/
yue .style = {
	
}
yue .style .data = [ ]
yue .style .length = 0
yue .style .load = yue .style .install = function ( d ) {
	d = ( d == undefined ? $ ( "body" ) : $ ( d ) )
	d .find ( `[ui_style]` ) .attr ( `ui_style` , yue .style .data [ yue .style .len ] )
	if ( d .attr ( "ui_style" ) !== null ) {
		d .attr ( "ui_style" , yue .style .data [ yue .style .len ] )
	}
	if ( d .attr ( "ui_window" ) !== null ) {
		d .attr ( "ui_window" , yue .window )
	}
	d .find ( `[ui_window]` ) .attr ( `ui_window` , yue .window )
	return yue .style
}
yue .style .conf = function ( ary ) {
	yue .style .data = ary
	yue .style .len = 0
	yue .style .length = yue .style .data .length
	return yue .style
}
yue .style .len = 0
//alert(1)
yue .style .set = yue .style .switch = function ( name ) {
	if ( yue .style .data .indexOf ( name ) !== -1 ) {
		yue .style .len = yue .style .data .indexOf ( name )
		yue .style .load ( )
	}
	return yue .style
}
//alert(1) 
yue .style .next = function ( ) {
	yue .style .len += 1
	if ( yue .style .len > yue .style .data .length -1 ) {
		yue .style .len = 0
	}
	yue .style .load ( )
	return yue .style
}
//alert(1)
//yue.alert("嗯",128)
//Run
yue .wave = { }
yue .wave .install = function ( conf ) {
	let Css = {
		backgroundColor: "rgba(0,0,0,0.4)"
	}
	let time = 618
	let dom = "[ui_wave]"
	if ( conf instanceof jQuery ) {
		dom = conf
	} else
	if ( conf ) {
		if ( conf .time < 666666 && time > 0 ) {
			time = Number ( conf .time )
		}
		if ( conf .css ) {
			for ( let i in conf .css ) {
				Css [ i ] = conf .css [ i ]
			}
		}
		if ( conf .dom ) {
			dom = conf .dom
		}
	}
	$ ( dom ) .get ( ) .forEach ( s => {
		s = $ ( s )
		if ( s .attr ( "yue_wave_install" ) ) {
			return
		}
		let w = s .outerWidth ( )
		let h = s .outerHeight ( )
		s .css ( {
			"position": "relative",
			"overflow": "hidden"
		} )
		s .attr ( "yue_wave_install" , "true" )
		let state = "close"
		let max = Math .sqrt ( w * w + h * h * 0.618 ) * 0.618
		let off = s .offset ( )
		let dom
		,l
		,t
		let start = function ( f ) {
			if ( state == "close" ) {
				state = "open"
				dom = $ ( "<div></div>" )
				dom .css ( Css )
				let x = f .pageX
				let y = f .pageY
				s .append ( dom )
				l = x - off .left
				t = y - off .top
				dom .css ( {
					opacity: 1,
					width: 0,
					height: 0,
					left: l,
					top: t,
					position: "absolute",
					borderRadius: "300px"
				} )
				s .append ( dom )
			}
		}
		let end = function ( f ) {
			if ( state == "open" ) {
				state = "wait"
				dom .css ( {
					transitionDuration: ( time / 1000 ) + "s",
				} )
				dom .css ( {
					left: l - max / 2,
					top: t - max / 2,
					height: max,
					width: max,
					opacity: 0
				} )
				setTimeout ( function ( ) {
					dom .remove ( )
					state = "close"
					dom = undefined
				}, time )
			}
		}
		let move = function ( f ) {
			if ( state !== "open" ) {
				return
			}
			let x = f .pageX
			let y = f .pageY
			let s = false
			if ( x < off .left + w / 8 ) {
				s = true
				x = off .left
			}
			if ( y < off .top + h / 8 ) {
				s = true
				y = off .top
			}
			if ( x > off .left + w * 7 / 8 ) {
				s = true
				x = off .left + w
			}
			if ( y > off .top + h * 7 / 8 ) {
				s = true
				y = off .top + h
			}
			l = x - off .left
			t = y - off .top
			dom .css ( {
				left: l,
				top: t
			} )
			if ( s ) {
				end ( { pageX: x, pageY: y } )
			}
		}
		s .bind ( "touchstart" , function ( f ) {
			start ( f .changedTouches [ 0 ] )
		} )
		s .bind ( "touchend" , function ( f ) {
			end ( f .changedTouches [ 0 ] )
		} )
		s .bind ( "touchmove", function ( f ) {
			move ( f .changedTouches [ 0 ] )
		} )
	} )
}



//TIME对象
yue .time = function ( data ) {
	let time
	if ( data == undefined ) {
		time = new Date ( )
	} else {
		if ( data .__proto__ .yue_type == "yue_time" ) {
			time = data
		} else {
			time = new Date ( data )
			if ( time .getDay ( ) == NaN ) {
				time = new Date
			}
		}
	}
	time .__proto__ .yue_type = "yue_time"
	time = [
		time .getYear ( ) + 1900,
		time .getMonth ( ) + 1,
		time .getDate ( ),
		time .getHours ( ),
		time .getMinutes ( ),
		time .getSeconds ( )
	]
	time .merge = function ( opt ) {
		if ( typeof opt === "string" ) {
			opt = opt .split ( "" )
		} else if ( ! ( Array .isArray ( opt ) ) ) {
			return "option Must is a Array or String"
		}
		let R = [ ]
		let ind = -1
		for ( let i in time ) {
			ind ++
			if ( opt [ ind ] !== undefined ) {
				R .push ( time [ ind ] + opt [ ind ] )
			} else {
				break
			}
		}
		return R .join ( "" )
	}
	
	return yue .pipe ( 
		yue .pipe .execdata ( { data: time } ),
		time
	)
}

yue .pc = function ( call ) {
	if ( yue .window == "pc" ) {
		call ( )
	}
}
yue .pe = function ( call ) {
	if ( yue .window == "pe" ) {
		call ( )
	}
}
//code PIPE 核心代码写最后🐴
yue .pipe = function ( ) {
	let ret = { }
	let AEG = arguments
	//上一个Layer的配置
	let last = { }
	let gob = { }
	let now = { }
	last .islast = false
	gob .data = { }
	gob .id = { }
	gob .tree = { }
	//*********
	//* +gob.tree
	//*  +yieldnode -Layer ary
	//*   +endFuncLib
	//*  +autonode
	//*   +childnode
	//*  +
	//* +
	//*********
	//AUTOCLASS
	let yields = function ( fx ) {
		if ( now .yield == true ) {
			//alert(true)
			return function ( ) {
				alert(false)
				last .data .func .push ( fx )
				alert(true)
				return ret
			}
		}
		return fx
	}
	arguments .length ++
	arguments [ arguments .length ] = ( {
		root: yue .pipe .root ( {} ),
		back: yue .pipe .back ( {} ),
		into: yue .pipe .into ( {} ),
		setid: yue .pipe .setid ( {} ),
		getid: yue .pipe .getid ( {} ),
		return: yue .pipe .return ( function ( fx ) {
			return fx ( )
		} ),
		exec: yue .pipe .exec ( {} ),
		removeid: yue .pipe .removeid ( {} ),
		yield: yue .pipe .yield ( function ( arg , next ) {
			arg [ 0 ] ( next )
		} )
	} )
	try {
	let islast = false
	let isgob = false
	for ( let i in arguments ) {
		let obj = arguments [ i ]
		if ( obj ._type_ == "yue_pipe_last_data" ) {
			if ( islast ) {
				throw Error ( "typeError: The previous node has already been defined." )
			}
			obj ._tested_ = true
			islast = true
			//rep
			last .data = obj .data
			last .type = true
			last .ret = obj .ret
			//alert("into:"+last.ret.local)
		} else
		if ( obj ._type_ == "gob" ) {
			if ( isgob ) {
				throw Error ( "typeError: Global has already been defined." )
			}
			obj ._tested_ = true
			isgob = true
			gob = obj .data
		} else
		if ( obj ._type_ == "yue_pipe_execdata" ) {
			obj ._tested_ = true
			now .exec_data = obj .data
		} else
		if ( obj ._type_ == "yue_pipe_yield_exec" ) {
			last .data = obj .data
			//alert("user")
			obj ._tested_ == true
			now .yield = true
		}
	}
	for ( let i in arguments ) {
		if ( arguments [ i ] ._tested_ ) {
			continue
		}
		for ( let j in arguments [ i ] ) {
			let obj = arguments [ i ] [ j ]
			if ( obj == undefined ) {
				continue
			} 
			//alert(obj._type_)
			// -HOLONS Breadth 平面的
			if ( /*obj .__proto__ .yue_holons == "breadth" */ true ) {
				//Classification : eval , func , getID
				if ( obj ._type_ == "yue_pipe_return" ) {
					if ( ! ( typeof obj === "function" ) ) {
						yue .log ( obj )
						throw Error ( "typeError: a return node must be a function." )
					}
					ret [ j ] = yields ( function ( call ) {
						return obj .apply ( null , arguments )
					} )
				} else
				if ( obj ._type_ == "yue_pipe_exec" ) {
					ret [ j ] = yields ( function ( fx ) {
						fx ( now .exec_data )
					} )
				}
			}
			// -HOLONS Erect 深度的
			if ( /*obj .__proto__ .yue_holons == "depth"*/ true ) {
				//返回数据
				if ( obj ._type_ == "yue_pipe_back" ) {
					ret [ j ] = yields ( function ( ) {
						let s = true
						if ( ! last .data ) {
							s = false
						}
						if ( ! last .ret ) {
							s = false
						}
						if ( s == false ) {
							return null
						}
						let p = [ ]
						for ( let i in last .ret ) {
							p .push ( i )
						}
						//alert("back:"+p)
						return last .ret
					} )
				} else
				//getid setid
				if ( obj ._type_ == "yue_pipe_getid" ) {
					ret [ j ] = yields ( function ( name ) {
					//	alert(name)
						if ( gob .id [ name ] ) {
							return gob .id [ name ]
						} else {
							return null
						}
					} )
				} else
				//set
				if ( obj ._type_ == "yue_pipe_setid" ) {
			//		alert("ids"+obj)
					ret [ j ] = yields ( function ( name ) {
				//		alert("set"+name)
						gob .id [ name ] = ret
						return ret
					} )
				} else
				//删除
				if ( obj ._type_ == "yue_pipe_removeid" ) {
					ret [ j ] = yields ( function ( ) {
						delete gob .id [ name ]
						return ret
					} )
				} else
				//enter Layer
				if ( obj ._type_ == "yue_pipe_into" ) {
					//alert("into")
					//alert(last.yield)
					ret [ j ] = yields ( function ( json ) {
						return yue .pipe ( 
							obj ( json ),
							{
								_type_: "yue_pipe_last_data",
								ret,
								data: last 
							}
						)
					} )
				}
			}
			// -HOLONS holons 整体的
			if ( /*obj .__proto__ .yue_holons == "holons"*/ true ) {
				// -coroutine 语法树伪协程
			/*	if ( obj ._type_ == "yue_pipe_yield" ) {
					// -switch 必须是一个Function
					if ( ! ( typeof obj === "function" ) ) {
						yue .log ( obj )
						throw Error ( "typeError: a Coroutine node must be a function." )
					}
					//alert("yjde")
					ret [ j ] = yields ( function ( ) {
						last .func = [ ]
						obj ( {
							arg: arguments,
							next: function ( ) {
								if ( last .func ) {
									last .func .forEach ( s => {
										alert("uuu")
										s (  )
									} )
								}
							}
						} )
						//alert("f")
						return yue .pipe (
							{
								_type_: "yue_pipe_yield_exec",
								data: last
							},
							...arguments
						)
					} )
				}
				else 
				*/
				if ( obj ._type_ == "yue_pipe_root" ) {
					//替换整个对象
					ret [ j ] = yields ( function ( ) {
						return yue .pipe ( yue )
					} )
				}
			}
			if ( ret [ j ] == undefined ) {
				if ( typeof obj === "function" ) {
					ret [ j ] = function ( arg ) {
						obj .apply ( null, arguments )
						return ret
					}
				} else {
					ret [ j ] = obj
				}
			}
		}
	}
	ret ._SAVE_NODE_ = yue .pipe .last ( ret )
	
	return ret
	} catch ( e ) {
		return yue .log .error ( "pipe" , e .stack )
	}
}

//make a pipe_break
yue .pipe .maker = function ( ) {
	let d = {
		root: "yue_pipe_root",
		back: "yue_pipe_back",
		into: "yue_pipe_into",
		setid: "yue_pipe_setid",
		getid: "yue_pipe_getid",
		return: "yue_pipe_return",
		removeid: "yue_pipe_removeid",
		last: "yue_pipe_last",
		exec: "yue_pipe_exec",
		execdata: "yue_pipe_execdata",
		yield: "yue_pipe_yield"
	}
	for ( let i in d ) {
		yue .pipe [ i ] = function ( obj ) {
			if ( obj ) {
				obj ._type_ = [ d [ i ] ]
			}
			return obj
		}
	}
}
//404
yue [ "404" ] = `<img src="https://iconfont.alicdn.com/t/12362e43-a0f2-4f3a-a4da-26a89e720e85.png" style="width:100%" @iconfont/><br/><div style="text-align:center;font-size:25px;color:rgba(36,142,73)" onclick="location.href='index.html'">页面丢失了?返回首页</div>`

yue .set404 = function ( str ) {
	yue [ "404" ] = str
}

yue .pipe .maker ( )
/*
try {
alert(yue.pipe({
	a: function ( s ) {
	}
}).setid("3").getid("3").into({
	b: function (s){
		alert(s)
	},
	s: yue .pipe .yield ( function ( arg ) {
		setTimeout(function (){
			alert(arg+"K")
		},3000)
	} )
})
.s(1)
//.b(2)
.into({
	c: 3
}).c()
)
}catch(e){
	alert(e)
}
*/
//不建议使用yield未修玩有bug

//USER 数据绑定
yue .user = { }

yue .user .seturl = function ( fx ) {
	yue .user .url = fx
}

yue .user .local = function ( ) {
	return
}
yue .datalib = { }
yue .setdata = function ( name , data ) {
	yue .datalib [ name ] = data
}
yue .getdata = function ( name ) {
	return yue .datalib [ name ]
}
//event exec
yue .event = function ( ary ) {
	if ( ! Array .isArray ( ary ) ) {
		ary = [ ary ]
	}
	let binds = false
	let time = 0
	let T = function ( fx ) {
		setTimeout ( function ( ) {
			try {
				fx ( )
			} catch ( e ) {
				yue .log ( e .stack )
			}
		} , time )
	}
	//alert("y,"+JSON.stringify(ary))
	ary .forEach ( s => {
		//attr
		//alert(JSON.stringify(s))
		if ( s .type == "attr" ) {
			T ( function ( ) {
				$ ( s .jq ) .attr ( s .name , s .data )
			} )
		} else
		//text
		if ( s .type == "text" ) {
			T ( function ( ) {
				$ ( s .jq ) .text ( s .data )
			} )
		} else
		//html
		if ( s .type == "html" ) {
			T ( function ( ) {
				$ ( s .jq ) .html ( s .data )
			} )
		} else
		if ( s .type == "css" ) {
			T ( function ( ) {
				$ ( s .jq ) .css ( s .data )
			} )
		} else
		//load
		if ( s .type == "load" ) {
			T ( function ( ) {
				yue .load ( s .name , s .url )
			} )
		} else
		//def
		if ( s .type == "local" ) {
			T ( function ( ) {
				yue .setlocal ( s .name , s .data )
			} )
		} else
		//r
		if ( s .type == "remove" ) {
			T ( function ( ) {
				$ ( s .jq ) .remove ( )
			} )
		} else
		if ( s .type == "eval" ) {
			T ( function ( ) {
				eval ( s .data )
			} )
		} else
		if ( s .type == "sleep" ) {
			time += ( s .time < 9999999 && s .time > 0 ? Number ( s .time ) : 0 )
		} else
		if ( s .type == "alert" ) {
			T ( function ( ) {
				yue .alert ( s .data , s .time )
			} )
		} else
		if ( s .type == "binddata" ) {
			binds = true
			//alert(JSON.stringify(s))
			for ( let j in s .data ) {
				yue .bind .lib [ j ] = s .data [ j ]
			}
		} else
		if ( s .type == "unbind" ) {
			//clear bind name
			if ( ! s .name ) {
				$ ( s .jq ) .unbind ( )
			} else {
				$ ( s .jq ) .unbind ( s .name )
			}
		} else
		if ( s .type == "clickload" ) {
			$ ( s .jq ) .click ( function ( ) {
				yue .load ( s .name , s .url )
			} )
		} else
		//emit
		if ( s .type == "emit" ) {
			T ( function ( ) {
				yue .event .emit ( s .name , s .data )
			} )
		}
	} )
	if ( binds ) {
		yue .bind ( )
	}
}
yue .bind .lib = { }
yue .rely = function ( data ) {
	//start bind
	if ( data .type == "bind" ) {
		let time = false
		$ ( data .jq ) .get ( ) .forEach ( s => {
		s = $ ( s )
		if ( s .attr ( "bind_rely_install" ) ) {
			return
		}
		s .attr ( "bind_rely_install" , true )
		s [ data .on ] ( function ( ) {
			if ( time ) {
				return
			}
			time = true
			setTimeout ( function ( ) {
				time = false
			}, 500 )
			try {
			//arg
			let d = { }
			for ( let i in data .arg ) {
				let D = data .arg [ i ]
				//alert(yue.obj(data.arg[i].bindname).get("bindlib"))
				if ( D .type == "bind-event" ) {
					d [ data .arg [ i ] .bindname ] = yue .obj ( data .arg [ i ] .bindname ) .get ( "bindlib" ) [ D .name ] ( s )
				} else {
					d [ data .arg [ i ] .bindname ] = $ ( data .arg [ i ] .jq ) [ data .arg [ i ] .type ] ( )
				}
				/*
				let p = [ ]
				for(let i in d.index) {
					p .push(i)
				}
				alert(p)
				*/
			}
			//def
			if ( data .def ) {
				yue .event ( data .def )
			}
			//Sender
			if ( data .isget || data .ispost ) yue .get ( {
				type: "event",
				yue_req: "true",
				data: JSON .stringify (
					[
						{
							t: data .onname,
							n: data .name,
							d
						}
					]
				)
			} )
			.true ( function ( rely ) {
				yue .event ( rely )
			} )
			} catch(e) {
				yue.log(e.stack)
			}
		} )
		} )
	}
}

//Github.com/yamstrip/yuejs