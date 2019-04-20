
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
};

export default StaticFunctions;