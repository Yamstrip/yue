exports .main = function ( exp , yc ) {
	exp .conf = { }
	//Add a local picture to your html code. 
	exp .conf .use_img_base64 = true,
	//Add a local style to your html code. 
	exp .conf .use_style_push = true,
	//Package the project, zip 
	exp .conf .use_zip = true,
	//script
	exp .conf .use_script_push = true,
	//Server
	//port
	exp .conf .ser_port = 8080,
	//Print data 
	exp .conf .ser_print = true
	exp .set = function ( conf , data ) {
		if ( typeof conf === "object" ) {
			for ( let i in conf ) {
				exp .conf [ i ] = conf [ i ]
			}
		} else {
			exp .conf [ i ] = data
		}
	}
	yc .setcolor ( "yue_req" , [
		{
			app: [ "green" , "bright" ],
			content: "[Request] ",
		},
		[ "white" , "bright" ]
	] )
}