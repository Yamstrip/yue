//YAM数学库
let math = { }
for ( let i in Math ) {
	math [ i ] = Math [ i ]
}
//随机
math .random = function ( str , end , t ) {
	let v = Math .random ( ) * ( end - str ) + str
	if ( t ) {
		return Math .round ( v )
	} else {
		return v
	}
}
//函数
math .fx = math .function = math .函数 = function ( code ) {
	return function ( x ) {
		return code ( x )
	}
}
//求和
math .Σ = math .求和 = math .sum = function ( d , rt ) {
	let end = 0
	if ( typeof rt === 'function' ) {
		for ( let i = 0; i < d; i ++ ) {
			let red = rt ( i )
			if ( Number ( red ) + '' !== 'NaN' ) {
				end += red
			}
		}
	} else {
		for ( let i = 0; i < d; i ++ ) {
			end += rt [ i ]
		}
	}
	return end
}
//补全数据
math .com = function ( str , end ) {
	for ( let i in end ) {
		if ( ! str [ i ] ) {
			if ( end [ i ] == 'a' ) {
				str [ i ] = 'b'
			} else {
				str [ i ] = 'a'
			}
		}
	}
}
//平均值快速
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
//方差
math .方差 = function ( d ) {
	// [ d ]
	let average = math .average ( d )
	let variance = math .average ( d , function ( s ) {
		return Math .pow ( ( s - average ) , 2)
	} )
	return Math.sqrt ( variance )
}
//线性回归
math .线性回归 = function ( d ) {
	// [ [ x , y ] ]
	let ax = math .average ( d , s => {
		return s [ 0 ]
	} )
	let ay = math .average ( d , s => {
		return s [ 1 ]
	} )
	let b = math .Σ ( d .length , s => {
		return ( ( d [ s ] [ 0 ] - ax ) * ( d [ s ] [ 1 ] - ay ) )
	} ) / math .Σ ( d .length , s => {
		return Math .pow ( ( d [ s ] [ 0 ] - ax ) , 2 )
	} )
	let a = ay - b * ax
	return math .fx ( function ( x ) {
		return b * x + a
	} )
}
//字符串数据相似度
math .same_string = function ( str , end ) {
	//Buffer加速
	if ( ! Buffer .isBuffer ( str ) ) str = Buffer ( str )
	if ( ! Buffer .isBuffer ( end ) ) end = Buffer ( end )
	let len = end .length
	if ( str .length > end .length ) {
		len = str .length
	}
	let uselib = {
		
	}
	for ( let i = 0; i < str .length; i ++ ) {
		if ( ! uselib [ str [ i ] ] ) {
			uselib [ str [ i ] ] = 1
		} else {
			uselib [ str [ i ] ] += 1
		}
	}
	return math .Σ ( len , ( i ) => {
		this .v = 0
		if ( str [ i ] == end [ i ] ) {
			this .v += 0.5
		}
		if ( uselib [ end [ i ] ] ) {
			uselib [ end [ i ] ] -= 1
			this .v += 0.5
		}
		return this .v
	} ) / len
}
//用算法生成算法的算法

//数组转换算式
math .aryint = function ( d , l ) {
	let st = l .length
	for ( let i = 0; i < d .length; i ++ ) {
		if ( d [ i ] instanceof Array === true ) {
			l .push ( '(' )
			math .aryint ( d [ i ] , l )
			l .push ( ')' )
		} else {
			l .push ( d [ i ] )
		}
	}
}
//DHASH快速灰度特征
/*
w 长
h 宽
k 精度
*/
math .dhash = function ( rgb , h , w ) {
	let map = [ ]
	let co = 0
	let t = 0
	let f = 0
	for ( let i = 0; i < h; i ++ ) {
		let last = Math .round ( math .灰度 ( rgb [ i * ( w -1 ) ] ) )
		for ( let j = 0; j < w; j ++ ) {
			let d = Math .round ( math .灰度 ( rgb [ j + i * ( w -1 ) ] ) )
			if ( d > last ) {
				map .push ( 1 )
			} else {
				map .push ( 2 )
			}
			last = d
		}
	}
	return map
}

