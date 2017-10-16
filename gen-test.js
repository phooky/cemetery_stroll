#!/usr/bin/env node


grammar_path = "./grammar"
if (process.argv.length > 2)  grammar_path = process.argv[2];


foo = require('fs').readFile(grammar_path,'utf8', function(err,data) {
	if (err) throw err;
	grammar = require('./grammar.js').parse(data);

	for (i of Array(5)) {
		console.log(grammar.generate('S'));
	}
});


