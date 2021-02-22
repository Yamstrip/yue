exports .main = function ( yc , exp ) {
	yc .shell .setcmd ( "yue-parse" , " [src] [name] Parsing a Web Table of Contents. " , function ( d ) {
		parse ( d [ 1 ] , d [ 2 ] )
	} )
	yc .shell .setcmd ( "yue-build" , " [src] [name] [goalsrc] Generate a Web Page " , function ( d ) {
		builder ( d [ 1 ] , d [ 2 ] , d [ 3 ] )
	} )
	//color
	yc .setcolor ( "web_c" , [
		{
			app: [ "cyan" , "bright" ],
			content: "[Yue_Builder]: "
		},
		[ "bright" ]
	] )
	yc .setcolor ( "web_s" , [
		{
			app: [ "magenta" , "bright" ],
			content: "[Yue_builder]: "
		},
		[ "bright" ]
	] )
	
	//cheerio
	let cheerio = require ( "cheerio" )
	/*let $ = cheerio .load ( "<a></a>" )
	let g = $ ( "a" )
	*/
	//obj
	let obj = { }
	//auto
	obj .data = { }
	//jb
	let jb = function ( dom , $, src , app ) {
		//start
		//app true
		if ( app ) {
			for ( let i in app .data ) {
				let D = app .data [ i ]
				if ( D .type == "bind" && dom .find ( D .jq ) .length ) {
					for ( let j in D .action ) {
						let F = D .action [ j ]
						//Inject
						dom .find ( "body:first" ) .append ( $ ( `<script>try{yue.rely(${JSON.stringify({
							jq: D .jq,
							type: "bind",
							name: i,
							arg: F .arg,
							on: F .on,
							onname: F .onname,
							def: F .def,
							isget: F .isget,
							ispost: F .ispost
						})})}catch(e){yue.log(e.stack)}</script>` ) )
						//console.log(F)
					}
				}
			}
		}
		let NAME = dom .get ( ) [ 0 ] .name
		let DOM = [ ]
		if ( ! dom .find ( "head" ) .children ( ) .length ) {
			dom = dom .find ( "body" )
			NAME = "div"
			DOM = [ `<${NAME}>` ]
		} else {
			DOM = [ `<${NAME}>` ]
		}
		let jbrec = function ( now , F ) {
			//console.log(now.html(),now.find("div"))
			now .children ( ) .get ( ) .forEach ( s => {
				let isr = true
				s = $ ( s )
				let name = s .get ( ) [ 0 ] .name .toLowerCase ( )
				let attr = s .get ( ) [ 0 ] .attribs
				let attb = [ "" ]
				for ( let i in attr ) {
					if ( i .indexOf ( "yc-" ) == -1 && i .indexOf ( "exp-" ) == -1 ) {
						if ( attr [ i ] !== "" ) {
							attb .push ( `${i}="${attr[i]}"` )
						} else {
							attb .push ( i )
						}
					}
				}
				DOM .push ( `<${name}${attb.join(" ")}>` )
				if ( $ ( s .get ( ) [ 0 ] ) .children ( ) .length == 0 ) {
					let N = s .get ( ) [ 0 ] .name
					//script link a href
					isr = false
					if ( N == "link" ) {
						if ( s .attr ( "rel" ) ) {
							//console.log(s.attr("rel"),src,s.attr("href"))
							if ( s .attr ( "rel" ) .toLowerCase ( ) .indexOf ( "stylesheet" ) !== -1 && exp .conf .use_style_push && yc .isfile ( src + "/" + s .attr ( "href" ) ) ) {
								//console.log(true)
								DOM .pop ( )
								name = "style"
								DOM .push ( `<style type="text/css">` )
								let t = yc .readFile ( src + "/" + s .attr ( "href" ) , "utf8" )
								t = repall ( t , "  ", " " )
								t = repall ( t , "\n", "" )
								t = repall ( t , "	", "" )
								t = repall ( t , ";;" , ";" )
								t = repall ( t , "{;" , "{" )
								//console.log(t)
								DOM .push ( t )
							}
						}
					} else
					//console.log(che(s,$),s.html())
					if ( [ "textarea" , "pre" , "script" ] .indexOf ( name ) == -1 ) {
						
						//test S
						let t = s .html ( )
						DOM .push ( t )
						//console.log(t)
					} else {
						if ( name == "script" ) {
							if ( exp .conf .use_script_push && yc .isfile ( src + "/" + s .attr ( "src" ) ) ) {
								DOM .pop ( )
								DOM .push ( "<script>" )
								s .html ( yc .readFile ( src + "/" + s .attr ( "src" ) , "utf8" ) )
							}
						}
						DOM .push ( s .html ( ) )
					}
				}
				//yc.c("s",s.text()+" "+s.children().type)
				if ( isr ) { jbrec ( s , DOM ) }
				DOM .push ( `</${name}>` )
			} )
		}
		jbrec ( dom , DOM )
		return DOM .concat ( [ `</${NAME}>` ] ) .join ( "" )
	}
	let repall = function ( str , a , b ) {
		if ( b == undefined ) {
			b = ""
		}
		while ( str .indexOf ( a ) !== -1 ) {
			str = str .replace ( a , b )
		}
		return str
	}
	//parse
	let parse = obj .parse = function ( src , name ) {
		let time = Date .now ( )
		let D = { }
		yc .c ( "web_s" , "Start parsing [" + src + "]" )
		if ( ! yc .isdir ( src ) ) {
			yc .c ( "e" , "Invalid path !" )
			return false
		}
		let ary = yc .filetree ( src )
		yc .c ( "web_s" , `Found ${ary.data.length} folders and files ` )
		for ( let i in ary .data ) {
			let d = parse1 ( ary .data [ i ] )
			if ( d == false ) {
				yc .c ( "web_c" , "Failed to parse [" + ary .data [ i ] .path + "]" )
			} else {
				//yc .c ( "web_c" , "编译成功[" + ary .data [ i ] .path + "]" )
				if ( typeof d === "object" ) {
					let l = [ ]
					let l1 = 0
					for ( let j in d ) {
						if ( D [ j ] == undefined ) {
							D [ j ] = d [ j ]
							l1 += 1
						} else {
							l .push ( j )
						}
					}
					if ( l1 !== 0 ) yc .c ( "web_c" , "The resolution was successful. , load " + l1 + " Types , Already exists : " + l .length + " " + l .join ( "," ) + " by[" + ary .data [ i ] .path + "]" )
				}
			}
		}
		yc .c ( "web_s" , "Parse complete :[" + src + "],spend[" + ( Math .round ( ( Date .now ( ) - time ) ) ) + "ms]" )
		obj .data [ name ] = D
	}
	let rec = function ( $ , dom , end ) {
		let home = dom .clone ( )
		home .html ( "" )
		let obj = rec .rec ( $ , home , dom , end )
		//console.log(obj)
		obj .fat = $ ( obj .fat .children ( ) [ 0 ] )
		return obj
	}
	rec .rec = function ( $ , fat , last , name ) {
		let ret
		last .get ( ) .forEach ( s => {
			s = $ ( s )
			if ( s .attr ( "yc-up" ) == last .attr ( "yc-end" ) ) {
				//end
				s .html ( "" )
				fat .append ( s )
				ret = {
					fat,
					child: s
				}
			} else {
				if ( s .find ( `[yc-end=${name}]` ) .length !== 0 ) {
					let f = $ ( s .find ( `[yc-end=${name}]` ) .get ( ) [ 0 ] )
					f .html ( "" )
					fat .append ( s )
					ret = {
						fat,
						child: f
					}
				} else {
					fat .append ( s )
				}
			}
		} )
		//ret .child .text("[type=chuck,name=" + name + "]")
		return ret
	}
	
	let parse1 = obj .parse1 = function ( data ) {
		try {
			let D = { }
			if ( data .type == "file" && ( [ "html" , "htm" ] .indexOf ( data .path .split ( "." ) .pop ( ) .toLowerCase ( ) ) !== -1 ) )
			{
				let $ = cheerio .load ( yc .readFile ( data .path , "utf8" ) )
				//解析对象
				$ ( "[yc-up]" ) .get ( ) .forEach ( s => {
					s = $ ( s )
					//start
					let if_str = s .attr ( "yc-str" )
					//end
					let if_end = s .attr ( "yc-end" )
					//name
					let if_up = s .attr ( "yc-up" )
					//class
					//let if_res = s .attr ( "yc-res" )
					//export
					let if_exp = s .attr ( "yc-exp" )
					//e type
					let if_type = s .attr ( "yc-type" )
					//e data
					let if_data = s .attr ( "yc-data" )
					let res = {
						type: "error",
						name: if_up
					} 
					//Export separately 
					if ( if_up !== undefined && if_str !== undefined ) {
						let name = if_up
						//slice chuck
						if ( s .find ( `[yc-end=${name}]` ) .length ) {
							let p = rec ( $ , s , name )
							//console.log("str:",p.fat.html())
							//console.log("end:",p.child.html())
							res = {
								data: p,
								type: "upall",
								name
							}
						} else {
							let p = s .clone ( )
							//console.log("USE",p.html())
							//p .html ( "" )
							res = {
								type: "upall",
								name,
								data: {
									child: p,
									fat: p .clone ( )
								}
							}
						}
					} else
					//tag
					if ( if_up !== null ) {
						let p = s .clone ( )
						p .html ( "" )
						res = {
							type: "upall",
							name: p .attr ( "yc-up" ),
							data: {
								fat: p,
								child: p .clone ( )
							}
						}
					}
					//Allow an exp 
					let exp = s .find ( "[yc-exp=" + if_up + "]" )
					if ( exp .length !== 0 ) {
						let or = { }
						exp .get ( ) .forEach ( s => {
							s = $ ( s )
							//执行
							let type = s .attr ( "yc-type" )
							let name = s .attr ( "yc-name" )
							let data = s .attr ( "yc-data" )
							//test
							if ( ! res .exp ) {
								res .exp = { }
							}
							res .exp [ name ] = {
								name,
								data,
								type
							}
						} )
					}
					//console.log(res)
					D [ res .name ] = res
				} )
				//"console.log(D)
				return D
			}
			return true
		} catch ( e ) {
			console.log(e)
			return false
		}
	}
	
	let build = obj .build = function ( src , name , esrc , app ) {
		yc .c ( "web_s" , "Start building [" + src + "]" )
		if ( ! yc .isdir ( src ) || ! yc .isdir ( esrc ) ) {
			yc .c ( "e" , "Directory Error" )
			return
		}
		if ( ! obj .data [ name ] ) {
			yc .c ( "e" , "Type not found " + name )
			return
		}
		//start
		let ary = yc .filetree ( src )
		yc .c ( "web_s" , "found " + ary .data .length + " folders and files " )
		//迭代ite
		let time = Date .now ( )
		for ( let i in ary .data ) {
			let d = ary .data [ i ]
			let Name = d .path .split ( "." ) .pop ( ) .toLowerCase ( )
			if ( d .type == "file" ) {
				if ( ( Name == "html" || Name == "htm" ) ) {
					let p = build1 ( d , name , esrc + d .path .replace ( src , "" ) , src , app )
					if ( p ) {
						yc .c ( "web_c" , "The build was successful.  [" + d .path + "]" )
					}
				} else {
					//copy
					yc .c ( "web_c" , "Copy [" + d .path + "]" )
					yc .writefile ( esrc + d .path .replace ( src , "" ), yc .readfile ( d .path ) )
				}
			} else {
				yc .mkdir ( esrc + d .path .replace ( src , "" ) )
			}
		}
		yc .c ( "web_s" , "Build Complete,spend[" + ( Math .round ( ( Date .now ( ) - time ) ) ) +"ms]" )
	}
	let build1 = obj .build1 = function ( src , name , esrc , ssrc , app ) {
		try {
			let $ = cheerio .load ( yc .readFile ( src .path , "utf8" ) )
			//console.log($.html())
			//递归构建
			yc .writeFile ( esrc , buildrec ( $ , obj .data [ name ], ssrc , app ) )
			yc .c ( "web_c" , "The build was successful. :" + esrc  )
		} catch ( e ) {
			console.log(e)
			return false
		}
	}
	let buildrec = function ( $ , data, src, app ) {
		let fat = $ ( "html" ) .clone ( )
		fat .html ( "" )
		let now = $ ( "html" )
		let A = buildrec .rec ( $, data, fat, now, [ ] )
		A = jb ( A, $, src, app )
		//yc.c("s",A)
		return A
	}
	buildrec .rec = function ( $, data, fat, now, allfat ) {
		//yc.c("s",che(fat,$))
		now .children ( ) .get ( ) .forEach ( s => {
			s = $ ( s )
			let TEXT = ""
			//console.log(s.children().length)
			if ( s .children ( ) .length == 0 ) {
				TEXT = s .html ( )
			}
			/*
			let P = $("<div></div>")
			let R = now .clone ( )
			R .html ( "" )
			P .append ( R )
			*/
			//console.log("RECI", P .html(),s.html())
			let isv = false
			let nowdom
			let nowrec
			//yc.c("s","\n-"+che(fat,$)+"\n-")
			//console.log(["ite",chc(now,$),/*chc(s,$),*/now.children().length,now.html()])
			for ( let i in data ) {
				//名称执行
				let d = data [ i ]
				if ( s .attr ( "yc-up" ) == d .name ) {
					//type
					if ( isv ) {
						continue
					}
					if ( d .type == "upall" ) {
						//PUSH
						isv = true
						let s1 = s .clone ( )
						s1 .html ( "" ) 
						d .data .child .append ( s1 )
						nowdom = d .data .fat .clone ( )
						d .data .child .html ( "" )
						//rec
						let s2 = s .clone ( )
						d .data .child .append ( s .children ( ) )
						nowrec = d .data .child .clone ( )
						d .data .child .html ( "" )
					}
				}
				//AUTO TEST AND FAT
				//console.log(d.exp)
				/*if ( nowrec ) {
					console.log(d.exp,nowrec.html())
				}*/
				//console.log(nowdom,d)
				

			if ( ! isv ) {
				nowdom = s .clone ( )
				nowdom .html ( "" )
				nowrec = s .clone ( )
			}
			//console.log(chc(nowdom,$))
			//console.log("u",chc(nowdom,$),d.name)
			if ( d .exp && nowdom .attr ( "yc-exp" ) == d .name ) {
				//console.log(che(fat,$))
				//console.log(["ITE"],chc(nowdom,$),nowdom.html())
				let conf = { }
				//替换节点rep
				//console.log("ATR",nowdom.html(),d.data.fat.html())
				for ( let j in d .exp ) {
					let v = d .exp [ j ]
					//console.log(v)
					let DATA = nowdom .attr ( "exp-" + j )
					if ( DATA !== null ) {
						let rep = {
							data: DATA
						}
						conf [ j ] = rep
					}
					isv = true
				}
			//console.log("c",d.data.fat.html(),"UUU",chc(d.data.fat,$))
				
				nowdom = ( d .data .fat .clone ( ) )
				//console.log(che(nowdom,$))
				//console.log(che(fat,$))
				for ( let j in conf ) {
					let v = conf [ j ]
					//console.log(v)
					//console.log(d.name,j,v)
					//console.log(nowdom.html())
					nowdom .find ( `[yc-exp=${d.name}][yc-name=${j}]` ) .get ( ) .forEach ( D => {
						D = $ ( D )
						let type = D .attr ( "yc-type" )
						//console.log(D.attr("yc-data"),type)
						if ( type == "text" ) {
							D .text ( ( "" + D .attr ( "yc-data" ) ) .replace ( "$data" , v .data ) )
						} else
						if ( type == "class" ) {
							let AT = getatr ( s , "class" )
							//console.log(AT,v.data,D.attr("yc-data"))
							s .attr ( "class" , null )
							D .attr ( "class" , AT + ( "" + D .attr ( "yc-data" ) ) .replace ( "$data" , v .data ) )
						}
					} )
				}
				//console.log(che(nowdom,$))
				if ( nowdom .find ( "[yc-up]" ) .length ) {
					nowrec = nowdom .find ( "[yc-up]" )
				} else {
					nowrec = $ ( "<div></div>" )
				}
				//yc.c("e",che(nowrec,$))
				//yc.c("e",nowdom.html())
				//Clear Atr
				//nowdom .html ( "\n--\n" + nowdom .html ( ) + "\n----------\n" )
				clearexp ( nowrec , d .name )
				clearexp ( nowdom , d .name )
				//console.log(che(nowdom,$))
				
				//yc .c ( "e" , fat .html ( ) ) 
			}
				//child
			}
			//console.log(isv,s.get()[0].name,che(nowdom,$),TEXT)
			if ( isv == false ) {
				nowdom .text ( TEXT )
			}
			//TEST script
			//console.log(s.get ( ) [ 0 ] .type,che(nowdom,$))
			/*
			if ( [ "script" , "pre" ] .indexOf ( s .get ( ) [ 0 ] .type ) !== -1 ) {
				nowrec = $ ( "<div></div>" )
			}
			*/
			//rep Attr
			let atrs = s .get ( ) [ 0 ] .attribs
			//console.log(atrs)
			for ( let k in atrs ) {
				//console.log(nowdom.attr(k),atrs[k],k)
				nowdom .attr ( k , atrs [ k ] )
			}
			//let AT = nowdom .clone ( )
			//yc .c ( "s" , nowdom .html ())
			fat .append ( nowdom )
			//console.log(che(fat,$))
			
			/*
			let TP = $("<div></div>")
			TP.append(nowdom)
			//rec
			console.log(s.children().length,isv,s.children().length,TP.html(),"U===U",s.html())
			*/
			//console.log(isv,nowrec.children().length,nowrec.html())
			if ( nowrec .children ( ) .length ) {
				//REC 
				buildrec .rec ( $, data, nowdom, nowrec )
			}
		} )
		return fat
	}
	let getatr = function ( d , k ) {
		let s = d .attr ( k )
		if ( s == undefined ) {
			s = ""
		} else {
			s += " "
		}
		return s
	}
	let chc = function ( s , $ ) {
		let o = $ ( "<div></div>" )
		s = s .clone ( )
		s .html ( "" )
		o .append ( s )
		return o .html ( )
	}
	let che = function ( s , $ ) {
		let o = $ ( "<div></div>" )
		s = s .clone ( )
		o .append ( s )
		return o .html ( )
	}
	let clearexp = function ( dom , name ) {
		if ( dom .attr ( "yc-exp" ) == name ) {
			dom .attr ( "yc-exp" , undefined )
		}
		dom .find ( `[yc-exp=${name}]` ) .attr ( "yc-exp" , null )
	}
	let zip = require ( "zip-local" )
	//confs
	exp .parse = parse
	exp .build = build
}