//NCC算法
math .ncc = function ( r , g , b ) { }

math .灰度 = function ( r , g , b , t ) {
	if ( ! g ) {
		g = r [ 1 ]
		b = r [ 2 ]
		r = r [ 0 ]
	}
	r = ( r * 299 + g * 587 + b * 114 + 500 ) / 1000
	if ( t == true ) r /= 255.5
	return r
}
//序列化数组
math .序列化 = function ( d , ds ) {
	//d数据,ds纬度数
}
//数组合并
math .arymerge = function ( data , len , ap ) {
	let v = [ ]
	for ( let i = 0; i < data .length; i ++ ) {
		let s = data .slice ( i , i + len )
		if ( ap ) i += ap
		i += len - 1
		v .push ( s )
	}
	return v
}
//任意纬合并
math .latmerge = function ( ary , d , max ) {
	//[ [ x , y , z , attr ... ] ]
	//d纬度，max最大
	//xyz序列化
	ary = math .序列化 ( ary )
}
//CSSMERGE CSS合并
/*
  *@param {Object} css -
  [
  {
  	xxx: xxx,
  	css: { xxx: xxx },
  	tag: xxx,
  	node: [ xxx ]
  }
  return 
  {
  	dom: [
  	{
  		class: xxx
  	}
  	],
  	class: {
  		xxx: {
  			
  		}
  	}
  }
*/

math .cssmerge = function ( css ) {
	let main = { }
	let str = 1
	let cl = { }
	//抽取CSS
	let int = function ( d ) {
		if ( d .css ) {
			for ( let i in d .css ) {
				if ( ! main [ i + ':' + d .css [ i ] ] ) {
					main [ i + ':' + d .css [ i ] ] = 1
				} else
				main [ i + ':' + d .css [ i ] ] += 1
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
		if ( d .css ) {
			//一维化
			let lib = [ ]
			let csslen = 0
			for ( let i in d .css ) {
				csslen += 1
				lib .push ( {
					name: i,
					value: d .css [ i ],
					weight: ( main [ i + ':' + d .css [ i ] ] ? main [ i + ':' + d .css [ i ] ] : 0 )
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
					if ( d .css [ j ] !== cl [ i ] [ j ] ) {
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
					delete d .css [ i ]
				}
				if ( ! d .class ) {
					d .class = ''
				}
				d .class += pu .name
			}
			//生成pu
			if ( d .css !== {} ) {
				str += 1
				cl [ 'y' + str ] = d .css
				delete d .css
				if ( ! d .class ) {
					d .class = ''
				}
				d .class += ' y' + str
			}
		}
		if ( d .node ) {
			for ( let i in d .node ) {
				int1 ( d .node [ i ] )
			}
		}
	}
	for ( let i in css ) {
		int ( css [ i ] )
	}
	for ( let i in css ) {
		int1 ( css [ i ] )
	}
	return {
		dom: css,
		class: cl
	}
}
//ARRAY标识
math .aryfeat = function ( d ) {
	let v = [ ]
	let g = d .length / 16
	for ( let i = 0; i < 16; i ++ ) {
		let am = 0
		for ( let j = i * g ; j < ( 1 + i ) * g; j ++ ) {
			am += d [ Math .round ( j ) ]
		}
		v .push ( Math .round ( am / g ) )
	}
	return Buffer .from ( v , 'utf8' ) .toString ( 'hex' )
}
//三维外壳
//compress压缩算法
math .compress = function ( buff , key ) {
	//多元合并
}
//排序插值
math .randomary = function ( len , min , max ) {
	let d = [ ]
	for ( let i = 0; i < len; i ++ ) {
		d .push ( math .random ( min , max , true ) )
	}
	return d
}

//π
math .π = math .pai = function ( n ) {
	let j = -1
	return math .sum ( n , function ( i ) {
		j *= -1
		return ( 4 / ( j * ( 2 * ( i +1 ) -1 ) ) )
	} )
}

module .exports = math