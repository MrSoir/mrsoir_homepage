
var StaticFunctions = {
	replaceString: function(s, args, ids=undefined){
	  for(let i=0; i < args.length; ++i){
	    let lastS = null;
	    while(s && s != lastS){
	      lastS = s;
	      let replId = ids ? ids[i] : i;
	      s = s.replace('$!{' + replId + '}!$', args[i]);  }
	    }
	  return s;
	},
	
	shuffle: function(a) {
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
		}
		return a;
	},
};


export default StaticFunctions;