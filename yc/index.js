"use strict";
( function ( yc ) {
	//对象装到yc
	yc .objyc = function ( name , obj ) {
		if ( ! obj ) {
			obj = name
			name = yc
		}
		for ( let i in obj ) {
			if ( ! name [ i ] ) {
				name [ i ] = obj [ i ]
			}
		}
	}
	//变量组
	yc .onlib = { }
	
	
	//颜色
	yc .objyc ( require ( './lib/base/color.js' ) )
	yc .html = { }
	yc .objyc ( yc .html, require ( './lib/base/html.js' ) )
	yc .cache = { }
	//缓存
	yc .objyc ( yc .cache , require ( './lib/base/cache.js' ) )
	//FILE
	yc .objyc ( require ( './lib/base/fs.js' ) )
	//TIME
	yc .objyc ( require ( './lib/base/time.js' ) )
	//MATH
	yc .math = { }
	yc .objyc ( yc .math ,require ( './lib/base/math.js' ) )
	//yc .c ( 's' , yc .time ( ) .join ( '-' ) )
	
	
	//全局资源
	yc .data = { }
	yc .setdata = yc .set = function ( d , v ) {
		yc .data [ d ] = v
	}
	yc .getdata = yc .get = function ( d ) {
		return yc .data [ d ]
	}
	yc .deletedata = yc .removedata = yc .delete = 	function ( d ) {
		delete yc .data [ d ]
	}
	
	
	
	//TIME
	yc .strtimeS = Date .now ( )
	yc .strtime = new Date
	
	
	
	
	
	//管道对象	
	yc .call = function ( f ) {
		let obj = { }
		obj .time = Date .now ( )
		obj .ret = { }
		obj .name = ''
		f ( {
			setname: function ( d ) {
				obj .name = d
			},
			ret: function ( name , f ) {
				obj .ret [ name ] = function ( s ) {
					return f ( s )
				}
			},
			retcall: function ( name , fs ) {
				if ( obj .ret [ name ] ) {
					return obj .ret [ name ] ( fs )
				}
			},
			call: yc .call,
			set: function ( d , v ) {
				obj .ret [ d ] = v
			}
		} )
		obj .ret .c = function ( ) {
			yc .c ( 'c' , obj .name + ' Loading takes  ' + ( Date .now ( ) - obj .time ) + 'ms' )
		}
		return obj .ret
	}
	
	
	
	//导入
	yc .jpl = { }
	yc .load = function ( dir , attrp ) {
		//CALL
		return yc .call ( function ( opt ) {
			try {
				//SET
				let su = [ ]
				let fi = [ ]
				let len = 0
				opt .setname ( 'Load > ' + dir + ' > 0 modules were imported ' )
				let dirdata = yc .dirtree ( dir )
				for ( let i in dirdata .data ) {
					if ( dirdata .data [ i ] .type == 'file' ) {
						if ( yc .loaddet ( dirdata .data [ i ] .path , false , attrp ) .state ) {
							len += 1
							su .push ( dirdata .data [ i ] .path )
						} else {
							fi .push ( dirdata .data [ i ] .path )
						}
					}
				}
				opt .set ( 'su' , su  )
				opt .set ( 'fi' , fi )
				opt .setname ( 'Load > ' + dir + ' > ' + len + ' modules were imported ' )
			} catch ( e ) {
				yc .c ( 'e' , 'Load failed > ' + dir )
				console .log ( e )
			}
		} )
	}
	//单独导入
	yc .loaddet = function ( path , ifs , attrp ) {
		return yc .call ( function ( opt ) {
			try {
				let r = ifs ? path : require ( path )
				//分类
				if ( ! r .name ) {
					//没有Name情况下，作为一个空类，并直接执行main
					if ( r .main ) {
						let attr = r .main .toString ( ) .match ( /function\s.*?\(([^)]*)\)/ ) [ 1 ] .replace ( /\s+/g, '' ) .split ( ',' )
						let and = Math .random ( )
						yc .jpl [ and ] = r .main
						yc .jpl [ and ] .attr = attr
						let d = yc .execute ( and , attrp )
						for ( let i in d ) {
							opt .ret ( i , d [ i ] )
						}
					}
				} else
				//有name情况下
				if ( r .name ) {
					//保存一个yc全局资源
					if ( r .save ) {
						yc .data [ r .name ] = r .save
					}
					//保存一个库
					if ( r .main ) {
						let attr = r .main .toString ( ) .match ( /function\s.*?\(([^)]*)\)/ ) [ 1 ] .replace ( /\s+/g, '' ) .split ( ',' )
						yc .jpl [ r .name ] = r .main
						yc .jpl [ r .name ] .attr = attr
					}
				}
				opt .ret ( 'state' , true )
			} catch ( e ) {
				yc .c ( 'e' , 'Load failed > ' + path )
				console .log ( e )
			}
		} )
	}
	
	//深copy
	
	
	
	yc .copy = function ( target ) { 
		let copyed_objs = [  ]
		//此数组解决了循环引用和相同引用的问题，它存放已经递归到的目标对象 
		function _deepCopy(target){ 
			if ( ( typeof target !== 'object' ) || ! target ) { 
				return target;
			}
			for ( let i = 0 ; i < copyed_objs .length; i++ ) {
				if ( copyed_objs [ i ] .target === target ) {
					return copyed_objs [ i ] .copyTarget;
				}
			}
			let obj = { };
			if ( Array .isArray ( target ) ) {
				obj = [ ];//处理target是数组的情况 
			}
			copyed_objs .push ( {
				target: target,
				copyTarget: obj
			} ) 
			Object .keys ( target ) .forEach ( key => {
				if ( obj [ key ] ) {
					return
				} 
				obj [ key ] = _deepCopy ( target [ key ] )
			} ); 
			return obj;
		} 
		return _deepCopy ( target );
	}
	
	
	//执行一个模块
	//ATTR: { name: vale } , name 与 	模块函数名称的name一模一样
	yc .execute = yc .open = yc .do = function ( name , attr ) {
		if ( ! typeof attr === 'object' ) {
			attr = { }
		}
		return yc .call ( function ( opt ) {
			opt .setname ( 'execute successful > ' + name )
			if ( yc .jpl [ name ] ) {
				let p = [ ]
				//迭代
				for ( let i in yc .jpl [ name ] .attr ) {
					//参数自动修正
					let d = yc .jpl [ name ] .attr [ i ]
					if ( d == 'yc' || d == 'main' ) {
						p .push ( yc )
					} else 
					//监听
					if ( d == 'on' ) {
						p .push ( function ( names , d ) {
							return yc .on ( yc .jpl [ name ] , names , d )
						} )
					} else
					//传递
					if ( d == 'emit' ) {
						p .push ( function ( names , d ) {
							return yc .emit ( yc .jpl [ name ] , names , d )
						} )
					} else
					//摧毁
					if ( d == 'destroy' ) {
						p .push ( function ( ) {
							delete yc .jpl [ name ]
						} )
					} else
					//RETCALL
					if ( d == 'retcall' ) {
						p .push ( opt .retcall )
					} else 
					//返回参数
					if ( d == 'ret' || d == 'call' ) {
						p .push ( opt .ret )
					} else 
					/*
					if ( d == 'mod' || d == 'm' ) {
						p .push ( function ( name ) {
							
						} )
					}
					*/
					{
						p .push ( attr [ d ] )
					}
				}
				//apply
				try {
					yc .jpl [ name ] .apply ( null , p )
				} catch ( e ) {
					opt .setname ( 'execute ' + name + ' Error \n ' + e + '\n' + e .stack )
					yc .c ( 'e' , 'execute ' + name )
					console .log ( e )
				}
			} else {
				throw 'Can\'ot find module > ' + name 
			}
		} )
	}
	
	
	
	//LOAD模块
	yc .require = function ( d ) {
		return yc .call ( function ( ops ) {
			return yc .loaddet ( d , true )
		} )
	}
	
	
	
	//ON
	yc .on = function ( obj , name , f ) {
		if ( ! obj .onlib ) {
			obj .onlib = {
				
			}
		}
		obj .onlib [ name ] = f
		return yc .call ( function ( opt ) {
			opt .ret ( 'remove' , function ( name ) {
				delete obj .onlib [ name ]
			} ) 
			opt .ret ( 'emit' , function ( d ) {
				f ( d )
			} )
		} )
	}
	yc .emit = function ( obj , name , c ) {
		if ( ! obj .onlib ) {
			obj .onlib = { }
		}
		if ( obj .onlib [ name ] ) {
			return obj .onlib [ name ] ( c )
		}
	}
	
	
	
	
	//控制台--
	yc .load ( __dirname + '/lib/func' )
	//三维
	
	
	
	//END
	
	//yc .c ( 's' , 'Main module loading completed , ' + ( Date .now ( ) - yc .strtimeS ) + 'ms Time consuming ' )
	
	//COLOR YC
	
	yc .setcolor ( 'et' , [
		{
			app: [ 'red' , 'bright' ],
			content: '['
		},
		{
			app: [ 'bright' , 'red-' ],
			content: function ( ) {
				return yc .time ( ) .join ( '-' )
			}
		},
		{
			app: [ 'red' , 'bright' ],
			content: ']['
		},
		[ 'bright' , 'red-' ],
		{
			app: [ 'red' , 'bright' ],
			content: ']>'
		},
		[ 'bright', 'white-' ]
	] )
	module .exports = yc
} ) ( { } )