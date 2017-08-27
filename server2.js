var http = require("http");
var fs = require("fs");

fs.readFile('sample.html',function(err,html){
	if(err){
		throw err;
	}
	http.createServer(function(req,resp){
		resp.writeHead(200,{"content-type":"text/html"});
		resp.write(html);
		resp.end();
	}).listen(1337,'127.0.0.1');
});