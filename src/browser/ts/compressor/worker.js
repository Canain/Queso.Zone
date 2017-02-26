var JSZip = require('jszip');

var commands = {
	compress: compress,
	decompress: decompress
};

onmessage = function (e) {
	commands[e.data.cmd](e.data);
};

function compress(data) {
	var zip = new JSZip();
	zip.file('a', data.in);
	zip.generateAsync({
		type: 'string',
		compressionOptions: {
			level: 9
		}
	}).then(function (out) {
		postMessage({
			id: data.id,
			out: out
		});
	});
}

function decompress(data) {
	var zip = new JSZip();
	zip.loadAsync(data.in).then(function (zip) {
		return zip.file('a').async('string');
	}).then(function (out) {
		postMessage({
			id: data.id,
			out: out
		});
	});
}
