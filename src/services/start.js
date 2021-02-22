//Open an instance of yue
exports .main = function ( yc , exp ) {
	let urls = require ( "url" )
	exp .log = function ( str , ap ) {
		let V = [ ]
		for ( let i in arguments ) {
			V .push ( arguments [ i ] )
		}
		if ( exp .conf .print ) {
			yc .c ( "yue_log" , V .join ( " " ) )
		}
	}
	exp .errlog = function ( str ) {
		let V = [ ]
		for ( let i in arguments ) {
			V .push ( arguments [ i ] )
		}
		if ( exp .conf .print ) {
			yc .c ( "yue_log_error" , V .join ( " " ) )
		}
	}
	exp .task = function ( obj ) {
		let jq = obj .jq
		let type = obj .type
		//do action
		let act = Array .isArray ( obj .act ) ? obj .act : [ ]
		let onname = obj .onname
		let gets = Array .isArray ( obj .gets ) ? obj .gets : [ ]
		let post = Array .isArray ( obj .post ) ? obj .post : [ ]
		let on = obj .on
		let arg = obj .arg
		let isget = false
		let ispost = false
		let def = Array .isArray ( obj .def ) ? obj .def : [ ]
		//Identification 
		let addget = function ( data ) {
			if ( data .listen ) {
				V .isget = true
				gets .push ( data )
			} else 
			if ( data .def ) {
				def .push ( data )
			} else {
				V .isget = true
				act .push ( data )
			}
		}
		let addpost = function ( data ) {
			if ( data .listen ) {
				V .ispost = true
				post .push ( data )
			} else
			if ( data .def ) {
				def .push ( data )
			} else
			{
				V .ispost = true
				act .push ( data )
			}
		}
		let Obj = {
			//text info
			text: function ( data ) {
				addget ( {
					type: "text",
					jq,
					data,
					req: "get"
				} )
				return obj
			},
			def_text: function ( data ) {
				addget ( {
					type: "text",
					jq,
					data,
					req: "get",
					def: true
				} )
				return obj
			},
			html: function ( data ) {
				addget ( {
					type: "html",
					jq,
					data,
					req: "get"
				} )
				return obj
			},
			def_html: function ( data ) {
				addget ( {
					type: "html",
					jq,
					data,
					req: "get",
					def: true
				} )
				return obj
			},
			attr: function ( data ) {
				addget ( {
					type: "attr",
					jq,
					data,
					name,
					req: "get"
				} )
				return obj
			},
			def_attr: function ( data ) {
				addget ( {
					type: "attr",
					jq,
					data,
					name,
					req: "get",
					def: true
				} )
				return obj
			},
			def_remove: function ( ) {
				addget ( {
					type: "remove",
					jq,
					req: "get",
					def: true
				} )
				return obj
			},
			//点击load
			unbind: function ( name ) {
				addget ( {
					type: "unbind",
					jq,
					name,
					req: "get"
				} )
				return obj
			},
			def_unbind: function ( name ) {
				addget ( {
					type: "unbind",
					jq,
					name,
					req: "get",
					def: true
				} )
				return obj
			},
			//clickLoad
			clickload: function ( name , url ) {
				addget ( {
					type: "clickload",
					jq,
					name,
					url,
					req: "get"
				} )
			},
			//clickLoad
			def_clickload: function ( name , url ) {
				addget ( {
					type: "clickload",
					jq,
					name,
					url,
					req: "get",
					def: true
				} )
			},
			remove: function ( ) {
				addget ( {
					type: "remove",
					jq,
					req: "get"
				} )
				return obj
			},
			load: function ( name, url ) {
				addget ( {
					type: "load",
					name,
					url,
					req: "get"
				} )
				return obj
			},
			local: function ( name , data ) {
				addget ( {
					type: "local",
					name,
					data,
					req: "get"
				} )
				return obj
			},
			def_local: function ( name , data ) {
				addget ( {
					type: "local",
					name,
					data,
					def: true,
					req: "get"
				} )
				return obj
			},
			def_load: function ( name, url ) {
				addget ( {
					type: "load",
					name,
					url,
					def: true,
					req: "get"
				} )
				return obj
			},
			eval: function ( data ) {
				addget ( {
					type: "eval",
					data,
					req: "get"
				} )
				return obj
			},
			def_eval: function ( data ) {
				addget ( {
					type: "eval",
					data,
					def: true,
					req: "get"
				} )
				return obj
			},
			sleep: function ( data ) {
				addget ( {
					type: "sleep",
					data,
					req: "get"
				} )
				return obj
			},
			def_sleep: function ( data ) {
				addget ( {
					type: "sleep",
					data,
					def: true,
					req: "get"
				} )
				return obj
			},
			alert: function ( data ) {
				addget ( {
					type: "alert",
					data,
					req: "get"
				} )
				return obj
			},
			def_alert: function ( data ) {
				addget ( {
					type: "alert",
					data,
					def: true,
					req: "get"
				} )
				return obj
			},
			binddata: function ( data ) {
				addget ( {
					type: "binddata",
					req: "get",
					data
				} )
			},
			def_binddata: function ( data ) {
				addget ( {
					type: "binddata",
					req: "get",
					data,
					def: true
				} )
			},
			action: function ( data ) {
				if ( ! data .req ) {
					data .req = "get"
				}
				addget ( data )
				return obj
			},
			def_action: function ( data ) {
				if ( ! data .req ) {
					data .req = "get"
				}
				data .def = true
				addget ( data )
				return obj
			},
			//get url
			onget: function ( data ) {
				addget ( {
					type: "on-get",
					req: "get",
					emit: data,
					listen: true,
				} )
			},
			res: function ( data ) {
				addget ( {
					type: "on-get",
					req: "get",
					emit: data,
					listen: true
				} )
			},
			onpost: function ( data ) {
				addpost ( {
					type: "on-post",
					req: "post",
					emit: data,
					listen: true
				} )
			}
		}
		for ( let i in Obj ) {
			obj [ i ] = Obj [ i ]
		}
		let V = {
			method: obj,
			action: act,
			gets,
			onname,
			isget,
			ispost,
			post,
			def,
			arg,
			on
		}
		return V
	}
	exp .app = function ( ) {
		let obj = { }
		//new.app"
		obj .log = function ( str , ap ) {
			let V = [ ]
			for ( let i in arguments ) {
				V .push ( arguments [ i ] )
			}
			if ( exp .conf .print ) {
				yc .c ( "yue_log" , V .join ( " " ) )
			}
		}
		obj .errlog = function ( str ) {
			let V = [ ]
			for ( let i in arguments ) {
				V .push ( arguments [ i ] )
			}
			if ( exp .conf .print ) {
				yc .c ( "yue_log_error" , V .join ( " " ) )
			}
		}
		obj .conf = exp .conf
		obj .name = Math .random ( )
		//Define a dependent logical process 
		obj .rely = [ ]
		obj .data = { }
		obj .reqs = [ ]
		//Performs an operation through a binding. 
		obj .bind = function ( name ) {
			//return a yue node Instance 
			if ( ! obj .data [ name ] ) {
				obj .data [ name ] = exp .ins ( {
					type: "bind",
					name,
					jq: "[yue-bind=" + name + "]"
				} )
			}
			return obj .data [ name ]
		}
		//req apps..
		obj .reqid = 0
		obj .req = function ( name ) {
			obj .reqid ++
			obj .reqs .push ( name )
			obj .reqs [ obj .reqs .length -1 ]
		}
		//Ask for a request 
		obj .rec = function ( req , res ) {
			let data = urls .parse ( req .url , true ) .query
			let OBJ = { }
			OBJ .req = req
			OBJ .res = res
			OBJ .write = function ( d ) {
				OBJ .res .write ( d )
			}
			OBJ .end = function ( ) {
				OBJ .tasklen = OBJ .task .length
				NEXT ( )
			}
			OBJ .head = function ( status , conf ) {
				if ( ! status ) {
					status = 200
				}
				let C = {
					"Content-Type": 'text/plain',
					'charset': 'utf-8',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS'
				}
				if ( conf == true ) {
					C = undefined
				} else
				if ( conf ) {
					C = conf
				}
				if ( C ) {
					res .writeHead ( status , C )
				} else {
					res .writeHead ( status )
				}
			}
			OBJ .endjson = function ( data ) {
				OBJ .head ( )
				res .write ( JSON .stringify ( data ) )
				res .end ( )
			}
			let ACT = [ ]
			OBJ .task = obj .reqs
			let post = [ ]
			//type
			OBJ .ip = (
				req .headers ['x-wq-realip'] 
				|| req .connection .remoteAddress
				|| req .socket .remoteAddress
				|| req .connection .socket .remoteAddress
			) .substr ( 7 )
			if ( obj .iprep ) {
				OBJ .ip = obj .iprep ( OBJ , data )
			}
			//reqs .the Max
			let yue_test = function ( Obj, Data, Next ) {
				//console.log(Data)
				try {
					let DATA = JSON .parse ( Data .data )
					if ( ! Array .isArray ( DATA ) ) {
						DATA = [ DATA ]
					}
					Obj .head ( )
					//console.log(DATA)
					//for
					//D
					//console.log(DATA)
					let use = 0
					for ( let i in DATA ) {
						let F = DATA [ i ] .d
						let D = obj .data [ DATA [ i ] .n ]
						if ( D ) {
							let E = D .action [ DATA [ i ] .t ]
							if ( E ) {
								//console.log(E,D)
								//console.log(E)
								use ++
								let act = [ ]
								Obj .yue = function ( obj ) {
									return exp .task ( {
										jq: "[yue-bind=" + obj + "]",
										act,
									} ) .method
								}
								Obj .obj = Obj .yue ( D .name )
								let step = -1
								let alltask = 0
								//let USELIB = { }
								//let USEID = 0
								let NEXT1 = function ( /*id*/ ) {
									step ++
									if ( step >= alltask ) {
										//end
										Obj .res .write ( JSON .stringify ( {
											type: true,
											data: act
										} ) )
										Obj .end ( )
									}
								}
								for ( let j in E .act ) {
									act .push ( E .act [ j ] )
								}
								let arg = [ Obj ]
								for ( let j in E .arg ) {
									arg .push ( F [ E .arg [ j ] .bindname ] )
								}
								arg .push ( NEXT1 )
								//p
								if ( E .isget ) {
									E .gets .forEach ( s => {
										alltask ++
										s .emit .apply ( null , arg )
									} )
								}
								//s
								if ( E .ispost ) {
									//++auto
									alltask ++
									let buf = [ ]
									Obj .req .on ( "data" , function ( d ) {
										buf .push ( d )
									} )
									Obj .req .on ( "error" , function ( d ) {
										exp .errlog ( "yue_req" , "Request Error" , OBJ .ip , JSON.stringify(data) )
									} )
									Obj .req .on ( "end" , function ( d ) {
										buf = Buffer .concat ( buf )
										//--auto
										step ++
										E .post .forEach ( s => {
											alltask ++
											s .emit ( Obj , buf , NEXT1 )
										} )
									} )
								}
								//action
								NEXT1 ( )
							} else {
								Next ( )
							}
						}
					}
					if ( use == 0 ) {
						Next ( )
					}
				} catch ( e ) {
					exp .errlog ( "Error Request" , Obj .ip , e .stack )
					Next ( )
				}
			}
			OBJ .tasklen = -1
			if ( data .yue_req == "true" ) {
				OBJ .task .push ( yue_test )
			}
			//apps
			let NEXT = function ( ) {
				if ( ! OBJ ) {
					return
				}
				OBJ .tasklen ++
				if ( OBJ .tasklen >= OBJ .task .length) {
					OBJ .res .end ( )
					//console.log("end")
					exp .log ( "Request" , OBJ .ip , JSON .stringify ( data ) )
				} else {
					OBJ .task [ OBJ .tasklen ] ( OBJ, data, NEXT )
				}
			}
			NEXT ( )
		}
		//Ip/ forward proxy reverse / proxy Replace 
		obj .ip = function ( fx ) {
			obj .iprep = fx
		}
		obj .parse = function ( src ) {
			exp .parse ( src , obj .name )
		}
		obj .build = function ( src , esrc ) {
			exp .build ( src , obj .name , esrc , obj )
		}
		return obj
	}
	exp .ins = function ( conf ) {
		let obj = { }
		if ( ! conf .jq ) {
			throw Error ( "Selector is not valid. " )
		}
		if ( ! conf .type ) {
			throw Error ( "Invalid Type " )
		}
		obj .name = conf .name
		obj .action = { }
		obj .type = conf .type
		obj .jq = conf .jq
		obj .value = {
			type: "val",
			jq: obj .jq,
			bindname: obj .name
		}
		obj .text = {
			type: "text",
			jq: obj .jq,
			name: obj .name,
			bindname: obj .name
		}
		obj .bind = function ( name ) {
			return {
				type: "bind-event",
				jq: obj .jq,
				name,
				bindname: obj .name
			}
		}
		obj .html = {
			type: "html",
			jq: obj .jq,
			name: obj .name,
			bindname: obj .name
		}
		obj .css = {
			type: "css",
			jq: obj .jq,
			name: obj .name,
			bindname: obj .name
		}
		//click event package
		obj .onclick = function ( jq ) {
			if ( ! jq ) jq = obj .jq
			if ( ! obj .action .onclick ) {
				obj .action .onclick = exp .task ( {
					jq,
					arg: exp .arg ( arguments ),
					on: "click",
					onname: "onclick"
				} )
			}
			return obj .action .onclick .method
		}
		return obj
	}
	exp .arg = function ( arg ) {
		let s = [ ]
		for ( let i in arg ) {
			s .push ( arg [ i ] )
		}
		return s
	}
}
/*
[def] app ( )
 - event Selectors => Instance 
 - build ( Instance Dependency injection )
 - Server ( ite event, ite Instance )
 - yue
*/