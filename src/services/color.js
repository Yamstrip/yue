exports .main = function ( exp , yc ) {
	yc .setcolor ( "yue_log" , [
		{
			content: " Print: ",
			app: [ "green" , "bright" ]
		},
		[ "bright" ]
	] )
	yc .setcolor ( "yue_log_error" , [
		{
			content: " Print: ",
			app: [ "red-" , "bright" ]
		},
		[ "bright" ]
	] )
	//There's always a bug
}