function generate(symbol) {
	var c = symbol.charAt(0);
	if (c == c.toLowerCase()) {
		// it's a terminal
		return [ symbol ];
	} else {
		var arms = this.map[symbol];
		if (!arms) { return [symbol]; } // unmatched symbols are just returned for now
		var v = Math.random();
		var arr = [];
		for (arm of arms) {
			if (arm.p > v) {
				// use this arm
				for (entry of arm.sub) {
					arr = arr.concat( this.generate(entry) );
				}
				return arr;
			} else { v = v - arm.p; }
		}

	}
}

function Grammar(grammar_str) {
	s = grammar_str;
	lines = s.split('\n');
	s = '';
	for (var line of lines) {
		line = line.trim();
		if (line.charAt(0) == '#') {
			//console.log("Tossing comment "+line);
		} else { s = s + line + ' '}
	}
	var fi = function(ins) { return ins.trim() };
	statements = s.split(';').map(fi);
	symbol_map = {};
	// pass 1
	for (var statement of statements) {
		if (statement.length == 0) continue;
		var ss = statement.split('=',2).map(fi);
		var arms = ss[1].split('|').map(fi);
		var total = 1.0;
		var implied = 0;
		arms = arms.map(function (arm) {
			var elements = arm.split(' ').map(fi);
			var prob = parseFloat(elements[0]);
			if (isNaN(prob)) {
				implied = implied + 1;
			} else {
				total = total - prob;
				elements.shift();
			}
			return { 'p' : prob, 'sub' : elements };
		})
		if (implied > 0) {
			leftover_p = total / implied;
			for (arm of arms) {
				if (isNaN(arm.p)) { arm.p = leftover_p; } 
			}
		}
		symbol_map[ ss[0] ] = arms;
	}
	return { 'map' : symbol_map,
		'generate' : generate,
	 };
}

module.exports = {
	parse : function(grammar_str) {
		return new Grammar(grammar_str);
	}

}