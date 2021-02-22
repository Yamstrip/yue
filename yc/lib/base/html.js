let html = { }
let math = { }
math .average = math .平均 = math .平均值 = function ( x , rt ) {
	let average = 0
	if ( typeof rt === 'function' ) {
		for ( let i in x ) {
			let red = rt ( x [ i ] , i )
			if ( Number ( red ) + '' !== 'NaN' ) {
				average += red
			}
		}
	} else {
		for ( let i in x ) {
			average += x [ i ]
		}
	}
	return average / x .length
}
let copy = function ( target ) { 
	let copyed_objs = [  ]
	//此数组解决了循环引用和相同引用的问题，它存放已经递归到的目标对象 
	function _deepCopy(target){ 
		if ( ( typeof target !== 'object' ) || ! target ) { 
			return target;
		}
		for ( let i= 0 ; i<copyed_objs.length; i++ ) {
			if ( copyed_objs [ i ] .target === target ) {
				return copyed_objs[i].copyTarget;
			}
		}
		let obj = { };
		if(Array.isArray(target)){
			obj = [];//处理target是数组的情况 
		}
		copyed_objs.push({target:target,copyTarget:obj}) 
		Object.keys(target).forEach(key=>{ 
			if(obj[key]){ return;} 
			obj[key] = _deepCopy(target[key]);
		}); 
		return obj;
	} 
	return _deepCopy(target);
}

html .cssmerge = function ( css ) {
	let main = { }
	let str = 1
	let cl = { }
	//抽取CSS
	let int = function ( d ) {
		if ( d .style ) {
			for ( let i in d .style ) {
				if ( ! main [ i + ':' + d .style [ i ] ] ) {
					main [ i + ':' + d .style [ i ] ] = 1
				} else
				main [ i + ':' + d .style [ i ] ] += 1
			}
		}
		if ( d .node ) {
			for ( let i = 0; i < d .node .length; i ++ ) {
				int ( d .node [ i ] )
			}
		}
	}
	//比列分类
	let int1 = function ( d ) {
		if ( d .style ) {
			//一维化
			let lib = [ ]
			let csslen = 0
			for ( let i in d .style ) {
				csslen += 1
				lib .push ( {
					name: i,
					value: d .style [ i ],
					weight: ( main [ i + ':' + d .style [ i ] ] ? main [ i + ':' + d .style [ i ] ] : 0 )
				} )
			}
			//平均值
			let p_lib = math .平均 ( lib , i => {
				return i .weight
			} )
			//抽取大概率
			let m_lib = { }
			for ( let i in lib ) {
				if ( lib [ i ] .weight > p_lib ) {
					m_lib [ lib [ i ] .name ] = lib [ i ] .value
				}
			}
			//生成序列,与读取序列
			let cl_need = [ ]
			for ( let i in cl ) {
				let same = 1
				let len = 0
				let weig = 0
				for ( let j in cl [ i ] ) {
					if ( d .style [ j ] !== cl [ i ] [ j ] ) {
						same = 0
						break
					}
					weig += main [ j + ':' + cl [ i ] [ j ] ]
					len += 1
				}
				if ( len == csslen ) {
					same = 2
				}
				if ( same !== 0 ) cl_need .push ( {
					name: i,
					weig: weig * len
				} )
			}
			//排序
			cl_need .sort ( function ( a , b ) {
				return b .weig - a .weig
			} )
			//活的Push
			let pu = cl_need [ 0 ]
			if ( pu ) {
				for ( let i in cl [ pu .name ] ) {
					delete d .style [ i ]
				}
				if ( ! d .class ) {
					d .class = ''
				}
				d .class += pu .name
			}
			//生成pu
			if ( d .style !== {} ) {
				str += 1
				cl [ '.y' + str ] = {
					style: d .style
				}
				delete d .style
				if ( ! d .class ) {
					d .class = 'y' + str
				} else {
					d .class += ' y' + str
				}
			}
		}
		if ( d .node ) {
			for ( let i in d .node ) {
				int1 ( d .node [ i ] )
			}
		}
	}
	int ( css )
	int1 ( css )
	return {
		dom: css,
		class: cl
	}
}
html .objtohtml = function ( conf ) {
	let head = ''
	let body = ''
	//STYLE
	if ( conf .head ) {
		for ( let i in conf .head ) {
			head += html .objtohtml .int ( conf .head [ i ] )
		}
	}
	if ( conf .style ) {
		let d = '<style>'
		for ( let i in conf .style ) {
			if ( conf .style [ i ] .hover ) {
				d += html .objtohtml .style ( i + ':hover' , conf .style [ i ] .hover )
			}
			if ( conf .style [ i ] .style ) {
				d += html .objtohtml .style ( i , conf .style [ i ] .style )
			}
			if ( conf .style [ i ] .after ) {
				d += html .objtohtml .style ( i + ':after' , conf .style [ i ] .after )
			}
			if ( conf .style [ i ] .before ) {
				d += html .objtohtml .style ( i + ':before' , conf .style [ i ] .before )
			}
		}
		head += d + '</style>'
	}
	//DOM，顺便递归load 与 export
	if ( conf .dom ) {
		body = html .objtohtml .int ( conf .dom )
	}
	//生成
	return `<html><head>${head}</head><body>${body}</body></html>`
}

