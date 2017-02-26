var lzmajs = require('lzma-purejs');

var commands = {
	compress: compress,
	decompress: decompress
};

onmessage = function (e) {
	commands[e.data.cmd](e.data);
};

function compress(data) {
	var base64 = lzmajs.compressFile(stringToUint8Array(data.in)).toString('base64');
	postMessage({
		id: data.id,
		out: base64.replace(/=/g, '')
	});
}

function stringToUint8Array(code) {
	var data = new Uint8Array(code.length);
	for (var i = 0; i < code.length; i++) {
		data[i] = code.charCodeAt(i);
	}
	return data;
}

function decompress(data) {
	var array = stringToUint8Array(atob(data.in));
	postMessage({
		id: data.id,
		out: lzmajs.decompressFile(array).toString()
	});
}
