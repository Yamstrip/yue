let yue = require ( "../index.js" )
yue .parse ( __dirname + "/res" , "class A" )
yue .build ( __dirname + "/req" , "class A" ,  __dirname + "/build" )