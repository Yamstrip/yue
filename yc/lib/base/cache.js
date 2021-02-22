//缓存
let os = require ( 'os' )
exports .totalmem = function ( ) {
	return os .totalmem ( )
}
exports .usemem = function ( ) {
	return os .totalmem ( ) - os .freemem ( )
}
exports .freemem = function ( ) {
	return os .freemem ( )
}
exports .max = os .totalmem ( ) / 5
exports .setsize = function ( bit , iftrue ) {
	exports .max = os .totalmem ( )
	if ( Number ( bit ) + '' == 'NaN' && bit > 0 ) {
		throw 'Maximum memory must be a number and greater than 0'
	}
	bit = Number ( bit )
	//iftrue 是否把bit看做百分百[0-100]
	if ( iftrue ) {
		if ( bit > 100 ) {
			throw 'Bit must be less than 100%'
		}
		exports .max = exports .max * bit / 100
	} else {
		if ( bit > exports .max ) {
			throw 'Bit exceeds the maximum memory > ' + exports .max
		}
		exports .max = bit
	}
	exports .test ( )
}
exports .liblen = 0
exports .lib = { }
//刷新内存
exports .test = exports .plan = function ( ) {
	if ( os .totalmem ( ) - os .freemem ( ) > exports .max ) {
		let lib = [ ]
		//放入
		for ( let i in exports .lib ) {
			lib .push ( {
				name: i,
				req: exports .lib [ i ] .req
			} )
		}
		//排序
		lib .sort ( function ( a , b ) {
			return b .req - a .req
		} )
		for ( let i = 0; i < lib .length; i ++ ) {
			if ( exports .usemem ( ) >= exports .max * 0.85 ) {
				exports .liblen -= 1
				delete exports .lib [ lib [ i ] .name ]
			}
		}
	}
}
//设置
exports .set = function ( name , data ) {
	if ( ! exports .lib [ name ] ) exports .liblen += 1
	exports .lib [ name ] = {
		req: 0,
		data
	}
	exports .test ( )
}
//获取
exports .get = function ( name ) {
	if ( exports .lib [ name ] ) {
		exports .lib [ name ] .req += 1
		return exports .lib [ name ] .data
	}
	exports .test ( )
}
//重置
exports .reset = function ( ) {
	exports .lib = { }
	exports .liblen = 0
}