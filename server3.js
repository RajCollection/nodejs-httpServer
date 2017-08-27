var http = require("http");
var fs = require("fs");
var qs = require("querystring");
var StringBuilder = require("stringbuilder");
var port = 9000;

function getHome(req,resp){
	resp.writeHead(200,{"content-type": "text/html"});
	resp.write("<html><head><title>Home</title></head><body>Want to do some coalculation? Click<a href='/calc'> here</a></body></html>");
	resp.end();
}

function get404(req,resp){
	resp.writeHead(404,"Resource Not Found",{"content-type": "text/html"});
	resp.write("<html><head><title>404</title></head><body>404: Resource not found.</body></html>");
	resp.end();
}

function get405(req,resp){
	resp.writeHead(405,"Method not supported",{"content-type": "text/html"});
	resp.write("<html><head><title>405</title></head><body>405: Method not supported.</body></html>");
	resp.end();
}

function callPage(req,resp,fileName){
	var fileName = fileName+".html"
	fs.readFile(fileName,function(err,html){
		if(err){
			throw err;
		}
		
		resp.writeHead(200,{"content-type":"text/html"});
		resp.write(html);
		resp.end();
	});
}

//create server
http.createServer(function(req,resp){
	reqUrl = req.url;
	var day = reqUrl.slice(1,reqUrl.length-1);
	console.log(day)
	switch(req.method){
		case "GET":
			if(req.url==="/"){
				getHome(req,resp);
			}
			else if(day==="day"){
				file = reqUrl.slice(1,reqUrl.length);
				console.log(file)
				callPage(req,resp,file);
			}
			else{
				get404(req,resp);
			}
			break;
		case "POST":
			if(req.url==="/calc"){
				var reqBody = '';
				req.on('data',function(data){
					reqBody +=data;
					if(reqBody.length>1e7) //10MB
					{
						resp.writeHead(413, 'Request Entity Too Large',{"content-type":"text/html"});
						resp.write("<html><head><title>413</title></head><body>413: Too much of information. Server cannot handle</body></html>");
						resp.end();
					} 

				});

				req.on('end',function(data){
					var formData = qs.parse(reqBody);
					getCalForm(req,resp,formData);
				});

			}
			else{
				get404(req,resp);
			}
			break;
		default:
			get405(req,resp);
			break;

	}
}).listen(port); 