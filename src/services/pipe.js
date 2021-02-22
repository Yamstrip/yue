module .exports = function ( yc , exp ) {
exp .pipe = function ( ) {
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
		root: exp .pipe .root ( {} ),
		back: exp .pipe .back ( {} ),
		into: exp .pipe .into ( {} ),
		setid: exp .pipe .setid ( {} ),
		getid: exp .pipe .getid ( {} ),
		return: exp .pipe .return ( function ( fx ) {
			return fx ( )
		} ),
		exec: exp .pipe .exec ( {} ),
		removeid: exp .pipe .removeid ( {} ),
		yield: exp .pipe .yield ( function ( arg , next ) {
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
						exp .log ( obj )
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
						return exp .pipe ( 
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
						exp .log ( obj )
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
						return exp .pipe (
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
						return exp .pipe ( exp )
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
	ret ._SAVE_NODE_ = exp .pipe .last ( ret )
	
	return ret
	} catch ( e ) {
		return exp .log .error ( "pipe" , e .stack )
	}
}

//make a pipe_break
exp .pipe .maker = function ( ) {
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
		exp .pipe [ i ] = function ( obj ) {
			if ( obj ) {
				obj ._type_ = [ d [ i ] ]
			}
			return obj
		}
	}
}
exp .pipe .maker ( )
}