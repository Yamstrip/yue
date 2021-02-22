let fs = require ( 'fs' )
//对象
//文件
exports .writeFile = exports .writefile = exports .saveFile = exports .savefile = function ( name , d , code ) {
	try {
		fs .writeFileSync ( name , d , code ? code : 'utf8' )
		return true
	} catch ( e ) {
		return null
	}
}
//创建文件夹
exports .mkdir = exports .mkDir = function ( f ) {
	f = f instanceof Array ? f : [ f ]
	for ( let i in f ) {
		try {
			fs .mkdirSync ( f [ i ] )
		} catch ( e ) {
			return null
		}
	}
}
//文件
exports .readFile = exports .readfile = exports .getFile = exports .getfile = function ( name , code ) {
	try {
		if ( code == true ) {
			return fs .readFileSync ( name )
		} else 
		if ( code == undefined ) {
			return fs .readFileSync ( name )
		} else return fs .readFileSync ( name , code )
	} catch ( e ) {
		return null
	}
}
//判断
exports .isdir = exports .isDir = function ( path ) {
	try {
		return fs .lstatSync ( path ) .isDirectory ( )
	} catch ( e ) {
		return false
	}
}
//判断
exports .isfile = exports .isFile = function ( path ) {
	try {
		return fs .lstatSync ( path ) .isFile ( )
	} catch ( e ) {
		return false
	}
}
//删除文件
exports .rmFile = exports .rmfile = function ( path ) {
	try {
		fs .unlinkSync ( path )
		return true
	} catch ( e ) {
		return null
	}
}
//递归删除文件夹
exports .rmDir = exports .rmdir = function ( path ) {
	try {
		fs .rmdirSync ( path )
		return true
	} catch ( e ) {
		return null
	}
}
//DIR
exports .getdir = exports .readdir = exports .readDir = exports .getDir = function ( path ) {
	try {
		return fs .readdirSync ( path )
	} catch ( e ) {
		return null
	}
}
//递归删除
exports .rmdirall = exports .rmDirall = exports .rmfileall = exports .rmFileall = function ( path ) {
	try {
		let int = function ( last ) {
			if ( exports .isfile ( last ) ) {
				exports .rmfile ( last )
			} else {
				let d = exports .getdir ( last )
				for ( let i in d ) {
					int ( last + '/' + d [ i ] )
				}
				exports .rmdir ( last )
			}
		}
		int ( path )
		return true
	} catch ( e ) {
		return null
	}
}
//递归copy
exports .copydir = exports .copyDir = exports .copyfile = exports .copyFile = function ( path , end ) {
	try {
		let int = function ( last , t ) {
			if ( exports .isfile ( last ) ) {
				exports .writeFile ( t , exports .getFile ( last , true ) )
			} else {
				exports .mkdir ( t ) 
				let d = exports .getdir ( last )
				for ( let i in d ) {
					int ( last + '/' + d [ i ] , t + '/' + d [ i ] )
				}
			}
		}
		int ( path , end )
		return true
	} catch ( e ) {
		return null
	}
}
//递归剪贴
exports .catdir = exports .catfile = exports .catDir = exports .catFile = function ( last , end ) {
	if ( exports .copydir ( last , end ) ) {
		exports .rmdirall ( last )
		return true
	} else {
		return false
	}
}
//路径树
exports .dirtree = exports .pathtree = exports .filetree = function ( path ) {
	let tree = {
		data: [ ],
		tree: { }
	}
	//递归
	let int = function ( last , pd , t ) {
		if ( exports .isfile ( last ) ) {
			pd [ t ] = 'file'
			tree .data .push ( {
				type: 'file',
				path: last,
				name: t
			} )
		} else 
		if ( exports . isdir ( last ) ) {
			pd [ t ] = { },
			tree .data. push ( {
				type: 'dir',
				path: last,
				name: t
			} )
			let db = exports .getdir ( last )
			for ( let i in db ) {
				int ( last + '/' + db [ i ] , pd [ t ] , db [ i ] )
			}
		}
	}
	int ( path , tree .tree , path .split ( '/' ) .pop ( ) )
	return tree
}