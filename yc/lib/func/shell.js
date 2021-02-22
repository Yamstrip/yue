//引入模块
exports .main = function ( yc , destroy ) {
	//SHELL
	let shell = require ( 'child_process' )
	//设置一个命令对象
	shell .cmdlib = {
		'': function ( ) { }
	}
	//关闭
	shell .exit = function ( ) {
		process .exit ( )
	}
	//删除命令
	shell .deletecmd = function ( name ) {
		if ( shell .cmdlib [ name ] ) {
			delete shell .cmdlib [ name ]
			return true
		} else {
			return false
		}
	}
	//SHELL SAY
	shell .log = function ( d ) {
		for ( let i = 0; i < d .length; i ++ ) {
			yc .c ( 'shell' , d [ i ] , d [ i +1 ] )
			i += 1
		}
	}
	//命令对象
	shell .setcmd = function ( name , text , call ) {
		if ( name ) {
			if ( text ) {
				if ( call ) {
					//一次性设置多个
					if ( ! ( name instanceof Array === true ) ) name = [ name ]
					for ( let i in name ) {
						shell .cmdlib [ name [ i ] ] = call
						shell .cmdlib [ name [ i ] ] .text = text
					}
				} else {
					throw 'Setcmd (name, text, call) must have a callback call'
				}
			} else {
				throw 'Setcmd (name, text, call) must have an annotation text'
			}
		} else {
			throw 'Setcmd (name, text, call) must have a name name'
		}
	}
	//监听输入
	function startshell ( ) {
	process .stdin .on ( 'data' , d => {
		shell .put ( d )
	} )
	
	shell .no = true
	//异常
	process .on( 'uncaughtException' , ( e , s ) => {
		yc .c ( 'ae' , e )
		console .log ( s )
		console .log ( e )
	} )
	
	}
	
	shell .put = function ( d ) {
		if ( d == '' || ! d ) {
			d = ''
		}
		d = ( d + '' ) .replace ( /\s+/g , ' ' ) .split ( ' ' )
		if ( shell .cmdlib [ d [ 0 ] ] ) {
			if ( typeof shell .cmdlib [ d [ 0 ] ] === 'function' ) {
				shell .cmdlib [ d [ 0 ] ] ( d , shell .log )
			} else {
				shell .log ( 'shell' , shell .cmdlib [ d [ 0 ] ] )
			}
		} else {
			yc .c ( 'e' , 'Not Found > ' + d [ 0 ] )
		}
	}
	
	//固定命令-help
	shell .setcmd ( [ 'help' , 'list' ] , 'get Help' , function ( d , c ) {
		for ( let i in shell .cmdlib ) {
			yc .c ( 'shell-cmd' , i + '  ' , shell .cmdlib [ i ] .text )
		}
	} )
	
	//固定命令-exec
	shell .setcmd ( [ 'e' , 'cmd' , 'exec' ] , 'execute shell cmd' , function ( d ) {
		if ( d [ 1 ] !== '' ) shell .exec ( d .slice ( 1 ) .join ( ' ' ) , ( e , sd , se ) => {
			if ( e ) {
				yc .c ( 'e' , se )
			} else {
				yc .c ( 's' , sd )
			}
		} )
	} )
	//固定命令-exit
	shell .setcmd ( [ 'exit' ] , 'exit progress0' , function ( d , c ) {
		process .exit ( )
	} )
	//eval
	
	shell .do = function ( code ) {
		yc .c ( "i", code )
		shell .put ( code )
	}
	shell .setcmd ( 'eval' , 'run code' , function ( d , c ) {
		try {
			let t = Date .now ( )
			eval ( d .slice ( 1 ) .join ( ' ' ) )
			yc .c ( 's' , 'It takes ' + ( Date .now ( ) - t ) + 'ms' )
		} catch ( e ) {
			yc .c ( 'e' , e )
		}
	} )
	//固定命令-清屏
	shell .setcmd ( [ 'reset' ] , 'Clear the screen' , function ( d , c ) {
		for ( let i = 1; i < 200; i ++ ) {
			console .log ( '\033[2J' )
		}
		yc .c ( 's' , 'Clear screen completed' )
	} )
	
	//原生命令
	let nord = [
		'cd' , 'Positioning path',
		'ls' , 'List files',
		'mkfile' , 'Create file',
		'mkdir' , 'Create folder',
		'rm' , 'Delete'
	]
	for ( let i = 0; i < nord .length; i ++ ) {
		shell .setcmd ( nord [ i ] , nord [ i +1 ] , function ( d ) {
			shell .exec ( d .join ( ' ' ) , function ( e , sd , ed ) {
				if ( e ) {
					yc .c ( 'e' , ed )
				} else {
					yc .c ( 's' , sd )
				}
			} )
		} )
		i ++
	}
	//LOAD
	let isshell = false
	yc .shell = { }
	yc .objyc ( yc .shell ,shell )
	//yc .c ( 's' , 'Shell instruction loading is completed, enter help query' )
	yc .startshell = yc .startcmd = yc .keepshell = function ( ) {
		if ( isshell == false ) {
			isshell = true
			startshell ( )
		} else {
			throw '已经开启cmd模式'
		}
	}
	yc .setcolor ( "i", [
		{
			content: " I: ",
			app: [ "green-" , "bright" ]
		},
		[ "bright" ]
	] )
	destroy ( )
}