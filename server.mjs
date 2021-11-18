// A simple http webserver for hosting the game

import http from "http";
import pfs from "fs/promises";


const mime = {
	'html': 'text/html',
	'css': 'text/css',
	'js': 'text/javascript',
	'mjs': 'application/javascript'
};


function request(req, res) {
	if(req.url === '/') req.url = '/index.html';
	const ext = req.url.slice(req.url.lastIndexOf('.') + 1);

	pfs.readFile(`./src${req.url}`).then((data) => {
		const res_mime = mime[ext];

		if(res_mime) res.writeHead(200, { 'Content-Type': res_mime });
		else res.writeHead(200);
		res.end(data);
	}).catch((err) => {
		res.writeHead(404);
		res.end("Not Found");
	});
}


const server = http.createServer(request);
const port = process.argv[2] ?? 8080;

server.listen(port, '127.0.0.1', () => {
	console.log(`Server listening at \x1b[36m127.0.0.1:${port}\x1b[0m`);
});