html .maxint = function ( last , will , n ) {
	for ( let i in last ) {
		if ( last [ i ] instanceof Array === true ) {
			for ( let j in last [ i ] ) {
				html .maxint ( last [ i ] [ j ] , will , n )
			}
		} else
		if ( typeof last [ i ] === 'object' ) {
			html .maxint ( last [ i ] , will , n )
		}
		if ( i == 'export' && last [ i ] ) {
			if ( ! ( last [ i ] instanceof Array ) ) last [ i ] = [ last [ i ] ]
			for ( let j in last [ i ] ) {
				let v = last [ i ] [ j ] .split ( ' ' )
				if ( v [ 0 ] == n && will [ v [ 1 ] ] ) {
					last [ v [ 2 ] ] = will [ v [ 1 ] ]
				}
			}
		}
	}
}

html .loadint = function ( dom , o ) {
	if ( ! o ) {
		o = {
			data: { }
		}
	}
	if ( dom .style ) {
		html .loadint ( dom .style , o ) 
	}
	if ( dom .export ) {
		if ( ! ( dom .export ) instanceof Array ) dom .export = [ dom .export ] 
		for ( let i in dom .export ) {
			let atr = dom .export [ i ] .split ( ' ' )
			if ( atr .length == 1 ) {
				o .data [ atr [ 0 ] ] = dom
			}
		}
	}
	//load
	if ( dom .load ) {
		let d = dom .load
		if ( d .name ) {
			if ( o .data [ d .name ] ) {
				let v = copy ( o .data [ d .name ] )
				for ( let i in v ) {
					dom [ i ] = v [ i ]
				}
				if ( d .data ) {
					//递归
					html .maxint ( dom , d .data , d .name )
				}
			}
		}
	}
	if ( dom .node ) {
		for ( let i in dom .node ) {
			html .loadint ( dom .node [ i ] , o )
		}
	}
}

html .objtohtml .int = function ( dom , o ) {
	if ( ! o ) {
		o = {
			text: '',
			data: { }
		}
	}
	let str = ''
	let end = ''
	let data = ''
	//export
	//DOM
	if ( dom .tag ) {
		str = '<' + dom .tag
		end = '</' + dom .tag + '>'
	} else {
		str = '<div'
		end = '</div>'
	}
	o .text += str
	for ( let i in dom ) {
		let data = dom [ i ]
		i = i .toLowerCase ( )
		if ( i == 'style' ) {
			o .text += ' style="'
			for ( let j in data ) {
				o .text += ( j + ':' + data [ j ] + ';' )
			}
			o .text += '"'
		} else
		if ( i !== 'text' && i !== 'export' && i !== 'load' && i !== 'tag' && i !== 'node' ) {
			o .text += ( ' ' + i + '="' + data + '"' )
		}
	}
	o .text += '>'
	if ( dom .text ) {
		o .text += dom .text
	}
	if ( dom .node ) {
		for ( let j in dom .node ) {
			html .objtohtml .int ( dom . node [ j ], o )
		}
	}
	o .text += end
	return o .text
}
html .objtohtml .style = function ( name , d ) {
	name += '{'
	for ( let i in d ) {
		name += ( i + ':' + d [ i ] + ';' )
	}
	name += '}'
	return name
}
module .exports = html