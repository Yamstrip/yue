exports .time = function ( d ) {
	let t = ( d ? new Date ( d ) : new Date )
	let n = t .getYear ( ) + 1900
	let y = t .getMonth ( ) + 1
	let r = t .getDate ( )
	let s = t .getHours ( ) 
	let f = t .getMinutes ( )
	let m = t .getSeconds ( )
	return [ n , y , r , s , f , m ]
}
exports .timeO = exports .time .差 = function ( last , now ) {
	let ind = function ( d ) {
		let b = 0
		b += d [ 0 ] %4 == 0 ? 31622400 * d [ 0 ] : 31536000 * d [ 0 ]
		b += d [ 1 ] * 60 * 60 * 24 *
		( d [ 1 ] == 2 ? ( d [ 0 ] %4 == 0 ? 28 : 29 ) : ( d [ 1 ] %2 == 0 ? 30 : 31 ) ) * d [ 1 ]
		b += d [ 2 ] * 60 * 60 * 24
		b += d [ 3 ] * 60 * 60
		b += d [ 4 ] * 60
		b += d [ 5 ]
		return b
	}
	return ( ind ( now ) - ind ( last ) )
}
exports .time .具体差 = exports .time .运行差 = function ( str , d ) {
	if ( !d ) d = exports .time ( )
	for ( let i = 0; i < d .length; i ++ ) {
		d [ i ] -= str [ i ]
	}
	for ( let i = 1; i < 6; i ++ ) {
		if ( d [ i ] < 0 ) {
			d [ i - 1 ] -= 1
			d [ i ] = str [ i ] + d [ i ]
		}
	}
	return d
}
exports .time .s_merge = function ( s , t ) {
	let 
	h = 0,
	m = 0
	
	while ( s >= 60 ) {
		m += 1
		s -= 60
		if ( m == 60 ) {
			h += 1
			m = 0
		}
	}
	if ( t ) {
		if ( h < 10 ) {
			h = '0' + h
		}
		if ( m < 10 ) {
			m = '0' + m
		}
		if ( s < 10 ) {
			s = '0' + s
		}
	}
	return [ h , m , s ]
}