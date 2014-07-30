/*!
 * jQuery JavaScript Library v2.0.3
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:30Z
 */
(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// A central reference to the root jQuery(document)
	rootjQuery,

	// The deferred used on DOM ready
	readyList,

	// Support: IE9
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	location = window.location,
	document = window.document,
	docElem = document.documentElement,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "2.0.3",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler and self cleanup method
	completed = function() {
		document.removeEventListener( "DOMContentLoaded", completed, false );
		window.removeEventListener( "load", completed, false );
		jQuery.ready();
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray,

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		// Support: Safari <= 5.1 (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		// Not plain objects:
		// - Any object or value whose internal [[Class]] property is not "[object Object]"
		// - DOM nodes
		// - window
		if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		// Support: Firefox <20
		// The try/catch suppresses exceptions thrown when attempting to access
		// the "constructor" property of certain host objects, ie. |window.location|
		// https://bugzilla.mozilla.org/show_bug.cgi?id=814622
		try {
			if ( obj.constructor &&
					!core_hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
				return false;
			}
		} catch ( e ) {
			return false;
		}

		// If the function hasn't returned already, we're confident that
		// |obj| is a plain object, created by {} or constructed with new Object
		return true;
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );

		if ( scripts ) {
			jQuery( scripts ).remove();
		}

		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: JSON.parse,

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}

		// Support: IE9
		try {
			tmp = new DOMParser();
			xml = tmp.parseFromString( data , "text/xml" );
		} catch ( e ) {
			xml = undefined;
		}

		if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		var script,
				indirect = eval;

		code = jQuery.trim( code );

		if ( code ) {
			// If the code includes a valid, prologue position
			// strict mode pragma, execute code by injecting a
			// script tag into the document.
			if ( code.indexOf("use strict") === 1 ) {
				script = document.createElement("script");
				script.text = code;
				document.head.appendChild( script ).parentNode.removeChild( script );
			} else {
			// Otherwise, avoid the DOM node creation, insertion
			// and removal by using an indirect global eval
				indirect( code );
			}
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	trim: function( text ) {
		return text == null ? "" : core_trim.call( text );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : core_indexOf.call( arr, elem, i );
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: Date.now,

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		} else {

			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.9.4-pre
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-06-03
 */
(function( window, undefined ) {

var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent.attachEvent && parent !== parent.top ) {
		parent.attachEvent( "onbeforeunload", function() {
			setDocument();
		});
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );

			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		}

		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}
				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return (val = elem.getAttributeNode( name )) && val.specified ?
				val.value :
				elem[ name ] === true ? name.toLowerCase() : null;
		}
	});
}

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function( support ) {
	var input = document.createElement("input"),
		fragment = document.createDocumentFragment(),
		div = document.createElement("div"),
		select = document.createElement("select"),
		opt = select.appendChild( document.createElement("option") );

	// Finish early in limited environments
	if ( !input.type ) {
		return support;
	}

	input.type = "checkbox";

	// Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
	// Check the default checkbox/radio value ("" on old WebKit; "on" elsewhere)
	support.checkOn = input.value !== "";

	// Must access the parent to make an option select properly
	// Support: IE9, IE10
	support.optSelected = opt.selected;

	// Will be defined later
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;
	support.pixelPosition = false;

	// Make sure checked status is properly cloned
	// Support: IE9, IE10
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Check if an input maintains its value after becoming a radio
	// Support: IE9, IE10
	input = document.createElement("input");
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment.appendChild( input );

	// Support: Safari 5.1, Android 4.x, Android 2.3
	// old WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: Firefox, Chrome, Safari
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	support.focusinBubbles = "onfocusin" in window;

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv,
			// Support: Firefox, Android 2.3 (Prefixed box-sizing versions).
			divReset = "padding:0;margin:0;border:0;display:block;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box",
			body = document.getElementsByTagName("body")[ 0 ];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		// Check box-sizing and margin behavior.
		body.appendChild( container ).appendChild( div );
		div.innerHTML = "";
		// Support: Firefox, Android 2.3 (Prefixed box-sizing versions).
		div.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Support: Android 2.3
			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		body.removeChild( container );
	});

	return support;
})( {} );

/*
	Implementation Summary

	1. Enforce API surface and semantic compatibility with 1.9.x branch
	2. Improve the module's maintainability by reducing the storage
		paths to a single mechanism.
	3. Use the same single mechanism to support "private" and "user" data.
	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
	5. Avoid exposing implementation details on user objects (eg. expando properties)
	6. Provide a clear path for implementation upgrade to WeakMap in 2014
*/
var data_user, data_priv,
	rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function Data() {
	// Support: Android < 4,
	// Old WebKit does not have Object.preventExtensions/freeze method,
	// return new empty object instead with no [[set]] accessor
	Object.defineProperty( this.cache = {}, 0, {
		get: function() {
			return {};
		}
	});

	this.expando = jQuery.expando + Math.random();
}

Data.uid = 1;

Data.accepts = function( owner ) {
	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType ?
		owner.nodeType === 1 || owner.nodeType === 9 : true;
};

Data.prototype = {
	key: function( owner ) {
		// We can accept data for non-element nodes in modern browsers,
		// but we should not, see #8335.
		// Always return the key for a frozen object.
		if ( !Data.accepts( owner ) ) {
			return 0;
		}

		var descriptor = {},
			// Check if the owner object already has a cache key
			unlock = owner[ this.expando ];

		// If not, create one
		if ( !unlock ) {
			unlock = Data.uid++;

			// Secure it in a non-enumerable, non-writable property
			try {
				descriptor[ this.expando ] = { value: unlock };
				Object.defineProperties( owner, descriptor );

			// Support: Android < 4
			// Fallback to a less secure definition
			} catch ( e ) {
				descriptor[ this.expando ] = unlock;
				jQuery.extend( owner, descriptor );
			}
		}

		// Ensure the cache object
		if ( !this.cache[ unlock ] ) {
			this.cache[ unlock ] = {};
		}

		return unlock;
	},
	set: function( owner, data, value ) {
		var prop,
			// There may be an unlock assigned to this node,
			// if there is no entry for this "owner", create one inline
			// and set the unlock as though an owner entry had always existed
			unlock = this.key( owner ),
			cache = this.cache[ unlock ];

		// Handle: [ owner, key, value ] args
		if ( typeof data === "string" ) {
			cache[ data ] = value;

		// Handle: [ owner, { properties } ] args
		} else {
			// Fresh assignments by object are shallow copied
			if ( jQuery.isEmptyObject( cache ) ) {
				jQuery.extend( this.cache[ unlock ], data );
			// Otherwise, copy the properties one-by-one to the cache object
			} else {
				for ( prop in data ) {
					cache[ prop ] = data[ prop ];
				}
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		// Either a valid cache is found, or will be created.
		// New caches will be created and the unlock returned,
		// allowing direct access to the newly created
		// empty data object. A valid owner object must be provided.
		var cache = this.cache[ this.key( owner ) ];

		return key === undefined ?
			cache : cache[ key ];
	},
	access: function( owner, key, value ) {
		var stored;
		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				((key && typeof key === "string") && value === undefined) ) {

			stored = this.get( owner, key );

			return stored !== undefined ?
				stored : this.get( owner, jQuery.camelCase(key) );
		}

		// [*]When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i, name, camel,
			unlock = this.key( owner ),
			cache = this.cache[ unlock ];

		if ( key === undefined ) {
			this.cache[ unlock ] = {};

		} else {
			// Support array or space separated string of keys
			if ( jQuery.isArray( key ) ) {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = key.concat( key.map( jQuery.camelCase ) );
			} else {
				camel = jQuery.camelCase( key );
				// Try the string as a key before any manipulation
				if ( key in cache ) {
					name = [ key, camel ];
				} else {
					// If a key with the spaces exists, use it.
					// Otherwise, create an array by matching non-whitespace
					name = camel;
					name = name in cache ?
						[ name ] : ( name.match( core_rnotwhite ) || [] );
				}
			}

			i = name.length;
			while ( i-- ) {
				delete cache[ name[ i ] ];
			}
		}
	},
	hasData: function( owner ) {
		return !jQuery.isEmptyObject(
			this.cache[ owner[ this.expando ] ] || {}
		);
	},
	discard: function( owner ) {
		if ( owner[ this.expando ] ) {
			delete this.cache[ owner[ this.expando ] ];
		}
	}
};

// These may be used throughout the jQuery core codebase
data_user = new Data();
data_priv = new Data();


jQuery.extend({
	acceptData: Data.accepts,

	hasData: function( elem ) {
		return data_user.hasData( elem ) || data_priv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return data_user.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		data_user.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to data_priv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return data_priv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		data_priv.remove( elem, name );
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			elem = this[ 0 ],
			i = 0,
			data = null;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = data_user.get( elem );

				if ( elem.nodeType === 1 && !data_priv.get( elem, "hasDataAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[ i ].name;

						if ( name.indexOf( "data-" ) === 0 ) {
							name = jQuery.camelCase( name.slice(5) );
							dataAttr( elem, name, data[ name ] );
						}
					}
					data_priv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				data_user.set( this, key );
			});
		}

		return jQuery.access( this, function( value ) {
			var data,
				camelKey = jQuery.camelCase( key );

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {
				// Attempt to get data from the cache
				// with the key as-is
				data = data_user.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to get data from the cache
				// with the key camelized
				data = data_user.get( elem, camelKey );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, camelKey, undefined );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each(function() {
				// First, attempt to store a copy or reference of any
				// data that might've been store with a camelCased key.
				var data = data_user.get( this, camelKey );

				// For HTML5 data-* attribute interop, we have to
				// store property names with dashes in a camelCase form.
				// This might not apply to all properties...*
				data_user.set( this, camelKey, value );

				// *... In the case of properties that might _actually_
				// have dashes, we need to also store a copy of that
				// unchanged property.
				if ( key.indexOf("-") !== -1 && data !== undefined ) {
					data_user.set( this, key, value );
				}
			});
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each(function() {
			data_user.remove( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? JSON.parse( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			data_user.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = data_priv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray( data ) ) {
					queue = data_priv.access( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return data_priv.get( elem, key ) || data_priv.access( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				data_priv.remove( elem, [ type + "queue", key ] );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = data_priv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n\f]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button)$/i;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each(function() {
			delete this[ jQuery.propFix[ name ] || name ];
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					data_priv.set( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : data_priv.get( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// IE6-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					elem[ propName ] = false;
				}

				elem.removeAttribute( name );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				return elem.hasAttribute( "tabindex" ) || rfocusable.test( elem.nodeName ) || elem.href ?
					elem.tabIndex :
					-1;
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;

	jQuery.expr.attrHandle[ name ] = function( elem, name, isXML ) {
		var fn = jQuery.expr.attrHandle[ name ],
			ret = isXML ?
				undefined :
				/* jshint eqeqeq: false */
				// Temporarily disable this handler to check existence
				(jQuery.expr.attrHandle[ name ] = undefined) !=
					getter( elem, name, isXML ) ?

					name.toLowerCase() :
					null;

		// Restore handler
		jQuery.expr.attrHandle[ name ] = fn;

		return ret;
	};
});

// Support: IE9+
// Selectedness for an option in an optgroup can be inaccurate
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !jQuery.support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});
var rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = data_priv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = data_priv.hasData( elem ) && data_priv.get( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;
			data_priv.remove( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( data_priv.get( cur, "events" ) || {} )[ event.type ] && data_priv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, j, ret, matched, handleObj,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( data_priv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, matches, sel, handleObj,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.disabled !== true || event.type !== "click" ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: Cordova 2.5 (WebKit) (#13255)
		// All events should have a target; Cordova deviceready doesn't
		if ( !event.target ) {
			event.target = document;
		}

		// Support: Safari 6.0+, Chrome < 28
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle, false );
	}
};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && e.preventDefault ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && e.stopPropagation ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
// Support: Chrome 15+
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// Create "bubbling" focus and blur events
// Support: Firefox, Chrome, Safari
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
var isSimple = /^.[^:#\[\.,]*$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},

	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter(function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},

	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			pos = ( rneedsContext.test( selectors ) || typeof selectors !== "string" ) ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					cur = matched.push( cur );
					break;
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.unique( matched ) : matched );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return core_indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return core_indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	while ( (cur = cur[dir]) && cur.nodeType !== 1 ) {}

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return elem.contentDocument || jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.unique( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			truncate = until !== undefined;

		while ( (elem = elem[ dir ]) && elem.nodeType !== 9 ) {
			if ( elem.nodeType === 1 ) {
				if ( truncate && jQuery( elem ).is( until ) ) {
					break;
				}
				matched.push( elem );
			}
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var matched = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				matched.push( n );
			}
		}

		return matched;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( core_indexOf.call( qualifier, elem ) >= 0 ) !== not;
	});
}
var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {

		// Support: IE 9
		option: [ 1, "<select multiple='multiple'>", "</select>" ],

		thead: [ 1, "<table>", "</table>" ],
		col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		_default: [ 0, "", "" ]
	};

// Support: IE 9
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[ 0 ] && this[ 0 ].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {
			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var
			// Snapshot the DOM in case .domManip sweeps something relevant into its fragment
			args = jQuery.map( this, function( elem ) {
				return [ elem.nextSibling, elem.parentNode ];
			}),
			i = 0;

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			var next = args[ i++ ],
				parent = args[ i++ ];

			if ( parent ) {
				// Don't use the snapshot next if it has moved (#13810)
				if ( next && next.parentNode !== parent ) {
					next = this.nextSibling;
				}
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		// Allow new content to include elements from the context set
		}, true );

		// Force removal if there was no new content (e.g., from empty arguments)
		return i ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback, allowIntersection ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var fragment, first, scripts, hasScripts, node, doc,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[ 0 ],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[ 0 ] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback, allowIntersection );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							// Support: QtWebKit
							// jQuery.merge because core_push.apply(_, arraylike) throws
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[ i ], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!data_priv.access( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery._evalUrl( node.src );
							} else {
								jQuery.globalEval( node.textContent.replace( rcleanScript, "" ) );
							}
						}
					}
				}
			}
		}

		return this;
	}
});

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: QtWebKit
			// .get() because core_push.apply(_, arraylike) throws
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Support: IE >= 9
		// Fix Cloning issues
		if ( !jQuery.support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) && !jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var elem, tmp, tag, wrap, contains, j,
			i = 0,
			l = elems.length,
			fragment = context.createDocumentFragment(),
			nodes = [];

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					// Support: QtWebKit
					// jQuery.merge because core_push.apply(_, arraylike) throws
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || fragment.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[ 1 ].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;
					tmp.innerHTML = wrap[ 1 ] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[ 2 ];

					// Descend through wrappers to the right content
					j = wrap[ 0 ];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Support: QtWebKit
					// jQuery.merge because core_push.apply(_, arraylike) throws
					jQuery.merge( nodes, tmp.childNodes );

					// Remember the top-level container
					tmp = fragment.firstChild;

					// Fixes #12346
					// Support: Webkit, IE
					tmp.textContent = "";
				}
			}
		}

		// Remove wrapper from fragment
		fragment.textContent = "";

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( fragment.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		return fragment;
	},

	cleanData: function( elems ) {
		var data, elem, events, type, key, j,
			special = jQuery.event.special,
			i = 0;

		for ( ; (elem = elems[ i ]) !== undefined; i++ ) {
			if ( Data.accepts( elem ) ) {
				key = elem[ data_priv.expando ];

				if ( key && (data = data_priv.cache[ key ]) ) {
					events = Object.keys( data.events || {} );
					if ( events.length ) {
						for ( j = 0; (type = events[j]) !== undefined; j++ ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}
					if ( data_priv.cache[ key ] ) {
						// Discard any remaining `private` data
						delete data_priv.cache[ key ];
					}
				}
			}
			// Discard any remaining `user` data
			delete data_user.cache[ elem[ data_user.expando ] ];
		}
	},

	_evalUrl: function( url ) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	}
});

// Support: 1.x compatibility
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute("type");
	}

	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var l = elems.length,
		i = 0;

	for ( ; i < l; i++ ) {
		data_priv.set(
			elems[ i ], "globalEval", !refElements || data_priv.get( refElements[ i ], "globalEval" )
		);
	}
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( data_priv.hasData( src ) ) {
		pdataOld = data_priv.access( src );
		pdataCur = data_priv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( data_user.hasData( src ) ) {
		udataOld = data_user.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		data_user.set( dest, udataCur );
	}
}


function getAll( context, tag ) {
	var ret = context.getElementsByTagName ? context.getElementsByTagName( tag || "*" ) :
			context.querySelectorAll ? context.querySelectorAll( tag || "*" ) :
			[];

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], ret ) :
		ret;
}

// Support: IE >= 9
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}
jQuery.fn.extend({
	wrapAll: function( html ) {
		var wrap;

		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapAll( html.call(this, i) );
			});
		}

		if ( this[ 0 ] ) {

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});
var curCSS, iframe,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
function getStyles( elem ) {
	return window.getComputedStyle( elem, null );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = data_priv.get( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = data_priv.access( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					data_priv.set( elem, "olddisplay", hidden ? display : jQuery.css(elem, "display") );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifying setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {
				style[ name ] = value;
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

curCSS = function( elem, name, _computed ) {
	var width, minWidth, maxWidth,
		computed = _computed || getStyles( elem ),

		// Support: IE9
		// getPropertyValue is only needed for .css('filter') in IE9, see #12537
		ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
		style = elem.style;

	if ( computed ) {

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// Support: Safari 5.1
		// A tribute to the "awesome hack by Dean Edwards"
		// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
		// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
		if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret;
};


function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	// Support: Android 2.3
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// Support: Android 2.3
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0;
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});
var
	// Document location
	ajaxLocParts,
	ajaxLocation,

	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, type, response,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,
			// URL without anti-cache param
			cacheURL,
			// Response headers
			responseHeadersString,
			responseHeaders,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" )
			.replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

		// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {
	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery("<script>").prop({
					async: true,
					charset: s.scriptCharset,
					src: s.url
				}).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
jQuery.ajaxSettings.xhr = function() {
	try {
		return new XMLHttpRequest();
	} catch( e ) {}
};

var xhrSupported = jQuery.ajaxSettings.xhr(),
	xhrSuccessStatus = {
		// file protocol always yields status code 0, assume 200
		0: 200,
		// Support: IE9
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	// Support: IE9
	// We need to keep track of outbound xhr and abort them manually
	// because IE is not smart enough to do it all by itself
	xhrId = 0,
	xhrCallbacks = {};

if ( window.ActiveXObject ) {
	jQuery( window ).on( "unload", function() {
		for( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]();
		}
		xhrCallbacks = undefined;
	});
}

jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
jQuery.support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport(function( options ) {
	var callback;
	// Cross domain only allowed if supported through XMLHttpRequest
	if ( jQuery.support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i, id,
					xhr = options.xhr();
				xhr.open( options.type, options.url, options.async, options.username, options.password );
				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}
				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}
				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers["X-Requested-With"] ) {
					headers["X-Requested-With"] = "XMLHttpRequest";
				}
				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}
				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							delete xhrCallbacks[ id ];
							callback = xhr.onload = xhr.onerror = null;
							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {
								complete(
									// file protocol always yields status 0, assume 404
									xhr.status || 404,
									xhr.statusText
								);
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,
									// Support: IE9
									// #11426: When requesting binary data, IE9 will throw an exception
									// on any attempt to access responseText
									typeof xhr.responseText === "string" ? {
										text: xhr.responseText
									} : undefined,
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};
				// Listen to events
				xhr.onload = callback();
				xhr.onerror = callback("error");
				// Create the abort callback
				callback = xhrCallbacks[( id = xhrId++ )] = callback("abort");
				// Do send the request
				// This may raise an exception which is actually
				// handled in jQuery.ajax (so no try/catch here)
				xhr.send( options.hasContent && options.data || null );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
});
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = data_priv.get( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE9-10 do not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			style.display = "inline-block";
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always(function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		});
	}


	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// If there is dataShow left over from a stopped hide or show and we are going to proceed with show, we should pretend to be hidden
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = data_priv.access( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;

			data_priv.remove( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || data_priv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = data_priv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = data_priv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		elem = this[ 0 ],
		box = { top: 0, left: 0 },
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top + win.pageYOffset - docElem.clientTop,
		left: box.left + win.pageXOffset - docElem.clientLeft
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) && ( curCSSTop + curCSSLeft ).indexOf("auto") > -1;

		// Need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// We assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();

		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;

			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || docElem;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : window.pageXOffset,
					top ? val : window.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;

// })();
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
	// Expose jQuery as module.exports in loaders that implement the Node
	// module pattern (including browserify). Do not create the global, since
	// the user will be storing it themselves locally, and globals are frowned
	// upon in the Node module world.
	module.exports = jQuery;
} else {
	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	if ( typeof define === "function" && define.amd ) {
		define( "jquery", [], function () { return jQuery; } );
	}
}

// If there is a window object, that at least has a document property,
// define jQuery and $ identifiers
if ( typeof window === "object" && typeof window.document === "object" ) {
	window.jQuery = window.$ = jQuery;
}

})( window );
;//! moment.js
//! version : 2.5.1
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

(function (undefined) {

    /************************************
        Constants
    ************************************/

    var moment,
        VERSION = "2.5.1",
        global = this,
        round = Math.round,
        i,

        YEAR = 0,
        MONTH = 1,
        DATE = 2,
        HOUR = 3,
        MINUTE = 4,
        SECOND = 5,
        MILLISECOND = 6,

        // internal storage for language config files
        languages = {},

        // moment internal properties
        momentProperties = {
            _isAMomentObject: null,
            _i : null,
            _f : null,
            _l : null,
            _strict : null,
            _isUTC : null,
            _offset : null,  // optional. Combine with _isUTC
            _pf : null,
            _lang : null  // optional
        },

        // check for nodeJS
        hasModule = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined'),

        // ASP.NET json date format regex
        aspNetJsonRegex = /^\/?Date\((\-?\d+)/i,
        aspNetTimeSpanJsonRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,

        // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
        // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
        isoDurationRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/,

        // format tokens
        formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|X|zz?|ZZ?|.)/g,
        localFormattingTokens = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g,

        // parsing token regexes
        parseTokenOneOrTwoDigits = /\d\d?/, // 0 - 99
        parseTokenOneToThreeDigits = /\d{1,3}/, // 0 - 999
        parseTokenOneToFourDigits = /\d{1,4}/, // 0 - 9999
        parseTokenOneToSixDigits = /[+\-]?\d{1,6}/, // -999,999 - 999,999
        parseTokenDigits = /\d+/, // nonzero number of digits
        parseTokenWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, // any word (or two) characters or numbers including two/three word month in arabic.
        parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/gi, // +00:00 -00:00 +0000 -0000 or Z
        parseTokenT = /T/i, // T (ISO separator)
        parseTokenTimestampMs = /[\+\-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123

        //strict parsing regexes
        parseTokenOneDigit = /\d/, // 0 - 9
        parseTokenTwoDigits = /\d\d/, // 00 - 99
        parseTokenThreeDigits = /\d{3}/, // 000 - 999
        parseTokenFourDigits = /\d{4}/, // 0000 - 9999
        parseTokenSixDigits = /[+-]?\d{6}/, // -999,999 - 999,999
        parseTokenSignedNumber = /[+-]?\d+/, // -inf - inf

        // iso 8601 regex
        // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
        isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,

        isoFormat = 'YYYY-MM-DDTHH:mm:ssZ',

        isoDates = [
            ['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/],
            ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/],
            ['GGGG-[W]WW-E', /\d{4}-W\d{2}-\d/],
            ['GGGG-[W]WW', /\d{4}-W\d{2}/],
            ['YYYY-DDD', /\d{4}-\d{3}/]
        ],

        // iso time formats and regexes
        isoTimes = [
            ['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d{1,3}/],
            ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
            ['HH:mm', /(T| )\d\d:\d\d/],
            ['HH', /(T| )\d\d/]
        ],

        // timezone chunker "+10:00" > ["10", "00"] or "-1530" > ["-15", "30"]
        parseTimezoneChunker = /([\+\-]|\d\d)/gi,

        // getter and setter names
        proxyGettersAndSetters = 'Date|Hours|Minutes|Seconds|Milliseconds'.split('|'),
        unitMillisecondFactors = {
            'Milliseconds' : 1,
            'Seconds' : 1e3,
            'Minutes' : 6e4,
            'Hours' : 36e5,
            'Days' : 864e5,
            'Months' : 2592e6,
            'Years' : 31536e6
        },

        unitAliases = {
            ms : 'millisecond',
            s : 'second',
            m : 'minute',
            h : 'hour',
            d : 'day',
            D : 'date',
            w : 'week',
            W : 'isoWeek',
            M : 'month',
            y : 'year',
            DDD : 'dayOfYear',
            e : 'weekday',
            E : 'isoWeekday',
            gg: 'weekYear',
            GG: 'isoWeekYear'
        },

        camelFunctions = {
            dayofyear : 'dayOfYear',
            isoweekday : 'isoWeekday',
            isoweek : 'isoWeek',
            weekyear : 'weekYear',
            isoweekyear : 'isoWeekYear'
        },

        // format function strings
        formatFunctions = {},

        // tokens to ordinalize and pad
        ordinalizeTokens = 'DDD w W M D d'.split(' '),
        paddedTokens = 'M D H h m s w W'.split(' '),

        formatTokenFunctions = {
            M    : function () {
                return this.month() + 1;
            },
            MMM  : function (format) {
                return this.lang().monthsShort(this, format);
            },
            MMMM : function (format) {
                return this.lang().months(this, format);
            },
            D    : function () {
                return this.date();
            },
            DDD  : function () {
                return this.dayOfYear();
            },
            d    : function () {
                return this.day();
            },
            dd   : function (format) {
                return this.lang().weekdaysMin(this, format);
            },
            ddd  : function (format) {
                return this.lang().weekdaysShort(this, format);
            },
            dddd : function (format) {
                return this.lang().weekdays(this, format);
            },
            w    : function () {
                return this.week();
            },
            W    : function () {
                return this.isoWeek();
            },
            YY   : function () {
                return leftZeroFill(this.year() % 100, 2);
            },
            YYYY : function () {
                return leftZeroFill(this.year(), 4);
            },
            YYYYY : function () {
                return leftZeroFill(this.year(), 5);
            },
            YYYYYY : function () {
                var y = this.year(), sign = y >= 0 ? '+' : '-';
                return sign + leftZeroFill(Math.abs(y), 6);
            },
            gg   : function () {
                return leftZeroFill(this.weekYear() % 100, 2);
            },
            gggg : function () {
                return leftZeroFill(this.weekYear(), 4);
            },
            ggggg : function () {
                return leftZeroFill(this.weekYear(), 5);
            },
            GG   : function () {
                return leftZeroFill(this.isoWeekYear() % 100, 2);
            },
            GGGG : function () {
                return leftZeroFill(this.isoWeekYear(), 4);
            },
            GGGGG : function () {
                return leftZeroFill(this.isoWeekYear(), 5);
            },
            e : function () {
                return this.weekday();
            },
            E : function () {
                return this.isoWeekday();
            },
            a    : function () {
                return this.lang().meridiem(this.hours(), this.minutes(), true);
            },
            A    : function () {
                return this.lang().meridiem(this.hours(), this.minutes(), false);
            },
            H    : function () {
                return this.hours();
            },
            h    : function () {
                return this.hours() % 12 || 12;
            },
            m    : function () {
                return this.minutes();
            },
            s    : function () {
                return this.seconds();
            },
            S    : function () {
                return toInt(this.milliseconds() / 100);
            },
            SS   : function () {
                return leftZeroFill(toInt(this.milliseconds() / 10), 2);
            },
            SSS  : function () {
                return leftZeroFill(this.milliseconds(), 3);
            },
            SSSS : function () {
                return leftZeroFill(this.milliseconds(), 3);
            },
            Z    : function () {
                var a = -this.zone(),
                    b = "+";
                if (a < 0) {
                    a = -a;
                    b = "-";
                }
                return b + leftZeroFill(toInt(a / 60), 2) + ":" + leftZeroFill(toInt(a) % 60, 2);
            },
            ZZ   : function () {
                var a = -this.zone(),
                    b = "+";
                if (a < 0) {
                    a = -a;
                    b = "-";
                }
                return b + leftZeroFill(toInt(a / 60), 2) + leftZeroFill(toInt(a) % 60, 2);
            },
            z : function () {
                return this.zoneAbbr();
            },
            zz : function () {
                return this.zoneName();
            },
            X    : function () {
                return this.unix();
            },
            Q : function () {
                return this.quarter();
            }
        },

        lists = ['months', 'monthsShort', 'weekdays', 'weekdaysShort', 'weekdaysMin'];

    function defaultParsingFlags() {
        // We need to deep clone this object, and es5 standard is not very
        // helpful.
        return {
            empty : false,
            unusedTokens : [],
            unusedInput : [],
            overflow : -2,
            charsLeftOver : 0,
            nullInput : false,
            invalidMonth : null,
            invalidFormat : false,
            userInvalidated : false,
            iso: false
        };
    }

    function padToken(func, count) {
        return function (a) {
            return leftZeroFill(func.call(this, a), count);
        };
    }
    function ordinalizeToken(func, period) {
        return function (a) {
            return this.lang().ordinal(func.call(this, a), period);
        };
    }

    while (ordinalizeTokens.length) {
        i = ordinalizeTokens.pop();
        formatTokenFunctions[i + 'o'] = ordinalizeToken(formatTokenFunctions[i], i);
    }
    while (paddedTokens.length) {
        i = paddedTokens.pop();
        formatTokenFunctions[i + i] = padToken(formatTokenFunctions[i], 2);
    }
    formatTokenFunctions.DDDD = padToken(formatTokenFunctions.DDD, 3);


    /************************************
        Constructors
    ************************************/

    function Language() {

    }

    // Moment prototype object
    function Moment(config) {
        checkOverflow(config);
        extend(this, config);
    }

    // Duration Constructor
    function Duration(duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5; // 1000 * 60 * 60
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            years * 12;

        this._data = {};

        this._bubble();
    }

    /************************************
        Helpers
    ************************************/


    function extend(a, b) {
        for (var i in b) {
            if (b.hasOwnProperty(i)) {
                a[i] = b[i];
            }
        }

        if (b.hasOwnProperty("toString")) {
            a.toString = b.toString;
        }

        if (b.hasOwnProperty("valueOf")) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function cloneMoment(m) {
        var result = {}, i;
        for (i in m) {
            if (m.hasOwnProperty(i) && momentProperties.hasOwnProperty(i)) {
                result[i] = m[i];
            }
        }

        return result;
    }

    function absRound(number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    // left zero fill a number
    // see http://jsperf.com/left-zero-filling for performance comparison
    function leftZeroFill(number, targetLength, forceSign) {
        var output = '' + Math.abs(number),
            sign = number >= 0;

        while (output.length < targetLength) {
            output = '0' + output;
        }
        return (sign ? (forceSign ? '+' : '') : '-') + output;
    }

    // helper function for _.addTime and _.subtractTime
    function addOrSubtractDurationFromMoment(mom, duration, isAdding, ignoreUpdateOffset) {
        var milliseconds = duration._milliseconds,
            days = duration._days,
            months = duration._months,
            minutes,
            hours;

        if (milliseconds) {
            mom._d.setTime(+mom._d + milliseconds * isAdding);
        }
        // store the minutes and hours so we can restore them
        if (days || months) {
            minutes = mom.minute();
            hours = mom.hour();
        }
        if (days) {
            mom.date(mom.date() + days * isAdding);
        }
        if (months) {
            mom.month(mom.month() + months * isAdding);
        }
        if (milliseconds && !ignoreUpdateOffset) {
            moment.updateOffset(mom);
        }
        // restore the minutes and hours after possibly changing dst
        if (days || months) {
            mom.minute(minutes);
            mom.hour(hours);
        }
    }

    // check if is an array
    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }

    function isDate(input) {
        return  Object.prototype.toString.call(input) === '[object Date]' ||
                input instanceof Date;
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function normalizeUnits(units) {
        if (units) {
            var lowered = units.toLowerCase().replace(/(.)s$/, '$1');
            units = unitAliases[units] || camelFunctions[lowered] || lowered;
        }
        return units;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (inputObject.hasOwnProperty(prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    function makeList(field) {
        var count, setter;

        if (field.indexOf('week') === 0) {
            count = 7;
            setter = 'day';
        }
        else if (field.indexOf('month') === 0) {
            count = 12;
            setter = 'month';
        }
        else {
            return;
        }

        moment[field] = function (format, index) {
            var i, getter,
                method = moment.fn._lang[field],
                results = [];

            if (typeof format === 'number') {
                index = format;
                format = undefined;
            }

            getter = function (i) {
                var m = moment().utc().set(setter, i);
                return method.call(moment.fn._lang, m, format || '');
            };

            if (index != null) {
                return getter(index);
            }
            else {
                for (i = 0; i < count; i++) {
                    results.push(getter(i));
                }
                return results;
            }
        };
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            if (coercedNumber >= 0) {
                value = Math.floor(coercedNumber);
            } else {
                value = Math.ceil(coercedNumber);
            }
        }

        return value;
    }

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    function checkOverflow(m) {
        var overflow;
        if (m._a && m._pf.overflow === -2) {
            overflow =
                m._a[MONTH] < 0 || m._a[MONTH] > 11 ? MONTH :
                m._a[DATE] < 1 || m._a[DATE] > daysInMonth(m._a[YEAR], m._a[MONTH]) ? DATE :
                m._a[HOUR] < 0 || m._a[HOUR] > 23 ? HOUR :
                m._a[MINUTE] < 0 || m._a[MINUTE] > 59 ? MINUTE :
                m._a[SECOND] < 0 || m._a[SECOND] > 59 ? SECOND :
                m._a[MILLISECOND] < 0 || m._a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (m._pf._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }

            m._pf.overflow = overflow;
        }
    }

    function isValid(m) {
        if (m._isValid == null) {
            m._isValid = !isNaN(m._d.getTime()) &&
                m._pf.overflow < 0 &&
                !m._pf.empty &&
                !m._pf.invalidMonth &&
                !m._pf.nullInput &&
                !m._pf.invalidFormat &&
                !m._pf.userInvalidated;

            if (m._strict) {
                m._isValid = m._isValid &&
                    m._pf.charsLeftOver === 0 &&
                    m._pf.unusedTokens.length === 0;
            }
        }
        return m._isValid;
    }

    function normalizeLanguage(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function makeAs(input, model) {
        return model._isUTC ? moment(input).zone(model._offset || 0) :
            moment(input).local();
    }

    /************************************
        Languages
    ************************************/


    extend(Language.prototype, {

        set : function (config) {
            var prop, i;
            for (i in config) {
                prop = config[i];
                if (typeof prop === 'function') {
                    this[i] = prop;
                } else {
                    this['_' + i] = prop;
                }
            }
        },

        _months : "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
        months : function (m) {
            return this._months[m.month()];
        },

        _monthsShort : "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
        monthsShort : function (m) {
            return this._monthsShort[m.month()];
        },

        monthsParse : function (monthName) {
            var i, mom, regex;

            if (!this._monthsParse) {
                this._monthsParse = [];
            }

            for (i = 0; i < 12; i++) {
                // make the regex if we don't have it already
                if (!this._monthsParse[i]) {
                    mom = moment.utc([2000, i]);
                    regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                    this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (this._monthsParse[i].test(monthName)) {
                    return i;
                }
            }
        },

        _weekdays : "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
        weekdays : function (m) {
            return this._weekdays[m.day()];
        },

        _weekdaysShort : "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        weekdaysShort : function (m) {
            return this._weekdaysShort[m.day()];
        },

        _weekdaysMin : "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
        weekdaysMin : function (m) {
            return this._weekdaysMin[m.day()];
        },

        weekdaysParse : function (weekdayName) {
            var i, mom, regex;

            if (!this._weekdaysParse) {
                this._weekdaysParse = [];
            }

            for (i = 0; i < 7; i++) {
                // make the regex if we don't have it already
                if (!this._weekdaysParse[i]) {
                    mom = moment([2000, 1]).day(i);
                    regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                    this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (this._weekdaysParse[i].test(weekdayName)) {
                    return i;
                }
            }
        },

        _longDateFormat : {
            LT : "h:mm A",
            L : "MM/DD/YYYY",
            LL : "MMMM D YYYY",
            LLL : "MMMM D YYYY LT",
            LLLL : "dddd, MMMM D YYYY LT"
        },
        longDateFormat : function (key) {
            var output = this._longDateFormat[key];
            if (!output && this._longDateFormat[key.toUpperCase()]) {
                output = this._longDateFormat[key.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function (val) {
                    return val.slice(1);
                });
                this._longDateFormat[key] = output;
            }
            return output;
        },

        isPM : function (input) {
            // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
            // Using charAt should be more compatible.
            return ((input + '').toLowerCase().charAt(0) === 'p');
        },

        _meridiemParse : /[ap]\.?m?\.?/i,
        meridiem : function (hours, minutes, isLower) {
            if (hours > 11) {
                return isLower ? 'pm' : 'PM';
            } else {
                return isLower ? 'am' : 'AM';
            }
        },

        _calendar : {
            sameDay : '[Today at] LT',
            nextDay : '[Tomorrow at] LT',
            nextWeek : 'dddd [at] LT',
            lastDay : '[Yesterday at] LT',
            lastWeek : '[Last] dddd [at] LT',
            sameElse : 'L'
        },
        calendar : function (key, mom) {
            var output = this._calendar[key];
            return typeof output === 'function' ? output.apply(mom) : output;
        },

        _relativeTime : {
            future : "in %s",
            past : "%s ago",
            s : "a few seconds",
            m : "a minute",
            mm : "%d minutes",
            h : "an hour",
            hh : "%d hours",
            d : "a day",
            dd : "%d days",
            M : "a month",
            MM : "%d months",
            y : "a year",
            yy : "%d years"
        },
        relativeTime : function (number, withoutSuffix, string, isFuture) {
            var output = this._relativeTime[string];
            return (typeof output === 'function') ?
                output(number, withoutSuffix, string, isFuture) :
                output.replace(/%d/i, number);
        },
        pastFuture : function (diff, output) {
            var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
            return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
        },

        ordinal : function (number) {
            return this._ordinal.replace("%d", number);
        },
        _ordinal : "%d",

        preparse : function (string) {
            return string;
        },

        postformat : function (string) {
            return string;
        },

        week : function (mom) {
            return weekOfYear(mom, this._week.dow, this._week.doy).week;
        },

        _week : {
            dow : 0, // Sunday is the first day of the week.
            doy : 6  // The week that contains Jan 1st is the first week of the year.
        },

        _invalidDate: 'Invalid date',
        invalidDate: function () {
            return this._invalidDate;
        }
    });

    // Loads a language definition into the `languages` cache.  The function
    // takes a key and optionally values.  If not in the browser and no values
    // are provided, it will load the language file module.  As a convenience,
    // this function also returns the language values.
    function loadLang(key, values) {
        values.abbr = key;
        if (!languages[key]) {
            languages[key] = new Language();
        }
        languages[key].set(values);
        return languages[key];
    }

    // Remove a language from the `languages` cache. Mostly useful in tests.
    function unloadLang(key) {
        delete languages[key];
    }

    // Determines which language definition to use and returns it.
    //
    // With no parameters, it will return the global language.  If you
    // pass in a language key, such as 'en', it will return the
    // definition for 'en', so long as 'en' has already been loaded using
    // moment.lang.
    function getLangDefinition(key) {
        var i = 0, j, lang, next, split,
            get = function (k) {
                if (!languages[k] && hasModule) {
                    try {
                        require('./lang/' + k);
                    } catch (e) { }
                }
                return languages[k];
            };

        if (!key) {
            return moment.fn._lang;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            lang = get(key);
            if (lang) {
                return lang;
            }
            key = [key];
        }

        //pick the language from the array
        //try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
        //substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
        while (i < key.length) {
            split = normalizeLanguage(key[i]).split('-');
            j = split.length;
            next = normalizeLanguage(key[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                lang = get(split.slice(0, j).join('-'));
                if (lang) {
                    return lang;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return moment.fn._lang;
    }

    /************************************
        Formatting
    ************************************/


    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, "");
        }
        return input.replace(/\\/g, "");
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = "";
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {

        if (!m.isValid()) {
            return m.lang().invalidDate();
        }

        format = expandFormat(format, m.lang());

        if (!formatFunctions[format]) {
            formatFunctions[format] = makeFormatFunction(format);
        }

        return formatFunctions[format](m);
    }

    function expandFormat(format, lang) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return lang.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }


    /************************************
        Parsing
    ************************************/


    // get the regex to find the next token
    function getParseRegexForToken(token, config) {
        var a, strict = config._strict;
        switch (token) {
        case 'DDDD':
            return parseTokenThreeDigits;
        case 'YYYY':
        case 'GGGG':
        case 'gggg':
            return strict ? parseTokenFourDigits : parseTokenOneToFourDigits;
        case 'Y':
        case 'G':
        case 'g':
            return parseTokenSignedNumber;
        case 'YYYYYY':
        case 'YYYYY':
        case 'GGGGG':
        case 'ggggg':
            return strict ? parseTokenSixDigits : parseTokenOneToSixDigits;
        case 'S':
            if (strict) { return parseTokenOneDigit; }
            /* falls through */
        case 'SS':
            if (strict) { return parseTokenTwoDigits; }
            /* falls through */
        case 'SSS':
            if (strict) { return parseTokenThreeDigits; }
            /* falls through */
        case 'DDD':
            return parseTokenOneToThreeDigits;
        case 'MMM':
        case 'MMMM':
        case 'dd':
        case 'ddd':
        case 'dddd':
            return parseTokenWord;
        case 'a':
        case 'A':
            return getLangDefinition(config._l)._meridiemParse;
        case 'X':
            return parseTokenTimestampMs;
        case 'Z':
        case 'ZZ':
            return parseTokenTimezone;
        case 'T':
            return parseTokenT;
        case 'SSSS':
            return parseTokenDigits;
        case 'MM':
        case 'DD':
        case 'YY':
        case 'GG':
        case 'gg':
        case 'HH':
        case 'hh':
        case 'mm':
        case 'ss':
        case 'ww':
        case 'WW':
            return strict ? parseTokenTwoDigits : parseTokenOneOrTwoDigits;
        case 'M':
        case 'D':
        case 'd':
        case 'H':
        case 'h':
        case 'm':
        case 's':
        case 'w':
        case 'W':
        case 'e':
        case 'E':
            return parseTokenOneOrTwoDigits;
        default :
            a = new RegExp(regexpEscape(unescapeFormat(token.replace('\\', '')), "i"));
            return a;
        }
    }

    function timezoneMinutesFromString(string) {
        string = string || "";
        var possibleTzMatches = (string.match(parseTokenTimezone) || []),
            tzChunk = possibleTzMatches[possibleTzMatches.length - 1] || [],
            parts = (tzChunk + '').match(parseTimezoneChunker) || ['-', 0, 0],
            minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? -minutes : minutes;
    }

    // function to convert string input to date
    function addTimeToArrayFromToken(token, input, config) {
        var a, datePartArray = config._a;

        switch (token) {
        // MONTH
        case 'M' : // fall through to MM
        case 'MM' :
            if (input != null) {
                datePartArray[MONTH] = toInt(input) - 1;
            }
            break;
        case 'MMM' : // fall through to MMMM
        case 'MMMM' :
            a = getLangDefinition(config._l).monthsParse(input);
            // if we didn't find a month name, mark the date as invalid.
            if (a != null) {
                datePartArray[MONTH] = a;
            } else {
                config._pf.invalidMonth = input;
            }
            break;
        // DAY OF MONTH
        case 'D' : // fall through to DD
        case 'DD' :
            if (input != null) {
                datePartArray[DATE] = toInt(input);
            }
            break;
        // DAY OF YEAR
        case 'DDD' : // fall through to DDDD
        case 'DDDD' :
            if (input != null) {
                config._dayOfYear = toInt(input);
            }

            break;
        // YEAR
        case 'YY' :
            datePartArray[YEAR] = toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
            break;
        case 'YYYY' :
        case 'YYYYY' :
        case 'YYYYYY' :
            datePartArray[YEAR] = toInt(input);
            break;
        // AM / PM
        case 'a' : // fall through to A
        case 'A' :
            config._isPm = getLangDefinition(config._l).isPM(input);
            break;
        // 24 HOUR
        case 'H' : // fall through to hh
        case 'HH' : // fall through to hh
        case 'h' : // fall through to hh
        case 'hh' :
            datePartArray[HOUR] = toInt(input);
            break;
        // MINUTE
        case 'm' : // fall through to mm
        case 'mm' :
            datePartArray[MINUTE] = toInt(input);
            break;
        // SECOND
        case 's' : // fall through to ss
        case 'ss' :
            datePartArray[SECOND] = toInt(input);
            break;
        // MILLISECOND
        case 'S' :
        case 'SS' :
        case 'SSS' :
        case 'SSSS' :
            datePartArray[MILLISECOND] = toInt(('0.' + input) * 1000);
            break;
        // UNIX TIMESTAMP WITH MS
        case 'X':
            config._d = new Date(parseFloat(input) * 1000);
            break;
        // TIMEZONE
        case 'Z' : // fall through to ZZ
        case 'ZZ' :
            config._useUTC = true;
            config._tzm = timezoneMinutesFromString(input);
            break;
        case 'w':
        case 'ww':
        case 'W':
        case 'WW':
        case 'd':
        case 'dd':
        case 'ddd':
        case 'dddd':
        case 'e':
        case 'E':
            token = token.substr(0, 1);
            /* falls through */
        case 'gg':
        case 'gggg':
        case 'GG':
        case 'GGGG':
        case 'GGGGG':
            token = token.substr(0, 2);
            if (input) {
                config._w = config._w || {};
                config._w[token] = input;
            }
            break;
        }
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function dateFromConfig(config) {
        var i, date, input = [], currentDate,
            yearToUse, fixYear, w, temp, lang, weekday, week;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            fixYear = function (val) {
                var int_val = parseInt(val, 10);
                return val ?
                  (val.length < 3 ? (int_val > 68 ? 1900 + int_val : 2000 + int_val) : int_val) :
                  (config._a[YEAR] == null ? moment().weekYear() : config._a[YEAR]);
            };

            w = config._w;
            if (w.GG != null || w.W != null || w.E != null) {
                temp = dayOfYearFromWeeks(fixYear(w.GG), w.W || 1, w.E, 4, 1);
            }
            else {
                lang = getLangDefinition(config._l);
                weekday = w.d != null ?  parseWeekday(w.d, lang) :
                  (w.e != null ?  parseInt(w.e, 10) + lang._week.dow : 0);

                week = parseInt(w.w, 10) || 1;

                //if we're parsing 'd', then the low day numbers may be next week
                if (w.d != null && weekday < lang._week.dow) {
                    week++;
                }

                temp = dayOfYearFromWeeks(fixYear(w.gg), week, weekday, lang._week.doy, lang._week.dow);
            }

            config._a[YEAR] = temp.year;
            config._dayOfYear = temp.dayOfYear;
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = config._a[YEAR] == null ? currentDate[YEAR] : config._a[YEAR];

            if (config._dayOfYear > daysInYear(yearToUse)) {
                config._pf._overflowDayOfYear = true;
            }

            date = makeUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // add the offsets to the time to be parsed so that we can have a clean array for checking isValid
        input[HOUR] += toInt((config._tzm || 0) / 60);
        input[MINUTE] += toInt((config._tzm || 0) % 60);

        config._d = (config._useUTC ? makeUTCDate : makeDate).apply(null, input);
    }

    function dateFromObject(config) {
        var normalizedInput;

        if (config._d) {
            return;
        }

        normalizedInput = normalizeObjectUnits(config._i);
        config._a = [
            normalizedInput.year,
            normalizedInput.month,
            normalizedInput.day,
            normalizedInput.hour,
            normalizedInput.minute,
            normalizedInput.second,
            normalizedInput.millisecond
        ];

        dateFromConfig(config);
    }

    function currentDateArray(config) {
        var now = new Date();
        if (config._useUTC) {
            return [
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate()
            ];
        } else {
            return [now.getFullYear(), now.getMonth(), now.getDate()];
        }
    }

    // date from string and format string
    function makeDateFromStringAndFormat(config) {

        config._a = [];
        config._pf.empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var lang = getLangDefinition(config._l),
            string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, lang).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    config._pf.unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    config._pf.empty = false;
                }
                else {
                    config._pf.unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                config._pf.unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        config._pf.charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            config._pf.unusedInput.push(string);
        }

        // handle am pm
        if (config._isPm && config._a[HOUR] < 12) {
            config._a[HOUR] += 12;
        }
        // if is 12 am, change hours to 0
        if (config._isPm === false && config._a[HOUR] === 12) {
            config._a[HOUR] = 0;
        }

        dateFromConfig(config);
        checkOverflow(config);
    }

    function unescapeFormat(s) {
        return s.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        });
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function regexpEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    // date from string and array of format strings
    function makeDateFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            config._pf.invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = extend({}, config);
            tempConfig._pf = defaultParsingFlags();
            tempConfig._f = config._f[i];
            makeDateFromStringAndFormat(tempConfig);

            if (!isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += tempConfig._pf.charsLeftOver;

            //or tokens
            currentScore += tempConfig._pf.unusedTokens.length * 10;

            tempConfig._pf.score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    // date from iso format
    function makeDateFromString(config) {
        var i, l,
            string = config._i,
            match = isoRegex.exec(string);

        if (match) {
            config._pf.iso = true;
            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(string)) {
                    // match[5] should be "T" or undefined
                    config._f = isoDates[i][0] + (match[6] || " ");
                    break;
                }
            }
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(string)) {
                    config._f += isoTimes[i][0];
                    break;
                }
            }
            if (string.match(parseTokenTimezone)) {
                config._f += "Z";
            }
            makeDateFromStringAndFormat(config);
        }
        else {
            config._d = new Date(string);
        }
    }

    function makeDateFromInput(config) {
        var input = config._i,
            matched = aspNetJsonRegex.exec(input);

        if (input === undefined) {
            config._d = new Date();
        } else if (matched) {
            config._d = new Date(+matched[1]);
        } else if (typeof input === 'string') {
            makeDateFromString(config);
        } else if (isArray(input)) {
            config._a = input.slice(0);
            dateFromConfig(config);
        } else if (isDate(input)) {
            config._d = new Date(+input);
        } else if (typeof(input) === 'object') {
            dateFromObject(config);
        } else {
            config._d = new Date(input);
        }
    }

    function makeDate(y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor doesn't accept years < 1970
        if (y < 1970) {
            date.setFullYear(y);
        }
        return date;
    }

    function makeUTCDate(y) {
        var date = new Date(Date.UTC.apply(null, arguments));
        if (y < 1970) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    function parseWeekday(input, language) {
        if (typeof input === 'string') {
            if (!isNaN(input)) {
                input = parseInt(input, 10);
            }
            else {
                input = language.weekdaysParse(input);
                if (typeof input !== 'number') {
                    return null;
                }
            }
        }
        return input;
    }

    /************************************
        Relative Time
    ************************************/


    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, lang) {
        return lang.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime(milliseconds, withoutSuffix, lang) {
        var seconds = round(Math.abs(milliseconds) / 1000),
            minutes = round(seconds / 60),
            hours = round(minutes / 60),
            days = round(hours / 24),
            years = round(days / 365),
            args = seconds < 45 && ['s', seconds] ||
                minutes === 1 && ['m'] ||
                minutes < 45 && ['mm', minutes] ||
                hours === 1 && ['h'] ||
                hours < 22 && ['hh', hours] ||
                days === 1 && ['d'] ||
                days <= 25 && ['dd', days] ||
                days <= 45 && ['M'] ||
                days < 345 && ['MM', round(days / 30)] ||
                years === 1 && ['y'] || ['yy', years];
        args[2] = withoutSuffix;
        args[3] = milliseconds > 0;
        args[4] = lang;
        return substituteTimeAgo.apply({}, args);
    }


    /************************************
        Week of Year
    ************************************/


    // firstDayOfWeek       0 = sun, 6 = sat
    //                      the day of the week that starts the week
    //                      (usually sunday or monday)
    // firstDayOfWeekOfYear 0 = sun, 6 = sat
    //                      the first week is the week that contains the first
    //                      of this day of the week
    //                      (eg. ISO weeks use thursday (4))
    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
        var end = firstDayOfWeekOfYear - firstDayOfWeek,
            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
            adjustedMoment;


        if (daysToDayOfWeek > end) {
            daysToDayOfWeek -= 7;
        }

        if (daysToDayOfWeek < end - 7) {
            daysToDayOfWeek += 7;
        }

        adjustedMoment = moment(mom).add('d', daysToDayOfWeek);
        return {
            week: Math.ceil(adjustedMoment.dayOfYear() / 7),
            year: adjustedMoment.year()
        };
    }

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {
        var d = makeUTCDate(year, 0, 1).getUTCDay(), daysToAdd, dayOfYear;

        weekday = weekday != null ? weekday : firstDayOfWeek;
        daysToAdd = firstDayOfWeek - d + (d > firstDayOfWeekOfYear ? 7 : 0) - (d < firstDayOfWeek ? 7 : 0);
        dayOfYear = 7 * (week - 1) + (weekday - firstDayOfWeek) + daysToAdd + 1;

        return {
            year: dayOfYear > 0 ? year : year - 1,
            dayOfYear: dayOfYear > 0 ?  dayOfYear : daysInYear(year - 1) + dayOfYear
        };
    }

    /************************************
        Top Level Functions
    ************************************/

    function makeMoment(config) {
        var input = config._i,
            format = config._f;

        if (input === null) {
            return moment.invalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = getLangDefinition().preparse(input);
        }

        if (moment.isMoment(input)) {
            config = cloneMoment(input);

            config._d = new Date(+input._d);
        } else if (format) {
            if (isArray(format)) {
                makeDateFromStringAndArray(config);
            } else {
                makeDateFromStringAndFormat(config);
            }
        } else {
            makeDateFromInput(config);
        }

        return new Moment(config);
    }

    moment = function (input, format, lang, strict) {
        var c;

        if (typeof(lang) === "boolean") {
            strict = lang;
            lang = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c = {};
        c._isAMomentObject = true;
        c._i = input;
        c._f = format;
        c._l = lang;
        c._strict = strict;
        c._isUTC = false;
        c._pf = defaultParsingFlags();

        return makeMoment(c);
    };

    // creating with utc
    moment.utc = function (input, format, lang, strict) {
        var c;

        if (typeof(lang) === "boolean") {
            strict = lang;
            lang = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c = {};
        c._isAMomentObject = true;
        c._useUTC = true;
        c._isUTC = true;
        c._l = lang;
        c._i = input;
        c._f = format;
        c._strict = strict;
        c._pf = defaultParsingFlags();

        return makeMoment(c).utc();
    };

    // creating with unix timestamp (in seconds)
    moment.unix = function (input) {
        return moment(input * 1000);
    };

    // duration
    moment.duration = function (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            parseIso;

        if (moment.isDuration(input)) {
            duration = {
                ms: input._milliseconds,
                d: input._days,
                M: input._months
            };
        } else if (typeof input === 'number') {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetTimeSpanJsonRegex.exec(input))) {
            sign = (match[1] === "-") ? -1 : 1;
            duration = {
                y: 0,
                d: toInt(match[DATE]) * sign,
                h: toInt(match[HOUR]) * sign,
                m: toInt(match[MINUTE]) * sign,
                s: toInt(match[SECOND]) * sign,
                ms: toInt(match[MILLISECOND]) * sign
            };
        } else if (!!(match = isoDurationRegex.exec(input))) {
            sign = (match[1] === "-") ? -1 : 1;
            parseIso = function (inp) {
                // We'd normally use ~~inp for this, but unfortunately it also
                // converts floats to ints.
                // inp may be undefined, so careful calling replace on it.
                var res = inp && parseFloat(inp.replace(',', '.'));
                // apply sign while we're at it
                return (isNaN(res) ? 0 : res) * sign;
            };
            duration = {
                y: parseIso(match[2]),
                M: parseIso(match[3]),
                d: parseIso(match[4]),
                h: parseIso(match[5]),
                m: parseIso(match[6]),
                s: parseIso(match[7]),
                w: parseIso(match[8])
            };
        }

        ret = new Duration(duration);

        if (moment.isDuration(input) && input.hasOwnProperty('_lang')) {
            ret._lang = input._lang;
        }

        return ret;
    };

    // version number
    moment.version = VERSION;

    // default format
    moment.defaultFormat = isoFormat;

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    moment.updateOffset = function () {};

    // This function will load languages and then set the global language.  If
    // no arguments are passed in, it will simply return the current global
    // language key.
    moment.lang = function (key, values) {
        var r;
        if (!key) {
            return moment.fn._lang._abbr;
        }
        if (values) {
            loadLang(normalizeLanguage(key), values);
        } else if (values === null) {
            unloadLang(key);
            key = 'en';
        } else if (!languages[key]) {
            getLangDefinition(key);
        }
        r = moment.duration.fn._lang = moment.fn._lang = getLangDefinition(key);
        return r._abbr;
    };

    // returns language data
    moment.langData = function (key) {
        if (key && key._lang && key._lang._abbr) {
            key = key._lang._abbr;
        }
        return getLangDefinition(key);
    };

    // compare moment object
    moment.isMoment = function (obj) {
        return obj instanceof Moment ||
            (obj != null &&  obj.hasOwnProperty('_isAMomentObject'));
    };

    // for typechecking Duration objects
    moment.isDuration = function (obj) {
        return obj instanceof Duration;
    };

    for (i = lists.length - 1; i >= 0; --i) {
        makeList(lists[i]);
    }

    moment.normalizeUnits = function (units) {
        return normalizeUnits(units);
    };

    moment.invalid = function (flags) {
        var m = moment.utc(NaN);
        if (flags != null) {
            extend(m._pf, flags);
        }
        else {
            m._pf.userInvalidated = true;
        }

        return m;
    };

    moment.parseZone = function (input) {
        return moment(input).parseZone();
    };

    /************************************
        Moment Prototype
    ************************************/


    extend(moment.fn = Moment.prototype, {

        clone : function () {
            return moment(this);
        },

        valueOf : function () {
            return +this._d + ((this._offset || 0) * 60000);
        },

        unix : function () {
            return Math.floor(+this / 1000);
        },

        toString : function () {
            return this.clone().lang('en').format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
        },

        toDate : function () {
            return this._offset ? new Date(+this) : this._d;
        },

        toISOString : function () {
            var m = moment(this).utc();
            if (0 < m.year() && m.year() <= 9999) {
                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            } else {
                return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        },

        toArray : function () {
            var m = this;
            return [
                m.year(),
                m.month(),
                m.date(),
                m.hours(),
                m.minutes(),
                m.seconds(),
                m.milliseconds()
            ];
        },

        isValid : function () {
            return isValid(this);
        },

        isDSTShifted : function () {

            if (this._a) {
                return this.isValid() && compareArrays(this._a, (this._isUTC ? moment.utc(this._a) : moment(this._a)).toArray()) > 0;
            }

            return false;
        },

        parsingFlags : function () {
            return extend({}, this._pf);
        },

        invalidAt: function () {
            return this._pf.overflow;
        },

        utc : function () {
            return this.zone(0);
        },

        local : function () {
            this.zone(0);
            this._isUTC = false;
            return this;
        },

        format : function (inputString) {
            var output = formatMoment(this, inputString || moment.defaultFormat);
            return this.lang().postformat(output);
        },

        add : function (input, val) {
            var dur;
            // switch args to support add('s', 1) and add(1, 's')
            if (typeof input === 'string') {
                dur = moment.duration(+val, input);
            } else {
                dur = moment.duration(input, val);
            }
            addOrSubtractDurationFromMoment(this, dur, 1);
            return this;
        },

        subtract : function (input, val) {
            var dur;
            // switch args to support subtract('s', 1) and subtract(1, 's')
            if (typeof input === 'string') {
                dur = moment.duration(+val, input);
            } else {
                dur = moment.duration(input, val);
            }
            addOrSubtractDurationFromMoment(this, dur, -1);
            return this;
        },

        diff : function (input, units, asFloat) {
            var that = makeAs(input, this),
                zoneDiff = (this.zone() - that.zone()) * 6e4,
                diff, output;

            units = normalizeUnits(units);

            if (units === 'year' || units === 'month') {
                // average number of days in the months in the given dates
                diff = (this.daysInMonth() + that.daysInMonth()) * 432e5; // 24 * 60 * 60 * 1000 / 2
                // difference in months
                output = ((this.year() - that.year()) * 12) + (this.month() - that.month());
                // adjust by taking difference in days, average number of days
                // and dst in the given months.
                output += ((this - moment(this).startOf('month')) -
                        (that - moment(that).startOf('month'))) / diff;
                // same as above but with zones, to negate all dst
                output -= ((this.zone() - moment(this).startOf('month').zone()) -
                        (that.zone() - moment(that).startOf('month').zone())) * 6e4 / diff;
                if (units === 'year') {
                    output = output / 12;
                }
            } else {
                diff = (this - that);
                output = units === 'second' ? diff / 1e3 : // 1000
                    units === 'minute' ? diff / 6e4 : // 1000 * 60
                    units === 'hour' ? diff / 36e5 : // 1000 * 60 * 60
                    units === 'day' ? (diff - zoneDiff) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                    units === 'week' ? (diff - zoneDiff) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                    diff;
            }
            return asFloat ? output : absRound(output);
        },

        from : function (time, withoutSuffix) {
            return moment.duration(this.diff(time)).lang(this.lang()._abbr).humanize(!withoutSuffix);
        },

        fromNow : function (withoutSuffix) {
            return this.from(moment(), withoutSuffix);
        },

        calendar : function () {
            // We want to compare the start of today, vs this.
            // Getting start-of-today depends on whether we're zone'd or not.
            var sod = makeAs(moment(), this).startOf('day'),
                diff = this.diff(sod, 'days', true),
                format = diff < -6 ? 'sameElse' :
                    diff < -1 ? 'lastWeek' :
                    diff < 0 ? 'lastDay' :
                    diff < 1 ? 'sameDay' :
                    diff < 2 ? 'nextDay' :
                    diff < 7 ? 'nextWeek' : 'sameElse';
            return this.format(this.lang().calendar(format, this));
        },

        isLeapYear : function () {
            return isLeapYear(this.year());
        },

        isDST : function () {
            return (this.zone() < this.clone().month(0).zone() ||
                this.zone() < this.clone().month(5).zone());
        },

        day : function (input) {
            var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
            if (input != null) {
                input = parseWeekday(input, this.lang());
                return this.add({ d : input - day });
            } else {
                return day;
            }
        },

        month : function (input) {
            var utc = this._isUTC ? 'UTC' : '',
                dayOfMonth;

            if (input != null) {
                if (typeof input === 'string') {
                    input = this.lang().monthsParse(input);
                    if (typeof input !== 'number') {
                        return this;
                    }
                }

                dayOfMonth = this.date();
                this.date(1);
                this._d['set' + utc + 'Month'](input);
                this.date(Math.min(dayOfMonth, this.daysInMonth()));

                moment.updateOffset(this);
                return this;
            } else {
                return this._d['get' + utc + 'Month']();
            }
        },

        startOf: function (units) {
            units = normalizeUnits(units);
            // the following switch intentionally omits break keywords
            // to utilize falling through the cases.
            switch (units) {
            case 'year':
                this.month(0);
                /* falls through */
            case 'month':
                this.date(1);
                /* falls through */
            case 'week':
            case 'isoWeek':
            case 'day':
                this.hours(0);
                /* falls through */
            case 'hour':
                this.minutes(0);
                /* falls through */
            case 'minute':
                this.seconds(0);
                /* falls through */
            case 'second':
                this.milliseconds(0);
                /* falls through */
            }

            // weeks are a special case
            if (units === 'week') {
                this.weekday(0);
            } else if (units === 'isoWeek') {
                this.isoWeekday(1);
            }

            return this;
        },

        endOf: function (units) {
            units = normalizeUnits(units);
            return this.startOf(units).add((units === 'isoWeek' ? 'week' : units), 1).subtract('ms', 1);
        },

        isAfter: function (input, units) {
            units = typeof units !== 'undefined' ? units : 'millisecond';
            return +this.clone().startOf(units) > +moment(input).startOf(units);
        },

        isBefore: function (input, units) {
            units = typeof units !== 'undefined' ? units : 'millisecond';
            return +this.clone().startOf(units) < +moment(input).startOf(units);
        },

        isSame: function (input, units) {
            units = units || 'ms';
            return +this.clone().startOf(units) === +makeAs(input, this).startOf(units);
        },

        min: function (other) {
            other = moment.apply(null, arguments);
            return other < this ? this : other;
        },

        max: function (other) {
            other = moment.apply(null, arguments);
            return other > this ? this : other;
        },

        zone : function (input) {
            var offset = this._offset || 0;
            if (input != null) {
                if (typeof input === "string") {
                    input = timezoneMinutesFromString(input);
                }
                if (Math.abs(input) < 16) {
                    input = input * 60;
                }
                this._offset = input;
                this._isUTC = true;
                if (offset !== input) {
                    addOrSubtractDurationFromMoment(this, moment.duration(offset - input, 'm'), 1, true);
                }
            } else {
                return this._isUTC ? offset : this._d.getTimezoneOffset();
            }
            return this;
        },

        zoneAbbr : function () {
            return this._isUTC ? "UTC" : "";
        },

        zoneName : function () {
            return this._isUTC ? "Coordinated Universal Time" : "";
        },

        parseZone : function () {
            if (this._tzm) {
                this.zone(this._tzm);
            } else if (typeof this._i === 'string') {
                this.zone(this._i);
            }
            return this;
        },

        hasAlignedHourOffset : function (input) {
            if (!input) {
                input = 0;
            }
            else {
                input = moment(input).zone();
            }

            return (this.zone() - input) % 60 === 0;
        },

        daysInMonth : function () {
            return daysInMonth(this.year(), this.month());
        },

        dayOfYear : function (input) {
            var dayOfYear = round((moment(this).startOf('day') - moment(this).startOf('year')) / 864e5) + 1;
            return input == null ? dayOfYear : this.add("d", (input - dayOfYear));
        },

        quarter : function () {
            return Math.ceil((this.month() + 1.0) / 3.0);
        },

        weekYear : function (input) {
            var year = weekOfYear(this, this.lang()._week.dow, this.lang()._week.doy).year;
            return input == null ? year : this.add("y", (input - year));
        },

        isoWeekYear : function (input) {
            var year = weekOfYear(this, 1, 4).year;
            return input == null ? year : this.add("y", (input - year));
        },

        week : function (input) {
            var week = this.lang().week(this);
            return input == null ? week : this.add("d", (input - week) * 7);
        },

        isoWeek : function (input) {
            var week = weekOfYear(this, 1, 4).week;
            return input == null ? week : this.add("d", (input - week) * 7);
        },

        weekday : function (input) {
            var weekday = (this.day() + 7 - this.lang()._week.dow) % 7;
            return input == null ? weekday : this.add("d", input - weekday);
        },

        isoWeekday : function (input) {
            // behaves the same as moment#day except
            // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
            // as a setter, sunday should belong to the previous week.
            return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
        },

        get : function (units) {
            units = normalizeUnits(units);
            return this[units]();
        },

        set : function (units, value) {
            units = normalizeUnits(units);
            if (typeof this[units] === 'function') {
                this[units](value);
            }
            return this;
        },

        // If passed a language key, it will set the language for this
        // instance.  Otherwise, it will return the language configuration
        // variables for this instance.
        lang : function (key) {
            if (key === undefined) {
                return this._lang;
            } else {
                this._lang = getLangDefinition(key);
                return this;
            }
        }
    });

    // helper for adding shortcuts
    function makeGetterAndSetter(name, key) {
        moment.fn[name] = moment.fn[name + 's'] = function (input) {
            var utc = this._isUTC ? 'UTC' : '';
            if (input != null) {
                this._d['set' + utc + key](input);
                moment.updateOffset(this);
                return this;
            } else {
                return this._d['get' + utc + key]();
            }
        };
    }

    // loop through and add shortcuts (Month, Date, Hours, Minutes, Seconds, Milliseconds)
    for (i = 0; i < proxyGettersAndSetters.length; i ++) {
        makeGetterAndSetter(proxyGettersAndSetters[i].toLowerCase().replace(/s$/, ''), proxyGettersAndSetters[i]);
    }

    // add shortcut for year (uses different syntax than the getter/setter 'year' == 'FullYear')
    makeGetterAndSetter('year', 'FullYear');

    // add plural methods
    moment.fn.days = moment.fn.day;
    moment.fn.months = moment.fn.month;
    moment.fn.weeks = moment.fn.week;
    moment.fn.isoWeeks = moment.fn.isoWeek;

    // add aliased format methods
    moment.fn.toJSON = moment.fn.toISOString;

    /************************************
        Duration Prototype
    ************************************/


    extend(moment.duration.fn = Duration.prototype, {

        _bubble : function () {
            var milliseconds = this._milliseconds,
                days = this._days,
                months = this._months,
                data = this._data,
                seconds, minutes, hours, years;

            // The following code bubbles up values, see the tests for
            // examples of what that means.
            data.milliseconds = milliseconds % 1000;

            seconds = absRound(milliseconds / 1000);
            data.seconds = seconds % 60;

            minutes = absRound(seconds / 60);
            data.minutes = minutes % 60;

            hours = absRound(minutes / 60);
            data.hours = hours % 24;

            days += absRound(hours / 24);
            data.days = days % 30;

            months += absRound(days / 30);
            data.months = months % 12;

            years = absRound(months / 12);
            data.years = years;
        },

        weeks : function () {
            return absRound(this.days() / 7);
        },

        valueOf : function () {
            return this._milliseconds +
              this._days * 864e5 +
              (this._months % 12) * 2592e6 +
              toInt(this._months / 12) * 31536e6;
        },

        humanize : function (withSuffix) {
            var difference = +this,
                output = relativeTime(difference, !withSuffix, this.lang());

            if (withSuffix) {
                output = this.lang().pastFuture(difference, output);
            }

            return this.lang().postformat(output);
        },

        add : function (input, val) {
            // supports only 2.0-style add(1, 's') or add(moment)
            var dur = moment.duration(input, val);

            this._milliseconds += dur._milliseconds;
            this._days += dur._days;
            this._months += dur._months;

            this._bubble();

            return this;
        },

        subtract : function (input, val) {
            var dur = moment.duration(input, val);

            this._milliseconds -= dur._milliseconds;
            this._days -= dur._days;
            this._months -= dur._months;

            this._bubble();

            return this;
        },

        get : function (units) {
            units = normalizeUnits(units);
            return this[units.toLowerCase() + 's']();
        },

        as : function (units) {
            units = normalizeUnits(units);
            return this['as' + units.charAt(0).toUpperCase() + units.slice(1) + 's']();
        },

        lang : moment.fn.lang,

        toIsoString : function () {
            // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
            var years = Math.abs(this.years()),
                months = Math.abs(this.months()),
                days = Math.abs(this.days()),
                hours = Math.abs(this.hours()),
                minutes = Math.abs(this.minutes()),
                seconds = Math.abs(this.seconds() + this.milliseconds() / 1000);

            if (!this.asSeconds()) {
                // this is the same as C#'s (Noda) and python (isodate)...
                // but not other JS (goog.date)
                return 'P0D';
            }

            return (this.asSeconds() < 0 ? '-' : '') +
                'P' +
                (years ? years + 'Y' : '') +
                (months ? months + 'M' : '') +
                (days ? days + 'D' : '') +
                ((hours || minutes || seconds) ? 'T' : '') +
                (hours ? hours + 'H' : '') +
                (minutes ? minutes + 'M' : '') +
                (seconds ? seconds + 'S' : '');
        }
    });

    function makeDurationGetter(name) {
        moment.duration.fn[name] = function () {
            return this._data[name];
        };
    }

    function makeDurationAsGetter(name, factor) {
        moment.duration.fn['as' + name] = function () {
            return +this / factor;
        };
    }

    for (i in unitMillisecondFactors) {
        if (unitMillisecondFactors.hasOwnProperty(i)) {
            makeDurationAsGetter(i, unitMillisecondFactors[i]);
            makeDurationGetter(i.toLowerCase());
        }
    }

    makeDurationAsGetter('Weeks', 6048e5);
    moment.duration.fn.asMonths = function () {
        return (+this - this.years() * 31536e6) / 2592e6 + this.years() * 12;
    };


    /************************************
        Default Lang
    ************************************/


    // Set default language, other languages will inherit from English.
    moment.lang('en', {
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    /* EMBED_LANGUAGES */

    /************************************
        Exposing Moment
    ************************************/

    function makeGlobal(deprecate) {
        var warned = false, local_moment = moment;
        /*global ender:false */
        if (typeof ender !== 'undefined') {
            return;
        }
        // here, `this` means `window` in the browser, or `global` on the server
        // add `moment` as a global object via a string identifier,
        // for Closure Compiler "advanced" mode
        if (deprecate) {
            global.moment = function () {
                if (!warned && console && console.warn) {
                    warned = true;
                    console.warn(
                            "Accessing Moment through the global scope is " +
                            "deprecated, and will be removed in an upcoming " +
                            "release.");
                }
                return local_moment.apply(null, arguments);
            };
            extend(global.moment, local_moment);
        } else {
            global['moment'] = moment;
        }
    }

    // CommonJS module is defined
    if (hasModule) {
        module.exports = moment;
        makeGlobal(true);
    } else if (typeof define === "function" && define.amd) {
        define("moment", function (require, exports, module) {
            if (module.config && module.config() && module.config().noGlobal !== true) {
                // If user provided noGlobal, he is aware of global
                makeGlobal(module.config().noGlobal === undefined);
            }

            return moment;
        });
    } else {
        makeGlobal();
    }
}).call(this);
;/*!

 handlebars v1.3.0

Copyright (C) 2011 by Yehuda Katz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

@license
*/
/* exported Handlebars */
var Handlebars = (function() {
// handlebars/safe-string.js
var __module4__ = (function() {
  "use strict";
  var __exports__;
  // Build out our basic SafeString type
  function SafeString(string) {
    this.string = string;
  }

  SafeString.prototype.toString = function() {
    return "" + this.string;
  };

  __exports__ = SafeString;
  return __exports__;
})();

// handlebars/utils.js
var __module3__ = (function(__dependency1__) {
  "use strict";
  var __exports__ = {};
  /*jshint -W004 */
  var SafeString = __dependency1__;

  var escape = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;"
  };

  var badChars = /[&<>"'`]/g;
  var possible = /[&<>"'`]/;

  function escapeChar(chr) {
    return escape[chr] || "&amp;";
  }

  function extend(obj, value) {
    for(var key in value) {
      if(Object.prototype.hasOwnProperty.call(value, key)) {
        obj[key] = value[key];
      }
    }
  }

  __exports__.extend = extend;var toString = Object.prototype.toString;
  __exports__.toString = toString;
  // Sourced from lodash
  // https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
  var isFunction = function(value) {
    return typeof value === 'function';
  };
  // fallback for older versions of Chrome and Safari
  if (isFunction(/x/)) {
    isFunction = function(value) {
      return typeof value === 'function' && toString.call(value) === '[object Function]';
    };
  }
  var isFunction;
  __exports__.isFunction = isFunction;
  var isArray = Array.isArray || function(value) {
    return (value && typeof value === 'object') ? toString.call(value) === '[object Array]' : false;
  };
  __exports__.isArray = isArray;

  function escapeExpression(string) {
    // don't escape SafeStrings, since they're already safe
    if (string instanceof SafeString) {
      return string.toString();
    } else if (!string && string !== 0) {
      return "";
    }

    // Force a string conversion as this will be done by the append regardless and
    // the regex test will do this transparently behind the scenes, causing issues if
    // an object's to string has escaped characters in it.
    string = "" + string;

    if(!possible.test(string)) { return string; }
    return string.replace(badChars, escapeChar);
  }

  __exports__.escapeExpression = escapeExpression;function isEmpty(value) {
    if (!value && value !== 0) {
      return true;
    } else if (isArray(value) && value.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  __exports__.isEmpty = isEmpty;
  return __exports__;
})(__module4__);

// handlebars/exception.js
var __module5__ = (function() {
  "use strict";
  var __exports__;

  var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

  function Exception(message, node) {
    var line;
    if (node && node.firstLine) {
      line = node.firstLine;

      message += ' - ' + line + ':' + node.firstColumn;
    }

    var tmp = Error.prototype.constructor.call(this, message);

    // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
    for (var idx = 0; idx < errorProps.length; idx++) {
      this[errorProps[idx]] = tmp[errorProps[idx]];
    }

    if (line) {
      this.lineNumber = line;
      this.column = node.firstColumn;
    }
  }

  Exception.prototype = new Error();

  __exports__ = Exception;
  return __exports__;
})();

// handlebars/base.js
var __module2__ = (function(__dependency1__, __dependency2__) {
  "use strict";
  var __exports__ = {};
  var Utils = __dependency1__;
  var Exception = __dependency2__;

  var VERSION = "1.3.0";
  __exports__.VERSION = VERSION;var COMPILER_REVISION = 4;
  __exports__.COMPILER_REVISION = COMPILER_REVISION;
  var REVISION_CHANGES = {
    1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
    2: '== 1.0.0-rc.3',
    3: '== 1.0.0-rc.4',
    4: '>= 1.0.0'
  };
  __exports__.REVISION_CHANGES = REVISION_CHANGES;
  var isArray = Utils.isArray,
      isFunction = Utils.isFunction,
      toString = Utils.toString,
      objectType = '[object Object]';

  function HandlebarsEnvironment(helpers, partials) {
    this.helpers = helpers || {};
    this.partials = partials || {};

    registerDefaultHelpers(this);
  }

  __exports__.HandlebarsEnvironment = HandlebarsEnvironment;HandlebarsEnvironment.prototype = {
    constructor: HandlebarsEnvironment,

    logger: logger,
    log: log,

    registerHelper: function(name, fn, inverse) {
      if (toString.call(name) === objectType) {
        if (inverse || fn) { throw new Exception('Arg not supported with multiple helpers'); }
        Utils.extend(this.helpers, name);
      } else {
        if (inverse) { fn.not = inverse; }
        this.helpers[name] = fn;
      }
    },

    registerPartial: function(name, str) {
      if (toString.call(name) === objectType) {
        Utils.extend(this.partials,  name);
      } else {
        this.partials[name] = str;
      }
    }
  };

  function registerDefaultHelpers(instance) {
    instance.registerHelper('helperMissing', function(arg) {
      if(arguments.length === 2) {
        return undefined;
      } else {
        throw new Exception("Missing helper: '" + arg + "'");
      }
    });

    instance.registerHelper('blockHelperMissing', function(context, options) {
      var inverse = options.inverse || function() {}, fn = options.fn;

      if (isFunction(context)) { context = context.call(this); }

      if(context === true) {
        return fn(this);
      } else if(context === false || context == null) {
        return inverse(this);
      } else if (isArray(context)) {
        if(context.length > 0) {
          return instance.helpers.each(context, options);
        } else {
          return inverse(this);
        }
      } else {
        return fn(context);
      }
    });

    instance.registerHelper('each', function(context, options) {
      var fn = options.fn, inverse = options.inverse;
      var i = 0, ret = "", data;

      if (isFunction(context)) { context = context.call(this); }

      if (options.data) {
        data = createFrame(options.data);
      }

      if(context && typeof context === 'object') {
        if (isArray(context)) {
          for(var j = context.length; i<j; i++) {
            if (data) {
              data.index = i;
              data.first = (i === 0);
              data.last  = (i === (context.length-1));
            }
            ret = ret + fn(context[i], { data: data });
          }
        } else {
          for(var key in context) {
            if(context.hasOwnProperty(key)) {
              if(data) { 
                data.key = key; 
                data.index = i;
                data.first = (i === 0);
              }
              ret = ret + fn(context[key], {data: data});
              i++;
            }
          }
        }
      }

      if(i === 0){
        ret = inverse(this);
      }

      return ret;
    });

    instance.registerHelper('if', function(conditional, options) {
      if (isFunction(conditional)) { conditional = conditional.call(this); }

      // Default behavior is to render the positive path if the value is truthy and not empty.
      // The `includeZero` option may be set to treat the condtional as purely not empty based on the
      // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
      if ((!options.hash.includeZero && !conditional) || Utils.isEmpty(conditional)) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    });

    instance.registerHelper('unless', function(conditional, options) {
      return instance.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn, hash: options.hash});
    });

    instance.registerHelper('with', function(context, options) {
      if (isFunction(context)) { context = context.call(this); }

      if (!Utils.isEmpty(context)) return options.fn(context);
    });

    instance.registerHelper('log', function(context, options) {
      var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
      instance.log(level, context);
    });
  }

  var logger = {
    methodMap: { 0: 'debug', 1: 'info', 2: 'warn', 3: 'error' },

    // State enum
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    level: 3,

    // can be overridden in the host environment
    log: function(level, obj) {
      if (logger.level <= level) {
        var method = logger.methodMap[level];
        if (typeof console !== 'undefined' && console[method]) {
          console[method].call(console, obj);
        }
      }
    }
  };
  __exports__.logger = logger;
  function log(level, obj) { logger.log(level, obj); }

  __exports__.log = log;var createFrame = function(object) {
    var obj = {};
    Utils.extend(obj, object);
    return obj;
  };
  __exports__.createFrame = createFrame;
  return __exports__;
})(__module3__, __module5__);

// handlebars/runtime.js
var __module6__ = (function(__dependency1__, __dependency2__, __dependency3__) {
  "use strict";
  var __exports__ = {};
  var Utils = __dependency1__;
  var Exception = __dependency2__;
  var COMPILER_REVISION = __dependency3__.COMPILER_REVISION;
  var REVISION_CHANGES = __dependency3__.REVISION_CHANGES;

  function checkRevision(compilerInfo) {
    var compilerRevision = compilerInfo && compilerInfo[0] || 1,
        currentRevision = COMPILER_REVISION;

    if (compilerRevision !== currentRevision) {
      if (compilerRevision < currentRevision) {
        var runtimeVersions = REVISION_CHANGES[currentRevision],
            compilerVersions = REVISION_CHANGES[compilerRevision];
        throw new Exception("Template was precompiled with an older version of Handlebars than the current runtime. "+
              "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").");
      } else {
        // Use the embedded version info since the runtime doesn't know about this revision yet
        throw new Exception("Template was precompiled with a newer version of Handlebars than the current runtime. "+
              "Please update your runtime to a newer version ("+compilerInfo[1]+").");
      }
    }
  }

  __exports__.checkRevision = checkRevision;// TODO: Remove this line and break up compilePartial

  function template(templateSpec, env) {
    if (!env) {
      throw new Exception("No environment passed to template");
    }

    // Note: Using env.VM references rather than local var references throughout this section to allow
    // for external users to override these as psuedo-supported APIs.
    var invokePartialWrapper = function(partial, name, context, helpers, partials, data) {
      var result = env.VM.invokePartial.apply(this, arguments);
      if (result != null) { return result; }

      if (env.compile) {
        var options = { helpers: helpers, partials: partials, data: data };
        partials[name] = env.compile(partial, { data: data !== undefined }, env);
        return partials[name](context, options);
      } else {
        throw new Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
      }
    };

    // Just add water
    var container = {
      escapeExpression: Utils.escapeExpression,
      invokePartial: invokePartialWrapper,
      programs: [],
      program: function(i, fn, data) {
        var programWrapper = this.programs[i];
        if(data) {
          programWrapper = program(i, fn, data);
        } else if (!programWrapper) {
          programWrapper = this.programs[i] = program(i, fn);
        }
        return programWrapper;
      },
      merge: function(param, common) {
        var ret = param || common;

        if (param && common && (param !== common)) {
          ret = {};
          Utils.extend(ret, common);
          Utils.extend(ret, param);
        }
        return ret;
      },
      programWithDepth: env.VM.programWithDepth,
      noop: env.VM.noop,
      compilerInfo: null
    };

    return function(context, options) {
      options = options || {};
      var namespace = options.partial ? options : env,
          helpers,
          partials;

      if (!options.partial) {
        helpers = options.helpers;
        partials = options.partials;
      }
      var result = templateSpec.call(
            container,
            namespace, context,
            helpers,
            partials,
            options.data);

      if (!options.partial) {
        env.VM.checkRevision(container.compilerInfo);
      }

      return result;
    };
  }

  __exports__.template = template;function programWithDepth(i, fn, data /*, $depth */) {
    var args = Array.prototype.slice.call(arguments, 3);

    var prog = function(context, options) {
      options = options || {};

      return fn.apply(this, [context, options.data || data].concat(args));
    };
    prog.program = i;
    prog.depth = args.length;
    return prog;
  }

  __exports__.programWithDepth = programWithDepth;function program(i, fn, data) {
    var prog = function(context, options) {
      options = options || {};

      return fn(context, options.data || data);
    };
    prog.program = i;
    prog.depth = 0;
    return prog;
  }

  __exports__.program = program;function invokePartial(partial, name, context, helpers, partials, data) {
    var options = { partial: true, helpers: helpers, partials: partials, data: data };

    if(partial === undefined) {
      throw new Exception("The partial " + name + " could not be found");
    } else if(partial instanceof Function) {
      return partial(context, options);
    }
  }

  __exports__.invokePartial = invokePartial;function noop() { return ""; }

  __exports__.noop = noop;
  return __exports__;
})(__module3__, __module5__, __module2__);

// handlebars.runtime.js
var __module1__ = (function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__) {
  "use strict";
  var __exports__;
  /*globals Handlebars: true */
  var base = __dependency1__;

  // Each of these augment the Handlebars object. No need to setup here.
  // (This is done to easily share code between commonjs and browse envs)
  var SafeString = __dependency2__;
  var Exception = __dependency3__;
  var Utils = __dependency4__;
  var runtime = __dependency5__;

  // For compatibility and usage outside of module systems, make the Handlebars object a namespace
  var create = function() {
    var hb = new base.HandlebarsEnvironment();

    Utils.extend(hb, base);
    hb.SafeString = SafeString;
    hb.Exception = Exception;
    hb.Utils = Utils;

    hb.VM = runtime;
    hb.template = function(spec) {
      return runtime.template(spec, hb);
    };

    return hb;
  };

  var Handlebars = create();
  Handlebars.create = create;

  __exports__ = Handlebars;
  return __exports__;
})(__module2__, __module4__, __module5__, __module3__, __module6__);

// handlebars/compiler/ast.js
var __module7__ = (function(__dependency1__) {
  "use strict";
  var __exports__;
  var Exception = __dependency1__;

  function LocationInfo(locInfo){
    locInfo = locInfo || {};
    this.firstLine   = locInfo.first_line;
    this.firstColumn = locInfo.first_column;
    this.lastColumn  = locInfo.last_column;
    this.lastLine    = locInfo.last_line;
  }

  var AST = {
    ProgramNode: function(statements, inverseStrip, inverse, locInfo) {
      var inverseLocationInfo, firstInverseNode;
      if (arguments.length === 3) {
        locInfo = inverse;
        inverse = null;
      } else if (arguments.length === 2) {
        locInfo = inverseStrip;
        inverseStrip = null;
      }

      LocationInfo.call(this, locInfo);
      this.type = "program";
      this.statements = statements;
      this.strip = {};

      if(inverse) {
        firstInverseNode = inverse[0];
        if (firstInverseNode) {
          inverseLocationInfo = {
            first_line: firstInverseNode.firstLine,
            last_line: firstInverseNode.lastLine,
            last_column: firstInverseNode.lastColumn,
            first_column: firstInverseNode.firstColumn
          };
          this.inverse = new AST.ProgramNode(inverse, inverseStrip, inverseLocationInfo);
        } else {
          this.inverse = new AST.ProgramNode(inverse, inverseStrip);
        }
        this.strip.right = inverseStrip.left;
      } else if (inverseStrip) {
        this.strip.left = inverseStrip.right;
      }
    },

    MustacheNode: function(rawParams, hash, open, strip, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "mustache";
      this.strip = strip;

      // Open may be a string parsed from the parser or a passed boolean flag
      if (open != null && open.charAt) {
        // Must use charAt to support IE pre-10
        var escapeFlag = open.charAt(3) || open.charAt(2);
        this.escaped = escapeFlag !== '{' && escapeFlag !== '&';
      } else {
        this.escaped = !!open;
      }

      if (rawParams instanceof AST.SexprNode) {
        this.sexpr = rawParams;
      } else {
        // Support old AST API
        this.sexpr = new AST.SexprNode(rawParams, hash);
      }

      this.sexpr.isRoot = true;

      // Support old AST API that stored this info in MustacheNode
      this.id = this.sexpr.id;
      this.params = this.sexpr.params;
      this.hash = this.sexpr.hash;
      this.eligibleHelper = this.sexpr.eligibleHelper;
      this.isHelper = this.sexpr.isHelper;
    },

    SexprNode: function(rawParams, hash, locInfo) {
      LocationInfo.call(this, locInfo);

      this.type = "sexpr";
      this.hash = hash;

      var id = this.id = rawParams[0];
      var params = this.params = rawParams.slice(1);

      // a mustache is an eligible helper if:
      // * its id is simple (a single part, not `this` or `..`)
      var eligibleHelper = this.eligibleHelper = id.isSimple;

      // a mustache is definitely a helper if:
      // * it is an eligible helper, and
      // * it has at least one parameter or hash segment
      this.isHelper = eligibleHelper && (params.length || hash);

      // if a mustache is an eligible helper but not a definite
      // helper, it is ambiguous, and will be resolved in a later
      // pass or at runtime.
    },

    PartialNode: function(partialName, context, strip, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type         = "partial";
      this.partialName  = partialName;
      this.context      = context;
      this.strip = strip;
    },

    BlockNode: function(mustache, program, inverse, close, locInfo) {
      LocationInfo.call(this, locInfo);

      if(mustache.sexpr.id.original !== close.path.original) {
        throw new Exception(mustache.sexpr.id.original + " doesn't match " + close.path.original, this);
      }

      this.type = 'block';
      this.mustache = mustache;
      this.program  = program;
      this.inverse  = inverse;

      this.strip = {
        left: mustache.strip.left,
        right: close.strip.right
      };

      (program || inverse).strip.left = mustache.strip.right;
      (inverse || program).strip.right = close.strip.left;

      if (inverse && !program) {
        this.isInverse = true;
      }
    },

    ContentNode: function(string, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "content";
      this.string = string;
    },

    HashNode: function(pairs, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "hash";
      this.pairs = pairs;
    },

    IdNode: function(parts, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "ID";

      var original = "",
          dig = [],
          depth = 0;

      for(var i=0,l=parts.length; i<l; i++) {
        var part = parts[i].part;
        original += (parts[i].separator || '') + part;

        if (part === ".." || part === "." || part === "this") {
          if (dig.length > 0) {
            throw new Exception("Invalid path: " + original, this);
          } else if (part === "..") {
            depth++;
          } else {
            this.isScoped = true;
          }
        } else {
          dig.push(part);
        }
      }

      this.original = original;
      this.parts    = dig;
      this.string   = dig.join('.');
      this.depth    = depth;

      // an ID is simple if it only has one part, and that part is not
      // `..` or `this`.
      this.isSimple = parts.length === 1 && !this.isScoped && depth === 0;

      this.stringModeValue = this.string;
    },

    PartialNameNode: function(name, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "PARTIAL_NAME";
      this.name = name.original;
    },

    DataNode: function(id, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "DATA";
      this.id = id;
    },

    StringNode: function(string, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "STRING";
      this.original =
        this.string =
        this.stringModeValue = string;
    },

    IntegerNode: function(integer, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "INTEGER";
      this.original =
        this.integer = integer;
      this.stringModeValue = Number(integer);
    },

    BooleanNode: function(bool, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "BOOLEAN";
      this.bool = bool;
      this.stringModeValue = bool === "true";
    },

    CommentNode: function(comment, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "comment";
      this.comment = comment;
    }
  };

  // Must be exported as an object rather than the root of the module as the jison lexer
  // most modify the object to operate properly.
  __exports__ = AST;
  return __exports__;
})(__module5__);

// handlebars/compiler/parser.js
var __module9__ = (function() {
  "use strict";
  var __exports__;
  /* jshint ignore:start */
  /* Jison generated parser */
  var handlebars = (function(){
  var parser = {trace: function trace() { },
  yy: {},
  symbols_: {"error":2,"root":3,"statements":4,"EOF":5,"program":6,"simpleInverse":7,"statement":8,"openInverse":9,"closeBlock":10,"openBlock":11,"mustache":12,"partial":13,"CONTENT":14,"COMMENT":15,"OPEN_BLOCK":16,"sexpr":17,"CLOSE":18,"OPEN_INVERSE":19,"OPEN_ENDBLOCK":20,"path":21,"OPEN":22,"OPEN_UNESCAPED":23,"CLOSE_UNESCAPED":24,"OPEN_PARTIAL":25,"partialName":26,"partial_option0":27,"sexpr_repetition0":28,"sexpr_option0":29,"dataName":30,"param":31,"STRING":32,"INTEGER":33,"BOOLEAN":34,"OPEN_SEXPR":35,"CLOSE_SEXPR":36,"hash":37,"hash_repetition_plus0":38,"hashSegment":39,"ID":40,"EQUALS":41,"DATA":42,"pathSegments":43,"SEP":44,"$accept":0,"$end":1},
  terminals_: {2:"error",5:"EOF",14:"CONTENT",15:"COMMENT",16:"OPEN_BLOCK",18:"CLOSE",19:"OPEN_INVERSE",20:"OPEN_ENDBLOCK",22:"OPEN",23:"OPEN_UNESCAPED",24:"CLOSE_UNESCAPED",25:"OPEN_PARTIAL",32:"STRING",33:"INTEGER",34:"BOOLEAN",35:"OPEN_SEXPR",36:"CLOSE_SEXPR",40:"ID",41:"EQUALS",42:"DATA",44:"SEP"},
  productions_: [0,[3,2],[3,1],[6,2],[6,3],[6,2],[6,1],[6,1],[6,0],[4,1],[4,2],[8,3],[8,3],[8,1],[8,1],[8,1],[8,1],[11,3],[9,3],[10,3],[12,3],[12,3],[13,4],[7,2],[17,3],[17,1],[31,1],[31,1],[31,1],[31,1],[31,1],[31,3],[37,1],[39,3],[26,1],[26,1],[26,1],[30,2],[21,1],[43,3],[43,1],[27,0],[27,1],[28,0],[28,2],[29,0],[29,1],[38,1],[38,2]],
  performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

  var $0 = $$.length - 1;
  switch (yystate) {
  case 1: return new yy.ProgramNode($$[$0-1], this._$); 
  break;
  case 2: return new yy.ProgramNode([], this._$); 
  break;
  case 3:this.$ = new yy.ProgramNode([], $$[$0-1], $$[$0], this._$);
  break;
  case 4:this.$ = new yy.ProgramNode($$[$0-2], $$[$0-1], $$[$0], this._$);
  break;
  case 5:this.$ = new yy.ProgramNode($$[$0-1], $$[$0], [], this._$);
  break;
  case 6:this.$ = new yy.ProgramNode($$[$0], this._$);
  break;
  case 7:this.$ = new yy.ProgramNode([], this._$);
  break;
  case 8:this.$ = new yy.ProgramNode([], this._$);
  break;
  case 9:this.$ = [$$[$0]];
  break;
  case 10: $$[$0-1].push($$[$0]); this.$ = $$[$0-1]; 
  break;
  case 11:this.$ = new yy.BlockNode($$[$0-2], $$[$0-1].inverse, $$[$0-1], $$[$0], this._$);
  break;
  case 12:this.$ = new yy.BlockNode($$[$0-2], $$[$0-1], $$[$0-1].inverse, $$[$0], this._$);
  break;
  case 13:this.$ = $$[$0];
  break;
  case 14:this.$ = $$[$0];
  break;
  case 15:this.$ = new yy.ContentNode($$[$0], this._$);
  break;
  case 16:this.$ = new yy.CommentNode($$[$0], this._$);
  break;
  case 17:this.$ = new yy.MustacheNode($$[$0-1], null, $$[$0-2], stripFlags($$[$0-2], $$[$0]), this._$);
  break;
  case 18:this.$ = new yy.MustacheNode($$[$0-1], null, $$[$0-2], stripFlags($$[$0-2], $$[$0]), this._$);
  break;
  case 19:this.$ = {path: $$[$0-1], strip: stripFlags($$[$0-2], $$[$0])};
  break;
  case 20:this.$ = new yy.MustacheNode($$[$0-1], null, $$[$0-2], stripFlags($$[$0-2], $$[$0]), this._$);
  break;
  case 21:this.$ = new yy.MustacheNode($$[$0-1], null, $$[$0-2], stripFlags($$[$0-2], $$[$0]), this._$);
  break;
  case 22:this.$ = new yy.PartialNode($$[$0-2], $$[$0-1], stripFlags($$[$0-3], $$[$0]), this._$);
  break;
  case 23:this.$ = stripFlags($$[$0-1], $$[$0]);
  break;
  case 24:this.$ = new yy.SexprNode([$$[$0-2]].concat($$[$0-1]), $$[$0], this._$);
  break;
  case 25:this.$ = new yy.SexprNode([$$[$0]], null, this._$);
  break;
  case 26:this.$ = $$[$0];
  break;
  case 27:this.$ = new yy.StringNode($$[$0], this._$);
  break;
  case 28:this.$ = new yy.IntegerNode($$[$0], this._$);
  break;
  case 29:this.$ = new yy.BooleanNode($$[$0], this._$);
  break;
  case 30:this.$ = $$[$0];
  break;
  case 31:$$[$0-1].isHelper = true; this.$ = $$[$0-1];
  break;
  case 32:this.$ = new yy.HashNode($$[$0], this._$);
  break;
  case 33:this.$ = [$$[$0-2], $$[$0]];
  break;
  case 34:this.$ = new yy.PartialNameNode($$[$0], this._$);
  break;
  case 35:this.$ = new yy.PartialNameNode(new yy.StringNode($$[$0], this._$), this._$);
  break;
  case 36:this.$ = new yy.PartialNameNode(new yy.IntegerNode($$[$0], this._$));
  break;
  case 37:this.$ = new yy.DataNode($$[$0], this._$);
  break;
  case 38:this.$ = new yy.IdNode($$[$0], this._$);
  break;
  case 39: $$[$0-2].push({part: $$[$0], separator: $$[$0-1]}); this.$ = $$[$0-2]; 
  break;
  case 40:this.$ = [{part: $$[$0]}];
  break;
  case 43:this.$ = [];
  break;
  case 44:$$[$0-1].push($$[$0]);
  break;
  case 47:this.$ = [$$[$0]];
  break;
  case 48:$$[$0-1].push($$[$0]);
  break;
  }
  },
  table: [{3:1,4:2,5:[1,3],8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],22:[1,13],23:[1,14],25:[1,15]},{1:[3]},{5:[1,16],8:17,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],22:[1,13],23:[1,14],25:[1,15]},{1:[2,2]},{5:[2,9],14:[2,9],15:[2,9],16:[2,9],19:[2,9],20:[2,9],22:[2,9],23:[2,9],25:[2,9]},{4:20,6:18,7:19,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,21],20:[2,8],22:[1,13],23:[1,14],25:[1,15]},{4:20,6:22,7:19,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,21],20:[2,8],22:[1,13],23:[1,14],25:[1,15]},{5:[2,13],14:[2,13],15:[2,13],16:[2,13],19:[2,13],20:[2,13],22:[2,13],23:[2,13],25:[2,13]},{5:[2,14],14:[2,14],15:[2,14],16:[2,14],19:[2,14],20:[2,14],22:[2,14],23:[2,14],25:[2,14]},{5:[2,15],14:[2,15],15:[2,15],16:[2,15],19:[2,15],20:[2,15],22:[2,15],23:[2,15],25:[2,15]},{5:[2,16],14:[2,16],15:[2,16],16:[2,16],19:[2,16],20:[2,16],22:[2,16],23:[2,16],25:[2,16]},{17:23,21:24,30:25,40:[1,28],42:[1,27],43:26},{17:29,21:24,30:25,40:[1,28],42:[1,27],43:26},{17:30,21:24,30:25,40:[1,28],42:[1,27],43:26},{17:31,21:24,30:25,40:[1,28],42:[1,27],43:26},{21:33,26:32,32:[1,34],33:[1,35],40:[1,28],43:26},{1:[2,1]},{5:[2,10],14:[2,10],15:[2,10],16:[2,10],19:[2,10],20:[2,10],22:[2,10],23:[2,10],25:[2,10]},{10:36,20:[1,37]},{4:38,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,7],22:[1,13],23:[1,14],25:[1,15]},{7:39,8:17,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,21],20:[2,6],22:[1,13],23:[1,14],25:[1,15]},{17:23,18:[1,40],21:24,30:25,40:[1,28],42:[1,27],43:26},{10:41,20:[1,37]},{18:[1,42]},{18:[2,43],24:[2,43],28:43,32:[2,43],33:[2,43],34:[2,43],35:[2,43],36:[2,43],40:[2,43],42:[2,43]},{18:[2,25],24:[2,25],36:[2,25]},{18:[2,38],24:[2,38],32:[2,38],33:[2,38],34:[2,38],35:[2,38],36:[2,38],40:[2,38],42:[2,38],44:[1,44]},{21:45,40:[1,28],43:26},{18:[2,40],24:[2,40],32:[2,40],33:[2,40],34:[2,40],35:[2,40],36:[2,40],40:[2,40],42:[2,40],44:[2,40]},{18:[1,46]},{18:[1,47]},{24:[1,48]},{18:[2,41],21:50,27:49,40:[1,28],43:26},{18:[2,34],40:[2,34]},{18:[2,35],40:[2,35]},{18:[2,36],40:[2,36]},{5:[2,11],14:[2,11],15:[2,11],16:[2,11],19:[2,11],20:[2,11],22:[2,11],23:[2,11],25:[2,11]},{21:51,40:[1,28],43:26},{8:17,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,3],22:[1,13],23:[1,14],25:[1,15]},{4:52,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,5],22:[1,13],23:[1,14],25:[1,15]},{14:[2,23],15:[2,23],16:[2,23],19:[2,23],20:[2,23],22:[2,23],23:[2,23],25:[2,23]},{5:[2,12],14:[2,12],15:[2,12],16:[2,12],19:[2,12],20:[2,12],22:[2,12],23:[2,12],25:[2,12]},{14:[2,18],15:[2,18],16:[2,18],19:[2,18],20:[2,18],22:[2,18],23:[2,18],25:[2,18]},{18:[2,45],21:56,24:[2,45],29:53,30:60,31:54,32:[1,57],33:[1,58],34:[1,59],35:[1,61],36:[2,45],37:55,38:62,39:63,40:[1,64],42:[1,27],43:26},{40:[1,65]},{18:[2,37],24:[2,37],32:[2,37],33:[2,37],34:[2,37],35:[2,37],36:[2,37],40:[2,37],42:[2,37]},{14:[2,17],15:[2,17],16:[2,17],19:[2,17],20:[2,17],22:[2,17],23:[2,17],25:[2,17]},{5:[2,20],14:[2,20],15:[2,20],16:[2,20],19:[2,20],20:[2,20],22:[2,20],23:[2,20],25:[2,20]},{5:[2,21],14:[2,21],15:[2,21],16:[2,21],19:[2,21],20:[2,21],22:[2,21],23:[2,21],25:[2,21]},{18:[1,66]},{18:[2,42]},{18:[1,67]},{8:17,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,4],22:[1,13],23:[1,14],25:[1,15]},{18:[2,24],24:[2,24],36:[2,24]},{18:[2,44],24:[2,44],32:[2,44],33:[2,44],34:[2,44],35:[2,44],36:[2,44],40:[2,44],42:[2,44]},{18:[2,46],24:[2,46],36:[2,46]},{18:[2,26],24:[2,26],32:[2,26],33:[2,26],34:[2,26],35:[2,26],36:[2,26],40:[2,26],42:[2,26]},{18:[2,27],24:[2,27],32:[2,27],33:[2,27],34:[2,27],35:[2,27],36:[2,27],40:[2,27],42:[2,27]},{18:[2,28],24:[2,28],32:[2,28],33:[2,28],34:[2,28],35:[2,28],36:[2,28],40:[2,28],42:[2,28]},{18:[2,29],24:[2,29],32:[2,29],33:[2,29],34:[2,29],35:[2,29],36:[2,29],40:[2,29],42:[2,29]},{18:[2,30],24:[2,30],32:[2,30],33:[2,30],34:[2,30],35:[2,30],36:[2,30],40:[2,30],42:[2,30]},{17:68,21:24,30:25,40:[1,28],42:[1,27],43:26},{18:[2,32],24:[2,32],36:[2,32],39:69,40:[1,70]},{18:[2,47],24:[2,47],36:[2,47],40:[2,47]},{18:[2,40],24:[2,40],32:[2,40],33:[2,40],34:[2,40],35:[2,40],36:[2,40],40:[2,40],41:[1,71],42:[2,40],44:[2,40]},{18:[2,39],24:[2,39],32:[2,39],33:[2,39],34:[2,39],35:[2,39],36:[2,39],40:[2,39],42:[2,39],44:[2,39]},{5:[2,22],14:[2,22],15:[2,22],16:[2,22],19:[2,22],20:[2,22],22:[2,22],23:[2,22],25:[2,22]},{5:[2,19],14:[2,19],15:[2,19],16:[2,19],19:[2,19],20:[2,19],22:[2,19],23:[2,19],25:[2,19]},{36:[1,72]},{18:[2,48],24:[2,48],36:[2,48],40:[2,48]},{41:[1,71]},{21:56,30:60,31:73,32:[1,57],33:[1,58],34:[1,59],35:[1,61],40:[1,28],42:[1,27],43:26},{18:[2,31],24:[2,31],32:[2,31],33:[2,31],34:[2,31],35:[2,31],36:[2,31],40:[2,31],42:[2,31]},{18:[2,33],24:[2,33],36:[2,33],40:[2,33]}],
  defaultActions: {3:[2,2],16:[2,1],50:[2,42]},
  parseError: function parseError(str, hash) {
      throw new Error(str);
  },
  parse: function parse(input) {
      var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
      this.lexer.setInput(input);
      this.lexer.yy = this.yy;
      this.yy.lexer = this.lexer;
      this.yy.parser = this;
      if (typeof this.lexer.yylloc == "undefined")
          this.lexer.yylloc = {};
      var yyloc = this.lexer.yylloc;
      lstack.push(yyloc);
      var ranges = this.lexer.options && this.lexer.options.ranges;
      if (typeof this.yy.parseError === "function")
          this.parseError = this.yy.parseError;
      function popStack(n) {
          stack.length = stack.length - 2 * n;
          vstack.length = vstack.length - n;
          lstack.length = lstack.length - n;
      }
      function lex() {
          var token;
          token = self.lexer.lex() || 1;
          if (typeof token !== "number") {
              token = self.symbols_[token] || token;
          }
          return token;
      }
      var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
      while (true) {
          state = stack[stack.length - 1];
          if (this.defaultActions[state]) {
              action = this.defaultActions[state];
          } else {
              if (symbol === null || typeof symbol == "undefined") {
                  symbol = lex();
              }
              action = table[state] && table[state][symbol];
          }
          if (typeof action === "undefined" || !action.length || !action[0]) {
              var errStr = "";
              if (!recovering) {
                  expected = [];
                  for (p in table[state])
                      if (this.terminals_[p] && p > 2) {
                          expected.push("'" + this.terminals_[p] + "'");
                      }
                  if (this.lexer.showPosition) {
                      errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
                  } else {
                      errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1?"end of input":"'" + (this.terminals_[symbol] || symbol) + "'");
                  }
                  this.parseError(errStr, {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
              }
          }
          if (action[0] instanceof Array && action.length > 1) {
              throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
          }
          switch (action[0]) {
          case 1:
              stack.push(symbol);
              vstack.push(this.lexer.yytext);
              lstack.push(this.lexer.yylloc);
              stack.push(action[1]);
              symbol = null;
              if (!preErrorSymbol) {
                  yyleng = this.lexer.yyleng;
                  yytext = this.lexer.yytext;
                  yylineno = this.lexer.yylineno;
                  yyloc = this.lexer.yylloc;
                  if (recovering > 0)
                      recovering--;
              } else {
                  symbol = preErrorSymbol;
                  preErrorSymbol = null;
              }
              break;
          case 2:
              len = this.productions_[action[1]][1];
              yyval.$ = vstack[vstack.length - len];
              yyval._$ = {first_line: lstack[lstack.length - (len || 1)].first_line, last_line: lstack[lstack.length - 1].last_line, first_column: lstack[lstack.length - (len || 1)].first_column, last_column: lstack[lstack.length - 1].last_column};
              if (ranges) {
                  yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]];
              }
              r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
              if (typeof r !== "undefined") {
                  return r;
              }
              if (len) {
                  stack = stack.slice(0, -1 * len * 2);
                  vstack = vstack.slice(0, -1 * len);
                  lstack = lstack.slice(0, -1 * len);
              }
              stack.push(this.productions_[action[1]][0]);
              vstack.push(yyval.$);
              lstack.push(yyval._$);
              newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
              stack.push(newState);
              break;
          case 3:
              return true;
          }
      }
      return true;
  }
  };


  function stripFlags(open, close) {
    return {
      left: open.charAt(2) === '~',
      right: close.charAt(0) === '~' || close.charAt(1) === '~'
    };
  }

  /* Jison generated lexer */
  var lexer = (function(){
  var lexer = ({EOF:1,
  parseError:function parseError(str, hash) {
          if (this.yy.parser) {
              this.yy.parser.parseError(str, hash);
          } else {
              throw new Error(str);
          }
      },
  setInput:function (input) {
          this._input = input;
          this._more = this._less = this.done = false;
          this.yylineno = this.yyleng = 0;
          this.yytext = this.matched = this.match = '';
          this.conditionStack = ['INITIAL'];
          this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
          if (this.options.ranges) this.yylloc.range = [0,0];
          this.offset = 0;
          return this;
      },
  input:function () {
          var ch = this._input[0];
          this.yytext += ch;
          this.yyleng++;
          this.offset++;
          this.match += ch;
          this.matched += ch;
          var lines = ch.match(/(?:\r\n?|\n).*/g);
          if (lines) {
              this.yylineno++;
              this.yylloc.last_line++;
          } else {
              this.yylloc.last_column++;
          }
          if (this.options.ranges) this.yylloc.range[1]++;

          this._input = this._input.slice(1);
          return ch;
      },
  unput:function (ch) {
          var len = ch.length;
          var lines = ch.split(/(?:\r\n?|\n)/g);

          this._input = ch + this._input;
          this.yytext = this.yytext.substr(0, this.yytext.length-len-1);
          //this.yyleng -= len;
          this.offset -= len;
          var oldLines = this.match.split(/(?:\r\n?|\n)/g);
          this.match = this.match.substr(0, this.match.length-1);
          this.matched = this.matched.substr(0, this.matched.length-1);

          if (lines.length-1) this.yylineno -= lines.length-1;
          var r = this.yylloc.range;

          this.yylloc = {first_line: this.yylloc.first_line,
            last_line: this.yylineno+1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length:
                this.yylloc.first_column - len
            };

          if (this.options.ranges) {
              this.yylloc.range = [r[0], r[0] + this.yyleng - len];
          }
          return this;
      },
  more:function () {
          this._more = true;
          return this;
      },
  less:function (n) {
          this.unput(this.match.slice(n));
      },
  pastInput:function () {
          var past = this.matched.substr(0, this.matched.length - this.match.length);
          return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
      },
  upcomingInput:function () {
          var next = this.match;
          if (next.length < 20) {
              next += this._input.substr(0, 20-next.length);
          }
          return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
      },
  showPosition:function () {
          var pre = this.pastInput();
          var c = new Array(pre.length + 1).join("-");
          return pre + this.upcomingInput() + "\n" + c+"^";
      },
  next:function () {
          if (this.done) {
              return this.EOF;
          }
          if (!this._input) this.done = true;

          var token,
              match,
              tempMatch,
              index,
              col,
              lines;
          if (!this._more) {
              this.yytext = '';
              this.match = '';
          }
          var rules = this._currentRules();
          for (var i=0;i < rules.length; i++) {
              tempMatch = this._input.match(this.rules[rules[i]]);
              if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                  match = tempMatch;
                  index = i;
                  if (!this.options.flex) break;
              }
          }
          if (match) {
              lines = match[0].match(/(?:\r\n?|\n).*/g);
              if (lines) this.yylineno += lines.length;
              this.yylloc = {first_line: this.yylloc.last_line,
                             last_line: this.yylineno+1,
                             first_column: this.yylloc.last_column,
                             last_column: lines ? lines[lines.length-1].length-lines[lines.length-1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length};
              this.yytext += match[0];
              this.match += match[0];
              this.matches = match;
              this.yyleng = this.yytext.length;
              if (this.options.ranges) {
                  this.yylloc.range = [this.offset, this.offset += this.yyleng];
              }
              this._more = false;
              this._input = this._input.slice(match[0].length);
              this.matched += match[0];
              token = this.performAction.call(this, this.yy, this, rules[index],this.conditionStack[this.conditionStack.length-1]);
              if (this.done && this._input) this.done = false;
              if (token) return token;
              else return;
          }
          if (this._input === "") {
              return this.EOF;
          } else {
              return this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(),
                      {text: "", token: null, line: this.yylineno});
          }
      },
  lex:function lex() {
          var r = this.next();
          if (typeof r !== 'undefined') {
              return r;
          } else {
              return this.lex();
          }
      },
  begin:function begin(condition) {
          this.conditionStack.push(condition);
      },
  popState:function popState() {
          return this.conditionStack.pop();
      },
  _currentRules:function _currentRules() {
          return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
      },
  topState:function () {
          return this.conditionStack[this.conditionStack.length-2];
      },
  pushState:function begin(condition) {
          this.begin(condition);
      }});
  lexer.options = {};
  lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {


  function strip(start, end) {
    return yy_.yytext = yy_.yytext.substr(start, yy_.yyleng-end);
  }


  var YYSTATE=YY_START
  switch($avoiding_name_collisions) {
  case 0:
                                     if(yy_.yytext.slice(-2) === "\\\\") {
                                       strip(0,1);
                                       this.begin("mu");
                                     } else if(yy_.yytext.slice(-1) === "\\") {
                                       strip(0,1);
                                       this.begin("emu");
                                     } else {
                                       this.begin("mu");
                                     }
                                     if(yy_.yytext) return 14;
                                   
  break;
  case 1:return 14;
  break;
  case 2:
                                     this.popState();
                                     return 14;
                                   
  break;
  case 3:strip(0,4); this.popState(); return 15;
  break;
  case 4:return 35;
  break;
  case 5:return 36;
  break;
  case 6:return 25;
  break;
  case 7:return 16;
  break;
  case 8:return 20;
  break;
  case 9:return 19;
  break;
  case 10:return 19;
  break;
  case 11:return 23;
  break;
  case 12:return 22;
  break;
  case 13:this.popState(); this.begin('com');
  break;
  case 14:strip(3,5); this.popState(); return 15;
  break;
  case 15:return 22;
  break;
  case 16:return 41;
  break;
  case 17:return 40;
  break;
  case 18:return 40;
  break;
  case 19:return 44;
  break;
  case 20:// ignore whitespace
  break;
  case 21:this.popState(); return 24;
  break;
  case 22:this.popState(); return 18;
  break;
  case 23:yy_.yytext = strip(1,2).replace(/\\"/g,'"'); return 32;
  break;
  case 24:yy_.yytext = strip(1,2).replace(/\\'/g,"'"); return 32;
  break;
  case 25:return 42;
  break;
  case 26:return 34;
  break;
  case 27:return 34;
  break;
  case 28:return 33;
  break;
  case 29:return 40;
  break;
  case 30:yy_.yytext = strip(1,2); return 40;
  break;
  case 31:return 'INVALID';
  break;
  case 32:return 5;
  break;
  }
  };
  lexer.rules = [/^(?:[^\x00]*?(?=(\{\{)))/,/^(?:[^\x00]+)/,/^(?:[^\x00]{2,}?(?=(\{\{|\\\{\{|\\\\\{\{|$)))/,/^(?:[\s\S]*?--\}\})/,/^(?:\()/,/^(?:\))/,/^(?:\{\{(~)?>)/,/^(?:\{\{(~)?#)/,/^(?:\{\{(~)?\/)/,/^(?:\{\{(~)?\^)/,/^(?:\{\{(~)?\s*else\b)/,/^(?:\{\{(~)?\{)/,/^(?:\{\{(~)?&)/,/^(?:\{\{!--)/,/^(?:\{\{![\s\S]*?\}\})/,/^(?:\{\{(~)?)/,/^(?:=)/,/^(?:\.\.)/,/^(?:\.(?=([=~}\s\/.)])))/,/^(?:[\/.])/,/^(?:\s+)/,/^(?:\}(~)?\}\})/,/^(?:(~)?\}\})/,/^(?:"(\\["]|[^"])*")/,/^(?:'(\\[']|[^'])*')/,/^(?:@)/,/^(?:true(?=([~}\s)])))/,/^(?:false(?=([~}\s)])))/,/^(?:-?[0-9]+(?=([~}\s)])))/,/^(?:([^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=([=~}\s\/.)]))))/,/^(?:\[[^\]]*\])/,/^(?:.)/,/^(?:$)/];
  lexer.conditions = {"mu":{"rules":[4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32],"inclusive":false},"emu":{"rules":[2],"inclusive":false},"com":{"rules":[3],"inclusive":false},"INITIAL":{"rules":[0,1,32],"inclusive":true}};
  return lexer;})()
  parser.lexer = lexer;
  function Parser () { this.yy = {}; }Parser.prototype = parser;parser.Parser = Parser;
  return new Parser;
  })();__exports__ = handlebars;
  /* jshint ignore:end */
  return __exports__;
})();

// handlebars/compiler/base.js
var __module8__ = (function(__dependency1__, __dependency2__) {
  "use strict";
  var __exports__ = {};
  var parser = __dependency1__;
  var AST = __dependency2__;

  __exports__.parser = parser;

  function parse(input) {
    // Just return if an already-compile AST was passed in.
    if(input.constructor === AST.ProgramNode) { return input; }

    parser.yy = AST;
    return parser.parse(input);
  }

  __exports__.parse = parse;
  return __exports__;
})(__module9__, __module7__);

// handlebars/compiler/compiler.js
var __module10__ = (function(__dependency1__) {
  "use strict";
  var __exports__ = {};
  var Exception = __dependency1__;

  function Compiler() {}

  __exports__.Compiler = Compiler;// the foundHelper register will disambiguate helper lookup from finding a
  // function in a context. This is necessary for mustache compatibility, which
  // requires that context functions in blocks are evaluated by blockHelperMissing,
  // and then proceed as if the resulting value was provided to blockHelperMissing.

  Compiler.prototype = {
    compiler: Compiler,

    disassemble: function() {
      var opcodes = this.opcodes, opcode, out = [], params, param;

      for (var i=0, l=opcodes.length; i<l; i++) {
        opcode = opcodes[i];

        if (opcode.opcode === 'DECLARE') {
          out.push("DECLARE " + opcode.name + "=" + opcode.value);
        } else {
          params = [];
          for (var j=0; j<opcode.args.length; j++) {
            param = opcode.args[j];
            if (typeof param === "string") {
              param = "\"" + param.replace("\n", "\\n") + "\"";
            }
            params.push(param);
          }
          out.push(opcode.opcode + " " + params.join(" "));
        }
      }

      return out.join("\n");
    },

    equals: function(other) {
      var len = this.opcodes.length;
      if (other.opcodes.length !== len) {
        return false;
      }

      for (var i = 0; i < len; i++) {
        var opcode = this.opcodes[i],
            otherOpcode = other.opcodes[i];
        if (opcode.opcode !== otherOpcode.opcode || opcode.args.length !== otherOpcode.args.length) {
          return false;
        }
        for (var j = 0; j < opcode.args.length; j++) {
          if (opcode.args[j] !== otherOpcode.args[j]) {
            return false;
          }
        }
      }

      len = this.children.length;
      if (other.children.length !== len) {
        return false;
      }
      for (i = 0; i < len; i++) {
        if (!this.children[i].equals(other.children[i])) {
          return false;
        }
      }

      return true;
    },

    guid: 0,

    compile: function(program, options) {
      this.opcodes = [];
      this.children = [];
      this.depths = {list: []};
      this.options = options;

      // These changes will propagate to the other compiler components
      var knownHelpers = this.options.knownHelpers;
      this.options.knownHelpers = {
        'helperMissing': true,
        'blockHelperMissing': true,
        'each': true,
        'if': true,
        'unless': true,
        'with': true,
        'log': true
      };
      if (knownHelpers) {
        for (var name in knownHelpers) {
          this.options.knownHelpers[name] = knownHelpers[name];
        }
      }

      return this.accept(program);
    },

    accept: function(node) {
      var strip = node.strip || {},
          ret;
      if (strip.left) {
        this.opcode('strip');
      }

      ret = this[node.type](node);

      if (strip.right) {
        this.opcode('strip');
      }

      return ret;
    },

    program: function(program) {
      var statements = program.statements;

      for(var i=0, l=statements.length; i<l; i++) {
        this.accept(statements[i]);
      }
      this.isSimple = l === 1;

      this.depths.list = this.depths.list.sort(function(a, b) {
        return a - b;
      });

      return this;
    },

    compileProgram: function(program) {
      var result = new this.compiler().compile(program, this.options);
      var guid = this.guid++, depth;

      this.usePartial = this.usePartial || result.usePartial;

      this.children[guid] = result;

      for(var i=0, l=result.depths.list.length; i<l; i++) {
        depth = result.depths.list[i];

        if(depth < 2) { continue; }
        else { this.addDepth(depth - 1); }
      }

      return guid;
    },

    block: function(block) {
      var mustache = block.mustache,
          program = block.program,
          inverse = block.inverse;

      if (program) {
        program = this.compileProgram(program);
      }

      if (inverse) {
        inverse = this.compileProgram(inverse);
      }

      var sexpr = mustache.sexpr;
      var type = this.classifySexpr(sexpr);

      if (type === "helper") {
        this.helperSexpr(sexpr, program, inverse);
      } else if (type === "simple") {
        this.simpleSexpr(sexpr);

        // now that the simple mustache is resolved, we need to
        // evaluate it by executing `blockHelperMissing`
        this.opcode('pushProgram', program);
        this.opcode('pushProgram', inverse);
        this.opcode('emptyHash');
        this.opcode('blockValue');
      } else {
        this.ambiguousSexpr(sexpr, program, inverse);

        // now that the simple mustache is resolved, we need to
        // evaluate it by executing `blockHelperMissing`
        this.opcode('pushProgram', program);
        this.opcode('pushProgram', inverse);
        this.opcode('emptyHash');
        this.opcode('ambiguousBlockValue');
      }

      this.opcode('append');
    },

    hash: function(hash) {
      var pairs = hash.pairs, pair, val;

      this.opcode('pushHash');

      for(var i=0, l=pairs.length; i<l; i++) {
        pair = pairs[i];
        val  = pair[1];

        if (this.options.stringParams) {
          if(val.depth) {
            this.addDepth(val.depth);
          }
          this.opcode('getContext', val.depth || 0);
          this.opcode('pushStringParam', val.stringModeValue, val.type);

          if (val.type === 'sexpr') {
            // Subexpressions get evaluated and passed in
            // in string params mode.
            this.sexpr(val);
          }
        } else {
          this.accept(val);
        }

        this.opcode('assignToHash', pair[0]);
      }
      this.opcode('popHash');
    },

    partial: function(partial) {
      var partialName = partial.partialName;
      this.usePartial = true;

      if(partial.context) {
        this.ID(partial.context);
      } else {
        this.opcode('push', 'depth0');
      }

      this.opcode('invokePartial', partialName.name);
      this.opcode('append');
    },

    content: function(content) {
      this.opcode('appendContent', content.string);
    },

    mustache: function(mustache) {
      this.sexpr(mustache.sexpr);

      if(mustache.escaped && !this.options.noEscape) {
        this.opcode('appendEscaped');
      } else {
        this.opcode('append');
      }
    },

    ambiguousSexpr: function(sexpr, program, inverse) {
      var id = sexpr.id,
          name = id.parts[0],
          isBlock = program != null || inverse != null;

      this.opcode('getContext', id.depth);

      this.opcode('pushProgram', program);
      this.opcode('pushProgram', inverse);

      this.opcode('invokeAmbiguous', name, isBlock);
    },

    simpleSexpr: function(sexpr) {
      var id = sexpr.id;

      if (id.type === 'DATA') {
        this.DATA(id);
      } else if (id.parts.length) {
        this.ID(id);
      } else {
        // Simplified ID for `this`
        this.addDepth(id.depth);
        this.opcode('getContext', id.depth);
        this.opcode('pushContext');
      }

      this.opcode('resolvePossibleLambda');
    },

    helperSexpr: function(sexpr, program, inverse) {
      var params = this.setupFullMustacheParams(sexpr, program, inverse),
          name = sexpr.id.parts[0];

      if (this.options.knownHelpers[name]) {
        this.opcode('invokeKnownHelper', params.length, name);
      } else if (this.options.knownHelpersOnly) {
        throw new Exception("You specified knownHelpersOnly, but used the unknown helper " + name, sexpr);
      } else {
        this.opcode('invokeHelper', params.length, name, sexpr.isRoot);
      }
    },

    sexpr: function(sexpr) {
      var type = this.classifySexpr(sexpr);

      if (type === "simple") {
        this.simpleSexpr(sexpr);
      } else if (type === "helper") {
        this.helperSexpr(sexpr);
      } else {
        this.ambiguousSexpr(sexpr);
      }
    },

    ID: function(id) {
      this.addDepth(id.depth);
      this.opcode('getContext', id.depth);

      var name = id.parts[0];
      if (!name) {
        this.opcode('pushContext');
      } else {
        this.opcode('lookupOnContext', id.parts[0]);
      }

      for(var i=1, l=id.parts.length; i<l; i++) {
        this.opcode('lookup', id.parts[i]);
      }
    },

    DATA: function(data) {
      this.options.data = true;
      if (data.id.isScoped || data.id.depth) {
        throw new Exception('Scoped data references are not supported: ' + data.original, data);
      }

      this.opcode('lookupData');
      var parts = data.id.parts;
      for(var i=0, l=parts.length; i<l; i++) {
        this.opcode('lookup', parts[i]);
      }
    },

    STRING: function(string) {
      this.opcode('pushString', string.string);
    },

    INTEGER: function(integer) {
      this.opcode('pushLiteral', integer.integer);
    },

    BOOLEAN: function(bool) {
      this.opcode('pushLiteral', bool.bool);
    },

    comment: function() {},

    // HELPERS
    opcode: function(name) {
      this.opcodes.push({ opcode: name, args: [].slice.call(arguments, 1) });
    },

    declare: function(name, value) {
      this.opcodes.push({ opcode: 'DECLARE', name: name, value: value });
    },

    addDepth: function(depth) {
      if(depth === 0) { return; }

      if(!this.depths[depth]) {
        this.depths[depth] = true;
        this.depths.list.push(depth);
      }
    },

    classifySexpr: function(sexpr) {
      var isHelper   = sexpr.isHelper;
      var isEligible = sexpr.eligibleHelper;
      var options    = this.options;

      // if ambiguous, we can possibly resolve the ambiguity now
      if (isEligible && !isHelper) {
        var name = sexpr.id.parts[0];

        if (options.knownHelpers[name]) {
          isHelper = true;
        } else if (options.knownHelpersOnly) {
          isEligible = false;
        }
      }

      if (isHelper) { return "helper"; }
      else if (isEligible) { return "ambiguous"; }
      else { return "simple"; }
    },

    pushParams: function(params) {
      var i = params.length, param;

      while(i--) {
        param = params[i];

        if(this.options.stringParams) {
          if(param.depth) {
            this.addDepth(param.depth);
          }

          this.opcode('getContext', param.depth || 0);
          this.opcode('pushStringParam', param.stringModeValue, param.type);

          if (param.type === 'sexpr') {
            // Subexpressions get evaluated and passed in
            // in string params mode.
            this.sexpr(param);
          }
        } else {
          this[param.type](param);
        }
      }
    },

    setupFullMustacheParams: function(sexpr, program, inverse) {
      var params = sexpr.params;
      this.pushParams(params);

      this.opcode('pushProgram', program);
      this.opcode('pushProgram', inverse);

      if (sexpr.hash) {
        this.hash(sexpr.hash);
      } else {
        this.opcode('emptyHash');
      }

      return params;
    }
  };

  function precompile(input, options, env) {
    if (input == null || (typeof input !== 'string' && input.constructor !== env.AST.ProgramNode)) {
      throw new Exception("You must pass a string or Handlebars AST to Handlebars.precompile. You passed " + input);
    }

    options = options || {};
    if (!('data' in options)) {
      options.data = true;
    }

    var ast = env.parse(input);
    var environment = new env.Compiler().compile(ast, options);
    return new env.JavaScriptCompiler().compile(environment, options);
  }

  __exports__.precompile = precompile;function compile(input, options, env) {
    if (input == null || (typeof input !== 'string' && input.constructor !== env.AST.ProgramNode)) {
      throw new Exception("You must pass a string or Handlebars AST to Handlebars.compile. You passed " + input);
    }

    options = options || {};

    if (!('data' in options)) {
      options.data = true;
    }

    var compiled;

    function compileInput() {
      var ast = env.parse(input);
      var environment = new env.Compiler().compile(ast, options);
      var templateSpec = new env.JavaScriptCompiler().compile(environment, options, undefined, true);
      return env.template(templateSpec);
    }

    // Template is only compiled on first use and cached after that point.
    return function(context, options) {
      if (!compiled) {
        compiled = compileInput();
      }
      return compiled.call(this, context, options);
    };
  }

  __exports__.compile = compile;
  return __exports__;
})(__module5__);

// handlebars/compiler/javascript-compiler.js
var __module11__ = (function(__dependency1__, __dependency2__) {
  "use strict";
  var __exports__;
  var COMPILER_REVISION = __dependency1__.COMPILER_REVISION;
  var REVISION_CHANGES = __dependency1__.REVISION_CHANGES;
  var log = __dependency1__.log;
  var Exception = __dependency2__;

  function Literal(value) {
    this.value = value;
  }

  function JavaScriptCompiler() {}

  JavaScriptCompiler.prototype = {
    // PUBLIC API: You can override these methods in a subclass to provide
    // alternative compiled forms for name lookup and buffering semantics
    nameLookup: function(parent, name /* , type*/) {
      var wrap,
          ret;
      if (parent.indexOf('depth') === 0) {
        wrap = true;
      }

      if (/^[0-9]+$/.test(name)) {
        ret = parent + "[" + name + "]";
      } else if (JavaScriptCompiler.isValidJavaScriptVariableName(name)) {
        ret = parent + "." + name;
      }
      else {
        ret = parent + "['" + name + "']";
      }

      if (wrap) {
        return '(' + parent + ' && ' + ret + ')';
      } else {
        return ret;
      }
    },

    compilerInfo: function() {
      var revision = COMPILER_REVISION,
          versions = REVISION_CHANGES[revision];
      return "this.compilerInfo = ["+revision+",'"+versions+"'];\n";
    },

    appendToBuffer: function(string) {
      if (this.environment.isSimple) {
        return "return " + string + ";";
      } else {
        return {
          appendToBuffer: true,
          content: string,
          toString: function() { return "buffer += " + string + ";"; }
        };
      }
    },

    initializeBuffer: function() {
      return this.quotedString("");
    },

    namespace: "Handlebars",
    // END PUBLIC API

    compile: function(environment, options, context, asObject) {
      this.environment = environment;
      this.options = options || {};

      log('debug', this.environment.disassemble() + "\n\n");

      this.name = this.environment.name;
      this.isChild = !!context;
      this.context = context || {
        programs: [],
        environments: [],
        aliases: { }
      };

      this.preamble();

      this.stackSlot = 0;
      this.stackVars = [];
      this.registers = { list: [] };
      this.hashes = [];
      this.compileStack = [];
      this.inlineStack = [];

      this.compileChildren(environment, options);

      var opcodes = environment.opcodes, opcode;

      this.i = 0;

      for(var l=opcodes.length; this.i<l; this.i++) {
        opcode = opcodes[this.i];

        if(opcode.opcode === 'DECLARE') {
          this[opcode.name] = opcode.value;
        } else {
          this[opcode.opcode].apply(this, opcode.args);
        }

        // Reset the stripNext flag if it was not set by this operation.
        if (opcode.opcode !== this.stripNext) {
          this.stripNext = false;
        }
      }

      // Flush any trailing content that might be pending.
      this.pushSource('');

      if (this.stackSlot || this.inlineStack.length || this.compileStack.length) {
        throw new Exception('Compile completed with content left on stack');
      }

      return this.createFunctionContext(asObject);
    },

    preamble: function() {
      var out = [];

      if (!this.isChild) {
        var namespace = this.namespace;

        var copies = "helpers = this.merge(helpers, " + namespace + ".helpers);";
        if (this.environment.usePartial) { copies = copies + " partials = this.merge(partials, " + namespace + ".partials);"; }
        if (this.options.data) { copies = copies + " data = data || {};"; }
        out.push(copies);
      } else {
        out.push('');
      }

      if (!this.environment.isSimple) {
        out.push(", buffer = " + this.initializeBuffer());
      } else {
        out.push("");
      }

      // track the last context pushed into place to allow skipping the
      // getContext opcode when it would be a noop
      this.lastContext = 0;
      this.source = out;
    },

    createFunctionContext: function(asObject) {
      var locals = this.stackVars.concat(this.registers.list);

      if(locals.length > 0) {
        this.source[1] = this.source[1] + ", " + locals.join(", ");
      }

      // Generate minimizer alias mappings
      if (!this.isChild) {
        for (var alias in this.context.aliases) {
          if (this.context.aliases.hasOwnProperty(alias)) {
            this.source[1] = this.source[1] + ', ' + alias + '=' + this.context.aliases[alias];
          }
        }
      }

      if (this.source[1]) {
        this.source[1] = "var " + this.source[1].substring(2) + ";";
      }

      // Merge children
      if (!this.isChild) {
        this.source[1] += '\n' + this.context.programs.join('\n') + '\n';
      }

      if (!this.environment.isSimple) {
        this.pushSource("return buffer;");
      }

      var params = this.isChild ? ["depth0", "data"] : ["Handlebars", "depth0", "helpers", "partials", "data"];

      for(var i=0, l=this.environment.depths.list.length; i<l; i++) {
        params.push("depth" + this.environment.depths.list[i]);
      }

      // Perform a second pass over the output to merge content when possible
      var source = this.mergeSource();

      if (!this.isChild) {
        source = this.compilerInfo()+source;
      }

      if (asObject) {
        params.push(source);

        return Function.apply(this, params);
      } else {
        var functionSource = 'function ' + (this.name || '') + '(' + params.join(',') + ') {\n  ' + source + '}';
        log('debug', functionSource + "\n\n");
        return functionSource;
      }
    },
    mergeSource: function() {
      // WARN: We are not handling the case where buffer is still populated as the source should
      // not have buffer append operations as their final action.
      var source = '',
          buffer;
      for (var i = 0, len = this.source.length; i < len; i++) {
        var line = this.source[i];
        if (line.appendToBuffer) {
          if (buffer) {
            buffer = buffer + '\n    + ' + line.content;
          } else {
            buffer = line.content;
          }
        } else {
          if (buffer) {
            source += 'buffer += ' + buffer + ';\n  ';
            buffer = undefined;
          }
          source += line + '\n  ';
        }
      }
      return source;
    },

    // [blockValue]
    //
    // On stack, before: hash, inverse, program, value
    // On stack, after: return value of blockHelperMissing
    //
    // The purpose of this opcode is to take a block of the form
    // `{{#foo}}...{{/foo}}`, resolve the value of `foo`, and
    // replace it on the stack with the result of properly
    // invoking blockHelperMissing.
    blockValue: function() {
      this.context.aliases.blockHelperMissing = 'helpers.blockHelperMissing';

      var params = ["depth0"];
      this.setupParams(0, params);

      this.replaceStack(function(current) {
        params.splice(1, 0, current);
        return "blockHelperMissing.call(" + params.join(", ") + ")";
      });
    },

    // [ambiguousBlockValue]
    //
    // On stack, before: hash, inverse, program, value
    // Compiler value, before: lastHelper=value of last found helper, if any
    // On stack, after, if no lastHelper: same as [blockValue]
    // On stack, after, if lastHelper: value
    ambiguousBlockValue: function() {
      this.context.aliases.blockHelperMissing = 'helpers.blockHelperMissing';

      var params = ["depth0"];
      this.setupParams(0, params);

      var current = this.topStack();
      params.splice(1, 0, current);

      this.pushSource("if (!" + this.lastHelper + ") { " + current + " = blockHelperMissing.call(" + params.join(", ") + "); }");
    },

    // [appendContent]
    //
    // On stack, before: ...
    // On stack, after: ...
    //
    // Appends the string value of `content` to the current buffer
    appendContent: function(content) {
      if (this.pendingContent) {
        content = this.pendingContent + content;
      }
      if (this.stripNext) {
        content = content.replace(/^\s+/, '');
      }

      this.pendingContent = content;
    },

    // [strip]
    //
    // On stack, before: ...
    // On stack, after: ...
    //
    // Removes any trailing whitespace from the prior content node and flags
    // the next operation for stripping if it is a content node.
    strip: function() {
      if (this.pendingContent) {
        this.pendingContent = this.pendingContent.replace(/\s+$/, '');
      }
      this.stripNext = 'strip';
    },

    // [append]
    //
    // On stack, before: value, ...
    // On stack, after: ...
    //
    // Coerces `value` to a String and appends it to the current buffer.
    //
    // If `value` is truthy, or 0, it is coerced into a string and appended
    // Otherwise, the empty string is appended
    append: function() {
      // Force anything that is inlined onto the stack so we don't have duplication
      // when we examine local
      this.flushInline();
      var local = this.popStack();
      this.pushSource("if(" + local + " || " + local + " === 0) { " + this.appendToBuffer(local) + " }");
      if (this.environment.isSimple) {
        this.pushSource("else { " + this.appendToBuffer("''") + " }");
      }
    },

    // [appendEscaped]
    //
    // On stack, before: value, ...
    // On stack, after: ...
    //
    // Escape `value` and append it to the buffer
    appendEscaped: function() {
      this.context.aliases.escapeExpression = 'this.escapeExpression';

      this.pushSource(this.appendToBuffer("escapeExpression(" + this.popStack() + ")"));
    },

    // [getContext]
    //
    // On stack, before: ...
    // On stack, after: ...
    // Compiler value, after: lastContext=depth
    //
    // Set the value of the `lastContext` compiler value to the depth
    getContext: function(depth) {
      if(this.lastContext !== depth) {
        this.lastContext = depth;
      }
    },

    // [lookupOnContext]
    //
    // On stack, before: ...
    // On stack, after: currentContext[name], ...
    //
    // Looks up the value of `name` on the current context and pushes
    // it onto the stack.
    lookupOnContext: function(name) {
      this.push(this.nameLookup('depth' + this.lastContext, name, 'context'));
    },

    // [pushContext]
    //
    // On stack, before: ...
    // On stack, after: currentContext, ...
    //
    // Pushes the value of the current context onto the stack.
    pushContext: function() {
      this.pushStackLiteral('depth' + this.lastContext);
    },

    // [resolvePossibleLambda]
    //
    // On stack, before: value, ...
    // On stack, after: resolved value, ...
    //
    // If the `value` is a lambda, replace it on the stack by
    // the return value of the lambda
    resolvePossibleLambda: function() {
      this.context.aliases.functionType = '"function"';

      this.replaceStack(function(current) {
        return "typeof " + current + " === functionType ? " + current + ".apply(depth0) : " + current;
      });
    },

    // [lookup]
    //
    // On stack, before: value, ...
    // On stack, after: value[name], ...
    //
    // Replace the value on the stack with the result of looking
    // up `name` on `value`
    lookup: function(name) {
      this.replaceStack(function(current) {
        return current + " == null || " + current + " === false ? " + current + " : " + this.nameLookup(current, name, 'context');
      });
    },

    // [lookupData]
    //
    // On stack, before: ...
    // On stack, after: data, ...
    //
    // Push the data lookup operator
    lookupData: function() {
      this.pushStackLiteral('data');
    },

    // [pushStringParam]
    //
    // On stack, before: ...
    // On stack, after: string, currentContext, ...
    //
    // This opcode is designed for use in string mode, which
    // provides the string value of a parameter along with its
    // depth rather than resolving it immediately.
    pushStringParam: function(string, type) {
      this.pushStackLiteral('depth' + this.lastContext);

      this.pushString(type);

      // If it's a subexpression, the string result
      // will be pushed after this opcode.
      if (type !== 'sexpr') {
        if (typeof string === 'string') {
          this.pushString(string);
        } else {
          this.pushStackLiteral(string);
        }
      }
    },

    emptyHash: function() {
      this.pushStackLiteral('{}');

      if (this.options.stringParams) {
        this.push('{}'); // hashContexts
        this.push('{}'); // hashTypes
      }
    },
    pushHash: function() {
      if (this.hash) {
        this.hashes.push(this.hash);
      }
      this.hash = {values: [], types: [], contexts: []};
    },
    popHash: function() {
      var hash = this.hash;
      this.hash = this.hashes.pop();

      if (this.options.stringParams) {
        this.push('{' + hash.contexts.join(',') + '}');
        this.push('{' + hash.types.join(',') + '}');
      }

      this.push('{\n    ' + hash.values.join(',\n    ') + '\n  }');
    },

    // [pushString]
    //
    // On stack, before: ...
    // On stack, after: quotedString(string), ...
    //
    // Push a quoted version of `string` onto the stack
    pushString: function(string) {
      this.pushStackLiteral(this.quotedString(string));
    },

    // [push]
    //
    // On stack, before: ...
    // On stack, after: expr, ...
    //
    // Push an expression onto the stack
    push: function(expr) {
      this.inlineStack.push(expr);
      return expr;
    },

    // [pushLiteral]
    //
    // On stack, before: ...
    // On stack, after: value, ...
    //
    // Pushes a value onto the stack. This operation prevents
    // the compiler from creating a temporary variable to hold
    // it.
    pushLiteral: function(value) {
      this.pushStackLiteral(value);
    },

    // [pushProgram]
    //
    // On stack, before: ...
    // On stack, after: program(guid), ...
    //
    // Push a program expression onto the stack. This takes
    // a compile-time guid and converts it into a runtime-accessible
    // expression.
    pushProgram: function(guid) {
      if (guid != null) {
        this.pushStackLiteral(this.programExpression(guid));
      } else {
        this.pushStackLiteral(null);
      }
    },

    // [invokeHelper]
    //
    // On stack, before: hash, inverse, program, params..., ...
    // On stack, after: result of helper invocation
    //
    // Pops off the helper's parameters, invokes the helper,
    // and pushes the helper's return value onto the stack.
    //
    // If the helper is not found, `helperMissing` is called.
    invokeHelper: function(paramSize, name, isRoot) {
      this.context.aliases.helperMissing = 'helpers.helperMissing';
      this.useRegister('helper');

      var helper = this.lastHelper = this.setupHelper(paramSize, name, true);
      var nonHelper = this.nameLookup('depth' + this.lastContext, name, 'context');

      var lookup = 'helper = ' + helper.name + ' || ' + nonHelper;
      if (helper.paramsInit) {
        lookup += ',' + helper.paramsInit;
      }

      this.push(
        '('
          + lookup
          + ',helper '
            + '? helper.call(' + helper.callParams + ') '
            + ': helperMissing.call(' + helper.helperMissingParams + '))');

      // Always flush subexpressions. This is both to prevent the compounding size issue that
      // occurs when the code has to be duplicated for inlining and also to prevent errors
      // due to the incorrect options object being passed due to the shared register.
      if (!isRoot) {
        this.flushInline();
      }
    },

    // [invokeKnownHelper]
    //
    // On stack, before: hash, inverse, program, params..., ...
    // On stack, after: result of helper invocation
    //
    // This operation is used when the helper is known to exist,
    // so a `helperMissing` fallback is not required.
    invokeKnownHelper: function(paramSize, name) {
      var helper = this.setupHelper(paramSize, name);
      this.push(helper.name + ".call(" + helper.callParams + ")");
    },

    // [invokeAmbiguous]
    //
    // On stack, before: hash, inverse, program, params..., ...
    // On stack, after: result of disambiguation
    //
    // This operation is used when an expression like `{{foo}}`
    // is provided, but we don't know at compile-time whether it
    // is a helper or a path.
    //
    // This operation emits more code than the other options,
    // and can be avoided by passing the `knownHelpers` and
    // `knownHelpersOnly` flags at compile-time.
    invokeAmbiguous: function(name, helperCall) {
      this.context.aliases.functionType = '"function"';
      this.useRegister('helper');

      this.emptyHash();
      var helper = this.setupHelper(0, name, helperCall);

      var helperName = this.lastHelper = this.nameLookup('helpers', name, 'helper');

      var nonHelper = this.nameLookup('depth' + this.lastContext, name, 'context');
      var nextStack = this.nextStack();

      if (helper.paramsInit) {
        this.pushSource(helper.paramsInit);
      }
      this.pushSource('if (helper = ' + helperName + ') { ' + nextStack + ' = helper.call(' + helper.callParams + '); }');
      this.pushSource('else { helper = ' + nonHelper + '; ' + nextStack + ' = typeof helper === functionType ? helper.call(' + helper.callParams + ') : helper; }');
    },

    // [invokePartial]
    //
    // On stack, before: context, ...
    // On stack after: result of partial invocation
    //
    // This operation pops off a context, invokes a partial with that context,
    // and pushes the result of the invocation back.
    invokePartial: function(name) {
      var params = [this.nameLookup('partials', name, 'partial'), "'" + name + "'", this.popStack(), "helpers", "partials"];

      if (this.options.data) {
        params.push("data");
      }

      this.context.aliases.self = "this";
      this.push("self.invokePartial(" + params.join(", ") + ")");
    },

    // [assignToHash]
    //
    // On stack, before: value, hash, ...
    // On stack, after: hash, ...
    //
    // Pops a value and hash off the stack, assigns `hash[key] = value`
    // and pushes the hash back onto the stack.
    assignToHash: function(key) {
      var value = this.popStack(),
          context,
          type;

      if (this.options.stringParams) {
        type = this.popStack();
        context = this.popStack();
      }

      var hash = this.hash;
      if (context) {
        hash.contexts.push("'" + key + "': " + context);
      }
      if (type) {
        hash.types.push("'" + key + "': " + type);
      }
      hash.values.push("'" + key + "': (" + value + ")");
    },

    // HELPERS

    compiler: JavaScriptCompiler,

    compileChildren: function(environment, options) {
      var children = environment.children, child, compiler;

      for(var i=0, l=children.length; i<l; i++) {
        child = children[i];
        compiler = new this.compiler();

        var index = this.matchExistingProgram(child);

        if (index == null) {
          this.context.programs.push('');     // Placeholder to prevent name conflicts for nested children
          index = this.context.programs.length;
          child.index = index;
          child.name = 'program' + index;
          this.context.programs[index] = compiler.compile(child, options, this.context);
          this.context.environments[index] = child;
        } else {
          child.index = index;
          child.name = 'program' + index;
        }
      }
    },
    matchExistingProgram: function(child) {
      for (var i = 0, len = this.context.environments.length; i < len; i++) {
        var environment = this.context.environments[i];
        if (environment && environment.equals(child)) {
          return i;
        }
      }
    },

    programExpression: function(guid) {
      this.context.aliases.self = "this";

      if(guid == null) {
        return "self.noop";
      }

      var child = this.environment.children[guid],
          depths = child.depths.list, depth;

      var programParams = [child.index, child.name, "data"];

      for(var i=0, l = depths.length; i<l; i++) {
        depth = depths[i];

        if(depth === 1) { programParams.push("depth0"); }
        else { programParams.push("depth" + (depth - 1)); }
      }

      return (depths.length === 0 ? "self.program(" : "self.programWithDepth(") + programParams.join(", ") + ")";
    },

    register: function(name, val) {
      this.useRegister(name);
      this.pushSource(name + " = " + val + ";");
    },

    useRegister: function(name) {
      if(!this.registers[name]) {
        this.registers[name] = true;
        this.registers.list.push(name);
      }
    },

    pushStackLiteral: function(item) {
      return this.push(new Literal(item));
    },

    pushSource: function(source) {
      if (this.pendingContent) {
        this.source.push(this.appendToBuffer(this.quotedString(this.pendingContent)));
        this.pendingContent = undefined;
      }

      if (source) {
        this.source.push(source);
      }
    },

    pushStack: function(item) {
      this.flushInline();

      var stack = this.incrStack();
      if (item) {
        this.pushSource(stack + " = " + item + ";");
      }
      this.compileStack.push(stack);
      return stack;
    },

    replaceStack: function(callback) {
      var prefix = '',
          inline = this.isInline(),
          stack,
          createdStack,
          usedLiteral;

      // If we are currently inline then we want to merge the inline statement into the
      // replacement statement via ','
      if (inline) {
        var top = this.popStack(true);

        if (top instanceof Literal) {
          // Literals do not need to be inlined
          stack = top.value;
          usedLiteral = true;
        } else {
          // Get or create the current stack name for use by the inline
          createdStack = !this.stackSlot;
          var name = !createdStack ? this.topStackName() : this.incrStack();

          prefix = '(' + this.push(name) + ' = ' + top + '),';
          stack = this.topStack();
        }
      } else {
        stack = this.topStack();
      }

      var item = callback.call(this, stack);

      if (inline) {
        if (!usedLiteral) {
          this.popStack();
        }
        if (createdStack) {
          this.stackSlot--;
        }
        this.push('(' + prefix + item + ')');
      } else {
        // Prevent modification of the context depth variable. Through replaceStack
        if (!/^stack/.test(stack)) {
          stack = this.nextStack();
        }

        this.pushSource(stack + " = (" + prefix + item + ");");
      }
      return stack;
    },

    nextStack: function() {
      return this.pushStack();
    },

    incrStack: function() {
      this.stackSlot++;
      if(this.stackSlot > this.stackVars.length) { this.stackVars.push("stack" + this.stackSlot); }
      return this.topStackName();
    },
    topStackName: function() {
      return "stack" + this.stackSlot;
    },
    flushInline: function() {
      var inlineStack = this.inlineStack;
      if (inlineStack.length) {
        this.inlineStack = [];
        for (var i = 0, len = inlineStack.length; i < len; i++) {
          var entry = inlineStack[i];
          if (entry instanceof Literal) {
            this.compileStack.push(entry);
          } else {
            this.pushStack(entry);
          }
        }
      }
    },
    isInline: function() {
      return this.inlineStack.length;
    },

    popStack: function(wrapped) {
      var inline = this.isInline(),
          item = (inline ? this.inlineStack : this.compileStack).pop();

      if (!wrapped && (item instanceof Literal)) {
        return item.value;
      } else {
        if (!inline) {
          if (!this.stackSlot) {
            throw new Exception('Invalid stack pop');
          }
          this.stackSlot--;
        }
        return item;
      }
    },

    topStack: function(wrapped) {
      var stack = (this.isInline() ? this.inlineStack : this.compileStack),
          item = stack[stack.length - 1];

      if (!wrapped && (item instanceof Literal)) {
        return item.value;
      } else {
        return item;
      }
    },

    quotedString: function(str) {
      return '"' + str
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\u2028/g, '\\u2028')   // Per Ecma-262 7.3 + 7.8.4
        .replace(/\u2029/g, '\\u2029') + '"';
    },

    setupHelper: function(paramSize, name, missingParams) {
      var params = [],
          paramsInit = this.setupParams(paramSize, params, missingParams);
      var foundHelper = this.nameLookup('helpers', name, 'helper');

      return {
        params: params,
        paramsInit: paramsInit,
        name: foundHelper,
        callParams: ["depth0"].concat(params).join(", "),
        helperMissingParams: missingParams && ["depth0", this.quotedString(name)].concat(params).join(", ")
      };
    },

    setupOptions: function(paramSize, params) {
      var options = [], contexts = [], types = [], param, inverse, program;

      options.push("hash:" + this.popStack());

      if (this.options.stringParams) {
        options.push("hashTypes:" + this.popStack());
        options.push("hashContexts:" + this.popStack());
      }

      inverse = this.popStack();
      program = this.popStack();

      // Avoid setting fn and inverse if neither are set. This allows
      // helpers to do a check for `if (options.fn)`
      if (program || inverse) {
        if (!program) {
          this.context.aliases.self = "this";
          program = "self.noop";
        }

        if (!inverse) {
          this.context.aliases.self = "this";
          inverse = "self.noop";
        }

        options.push("inverse:" + inverse);
        options.push("fn:" + program);
      }

      for(var i=0; i<paramSize; i++) {
        param = this.popStack();
        params.push(param);

        if(this.options.stringParams) {
          types.push(this.popStack());
          contexts.push(this.popStack());
        }
      }

      if (this.options.stringParams) {
        options.push("contexts:[" + contexts.join(",") + "]");
        options.push("types:[" + types.join(",") + "]");
      }

      if(this.options.data) {
        options.push("data:data");
      }

      return options;
    },

    // the params and contexts arguments are passed in arrays
    // to fill in
    setupParams: function(paramSize, params, useRegister) {
      var options = '{' + this.setupOptions(paramSize, params).join(',') + '}';

      if (useRegister) {
        this.useRegister('options');
        params.push('options');
        return 'options=' + options;
      } else {
        params.push(options);
        return '';
      }
    }
  };

  var reservedWords = (
    "break else new var" +
    " case finally return void" +
    " catch for switch while" +
    " continue function this with" +
    " default if throw" +
    " delete in try" +
    " do instanceof typeof" +
    " abstract enum int short" +
    " boolean export interface static" +
    " byte extends long super" +
    " char final native synchronized" +
    " class float package throws" +
    " const goto private transient" +
    " debugger implements protected volatile" +
    " double import public let yield"
  ).split(" ");

  var compilerWords = JavaScriptCompiler.RESERVED_WORDS = {};

  for(var i=0, l=reservedWords.length; i<l; i++) {
    compilerWords[reservedWords[i]] = true;
  }

  JavaScriptCompiler.isValidJavaScriptVariableName = function(name) {
    if(!JavaScriptCompiler.RESERVED_WORDS[name] && /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(name)) {
      return true;
    }
    return false;
  };

  __exports__ = JavaScriptCompiler;
  return __exports__;
})(__module2__, __module5__);

// handlebars.js
var __module0__ = (function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__) {
  "use strict";
  var __exports__;
  /*globals Handlebars: true */
  var Handlebars = __dependency1__;

  // Compiler imports
  var AST = __dependency2__;
  var Parser = __dependency3__.parser;
  var parse = __dependency3__.parse;
  var Compiler = __dependency4__.Compiler;
  var compile = __dependency4__.compile;
  var precompile = __dependency4__.precompile;
  var JavaScriptCompiler = __dependency5__;

  var _create = Handlebars.create;
  var create = function() {
    var hb = _create();

    hb.compile = function(input, options) {
      return compile(input, options, hb);
    };
    hb.precompile = function (input, options) {
      return precompile(input, options, hb);
    };

    hb.AST = AST;
    hb.Compiler = Compiler;
    hb.JavaScriptCompiler = JavaScriptCompiler;
    hb.Parser = Parser;
    hb.parse = parse;

    return hb;
  };

  Handlebars = create();
  Handlebars.create = create;

  __exports__ = Handlebars;
  return __exports__;
})(__module1__, __module7__, __module8__, __module10__, __module11__);

  return __module0__;
})();
;/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(h,s){var f={},t=f.lib={},g=function(){},j=t.Base={extend:function(a){g.prototype=this;var c=new g;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
q=t.WordArray=j.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=s?c:4*a.length},toString:function(a){return(a||u).stringify(this)},concat:function(a){var c=this.words,d=a.words,b=this.sigBytes;a=a.sigBytes;this.clamp();if(b%4)for(var e=0;e<a;e++)c[b+e>>>2]|=(d[e>>>2]>>>24-8*(e%4)&255)<<24-8*((b+e)%4);else if(65535<d.length)for(e=0;e<a;e+=4)c[b+e>>>2]=d[e>>>2];else c.push.apply(c,d);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
32-8*(c%4);a.length=h.ceil(c/4)},clone:function(){var a=j.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],d=0;d<a;d+=4)c.push(4294967296*h.random()|0);return new q.init(c,a)}}),v=f.enc={},u=v.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var d=[],b=0;b<a;b++){var e=c[b>>>2]>>>24-8*(b%4)&255;d.push((e>>>4).toString(16));d.push((e&15).toString(16))}return d.join("")},parse:function(a){for(var c=a.length,d=[],b=0;b<c;b+=2)d[b>>>3]|=parseInt(a.substr(b,
2),16)<<24-4*(b%8);return new q.init(d,c/2)}},k=v.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var d=[],b=0;b<a;b++)d.push(String.fromCharCode(c[b>>>2]>>>24-8*(b%4)&255));return d.join("")},parse:function(a){for(var c=a.length,d=[],b=0;b<c;b++)d[b>>>2]|=(a.charCodeAt(b)&255)<<24-8*(b%4);return new q.init(d,c)}},l=v.Utf8={stringify:function(a){try{return decodeURIComponent(escape(k.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return k.parse(unescape(encodeURIComponent(a)))}},
x=t.BufferedBlockAlgorithm=j.extend({reset:function(){this._data=new q.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=l.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,d=c.words,b=c.sigBytes,e=this.blockSize,f=b/(4*e),f=a?h.ceil(f):h.max((f|0)-this._minBufferSize,0);a=f*e;b=h.min(4*a,b);if(a){for(var m=0;m<a;m+=e)this._doProcessBlock(d,m);m=d.splice(0,a);c.sigBytes-=b}return new q.init(m,b)},clone:function(){var a=j.clone.call(this);
a._data=this._data.clone();return a},_minBufferSize:0});t.Hasher=x.extend({cfg:j.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){x.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(c,d){return(new a.init(d)).finalize(c)}},_createHmacHelper:function(a){return function(c,d){return(new w.HMAC.init(a,
d)).finalize(c)}}});var w=f.algo={};return f}(Math);
(function(h){for(var s=CryptoJS,f=s.lib,t=f.WordArray,g=f.Hasher,f=s.algo,j=[],q=[],v=function(a){return 4294967296*(a-(a|0))|0},u=2,k=0;64>k;){var l;a:{l=u;for(var x=h.sqrt(l),w=2;w<=x;w++)if(!(l%w)){l=!1;break a}l=!0}l&&(8>k&&(j[k]=v(h.pow(u,0.5))),q[k]=v(h.pow(u,1/3)),k++);u++}var a=[],f=f.SHA256=g.extend({_doReset:function(){this._hash=new t.init(j.slice(0))},_doProcessBlock:function(c,d){for(var b=this._hash.words,e=b[0],f=b[1],m=b[2],h=b[3],p=b[4],j=b[5],k=b[6],l=b[7],n=0;64>n;n++){if(16>n)a[n]=
c[d+n]|0;else{var r=a[n-15],g=a[n-2];a[n]=((r<<25|r>>>7)^(r<<14|r>>>18)^r>>>3)+a[n-7]+((g<<15|g>>>17)^(g<<13|g>>>19)^g>>>10)+a[n-16]}r=l+((p<<26|p>>>6)^(p<<21|p>>>11)^(p<<7|p>>>25))+(p&j^~p&k)+q[n]+a[n];g=((e<<30|e>>>2)^(e<<19|e>>>13)^(e<<10|e>>>22))+(e&f^e&m^f&m);l=k;k=j;j=p;p=h+r|0;h=m;m=f;f=e;e=r+g|0}b[0]=b[0]+e|0;b[1]=b[1]+f|0;b[2]=b[2]+m|0;b[3]=b[3]+h|0;b[4]=b[4]+p|0;b[5]=b[5]+j|0;b[6]=b[6]+k|0;b[7]=b[7]+l|0},_doFinalize:function(){var a=this._data,d=a.words,b=8*this._nDataBytes,e=8*a.sigBytes;
d[e>>>5]|=128<<24-e%32;d[(e+64>>>9<<4)+14]=h.floor(b/4294967296);d[(e+64>>>9<<4)+15]=b;a.sigBytes=4*d.length;this._process();return this._hash},clone:function(){var a=g.clone.call(this);a._hash=this._hash.clone();return a}});s.SHA256=g._createHelper(f);s.HmacSHA256=g._createHmacHelper(f)})(Math);
;//     Underscore.js 1.6.0
//     http://underscorejs.org
//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.6.0';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return obj;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
      }
    }
    return obj;
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var result;
    any(obj, function(value, index, list) {
      if (predicate.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(predicate, context);
    each(obj, function(value, index, list) {
      if (predicate.call(context, value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, function(value, index, list) {
      return !predicate.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate || (predicate = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(predicate, context);
    each(obj, function(value, index, list) {
      if (!(result = result && predicate.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, predicate, context) {
    predicate || (predicate = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(predicate, context);
    each(obj, function(value, index, list) {
      if (result || (result = predicate.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matches(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matches(attrs));
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    var result = -Infinity, lastComputed = -Infinity;
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      if (computed > lastComputed) {
        result = value;
        lastComputed = computed;
      }
    });
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    var result = Infinity, lastComputed = Infinity;
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      if (computed < lastComputed) {
        result = value;
        lastComputed = computed;
      }
    });
    return result;
  };

  // Shuffle an array, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (obj.length !== +obj.length) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return value;
    return _.property(value);
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, iterator, context) {
    iterator = lookupIterator(iterator);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iterator, context) {
      var result = {};
      iterator = lookupIterator(iterator);
      each(obj, function(value, index) {
        var key = iterator.call(context, value, index, obj);
        behavior(result, key, value);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, key, value) {
    _.has(result, key) ? result[key].push(value) : result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, key, value) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, key) {
    _.has(result, key) ? result[key]++ : result[key] = 1;
  });

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) return array[0];
    if (n < 0) return [];
    return slice.call(array, 0, n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) return array[array.length - 1];
    return slice.call(array, Math.max(array.length - n, 0));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    each(input, function(value) {
      if (_.isArray(value) || _.isArguments(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Split an array into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(array, predicate) {
    var pass = [], fail = [];
    each(array, function(elem) {
      (predicate(elem) ? pass : fail).push(elem);
    });
    return [pass, fail];
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.contains(other, item);
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var length = _.max(_.pluck(arguments, 'length').concat(0));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, '' + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(length);

    while(idx < length) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    return function() {
      var position = 0;
      var args = boundArgs.slice();
      for (var i = 0, length = args.length; i < length; i++) {
        if (args[i] === _) args[i] = arguments[position++];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return func.apply(this, args);
    };
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) throw new Error('bindAll must be passed function names');
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;
      if (last < wait) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = new Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = new Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                             _.isFunction(bCtor) && (bCtor instanceof bCtor))
                        && ('constructor' in a && 'constructor' in b)) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  _.constant = function(value) {
    return function () {
      return value;
    };
  };

  _.property = function(key) {
    return function(obj) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of `key:value` pairs.
  _.matches = function(attrs) {
    return function(obj) {
      if (obj === attrs) return true; //avoid comparing an object to itself.
      for (var key in attrs) {
        if (attrs[key] !== obj[key])
          return false;
      }
      return true;
    }
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(Math.max(0, n));
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() { return new Date().getTime(); };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}).call(this);
;/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
(function(){var h=CryptoJS,j=h.lib.WordArray;h.enc.Base64={stringify:function(b){var e=b.words,f=b.sigBytes,c=this._map;b.clamp();b=[];for(var a=0;a<f;a+=3)for(var d=(e[a>>>2]>>>24-8*(a%4)&255)<<16|(e[a+1>>>2]>>>24-8*((a+1)%4)&255)<<8|e[a+2>>>2]>>>24-8*((a+2)%4)&255,g=0;4>g&&a+0.75*g<f;g++)b.push(c.charAt(d>>>6*(3-g)&63));if(e=c.charAt(64))for(;b.length%4;)b.push(e);return b.join("")},parse:function(b){var e=b.length,f=this._map,c=f.charAt(64);c&&(c=b.indexOf(c),-1!=c&&(e=c));for(var c=[],a=0,d=0;d<
e;d++)if(d%4){var g=f.indexOf(b.charAt(d-1))<<2*(d%4),h=f.indexOf(b.charAt(d))>>>6-2*(d%4);c[a>>>2]|=(g|h)<<24-8*(a%4);a++}return j.create(c,a)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();
;// ==========================================================================
// Project:   Ember - JavaScript Application Framework
// Copyright: ©2011-2013 Tilde Inc. and contributors
//            Portions ©2006-2011 Strobe Inc.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license
//            See https://raw.github.com/emberjs/ember.js/master/LICENSE
// ==========================================================================


// Version: v1.0.1
// Last commit: 697d46e (2014-01-13 21:44:17 -0500)


!function(){var e,t;!function(){var r={},n={};e=function(e,t,n){r[e]={deps:t,callback:n}},t=function(e){if(n[e])return n[e];n[e]={};var i,o,s,a,u;if(i=r[e],!i)throw new Error("Module '"+e+"' not found.");o=i.deps,s=i.callback,a=[];for(var c=0,l=o.length;l>c;c++)"exports"===o[c]?a.push(u={}):a.push(t(o[c]));var h=s.apply(this,a);return n[e]=u||h}}(),function(){function e(e){var t;r.console?t=r.console:"undefined"!=typeof console&&(t=console);var n="object"==typeof t?t[e]:null;return n?n.apply?function(){n.apply(t,arguments)}:function(){var e=Array.prototype.join.call(arguments,", ");n(e)}:void 0}function t(e,t){if(!e)try{throw new Error("assertion failed: "+t)}catch(r){setTimeout(function(){throw r},0)}}"undefined"==typeof Ember&&(Ember={});var r=Ember.imports=Ember.imports||this,n=Ember.exports=Ember.exports||this;Ember.lookup=Ember.lookup||this,n.Em=n.Ember=Em=Ember,Ember.isNamespace=!0,Ember.toString=function(){return"Ember"},Ember.VERSION="1.0.1","undefined"==typeof ENV&&(n.ENV={}),"undefined"==typeof ENV.DISABLE_RANGE_API&&(ENV.DISABLE_RANGE_API=!0),Ember.ENV=Ember.ENV||ENV,Ember.config=Ember.config||{},Ember.EXTEND_PROTOTYPES=Ember.ENV.EXTEND_PROTOTYPES,"undefined"==typeof Ember.EXTEND_PROTOTYPES&&(Ember.EXTEND_PROTOTYPES=!0),Ember.LOG_STACKTRACE_ON_DEPRECATION=Ember.ENV.LOG_STACKTRACE_ON_DEPRECATION!==!1,Ember.SHIM_ES5=Ember.ENV.SHIM_ES5===!1?!1:Ember.EXTEND_PROTOTYPES,Ember.LOG_VERSION=Ember.ENV.LOG_VERSION===!1?!1:!0,Ember.K=function(){return this},"undefined"==typeof Ember.assert&&(Ember.assert=Ember.K),"undefined"==typeof Ember.warn&&(Ember.warn=Ember.K),"undefined"==typeof Ember.debug&&(Ember.debug=Ember.K),"undefined"==typeof Ember.deprecate&&(Ember.deprecate=Ember.K),"undefined"==typeof Ember.deprecateFunc&&(Ember.deprecateFunc=function(e,t){return t}),Ember.uuid=0,Ember.Logger={log:e("log")||Ember.K,warn:e("warn")||Ember.K,error:e("error")||Ember.K,info:e("info")||Ember.K,debug:e("debug")||e("info")||Ember.K,assert:e("assert")||t},Ember.onerror=null,Ember.handleErrors=function(e,t){if("function"!=typeof Ember.onerror)return e.call(t||this);try{return e.call(t||this)}catch(r){Ember.onerror(r)}},Ember.merge=function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r]);return e},Ember.isNone=function(e){return null===e||void 0===e},Ember.none=Ember.deprecateFunc("Ember.none is deprecated. Please use Ember.isNone instead.",Ember.isNone),Ember.isEmpty=function(e){return Ember.isNone(e)||0===e.length&&"function"!=typeof e||"object"==typeof e&&0===Ember.get(e,"length")},Ember.empty=Ember.deprecateFunc("Ember.empty is deprecated. Please use Ember.isEmpty instead.",Ember.isEmpty)}(),function(){var e=Ember.platform={};if(Ember.create=Object.create,Ember.create&&2!==Ember.create({a:1},{a:{value:2}}).a&&(Ember.create=null),!Ember.create||Ember.ENV.STUB_OBJECT_CREATE){var t=function(){};Ember.create=function(e,r){if(t.prototype=e,e=new t,r){t.prototype=e;for(var n in r)t.prototype[n]=r[n].value;e=new t}return t.prototype=null,e},Ember.create.isSimulated=!0}var r,n,i=Object.defineProperty;if(i)try{i({},"a",{get:function(){}})}catch(o){i=null}i&&(r=function(){var e={};return i(e,"a",{configurable:!0,enumerable:!0,get:function(){},set:function(){}}),i(e,"a",{configurable:!0,enumerable:!0,writable:!0,value:!0}),e.a===!0}(),n=function(){try{return i(document.createElement("div"),"definePropertyOnDOM",{}),!0}catch(e){}return!1}(),r?n||(i=function(e,t,r){var n;return n="object"==typeof Node?e instanceof Node:"object"==typeof e&&"number"==typeof e.nodeType&&"string"==typeof e.nodeName,n?e[t]=r.value:Object.defineProperty(e,t,r)}):i=null),e.defineProperty=i,e.hasPropertyAccessors=!0,e.defineProperty||(e.hasPropertyAccessors=!1,e.defineProperty=function(e,t,r){r.get||(e[t]=r.value)},e.defineProperty.isSimulated=!0),Ember.ENV.MANDATORY_SETTER&&!e.hasPropertyAccessors&&(Ember.ENV.MANDATORY_SETTER=!1)}(),function(){var e=function(e){return e&&Function.prototype.toString.call(e).indexOf("[native code]")>-1},t=e(Array.prototype.map)?Array.prototype.map:function(e){if(void 0===this||null===this)throw new TypeError;var t=Object(this),r=t.length>>>0;if("function"!=typeof e)throw new TypeError;for(var n=new Array(r),i=arguments[1],o=0;r>o;o++)o in t&&(n[o]=e.call(i,t[o],o,t));return n},r=e(Array.prototype.forEach)?Array.prototype.forEach:function(e){if(void 0===this||null===this)throw new TypeError;var t=Object(this),r=t.length>>>0;if("function"!=typeof e)throw new TypeError;for(var n=arguments[1],i=0;r>i;i++)i in t&&e.call(n,t[i],i,t)},n=e(Array.prototype.indexOf)?Array.prototype.indexOf:function(e,t){null===t||void 0===t?t=0:0>t&&(t=Math.max(0,this.length+t));for(var r=t,n=this.length;n>r;r++)if(this[r]===e)return r;return-1};Ember.ArrayPolyfills={map:t,forEach:r,indexOf:n},Ember.SHIM_ES5&&(Array.prototype.map||(Array.prototype.map=t),Array.prototype.forEach||(Array.prototype.forEach=r),Array.prototype.indexOf||(Array.prototype.indexOf=n))}(),function(){function e(e){this.descs={},this.watching={},this.cache={},this.source=e}function t(e,t){return!(!e||"function"!=typeof e[t])}var r=Ember.platform.defineProperty,n=Ember.create,i="__ember"+ +new Date,o=0,s=[],a={},u=Ember.ENV.MANDATORY_SETTER;Ember.GUID_KEY=i;var c={writable:!1,configurable:!1,enumerable:!1,value:null};Ember.generateGuid=function(e,t){t||(t="ember");var n=t+o++;return e&&(c.value=n,r(e,i,c)),n},Ember.guidFor=function(e){if(void 0===e)return"(undefined)";if(null===e)return"(null)";var t,n=typeof e;switch(n){case"number":return t=s[e],t||(t=s[e]="nu"+e),t;case"string":return t=a[e],t||(t=a[e]="st"+o++),t;case"boolean":return e?"(true)":"(false)";default:return e[i]?e[i]:e===Object?"(Object)":e===Array?"(Array)":(t="ember"+o++,c.value=t,r(e,i,c),t)}};var l={writable:!0,configurable:!1,enumerable:!1,value:null},h=Ember.GUID_KEY+"_meta";Ember.META_KEY=h;var m={descs:{},watching:{}};u&&(m.values={}),Ember.EMPTY_META=m,Object.freeze&&Object.freeze(m);var f=Ember.platform.defineProperty.isSimulated;f&&(e.prototype.__preventPlainObject__=!0,e.prototype.toJSON=function(){}),Ember.meta=function(t,i){var o=t[h];return i===!1?o||m:(o?o.source!==t&&(f||r(t,h,l),o=n(o),o.descs=n(o.descs),o.watching=n(o.watching),o.cache={},o.source=t,u&&(o.values=n(o.values)),t[h]=o):(f||r(t,h,l),o=new e(t),u&&(o.values={}),t[h]=o,o.descs.constructor=null),o)},Ember.getMeta=function(e,t){var r=Ember.meta(e,!1);return r[t]},Ember.setMeta=function(e,t,r){var n=Ember.meta(e,!0);return n[t]=r,r},Ember.metaPath=function(e,t,r){for(var i,o,s=Ember.meta(e,r),a=0,u=t.length;u>a;a++){if(i=t[a],o=s[i]){if(o.__ember_source__!==e){if(!r)return void 0;o=s[i]=n(o),o.__ember_source__=e}}else{if(!r)return void 0;o=s[i]={__ember_source__:e}}s=o}return o},Ember.wrap=function(e,t){function r(){}function n(){var n,i=this._super;return this._super=t||r,n=e.apply(this,arguments),this._super=i,n}return n.wrappedFunction=e,n.__ember_observes__=e.__ember_observes__,n.__ember_observesBefore__=e.__ember_observesBefore__,n.__ember_listens__=e.__ember_listens__,n},Ember.isArray=function(e){return!e||e.setInterval?!1:Array.isArray&&Array.isArray(e)?!0:Ember.Array&&Ember.Array.detect(e)?!0:void 0!==e.length&&"object"==typeof e?!0:!1},Ember.makeArray=function(e){return null===e||void 0===e?[]:Ember.isArray(e)?e:[e]},Ember.canInvoke=t,Ember.tryInvoke=function(e,r,n){return t(e,r)?e[r].apply(e,n||[]):void 0};var p=function(){var e=0;try{try{}finally{throw e++,new Error("needsFinallyFixTest")}}catch(t){}return 1!==e}();Ember.tryFinally=p?function(e,t,r){var n,i,o;r=r||this;try{n=e.call(r)}finally{try{i=t.call(r)}catch(s){o=s}}if(o)throw o;return void 0===i?n:i}:function(e,t,r){var n,i;r=r||this;try{n=e.call(r)}finally{i=t.call(r)}return void 0===i?n:i},Ember.tryCatchFinally=p?function(e,t,r,n){var i,o,s;n=n||this;try{i=e.call(n)}catch(a){i=t.call(n,a)}finally{try{o=r.call(n)}catch(u){s=u}}if(s)throw s;return void 0===o?i:o}:function(e,t,r,n){var i,o;n=n||this;try{i=e.call(n)}catch(s){i=t.call(n,s)}finally{o=r.call(n)}return void 0===o?i:o};var d={},b="Boolean Number String Function Array Date RegExp Object".split(" ");Ember.ArrayPolyfills.forEach.call(b,function(e){d["[object "+e+"]"]=e.toLowerCase()});var v=Object.prototype.toString;Ember.typeOf=function(e){var t;return t=null===e||void 0===e?String(e):d[v.call(e)]||"object","function"===t?Ember.Object&&Ember.Object.detect(e)&&(t="class"):"object"===t&&(t=e instanceof Error?"error":Ember.Object&&e instanceof Ember.Object?"instance":"object"),t}}(),function(){Ember.Instrumentation={};var e=[],t={},r=function(r){for(var n,i=[],o=0,s=e.length;s>o;o++)n=e[o],n.regex.test(r)&&i.push(n.object);return t[r]=i,i},n=function(){var e="undefined"!=typeof window?window.performance||{}:{},t=e.now||e.mozNow||e.webkitNow||e.msNow||e.oNow;return t?t.bind(e):function(){return+new Date}}();Ember.Instrumentation.instrument=function(e,i,o,s){function a(){for(p=0,d=m.length;d>p;p++)f=m[p],b[p]=f.before(e,n(),i);return o.call(s)}function u(e){i=i||{},i.exception=e}function c(){for(p=0,d=m.length;d>p;p++)f=m[p],f.after(e,n(),i,b[p]);Ember.STRUCTURED_PROFILE&&console.timeEnd(l)}var l,h,m=t[e];if(Ember.STRUCTURED_PROFILE&&(l=e+": "+i.object,console.time(l)),m||(m=r(e)),0===m.length)return h=o.call(s),Ember.STRUCTURED_PROFILE&&console.timeEnd(l),h;var f,p,d,b=[];return Ember.tryCatchFinally(a,u,c)},Ember.Instrumentation.subscribe=function(r,n){for(var i,o=r.split("."),s=[],a=0,u=o.length;u>a;a++)i=o[a],"*"===i?s.push("[^\\.]*"):s.push(i);s=s.join("\\."),s+="(\\..*)?";var c={pattern:r,regex:new RegExp("^"+s+"$"),object:n};return e.push(c),t={},c},Ember.Instrumentation.unsubscribe=function(r){for(var n,i=0,o=e.length;o>i;i++)e[i]===r&&(n=i);e.splice(n,1),t={}},Ember.Instrumentation.reset=function(){e=[],t={}},Ember.instrument=Ember.Instrumentation.instrument,Ember.subscribe=Ember.Instrumentation.subscribe}(),function(){var e,t,r,n;e=Array.prototype.map||Ember.ArrayPolyfills.map,t=Array.prototype.forEach||Ember.ArrayPolyfills.forEach,r=Array.prototype.indexOf||Ember.ArrayPolyfills.indexOf,n=Array.prototype.splice;var i=Ember.EnumerableUtils={map:function(t,r,n){return t.map?t.map.call(t,r,n):e.call(t,r,n)},forEach:function(e,r,n){return e.forEach?e.forEach.call(e,r,n):t.call(e,r,n)},indexOf:function(e,t,n){return e.indexOf?e.indexOf.call(e,t,n):r.call(e,t,n)},indexesOf:function(e,t){return void 0===t?[]:i.map(t,function(t){return i.indexOf(e,t)})},addObject:function(e,t){var r=i.indexOf(e,t);-1===r&&e.push(t)},removeObject:function(e,t){var r=i.indexOf(e,t);-1!==r&&e.splice(r,1)},_replace:function(e,t,r,i){for(var o,s,a=[].concat(i),u=[],c=6e4,l=t,h=r;a.length;)s=h>c?c:h,0>=s&&(s=0),o=a.splice(0,c),o=[l,s].concat(o),l+=c,h-=s,u=u.concat(n.apply(e,o));return u},replace:function(e,t,r,n){return e.replace?e.replace(t,r,n):i._replace(e,t,r,n)},intersection:function(e,t){var r=[];return i.forEach(e,function(e){i.indexOf(t,e)>=0&&r.push(e)}),r}}}(),function(){var e,t=Ember.META_KEY,r=Ember.ENV.MANDATORY_SETTER,n=/^([A-Z$]|([0-9][A-Z$])).*[\.\*]/,i=/^this[\.\*]/,o=/^([^\.\*]+)/;e=function(e,n){if(""===n)return e;if(n||"string"!=typeof e||(n=e,e=null),null===e||-1!==n.indexOf("."))return a(e,n);var i,o=e[t],s=o&&o.descs[n];return s?s.get(e,n):(i=r&&o&&o.watching[n]>0?o.values[n]:e[n],void 0!==i||"object"!=typeof e||n in e||"function"!=typeof e.unknownProperty?i:e.unknownProperty(n))},Ember.config.overrideAccessors&&(Ember.get=e,Ember.config.overrideAccessors(),e=Ember.get);var s=Ember.normalizeTuple=function(t,r){var s,a=i.test(r),u=!a&&n.test(r);if((!t||u)&&(t=Ember.lookup),a&&(r=r.slice(5)),t===Ember.lookup&&(s=r.match(o)[0],t=e(t,s),r=r.slice(s.length+1)),!r||0===r.length)throw new Error("Invalid Path");return[t,r]},a=Ember._getPath=function(t,r){var n,o,a,u,c;if(null===t&&-1===r.indexOf("."))return e(Ember.lookup,r);for(n=i.test(r),(!t||n)&&(a=s(t,r),t=a[0],r=a[1],a.length=0),o=r.split("."),c=o.length,u=0;null!=t&&c>u;u++)if(t=e(t,o[u],!0),t&&t.isDestroyed)return void 0;return t};Ember.getWithDefault=function(t,r,n){var i=e(t,r);return void 0===i?n:i},Ember.get=e,Ember.getPath=Ember.deprecateFunc("getPath is deprecated since get now supports paths",Ember.get)}(),function(){function e(e,t,r){for(var n=-1,i=0,o=e.length;o>i;i+=3)if(t===e[i]&&r===e[i+1]){n=i;break}return n}function t(e,t){var r,n=f(e,!0);return n.listeners||(n.listeners={}),n.hasOwnProperty("listeners")||(n.listeners=m(n.listeners)),r=n.listeners[t],r&&!n.listeners.hasOwnProperty(t)?r=n.listeners[t]=n.listeners[t].slice():r||(r=n.listeners[t]=[]),r}function r(t,r,n){var i=t[p],o=i&&i.listeners&&i.listeners[r];if(o)for(var s=o.length-3;s>=0;s-=3){var a=o[s],u=o[s+1],c=o[s+2],l=e(n,a,u);-1===l&&n.push(a,u,c)}}function n(t,r,n){var i=t[p],o=i&&i.listeners&&i.listeners[r],s=[];if(o){for(var a=o.length-3;a>=0;a-=3){var u=o[a],c=o[a+1],l=o[a+2],h=e(n,u,c);-1===h&&(n.push(u,c,l),s.push(u,c,l))}return s}}function i(r,n,i,o,s){o||"function"!=typeof i||(o=i,i=null);var a=t(r,n),u=e(a,i,o),c=0;s&&(c|=b),-1===u&&(a.push(i,o,c),"function"==typeof r.didAddListener&&r.didAddListener(n,i,o))}function o(r,n,i,o){function s(i,o){var s=t(r,n),a=e(s,i,o);-1!==a&&(s.splice(a,3),"function"==typeof r.didRemoveListener&&r.didRemoveListener(n,i,o))}if(o||"function"!=typeof i||(o=i,i=null),o)s(i,o);else{var a=r[p],u=a&&a.listeners&&a.listeners[n];if(!u)return;for(var c=u.length-3;c>=0;c-=3)s(u[c],u[c+1])}}function s(r,n,i,o,s){function a(){return s.call(i)}function u(){-1!==l&&(c[l+2]&=~v)}o||"function"!=typeof i||(o=i,i=null);var c=t(r,n),l=e(c,i,o);return-1!==l&&(c[l+2]|=v),Ember.tryFinally(a,u)}function a(r,n,i,o,s){function a(){return s.call(i)}function u(){for(var e=0,t=f.length;t>e;e++){var r=f[e];l[r+2]&=~v}}o||"function"!=typeof i||(o=i,i=null);var c,l,h,m,f=[];for(h=0,m=n.length;m>h;h++){c=n[h],l=t(r,c);var p=e(l,i,o);-1!==p&&(l[p+2]|=v,f.push(p))}return Ember.tryFinally(a,u)}function u(e){var t=e[p].listeners,r=[];if(t)for(var n in t)t[n]&&r.push(n);return r}function c(e,t,r,n){if(e!==Ember&&"function"==typeof e.sendEvent&&e.sendEvent(t,r),!n){var i=e[p];n=i&&i.listeners&&i.listeners[t]}if(n){for(var s=n.length-3;s>=0;s-=3){var a=n[s],u=n[s+1],c=n[s+2];u&&(c&v||(c&b&&o(e,t,a,u),a||(a=e),"string"==typeof u&&(u=a[u]),r?u.apply(a,r):u.call(a)))}return!0}}function l(e,t){var r=e[p],n=r&&r.listeners&&r.listeners[t];return!(!n||!n.length)}function h(e,t){var r=[],n=e[p],i=n&&n.listeners&&n.listeners[t];if(!i)return r;for(var o=0,s=i.length;s>o;o+=3){var a=i[o],u=i[o+1];r.push([a,u])}return r}var m=Ember.create,f=Ember.meta,p=Ember.META_KEY,d=[].slice,b=1,v=2;Ember.on=function(){var e=d.call(arguments,-1)[0],t=d.call(arguments,0,-1);return e.__ember_listens__=t,e},Ember.addListener=i,Ember.removeListener=o,Ember._suspendListener=s,Ember._suspendListeners=a,Ember.sendEvent=c,Ember.hasListeners=l,Ember.watchedEvents=u,Ember.listenersFor=h,Ember.listenersDiff=n,Ember.listenersUnion=r}(),function(){var e=Ember.guidFor,t=Ember.sendEvent,r=Ember._ObserverSet=function(){this.clear()};r.prototype.add=function(t,r,n){var i,o=this.observerSet,s=this.observers,a=e(t),u=o[a];return u||(o[a]=u={}),i=u[r],void 0===i&&(i=s.push({sender:t,keyName:r,eventName:n,listeners:[]})-1,u[r]=i),s[i].listeners},r.prototype.flush=function(){var e,r,n,i,o=this.observers;for(this.clear(),e=0,r=o.length;r>e;++e)n=o[e],i=n.sender,i.isDestroying||i.isDestroyed||t(i,n.eventName,[i,n.keyName],n.listeners)},r.prototype.clear=function(){this.observerSet={},this.observers=[]}}(),function(){function e(e,t){var n=h(e,!1),i=n.watching[t]>0||"length"===t,s=n.proto,a=n.descs[t];i&&s!==e&&(a&&a.willChange&&a.willChange(e,t),r(e,t,n),o(e,t,n),c(e,t))}function t(e,t){var r=h(e,!1),i=r.watching[t]>0||"length"===t,o=r.proto,a=r.descs[t];o!==e&&(a&&a.didChange&&a.didChange(e,t),(i||"length"===t)&&(n(e,t,r),s(e,t,r,!1),l(e,t)))}function r(t,r,n){if(!t.isDestroying){var o=w,s=!o;s&&(o=w={}),i(e,t,r,o,n),s&&(w=null)}}function n(e,r,n){if(!e.isDestroying){var o=_,s=!o;s&&(o=_={}),i(t,e,r,o,n),s&&(_=null)}}function i(e,t,r,n,i){var o=m(t);if(n[o]||(n[o]={}),!n[o][r]){n[o][r]=!0;var s=i.deps;if(s=s&&s[r])for(var a in s){var u=i.descs[a];u&&u._suspended===t||e(t,a)}}}function o(t,r,n){if(n.hasOwnProperty("chainWatchers")&&n.chainWatchers[r]){var i,o,s=n.chainWatchers[r],a=[];for(i=0,o=s.length;o>i;i++)s[i].willChange(a);for(i=0,o=a.length;o>i;i+=2)e(a[i],a[i+1])}}function s(e,r,n,i){if(n.hasOwnProperty("chainWatchers")&&n.chainWatchers[r]){var o,s,a=n.chainWatchers[r],u=i?null:[];for(o=0,s=a.length;s>o;o++)a[o].didChange(u);if(!i)for(o=0,s=u.length;s>o;o+=2)t(u[o],u[o+1])}}function a(){y++}function u(){y--,0>=y&&(E.clear(),g.flush())}function c(e,t){if(!e.isDestroying){var r,n,i=t+":before";y?(r=E.add(e,t,i),n=b(e,i,r),p(e,i,[e,t],n)):p(e,i,[e,t])}}function l(e,t){if(!e.isDestroying){var r,n=t+":change";y?(r=g.add(e,t,n),d(e,n,r)):p(e,n,[e,t])}}var h=Ember.meta,m=Ember.guidFor,f=Ember.tryFinally,p=Ember.sendEvent,d=Ember.listenersUnion,b=Ember.listenersDiff,v=Ember._ObserverSet,E=new v,g=new v,y=0;Ember.propertyWillChange=e,Ember.propertyDidChange=t;var w,_;Ember.overrideChains=function(e,t,r){s(e,t,r,!0)},Ember.beginPropertyChanges=a,Ember.endPropertyChanges=u,Ember.changeProperties=function(e,t){a(),f(e,u,t)}}(),function(){function e(e,t,r,o){var s;if(s=t.slice(t.lastIndexOf(".")+1),t=t.slice(0,t.length-(s.length+1)),"this"!==t&&(e=n(e,t)),!s||0===s.length)throw new Error("You passed an empty path");if(!e){if(o)return;throw new Error("Object in path "+t+" could not be found or was destroyed.")}return i(e,s,r)}var t=Ember.META_KEY,r=Ember.ENV.MANDATORY_SETTER,n=Ember._getPath,i=function(n,i,o,s){if("string"==typeof n&&(o=i,i=n,n=null),!n||-1!==i.indexOf("."))return e(n,i,o,s);var a,u,c=n[t],l=c&&c.descs[i];return l?l.set(n,i,o):(a="object"==typeof n&&!(i in n),a&&"function"==typeof n.setUnknownProperty?n.setUnknownProperty(i,o):c&&c.watching[i]>0?(u=r?c.values[i]:n[i],o!==u&&(Ember.propertyWillChange(n,i),r?void 0!==u||i in n?c.values[i]=o:Ember.defineProperty(n,i,null,o):n[i]=o,Ember.propertyDidChange(n,i))):n[i]=o),o};Ember.config.overrideAccessors&&(Ember.set=i,Ember.config.overrideAccessors(),i=Ember.set),Ember.set=i,Ember.setPath=Ember.deprecateFunc("setPath is deprecated since set now supports paths",Ember.set),Ember.trySet=function(e,t,r){return i(e,t,r,!0)},Ember.trySetPath=Ember.deprecateFunc("trySetPath has been renamed to trySet",Ember.trySet)}(),function(){var e=Ember.set,t=Ember.guidFor,r=Ember.ArrayPolyfills.indexOf,n=function(e){var t={};for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r]);return t},i=function(e,t){var r=e.keys.copy(),i=n(e.values);return t.keys=r,t.values=i,t.length=e.length,t},o=Ember.OrderedSet=function(){this.clear()};o.create=function(){return new o},o.prototype={clear:function(){this.presenceSet={},this.list=[]},add:function(e){var r=t(e),n=this.presenceSet,i=this.list;r in n||(n[r]=!0,i.push(e))},remove:function(e){var n=t(e),i=this.presenceSet,o=this.list;delete i[n];var s=r.call(o,e);s>-1&&o.splice(s,1)},isEmpty:function(){return 0===this.list.length},has:function(e){var r=t(e),n=this.presenceSet;return r in n},forEach:function(e,t){for(var r=this.toArray(),n=0,i=r.length;i>n;n++)e.call(t,r[n])},toArray:function(){return this.list.slice()},copy:function(){var e=new o;return e.presenceSet=n(this.presenceSet),e.list=this.toArray(),e}};var s=Ember.Map=function(){this.keys=Ember.OrderedSet.create(),this.values={}};s.create=function(){return new s},s.prototype={length:0,get:function(e){var r=this.values,n=t(e);return r[n]},set:function(r,n){var i=this.keys,o=this.values,s=t(r);i.add(r),o[s]=n,e(this,"length",i.list.length)},remove:function(r){var n=this.keys,i=this.values,o=t(r);return i.hasOwnProperty(o)?(n.remove(r),delete i[o],e(this,"length",n.list.length),!0):!1},has:function(e){var r=this.values,n=t(e);return r.hasOwnProperty(n)},forEach:function(e,r){var n=this.keys,i=this.values;n.forEach(function(n){var o=t(n);e.call(r,n,i[o])})},copy:function(){return i(this,new s)}};var a=Ember.MapWithDefault=function(e){s.call(this),this.defaultValue=e.defaultValue};a.create=function(e){return e?new a(e):new s},a.prototype=Ember.create(s.prototype),a.prototype.get=function(e){var t=this.has(e);if(t)return s.prototype.get.call(this,e);var r=this.defaultValue(e);return this.set(e,r),r},a.prototype.copy=function(){return i(this,new a({defaultValue:this.defaultValue}))}}(),function(){var e=Ember.META_KEY,t=Ember.meta,r=Ember.platform.defineProperty,n=Ember.ENV.MANDATORY_SETTER;Ember.Descriptor=function(){};var i=Ember.MANDATORY_SETTER_FUNCTION=function(){},o=Ember.DEFAULT_GETTER_FUNCTION=function(t){return function(){var r=this[e];return r&&r.values[t]}};Ember.defineProperty=function(e,s,a,u,c){var l,h,m,f;return c||(c=t(e)),l=c.descs,h=c.descs[s],m=c.watching[s]>0,h instanceof Ember.Descriptor&&h.teardown(e,s),a instanceof Ember.Descriptor?(f=a,l[s]=a,n&&m?r(e,s,{configurable:!0,enumerable:!0,writable:!0,value:void 0}):e[s]=void 0):(l[s]=void 0,null==a?(f=u,n&&m?(c.values[s]=u,r(e,s,{configurable:!0,enumerable:!0,set:i,get:o(s)})):e[s]=u):(f=a,r(e,s,a))),m&&Ember.overrideChains(e,s,c),e.didDefineProperty&&e.didDefineProperty(e,s,f),this}}(),function(){var e=Ember.get;Ember.getProperties=function(t){var r={},n=arguments,i=1;2===arguments.length&&"array"===Ember.typeOf(arguments[1])&&(i=0,n=arguments[1]);for(var o=n.length;o>i;i++)r[n[i]]=e(t,n[i]);return r}}(),function(){var e=Ember.changeProperties,t=Ember.set;Ember.setProperties=function(r,n){return e(function(){for(var e in n)n.hasOwnProperty(e)&&t(r,e,n[e])}),r}}(),function(){var e=Ember.meta,t=Ember.typeOf,r=Ember.ENV.MANDATORY_SETTER,n=Ember.platform.defineProperty;Ember.watchKey=function(i,o){if("length"!==o||"array"!==t(i)){var s=e(i),a=s.watching;a[o]?a[o]=(a[o]||0)+1:(a[o]=1,"function"==typeof i.willWatchProperty&&i.willWatchProperty(o),r&&o in i&&(s.values[o]=i[o],n(i,o,{configurable:!0,enumerable:!0,set:Ember.MANDATORY_SETTER_FUNCTION,get:Ember.DEFAULT_GETTER_FUNCTION(o)})))}},Ember.unwatchKey=function(t,i){var o=e(t),s=o.watching;1===s[i]?(s[i]=0,"function"==typeof t.didUnwatchProperty&&t.didUnwatchProperty(i),r&&i in t&&(n(t,i,{configurable:!0,enumerable:!0,writable:!0,value:o.values[i]}),delete o.values[i])):s[i]>1&&s[i]--}}(),function(){function e(e){return e.match(l)[0]}function t(e,t,r){if(e&&"object"==typeof e){var i=n(e),o=i.chainWatchers;i.hasOwnProperty("chainWatchers")||(o=i.chainWatchers={}),o[t]||(o[t]=[]),o[t].push(r),u(e,t)}}function r(e,t){if(!e)return void 0;var r=n(e,!1);if(r.proto===e)return void 0;if("@each"===t)return i(e,t);var o=r.descs[t];return o&&o._cacheable?t in r.cache?r.cache[t]:void 0:i(e,t)}var n=Ember.meta,i=Ember.get,o=Ember.normalizeTuple,s=Ember.ArrayPolyfills.forEach,a=Ember.warn,u=Ember.watchKey,c=Ember.unwatchKey,l=/^([^\.\*]+)/,h=[];Ember.flushPendingChains=function(){if(0!==h.length){var e=h;h=[],s.call(e,function(e){e[0].add(e[1])}),a("Watching an undefined global, Ember expects watched globals to be setup by the time the run loop is flushed, check for typos",0===h.length)}};var m=Ember.removeChainWatcher=function(e,t,r){if(e&&"object"==typeof e){var i=n(e,!1);if(i.hasOwnProperty("chainWatchers")){var o=i.chainWatchers;if(o[t]){o=o[t];for(var s=0,a=o.length;a>s;s++)o[s]===r&&o.splice(s,1)}c(e,t)}}},f=Ember._ChainNode=function(e,r,n){this._parent=e,this._key=r,this._watching=void 0===n,this._value=n,this._paths={},this._watching&&(this._object=e.value(),this._object&&t(this._object,this._key,this)),this._parent&&"@each"===this._parent._key&&this.value()},p=f.prototype;p.value=function(){if(void 0===this._value&&this._watching){var e=this._parent.value();this._value=r(e,this._key)}return this._value},p.destroy=function(){if(this._watching){var e=this._object;e&&m(e,this._key,this),this._watching=!1}},p.copy=function(e){var t,r=new f(null,null,e),n=this._paths;for(t in n)n[t]<=0||r.add(t);return r},p.add=function(t){var r,n,i,s,a;if(a=this._paths,a[t]=(a[t]||0)+1,r=this.value(),n=o(r,t),n[0]&&n[0]===r)t=n[1],i=e(t),t=t.slice(i.length+1);else{if(!n[0])return h.push([this,t]),n.length=0,void 0;s=n[0],i=t.slice(0,0-(n[1].length+1)),t=n[1]}n.length=0,this.chain(i,t,s)},p.remove=function(t){var r,n,i,s,a;a=this._paths,a[t]>0&&a[t]--,r=this.value(),n=o(r,t),n[0]===r?(t=n[1],i=e(t),t=t.slice(i.length+1)):(s=n[0],i=t.slice(0,0-(n[1].length+1)),t=n[1]),n.length=0,this.unchain(i,t)},p.count=0,p.chain=function(t,r,n){var i,o=this._chains;o||(o=this._chains={}),i=o[t],i||(i=o[t]=new f(this,t,n)),i.count++,r&&r.length>0&&(t=e(r),r=r.slice(t.length+1),i.chain(t,r))},p.unchain=function(t,r){var n=this._chains,i=n[t];r&&r.length>1&&(t=e(r),r=r.slice(t.length+1),i.unchain(t,r)),i.count--,i.count<=0&&(delete n[i._key],i.destroy())},p.willChange=function(e){var t=this._chains;if(t)for(var r in t)t.hasOwnProperty(r)&&t[r].willChange(e);this._parent&&this._parent.chainWillChange(this,this._key,1,e)},p.chainWillChange=function(e,t,r,n){this._key&&(t=this._key+"."+t),this._parent?this._parent.chainWillChange(this,t,r+1,n):(r>1&&n.push(this.value(),t),t="this."+t,this._paths[t]>0&&n.push(this.value(),t))},p.chainDidChange=function(e,t,r,n){this._key&&(t=this._key+"."+t),this._parent?this._parent.chainDidChange(this,t,r+1,n):(r>1&&n.push(this.value(),t),t="this."+t,this._paths[t]>0&&n.push(this.value(),t))},p.didChange=function(e){if(this._watching){var r=this._parent.value();r!==this._object&&(m(this._object,this._key,this),this._object=r,t(r,this._key,this)),this._value=void 0,this._parent&&"@each"===this._parent._key&&this.value()}var n=this._chains;if(n)for(var i in n)n.hasOwnProperty(i)&&n[i].didChange(e);null!==e&&this._parent&&this._parent.chainDidChange(this,this._key,1,e)},Ember.finishChains=function(e){var t=n(e,!1),r=t.chains;r&&(r.value()!==e&&(t.chains=r=r.copy(e)),r.didChange(null))}}(),function(){function e(e){var r=t(e),i=r.chains;return i?i.value()!==e&&(i=r.chains=i.copy(e)):i=r.chains=new n(null,null,e),i}var t=Ember.meta,r=Ember.typeOf,n=Ember._ChainNode;Ember.watchPath=function(n,i){if("length"!==i||"array"!==r(n)){var o=t(n),s=o.watching;s[i]?s[i]=(s[i]||0)+1:(s[i]=1,e(n).add(i))}},Ember.unwatchPath=function(r,n){var i=t(r),o=i.watching;1===o[n]?(o[n]=0,e(r).remove(n)):o[n]>1&&o[n]--}}(),function(){function e(e){return"*"===e||!h.test(e)}var t=Ember.meta,r=Ember.GUID_KEY,n=Ember.META_KEY,i=Ember.removeChainWatcher,o=Ember.watchKey,s=Ember.unwatchKey,a=Ember.watchPath,u=Ember.unwatchPath,c=Ember.typeOf,l=Ember.generateGuid,h=/[\.\*]/;Ember.watch=function(t,r){("length"!==r||"array"!==c(t))&&(e(r)?o(t,r):a(t,r))},Ember.isWatching=function(e,t){var r=e[n];return(r&&r.watching[t])>0},Ember.watch.flushPending=Ember.flushPendingChains,Ember.unwatch=function(t,r){("length"!==r||"array"!==c(t))&&(e(r)?s(t,r):u(t,r))},Ember.rewatch=function(e){var n=t(e,!1),i=n.chains;r in e&&!e.hasOwnProperty(r)&&l(e,"ember"),i&&i.value()!==e&&(n.chains=i.copy(e))};var m=[];Ember.destroy=function(e){var t,r,o,s,a=e[n];if(a&&(e[n]=null,t=a.chains))for(m.push(t);m.length>0;){if(t=m.pop(),r=t._chains)for(o in r)r.hasOwnProperty(o)&&m.push(r[o]);t._watching&&(s=t._object,s&&i(s,t._key,t))}}}(),function(){function e(e,t){var r=e[t];return r?e.hasOwnProperty(t)||(r=e[t]=f(r)):r=e[t]={},r}function t(t){return e(t,"deps")}function r(r,n,i,o){var s,a,u,c,l,h=r._dependentKeys;if(h)for(s=t(o),a=0,u=h.length;u>a;a++)c=h[a],l=e(s,c),l[i]=(l[i]||0)+1,p(n,c)}function n(r,n,i,o){var s,a,u,c,l,h=r._dependentKeys;if(h)for(s=t(o),a=0,u=h.length;u>a;a++)c=h[a],l=e(s,c),l[i]=(l[i]||0)-1,d(n,c)}function i(e,t){this.func=e,this._cacheable=t&&void 0!==t.cacheable?t.cacheable:!0,this._dependentKeys=t&&t.dependentKeys,this._readOnly=t&&(void 0!==t.readOnly||!!t.readOnly)}function o(e){for(var t=0,r=e.length;r>t;t++)e[t].didChange(null)}function s(e,t){for(var r={},n=0;n<t.length;n++)r[t[n]]=c(e,t[n]);return r}function a(e,t){Ember.computed[e]=function(e){var r=m.call(arguments);return Ember.computed(e,function(){return t.apply(this,r)})}}function u(e,t){Ember.computed[e]=function(){var e=m.call(arguments),r=Ember.computed(function(){return t.apply(this,[s(this,e)])});return r.property.apply(r,e)}}var c=Ember.get,l=Ember.set,h=Ember.meta,m=[].slice,f=Ember.create,p=(Ember.META_KEY,Ember.watch),d=Ember.unwatch;Ember.ComputedProperty=i,i.prototype=new Ember.Descriptor;var b=i.prototype;b.cacheable=function(e){return this._cacheable=e!==!1,this},b.volatile=function(){return this.cacheable(!1)},b.readOnly=function(e){return this._readOnly=void 0===e||!!e,this},b.property=function(){for(var e=[],t=0,r=arguments.length;r>t;t++)e.push(arguments[t]);return this._dependentKeys=e,this},b.meta=function(e){return 0===arguments.length?this._meta||{}:(this._meta=e,this)},b.didChange=function(e,t){if(this._cacheable&&this._suspended!==e){var r=h(e);t in r.cache&&(delete r.cache[t],n(this,e,t,r))}},b.get=function(e,t){var n,i,s,a;if(this._cacheable){if(s=h(e),i=s.cache,t in i)return i[t];n=i[t]=this.func.call(e,t),a=s.chainWatchers&&s.chainWatchers[t],a&&o(a),r(this,e,t,s)}else n=this.func.call(e,t);return n},b.set=function(e,t,n){var i,o,s,a=this._cacheable,u=this.func,c=h(e,a),l=c.watching[t],m=this._suspended,f=!1,p=c.cache;if(this._readOnly)throw new Error("Cannot Set: "+t+" on: "+e.toString());this._suspended=e;try{if(a&&p.hasOwnProperty(t)&&(o=p[t],f=!0),i=u.wrappedFunction?u.wrappedFunction.length:u.length,3===i)s=u.call(e,t,n,o);else{if(2!==i)return Ember.defineProperty(e,t,null,o),Ember.set(e,t,n),void 0;s=u.call(e,t,n)}if(f&&o===s)return;l&&Ember.propertyWillChange(e,t),f&&delete p[t],a&&(f||r(this,e,t,c),p[t]=s),l&&Ember.propertyDidChange(e,t)}finally{this._suspended=m}return s},b.teardown=function(e,t){var r=h(e);return t in r.cache&&n(this,e,t,r),this._cacheable&&delete r.cache[t],null},Ember.computed=function(e){var t;if(arguments.length>1&&(t=m.call(arguments,0,-1),e=m.call(arguments,-1)[0]),"function"!=typeof e)throw new Error("Computed Property declared without a property function");var r=new i(e);return t&&r.property.apply(r,t),r},Ember.cacheFor=function(e,t){var r=h(e,!1).cache;return r&&t in r?r[t]:void 0},a("empty",function(e){return Ember.isEmpty(c(this,e))}),a("notEmpty",function(e){return!Ember.isEmpty(c(this,e))}),a("none",function(e){return Ember.isNone(c(this,e))}),a("not",function(e){return!c(this,e)}),a("bool",function(e){return!!c(this,e)}),a("match",function(e,t){var r=c(this,e);return"string"==typeof r?!!r.match(t):!1}),a("equal",function(e,t){return c(this,e)===t}),a("gt",function(e,t){return c(this,e)>t}),a("gte",function(e,t){return c(this,e)>=t}),a("lt",function(e,t){return c(this,e)<t}),a("lte",function(e,t){return c(this,e)<=t}),u("and",function(e){for(var t in e)if(e.hasOwnProperty(t)&&!e[t])return!1;return!0}),u("or",function(e){for(var t in e)if(e.hasOwnProperty(t)&&e[t])return!0;return!1}),u("any",function(e){for(var t in e)if(e.hasOwnProperty(t)&&e[t])return e[t];return null}),u("collect",function(e){var t=[];for(var r in e)e.hasOwnProperty(r)&&(Ember.isNone(e[r])?t.push(null):t.push(e[r]));return t}),Ember.computed.alias=function(e){return Ember.computed(e,function(t,r){return arguments.length>1?(l(this,e,r),r):c(this,e)})},Ember.computed.oneWay=function(e){return Ember.computed(e,function(){return c(this,e)})},Ember.computed.defaultTo=function(e){return Ember.computed(function(t,r,n){return 1===arguments.length?null!=n?n:c(this,e):null!=r?r:c(this,e)})}}(),function(){function e(e){return e+r}function t(e){return e+n}var r=":change",n=":before";Ember.addObserver=function(t,r,n,i){return Ember.addListener(t,e(r),n,i),Ember.watch(t,r),this},Ember.observersFor=function(t,r){return Ember.listenersFor(t,e(r))},Ember.removeObserver=function(t,r,n,i){return Ember.unwatch(t,r),Ember.removeListener(t,e(r),n,i),this},Ember.addBeforeObserver=function(e,r,n,i){return Ember.addListener(e,t(r),n,i),Ember.watch(e,r),this},Ember._suspendBeforeObserver=function(e,r,n,i,o){return Ember._suspendListener(e,t(r),n,i,o)},Ember._suspendObserver=function(t,r,n,i,o){return Ember._suspendListener(t,e(r),n,i,o)};var i=Ember.ArrayPolyfills.map;Ember._suspendBeforeObservers=function(e,r,n,o,s){var a=i.call(r,t);return Ember._suspendListeners(e,a,n,o,s)},Ember._suspendObservers=function(t,r,n,o,s){var a=i.call(r,e);return Ember._suspendListeners(t,a,n,o,s)},Ember.beforeObserversFor=function(e,r){return Ember.listenersFor(e,t(r))},Ember.removeBeforeObserver=function(e,r,n,i){return Ember.unwatch(e,r),Ember.removeListener(e,t(r),n,i),this}}(),function(){e("backburner/queue",["exports"],function(e){"use strict";function t(e,t,r){this.daq=e,this.name=t,this.options=r,this._queue=[]}t.prototype={daq:null,name:null,options:null,_queue:null,push:function(e,t,r,n){var i=this._queue;return i.push(e,t,r,n),{queue:this,target:e,method:t}},pushUnique:function(e,t,r,n){var i,o,s,a,u=this._queue;for(s=0,a=u.length;a>s;s+=4)if(i=u[s],o=u[s+1],i===e&&o===t)return u[s+2]=r,u[s+3]=n,{queue:this,target:e,method:t};
return this._queue.push(e,t,r,n),{queue:this,target:e,method:t}},flush:function(){var e,t,r,n,i,o=this._queue,s=this.options,a=s&&s.before,u=s&&s.after,c=o.length;for(c&&a&&a(),i=0;c>i;i+=4)e=o[i],t=o[i+1],r=o[i+2],n=o[i+3],r&&r.length>0?t.apply(e,r):t.call(e);c&&u&&u(),o.length>c?(this._queue=o.slice(c),this.flush()):this._queue.length=0},cancel:function(e){var t,r,n,i,o=this._queue;for(n=0,i=o.length;i>n;n+=4)if(t=o[n],r=o[n+1],t===e.target&&r===e.method)return o.splice(n,4),!0;if(o=this._queueBeingFlushed)for(n=0,i=o.length;i>n;n+=4)if(t=o[n],r=o[n+1],t===e.target&&r===e.method)return o[n+1]=null,!0}},e.Queue=t}),e("backburner/deferred_action_queues",["backburner/queue","exports"],function(e,t){"use strict";function r(e,t){var r=this.queues={};this.queueNames=e=e||[];for(var n,o=0,s=e.length;s>o;o++)n=e[o],r[n]=new i(this,n,t[n])}function n(e,t){for(var r,n,i=0,o=t;o>=i;i++)if(r=e.queueNames[i],n=e.queues[r],n._queue.length)return i;return-1}var i=e.Queue;r.prototype={queueNames:null,queues:null,schedule:function(e,t,r,n,i,o){var s=this.queues,a=s[e];if(!a)throw new Error("You attempted to schedule an action in a queue ("+e+") that doesn't exist");return i?a.pushUnique(t,r,n,o):a.push(t,r,n,o)},flush:function(){for(var e,t,r,i,o=this.queues,s=this.queueNames,a=0,u=s.length;u>a;){e=s[a],t=o[e],r=t._queueBeingFlushed=t._queue.slice(),t._queue=[];var c,l,h,m,f=t.options,p=f&&f.before,d=f&&f.after,b=0,v=r.length;for(v&&p&&p();v>b;)c=r[b],l=r[b+1],h=r[b+2],m=r[b+3],"string"==typeof l&&(l=c[l]),l&&(h&&h.length>0?l.apply(c,h):l.call(c)),b+=4;t._queueBeingFlushed=null,v&&d&&d(),-1===(i=n(this,a))?a++:a=i}}},t.DeferredActionQueues=r}),e("backburner",["backburner/deferred_action_queues","exports"],function(e,t){"use strict";function r(e,t){this.queueNames=e,this.options=t||{},this.options.defaultQueue||(this.options.defaultQueue=e[0]),this.instanceStack=[]}function n(e){e.begin(),s=d.setTimeout(function(){s=null,e.end()})}function i(e){var t,r,n,o,s=+new Date;e.run(function(){for(n=0,o=p.length;o>n&&(t=p[n],!(t>s));n+=2);for(r=p.splice(0,n),n=1,o=r.length;o>n;n+=2)e.schedule(e.options.defaultQueue,null,r[n])}),p.length&&(a=d.setTimeout(function(){i(e),a=null,u=null},p[0]-s),u=p[0])}function o(e,t){for(var r,n=-1,i=0,o=f.length;o>i;i++)if(r=f[i],r[0]===e&&r[1]===t){n=i;break}return n}var s,a,u,c=e.DeferredActionQueues,l=[].slice,h=[].pop,m=[],f=[],p=[],d=this;r.prototype={queueNames:null,options:null,currentInstance:null,instanceStack:null,begin:function(){var e=this.options&&this.options.onBegin,t=this.currentInstance;t&&this.instanceStack.push(t),this.currentInstance=new c(this.queueNames,this.options),e&&e(this.currentInstance,t)},end:function(){var e=this.options&&this.options.onEnd,t=this.currentInstance,r=null;try{t.flush()}finally{this.currentInstance=null,this.instanceStack.length&&(r=this.instanceStack.pop(),this.currentInstance=r),e&&e(t,r)}},run:function(e,t){var r;this.begin(),t||(t=e,e=null),"string"==typeof t&&(t=e[t]);var n=!1;try{r=arguments.length>2?t.apply(e,l.call(arguments,2)):t.call(e)}finally{n||(n=!0,this.end())}return r},defer:function(e,t,r){r||(r=t,t=null),"string"==typeof r&&(r=t[r]);var i=this.DEBUG?(new Error).stack:void 0,o=arguments.length>3?l.call(arguments,3):void 0;return this.currentInstance||n(this),this.currentInstance.schedule(e,t,r,o,!1,i)},deferOnce:function(e,t,r){r||(r=t,t=null),"string"==typeof r&&(r=t[r]);var i=this.DEBUG?(new Error).stack:void 0,o=arguments.length>3?l.call(arguments,3):void 0;return this.currentInstance||n(this),this.currentInstance.schedule(e,t,r,o,!0,i)},setTimeout:function(){var e=this,t=h.call(arguments),r=arguments[0],n=arguments[1],o=+new Date+t;n||(n=r,r=null),"string"==typeof n&&(n=r[n]);var s,c;arguments.length>2?(c=l.call(arguments,2),s=function(){n.apply(r,c)}):s=function(){n.call(r)};var m,f;for(m=0,f=p.length;f>m&&!(o<p[m]);m+=2);return p.splice(m,0,o,s),a&&o>u?s:(a&&(clearTimeout(a),a=null),a=d.setTimeout(function(){i(e),a=null,u=null},t),u=o,s)},throttle:function(e,t){for(var r,n=this,i=arguments,o=h.call(i),s=0,a=m.length;a>s;s++)if(r=m[s],r[0]===e&&r[1]===t)return;var u=d.setTimeout(function(){n.run.apply(n,i);for(var o=-1,s=0,a=m.length;a>s;s++)if(r=m[s],r[0]===e&&r[1]===t){o=s;break}o>-1&&m.splice(o,1)},o);m.push([e,t,u])},debounce:function(e,t){var r,n,i,s=this,a=arguments,u=h.call(a);"number"==typeof u?(r=u,u=!1):r=h.call(a),n=o(e,t),-1!==n&&(i=f[n],f.splice(n,1),clearTimeout(i[2]));var c=d.setTimeout(function(){u||s.run.apply(s,a),n=o(e,t),n&&f.splice(n,1)},r);u&&-1===n&&s.run.apply(s,a),f.push([e,t,c])},cancelTimers:function(){var e,t;for(e=0,t=m.length;t>e;e++)clearTimeout(m[e][2]);for(m=[],e=0,t=f.length;t>e;e++)clearTimeout(f[e][2]);f=[],a&&(clearTimeout(a),a=null),p=[],s&&(clearTimeout(s),s=null)},hasTimers:function(){return!!p.length||s},cancel:function(e){if(e&&"object"==typeof e&&e.queue&&e.method)return e.queue.cancel(e);if("function"==typeof e)for(var t=0,r=p.length;r>t;t+=2)if(p[t+1]===e)return p.splice(t,2),!0}},r.prototype.schedule=r.prototype.defer,r.prototype.scheduleOnce=r.prototype.deferOnce,r.prototype.later=r.prototype.setTimeout,t.Backburner=r})}(),function(){function e(){!Ember.run.currentRunLoop}var r=function(e){Ember.run.currentRunLoop=e},n=function(e,t){Ember.run.currentRunLoop=t},i=t("backburner").Backburner,o=new i(["sync","actions","destroy"],{sync:{before:Ember.beginPropertyChanges,after:Ember.endPropertyChanges},defaultQueue:"actions",onBegin:r,onEnd:n}),s=[].slice;Ember.run=function(){var e;if(Ember.onerror)try{e=o.run.apply(o,arguments)}catch(t){Ember.onerror(t)}else e=o.run.apply(o,arguments);return e},Ember.run.join=function(){if(!Ember.run.currentRunLoop)return Ember.run.apply(Ember.run,arguments);var e=s.call(arguments);e.unshift("actions"),Ember.run.schedule.apply(Ember.run,e)},Ember.run.backburner=o,Ember.run,Ember.run.currentRunLoop=null,Ember.run.queues=o.queueNames,Ember.run.begin=function(){o.begin()},Ember.run.end=function(){o.end()},Ember.run.schedule=function(){e(),o.schedule.apply(o,arguments)},Ember.run.hasScheduledTimers=function(){return o.hasTimers()},Ember.run.cancelTimers=function(){o.cancelTimers()},Ember.run.sync=function(){o.currentInstance&&o.currentInstance.queues.sync.flush()},Ember.run.later=function(){return o.later.apply(o,arguments)},Ember.run.once=function(){e();var t=s.call(arguments);return t.unshift("actions"),o.scheduleOnce.apply(o,t)},Ember.run.scheduleOnce=function(){return e(),o.scheduleOnce.apply(o,arguments)},Ember.run.next=function(){var e=s.call(arguments);return e.push(1),o.later.apply(o,e)},Ember.run.cancel=function(e){return o.cancel(e)},Ember.run.debounce=function(){return o.debounce.apply(o,arguments)},Ember.run.throttle=function(){return o.throttle.apply(o,arguments)}}(),function(){function e(e,t){return r(o(t)?Ember.lookup:e,t)}function t(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])}Ember.LOG_BINDINGS=!1||!!Ember.ENV.LOG_BINDINGS;var r=Ember.get,n=(Ember.set,Ember.guidFor),i=/^([A-Z$]|([0-9][A-Z$]))/,o=Ember.isGlobalPath=function(e){return i.test(e)},s=function(e,t){this._direction="fwd",this._from=t,this._to=e,this._directionMap=Ember.Map.create()};s.prototype={copy:function(){var e=new s(this._to,this._from);return this._oneWay&&(e._oneWay=!0),e},from:function(e){return this._from=e,this},to:function(e){return this._to=e,this},oneWay:function(){return this._oneWay=!0,this},toString:function(){var e=this._oneWay?"[oneWay]":"";return"Ember.Binding<"+n(this)+">("+this._from+" -> "+this._to+")"+e},connect:function(t){var r=this._from,n=this._to;return Ember.trySet(t,n,e(t,r)),Ember.addObserver(t,r,this,this.fromDidChange),this._oneWay||Ember.addObserver(t,n,this,this.toDidChange),this._readyToSync=!0,this},disconnect:function(e){var t=!this._oneWay;return Ember.removeObserver(e,this._from,this,this.fromDidChange),t&&Ember.removeObserver(e,this._to,this,this.toDidChange),this._readyToSync=!1,this},fromDidChange:function(e){this._scheduleSync(e,"fwd")},toDidChange:function(e){this._scheduleSync(e,"back")},_scheduleSync:function(e,t){var r=this._directionMap,n=r.get(e);n||(Ember.run.schedule("sync",this,this._sync,e),r.set(e,t)),"back"===n&&"fwd"===t&&r.set(e,"fwd")},_sync:function(t){var n=Ember.LOG_BINDINGS;if(!t.isDestroyed&&this._readyToSync){var i=this._directionMap,o=i.get(t),s=this._from,a=this._to;if(i.remove(t),"fwd"===o){var u=e(t,this._from);n&&Ember.Logger.log(" ",this.toString(),"->",u,t),this._oneWay?Ember.trySet(t,a,u):Ember._suspendObserver(t,a,this,this.toDidChange,function(){Ember.trySet(t,a,u)})}else if("back"===o){var c=r(t,this._to);n&&Ember.Logger.log(" ",this.toString(),"<-",c,t),Ember._suspendObserver(t,s,this,this.fromDidChange,function(){Ember.trySet(Ember.isGlobalPath(s)?Ember.lookup:t,s,c)})}}}},t(s,{from:function(){var e=this,t=new e;return t.from.apply(t,arguments)},to:function(){var e=this,t=new e;return t.to.apply(t,arguments)},oneWay:function(e,t){var r=this,n=new r(null,e);return n.oneWay(t)}}),Ember.Binding=s,Ember.bind=function(e,t,r){return new Ember.Binding(t,r).connect(e)},Ember.oneWay=function(e,t,r){return new Ember.Binding(t,r).oneWay().connect(e)}}(),function(){function e(e){var t=Ember.meta(e,!0),r=t.mixins;return r?t.hasOwnProperty("mixins")||(r=t.mixins=V(r)):r=t.mixins={},r}function t(e,t){return t&&t.length>0&&(e.mixins=C.call(t,function(e){if(e instanceof y)return e;var t=new y;return t.properties=e,t})),e}function r(e){return"function"==typeof e&&e.isMethod!==!1&&e!==Boolean&&e!==Object&&e!==Number&&e!==Array&&e!==Date&&e!==String}function n(e,t){var r;return t instanceof y?(r=T(t),e[r]?S:(e[r]=t,t.properties)):t}function i(e,t,r,n){var i;return i=r[e]||n[e],t[e]&&(i=i?i.concat(t[e]):t[e]),i}function o(e,t,r,n,i){var o;return void 0===n[t]&&(o=i[t]),o=o||e.descs[t],o&&o instanceof Ember.ComputedProperty?(r=V(r),r.func=Ember.wrap(r.func,o.func),r):r}function s(e,t,r,n,i){var o;return void 0===i[t]&&(o=n[t]),o=o||e[t],"function"!=typeof o?r:Ember.wrap(r,o)}function a(e,t,r,n){var i=n[t]||e[t];return i?"function"==typeof i.concat?i.concat(r):Ember.makeArray(i).concat(r):Ember.makeArray(r)}function u(e,t,n,i){var o=i[t]||e[t];if(!o)return n;var a=Ember.merge({},o);for(var u in n)if(n.hasOwnProperty(u)){var c=n[u];a[u]=r(c)?s(e,u,c,o,{}):c}return a}function c(e,t,n,i,c,l,h,m){if(n instanceof Ember.Descriptor){if(n===w&&c[t])return S;n.func&&(n=o(i,t,n,l,c)),c[t]=n,l[t]=void 0}else r(n)?n=s(e,t,n,l,c):h&&O.call(h,t)>=0||"concatenatedProperties"===t||"mergedProperties"===t?n=a(e,t,n,l):m&&O.call(m,t)>=0&&(n=u(e,t,n,l)),c[t]=void 0,l[t]=n}function l(e,t,r,o,s,a){function u(e){delete r[e],delete o[e]}for(var h,m,f,p,d,b,v=0,E=e.length;E>v;v++)if(h=e[v],m=n(t,h),m!==S)if(m){b=Ember.meta(s),s.willMergeMixin&&s.willMergeMixin(m),p=i("concatenatedProperties",m,o,s),d=i("mergedProperties",m,o,s);for(f in m)m.hasOwnProperty(f)&&(a.push(f),c(s,f,m[f],b,r,o,p,d));m.hasOwnProperty("toString")&&(s.toString=m.toString)}else h.mixins&&(l(h.mixins,t,r,o,s,a),h._without&&A.call(h._without,u))}function h(e,t,r,n){if(N.test(t)){var i=n.bindings;i?n.hasOwnProperty("bindings")||(i=n.bindings=V(n.bindings)):i=n.bindings={},i[t]=r}}function m(e,t){var r,n,i,o=t.bindings;if(o){for(r in o)n=o[r],n&&(i=r.slice(0,-7),n instanceof Ember.Binding?(n=n.copy(),n.to(i)):n=new Ember.Binding(i,n),n.connect(e),e[r]=n);t.bindings={}}}function f(e,t){return m(e,t||Ember.meta(e)),e}function p(e,t,r,n,i){var o,s=t.methodName;return n[s]||i[s]?(o=i[s],t=n[s]):r.descs[s]?(t=r.descs[s],o=void 0):(t=void 0,o=e[s]),{desc:t,value:o}}function d(e,t,r,n,i){var o=r[n];if(o)for(var s=0,a=o.length;a>s;s++)Ember[i](e,o[s],null,t)}function b(e,t,r){var n=e[t];"function"==typeof n&&(d(e,t,n,"__ember_observesBefore__","removeBeforeObserver"),d(e,t,n,"__ember_observes__","removeObserver"),d(e,t,n,"__ember_listens__","removeListener")),"function"==typeof r&&(d(e,t,r,"__ember_observesBefore__","addBeforeObserver"),d(e,t,r,"__ember_observes__","addObserver"),d(e,t,r,"__ember_listens__","addListener"))}function v(t,r,n){var i,o,s,a={},u={},c=Ember.meta(t),m=[];l(r,e(t),a,u,t,m);for(var d=0,v=m.length;v>d;d++)if(i=m[d],"constructor"!==i&&u.hasOwnProperty(i)&&(s=a[i],o=u[i],s!==w)){for(;s&&s instanceof _;){var E=p(t,s,c,a,u);s=E.desc,o=E.value}(void 0!==s||void 0!==o)&&(b(t,i,o),h(t,i,o,c),x(t,i,s,o,c))}return n||f(t,c),t}function E(e,t,r){var n=T(e);if(r[n])return!1;if(r[n]=!0,e===t)return!0;for(var i=e.mixins,o=i?i.length:0;--o>=0;)if(E(i[o],t,r))return!0;return!1}function g(e,t,r){if(!r[T(t)])if(r[T(t)]=!0,t.properties){var n=t.properties;for(var i in n)n.hasOwnProperty(i)&&(e[i]=!0)}else t.mixins&&A.call(t.mixins,function(t){g(e,t,r)})}var y,w,_,C=Ember.ArrayPolyfills.map,O=Ember.ArrayPolyfills.indexOf,A=Ember.ArrayPolyfills.forEach,P=[].slice,V=Ember.create,x=Ember.defineProperty,T=Ember.guidFor,S={},N=Ember.IS_BINDING=/^.+Binding$/;Ember.mixin=function(e){var t=P.call(arguments,1);return v(e,t,!1),e},Ember.Mixin=function(){return t(this,arguments)},y=Ember.Mixin,y.prototype={properties:null,mixins:null,ownerConstructor:null},y._apply=v,y.applyPartial=function(e){var t=P.call(arguments,1);return v(e,t,!0)},y.finishPartial=f,Ember.anyUnprocessedMixins=!1,y.create=function(){Ember.anyUnprocessedMixins=!0;var e=this;return t(new e,arguments)};var D=y.prototype;D.reopen=function(){var e,t;this.properties?(e=y.create(),e.properties=this.properties,delete this.properties,this.mixins=[e]):this.mixins||(this.mixins=[]);var r,n=arguments.length,i=this.mixins;for(r=0;n>r;r++)e=arguments[r],e instanceof y?i.push(e):(t=y.create(),t.properties=e,i.push(t));return this},D.apply=function(e){return v(e,[this],!1)},D.applyPartial=function(e){return v(e,[this],!0)},D.detect=function(e){if(!e)return!1;if(e instanceof y)return E(e,this,{});var t=Ember.meta(e,!1).mixins;return t?!!t[T(this)]:!1},D.without=function(){var e=new y(this);return e._without=P.call(arguments),e},D.keys=function(){var e={},t={},r=[];g(e,this,t);for(var n in e)e.hasOwnProperty(n)&&r.push(n);return r},y.mixins=function(e){var t=Ember.meta(e,!1).mixins,r=[];if(!t)return r;for(var n in t){var i=t[n];i.properties||r.push(i)}return r},w=new Ember.Descriptor,w.toString=function(){return"(Required Property)"},Ember.required=function(){return w},_=function(e){this.methodName=e},_.prototype=new Ember.Descriptor,Ember.alias=function(e){return new _(e)},Ember.alias=Ember.deprecateFunc("Ember.alias is deprecated. Please use Ember.aliasMethod or Ember.computed.alias instead.",Ember.alias),Ember.aliasMethod=function(e){return new _(e)},Ember.observer=function(e){var t=P.call(arguments,1);return e.__ember_observes__=t,e},Ember.immediateObserver=function(){for(var e=0,t=arguments.length;t>e;e++)arguments[e];return Ember.observer.apply(this,arguments)},Ember.beforeObserver=function(e){var t=P.call(arguments,1);return e.__ember_observesBefore__=t,e}}(),function(){e("rsvp/all",["rsvp/promise","exports"],function(e,t){"use strict";function r(e){if("[object Array]"!==Object.prototype.toString.call(e))throw new TypeError("You must pass an array to all.");return new n(function(t,r){function n(e){return function(t){i(e,t)}}function i(e,r){s[e]=r,0===--a&&t(s)}var o,s=[],a=e.length;0===a&&t([]);for(var u=0;u<e.length;u++)o=e[u],o&&"function"==typeof o.then?o.then(n(u),r):i(u,o)})}var n=e.Promise;t.all=r}),e("rsvp/async",["exports"],function(e){"use strict";function t(){return function(e,t){process.nextTick(function(){e(t)})}}function r(){return function(e,t){setImmediate(function(){e(t)})}}function n(){var e=[],t=new a(function(){var t=e.slice();e=[],t.forEach(function(e){var t=e[0],r=e[1];t(r)})}),r=document.createElement("div");return t.observe(r,{attributes:!0}),window.addEventListener("unload",function(){t.disconnect(),t=null},!1),function(t,n){e.push([t,n]),r.setAttribute("drainQueue","drainQueue")}}function i(){return function(e,t){u.setTimeout(function(){e(t)},1)}}var o,s="undefined"!=typeof window?window:{},a=s.MutationObserver||s.WebKitMutationObserver,u="undefined"!=typeof global?global:this;o="function"==typeof setImmediate?r():"undefined"!=typeof process&&"[object process]"==={}.toString.call(process)?t():a?n():i(),e.async=o}),e("rsvp/config",["rsvp/async","exports"],function(e,t){"use strict";var r=e.async,n={};n.async=r,t.config=n}),e("rsvp/defer",["rsvp/promise","exports"],function(e,t){"use strict";function r(){var e={resolve:void 0,reject:void 0,promise:void 0};return e.promise=new n(function(t,r){e.resolve=t,e.reject=r}),e}var n=e.Promise;t.defer=r}),e("rsvp/events",["exports"],function(e){"use strict";var t=function(e,t){this.type=e;for(var r in t)t.hasOwnProperty(r)&&(this[r]=t[r])},r=function(e,t){for(var r=0,n=e.length;n>r;r++)if(e[r][0]===t)return r;return-1},n=function(e){var t=e._promiseCallbacks;return t||(t=e._promiseCallbacks={}),t},i={mixin:function(e){return e.on=this.on,e.off=this.off,e.trigger=this.trigger,e},on:function(e,t,i){var o,s,a=n(this);for(e=e.split(/\s+/),i=i||this;s=e.shift();)o=a[s],o||(o=a[s]=[]),-1===r(o,t)&&o.push([t,i])},off:function(e,t){var i,o,s,a=n(this);for(e=e.split(/\s+/);o=e.shift();)t?(i=a[o],s=r(i,t),-1!==s&&i.splice(s,1)):a[o]=[]},trigger:function(e,r){var i,o,s,a,u,c=n(this);if(i=c[e])for(var l=0;l<i.length;l++)o=i[l],s=o[0],a=o[1],"object"!=typeof r&&(r={detail:r}),u=new t(e,r),s.call(a,u)}};e.EventTarget=i}),e("rsvp/hash",["rsvp/defer","exports"],function(e,t){"use strict";function r(e){var t=0;for(var r in e)t++;return t}function n(e){var t={},n=i(),o=r(e);0===o&&n.resolve({});var s=function(e){return function(t){a(e,t)}},a=function(e,r){t[e]=r,0===--o&&n.resolve(t)},u=function(e){n.reject(e)};for(var c in e)e[c]&&"function"==typeof e[c].then?e[c].then(s(c),u):a(c,e[c]);return n.promise}var i=e.defer;t.hash=n}),e("rsvp/node",["rsvp/promise","rsvp/all","exports"],function(e,t,r){"use strict";function n(e,t){return function(r,n){r?t(r):arguments.length>2?e(Array.prototype.slice.call(arguments,1)):e(n)}}function i(e){return function(){var t,r,i=Array.prototype.slice.call(arguments),a=this,u=new o(function(e,n){t=e,r=n});return s(i).then(function(i){i.push(n(t,r));try{e.apply(a,i)}catch(o){r(o)}}),u}}var o=e.Promise,s=t.all;r.denodeify=i}),e("rsvp/promise",["rsvp/config","rsvp/events","exports"],function(e,t,r){"use strict";function n(e){return i(e)||"object"==typeof e&&null!==e}function i(e){return"function"==typeof e}function o(e){l.onerror&&l.onerror(e.detail)}function s(e,t){e===t?u(e,t):a(e,t)||u(e,t)}function a(e,t){var r,o=null;try{if(e===t)throw new TypeError("A promises callback cannot return that same promise.");if(n(t)&&(o=t.then,i(o)))return o.call(t,function(n){return r?!0:(r=!0,t!==n?s(e,n):u(e,n),void 0)},function(t){return r?!0:(r=!0,c(e,t),void 0)}),!0}catch(a){return c(e,a),!0}return!1}function u(e,t){l.async(function(){e.trigger("promise:resolved",{detail:t}),e.isFulfilled=!0,e.fulfillmentValue=t})}function c(e,t){l.async(function(){e.trigger("promise:failed",{detail:t}),e.isRejected=!0,e.rejectedReason=t})}var l=e.config,h=t.EventTarget,m=function(e){var t=this,r=!1;if("function"!=typeof e)throw new TypeError("You must pass a resolver function as the sole argument to the promise constructor");if(!(t instanceof m))return new m(e);var n=function(e){r||(r=!0,s(t,e))},i=function(e){r||(r=!0,c(t,e))};this.on("promise:resolved",function(e){this.trigger("success",{detail:e.detail})},this),this.on("promise:failed",function(e){this.trigger("error",{detail:e.detail})},this),this.on("error",o);try{e(n,i)}catch(a){i(a)}},f=function(e,t,r,n){var o,u,l,h,m=i(r);if(m)try{o=r(n.detail),l=!0}catch(f){h=!0,u=f}else o=n.detail,l=!0;a(t,o)||(m&&l?s(t,o):h?c(t,u):"resolve"===e?s(t,o):"reject"===e&&c(t,o))};m.prototype={constructor:m,isRejected:void 0,isFulfilled:void 0,rejectedReason:void 0,fulfillmentValue:void 0,then:function(e,t){this.off("error",o);var r=new this.constructor(function(){});return this.isFulfilled&&l.async(function(t){f("resolve",r,e,{detail:t.fulfillmentValue})},this),this.isRejected&&l.async(function(e){f("reject",r,t,{detail:e.rejectedReason})},this),this.on("promise:resolved",function(t){f("resolve",r,e,t)}),this.on("promise:failed",function(e){f("reject",r,t,e)}),r},fail:function(e){return this.then(null,e)}},h.mixin(m.prototype),r.Promise=m}),e("rsvp/reject",["rsvp/promise","exports"],function(e,t){"use strict";function r(e){return new n(function(t,r){r(e)})}var n=e.Promise;t.reject=r}),e("rsvp/resolve",["rsvp/promise","exports"],function(e,t){"use strict";function r(e){return new n(function(t){t(e)})}var n=e.Promise;t.resolve=r}),e("rsvp/rethrow",["exports"],function(e){"use strict";function t(e){throw r.setTimeout(function(){throw e}),e}var r="undefined"==typeof global?this:global;e.rethrow=t}),e("rsvp",["rsvp/events","rsvp/promise","rsvp/node","rsvp/all","rsvp/hash","rsvp/rethrow","rsvp/defer","rsvp/config","rsvp/resolve","rsvp/reject","exports"],function(e,t,r,n,i,o,s,a,u,c,l){"use strict";function h(e,t){g[e]=t}var m=e.EventTarget,f=t.Promise,p=r.denodeify,d=n.all,b=i.hash,v=o.rethrow,E=s.defer,g=a.config,y=u.resolve,w=c.reject;l.Promise=f,l.EventTarget=m,l.all=d,l.hash=b,l.rethrow=v,l.defer=E,l.denodeify=p,l.configure=h,l.resolve=y,l.reject=w})}(),function(){Ember.MODEL_FACTORY_INJECTIONS=!1||!!Ember.ENV.MODEL_FACTORY_INJECTIONS,e("container",[],function(){function e(e){this.parent=e,this.dict={}}function t(t){this.parent=t,this.children=[],this.resolver=t&&t.resolver||function(){},this.registry=new e(t&&t.registry),this.cache=new e(t&&t.cache),this.factoryCache=new e(t&&t.cache),this.typeInjections=new e(t&&t.typeInjections),this.injections={},this.factoryTypeInjections=new e(t&&t.factoryTypeInjections),this.factoryInjections={},this._options=new e(t&&t._options),this._typeOptions=new e(t&&t._typeOptions)}function r(e){throw new Error(e+" is not currently supported on child containers")}function n(e,t){var r=o(e,t,"singleton");return r!==!1}function i(e,t){var r={};if(!t)return r;for(var n,i,o=0,s=t.length;s>o;o++){if(n=t[o],i=e.lookup(n.fullName),!i)throw new Error("Attempting to inject an unknown injection: `"+n.fullName+"`");r[n.property]=i}return r}function o(e,t,r){var n=e._options.get(t);if(n&&void 0!==n[r])return n[r];var i=t.split(":")[0];return n=e._typeOptions.get(i),n?n[r]:void 0}function s(e,t){var r,n=e.normalize(t),i=e.resolve(n),o=e.factoryCache,s=t.split(":")[0];if(i){if(o.has(t))return o.get(t);if("function"!=typeof i.extend||!Ember.MODEL_FACTORY_INJECTIONS&&"model"===s)return i;var c=a(e,t),l=u(e,t);return l._toString=e.makeToString(i,t),r=i.extend(c),r.reopenClass(l),o.set(t,r),r}}function a(e,t){var r=t.split(":"),n=r[0],o=[];return o=o.concat(e.typeInjections.get(n)||[]),o=o.concat(e.injections[t]||[]),o=i(e,o),o._debugContainerKey=t,o.container=e,o}function u(e,t){var r=t.split(":"),n=r[0],o=[];return o=o.concat(e.factoryTypeInjections.get(n)||[]),o=o.concat(e.factoryInjections[t]||[]),o=i(e,o),o._debugContainerKey=t,o}function c(e,t){var r=s(e,t);return o(e,t,"instantiate")===!1?r:r?"function"==typeof r.extend?r.create():r.create(a(e,t)):void 0}function l(e,t){e.cache.eachLocal(function(r,n){o(e,r,"instantiate")!==!1&&t(n)})}function h(e){e.cache.eachLocal(function(t,r){o(e,t,"instantiate")!==!1&&r.destroy()}),e.cache.dict={}}function m(e,t,r,n){var i=e.get(t);i||(i=[],e.set(t,i)),i.push({property:r,fullName:n})}function f(e,t,r,n){var i=e[t]=e[t]||[];i.push({property:r,fullName:n})}return e.prototype={parent:null,dict:null,get:function(e){var t=this.dict;return t.hasOwnProperty(e)?t[e]:this.parent?this.parent.get(e):void 0},set:function(e,t){this.dict[e]=t},remove:function(e){delete this.dict[e]},has:function(e){var t=this.dict;return t.hasOwnProperty(e)?!0:this.parent?this.parent.has(e):!1},eachLocal:function(e,t){var r=this.dict;for(var n in r)r.hasOwnProperty(n)&&e.call(t,n,r[n])}},t.prototype={parent:null,children:null,resolver:null,registry:null,cache:null,typeInjections:null,injections:null,_options:null,_typeOptions:null,child:function(){var e=new t(this);return this.children.push(e),e},set:function(e,t,r){e[t]=r},register:function(e,t,r,n){var i;-1!==e.indexOf(":")?(n=r,r=t,i=e):i=e+":"+t;var o=this.normalize(i);this.registry.set(o,r),this._options.set(o,n||{})},unregister:function(e){var t=this.normalize(e);this.registry.remove(t),this.cache.remove(t),this.factoryCache.remove(t),this._options.remove(t)},resolve:function(e){return this.resolver(e)||this.registry.get(e)},describe:function(e){return e},normalize:function(e){return e},makeToString:function(e){return e.toString()},lookup:function(e,t){if(e=this.normalize(e),t=t||{},this.cache.has(e)&&t.singleton!==!1)return this.cache.get(e);var r=c(this,e);return r?(n(this,e)&&t.singleton!==!1&&this.cache.set(e,r),r):void 0},lookupFactory:function(e){return s(this,e)},has:function(e){return this.cache.has(e)?!0:!!s(this,e)},optionsForType:function(e,t){this.parent&&r("optionsForType"),this._typeOptions.set(e,t)},options:function(e,t){this.optionsForType(e,t)},typeInjection:function(e,t,n){this.parent&&r("typeInjection"),m(this.typeInjections,e,t,n)},injection:function(e,t,n){return this.parent&&r("injection"),-1===e.indexOf(":")?this.typeInjection(e,t,n):(f(this.injections,e,t,n),void 0)},factoryTypeInjection:function(e,t,n){this.parent&&r("factoryTypeInjection"),m(this.factoryTypeInjections,e,t,n)},factoryInjection:function(e,t,n){return this.parent&&r("injection"),-1===e.indexOf(":")?this.factoryTypeInjection(e,t,n):(f(this.factoryInjections,e,t,n),void 0)},destroy:function(){this.isDestroyed=!0;for(var e=0,t=this.children.length;t>e;e++)this.children[e].destroy();this.children=[],l(this,function(e){e.destroy()}),this.parent=void 0,this.isDestroyed=!0},reset:function(){for(var e=0,t=this.children.length;t>e;e++)h(this.children[e]);h(this)}},t})}(),function(){function e(r,n,i,o){var s,a,u;if("object"!=typeof r||null===r)return r;if(n&&(a=t(i,r))>=0)return o[a];if("array"===Ember.typeOf(r)){if(s=r.slice(),n)for(a=s.length;--a>=0;)s[a]=e(s[a],n,i,o)}else if(Ember.Copyable&&Ember.Copyable.detect(r))s=r.copy(n,i,o);else{s={};for(u in r)r.hasOwnProperty(u)&&"__"!==u.substring(0,2)&&(s[u]=n?e(r[u],n,i,o):r[u])}return n&&(i.push(r),o.push(s)),s}var t=Ember.EnumerableUtils.indexOf;Ember.compare=function n(e,t){if(e===t)return 0;var r=Ember.typeOf(e),i=Ember.typeOf(t),o=Ember.Comparable;if(o){if("instance"===r&&o.detect(e.constructor))return e.constructor.compare(e,t);if("instance"===i&&o.detect(t.constructor))return 1-t.constructor.compare(t,e)}var s=Ember.ORDER_DEFINITION_MAPPING;if(!s){var a=Ember.ORDER_DEFINITION;s=Ember.ORDER_DEFINITION_MAPPING={};var u,c;for(u=0,c=a.length;c>u;++u)s[a[u]]=u;delete Ember.ORDER_DEFINITION}var l=s[r],h=s[i];if(h>l)return-1;if(l>h)return 1;switch(r){case"boolean":case"number":return t>e?-1:e>t?1:0;case"string":var m=e.localeCompare(t);return 0>m?-1:m>0?1:0;case"array":for(var f=e.length,p=t.length,d=Math.min(f,p),b=0,v=0;0===b&&d>v;)b=n(e[v],t[v]),v++;return 0!==b?b:p>f?-1:f>p?1:0;case"instance":return Ember.Comparable&&Ember.Comparable.detect(e)?e.compare(e,t):0;case"date":var E=e.getTime(),g=t.getTime();return g>E?-1:E>g?1:0;default:return 0}},Ember.copy=function(t,r){return"object"!=typeof t||null===t?t:Ember.Copyable&&Ember.Copyable.detect(t)?t.copy(r):e(t,r,r?[]:null,r?[]:null)},Ember.inspect=function(e){var t=Ember.typeOf(e);if("array"===t)return"["+e+"]";if("object"!==t)return e+"";var r,n=[];for(var i in e)if(e.hasOwnProperty(i)){if(r=e[i],"toString"===r)continue;"function"===Ember.typeOf(r)&&(r="function() { ... }"),n.push(i+": "+r)}return"{"+n.join(", ")+"}"},Ember.isEqual=function(e,t){return e&&"function"==typeof e.isEqual?e.isEqual(t):e===t},Ember.ORDER_DEFINITION=Ember.ENV.ORDER_DEFINITION||["undefined","null","boolean","number","string","array","object","instance","function","class","date"],Ember.keys=Object.keys,(!Ember.keys||Ember.create.isSimulated)&&(Ember.keys=function(e){var t=[];for(var r in e)"__"!==r.substring(0,2)&&"_super"!==r&&e.hasOwnProperty(r)&&t.push(r);return t});var r=["description","fileName","lineNumber","message","name","number","stack"];Ember.Error=function(){for(var e=Error.apply(this,arguments),t=0;t<r.length;t++)this[r[t]]=e[r[t]]},Ember.Error.prototype=Ember.create(Error.prototype)}(),function(){function e(){return 0===a.length?{}:a.pop()}function t(e){return a.push(e),null}function r(e,t){function r(r){var o=n(r,e);return i?t===o:!!o}var i=2===arguments.length;return r}var n=Ember.get,i=Ember.set,o=Array.prototype.slice,s=Ember.EnumerableUtils.indexOf,a=[];Ember.Enumerable=Ember.Mixin.create({nextObject:Ember.required(Function),firstObject:Ember.computed(function(){if(0===n(this,"length"))return void 0;var r,i=e();return r=this.nextObject(0,null,i),t(i),r}).property("[]"),lastObject:Ember.computed(function(){var r=n(this,"length");if(0===r)return void 0;var i,o=e(),s=0,a=null;do a=i,i=this.nextObject(s++,a,o);while(void 0!==i);return t(o),a}).property("[]"),contains:function(e){return void 0!==this.find(function(t){return t===e})},forEach:function(r,i){if("function"!=typeof r)throw new TypeError;var o=n(this,"length"),s=null,a=e();void 0===i&&(i=null);for(var u=0;o>u;u++){var c=this.nextObject(u,s,a);r.call(i,c,u,this),s=c}return s=null,a=t(a),this},getEach:function(e){return this.mapBy(e)},setEach:function(e,t){return this.forEach(function(r){i(r,e,t)})},map:function(e,t){var r=Ember.A();return this.forEach(function(n,i,o){r[i]=e.call(t,n,i,o)}),r},mapBy:function(e){return this.map(function(t){return n(t,e)})},mapProperty:Ember.aliasMethod("mapBy"),filter:function(e,t){var r=Ember.A();return this.forEach(function(n,i,o){e.call(t,n,i,o)&&r.push(n)}),r},reject:function(e,t){return this.filter(function(){return!e.apply(t,arguments)})},filterBy:function(){return this.filter(r.apply(this,arguments))},filterProperty:Ember.aliasMethod("filterBy"),rejectBy:function(e,t){var r=function(r){return n(r,e)===t},i=function(t){return!!n(t,e)},o=2===arguments.length?r:i;return this.reject(o)},rejectProperty:Ember.aliasMethod("rejectBy"),find:function(r,i){var o=n(this,"length");void 0===i&&(i=null);for(var s,a,u=null,c=!1,l=e(),h=0;o>h&&!c;h++)s=this.nextObject(h,u,l),(c=r.call(i,s,h,this))&&(a=s),u=s;return s=u=null,l=t(l),a},findBy:function(){return this.find(r.apply(this,arguments))},findProperty:Ember.aliasMethod("findBy"),every:function(e,t){return!this.find(function(r,n,i){return!e.call(t,r,n,i)})},everyBy:function(){return this.every(r.apply(this,arguments))},everyProperty:Ember.aliasMethod("everyBy"),any:function(e,t){return!!this.find(function(r,n,i){return!!e.call(t,r,n,i)})},some:Ember.aliasMethod("any"),anyBy:function(){return this.any(r.apply(this,arguments))},someProperty:Ember.aliasMethod("anyBy"),reduce:function(e,t,r){if("function"!=typeof e)throw new TypeError;var n=t;return this.forEach(function(t,i){n=e.call(null,n,t,i,this,r)},this),n},invoke:function(e){var t,r=Ember.A();return arguments.length>1&&(t=o.call(arguments,1)),this.forEach(function(n,i){var o=n&&n[e];"function"==typeof o&&(r[i]=t?o.apply(n,t):o.call(n))},this),r},toArray:function(){var e=Ember.A();return this.forEach(function(t,r){e[r]=t}),e},compact:function(){return this.filter(function(e){return null!=e})},without:function(e){if(!this.contains(e))return this;var t=Ember.A();return this.forEach(function(r){r!==e&&(t[t.length]=r)}),t},uniq:function(){var e=Ember.A();return this.forEach(function(t){s(e,t)<0&&e.push(t)}),e},"[]":Ember.computed(function(){return this}),addEnumerableObserver:function(e,t){var r=t&&t.willChange||"enumerableWillChange",i=t&&t.didChange||"enumerableDidChange",o=n(this,"hasEnumerableObservers");return o||Ember.propertyWillChange(this,"hasEnumerableObservers"),Ember.addListener(this,"@enumerable:before",e,r),Ember.addListener(this,"@enumerable:change",e,i),o||Ember.propertyDidChange(this,"hasEnumerableObservers"),this},removeEnumerableObserver:function(e,t){var r=t&&t.willChange||"enumerableWillChange",i=t&&t.didChange||"enumerableDidChange",o=n(this,"hasEnumerableObservers");return o&&Ember.propertyWillChange(this,"hasEnumerableObservers"),Ember.removeListener(this,"@enumerable:before",e,r),Ember.removeListener(this,"@enumerable:change",e,i),o&&Ember.propertyDidChange(this,"hasEnumerableObservers"),this},hasEnumerableObservers:Ember.computed(function(){return Ember.hasListeners(this,"@enumerable:change")||Ember.hasListeners(this,"@enumerable:before")}),enumerableContentWillChange:function(e,t){var r,i,o;return r="number"==typeof e?e:e?n(e,"length"):e=-1,i="number"==typeof t?t:t?n(t,"length"):t=-1,o=0>i||0>r||0!==i-r,-1===e&&(e=null),-1===t&&(t=null),Ember.propertyWillChange(this,"[]"),o&&Ember.propertyWillChange(this,"length"),Ember.sendEvent(this,"@enumerable:before",[this,e,t]),this},enumerableContentDidChange:function(e,t){var r,i,o;return r="number"==typeof e?e:e?n(e,"length"):e=-1,i="number"==typeof t?t:t?n(t,"length"):t=-1,o=0>i||0>r||0!==i-r,-1===e&&(e=null),-1===t&&(t=null),Ember.sendEvent(this,"@enumerable:change",[this,e,t]),o&&Ember.propertyDidChange(this,"length"),Ember.propertyDidChange(this,"[]"),this
}})}(),function(){var e=Ember.get,t=(Ember.set,Ember.isNone),r=Ember.EnumerableUtils.map,n=Ember.cacheFor;Ember.Array=Ember.Mixin.create(Ember.Enumerable,{length:Ember.required(),objectAt:function(t){return 0>t||t>=e(this,"length")?void 0:e(this,t)},objectsAt:function(e){var t=this;return r(e,function(e){return t.objectAt(e)})},nextObject:function(e){return this.objectAt(e)},"[]":Ember.computed(function(t,r){return void 0!==r&&this.replace(0,e(this,"length"),r),this}),firstObject:Ember.computed(function(){return this.objectAt(0)}),lastObject:Ember.computed(function(){return this.objectAt(e(this,"length")-1)}),contains:function(e){return this.indexOf(e)>=0},slice:function(r,n){var i=Ember.A(),o=e(this,"length");for(t(r)&&(r=0),(t(n)||n>o)&&(n=o),0>r&&(r=o+r),0>n&&(n=o+n);n>r;)i[i.length]=this.objectAt(r++);return i},indexOf:function(t,r){var n,i=e(this,"length");for(void 0===r&&(r=0),0>r&&(r+=i),n=r;i>n;n++)if(this.objectAt(n)===t)return n;return-1},lastIndexOf:function(t,r){var n,i=e(this,"length");for((void 0===r||r>=i)&&(r=i-1),0>r&&(r+=i),n=r;n>=0;n--)if(this.objectAt(n)===t)return n;return-1},addArrayObserver:function(t,r){var n=r&&r.willChange||"arrayWillChange",i=r&&r.didChange||"arrayDidChange",o=e(this,"hasArrayObservers");return o||Ember.propertyWillChange(this,"hasArrayObservers"),Ember.addListener(this,"@array:before",t,n),Ember.addListener(this,"@array:change",t,i),o||Ember.propertyDidChange(this,"hasArrayObservers"),this},removeArrayObserver:function(t,r){var n=r&&r.willChange||"arrayWillChange",i=r&&r.didChange||"arrayDidChange",o=e(this,"hasArrayObservers");return o&&Ember.propertyWillChange(this,"hasArrayObservers"),Ember.removeListener(this,"@array:before",t,n),Ember.removeListener(this,"@array:change",t,i),o&&Ember.propertyDidChange(this,"hasArrayObservers"),this},hasArrayObservers:Ember.computed(function(){return Ember.hasListeners(this,"@array:change")||Ember.hasListeners(this,"@array:before")}),arrayContentWillChange:function(t,r,n){void 0===t?(t=0,r=n=-1):(void 0===r&&(r=-1),void 0===n&&(n=-1)),Ember.isWatching(this,"@each")&&e(this,"@each"),Ember.sendEvent(this,"@array:before",[this,t,r,n]);var i,o;if(t>=0&&r>=0&&e(this,"hasEnumerableObservers")){i=[],o=t+r;for(var s=t;o>s;s++)i.push(this.objectAt(s))}else i=r;return this.enumerableContentWillChange(i,n),this},arrayContentDidChange:function(t,r,i){void 0===t?(t=0,r=i=-1):(void 0===r&&(r=-1),void 0===i&&(i=-1));var o,s;if(t>=0&&i>=0&&e(this,"hasEnumerableObservers")){o=[],s=t+i;for(var a=t;s>a;a++)o.push(this.objectAt(a))}else o=i;this.enumerableContentDidChange(r,o),Ember.sendEvent(this,"@array:change",[this,t,r,i]);var u=e(this,"length"),c=n(this,"firstObject"),l=n(this,"lastObject");return this.objectAt(0)!==c&&(Ember.propertyWillChange(this,"firstObject"),Ember.propertyDidChange(this,"firstObject")),this.objectAt(u-1)!==l&&(Ember.propertyWillChange(this,"lastObject"),Ember.propertyDidChange(this,"lastObject")),this},"@each":Ember.computed(function(){return this.__each||(this.__each=new Ember.EachProxy(this)),this.__each})})}(),function(){function e(e,t,r){this.callbacks=e,this.cp=t,this.instanceMeta=r,this.dependentKeysByGuid={},this.trackedArraysByGuid={},this.changedItems={}}function t(e,t,r){this.dependentArray=e,this.index=t,this.item=e.objectAt(t),this.trackedArray=r,this.beforeObserver=null,this.observer=null}function r(e,t,r,n,i,o){var s={arrayChanged:e,index:r,item:t,propertyName:n,property:i};return o&&(s.previousValues=o),s}function n(e,t,n,i,o){E(e,function(s,a){o.setValue(t.addedItem.call(this,o.getValue(),s,r(e,s,a,i,n),o.sugarMeta))},this)}function i(e,t){var r;e._callbacks(),e._hasInstanceMeta(this,t)?(r=e._instanceMeta(this,t),r.setValue(e.resetValue(r.getValue()))):r=e._instanceMeta(this,t),e.options.initialize&&e.options.initialize.call(this,r.getValue(),{property:e,propertyName:t},r.sugarMeta)}function o(e,t,r){this.context=e,this.propertyName=t,this.cache=l(e).cache,this.dependentArrays={},this.sugarMeta={},this.initialValue=r}function s(e){var t=this;this.options=e,this._instanceMetas={},this._dependentKeys=null,this._itemPropertyKeys={},this._previousItemPropertyKeys={},this.readOnly(),this.cacheable(),this.recomputeOnce=function(e){Ember.run.once(this,r,e)};var r=function(e){var r=(t._dependentKeys,t._instanceMeta(this,e)),o=t._callbacks();i.call(this,t,e),E(t._dependentKeys,function(e){var n=u(this,e),i=r.dependentArrays[e];n===i?t._previousItemPropertyKeys[e]&&(delete t._previousItemPropertyKeys[e],r.dependentArraysObserver.setupPropertyObservers(e,t._itemPropertyKeys[e])):(r.dependentArrays[e]=n,i&&r.dependentArraysObserver.teardownObservers(i,e),n&&r.dependentArraysObserver.setupObservers(n,e))},this),E(t._dependentKeys,function(i){var s=u(this,i);s&&n.call(this,s,o,t,e,r)},this)};this.func=function(e){return r.call(this,e),t._instanceMeta(this,e).getValue()}}function a(e){return e}var u=Ember.get,c=(Ember.set,Ember.guidFor),l=Ember.meta,h=Ember.addBeforeObserver,m=Ember.removeBeforeObserver,f=Ember.addObserver,p=Ember.removeObserver,d=Ember.ComputedProperty,b=[].slice,v=Ember.create,E=Ember.EnumerableUtils.forEach,g=/^(.*)\.@each\.(.*)/,y=/(.*\.@each){2,}/;e.prototype={setValue:function(e){this.instanceMeta.setValue(e)},getValue:function(){return this.instanceMeta.getValue()},setupObservers:function(e,t){this.dependentKeysByGuid[c(e)]=t,e.addArrayObserver(this,{willChange:"dependentArrayWillChange",didChange:"dependentArrayDidChange"}),this.cp._itemPropertyKeys[t]&&this.setupPropertyObservers(t,this.cp._itemPropertyKeys[t])},teardownObservers:function(e,t){var r=this.cp._itemPropertyKeys[t]||[];delete this.dependentKeysByGuid[c(e)],this.teardownPropertyObservers(t,r),e.removeArrayObserver(this,{willChange:"dependentArrayWillChange",didChange:"dependentArrayDidChange"})},setupPropertyObservers:function(e,t){var r=u(this.instanceMeta.context,e),n=u(r,"length"),i=new Array(n);this.resetTransformations(e,i),E(r,function(n,o){var s=this.createPropertyObserverContext(r,o,this.trackedArraysByGuid[e]);i[o]=s,E(t,function(e){h(n,e,this,s.beforeObserver),f(n,e,this,s.observer)},this)},this)},teardownPropertyObservers:function(e,t){var r,n,i,o=this,s=this.trackedArraysByGuid[e];s&&s.apply(function(e,s,a){a!==Ember.TrackedArray.DELETE&&E(e,function(e){r=e.beforeObserver,n=e.observer,i=e.item,E(t,function(e){m(i,e,o,r),p(i,e,o,n)})})})},createPropertyObserverContext:function(e,r,n){var i=new t(e,r,n);return this.createPropertyObserver(i),i},createPropertyObserver:function(e){var t=this;e.beforeObserver=function(r,n){return t.updateIndexes(e.trackedArray,e.dependentArray),t.itemPropertyWillChange(r,n,e.dependentArray,e.index)},e.observer=function(r,n){return t.itemPropertyDidChange(r,n,e.dependentArray,e.index)}},resetTransformations:function(e,t){this.trackedArraysByGuid[e]=new Ember.TrackedArray(t)},addTransformation:function(e,t,r){var n=this.trackedArraysByGuid[e];n&&n.addItems(t,r)},removeTransformation:function(e,t,r){var n=this.trackedArraysByGuid[e];return n?n.removeItems(t,r):[]},updateIndexes:function(e,t){var r=u(t,"length");e.apply(function(e,t,n){n!==Ember.TrackedArray.DELETE&&(n!==Ember.TrackedArray.RETAIN||e.length!==r||0!==t)&&E(e,function(e,r){e.index=r+t})})},dependentArrayWillChange:function(e,t,n){function i(e){m(s,e,this,l[u].beforeObserver),p(s,e,this,l[u].observer)}var o,s,a,u,l,h=this.callbacks.removedItem,f=c(e),d=this.dependentKeysByGuid[f],b=this.cp._itemPropertyKeys[d]||[];for(l=this.removeTransformation(d,t,n),u=n-1;u>=0;--u)a=t+u,s=e.objectAt(a),E(b,i,this),o=r(e,s,a,this.instanceMeta.propertyName,this.cp),this.setValue(h.call(this.instanceMeta.context,this.getValue(),s,o,this.instanceMeta.sugarMeta))},dependentArrayDidChange:function(e,t,n,i){var o,s,a=this.callbacks.addedItem,u=c(e),l=this.dependentKeysByGuid[u],m=new Array(i),p=this.cp._itemPropertyKeys[l];E(e.slice(t,t+i),function(n,i){p&&(s=m[i]=this.createPropertyObserverContext(e,t+i,this.trackedArraysByGuid[l]),E(p,function(e){h(n,e,this,s.beforeObserver),f(n,e,this,s.observer)},this)),o=r(e,n,t+i,this.instanceMeta.propertyName,this.cp),this.setValue(a.call(this.instanceMeta.context,this.getValue(),n,o,this.instanceMeta.sugarMeta))},this),this.addTransformation(l,t,m)},itemPropertyWillChange:function(e,t,r,n){var i=c(e);this.changedItems[i]||(this.changedItems[i]={array:r,index:n,obj:e,previousValues:{}}),this.changedItems[i].previousValues[t]=u(e,t)},itemPropertyDidChange:function(){Ember.run.once(this,"flushChanges")},flushChanges:function(){var e,t,n,i=this.changedItems;for(e in i)t=i[e],n=r(t.array,t.obj,t.index,this.instanceMeta.propertyName,this.cp,t.previousValues),this.setValue(this.callbacks.removedItem.call(this.instanceMeta.context,this.getValue(),t.obj,n,this.instanceMeta.sugarMeta)),this.setValue(this.callbacks.addedItem.call(this.instanceMeta.context,this.getValue(),t.obj,n,this.instanceMeta.sugarMeta));this.changedItems={}}},o.prototype={getValue:function(){return this.propertyName in this.cache?this.cache[this.propertyName]:this.initialValue},setValue:function(e){void 0!==e?this.cache[this.propertyName]=e:delete this.cache[this.propertyName]}},Ember.ReduceComputedProperty=s,s.prototype=v(d.prototype),s.prototype._callbacks=function(){if(!this.callbacks){var e=this.options;this.callbacks={removedItem:e.removedItem||a,addedItem:e.addedItem||a}}return this.callbacks},s.prototype._hasInstanceMeta=function(e,t){var r=c(e),n=r+":"+t;return!!this._instanceMetas[n]},s.prototype._instanceMeta=function(t,r){var n=c(t),i=n+":"+r,s=this._instanceMetas[i];return s||(s=this._instanceMetas[i]=new o(t,r,this.initialValue()),s.dependentArraysObserver=new e(this._callbacks(),this,s,t,r,s.sugarMeta)),s},s.prototype.initialValue=function(){switch(typeof this.options.initialValue){case"undefined":throw new Error("reduce computed properties require an initial value: did you forget to pass one to Ember.reduceComputed?");case"function":return this.options.initialValue();default:return this.options.initialValue}},s.prototype.resetValue=function(){return this.initialValue()},s.prototype.itemPropertyKey=function(e,t){this._itemPropertyKeys[e]=this._itemPropertyKeys[e]||[],this._itemPropertyKeys[e].push(t)},s.prototype.clearItemPropertyKeys=function(e){this._itemPropertyKeys[e]&&(this._previousItemPropertyKeys[e]=this._itemPropertyKeys[e],this._itemPropertyKeys[e]=[])},s.prototype.property=function(){var e,t,r,n=this,i=(b.call(arguments),[]);return E(b.call(arguments),function(o){if(y.test(o))throw new Error("Nested @each properties not supported: "+o);(e=g.exec(o))?(t=e[1],r=e[2],n.itemPropertyKey(t,r),i.push(t)):i.push(o)}),d.prototype.property.apply(this,i)},Ember.reduceComputed=function(e){var t;if(arguments.length>1&&(t=b.call(arguments,0,-1),e=b.call(arguments,-1)[0]),"object"!=typeof e)throw new Error("Reduce Computed Property declared without an options hash");if(!e.initialValue)throw new Error("Reduce Computed Property declared without an initial value");var r=new s(e);return t&&r.property.apply(r,t),r}}(),function(){function e(){var e=this;return t.apply(this,arguments),this.func=function(t){return function(r){return e._hasInstanceMeta(this,r)||i(e._dependentKeys,function(t){Ember.addObserver(this,t,function(){e.recomputeOnce.call(this,r)})},this),t.apply(this,arguments)}}(this.func),this}var t=Ember.ReduceComputedProperty,r=[].slice,n=Ember.create,i=Ember.EnumerableUtils.forEach;Ember.ArrayComputedProperty=e,e.prototype=n(t.prototype),e.prototype.initialValue=function(){return Ember.A()},e.prototype.resetValue=function(e){return e.clear(),e},Ember.arrayComputed=function(t){var n;if(arguments.length>1&&(n=r.call(arguments,0,-1),t=r.call(arguments,-1)[0]),"object"!=typeof t)throw new Error("Array Computed Property declared without an options hash");var i=new e(t);return n&&i.property.apply(i,n),i}}(),function(){function e(e,n,i,o){function s(e){return Ember.ObjectProxy.detectInstance(e)?r(t(e,"content")):r(e)}var a,u,c,l,h;return arguments.length<4&&(o=t(e,"length")),arguments.length<3&&(i=0),i===o?i:(a=i+Math.floor((o-i)/2),u=e.objectAt(a),l=s(u),h=s(n),l===h?a:(c=this.order(u,n),0===c&&(c=h>l?-1:1),0>c?this.binarySearch(e,n,a+1,o):c>0?this.binarySearch(e,n,i,a):a))}var t=Ember.get,r=(Ember.set,Ember.guidFor),n=Ember.merge,i=[].slice,o=Ember.EnumerableUtils.forEach,s=Ember.EnumerableUtils.map;Ember.computed.max=function(e){return Ember.reduceComputed.call(null,e,{initialValue:-1/0,addedItem:function(e,t){return Math.max(e,t)},removedItem:function(e,t){return e>t?e:void 0}})},Ember.computed.min=function(e){return Ember.reduceComputed.call(null,e,{initialValue:1/0,addedItem:function(e,t){return Math.min(e,t)},removedItem:function(e,t){return t>e?e:void 0}})},Ember.computed.map=function(e,t){var r={addedItem:function(e,r,n){var i=t(r);return e.insertAt(n.index,i),e},removedItem:function(e,t,r){return e.removeAt(r.index,1),e}};return Ember.arrayComputed(e,r)},Ember.computed.mapBy=function(e,r){var n=function(e){return t(e,r)};return Ember.computed.map(e+".@each."+r,n)},Ember.computed.mapProperty=Ember.computed.mapBy,Ember.computed.filter=function(e,t){var r={initialize:function(e,t,r){r.filteredArrayIndexes=new Ember.SubArray},addedItem:function(e,r,n,i){var o=!!t(r),s=i.filteredArrayIndexes.addItem(n.index,o);return o&&e.insertAt(s,r),e},removedItem:function(e,t,r,n){var i=n.filteredArrayIndexes.removeItem(r.index);return i>-1&&e.removeAt(i),e}};return Ember.arrayComputed(e,r)},Ember.computed.filterBy=function(e,r,n){var i;return i=2===arguments.length?function(e){return t(e,r)}:function(e){return t(e,r)===n},Ember.computed.filter(e+".@each."+r,i)},Ember.computed.filterProperty=Ember.computed.filterBy,Ember.computed.uniq=function(){var e=i.call(arguments);return e.push({initialize:function(e,t,r){r.itemCounts={}},addedItem:function(e,t,n,i){var o=r(t);return i.itemCounts[o]?++i.itemCounts[o]:i.itemCounts[o]=1,e.addObject(t),e},removedItem:function(e,t,n,i){var o=r(t),s=i.itemCounts;return 0===--s[o]&&e.removeObject(t),e}}),Ember.arrayComputed.apply(null,e)},Ember.computed.union=Ember.computed.uniq,Ember.computed.intersect=function(){var e=function(e){return s(e.property._dependentKeys,function(e){return r(e)})},t=i.call(arguments);return t.push({initialize:function(e,t,r){r.itemCounts={}},addedItem:function(t,n,i,o){var s=r(n),a=(e(i),r(i.arrayChanged)),u=i.property._dependentKeys.length,c=o.itemCounts;return c[s]||(c[s]={}),void 0===c[s][a]&&(c[s][a]=0),1===++c[s][a]&&u===Ember.keys(c[s]).length&&t.addObject(n),t},removedItem:function(t,n,i,o){var s,a=r(n),u=(e(i),r(i.arrayChanged)),c=(i.property._dependentKeys.length,o.itemCounts);return void 0===c[a][u]&&(c[a][u]=0),0===--c[a][u]&&(delete c[a][u],s=Ember.keys(c[a]).length,0===s&&delete c[a],t.removeObject(n)),t}}),Ember.arrayComputed.apply(null,t)},Ember.computed.setDiff=function(e,r){if(2!==arguments.length)throw new Error("setDiff requires exactly two dependent arrays.");return Ember.arrayComputed.call(null,e,r,{addedItem:function(n,i,o){var s=t(this,e),a=t(this,r);return o.arrayChanged===s?a.contains(i)||n.addObject(i):n.removeObject(i),n},removedItem:function(n,i,o){var s=t(this,e),a=t(this,r);return o.arrayChanged===a?s.contains(i)&&n.addObject(i):n.removeObject(i),n}})},Ember.computed.sort=function(r,i){var s,a;return"function"==typeof i?s=function(t,r,n){n.order=i,n.binarySearch=e}:(a=i,s=function(n,i,s){function u(){var e,n,u,l=t(this,a),h=s.sortProperties=[],m=s.sortPropertyAscending={};i.property.clearItemPropertyKeys(r),o(l,function(t){-1!==(n=t.indexOf(":"))?(e=t.substring(0,n),u="desc"!==t.substring(n+1).toLowerCase()):(e=t,u=!0),h.push(e),m[e]=u,i.property.itemPropertyKey(r,e)}),l.addObserver("@each",this,c)}function c(){Ember.run.once(this,l,i.propertyName)}function l(e){u.call(this),i.property.recomputeOnce.call(this,e)}Ember.addObserver(this,a,c),u.call(this),s.order=function(e,r){for(var n,i,o,s=0;s<this.sortProperties.length;++s)if(n=this.sortProperties[s],i=Ember.compare(t(e,n),t(r,n)),0!==i)return o=this.sortPropertyAscending[n],o?i:-1*i;return 0},s.binarySearch=e}),Ember.arrayComputed.call(null,r,{initialize:s,addedItem:function(e,t,r,n){var i=n.binarySearch(e,t);return e.insertAt(i,t),e},removedItem:function(e,t,r,i){var o,s,a;return r.previousValues?(o=n({content:t},r.previousValues),a=Ember.ObjectProxy.create(o)):a=t,s=i.binarySearch(e,a),e.removeAt(s),e}})}}(),function(){Ember.RSVP=t("rsvp")}(),function(){var e=/[ _]/g,t={},r=/([a-z])([A-Z])/g,n=/(\-|_|\.|\s)+(.)?/g,i=/([a-z\d])([A-Z]+)/g,o=/\-|\s+/g;Ember.STRINGS={},Ember.String={fmt:function(e,t){var r=0;return e.replace(/%@([0-9]+)?/g,function(e,n){return n=n?parseInt(n,10)-1:r++,e=t[n],null===e?"(null)":void 0===e?"":Ember.inspect(e)})},loc:function(e,t){return e=Ember.STRINGS[e]||e,Ember.String.fmt(e,t)},w:function(e){return e.split(/\s+/)},decamelize:function(e){return e.replace(r,"$1_$2").toLowerCase()},dasherize:function(r){var n,i=t,o=i.hasOwnProperty(r);return o?i[r]:(n=Ember.String.decamelize(r).replace(e,"-"),i[r]=n,n)},camelize:function(e){return e.replace(n,function(e,t,r){return r?r.toUpperCase():""}).replace(/^([A-Z])/,function(e){return e.toLowerCase()})},classify:function(e){for(var t=e.split("."),r=[],n=0,i=t.length;i>n;n++){var o=Ember.String.camelize(t[n]);r.push(o.charAt(0).toUpperCase()+o.substr(1))}return r.join(".")},underscore:function(e){return e.replace(i,"$1_$2").replace(o,"_").toLowerCase()},capitalize:function(e){return e.charAt(0).toUpperCase()+e.substr(1)}}}(),function(){var e=Ember.String.fmt,t=Ember.String.w,r=Ember.String.loc,n=Ember.String.camelize,i=Ember.String.decamelize,o=Ember.String.dasherize,s=Ember.String.underscore,a=Ember.String.capitalize,u=Ember.String.classify;(Ember.EXTEND_PROTOTYPES===!0||Ember.EXTEND_PROTOTYPES.String)&&(String.prototype.fmt=function(){return e(this,arguments)},String.prototype.w=function(){return t(this)},String.prototype.loc=function(){return r(this,arguments)},String.prototype.camelize=function(){return n(this)},String.prototype.decamelize=function(){return i(this)},String.prototype.dasherize=function(){return o(this)},String.prototype.underscore=function(){return s(this)},String.prototype.classify=function(){return u(this)},String.prototype.capitalize=function(){return a(this)})}(),function(){var e=Array.prototype.slice;(Ember.EXTEND_PROTOTYPES===!0||Ember.EXTEND_PROTOTYPES.Function)&&(Function.prototype.property=function(){var e=Ember.computed(this);return e.property.apply(e,arguments)},Function.prototype.observes=function(){return this.__ember_observes__=e.call(arguments),this},Function.prototype.observesImmediately=function(){for(var e=0,t=arguments.length;t>e;e++)arguments[e];return this.observes.apply(this,arguments)},Function.prototype.observesBefore=function(){return this.__ember_observesBefore__=e.call(arguments),this},Function.prototype.on=function(){var t=e.call(arguments);return this.__ember_listens__=t,this})}(),function(){Ember.Comparable=Ember.Mixin.create({compare:Ember.required(Function)})}(),function(){var e=Ember.get;Ember.set,Ember.Copyable=Ember.Mixin.create({copy:Ember.required(Function),frozenCopy:function(){if(Ember.Freezable&&Ember.Freezable.detect(this))return e(this,"isFrozen")?this:this.copy().freeze();throw new Error(Ember.String.fmt("%@ does not support freezing",[this]))}})}(),function(){var e=Ember.get,t=Ember.set;Ember.Freezable=Ember.Mixin.create({isFrozen:!1,freeze:function(){return e(this,"isFrozen")?this:(t(this,"isFrozen",!0),this)}}),Ember.FROZEN_ERROR="Frozen object cannot be modified."}(),function(){var e=Ember.EnumerableUtils.forEach;Ember.MutableEnumerable=Ember.Mixin.create(Ember.Enumerable,{addObject:Ember.required(Function),addObjects:function(t){return Ember.beginPropertyChanges(this),e(t,function(e){this.addObject(e)},this),Ember.endPropertyChanges(this),this},removeObject:Ember.required(Function),removeObjects:function(t){return Ember.beginPropertyChanges(this),e(t,function(e){this.removeObject(e)},this),Ember.endPropertyChanges(this),this}})}(),function(){var e="Index out of range",t=[],r=Ember.get;Ember.set,Ember.MutableArray=Ember.Mixin.create(Ember.Array,Ember.MutableEnumerable,{replace:Ember.required(),clear:function(){var e=r(this,"length");return 0===e?this:(this.replace(0,e,t),this)},insertAt:function(t,n){if(t>r(this,"length"))throw new Error(e);return this.replace(t,0,[n]),this},removeAt:function(n,i){if("number"==typeof n){if(0>n||n>=r(this,"length"))throw new Error(e);void 0===i&&(i=1),this.replace(n,i,t)}return this},pushObject:function(e){return this.insertAt(r(this,"length"),e),e},pushObjects:function(e){if(!Ember.Enumerable.detect(e)&&!Ember.isArray(e))throw new TypeError("Must pass Ember.Enumerable to Ember.MutableArray#pushObjects");return this.replace(r(this,"length"),0,e),this},popObject:function(){var e=r(this,"length");if(0===e)return null;var t=this.objectAt(e-1);return this.removeAt(e-1,1),t},shiftObject:function(){if(0===r(this,"length"))return null;var e=this.objectAt(0);return this.removeAt(0),e},unshiftObject:function(e){return this.insertAt(0,e),e},unshiftObjects:function(e){return this.replace(0,0,e),this},reverseObjects:function(){var e=r(this,"length");if(0===e)return this;var t=this.toArray().reverse();return this.replace(0,e,t),this},setObjects:function(e){if(0===e.length)return this.clear();var t=r(this,"length");return this.replace(0,t,e),this},removeObject:function(e){for(var t=r(this,"length")||0;--t>=0;){var n=this.objectAt(t);n===e&&this.removeAt(t)}return this},addObject:function(e){return this.contains(e)||this.pushObject(e),this}})}(),function(){var e=Ember.get,t=Ember.set,r=Array.prototype.slice,n=Ember.getProperties;Ember.Observable=Ember.Mixin.create({get:function(t){return e(this,t)},getProperties:function(){return n.apply(null,[this].concat(r.call(arguments)))},set:function(e,r){return t(this,e,r),this},setProperties:function(e){return Ember.setProperties(this,e)},beginPropertyChanges:function(){return Ember.beginPropertyChanges(),this},endPropertyChanges:function(){return Ember.endPropertyChanges(),this},propertyWillChange:function(e){return Ember.propertyWillChange(this,e),this},propertyDidChange:function(e){return Ember.propertyDidChange(this,e),this},notifyPropertyChange:function(e){return this.propertyWillChange(e),this.propertyDidChange(e),this},addBeforeObserver:function(e,t,r){Ember.addBeforeObserver(this,e,t,r)},addObserver:function(e,t,r){Ember.addObserver(this,e,t,r)},removeObserver:function(e,t,r){Ember.removeObserver(this,e,t,r)},hasObserverFor:function(e){return Ember.hasListeners(this,e+":change")},getPath:function(e){return this.get(e)},setPath:function(e,t){return this.set(e,t)},getWithDefault:function(e,t){return Ember.getWithDefault(this,e,t)},incrementProperty:function(r,n){return Ember.isNone(n)&&(n=1),t(this,r,(e(this,r)||0)+n),e(this,r)},decrementProperty:function(r,n){return Ember.isNone(n)&&(n=1),t(this,r,(e(this,r)||0)-n),e(this,r)},toggleProperty:function(r){return t(this,r,!e(this,r)),e(this,r)},cacheFor:function(e){return Ember.cacheFor(this,e)},observersForKey:function(e){return Ember.observersFor(this,e)}})}(),function(){var e=Ember.get;Ember.set,Ember.TargetActionSupport=Ember.Mixin.create({target:null,action:null,actionContext:null,targetObject:Ember.computed(function(){var t=e(this,"target");if("string"===Ember.typeOf(t)){var r=e(this,t);return void 0===r&&(r=e(Ember.lookup,t)),r}return t}).property("target"),actionContextObject:Ember.computed(function(){var t=e(this,"actionContext");if("string"===Ember.typeOf(t)){var r=e(this,t);return void 0===r&&(r=e(Ember.lookup,t)),r}return t}).property("actionContext"),triggerAction:function(t){t=t||{};var r=t.action||e(this,"action"),n=t.target||e(this,"targetObject"),i=t.actionContext||e(this,"actionContextObject")||this;if(n&&r){var o;return o=n.send?n.send.apply(n,[r,i]):n[r].apply(n,[i]),o!==!1&&(o=!0),o}return!1}})}(),function(){Ember.Evented=Ember.Mixin.create({on:function(e,t,r){return Ember.addListener(this,e,t,r),this},one:function(e,t,r){return r||(r=t,t=null),Ember.addListener(this,e,t,r,!0),this},trigger:function(e){var t,r,n=[];for(t=1,r=arguments.length;r>t;t++)n.push(arguments[t]);Ember.sendEvent(this,e,n)},off:function(e,t,r){return Ember.removeListener(this,e,t,r),this},has:function(e){return Ember.hasListeners(this,e)}})}(),function(){var e=t("rsvp");e.configure("async",function(e,t){Ember.run.schedule("actions",t,e,t)});var r=Ember.get;Ember.DeferredMixin=Ember.Mixin.create({then:function(e,t){function n(t){return t===o?e(s):e(t)}var i,o,s;return s=this,i=r(this,"_deferred"),o=i.promise,o.then(e&&n,t)},resolve:function(e){var t,n;t=r(this,"_deferred"),n=t.promise,e===this?t.resolve(n):t.resolve(e)},reject:function(e){r(this,"_deferred").reject(e)},_deferred:Ember.computed(function(){return e.defer()})})}(),function(){var e=Ember.get;Ember.ActionHandler=Ember.Mixin.create({mergedProperties:["_actions"],willMergeMixin:function(e){e.actions&&!e._actions&&(e._actions=Ember.merge(e._actions||{},e.actions),delete e.actions)},send:function(t){var r,n=[].slice.call(arguments,1);if(this._actions&&this._actions[t]){if(this._actions[t].apply(this,n)!==!0)return}else if(this.deprecatedSend&&this.deprecatedSendHandles&&this.deprecatedSendHandles(t)&&this.deprecatedSend.apply(this,[].slice.call(arguments))!==!0)return;(r=e(this,"target"))&&r.send.apply(r,arguments)}})}(),function(){function e(e,r){r.then(function(r){return t(e,"isFulfilled",!0),t(e,"content",r),r},function(r){t(e,"isRejected",!0),t(e,"reason",r)}).fail(i)}var t=Ember.set,r=Ember.get,n=Ember.RSVP.resolve,i=Ember.RSVP.rethrow,o=Ember.computed.not,s=Ember.computed.or;Ember.PromiseProxyMixin=Ember.Mixin.create({reason:null,isPending:o("isSettled").readOnly(),isSettled:s("isRejected","isFulfilled").readOnly(),isRejected:!1,isFulfilled:!1,promise:Ember.computed(function(t,r){if(2===arguments.length)return r=n(r),e(this,r),r;throw new Error("PromiseProxy's promise must be set")}),then:function(e,t){return r(this,"promise").then(e,t)}})}(),function(){function e(e,t,r){this.operation=e,this.count=t,this.items=r}function t(e,t,r,n){this.operation=e,this.index=t,this.split=r,this.rangeStart=n}var r=Ember.get,n=Ember.EnumerableUtils.forEach,i="r",o="i",s="d";Ember.TrackedArray=function(t){arguments.length<1&&(t=[]);var n=r(t,"length");this._content=n?[new e(i,n,t)]:[]},Ember.TrackedArray.RETAIN=i,Ember.TrackedArray.INSERT=o,Ember.TrackedArray.DELETE=s,Ember.TrackedArray.prototype={addItems:function(t,n){var i,s,a=r(n,"length"),u=this._findArrayOperation(t),c=u.operation,l=u.index,h=u.rangeStart;s=new e(o,a,n),c?u.split?(this._split(l,t-h,s),i=l+1):(this._content.splice(l,0,s),i=l):(this._content.push(s),i=l),this._composeInsert(i)},removeItems:function(t,r){var n,i,o=this._findArrayOperation(t),a=(o.operation,o.index),u=o.rangeStart;return n=new e(s,r),o.split?(this._split(a,t-u,n),i=a+1):(this._content.splice(a,0,n),i=a),this._composeDelete(i)},apply:function(t){var r=[],o=0;n(this._content,function(e){t(e.items,o,e.operation),e.operation!==s&&(o+=e.count,r=r.concat(e.items))}),this._content=[new e(i,r.length,r)]},_findArrayOperation:function(e){var r,n,i,o,a,u=!1;for(r=o=0,n=this._content.length;n>r;++r)if(i=this._content[r],i.operation!==s){if(a=o+i.count-1,e===o)break;if(e>o&&a>=e){u=!0;break}o=a+1}return new t(i,r,u,o)},_split:function(t,r,n){var i=this._content[t],o=i.items.slice(r),s=new e(i.operation,o.length,o);i.count=r,i.items=i.items.slice(0,r),this._content.splice(t+1,0,n,s)},_composeInsert:function(e){var t=this._content[e],r=this._content[e-1],n=this._content[e+1],i=r&&r.operation,s=n&&n.operation;i===o?(r.count+=t.count,r.items=r.items.concat(t.items),s===o?(r.count+=n.count,r.items=r.items.concat(n.items),this._content.splice(e,2)):this._content.splice(e,1)):s===o&&(t.count+=n.count,t.items=t.items.concat(n.items),this._content.splice(e+1,1))},_composeDelete:function(e){var t,r,n,i=this._content[e],a=i.count,u=this._content[e-1],c=u&&u.operation,l=[];c===s&&(i=u,e-=1);for(var h=e+1;a>0;++h)t=this._content[h],r=t.operation,n=t.count,r!==s?(n>a?(l=l.concat(t.items.splice(0,a)),t.count-=a,h-=1,n=a,a=0):(l=l.concat(t.items),a-=n),r===o&&(i.count-=n)):i.count+=n;return i.count>0?this._content.splice(e+1,h-1-e):this._content.splice(e,1),l}}}(),function(){function e(e,t){this.type=e,this.count=t}var t=(Ember.get,Ember.EnumerableUtils.forEach,"r"),r="f";Ember.SubArray=function(r){arguments.length<1&&(r=0),this._operations=r>0?[new e(t,r)]:[]},Ember.SubArray.prototype={addItem:function(n,i){var o=-1,s=i?t:r,a=this;return this._findOperation(n,function(r,u,c,l,h){var m,f;s===r.type?++r.count:n===c?a._operations.splice(u,0,new e(s,1)):(m=new e(s,1),f=new e(r.type,l-n+1),r.count=n-c,a._operations.splice(u+1,0,m,f)),i&&(o=r.type===t?h+(n-c):h),a._composeAt(u)},function(t){a._operations.push(new e(s,1)),i&&(o=t),a._composeAt(a._operations.length-1)}),o},removeItem:function(e){var r=-1,n=this;return this._findOperation(e,function(i,o,s,a,u){i.type===t&&(r=u+(e-s)),i.count>1?--i.count:(n._operations.splice(o,1),n._composeAt(o))}),r},_findOperation:function(e,r,n){var i,o,s,a,u,c=0;for(i=a=0,o=this._operations.length;o>i;a=u+1,++i){if(s=this._operations[i],u=a+s.count-1,e>=a&&u>=e)return r(s,i,a,u,c),void 0;s.type===t&&(c+=s.count)}n(c)},_composeAt:function(e){var t,r=this._operations[e];r&&(e>0&&(t=this._operations[e-1],t.type===r.type&&(r.count+=t.count,this._operations.splice(e-1,1))),e<this._operations.length-1&&(t=this._operations[e+1],t.type===r.type&&(r.count+=t.count,this._operations.splice(e+1,1))))}}}(),function(){Ember.Container=t("container"),Ember.Container.set=Ember.set}(),function(){function e(){var e,t,o=!1,s=function(){o||s.proto(),n(this,i,g),n(this,"_super",g);var u=a(this),h=u.proto;if(u.proto=this,e){var m=e;e=null,this.reopen.apply(this,m)}if(t){var f=t;t=null;for(var p=this.concatenatedProperties,b=0,y=f.length;y>b;b++){var w=f[b];for(var _ in w)if(w.hasOwnProperty(_)){var C=w[_],O=Ember.IS_BINDING;if(O.test(_)){var A=u.bindings;A?u.hasOwnProperty("bindings")||(A=u.bindings=r(u.bindings)):A=u.bindings={},A[_]=C}var P=u.descs[_];if(p&&E(p,_)>=0){var V=this[_];C=V?"function"==typeof V.concat?V.concat(C):Ember.makeArray(V).concat(C):Ember.makeArray(C)}P?P.set(this,_,C):"function"!=typeof this.setUnknownProperty||_ in this?v?Ember.defineProperty(this,_,null,C):this[_]=C:this.setUnknownProperty(_,C)}}}d(this,u),this.init.apply(this,arguments),u.proto=h,c(this),l(this,"init")};return s.toString=f.prototype.toString,s.willReopen=function(){o&&(s.PrototypeMixin=f.create(s.PrototypeMixin)),o=!1},s._initMixins=function(t){e=t},s._initProperties=function(e){t=e},s.proto=function(){var e=s.superclass;return e&&e.proto(),o||(o=!0,s.PrototypeMixin.applyPartial(s.prototype),u(s.prototype)),this.prototype},s}function t(e){return function(){return e}}var r=(Ember.set,Ember.get,Ember.create),n=Ember.platform.defineProperty,i=Ember.GUID_KEY,o=Ember.guidFor,s=Ember.generateGuid,a=Ember.meta,u=Ember.rewatch,c=Ember.finishChains,l=Ember.sendEvent,h=Ember.destroy,m=Ember.run.schedule,f=Ember.Mixin,p=f._apply,d=f.finishPartial,b=f.prototype.reopen,v=Ember.ENV.MANDATORY_SETTER,E=Ember.EnumerableUtils.indexOf,g={configurable:!0,writable:!0,enumerable:!1,value:void 0},y=e();y.toString=function(){return"Ember.CoreObject"},y.PrototypeMixin=f.create({reopen:function(){return p(this,arguments,!0),this},init:function(){},concatenatedProperties:null,isDestroyed:!1,isDestroying:!1,destroy:function(){return this.isDestroying?void 0:(this.isDestroying=!0,m("actions",this,this.willDestroy),m("destroy",this,this._scheduledDestroy),this)},willDestroy:Ember.K,_scheduledDestroy:function(){this.isDestroyed||(h(this),this.isDestroyed=!0)},bind:function(e,t){return t instanceof Ember.Binding||(t=Ember.Binding.from(t)),t.to(e).connect(this),t},toString:function(){var e="function"==typeof this.toStringExtension,r=e?":"+this.toStringExtension():"",n="<"+this.constructor.toString()+":"+o(this)+r+">";return this.toString=t(n),n}}),y.PrototypeMixin.ownerConstructor=y,Ember.config.overridePrototypeMixin&&Ember.config.overridePrototypeMixin(y.PrototypeMixin),y.__super__=null;var w=f.create({ClassMixin:Ember.required(),PrototypeMixin:Ember.required(),isClass:!0,isMethod:!1,extend:function(){var t,n=e();return n.ClassMixin=f.create(this.ClassMixin),n.PrototypeMixin=f.create(this.PrototypeMixin),n.ClassMixin.ownerConstructor=n,n.PrototypeMixin.ownerConstructor=n,b.apply(n.PrototypeMixin,arguments),n.superclass=this,n.__super__=this.prototype,t=n.prototype=r(this.prototype),t.constructor=n,s(t,"ember"),a(t).proto=t,n.ClassMixin.apply(n),n},createWithMixins:function(){var e=this;return arguments.length>0&&this._initMixins(arguments),new e},create:function(){var e=this;return arguments.length>0&&this._initProperties(arguments),new e},reopen:function(){return this.willReopen(),b.apply(this.PrototypeMixin,arguments),this
},reopenClass:function(){return b.apply(this.ClassMixin,arguments),p(this,arguments,!1),this},detect:function(e){if("function"!=typeof e)return!1;for(;e;){if(e===this)return!0;e=e.superclass}return!1},detectInstance:function(e){return e instanceof this},metaForProperty:function(e){var t=a(this.proto(),!1).descs[e];return t._meta||{}},eachComputedProperty:function(e,t){var r,n=this.proto(),i=a(n).descs,o={};for(var s in i)r=i[s],r instanceof Ember.ComputedProperty&&e.call(t||this,s,r._meta||o)}});w.ownerConstructor=y,Ember.config.overrideClassMixin&&Ember.config.overrideClassMixin(w),y.ClassMixin=w,w.apply(y),Ember.CoreObject=y}(),function(){Ember.Object=Ember.CoreObject.extend(Ember.Observable),Ember.Object.toString=function(){return"Ember.Object"}}(),function(){function e(t,r,i){var s=t.length;c[t.join(".")]=r;for(var a in r)if(l.call(r,a)){var u=r[a];if(t[s]=a,u&&u.toString===n)u.toString=o(t.join(".")),u[m]=t.join(".");else if(u&&u.isNamespace){if(i[h(u)])continue;i[h(u)]=!0,e(t,u,i)}}t.length=s}function t(){var e,t,r=Ember.Namespace,n=Ember.lookup;if(!r.PROCESSED)for(var i in n)if("parent"!==i&&"top"!==i&&"frameElement"!==i&&"webkitStorageInfo"!==i&&!("globalStorage"===i&&n.StorageList&&n.globalStorage instanceof n.StorageList||n.hasOwnProperty&&!n.hasOwnProperty(i))){try{e=Ember.lookup[i],t=e&&e.isNamespace}catch(o){continue}t&&(e[m]=i)}}function r(e){var t=e.superclass;return t?t[m]?t[m]:r(t):void 0}function n(){Ember.BOOTED||this[m]||i();var e;if(this[m])e=this[m];else if(this._toString)e=this._toString;else{var t=r(this);e=t?"(subclass of "+t+")":"(unknown mixin)",this.toString=o(e)}return e}function i(){var r=!u.PROCESSED,n=Ember.anyUnprocessedMixins;if(r&&(t(),u.PROCESSED=!0),r||n){for(var i,o=u.NAMESPACES,s=0,a=o.length;a>s;s++)i=o[s],e([i.toString()],i,{});Ember.anyUnprocessedMixins=!1}}function o(e){return function(){return e}}var s=Ember.get,a=Ember.ArrayPolyfills.indexOf,u=Ember.Namespace=Ember.Object.extend({isNamespace:!0,init:function(){Ember.Namespace.NAMESPACES.push(this),Ember.Namespace.PROCESSED=!1},toString:function(){var e=s(this,"name");return e?e:(t(),this[Ember.GUID_KEY+"_name"])},nameClasses:function(){e([this.toString()],this,{})},destroy:function(){var e=Ember.Namespace.NAMESPACES;Ember.lookup[this.toString()]=void 0,e.splice(a.call(e,this),1),this._super()}});u.reopenClass({NAMESPACES:[Ember],NAMESPACES_BY_ID:{},PROCESSED:!1,processAll:i,byName:function(e){return Ember.BOOTED||i(),c[e]}});var c=u.NAMESPACES_BY_ID,l={}.hasOwnProperty,h=Ember.guidFor,m=Ember.NAME_KEY=Ember.GUID_KEY+"_name";Ember.Mixin.prototype.toString=n}(),function(){Ember.Application=Ember.Namespace.extend()}(),function(){var e="Index out of range",t=[],r=Ember.get;Ember.set,Ember.ArrayProxy=Ember.Object.extend(Ember.MutableArray,{content:null,arrangedContent:Ember.computed.alias("content"),objectAtContent:function(e){return r(this,"arrangedContent").objectAt(e)},replaceContent:function(e,t,n){r(this,"content").replace(e,t,n)},_contentWillChange:Ember.beforeObserver(function(){this._teardownContent()},"content"),_teardownContent:function(){var e=r(this,"content");e&&e.removeArrayObserver(this,{willChange:"contentArrayWillChange",didChange:"contentArrayDidChange"})},contentArrayWillChange:Ember.K,contentArrayDidChange:Ember.K,_contentDidChange:Ember.observer(function(){r(this,"content"),this._setupContent()},"content"),_setupContent:function(){var e=r(this,"content");e&&e.addArrayObserver(this,{willChange:"contentArrayWillChange",didChange:"contentArrayDidChange"})},_arrangedContentWillChange:Ember.beforeObserver(function(){var e=r(this,"arrangedContent"),t=e?r(e,"length"):0;this.arrangedContentArrayWillChange(this,0,t,void 0),this.arrangedContentWillChange(this),this._teardownArrangedContent(e)},"arrangedContent"),_arrangedContentDidChange:Ember.observer(function(){var e=r(this,"arrangedContent"),t=e?r(e,"length"):0;this._setupArrangedContent(),this.arrangedContentDidChange(this),this.arrangedContentArrayDidChange(this,0,void 0,t)},"arrangedContent"),_setupArrangedContent:function(){var e=r(this,"arrangedContent");e&&e.addArrayObserver(this,{willChange:"arrangedContentArrayWillChange",didChange:"arrangedContentArrayDidChange"})},_teardownArrangedContent:function(){var e=r(this,"arrangedContent");e&&e.removeArrayObserver(this,{willChange:"arrangedContentArrayWillChange",didChange:"arrangedContentArrayDidChange"})},arrangedContentWillChange:Ember.K,arrangedContentDidChange:Ember.K,objectAt:function(e){return r(this,"content")&&this.objectAtContent(e)},length:Ember.computed(function(){var e=r(this,"arrangedContent");return e?r(e,"length"):0}),_replace:function(e,t,n){var i=r(this,"content");return i&&this.replaceContent(e,t,n),this},replace:function(){if(r(this,"arrangedContent")!==r(this,"content"))throw new Ember.Error("Using replace on an arranged ArrayProxy is not allowed.");this._replace.apply(this,arguments)},_insertAt:function(t,n){if(t>r(this,"content.length"))throw new Error(e);return this._replace(t,0,[n]),this},insertAt:function(e,t){if(r(this,"arrangedContent")===r(this,"content"))return this._insertAt(e,t);throw new Ember.Error("Using insertAt on an arranged ArrayProxy is not allowed.")},removeAt:function(n,i){if("number"==typeof n){var o,s=r(this,"content"),a=r(this,"arrangedContent"),u=[];if(0>n||n>=r(this,"length"))throw new Error(e);for(void 0===i&&(i=1),o=n;n+i>o;o++)u.push(s.indexOf(a.objectAt(o)));for(u.sort(function(e,t){return t-e}),Ember.beginPropertyChanges(),o=0;o<u.length;o++)this._replace(u[o],1,t);Ember.endPropertyChanges()}return this},pushObject:function(e){return this._insertAt(r(this,"content.length"),e),e},pushObjects:function(e){if(!Ember.Enumerable.detect(e)&&!Ember.isArray(e))throw new TypeError("Must pass Ember.Enumerable to Ember.MutableArray#pushObjects");return this._replace(r(this,"length"),0,e),this},setObjects:function(e){if(0===e.length)return this.clear();var t=r(this,"length");return this._replace(0,t,e),this},unshiftObject:function(e){return this._insertAt(0,e),e},unshiftObjects:function(e){return this._replace(0,0,e),this},slice:function(){var e=this.toArray();return e.slice.apply(e,arguments)},arrangedContentArrayWillChange:function(e,t,r,n){this.arrayContentWillChange(t,r,n)},arrangedContentArrayDidChange:function(e,t,r,n){this.arrayContentDidChange(t,r,n)},init:function(){this._super(),this._setupContent(),this._setupArrangedContent()},willDestroy:function(){this._teardownArrangedContent(),this._teardownContent()}})}(),function(){function e(e,t){var r=t.slice(8);r in this||u(this,r)}function t(e,t){var r=t.slice(8);r in this||c(this,r)}var r=Ember.get,n=Ember.set,i=(Ember.String.fmt,Ember.addBeforeObserver),o=Ember.addObserver,s=Ember.removeBeforeObserver,a=Ember.removeObserver,u=Ember.propertyWillChange,c=Ember.propertyDidChange,l=Ember.meta,h=Ember.defineProperty;Ember.ObjectProxy=Ember.Object.extend({content:null,_contentDidChange:Ember.observer(function(){},"content"),isTruthy:Ember.computed.bool("content"),_debugContainerKey:null,willWatchProperty:function(r){var n="content."+r;i(this,n,null,e),o(this,n,null,t)},didUnwatchProperty:function(r){var n="content."+r;s(this,n,null,e),a(this,n,null,t)},unknownProperty:function(e){var t=r(this,"content");return t?r(t,e):void 0},setUnknownProperty:function(e,t){var i=l(this);if(i.proto===this)return h(this,e,null,t),t;var o=r(this,"content");return n(o,e,t)}})}(),function(){function e(e,t,r,i,o){var s,a=r._objects;for(a||(a=r._objects={});--o>=i;){var u=e.objectAt(o);u&&(Ember.addBeforeObserver(u,t,r,"contentKeyWillChange"),Ember.addObserver(u,t,r,"contentKeyDidChange"),s=n(u),a[s]||(a[s]=[]),a[s].push(o))}}function t(e,t,r,i,s){var a=r._objects;a||(a=r._objects={});for(var u,c;--s>=i;){var l=e.objectAt(s);l&&(Ember.removeBeforeObserver(l,t,r,"contentKeyWillChange"),Ember.removeObserver(l,t,r,"contentKeyDidChange"),c=n(l),u=a[c],u[o.call(u,s)]=null)}}var r=(Ember.set,Ember.get),n=Ember.guidFor,i=Ember.EnumerableUtils.forEach,o=Ember.ArrayPolyfills.indexOf,s=Ember.Object.extend(Ember.Array,{init:function(e,t,r){this._super(),this._keyName=t,this._owner=r,this._content=e},objectAt:function(e){var t=this._content.objectAt(e);return t&&r(t,this._keyName)},length:Ember.computed(function(){var e=this._content;return e?r(e,"length"):0})}),a=/^.+:(before|change)$/;Ember.EachProxy=Ember.Object.extend({init:function(e){this._super(),this._content=e,e.addArrayObserver(this),i(Ember.watchedEvents(this),function(e){this.didAddListener(e)},this)},unknownProperty:function(e){var t;return t=new s(this._content,e,this),Ember.defineProperty(this,e,null,t),this.beginObservingContentKey(e),t},arrayWillChange:function(e,r,n){var i,o,s=this._keys;o=n>0?r+n:-1,Ember.beginPropertyChanges(this);for(i in s)s.hasOwnProperty(i)&&(o>0&&t(e,i,this,r,o),Ember.propertyWillChange(this,i));Ember.propertyWillChange(this._content,"@each"),Ember.endPropertyChanges(this)},arrayDidChange:function(t,r,n,i){var o,s=this._keys;o=i>0?r+i:-1,Ember.changeProperties(function(){for(var n in s)s.hasOwnProperty(n)&&(o>0&&e(t,n,this,r,o),Ember.propertyDidChange(this,n));Ember.propertyDidChange(this._content,"@each")},this)},didAddListener:function(e){a.test(e)&&this.beginObservingContentKey(e.slice(0,-7))},didRemoveListener:function(e){a.test(e)&&this.stopObservingContentKey(e.slice(0,-7))},beginObservingContentKey:function(t){var n=this._keys;if(n||(n=this._keys={}),n[t])n[t]++;else{n[t]=1;var i=this._content,o=r(i,"length");e(i,t,this,0,o)}},stopObservingContentKey:function(e){var n=this._keys;if(n&&n[e]>0&&--n[e]<=0){var i=this._content,o=r(i,"length");t(i,e,this,0,o)}},contentKeyWillChange:function(e,t){Ember.propertyWillChange(this,t)},contentKeyDidChange:function(e,t){Ember.propertyDidChange(this,t)}})}(),function(){var e=Ember.get,t=(Ember.set,Ember.EnumerableUtils._replace),r=Ember.Mixin.create(Ember.MutableArray,Ember.Observable,Ember.Copyable,{get:function(e){return"length"===e?this.length:"number"==typeof e?this[e]:this._super(e)},objectAt:function(e){return this[e]},replace:function(r,n,i){if(this.isFrozen)throw Ember.FROZEN_ERROR;var o=i?e(i,"length"):0;return this.arrayContentWillChange(r,n,o),i&&0!==i.length?t(this,r,n,i):this.splice(r,n),this.arrayContentDidChange(r,n,o),this},unknownProperty:function(e,t){var r;return void 0!==t&&void 0===r&&(r=this[e]=t),r},indexOf:function(e,t){var r,n=this.length;for(t=void 0===t?0:0>t?Math.ceil(t):Math.floor(t),0>t&&(t+=n),r=t;n>r;r++)if(this[r]===e)return r;return-1},lastIndexOf:function(e,t){var r,n=this.length;for(t=void 0===t?n-1:0>t?Math.ceil(t):Math.floor(t),0>t&&(t+=n),r=t;r>=0;r--)if(this[r]===e)return r;return-1},copy:function(e){return e?this.map(function(e){return Ember.copy(e,!0)}):this.slice()}}),n=["length"];Ember.EnumerableUtils.forEach(r.keys(),function(e){Array.prototype[e]&&n.push(e)}),n.length>0&&(r=r.without.apply(r,n)),Ember.NativeArray=r,Ember.A=function(e){return void 0===e&&(e=[]),Ember.Array.detect(e)?e:Ember.NativeArray.apply(e)},Ember.NativeArray.activate=function(){r.apply(Array.prototype),Ember.A=function(e){return e||[]}},(Ember.EXTEND_PROTOTYPES===!0||Ember.EXTEND_PROTOTYPES.Array)&&Ember.NativeArray.activate()}(),function(){var e=Ember.get,t=Ember.set,r=Ember.guidFor,n=Ember.isNone,i=Ember.String.fmt;Ember.Set=Ember.CoreObject.extend(Ember.MutableEnumerable,Ember.Copyable,Ember.Freezable,{length:0,clear:function(){if(this.isFrozen)throw new Error(Ember.FROZEN_ERROR);var n=e(this,"length");if(0===n)return this;var i;this.enumerableContentWillChange(n,0),Ember.propertyWillChange(this,"firstObject"),Ember.propertyWillChange(this,"lastObject");for(var o=0;n>o;o++)i=r(this[o]),delete this[i],delete this[o];return t(this,"length",0),Ember.propertyDidChange(this,"firstObject"),Ember.propertyDidChange(this,"lastObject"),this.enumerableContentDidChange(n,0),this},isEqual:function(t){if(!Ember.Enumerable.detect(t))return!1;var r=e(this,"length");if(e(t,"length")!==r)return!1;for(;--r>=0;)if(!t.contains(this[r]))return!1;return!0},add:Ember.aliasMethod("addObject"),remove:Ember.aliasMethod("removeObject"),pop:function(){if(e(this,"isFrozen"))throw new Error(Ember.FROZEN_ERROR);var t=this.length>0?this[this.length-1]:null;return this.remove(t),t},push:Ember.aliasMethod("addObject"),shift:Ember.aliasMethod("pop"),unshift:Ember.aliasMethod("push"),addEach:Ember.aliasMethod("addObjects"),removeEach:Ember.aliasMethod("removeObjects"),init:function(e){this._super(),e&&this.addObjects(e)},nextObject:function(e){return this[e]},firstObject:Ember.computed(function(){return this.length>0?this[0]:void 0}),lastObject:Ember.computed(function(){return this.length>0?this[this.length-1]:void 0}),addObject:function(i){if(e(this,"isFrozen"))throw new Error(Ember.FROZEN_ERROR);if(n(i))return this;var o,s=r(i),a=this[s],u=e(this,"length");return a>=0&&u>a&&this[a]===i?this:(o=[i],this.enumerableContentWillChange(null,o),Ember.propertyWillChange(this,"lastObject"),u=e(this,"length"),this[s]=u,this[u]=i,t(this,"length",u+1),Ember.propertyDidChange(this,"lastObject"),this.enumerableContentDidChange(null,o),this)},removeObject:function(i){if(e(this,"isFrozen"))throw new Error(Ember.FROZEN_ERROR);if(n(i))return this;var o,s,a=r(i),u=this[a],c=e(this,"length"),l=0===u,h=u===c-1;return u>=0&&c>u&&this[u]===i&&(s=[i],this.enumerableContentWillChange(s,null),l&&Ember.propertyWillChange(this,"firstObject"),h&&Ember.propertyWillChange(this,"lastObject"),c-1>u&&(o=this[c-1],this[u]=o,this[r(o)]=u),delete this[a],delete this[c-1],t(this,"length",c-1),l&&Ember.propertyDidChange(this,"firstObject"),h&&Ember.propertyDidChange(this,"lastObject"),this.enumerableContentDidChange(s,null)),this},contains:function(e){return this[r(e)]>=0},copy:function(){var n=this.constructor,i=new n,o=e(this,"length");for(t(i,"length",o);--o>=0;)i[o]=this[o],i[r(this[o])]=o;return i},toString:function(){var e,t=this.length,r=[];for(e=0;t>e;e++)r[e]=this[e];return i("Ember.Set<%@>",[r.join(",")])}})}(),function(){var e=Ember.DeferredMixin;Ember.get;var t=Ember.Object.extend(e);t.reopenClass({promise:function(e,r){var n=t.create();return e.call(r,n),n}}),Ember.Deferred=t}(),function(){var e=Ember.ArrayPolyfills.forEach,t=Ember.ENV.EMBER_LOAD_HOOKS||{},r={};Ember.onLoad=function(e,n){var i;t[e]=t[e]||Ember.A(),t[e].pushObject(n),(i=r[e])&&n(i)},Ember.runLoadHooks=function(n,i){r[n]=i,t[n]&&e.call(t[n],function(e){e(i)})}}(),function(){Ember.get,Ember.ControllerMixin=Ember.Mixin.create(Ember.ActionHandler,{isController:!0,target:null,container:null,parentController:null,store:null,model:Ember.computed.alias("content"),deprecatedSendHandles:function(e){return!!this[e]},deprecatedSend:function(e){var t=[].slice.call(arguments,1);this[e].apply(this,t)}}),Ember.Controller=Ember.Object.extend(Ember.ControllerMixin)}(),function(){var e=Ember.get,t=(Ember.set,Ember.EnumerableUtils.forEach);Ember.SortableMixin=Ember.Mixin.create(Ember.MutableEnumerable,{sortProperties:null,sortAscending:!0,sortFunction:Ember.compare,orderBy:function(r,n){var i=0,o=e(this,"sortProperties"),s=e(this,"sortAscending"),a=e(this,"sortFunction");return t(o,function(t){0===i&&(i=a(e(r,t),e(n,t)),0===i||s||(i=-1*i))}),i},destroy:function(){var r=e(this,"content"),n=e(this,"sortProperties");return r&&n&&t(r,function(e){t(n,function(t){Ember.removeObserver(e,t,this,"contentItemSortPropertyDidChange")},this)},this),this._super()},isSorted:Ember.computed.bool("sortProperties"),arrangedContent:Ember.computed("content","sortProperties.@each",function(){var r=e(this,"content"),n=e(this,"isSorted"),i=e(this,"sortProperties"),o=this;return r&&n?(r=r.slice(),r.sort(function(e,t){return o.orderBy(e,t)}),t(r,function(e){t(i,function(t){Ember.addObserver(e,t,this,"contentItemSortPropertyDidChange")},this)},this),Ember.A(r)):r}),_contentWillChange:Ember.beforeObserver(function(){var r=e(this,"content"),n=e(this,"sortProperties");r&&n&&t(r,function(e){t(n,function(t){Ember.removeObserver(e,t,this,"contentItemSortPropertyDidChange")},this)},this),this._super()},"content"),sortAscendingWillChange:Ember.beforeObserver(function(){this._lastSortAscending=e(this,"sortAscending")},"sortAscending"),sortAscendingDidChange:Ember.observer(function(){if(e(this,"sortAscending")!==this._lastSortAscending){var t=e(this,"arrangedContent");t.reverseObjects()}},"sortAscending"),contentArrayWillChange:function(r,n,i,o){var s=e(this,"isSorted");if(s){var a=e(this,"arrangedContent"),u=r.slice(n,n+i),c=e(this,"sortProperties");t(u,function(e){a.removeObject(e),t(c,function(t){Ember.removeObserver(e,t,this,"contentItemSortPropertyDidChange")},this)},this)}return this._super(r,n,i,o)},contentArrayDidChange:function(r,n,i,o){var s=e(this,"isSorted"),a=e(this,"sortProperties");if(s){var u=r.slice(n,n+o);t(u,function(e){this.insertItemSorted(e),t(a,function(t){Ember.addObserver(e,t,this,"contentItemSortPropertyDidChange")},this)},this)}return this._super(r,n,i,o)},insertItemSorted:function(t){var r=e(this,"arrangedContent"),n=e(r,"length"),i=this._binarySearch(t,0,n);r.insertAt(i,t)},contentItemSortPropertyDidChange:function(t){var r=e(this,"arrangedContent"),n=r.indexOf(t),i=r.objectAt(n-1),o=r.objectAt(n+1),s=i&&this.orderBy(t,i),a=o&&this.orderBy(t,o);(0>s||a>0)&&(r.removeObject(t),this.insertItemSorted(t))},_binarySearch:function(t,r,n){var i,o,s,a;return r===n?r:(a=e(this,"arrangedContent"),i=r+Math.floor((n-r)/2),o=a.objectAt(i),s=this.orderBy(o,t),0>s?this._binarySearch(t,i+1,n):s>0?this._binarySearch(t,r,i):i)}})}(),function(){var e=Ember.get,t=(Ember.set,Ember.EnumerableUtils.forEach),r=Ember.EnumerableUtils.replace;Ember.ArrayController=Ember.ArrayProxy.extend(Ember.ControllerMixin,Ember.SortableMixin,{itemController:null,lookupItemController:function(){return e(this,"itemController")},objectAtContent:function(t){var r=e(this,"length"),n=e(this,"arrangedContent"),i=n&&n.objectAt(t);if(t>=0&&r>t){var o=this.lookupItemController(i);if(o)return this.controllerAt(t,i,o)}return i},arrangedContentDidChange:function(){this._super(),this._resetSubControllers()},arrayContentDidChange:function(n,i,o){var s=e(this,"_subControllers"),a=s.slice(n,n+i);t(a,function(e){e&&e.destroy()}),r(s,n,i,new Array(o)),this._super(n,i,o)},init:function(){this._super(),this.set("_subControllers",Ember.A())},content:Ember.computed(function(){return Ember.A()}),controllerAt:function(t,r,n){var i,o=e(this,"container"),s=e(this,"_subControllers"),a=s[t];if(a)return a;if(i="controller:"+n,!o.has(i))throw new Error('Could not resolve itemController: "'+n+'"');return a=o.lookupFactory(i).create({target:this,parentController:e(this,"parentController")||this,content:r}),s[t]=a,a},_subControllers:null,_resetSubControllers:function(){var r=e(this,"_subControllers");r&&t(r,function(e){e&&e.destroy()}),this.set("_subControllers",Ember.A())}})}(),function(){Ember.ObjectController=Ember.ObjectProxy.extend(Ember.ControllerMixin)}(),function(){var e=Ember.imports.jQuery;Ember.$=e}(),function(){if(Ember.$){var e=Ember.String.w("dragstart drag dragenter dragleave dragover drop dragend");Ember.EnumerableUtils.forEach(e,function(e){Ember.$.event.fixHooks[e]={props:["dataTransfer"]}})}}(),function(){function e(e){var t=e.shiftKey||e.metaKey||e.altKey||e.ctrlKey,r=e.which>1;return!t&&!r}var t=this.document&&function(){var e=document.createElement("div");return e.innerHTML="<div></div>",e.firstChild.innerHTML="<script></script>",""===e.firstChild.innerHTML}(),r=this.document&&function(){var e=document.createElement("div");return e.innerHTML="Test: <script type='text/x-placeholder'></script>Value","Test:"===e.childNodes[0].nodeValue&&" Value"===e.childNodes[2].nodeValue}(),n=function(e,t){if(e.getAttribute("id")===t)return e;var r,i,o,s=e.childNodes.length;for(r=0;s>r;r++)if(i=e.childNodes[r],o=1===i.nodeType&&n(i,t))return o},i=function(e,i){t&&(i="&shy;"+i);var o=[];if(r&&(i=i.replace(/(\s+)(<script id='([^']+)')/g,function(e,t,r,n){return o.push([n,t]),r})),e.innerHTML=i,o.length>0){var s,a=o.length;for(s=0;a>s;s++){var u=n(e,o[s][0]),c=document.createTextNode(o[s][1]);u.parentNode.insertBefore(c,u)}}if(t){for(var l=e.firstChild;1===l.nodeType&&!l.nodeName;)l=l.firstChild;3===l.nodeType&&"­"===l.nodeValue.charAt(0)&&(l.nodeValue=l.nodeValue.slice(1))}},o={},s=function(e){if(void 0!==o[e])return o[e];var t=!0;if("select"===e.toLowerCase()){var r=document.createElement("select");i(r,'<option value="test">Test</option>'),t=1===r.options.length}return o[e]=t,t},a=function(e,t){var r=e.tagName;if(s(r))i(e,t);else{var n=e.outerHTML||(new XMLSerializer).serializeToString(e),o=n.match(new RegExp("<"+r+"([^>]*)>","i"))[0],a="</"+r+">",u=document.createElement("div");for(i(u,o+t+a),e=u.firstChild;e.tagName!==r;)e=e.nextSibling}return e};Ember.ViewUtils={setInnerHTML:a,isSimpleClick:e}}(),function(){function e(e){return e?n.test(e)?e.replace(i,""):e:e}function t(e){var t={"<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},r=function(e){return t[e]||"&amp;"},n=e.toString();return s.test(n)?n.replace(o,r):n}Ember.get,Ember.set;var r=function(){this.seen={},this.list=[]};r.prototype={add:function(e){e in this.seen||(this.seen[e]=!0,this.list.push(e))},toDOM:function(){return this.list.join(" ")}};var n=/[^a-zA-Z0-9\-]/,i=/[^a-zA-Z0-9\-]/g,o=/&(?!\w+;)|[<>"'`]/g,s=/[&<>"'`]/;Ember.RenderBuffer=function(e){return new Ember._RenderBuffer(e)},Ember._RenderBuffer=function(e){this.tagNames=[e||null],this.buffer=""},Ember._RenderBuffer.prototype={_element:null,_hasElement:!0,elementClasses:null,classes:null,elementId:null,elementAttributes:null,elementProperties:null,elementTag:null,elementStyle:null,parentBuffer:null,push:function(e){return this.buffer+=e,this},addClass:function(e){return this.elementClasses=this.elementClasses||new r,this.elementClasses.add(e),this.classes=this.elementClasses.list,this},setClasses:function(e){this.classes=e},id:function(e){return this.elementId=e,this},attr:function(e,t){var r=this.elementAttributes=this.elementAttributes||{};return 1===arguments.length?r[e]:(r[e]=t,this)},removeAttr:function(e){var t=this.elementAttributes;return t&&delete t[e],this},prop:function(e,t){var r=this.elementProperties=this.elementProperties||{};return 1===arguments.length?r[e]:(r[e]=t,this)},removeProp:function(e){var t=this.elementProperties;return t&&delete t[e],this},style:function(e,t){return this.elementStyle=this.elementStyle||{},this.elementStyle[e]=t,this},begin:function(e){return this.tagNames.push(e||null),this},pushOpeningTag:function(){var r=this.currentTagName();if(r){if(this._hasElement&&!this._element&&0===this.buffer.length)return this._element=this.generateElement(),void 0;var n,i,o=this.buffer,s=this.elementId,a=this.classes,u=this.elementAttributes,c=this.elementProperties,l=this.elementStyle;if(o+="<"+e(r),s&&(o+=' id="'+t(s)+'"',this.elementId=null),a&&(o+=' class="'+t(a.join(" "))+'"',this.classes=null),l){o+=' style="';for(i in l)l.hasOwnProperty(i)&&(o+=i+":"+t(l[i])+";");o+='"',this.elementStyle=null}if(u){for(n in u)u.hasOwnProperty(n)&&(o+=" "+n+'="'+t(u[n])+'"');this.elementAttributes=null}if(c){for(i in c)if(c.hasOwnProperty(i)){var h=c[i];(h||"number"==typeof h)&&(o+=h===!0?" "+i+'="'+i+'"':" "+i+'="'+t(c[i])+'"')}this.elementProperties=null}o+=">",this.buffer=o}},pushClosingTag:function(){var t=this.tagNames.pop();t&&(this.buffer+="</"+e(t)+">")},currentTagName:function(){return this.tagNames[this.tagNames.length-1]},generateElement:function(){var e,t,r=this.tagNames.pop(),n=document.createElement(r),i=Ember.$(n),o=this.elementId,s=this.classes,a=this.elementAttributes,u=this.elementProperties,c=this.elementStyle,l="";if(o&&(i.attr("id",o),this.elementId=null),s&&(i.attr("class",s.join(" ")),this.classes=null),c){for(t in c)c.hasOwnProperty(t)&&(l+=t+":"+c[t]+";");i.attr("style",l),this.elementStyle=null}if(a){for(e in a)a.hasOwnProperty(e)&&i.attr(e,a[e]);this.elementAttributes=null}if(u){for(t in u)u.hasOwnProperty(t)&&i.prop(t,u[t]);this.elementProperties=null}return n},element:function(){var e=this.innerString();return e&&(this._element=Ember.ViewUtils.setInnerHTML(this._element,e)),this._element},string:function(){if(this._hasElement&&this._element){var e=this.element(),t=e.outerHTML;return"undefined"==typeof t?Ember.$("<div/>").append(e).html():t}return this.innerString()},innerString:function(){return this.buffer}}}(),function(){var e=Ember.get,t=Ember.set;Ember.String.fmt,Ember.EventDispatcher=Ember.Object.extend({events:{touchstart:"touchStart",touchmove:"touchMove",touchend:"touchEnd",touchcancel:"touchCancel",keydown:"keyDown",keyup:"keyUp",keypress:"keyPress",mousedown:"mouseDown",mouseup:"mouseUp",contextmenu:"contextMenu",click:"click",dblclick:"doubleClick",mousemove:"mouseMove",focusin:"focusIn",focusout:"focusOut",mouseenter:"mouseEnter",mouseleave:"mouseLeave",submit:"submit",input:"input",change:"change",dragstart:"dragStart",drag:"drag",dragenter:"dragEnter",dragleave:"dragLeave",dragover:"dragOver",drop:"drop",dragend:"dragEnd"},rootElement:"body",setup:function(r,n){var i,o=e(this,"events");Ember.$.extend(o,r||{}),Ember.isNone(n)||t(this,"rootElement",n),n=Ember.$(e(this,"rootElement")),n.addClass("ember-application");for(i in o)o.hasOwnProperty(i)&&this.setupHandler(n,i,o[i])},setupHandler:function(e,t,r){var n=this;e.on(t+".ember",".ember-view",function(e,t){return Ember.handleErrors(function(){var i=Ember.View.views[this.id],o=!0,s=null;return s=n._findNearestEventManager(i,r),s&&s!==t?o=n._dispatchEvent(s,e,r,i):i?o=n._bubbleEvent(i,e,r):e.stopPropagation(),o},this)}),e.on(t+".ember","[data-ember-action]",function(e){return Ember.handleErrors(function(){var t=Ember.$(e.currentTarget).attr("data-ember-action"),n=Ember.Handlebars.ActionHelper.registeredActions[t];return n&&n.eventName===r?n.handler(e):void 0},this)})},_findNearestEventManager:function(t,r){for(var n=null;t&&(n=e(t,"eventManager"),!n||!n[r]);)t=e(t,"parentView");return n},_dispatchEvent:function(e,t,r,n){var i=!0,o=e[r];return"function"===Ember.typeOf(o)?(i=Ember.run(function(){return o.call(e,t,n)}),t.stopPropagation()):i=this._bubbleEvent(n,t,r),i},_bubbleEvent:function(e,t,r){return Ember.run(function(){return e.handleEvent(r,t)})},destroy:function(){var t=e(this,"rootElement");return Ember.$(t).off(".ember","**").removeClass("ember-application"),this._super()}})}(),function(){var e=Ember.run.queues,t=Ember.ArrayPolyfills.indexOf;e.splice(t.call(e,"actions")+1,0,"render","afterRender")}(),function(){var e=Ember.get,t=Ember.set;Ember.ControllerMixin.reopen({target:null,namespace:null,view:null,container:null,_childContainers:null,init:function(){this._super(),t(this,"_childContainers",{})},_modelDidChange:Ember.observer(function(){var r=e(this,"_childContainers");for(var n in r)r.hasOwnProperty(n)&&r[n].destroy();t(this,"_childContainers",{})},"model")})}(),function(){function e(){Ember.run.once(Ember.View,"notifyMutationListeners")}var t={},r=Ember.get,n=Ember.set,i=Ember.guidFor,o=Ember.EnumerableUtils.forEach,s=Ember.EnumerableUtils.addObject,a=Ember.computed(function(){var e=this._childViews,t=Ember.A(),n=this;return o(e,function(e){var n;e.isVirtual?(n=r(e,"childViews"))&&t.pushObjects(n):t.push(e)}),t.replace=function(e,t,r){if(n instanceof Ember.ContainerView)return n.replace(e,t,r);throw new Error("childViews is immutable")},t});Ember.TEMPLATES={},Ember.CoreView=Ember.Object.extend(Ember.Evented,Ember.ActionHandler,{isView:!0,states:t,init:function(){this._super(),this.transitionTo("preRender")},parentView:Ember.computed(function(){var e=this._parentView;return e&&e.isVirtual?r(e,"parentView"):e}).property("_parentView"),state:null,_parentView:null,concreteView:Ember.computed(function(){return this.isVirtual?r(this,"parentView"):this}).property("parentView"),instrumentName:"core_view",instrumentDetails:function(e){e.object=this.toString()},renderToBuffer:function(e,t){var r="render."+this.instrumentName,n={};return this.instrumentDetails(n),Ember.instrument(r,n,function(){return this._renderToBuffer(e,t)},this)},_renderToBuffer:function(e){var t=this.tagName;(null===t||void 0===t)&&(t="div");var r=this.buffer=e&&e.begin(t)||Ember.RenderBuffer(t);return this.transitionTo("inBuffer",!1),this.beforeRender(r),this.render(r),this.afterRender(r),r},trigger:function(e){this._super.apply(this,arguments);var t=this[e];if(t){var r,n,i=[];for(r=1,n=arguments.length;n>r;r++)i.push(arguments[r]);return t.apply(this,i)}},deprecatedSendHandles:function(e){return!!this[e]},deprecatedSend:function(e){var t=[].slice.call(arguments,1);this[e].apply(this,t)},has:function(e){return"function"===Ember.typeOf(this[e])||this._super(e)},destroy:function(){var e=this._parentView;if(this._super())return this.removedFromDOM||this.destroyElement(),e&&e.removeChild(this),this.transitionTo("destroying",!1),this},clearRenderedChildren:Ember.K,triggerRecursively:Ember.K,invokeRecursively:Ember.K,transitionTo:Ember.K,destroyElement:Ember.K});var u=Ember._ViewCollection=function(e){var t=this.views=e||[];this.length=t.length};u.prototype={length:0,trigger:function(e){for(var t,r=this.views,n=0,i=r.length;i>n;n++)t=r[n],t.trigger&&t.trigger(e)},triggerRecursively:function(e){for(var t=this.views,r=0,n=t.length;n>r;r++)t[r].triggerRecursively(e)},invokeRecursively:function(e){for(var t,r=this.views,n=0,i=r.length;i>n;n++)t=r[n],e(t)},transitionTo:function(e,t){for(var r=this.views,n=0,i=r.length;i>n;n++)r[n].transitionTo(e,t)},push:function(){this.length+=arguments.length;var e=this.views;return e.push.apply(e,arguments)},objectAt:function(e){return this.views[e]},forEach:function(e){var t=this.views;return o(t,e)},clear:function(){this.length=0,this.views.length=0}};var c=[];Ember.View=Ember.CoreView.extend({concatenatedProperties:["classNames","classNameBindings","attributeBindings"],isView:!0,templateName:null,layoutName:null,templates:Ember.TEMPLATES,template:Ember.computed(function(e,t){if(void 0!==t)return t;var n=r(this,"templateName"),i=this.templateForName(n,"template");return i||r(this,"defaultTemplate")}).property("templateName"),controller:Ember.computed(function(){var e=r(this,"_parentView");return e?r(e,"controller"):null}).property("_parentView"),layout:Ember.computed(function(){var e=r(this,"layoutName"),t=this.templateForName(e,"layout");return t||r(this,"defaultLayout")}).property("layoutName"),_yield:function(e,t){var n=r(this,"template");n&&n(e,t)},templateForName:function(e){if(e){var t=this.container||Ember.Container&&Ember.Container.defaultContainer;return t&&t.lookup("template:"+e)}},context:Ember.computed(function(e,t){return 2===arguments.length?(n(this,"_context",t),t):r(this,"_context")}).volatile(),_context:Ember.computed(function(){var e,t;return(t=r(this,"controller"))?t:(e=this._parentView,e?r(e,"_context"):null)}),_contextDidChange:Ember.observer(function(){this.rerender()},"context"),isVisible:!0,childViews:a,_childViews:c,_childViewsWillChange:Ember.beforeObserver(function(){if(this.isVirtual){var e=r(this,"parentView");e&&Ember.propertyWillChange(e,"childViews")}},"childViews"),_childViewsDidChange:Ember.observer(function(){if(this.isVirtual){var e=r(this,"parentView");e&&Ember.propertyDidChange(e,"childViews")}},"childViews"),nearestInstanceOf:function(e){for(var t=r(this,"parentView");t;){if(t instanceof e)return t;t=r(t,"parentView")}},nearestOfType:function(e){for(var t=r(this,"parentView"),n=e instanceof Ember.Mixin?function(t){return e.detect(t)}:function(t){return e.detect(t.constructor)};t;){if(n(t))return t;t=r(t,"parentView")}},nearestWithProperty:function(e){for(var t=r(this,"parentView");t;){if(e in t)return t;t=r(t,"parentView")}},nearestChildOf:function(e){for(var t=r(this,"parentView");t;){if(r(t,"parentView")instanceof e)return t;t=r(t,"parentView")}},_parentViewDidChange:Ember.observer(function(){this.isDestroying||(this.trigger("parentViewDidChange"),r(this,"parentView.controller")&&!r(this,"controller")&&this.notifyPropertyChange("controller"))},"_parentView"),_controllerDidChange:Ember.observer(function(){this.isDestroying||(this.rerender(),this.forEachChildView(function(e){e.propertyDidChange("controller")}))},"controller"),cloneKeywords:function(){var e=r(this,"templateData"),t=e?Ember.copy(e.keywords):{};return n(t,"view",r(this,"concreteView")),n(t,"_view",this),n(t,"controller",r(this,"controller")),t},render:function(e){var t=r(this,"layout")||r(this,"template");if(t){var n,i=r(this,"context"),o=this.cloneKeywords(),s={view:this,buffer:e,isRenderData:!0,keywords:o,insideGroup:r(this,"templateData.insideGroup")};n=t(i,{data:s}),void 0!==n&&e.push(n)}},rerender:function(){return this.currentState.rerender(this)},clearRenderedChildren:function(){for(var e=this.lengthBeforeRender,t=this.lengthAfterRender,r=this._childViews,n=t-1;n>=e;n--)r[n]&&r[n].destroy()},_applyClassNameBindings:function(e){var t,r,n,i=this.classNames;o(e,function(e){var o,a=Ember.View._parsePropertyPath(e),u=function(){r=this._classStringForProperty(e),t=this.$(),o&&(t.removeClass(o),i.removeObject(o)),r?(t.addClass(r),o=r):o=null
};n=this._classStringForProperty(e),n&&(s(i,n),o=n),this.registerObserver(this,a.path,u),this.one("willClearRender",function(){o&&(i.removeObject(o),o=null)})},this)},_applyAttributeBindings:function(e,t){var n,i;o(t,function(t){var o=t.split(":"),s=o[0],a=o[1]||s,u=function(){i=this.$(),n=r(this,s),Ember.View.applyAttributeBindings(i,a,n)};this.registerObserver(this,s,u),n=r(this,s),Ember.View.applyAttributeBindings(e,a,n)},this)},_classStringForProperty:function(e){var t=Ember.View._parsePropertyPath(e),n=t.path,i=r(this,n);return void 0===i&&Ember.isGlobalPath(n)&&(i=r(Ember.lookup,n)),Ember.View._classStringForValue(n,i,t.className,t.falsyClassName)},element:Ember.computed(function(e,t){return void 0!==t?this.currentState.setElement(this,t):this.currentState.getElement(this)}).property("_parentView"),$:function(e){return this.currentState.$(this,e)},mutateChildViews:function(e){for(var t,r=this._childViews,n=r.length;--n>=0;)t=r[n],e(this,t,n);return this},forEachChildView:function(e){var t=this._childViews;if(!t)return this;var r,n,i=t.length;for(n=0;i>n;n++)r=t[n],e(r);return this},appendTo:function(e){return this._insertElementLater(function(){this.$().appendTo(e)}),this},replaceIn:function(e){return this._insertElementLater(function(){Ember.$(e).empty(),this.$().appendTo(e)}),this},_insertElementLater:function(e){this._scheduledInsert=Ember.run.scheduleOnce("render",this,"_insertElement",e)},_insertElement:function(e){this._scheduledInsert=null,this.currentState.insertElement(this,e)},append:function(){return this.appendTo(document.body)},remove:function(){this.removedFromDOM||this.destroyElement(),this.invokeRecursively(function(e){e.clearRenderedChildren&&e.clearRenderedChildren()})},elementId:null,findElementInParentElement:function(e){var t="#"+this.elementId;return Ember.$(t)[0]||Ember.$(t,e)[0]},createElement:function(){if(r(this,"element"))return this;var e=this.renderToBuffer();return n(this,"element",e.element()),this},willInsertElement:Ember.K,didInsertElement:Ember.K,willClearRender:Ember.K,invokeRecursively:function(e,t){for(var r,n,i,o=t===!1?this._childViews:[this];o.length;){r=o.slice(),o=[];for(var s=0,a=r.length;a>s;s++)n=r[s],i=n._childViews?n._childViews.slice(0):null,e(n),i&&o.push.apply(o,i)}},triggerRecursively:function(e){for(var t,r,n,i=[this];i.length;){t=i.slice(),i=[];for(var o=0,s=t.length;s>o;o++)r=t[o],n=r._childViews?r._childViews.slice(0):null,r.trigger&&r.trigger(e),n&&i.push.apply(i,n)}},viewHierarchyCollection:function(){for(var e,t=new u([this]),r=0;r<t.length;r++)e=t.objectAt(r),e._childViews&&t.push.apply(t,e._childViews);return t},destroyElement:function(){return this.currentState.destroyElement(this)},willDestroyElement:Ember.K,_notifyWillDestroyElement:function(){var e=this.viewHierarchyCollection();return e.trigger("willClearRender"),e.trigger("willDestroyElement"),e},_elementWillChange:Ember.beforeObserver(function(){this.forEachChildView(function(e){Ember.propertyWillChange(e,"element")})},"element"),_elementDidChange:Ember.observer(function(){this.forEachChildView(function(e){Ember.propertyDidChange(e,"element")})},"element"),parentViewDidChange:Ember.K,instrumentName:"view",instrumentDetails:function(e){e.template=r(this,"templateName"),this._super(e)},_renderToBuffer:function(e,t){this.lengthBeforeRender=this._childViews.length;var r=this._super(e,t);return this.lengthAfterRender=this._childViews.length,r},renderToBufferIfNeeded:function(e){return this.currentState.renderToBufferIfNeeded(this,e)},beforeRender:function(e){this.applyAttributesToBuffer(e),e.pushOpeningTag()},afterRender:function(e){e.pushClosingTag()},applyAttributesToBuffer:function(e){var t=r(this,"classNameBindings");t.length&&this._applyClassNameBindings(t);var n=r(this,"attributeBindings");n.length&&this._applyAttributeBindings(e,n),e.setClasses(this.classNames),e.id(this.elementId);var i=r(this,"ariaRole");i&&e.attr("role",i),r(this,"isVisible")===!1&&e.style("display","none")},tagName:null,ariaRole:null,classNames:["ember-view"],classNameBindings:c,attributeBindings:c,init:function(){this.elementId=this.elementId||i(this),this._super(),this._childViews=this._childViews.slice(),this.classNameBindings=Ember.A(this.classNameBindings.slice()),this.classNames=Ember.A(this.classNames.slice())},appendChild:function(e,t){return this.currentState.appendChild(this,e,t)},removeChild:function(e){if(!this.isDestroying){n(e,"_parentView",null);var t=this._childViews;return Ember.EnumerableUtils.removeObject(t,e),this.propertyDidChange("childViews"),this}},removeAllChildren:function(){return this.mutateChildViews(function(e,t){e.removeChild(t)})},destroyAllChildren:function(){return this.mutateChildViews(function(e,t){t.destroy()})},removeFromParent:function(){var e=this._parentView;return this.remove(),e&&e.removeChild(this),this},destroy:function(){var e,t,n=this._childViews,i=r(this,"parentView"),o=this.viewName;if(this._super()){for(e=n.length,t=e-1;t>=0;t--)n[t].removedFromDOM=!0;for(o&&i&&i.set(o,null),e=n.length,t=e-1;t>=0;t--)n[t].destroy();return this}},createChildView:function(e,t){if(!e)throw new TypeError("createChildViews first argument must exist");if(e.isView&&e._parentView===this&&e.container===this.container)return e;if(t=t||{},t._parentView=this,Ember.CoreView.detect(e))t.templateData=t.templateData||r(this,"templateData"),t.container=this.container,e=e.create(t),e.viewName&&n(r(this,"concreteView"),e.viewName,e);else if("string"==typeof e){var i="view:"+e,o=this.container.lookupFactory(i);t.templateData=r(this,"templateData"),e=o.create(t)}else t.container=this.container,r(e,"templateData")||(t.templateData=r(this,"templateData")),Ember.setProperties(e,t);return e},becameVisible:Ember.K,becameHidden:Ember.K,_isVisibleDidChange:Ember.observer(function(){var e=this.$();if(e){var t=r(this,"isVisible");e.toggle(t),this._isAncestorHidden()||(t?this._notifyBecameVisible():this._notifyBecameHidden())}},"isVisible"),_notifyBecameVisible:function(){this.trigger("becameVisible"),this.forEachChildView(function(e){var t=r(e,"isVisible");(t||null===t)&&e._notifyBecameVisible()})},_notifyBecameHidden:function(){this.trigger("becameHidden"),this.forEachChildView(function(e){var t=r(e,"isVisible");(t||null===t)&&e._notifyBecameHidden()})},_isAncestorHidden:function(){for(var e=r(this,"parentView");e;){if(r(e,"isVisible")===!1)return!0;e=r(e,"parentView")}return!1},clearBuffer:function(){this.invokeRecursively(function(e){e.buffer=null})},transitionTo:function(e,t){var r=this.currentState,n=this.currentState=this.states[e];this.state=e,r&&r.exit&&r.exit(this),n.enter&&n.enter(this),t!==!1&&this.forEachChildView(function(t){t.transitionTo(e)})},handleEvent:function(e,t){return this.currentState.handleEvent(this,e,t)},registerObserver:function(e,t,r,n){n||"function"!=typeof r||(n=r,r=null);var i=this,o=function(){i.currentState.invokeObserver(this,n)},s=function(){Ember.run.scheduleOnce("render",this,o)};Ember.addObserver(e,t,r,s),this.one("willClearRender",function(){Ember.removeObserver(e,t,r,s)})}});var l={prepend:function(t,r){t.$().prepend(r),e()},after:function(t,r){t.$().after(r),e()},html:function(t,r){t.$().html(r),e()},replace:function(t){var i=r(t,"element");n(t,"element",null),t._insertElementLater(function(){Ember.$(i).replaceWith(r(t,"element")),e()})},remove:function(t){t.$().remove(),e()},empty:function(t){t.$().empty(),e()}};Ember.View.reopen({domManager:l}),Ember.View.reopenClass({_parsePropertyPath:function(e){var t,r,n=e.split(":"),i=n[0],o="";return n.length>1&&(t=n[1],3===n.length&&(r=n[2]),o=":"+t,r&&(o+=":"+r)),{path:i,classNames:o,className:""===t?void 0:t,falsyClassName:r}},_classStringForValue:function(e,t,r,n){if(r||n)return r&&t?r:n&&!t?n:null;if(t===!0){var i=e.split(".");return Ember.String.dasherize(i[i.length-1])}return t!==!1&&null!=t?t:null}});var h=Ember.Object.extend(Ember.Evented).create();Ember.View.addMutationListener=function(e){h.on("change",e)},Ember.View.removeMutationListener=function(e){h.off("change",e)},Ember.View.notifyMutationListeners=function(){h.trigger("change")},Ember.View.views={},Ember.View.childViewsProperty=a,Ember.View.applyAttributeBindings=function(e,t,r){var n=Ember.typeOf(r);"value"===t||"string"!==n&&("number"!==n||isNaN(r))?"value"===t||"boolean"===n?(Ember.isNone(r)&&(r=""),r!==e.prop(t)&&e.prop(t,r)):r||e.removeAttr(t):r!==e.attr(t)&&e.attr(t,r)},Ember.View.states=t}(),function(){var e=(Ember.get,Ember.set);Ember.View.states._default={appendChild:function(){throw"You can't use appendChild outside of the rendering process"},$:function(){return void 0},getElement:function(){return null},handleEvent:function(){return!0},destroyElement:function(t){return e(t,"element",null),t._scheduledInsert&&(Ember.run.cancel(t._scheduledInsert),t._scheduledInsert=null),t},renderToBufferIfNeeded:function(){return!1},rerender:Ember.K,invokeObserver:Ember.K}}(),function(){var e=Ember.View.states.preRender=Ember.create(Ember.View.states._default);Ember.merge(e,{insertElement:function(e,t){e.createElement();var r=e.viewHierarchyCollection();r.trigger("willInsertElement"),t.call(e),r.transitionTo("inDOM",!1),r.trigger("didInsertElement")},renderToBufferIfNeeded:function(e,t){return e.renderToBuffer(t),!0},empty:Ember.K,setElement:function(e,t){return null!==t&&e.transitionTo("hasElement"),t}})}(),function(){Ember.get,Ember.set;var e=Ember.View.states.inBuffer=Ember.create(Ember.View.states._default);Ember.merge(e,{$:function(e){return e.rerender(),Ember.$()},rerender:function(){throw new Ember.Error("Something you did caused a view to re-render after it rendered but before it was inserted into the DOM.")},appendChild:function(e,t,r){var n=e.buffer,i=e._childViews;return t=e.createChildView(t,r),i.length||(i=e._childViews=i.slice()),i.push(t),t.renderToBuffer(n),e.propertyDidChange("childViews"),t},destroyElement:function(e){e.clearBuffer();var t=e._notifyWillDestroyElement();return t.transitionTo("preRender",!1),e},empty:function(){},renderToBufferIfNeeded:function(){return!1},insertElement:function(){throw"You can't insert an element that has already been rendered"},setElement:function(e,t){return null===t?e.transitionTo("preRender"):(e.clearBuffer(),e.transitionTo("hasElement")),t},invokeObserver:function(e,t){t.call(e)}})}(),function(){var e=Ember.get,t=Ember.set,r=Ember.View.states.hasElement=Ember.create(Ember.View.states._default);Ember.merge(r,{$:function(t,r){var n=e(t,"element");return r?Ember.$(r,n):Ember.$(n)},getElement:function(t){var r=e(t,"parentView");return r&&(r=e(r,"element")),r?t.findElementInParentElement(r):Ember.$("#"+e(t,"elementId"))[0]},setElement:function(e,t){if(null!==t)throw"You cannot set an element to a non-null value when the element is already in the DOM.";return e.transitionTo("preRender"),t},rerender:function(e){return e.triggerRecursively("willClearRender"),e.clearRenderedChildren(),e.domManager.replace(e),e},destroyElement:function(e){return e._notifyWillDestroyElement(),e.domManager.remove(e),t(e,"element",null),e._scheduledInsert&&(Ember.run.cancel(e._scheduledInsert),e._scheduledInsert=null),e},empty:function(e){var t,r,n=e._childViews;if(n)for(t=n.length,r=0;t>r;r++)n[r]._notifyWillDestroyElement();e.domManager.empty(e)},handleEvent:function(e,t,r){return e.has(t)?e.trigger(t,r):!0},invokeObserver:function(e,t){t.call(e)}});var n=Ember.View.states.inDOM=Ember.create(r);Ember.merge(n,{enter:function(e){e.isVirtual||(Ember.View.views[e.elementId]=e),e.addBeforeObserver("elementId",function(){throw new Error("Changing a view's elementId after creation is not allowed")})},exit:function(e){this.isVirtual||delete Ember.View.views[e.elementId]},insertElement:function(){throw"You can't insert an element into the DOM that has already been inserted"}})}(),function(){var e="You can't call %@ on a view being destroyed",t=Ember.String.fmt,r=Ember.View.states.destroying=Ember.create(Ember.View.states._default);Ember.merge(r,{appendChild:function(){throw t(e,["appendChild"])},rerender:function(){throw t(e,["rerender"])},destroyElement:function(){throw t(e,["destroyElement"])},empty:function(){throw t(e,["empty"])},setElement:function(){throw t(e,["set('element', ...)"])},renderToBufferIfNeeded:function(){return!1},insertElement:Ember.K})}(),function(){Ember.View.cloneStates=function(e){var t={};t._default={},t.preRender=Ember.create(t._default),t.destroying=Ember.create(t._default),t.inBuffer=Ember.create(t._default),t.hasElement=Ember.create(t._default),t.inDOM=Ember.create(t.hasElement);for(var r in e)e.hasOwnProperty(r)&&Ember.merge(t[r],e[r]);return t}}(),function(){function e(e,t,r,n){t.triggerRecursively("willInsertElement"),r?r.domManager.after(r,n.string()):e.domManager.prepend(e,n.string()),t.forEach(function(e){e.transitionTo("inDOM"),e.propertyDidChange("element"),e.triggerRecursively("didInsertElement")})}var t=Ember.View.cloneStates(Ember.View.states),r=Ember.get,n=Ember.set,i=Ember.EnumerableUtils.forEach,o=Ember._ViewCollection;Ember.ContainerView=Ember.View.extend(Ember.MutableArray,{states:t,init:function(){this._super();var e=r(this,"childViews");Ember.defineProperty(this,"childViews",Ember.View.childViewsProperty);var t=this._childViews;i(e,function(e,i){var o;"string"==typeof e?(o=r(this,e),o=this.createChildView(o),n(this,e,o)):o=this.createChildView(e),t[i]=o},this);var o=r(this,"currentView");o&&(t.length||(t=this._childViews=this._childViews.slice()),t.push(this.createChildView(o)))},replace:function(e,t,n){var i=n?r(n,"length"):0;if(this.arrayContentWillChange(e,t,i),this.childViewsWillChange(this._childViews,e,t),0===i)this._childViews.splice(e,t);else{var o=[e,t].concat(n);n.length&&!this._childViews.length&&(this._childViews=this._childViews.slice()),this._childViews.splice.apply(this._childViews,o)}return this.arrayContentDidChange(e,t,i),this.childViewsDidChange(this._childViews,e,t,i),this},objectAt:function(e){return this._childViews[e]},length:Ember.computed(function(){return this._childViews.length}).volatile(),render:function(e){this.forEachChildView(function(t){t.renderToBuffer(e)})},instrumentName:"container",childViewsWillChange:function(e,t,r){if(this.propertyWillChange("childViews"),r>0){var n=e.slice(t,t+r);this.currentState.childViewsWillChange(this,e,t,r),this.initializeViews(n,null,null)}},removeChild:function(e){return this.removeObject(e),this},childViewsDidChange:function(e,t,n,i){if(i>0){var o=e.slice(t,t+i);this.initializeViews(o,this,r(this,"templateData")),this.currentState.childViewsDidChange(this,e,t,i)}this.propertyDidChange("childViews")},initializeViews:function(e,t,o){i(e,function(e){n(e,"_parentView",t),!e.container&&t&&n(e,"container",t.container),r(e,"templateData")||n(e,"templateData",o)})},currentView:null,_currentViewWillChange:Ember.beforeObserver(function(){var e=r(this,"currentView");e&&e.destroy()},"currentView"),_currentViewDidChange:Ember.observer(function(){var e=r(this,"currentView");e&&this.pushObject(e)},"currentView"),_ensureChildrenAreInDOM:function(){this.currentState.ensureChildrenAreInDOM(this)}}),Ember.merge(t._default,{childViewsWillChange:Ember.K,childViewsDidChange:Ember.K,ensureChildrenAreInDOM:Ember.K}),Ember.merge(t.inBuffer,{childViewsDidChange:function(){throw new Error("You cannot modify child views while in the inBuffer state")}}),Ember.merge(t.hasElement,{childViewsWillChange:function(e,t,r,n){for(var i=r;r+n>i;i++)t[i].remove()},childViewsDidChange:function(e){Ember.run.scheduleOnce("render",e,"_ensureChildrenAreInDOM")},ensureChildrenAreInDOM:function(t){var r,n,i,s,a,u=t._childViews,c=new o;for(r=0,n=u.length;n>r;r++)i=u[r],a||(a=Ember.RenderBuffer(),a._hasElement=!1),i.renderToBufferIfNeeded(a)?c.push(i):c.length?(e(t,c,s,a),a=null,s=i,c.clear()):s=i;c.length&&e(t,c,s,a)}})}(),function(){var e=Ember.get,t=Ember.set;Ember.String.fmt,Ember.CollectionView=Ember.ContainerView.extend({content:null,emptyViewClass:Ember.View,emptyView:null,itemViewClass:Ember.View,init:function(){var e=this._super();return this._contentDidChange(),e},_contentWillChange:Ember.beforeObserver(function(){var t=this.get("content");t&&t.removeArrayObserver(this);var r=t?e(t,"length"):0;this.arrayWillChange(t,0,r)},"content"),_contentDidChange:Ember.observer(function(){var t=e(this,"content");t&&(this._assertArrayLike(t),t.addArrayObserver(this));var r=t?e(t,"length"):0;this.arrayDidChange(t,0,null,r)},"content"),_assertArrayLike:function(){},destroy:function(){if(this._super()){var t=e(this,"content");return t&&t.removeArrayObserver(this),this._createdEmptyView&&this._createdEmptyView.destroy(),this}},arrayWillChange:function(t,r,n){var i=e(this,"emptyView");i&&i instanceof Ember.View&&i.removeFromParent();var o,s,a,u=this._childViews;a=this._childViews.length;var c=n===a;for(c&&(this.currentState.empty(this),this.invokeRecursively(function(e){e.removedFromDOM=!0},!1)),s=r+n-1;s>=r;s--)o=u[s],o.destroy()},arrayDidChange:function(r,n,i,o){var s,a,u,c,l,h,m=[];if(c=r?e(r,"length"):0)for(l=e(this,"itemViewClass"),"string"==typeof l&&(l=e(l)||l),u=n;n+o>u;u++)a=r.objectAt(u),s=this.createChildView(l,{content:a,contentIndex:u}),m.push(s);else{if(h=e(this,"emptyView"),!h)return;"string"==typeof h&&(h=e(h)||h),h=this.createChildView(h),m.push(h),t(this,"emptyView",h),Ember.CoreView.detect(h)&&(this._createdEmptyView=h)}this.replace(n,0,m)},createChildView:function(r,n){r=this._super(r,n);var i=e(r,"tagName");return(null===i||void 0===i)&&(i=Ember.CollectionView.CONTAINER_MAP[e(this,"tagName")],t(r,"tagName",i)),r}}),Ember.CollectionView.CONTAINER_MAP={ul:"li",ol:"li",table:"tr",thead:"tr",tbody:"tr",tfoot:"tr",tr:"td",select:"option"}}(),function(){var e=Ember.get,t=Ember.set;Ember.isNone,Ember.Component=Ember.View.extend(Ember.TargetActionSupport,{init:function(){this._super(),t(this,"context",this),t(this,"controller",this)},cloneKeywords:function(){return{view:this,controller:this}},_yield:function(t,r){var n=r.data.view,i=this._parentView,o=e(this,"template");o&&n.appendChild(Ember.View,{isVirtual:!0,tagName:"",_contextView:i,template:e(this,"template"),context:e(i,"context"),controller:e(i,"controller"),templateData:{keywords:i.cloneKeywords()}})},targetObject:Ember.computed(function(){var t=e(this,"_parentView");return t?e(t,"controller"):null}).property("_parentView"),sendAction:function(t,r){var n;n=void 0===t?e(this,"action"):e(this,t),void 0!==n&&this.triggerAction({action:n,actionContext:r})}})}(),function(){Ember.ViewTargetActionSupport=Ember.Mixin.create(Ember.TargetActionSupport,{target:Ember.computed.alias("controller"),actionContext:Ember.computed.alias("context")})}(),function(){e("metamorph",[],function(){"use strict";// Copyright: ©2011 My Company Inc. All rights reserved.
var e=function(){},t=0,r=this.document,n=("undefined"==typeof ENV?{}:ENV).DISABLE_RANGE_API,i=!n&&r&&"createRange"in r&&"undefined"!=typeof Range&&Range.prototype.createContextualFragment,o=r&&function(){var e=r.createElement("div");return e.innerHTML="<div></div>",e.firstChild.innerHTML="<script></script>",""===e.firstChild.innerHTML}(),s=r&&function(){var e=r.createElement("div");return e.innerHTML="Test: <script type='text/x-placeholder'></script>Value","Test:"===e.childNodes[0].nodeValue&&" Value"===e.childNodes[2].nodeValue}(),a=function(r){var n;n=this instanceof a?this:new e,n.innerHTML=r;var i="metamorph-"+t++;return n.start=i+"-start",n.end=i+"-end",n};e.prototype=a.prototype;var u,c,l,h,m,f,p,d,b;if(h=function(){return this.startTag()+this.innerHTML+this.endTag()},d=function(){return"<script id='"+this.start+"' type='text/x-placeholder'></script>"},b=function(){return"<script id='"+this.end+"' type='text/x-placeholder'></script>"},i)u=function(e,t){var n=r.createRange(),i=r.getElementById(e.start),o=r.getElementById(e.end);return t?(n.setStartBefore(i),n.setEndAfter(o)):(n.setStartAfter(i),n.setEndBefore(o)),n},c=function(e,t){var r=u(this,t);r.deleteContents();var n=r.createContextualFragment(e);r.insertNode(n)},l=function(){var e=u(this,!0);e.deleteContents()},m=function(e){var t=r.createRange();t.setStart(e),t.collapse(!1);var n=t.createContextualFragment(this.outerHTML());e.appendChild(n)},f=function(e){var t=r.createRange(),n=r.getElementById(this.end);t.setStartAfter(n),t.setEndAfter(n);var i=t.createContextualFragment(e);t.insertNode(i)},p=function(e){var t=r.createRange(),n=r.getElementById(this.start);t.setStartAfter(n),t.setEndAfter(n);var i=t.createContextualFragment(e);t.insertNode(i)};else{var v={select:[1,"<select multiple='multiple'>","</select>"],fieldset:[1,"<fieldset>","</fieldset>"],table:[1,"<table>","</table>"],tbody:[2,"<table><tbody>","</tbody></table>"],tr:[3,"<table><tbody><tr>","</tr></tbody></table>"],colgroup:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],map:[1,"<map>","</map>"],_default:[0,"",""]},E=function(e,t){if(e.getAttribute("id")===t)return e;var r,n,i,o=e.childNodes.length;for(r=0;o>r;r++)if(n=e.childNodes[r],i=1===n.nodeType&&E(n,t))return i},g=function(e,t){var n=[];if(s&&(t=t.replace(/(\s+)(<script id='([^']+)')/g,function(e,t,r,i){return n.push([i,t]),r})),e.innerHTML=t,n.length>0){var i,o=n.length;for(i=0;o>i;i++){var a=E(e,n[i][0]),u=r.createTextNode(n[i][1]);a.parentNode.insertBefore(u,a)}}},y=function(e,t){var n=v[e.tagName.toLowerCase()]||v._default,i=n[0],s=n[1],a=n[2];o&&(t="&shy;"+t);var u=r.createElement("div");g(u,s+t+a);for(var c=0;i>=c;c++)u=u.firstChild;if(o){for(var l=u;1===l.nodeType&&!l.nodeName;)l=l.firstChild;3===l.nodeType&&"­"===l.nodeValue.charAt(0)&&(l.nodeValue=l.nodeValue.slice(1))}return u},w=function(e){for(;""===e.parentNode.tagName;)e=e.parentNode;return e},_=function(e,t){e.parentNode!==t.parentNode&&t.parentNode.insertBefore(e,t.parentNode.firstChild)};c=function(e,t){var n,i,o,s=w(r.getElementById(this.start)),a=r.getElementById(this.end),u=a.parentNode;for(_(s,a),n=s.nextSibling;n;){if(i=n.nextSibling,o=n===a){if(!t)break;a=n.nextSibling}if(n.parentNode.removeChild(n),o)break;n=i}for(n=y(s.parentNode,e);n;)i=n.nextSibling,u.insertBefore(n,a),n=i},l=function(){var e=w(r.getElementById(this.start)),t=r.getElementById(this.end);this.html(""),e.parentNode.removeChild(e),t.parentNode.removeChild(t)},m=function(e){for(var t,r=y(e,this.outerHTML());r;)t=r.nextSibling,e.appendChild(r),r=t},f=function(e){var t,n,i=r.getElementById(this.end),o=i.nextSibling,s=i.parentNode;for(n=y(s,e);n;)t=n.nextSibling,s.insertBefore(n,o),n=t},p=function(e){var t,n,i=r.getElementById(this.start),o=i.parentNode;n=y(o,e);for(var s=i.nextSibling;n;)t=n.nextSibling,o.insertBefore(n,s),n=t}}return a.prototype.html=function(e){return this.checkRemoved(),void 0===e?this.innerHTML:(c.call(this,e),this.innerHTML=e,void 0)},a.prototype.replaceWith=function(e){this.checkRemoved(),c.call(this,e,!0)},a.prototype.remove=l,a.prototype.outerHTML=h,a.prototype.appendTo=m,a.prototype.after=f,a.prototype.prepend=p,a.prototype.startTag=d,a.prototype.endTag=b,a.prototype.isRemoved=function(){var e=r.getElementById(this.start),t=r.getElementById(this.end);return!e||!t},a.prototype.checkRemoved=function(){if(this.isRemoved())throw new Error("Cannot perform operations on a Metamorph that is not in the DOM.")},a})}(),function(){function e(e){var t=e.hash,r=e.hashTypes;for(var n in t)"ID"===r[n]&&(t[n+"Binding"]=t[n],r[n+"Binding"]="STRING",delete t[n],delete r[n])}var t=Object.create||function(e){function t(){}return t.prototype=e,new t},r=this.Handlebars||Ember.imports&&Ember.imports.Handlebars;r||"function"!=typeof require||(r=require("handlebars")),Ember.Handlebars=t(r),Ember.Handlebars.helper=function(t,r){Ember.View.detect(r)?Ember.Handlebars.registerHelper(t,function(t){return e(t),Ember.Handlebars.helpers.view.call(this,r,t)}):Ember.Handlebars.registerBoundHelper.apply(null,arguments)},Ember.Handlebars.helpers=t(r.helpers),Ember.Handlebars.Compiler=function(){},r.Compiler&&(Ember.Handlebars.Compiler.prototype=t(r.Compiler.prototype)),Ember.Handlebars.Compiler.prototype.compiler=Ember.Handlebars.Compiler,Ember.Handlebars.JavaScriptCompiler=function(){},r.JavaScriptCompiler&&(Ember.Handlebars.JavaScriptCompiler.prototype=t(r.JavaScriptCompiler.prototype),Ember.Handlebars.JavaScriptCompiler.prototype.compiler=Ember.Handlebars.JavaScriptCompiler),Ember.Handlebars.JavaScriptCompiler.prototype.namespace="Ember.Handlebars",Ember.Handlebars.JavaScriptCompiler.prototype.initializeBuffer=function(){return"''"},Ember.Handlebars.JavaScriptCompiler.prototype.appendToBuffer=function(e){return"data.buffer.push("+e+");"};var n="ember"+ +new Date,i=1;Ember.Handlebars.Compiler.prototype.mustache=function(e){if(e.isHelper&&"control"===e.id.string)e.hash=e.hash||new r.AST.HashNode([]),e.hash.pairs.push(["controlID",new r.AST.StringNode(n+i++)]);else if(e.params.length||e.hash);else{var t=new r.AST.IdNode([{part:"_triageMustache"}]);e.escaped||(e.hash=e.hash||new r.AST.HashNode([]),e.hash.pairs.push(["unescaped",new r.AST.StringNode("true")])),e=new r.AST.MustacheNode([t].concat([e.id]),e.hash,!e.escaped)}return r.Compiler.prototype.mustache.call(this,e)},Ember.Handlebars.precompile=function(e){var t=r.parse(e),n={knownHelpers:{action:!0,unbound:!0,bindAttr:!0,template:!0,view:!0,_triageMustache:!0},data:!0,stringParams:!0},i=(new Ember.Handlebars.Compiler).compile(t,n);return(new Ember.Handlebars.JavaScriptCompiler).compile(i,n,void 0,!0)},r.compile&&(Ember.Handlebars.compile=function(e){var t=r.parse(e),n={data:!0,stringParams:!0},i=(new Ember.Handlebars.Compiler).compile(t,n),o=(new Ember.Handlebars.JavaScriptCompiler).compile(i,n,void 0,!0),s=Ember.Handlebars.template(o);return s.isMethod=!1,s})}(),function(){function e(e,t,r,n){var i,o,s,a,u=[],c=n.hash,l=c.boundOptions;for(a in l)l.hasOwnProperty(a)&&(c[a]=Ember.Handlebars.get(e,l[a],n));for(i=0,o=r.length;o>i;++i)s=r[i],u.push(Ember.Handlebars.get(e,s.path,n));return u.push(n),t.apply(e,u)}var t=Array.prototype.slice,r=Ember.Handlebars.normalizePath=function(e,t,r){var n,i,o=r&&r.keywords||{};return n=t.split(".",1)[0],o.hasOwnProperty(n)&&(e=o[n],i=!0,t=t===n?"":t.substr(n.length+1)),{root:e,path:t,isKeyword:i}},n=Ember.Handlebars.get=function(e,t,n){var i,o=n&&n.data,s=r(e,t,o);return e=s.root,t=s.path,i=Ember.get(e,t),void 0===i&&e!==Ember.lookup&&Ember.isGlobalPath(t)&&(i=Ember.get(Ember.lookup,t)),i};Ember.Handlebars.getPath=Ember.deprecateFunc("`Ember.Handlebars.getPath` has been changed to `Ember.Handlebars.get` for consistency.",Ember.Handlebars.get),Ember.Handlebars.resolveParams=function(e,t,r){for(var i,o,s=[],a=r.types,u=0,c=t.length;c>u;u++)i=t[u],o=a[u],"ID"===o?s.push(n(e,i,r)):s.push(i);return s},Ember.Handlebars.resolveHash=function(e,t,r){var i,o={},s=r.hashTypes;for(var a in t)t.hasOwnProperty(a)&&(i=s[a],o[a]="ID"===i?n(e,t[a],r):t[a]);return o},Ember.Handlebars.registerHelper("helperMissing",function(e,t){var r,n="";throw r="%@ Handlebars error: Could not find property '%@' on object %@.",t.data&&(n=t.data.view),new Ember.Error(Ember.String.fmt(r,[n,e,this]))}),Ember.Handlebars.registerBoundHelper=function(n,i){function o(){var n,o,a,u,c,l=t.call(arguments,0,-1),h=l.length,m=arguments[arguments.length-1],f=[],p=m.types,d=m.data,b=m.hash,v=d.view,E=m.contexts&&m.contexts[0]||this,g="",y=Ember._SimpleHandlebarsView.prototype.normalizedValue,w=b.boundOptions={};for(a in b)Ember.IS_BINDING.test(a)&&(w[a.slice(0,-7)]=b[a]);var _=[];for(d.properties=[],n=0;h>n;++n)if(d.properties.push(l[n]),"ID"===p[n]){var C=r(E,l[n],d);f.push(C),_.push(C)}else f.push(null);if(d.isUnbound)return e(this,i,f,m);var O=new Ember._SimpleHandlebarsView(null,null,!m.hash.unescaped,m.data);O.normalizedValue=function(){var e,t=[];for(e in w)w.hasOwnProperty(e)&&(c=r(E,w[e],d),O.path=c.path,O.pathRoot=c.root,b[e]=y.call(O));for(n=0;h>n;++n)c=f[n],c?(O.path=c.path,O.pathRoot=c.root,t.push(y.call(O))):t.push(l[n]);return t.push(m),i.apply(E,t)},v.appendChild(O);for(u in w)w.hasOwnProperty(u)&&_.push(r(E,w[u],d));for(n=0,o=_.length;o>n;++n)c=_[n],v.registerObserver(c.root,c.path,O,O.rerender);if("ID"===p[0]&&0!==f.length){var A=f[0],P=A.root,V=A.path;Ember.isEmpty(V)||(g=V+".");for(var x=0,T=s.length;T>x;x++)v.registerObserver(P,g+s[x],O,O.rerender)}}var s=t.call(arguments,2);o._rawFunction=i,Ember.Handlebars.registerHelper(n,o)},Ember.Handlebars.template=function(e){var t=Handlebars.template(e);return t.isTop=!0,t}}(),function(){Ember.String.htmlSafe=function(e){return new Handlebars.SafeString(e)};var e=Ember.String.htmlSafe;(Ember.EXTEND_PROTOTYPES===!0||Ember.EXTEND_PROTOTYPES.String)&&(String.prototype.htmlSafe=function(){return e(this)})}(),function(){Ember.Handlebars.resolvePaths=function(e){for(var t=[],r=e.contexts,n=e.roots,i=e.data,o=0,s=r.length;s>o;o++)t.push(Ember.Handlebars.get(n[o],r[o],{data:i}));return t}}(),function(){function e(){Ember.run.once(Ember.View,"notifyMutationListeners")}Ember.set,Ember.get;var r=t("metamorph"),n={remove:function(t){t.morph.remove(),e()},prepend:function(t,r){t.morph.prepend(r),e()},after:function(t,r){t.morph.after(r),e()},html:function(t,r){t.morph.html(r),e()},replace:function(t){var r=t.morph;t.transitionTo("preRender"),Ember.run.schedule("render",this,function(){if(!t.isDestroying){t.clearRenderedChildren();var n=t.renderToBuffer();t.invokeRecursively(function(e){e.propertyWillChange("element")}),t.triggerRecursively("willInsertElement"),r.replaceWith(n.string()),t.transitionTo("inDOM"),t.invokeRecursively(function(e){e.propertyDidChange("element")}),t.triggerRecursively("didInsertElement"),e()}})},empty:function(t){t.morph.html(""),e()}};Ember._Metamorph=Ember.Mixin.create({isVirtual:!0,tagName:"",instrumentName:"metamorph",init:function(){this._super(),this.morph=r()},beforeRender:function(e){e.push(this.morph.startTag()),e.pushOpeningTag()},afterRender:function(e){e.pushClosingTag(),e.push(this.morph.endTag())},createElement:function(){var e=this.renderToBuffer();this.outerHTML=e.string(),this.clearBuffer()},domManager:n}),Ember._MetamorphView=Ember.View.extend(Ember._Metamorph),Ember._SimpleMetamorphView=Ember.CoreView.extend(Ember._Metamorph)}(),function(){function e(e,t,r,n){this.path=e,this.pathRoot=t,this.isEscaped=r,this.templateData=n,this.morph=o(),this.state="preRender",this.updateId=null,this._parentView=null,this.buffer=null}var r=Ember.get,n=Ember.set,i=Ember.Handlebars.get,o=t("metamorph");Ember._SimpleHandlebarsView=e,e.prototype={isVirtual:!0,isView:!0,destroy:function(){this.updateId&&(Ember.run.cancel(this.updateId),this.updateId=null),this._parentView&&this._parentView.removeChild(this),this.morph=null,this.state="destroyed"},propertyWillChange:Ember.K,propertyDidChange:Ember.K,normalizedValue:function(){var e,t,r=this.path,n=this.pathRoot;return""===r?e=n:(t=this.templateData,e=i(n,r,{data:t})),e},renderToBuffer:function(e){var t="";t+=this.morph.startTag(),t+=this.render(),t+=this.morph.endTag(),e.push(t)},render:function(){var e=this.isEscaped,t=this.normalizedValue();return null===t||void 0===t?t="":t instanceof Handlebars.SafeString||(t=String(t)),e&&(t=Handlebars.Utils.escapeExpression(t)),t},rerender:function(){switch(this.state){case"preRender":case"destroyed":break;case"inBuffer":throw new Ember.Error("Something you did tried to replace an {{expression}} before it was inserted into the DOM.");case"hasElement":case"inDOM":this.updateId=Ember.run.scheduleOnce("render",this,"update")}return this},update:function(){this.updateId=null,this.morph.html(this.render())},transitionTo:function(e){this.state=e}};var s=Ember.View.cloneStates(Ember.View.states),a=Ember.merge;a(s._default,{rerenderIfNeeded:Ember.K}),a(s.inDOM,{rerenderIfNeeded:function(e){e.normalizedValue()!==e._lastNormalizedValue&&e.rerender()}}),Ember._HandlebarsBoundView=Ember._MetamorphView.extend({instrumentName:"boundHandlebars",states:s,shouldDisplayFunc:null,preserveContext:!1,previousContext:null,displayTemplate:null,inverseTemplate:null,path:null,pathRoot:null,normalizedValue:function(){var e,t,n=r(this,"path"),o=r(this,"pathRoot"),s=r(this,"valueNormalizerFunc");return""===n?e=o:(t=r(this,"templateData"),e=i(o,n,{data:t})),s?s(e):e},rerenderIfNeeded:function(){this.currentState.rerenderIfNeeded(this)},render:function(e){var t=r(this,"isEscaped"),i=r(this,"shouldDisplayFunc"),o=r(this,"preserveContext"),s=r(this,"previousContext"),a=r(this,"inverseTemplate"),u=r(this,"displayTemplate"),c=this.normalizedValue();if(this._lastNormalizedValue=c,i(c))if(n(this,"template",u),o)n(this,"_context",s);else{if(!u)return null===c||void 0===c?c="":c instanceof Handlebars.SafeString||(c=String(c)),t&&(c=Handlebars.Utils.escapeExpression(c)),e.push(c),void 0;n(this,"_context",c)}else a?(n(this,"template",a),o?n(this,"_context",s):n(this,"_context",c)):n(this,"template",function(){return""});return this._super(e)}})}(),function(){function e(e){return!Ember.isNone(e)}function t(e,t,r){var n=o(e,t,r);return null===n||void 0===n?n="":n instanceof Handlebars.SafeString||(n=String(n)),r.hash.unescaped||(n=Handlebars.Utils.escapeExpression(n)),n}function r(e,t,r,n,i,a){var u,c,l,h=t.data,m=t.fn,f=t.inverse,p=h.view,d=this;if(u=s(d,e,h),"object"==typeof this){if(h.insideGroup){c=function(){Ember.run.once(p,"rerender")};var b,v,E=o(d,e,t);E=i?i(E):E,v=r?d:E,n(E)?b=m:f&&(b=f),b(v,{data:t.data})}else{var g=p.createChildView(Ember._HandlebarsBoundView,{preserveContext:r,shouldDisplayFunc:n,valueNormalizerFunc:i,displayTemplate:m,inverseTemplate:f,path:e,pathRoot:d,previousContext:d,isEscaped:!t.hash.unescaped,templateData:t.data});p.appendChild(g),c=function(){Ember.run.scheduleOnce("render",g,"rerenderIfNeeded")}}if(""!==u.path&&(p.registerObserver(u.root,u.path,c),a))for(l=0;l<a.length;l++)p.registerObserver(u.root,u.path+"."+a[l],c)}else h.buffer.push(o(d,e,t))}function n(e,r){var n,i,o=r.data,a=o.view,u=this;if(n=s(u,e,o),"object"==typeof this){if(o.insideGroup)i=function(){Ember.run.once(a,"rerender")},output=t(u,e,r),o.buffer.push(output);else{var c=new Ember._SimpleHandlebarsView(e,u,!r.hash.unescaped,r.data);c._parentView=a,a.appendChild(c),i=function(){Ember.run.scheduleOnce("render",c,"rerender")}}""!==n.path&&a.registerObserver(n.root,n.path,i)}else output=t(u,e,r),o.buffer.push(output)}var i=Ember.get;Ember.set,Ember.String.fmt;var o=Ember.Handlebars.get,s=Ember.Handlebars.normalizePath,a=Ember.ArrayPolyfills.forEach,u=Ember.Handlebars,c=u.helpers;u.registerHelper("_triageMustache",function(e,t){return c[e]?c[e].call(this,t):c.bind.apply(this,arguments)}),u.registerHelper("bind",function(t,i){var o=i.contexts&&i.contexts[0]||this;return i.fn?r.call(o,t,i,!1,e):n.call(o,t,i)}),u.registerHelper("boundIf",function(e,t){var n=t.contexts&&t.contexts[0]||this,o=function(e){var t=e&&i(e,"isTruthy");return"boolean"==typeof t?t:Ember.isArray(e)?0!==i(e,"length"):!!e};return r.call(n,e,t,!0,o,o,["isTruthy","length"])}),u.registerHelper("with",function(t,n){if(4===arguments.length){var i,o,a,u;if(n=arguments[3],i=arguments[2],o=arguments[0],Ember.isGlobalPath(o))Ember.bind(n.data.keywords,i,o);else{u=s(this,o,n.data),o=u.path,a=u.root;var l=Ember.$.expando+Ember.guidFor(a);n.data.keywords[l]=a;var h=o?l+"."+o:l;Ember.bind(n.data.keywords,i,h)}return r.call(this,o,n,!0,e)}return c.bind.call(n.contexts[0],t,n)}),u.registerHelper("if",function(e,t){return c.boundIf.call(t.contexts[0],e,t)}),u.registerHelper("unless",function(e,t){var r=t.fn,n=t.inverse;return t.fn=n,t.inverse=r,c.boundIf.call(t.contexts[0],e,t)}),u.registerHelper("bind-attr",function(e){var t=e.hash,r=e.data.view,n=[],i=this,c=++Ember.uuid,l=t["class"];if(null!=l){var h=u.bindClasses(this,l,r,c,e);n.push('class="'+Handlebars.Utils.escapeExpression(h.join(" "))+'"'),delete t["class"]}var m=Ember.keys(t);return a.call(m,function(a){var u,l=t[a];u=s(i,l,e.data);var h,m,f="this"===l?u.root:o(i,l,e),p=Ember.typeOf(f);h=function(){var t=o(i,l,e),n=r.$("[data-bindattr-"+c+"='"+c+"']");return n&&0!==n.length?(Ember.View.applyAttributeBindings(n,a,t),void 0):(Ember.removeObserver(u.root,u.path,m),void 0)},"this"===l||u.isKeyword&&""===u.path||r.registerObserver(u.root,u.path,h),"string"===p||"number"===p&&!isNaN(f)?n.push(a+'="'+Handlebars.Utils.escapeExpression(f)+'"'):f&&"boolean"===p&&n.push(a+'="'+a+'"')},this),n.push("data-bindattr-"+c+'="'+c+'"'),new u.SafeString(n.join(" "))}),u.registerHelper("bindAttr",u.helpers["bind-attr"]),u.bindClasses=function(e,t,r,n,i){var u,c,l,h=[],m=function(e,t,r){var n,i=t.path;return n="this"===i?e:""===i?!0:o(e,i,r),Ember.View._classStringForValue(i,n,t.className,t.falsyClassName)};return a.call(t.split(" "),function(t){var o,a,f,p,d=Ember.View._parsePropertyPath(t),b=d.path,v=e;""!==b&&"this"!==b&&(p=s(e,b,i.data),v=p.root,b=p.path),a=function(){u=m(e,d,i),l=n?r.$("[data-bindattr-"+n+"='"+n+"']"):r.$(),l&&0!==l.length?(o&&l.removeClass(o),u?(l.addClass(u),o=u):o=null):Ember.removeObserver(v,b,f)},""!==b&&"this"!==b&&r.registerObserver(v,b,a),c=m(e,d,i),c&&(h.push(c),o=c)}),h}}(),function(){Ember.get,Ember.set;var e=Ember.Handlebars,t=/^[a-z]/,r=/^view\./;e.ViewHelper=Ember.Object.create({propertiesFromHTMLOptions:function(e){var t=e.hash,r=e.data,n={},i=t["class"],o=!1;t.id&&(n.elementId=t.id,o=!0),t.tag&&(n.tagName=t.tag,o=!0),i&&(i=i.split(" "),n.classNames=i,o=!0),t.classBinding&&(n.classNameBindings=t.classBinding.split(" "),o=!0),t.classNameBindings&&(void 0===n.classNameBindings&&(n.classNameBindings=[]),n.classNameBindings=n.classNameBindings.concat(t.classNameBindings.split(" ")),o=!0),t.attributeBindings&&(n.attributeBindings=null,o=!0),o&&(t=Ember.$.extend({},t),delete t.id,delete t.tag,delete t["class"],delete t.classBinding);var s;for(var a in t)t.hasOwnProperty(a)&&Ember.IS_BINDING.test(a)&&"string"==typeof t[a]&&(s=this.contextualizeBindingPath(t[a],r),s&&(t[a]=s));if(n.classNameBindings)for(var u in n.classNameBindings){var c=n.classNameBindings[u];if("string"==typeof c){var l=Ember.View._parsePropertyPath(c);s=this.contextualizeBindingPath(l.path,r),s&&(n.classNameBindings[u]=s+l.classNames)}}return Ember.$.extend(t,n)},contextualizeBindingPath:function(e,t){var r=Ember.Handlebars.normalizePath(null,e,t);return r.isKeyword?"templateData.keywords."+e:Ember.isGlobalPath(e)?null:"this"===e?"_parentView.context":"_parentView.context."+e},helper:function(n,i,o){var s,a=o.data,u=o.fn;s="string"==typeof i?"STRING"===o.types[0]&&t.test(i)&&!r.test(i)?a.view.container.lookupFactory("view:"+i):e.get(n,i,o):i;var c=this.propertiesFromHTMLOptions(o,n),l=a.view;c.templateData=a;var h=s.proto?s.proto():s;u&&(c.template=u),h.controller||h.controllerBinding||c.controller||c.controllerBinding||(c._context=n),l.appendChild(s,c)}}),e.registerHelper("view",function(t,r){return t&&t.data&&t.data.isRenderData&&(r=t,t="Ember.View"),e.ViewHelper.helper(this,t,r)})}(),function(){var e=Ember.get,t=Ember.Handlebars.get;Ember.String.fmt,Ember.Handlebars.registerHelper("collection",function(r,n){r&&r.data&&r.data.isRenderData&&(n=r,r=void 0);var i=n.fn,o=n.data,s=n.inverse;n.data.view;var a;a=r?t(this,r,n):Ember.CollectionView;var u,c,l=n.hash,h={},m=a.proto();if(l.itemView){var f=o.keywords.controller,p=f.container;c=p.resolve("view:"+Ember.String.camelize(l.itemView))}else c=l.itemViewClass?t(m,l.itemViewClass,n):m.itemViewClass;delete l.itemViewClass,delete l.itemView;for(var d in l)l.hasOwnProperty(d)&&(u=d.match(/^item(.)(.*)$/),u&&"itemController"!==d&&(h[u[1].toLowerCase()+u[2]]=l[d],delete l[d]));i&&(h.template=i,delete n.fn);var b;s&&s!==Handlebars.VM.noop?(b=e(m,"emptyViewClass"),b=b.extend({template:s,tagName:h.tagName})):l.emptyViewClass&&(b=t(this,l.emptyViewClass,n)),b&&(l.emptyView=b),l.keyword||(h._context=Ember.computed.alias("content"));var v=Ember.Handlebars.ViewHelper.propertiesFromHTMLOptions({data:o,hash:h},this);return l.itemViewClass=c.extend(v),Ember.Handlebars.helpers.view.call(this,a,n)})}(),function(){var e=Ember.Handlebars.get;Ember.Handlebars.registerHelper("unbound",function(t,r){var n,i,o,s=arguments[arguments.length-1];return arguments.length>2?(s.data.isUnbound=!0,n=Ember.Handlebars.helpers[arguments[0]]||Ember.Handlebars.helperMissing,o=n.apply(this,Array.prototype.slice.call(arguments,1)),delete s.data.isUnbound,o):(i=r.contexts&&r.contexts[0]||this,e(i,t,r))})}(),function(){var e=Ember.Handlebars.get,t=Ember.Handlebars.normalizePath;Ember.Handlebars.registerHelper("log",function(r,n){var i=n.contexts&&n.contexts[0]||this,o=t(i,r,n.data),s=o.root,a=o.path,u="this"===a?s:e(s,a,n);Ember.Logger.log(u)}),Ember.Handlebars.registerHelper("debugger",function(){})}(),function(){var e=Ember.get,t=Ember.set;Ember.Handlebars.EachView=Ember.CollectionView.extend(Ember._Metamorph,{init:function(){var r,n=e(this,"itemController");if(n){var i=e(this,"controller.container").lookupFactory("controller:array").create({parentController:e(this,"controller"),itemController:n,target:e(this,"controller"),_eachView:this});this.disableContentObservers(function(){t(this,"content",i),r=new Ember.Binding("content","_eachView.dataSource").oneWay(),r.connect(i)}),t(this,"_arrayController",i)}else this.disableContentObservers(function(){r=new Ember.Binding("content","dataSource").oneWay(),r.connect(this)});return this._super()},_assertArrayLike:function(){},disableContentObservers:function(e){Ember.removeBeforeObserver(this,"content",null,"_contentWillChange"),Ember.removeObserver(this,"content",null,"_contentDidChange"),e.call(this),Ember.addBeforeObserver(this,"content",null,"_contentWillChange"),Ember.addObserver(this,"content",null,"_contentDidChange")},itemViewClass:Ember._MetamorphView,emptyViewClass:Ember._MetamorphView,createChildView:function(r,n){r=this._super(r,n);var i=e(this,"keyword"),o=e(r,"content");if(i){var s=e(r,"templateData");s=Ember.copy(s),s.keywords=r.cloneKeywords(),t(r,"templateData",s),s.keywords[i]=o}return o&&e(o,"isController")&&t(r,"controller",o),r},destroy:function(){if(this._super()){var t=e(this,"_arrayController");return t&&t.destroy(),this}}});var r=Ember.Handlebars.GroupedEach=function(e,t,r){var n=this,i=Ember.Handlebars.normalizePath(e,t,r.data);this.context=e,this.path=t,this.options=r,this.template=r.fn,this.containingView=r.data.view,this.normalizedRoot=i.root,this.normalizedPath=i.path,this.content=this.lookupContent(),this.addContentObservers(),this.addArrayObservers(),this.containingView.on("willClearRender",function(){n.destroy()})};r.prototype={contentWillChange:function(){this.removeArrayObservers()},contentDidChange:function(){this.content=this.lookupContent(),this.addArrayObservers(),this.rerenderContainingView()},contentArrayWillChange:Ember.K,contentArrayDidChange:function(){this.rerenderContainingView()},lookupContent:function(){return Ember.Handlebars.get(this.normalizedRoot,this.normalizedPath,this.options)},addArrayObservers:function(){this.content&&this.content.addArrayObserver(this,{willChange:"contentArrayWillChange",didChange:"contentArrayDidChange"})},removeArrayObservers:function(){this.content&&this.content.removeArrayObserver(this,{willChange:"contentArrayWillChange",didChange:"contentArrayDidChange"})},addContentObservers:function(){Ember.addBeforeObserver(this.normalizedRoot,this.normalizedPath,this,this.contentWillChange),Ember.addObserver(this.normalizedRoot,this.normalizedPath,this,this.contentDidChange)},removeContentObservers:function(){Ember.removeBeforeObserver(this.normalizedRoot,this.normalizedPath,this.contentWillChange),Ember.removeObserver(this.normalizedRoot,this.normalizedPath,this.contentDidChange)},render:function(){if(this.content){var t=this.content,r=e(t,"length"),n=this.options.data,i=this.template;n.insideEach=!0;for(var o=0;r>o;o++)i(t.objectAt(o),{data:n})}},rerenderContainingView:function(){var e=this;Ember.run.scheduleOnce("render",this,function(){e.destroyed||e.containingView.rerender()})},destroy:function(){this.removeContentObservers(),this.content&&this.removeArrayObservers(),this.destroyed=!0}},Ember.Handlebars.registerHelper("each",function(e,t){if(4===arguments.length){var r=arguments[0];t=arguments[3],e=arguments[2],""===e&&(e="this"),t.hash.keyword=r}return 1===arguments.length&&(t=e,e="this"),t.hash.dataSourceBinding=e,!t.data.insideGroup||t.hash.groupedRows||t.hash.itemViewClass?Ember.Handlebars.helpers.collection.call(this,"Ember.Handlebars.EachView",t):(new Ember.Handlebars.GroupedEach(this,e,t).render(),void 0)})}(),function(){Ember.Handlebars.registerHelper("template",function(){return Ember.Handlebars.helpers.partial.apply(this,arguments)})}(),function(){Ember.Handlebars.registerHelper("partial",function(e,t){var r=e.split("/"),n=r[r.length-1];r[r.length-1]="_"+n;var i=t.data.view,o=r.join("/"),s=i.templateForName(o),a=!s&&i.templateForName(e);s=s||a,s(this,{data:t.data})})}(),function(){var e=Ember.get;Ember.set,Ember.Handlebars.registerHelper("yield",function(t){for(var r=t.data.view;r&&!e(r,"layout");)r=r._contextView?r._contextView:e(r,"parentView");r._yield(this,t)})}(),function(){Ember.Handlebars.registerHelper("loc",function(e){return Ember.String.loc(e)})}(),function(){var e=Ember.set;Ember.get,Ember.Checkbox=Ember.View.extend({classNames:["ember-checkbox"],tagName:"input",attributeBindings:["type","checked","indeterminate","disabled","tabindex","name"],type:"checkbox",checked:!1,disabled:!1,indeterminate:!1,init:function(){this._super(),this.on("change",this,this._updateElementValue)},didInsertElement:function(){this._super(),this.get("element").indeterminate=!!this.get("indeterminate")},_updateElementValue:function(){e(this,"checked",this.$().prop("checked"))}})}(),function(){function e(e,r,n){var i=t(r,e),o=t(r,"onEvent"),s=t(r,"value");(o===e||"keyPress"===o&&"key-press"===e)&&r.sendAction("action",s),r.sendAction(e,s),(i||o===e)&&(t(r,"bubbles")||n.stopPropagation())}var t=Ember.get,r=Ember.set;Ember.TextSupport=Ember.Mixin.create({value:"",attributeBindings:["placeholder","disabled","maxlength","tabindex"],placeholder:null,disabled:!1,maxlength:null,init:function(){this._super(),this.on("focusOut",this,this._elementValueDidChange),this.on("change",this,this._elementValueDidChange),this.on("paste",this,this._elementValueDidChange),this.on("cut",this,this._elementValueDidChange),this.on("input",this,this._elementValueDidChange),this.on("keyUp",this,this.interpretKeyEvents)},action:null,onEvent:"enter",bubbles:!1,interpretKeyEvents:function(e){var t=Ember.TextSupport.KEY_EVENTS,r=t[e.keyCode];return this._elementValueDidChange(),r?this[r](e):void 0},_elementValueDidChange:function(){r(this,"value",this.$().val())},insertNewline:function(t){e("enter",this,t),e("insert-newline",this,t)},cancel:function(t){e("escape-press",this,t)},focusIn:function(t){e("focus-in",this,t)},focusOut:function(t){e("focus-out",this,t)},keyPress:function(t){e("key-press",this,t)}}),Ember.TextSupport.KEY_EVENTS={13:"insertNewline",27:"cancel"}}(),function(){Ember.get,Ember.set,Ember.TextField=Ember.Component.extend(Ember.TextSupport,{classNames:["ember-text-field"],tagName:"input",attributeBindings:["type","value","size","pattern","name"],value:"",type:"text",size:null,pattern:null})}(),function(){var e=Ember.get,t=Ember.set;Ember.Button=Ember.View.extend(Ember.TargetActionSupport,{classNames:["ember-button"],classNameBindings:["isActive"],tagName:"button",propagateEvents:!1,attributeBindings:["type","disabled","href","tabindex"],targetObject:Ember.computed(function(){var t=e(this,"target"),r=e(this,"context"),n=e(this,"templateData");return"string"!=typeof t?t:Ember.Handlebars.get(r,t,{data:n})}).property("target"),type:Ember.computed(function(){var e=this.tagName;return"input"===e||"button"===e?"button":void 0}),disabled:!1,href:Ember.computed(function(){return"a"===this.tagName?"#":null}),mouseDown:function(){return e(this,"disabled")||(t(this,"isActive",!0),this._mouseDown=!0,this._mouseEntered=!0),e(this,"propagateEvents")},mouseLeave:function(){this._mouseDown&&(t(this,"isActive",!1),this._mouseEntered=!1)},mouseEnter:function(){this._mouseDown&&(t(this,"isActive",!0),this._mouseEntered=!0)},mouseUp:function(){return e(this,"isActive")&&(this.triggerAction(),t(this,"isActive",!1)),this._mouseDown=!1,this._mouseEntered=!1,e(this,"propagateEvents")},keyDown:function(e){(13===e.keyCode||32===e.keyCode)&&this.mouseDown()},keyUp:function(e){(13===e.keyCode||32===e.keyCode)&&this.mouseUp()},touchStart:function(e){return this.mouseDown(e)},touchEnd:function(e){return this.mouseUp(e)},init:function(){this._super()}})}(),function(){var e=Ember.get;Ember.set,Ember.TextArea=Ember.Component.extend(Ember.TextSupport,{classNames:["ember-text-area"],tagName:"textarea",attributeBindings:["rows","cols","name"],rows:null,cols:null,_updateElementValue:Ember.observer(function(){var t=e(this,"value"),r=this.$();r&&t!==r.val()&&r.val(t)},"value"),init:function(){this._super(),this.on("didInsertElement",this,this._updateElementValue)}})}(),function(){var e=Ember.set,t=Ember.get,r=Ember.EnumerableUtils.indexOf,n=Ember.EnumerableUtils.indexesOf,i=Ember.EnumerableUtils.forEach,o=Ember.EnumerableUtils.replace,s=Ember.isArray;Ember.Handlebars.compile,Ember.SelectOption=Ember.View.extend({tagName:"option",attributeBindings:["value","selected"],defaultTemplate:function(e,t){t={data:t.data,hash:{}},Ember.Handlebars.helpers.bind.call(e,"view.label",t)},init:function(){this.labelPathDidChange(),this.valuePathDidChange(),this._super()},selected:Ember.computed(function(){var e=t(this,"content"),n=t(this,"parentView.selection");return t(this,"parentView.multiple")?n&&r(n,e.valueOf())>-1:e==n}).property("content","parentView.selection"),labelPathDidChange:Ember.observer(function(){var e=t(this,"parentView.optionLabelPath");e&&Ember.defineProperty(this,"label",Ember.computed(function(){return t(this,e)}).property(e))},"parentView.optionLabelPath"),valuePathDidChange:Ember.observer(function(){var e=t(this,"parentView.optionValuePath");e&&Ember.defineProperty(this,"value",Ember.computed(function(){return t(this,e)}).property(e))},"parentView.optionValuePath")}),Ember.SelectOptgroup=Ember.CollectionView.extend({tagName:"optgroup",attributeBindings:["label"],selectionBinding:"parentView.selection",multipleBinding:"parentView.multiple",optionLabelPathBinding:"parentView.optionLabelPath",optionValuePathBinding:"parentView.optionValuePath",itemViewClassBinding:"parentView.optionView"}),Ember.Select=Ember.View.extend({tagName:"select",classNames:["ember-select"],defaultTemplate:Ember.Handlebars.template(function(e,t,r,n,i){function o(e,t){var n,i,o="";return t.buffer.push('<option value="">'),n={},i={},t.buffer.push(p(r._triageMustache.call(e,"view.prompt",{hash:{},contexts:[e],types:["ID"],hashContexts:i,hashTypes:n,data:t}))),t.buffer.push("</option>"),o}function s(e,t){var n,i,o;i={},o={},n=r.each.call(e,"view.groupedContent",{hash:{},inverse:d.noop,fn:d.program(4,a,t),contexts:[e],types:["ID"],hashContexts:o,hashTypes:i,data:t}),n||0===n?t.buffer.push(n):t.buffer.push("")}function a(e,t){var n,i;n={contentBinding:e,labelBinding:e},i={contentBinding:"ID",labelBinding:"ID"},t.buffer.push(p(r.view.call(e,"view.groupView",{hash:{contentBinding:"content",labelBinding:"label"},contexts:[e],types:["ID"],hashContexts:n,hashTypes:i,data:t})))}function u(e,t){var n,i,o;i={},o={},n=r.each.call(e,"view.content",{hash:{},inverse:d.noop,fn:d.program(7,c,t),contexts:[e],types:["ID"],hashContexts:o,hashTypes:i,data:t}),n||0===n?t.buffer.push(n):t.buffer.push("")}function c(e,t){var n,i;n={contentBinding:e},i={contentBinding:"STRING"},t.buffer.push(p(r.view.call(e,"view.optionView",{hash:{contentBinding:"this"},contexts:[e],types:["ID"],hashContexts:n,hashTypes:i,data:t})))}this.compilerInfo=[4,">= 1.0.0"],r=this.merge(r,Ember.Handlebars.helpers),i=i||{};
var l,h,m,f="",p=this.escapeExpression,d=this;return h={},m={},l=r["if"].call(t,"view.prompt",{hash:{},inverse:d.noop,fn:d.program(1,o,i),contexts:[t],types:["ID"],hashContexts:m,hashTypes:h,data:i}),(l||0===l)&&i.buffer.push(l),h={},m={},l=r["if"].call(t,"view.optionGroupPath",{hash:{},inverse:d.program(6,u,i),fn:d.program(3,s,i),contexts:[t],types:["ID"],hashContexts:m,hashTypes:h,data:i}),(l||0===l)&&i.buffer.push(l),f}),attributeBindings:["multiple","disabled","tabindex","name"],multiple:!1,disabled:!1,content:null,selection:null,value:Ember.computed(function(e,r){if(2===arguments.length)return r;var n=t(this,"optionValuePath").replace(/^content\.?/,"");return n?t(this,"selection."+n):t(this,"selection")}).property("selection"),prompt:null,optionLabelPath:"content",optionValuePath:"content",optionGroupPath:null,groupView:Ember.SelectOptgroup,groupedContent:Ember.computed(function(){var e=t(this,"optionGroupPath"),r=Ember.A();return i(t(this,"content"),function(n){var i=t(n,e);t(r,"lastObject.label")!==i&&r.pushObject({label:i,content:Ember.A()}),t(r,"lastObject.content").push(n)}),r}).property("optionGroupPath","content.@each"),optionView:Ember.SelectOption,_change:function(){t(this,"multiple")?this._changeMultiple():this._changeSingle()},selectionDidChange:Ember.observer(function(){var r=t(this,"selection");if(t(this,"multiple")){if(!s(r))return e(this,"selection",Ember.A([r])),void 0;this._selectionDidChangeMultiple()}else this._selectionDidChangeSingle()},"selection.@each"),valueDidChange:Ember.observer(function(){var e,r=t(this,"content"),n=t(this,"value"),i=t(this,"optionValuePath").replace(/^content\.?/,""),o=i?t(this,"selection."+i):t(this,"selection");n!==o&&(e=r?r.find(function(e){return n===(i?t(e,i):e)}):null,this.set("selection",e))},"value"),_triggerChange:function(){var e=t(this,"selection"),r=t(this,"value");Ember.isNone(e)||this.selectionDidChange(),Ember.isNone(r)||this.valueDidChange(),this._change()},_changeSingle:function(){var r=this.$()[0].selectedIndex,n=t(this,"content"),i=t(this,"prompt");if(n&&t(n,"length")){if(i&&0===r)return e(this,"selection",null),void 0;i&&(r-=1),e(this,"selection",n.objectAt(r))}},_changeMultiple:function(){var r=this.$("option:selected"),n=t(this,"prompt"),i=n?1:0,a=t(this,"content"),u=t(this,"selection");if(a&&r){var c=r.map(function(){return this.index-i}).toArray(),l=a.objectsAt(c);s(u)?o(u,0,t(u,"length"),l):e(this,"selection",l)}},_selectionDidChangeSingle:function(){var e=this.get("element");if(e){var n=t(this,"content"),i=t(this,"selection"),o=n?r(n,i):-1,s=t(this,"prompt");s&&(o+=1),e&&(e.selectedIndex=o)}},_selectionDidChangeMultiple:function(){var e,i=t(this,"content"),o=t(this,"selection"),s=i?n(i,o):[-1],a=t(this,"prompt"),u=a?1:0,c=this.$("option");c&&c.each(function(){e=this.index>-1?this.index-u:-1,this.selected=r(s,e)>-1})},init:function(){this._super(),this.on("didInsertElement",this,this._triggerChange),this.on("change",this,this._change)}})}(),function(){function e(e,t){for(var r in e)"ID"===t[r]&&(e[r+"Binding"]=e[r],delete e[r])}Ember.Handlebars.registerHelper("input",function(t){var r=t.hash,n=t.hashTypes,i=r.type,o=r.on;return delete r.type,delete r.on,e(r,n),"checkbox"===i?Ember.Handlebars.helpers.view.call(this,Ember.Checkbox,t):(i&&(r.type=i),r.onEvent=o||"enter",Ember.Handlebars.helpers.view.call(this,Ember.TextField,t))}),Ember.Handlebars.registerHelper("textarea",function(t){var r=t.hash,n=t.hashTypes;return e(r,n),Ember.Handlebars.helpers.view.call(this,Ember.TextArea,t)})}(),function(){function e(){Ember.Handlebars.bootstrap(Ember.$(document))}function t(e){var t,n=Ember.TEMPLATES;if(n)for(var i in n)(t=i.match(/^components\/(.*)$/))&&r(e,t[1])}function r(e,t){e.injection("component:"+t,"layout","template:components/"+t);var r="component:"+t,n=e.lookupFactory(r);n||(e.register("component:"+t,Ember.Component),n=e.lookupFactory(r)),Ember.Handlebars.helper(t,n)}Ember.Handlebars.bootstrap=function(e){var t='script[type="text/x-handlebars"], script[type="text/x-raw-handlebars"]';Ember.$(t,e).each(function(){var e=Ember.$(this),t="text/x-raw-handlebars"===e.attr("type")?Ember.$.proxy(Handlebars.compile,Handlebars):Ember.$.proxy(Ember.Handlebars.compile,Ember.Handlebars),r=e.attr("data-template-name")||e.attr("id")||"application",n=t(e.html());if(void 0!==Ember.TEMPLATES[r])throw new Error('Template named "'+r+'" already exists.');Ember.TEMPLATES[r]=n,e.remove()})},Ember.onLoad("Ember.Application",function(r){r.initializer({name:"domTemplates",initialize:e}),r.initializer({name:"registerComponents",after:"domTemplates",initialize:t})})}(),function(){Ember.runLoadHooks("Ember.Handlebars",Ember.Handlebars)}(),function(){e("route-recognizer",[],function(){"use strict";function e(e){this.string=e}function t(e){this.name=e}function r(e){this.name=e}function n(){}function i(i,o,s){"/"===i.charAt(0)&&(i=i.substr(1));for(var a=i.split("/"),u=[],c=0,l=a.length;l>c;c++){var h,m=a[c];(h=m.match(/^:([^\/]+)$/))?(u.push(new t(h[1])),o.push(h[1]),s.dynamics++):(h=m.match(/^\*([^\/]+)$/))?(u.push(new r(h[1])),o.push(h[1]),s.stars++):""===m?u.push(new n):(u.push(new e(m)),s.statics++)}return u}function o(e){this.charSpec=e,this.nextStates=[]}function s(e){return e.sort(function(e,t){return e.types.stars!==t.types.stars?e.types.stars-t.types.stars:e.types.dynamics!==t.types.dynamics?e.types.dynamics-t.types.dynamics:e.types.statics!==t.types.statics?e.types.statics-t.types.statics:0})}function a(e,t){for(var r=[],n=0,i=e.length;i>n;n++){var o=e[n];r=r.concat(o.match(t))}return r}function u(e,t){for(var r=e.handlers,n=e.regex,i=t.match(n),o=1,s=[],a=0,u=r.length;u>a;a++){for(var c=r[a],l=c.names,h={},m=0,f=l.length;f>m;m++)h[l[m]]=i[o++];s.push({handler:c.handler,params:h,isDynamic:!!l.length})}return s}function c(e,t){return t.eachChar(function(t){e=e.put(t)}),e}function l(e,t,r){this.path=e,this.matcher=t,this.delegate=r}function h(e){this.routes={},this.children={},this.target=e}function m(e,t,r){return function(n,i){var o=e+n;return i?(i(m(o,t,r)),void 0):new l(e+n,t,r)}}function f(e,t,r){for(var n=0,i=0,o=e.length;o>i;i++)n+=e[i].path.length;t=t.substr(n),e.push({path:t,handler:r})}function p(e,t,r,n){var i=t.routes;for(var o in i)if(i.hasOwnProperty(o)){var s=e.slice();f(s,o,i[o]),t.children[o]?p(s,t.children[o],r,n):r.call(n,s)}}var d=["/",".","*","+","?","|","(",")","[","]","{","}","\\"],b=new RegExp("(\\"+d.join("|\\")+")","g");e.prototype={eachChar:function(e){for(var t,r=this.string,n=0,i=r.length;i>n;n++)t=r.charAt(n),e({validChars:t})},regex:function(){return this.string.replace(b,"\\$1")},generate:function(){return this.string}},t.prototype={eachChar:function(e){e({invalidChars:"/",repeat:!0})},regex:function(){return"([^/]+)"},generate:function(e){return e[this.name]}},r.prototype={eachChar:function(e){e({invalidChars:"",repeat:!0})},regex:function(){return"(.+)"},generate:function(e){return e[this.name]}},n.prototype={eachChar:function(){},regex:function(){return""},generate:function(){return""}},o.prototype={get:function(e){for(var t=this.nextStates,r=0,n=t.length;n>r;r++){var i=t[r],o=i.charSpec.validChars===e.validChars;if(o=o&&i.charSpec.invalidChars===e.invalidChars)return i}},put:function(e){var t;return(t=this.get(e))?t:(t=new o(e),this.nextStates.push(t),e.repeat&&t.nextStates.push(t),t)},match:function(e){for(var t,r,n,i=this.nextStates,o=[],s=0,a=i.length;a>s;s++)t=i[s],r=t.charSpec,"undefined"!=typeof(n=r.validChars)?-1!==n.indexOf(e)&&o.push(t):"undefined"!=typeof(n=r.invalidChars)&&-1===n.indexOf(e)&&o.push(t);return o}};var v=function(){this.rootState=new o,this.names={}};return v.prototype={add:function(e,t){for(var r,o=this.rootState,s="^",a={statics:0,dynamics:0,stars:0},u=[],l=[],h=!0,m=0,f=e.length;f>m;m++){var p=e[m],d=[],b=i(p.path,d,a);l=l.concat(b);for(var v=0,E=b.length;E>v;v++){var g=b[v];g instanceof n||(h=!1,o=o.put({validChars:"/"}),s+="/",o=c(o,g),s+=g.regex())}u.push({handler:p.handler,names:d})}h&&(o=o.put({validChars:"/"}),s+="/"),o.handlers=u,o.regex=new RegExp(s+"$"),o.types=a,(r=t&&t.as)&&(this.names[r]={segments:l,handlers:u})},handlersFor:function(e){var t=this.names[e],r=[];if(!t)throw new Error("There is no route named "+e);for(var n=0,i=t.handlers.length;i>n;n++)r.push(t.handlers[n]);return r},hasRoute:function(e){return!!this.names[e]},generate:function(e,t){var r=this.names[e],i="";if(!r)throw new Error("There is no route named "+e);for(var o=r.segments,s=0,a=o.length;a>s;s++){var u=o[s];u instanceof n||(i+="/",i+=u.generate(t))}return"/"!==i.charAt(0)&&(i="/"+i),i},recognize:function(e){var t,r,n,i=[this.rootState];for("/"!==e.charAt(0)&&(e="/"+e),t=e.length,t>1&&"/"===e.charAt(t-1)&&(e=e.substr(0,t-1)),r=0,n=e.length;n>r&&(i=a(i,e.charAt(r)),i.length);r++);var o=[];for(r=0,n=i.length;n>r;r++)i[r].handlers&&o.push(i[r]);i=s(o);var c=o[0];return c&&c.handlers?u(c,e):void 0}},l.prototype={to:function(e,t){var r=this.delegate;if(r&&r.willAddRoute&&(e=r.willAddRoute(this.matcher.target,e)),this.matcher.add(this.path,e),t){if(0===t.length)throw new Error("You must have an argument in the function passed to `to`");this.matcher.addChild(this.path,e,t,this.delegate)}}},h.prototype={add:function(e,t){this.routes[e]=t},addChild:function(e,t,r,n){var i=new h(t);this.children[e]=i;var o=m(e,i,n);n&&n.contextEntered&&n.contextEntered(t,o),r(o)}},v.prototype.map=function(e,t){var r=new h;e(m("",r,this.delegate)),p([],r,function(e){t?t(this,e):this.add(e)},this)},v})}(),function(){e("router",["route-recognizer","rsvp"],function(e,t){"use strict";function r(e,t){this.router=e,this.promise=t,this.data={},this.resolvedModels={},this.providedModels={},this.providedModelsArray=[],this.sequence=++r.currentSequence,this.params={}}function n(){this.recognizer=new e}function i(e,n){return new r(e,t.reject(n))}function o(e,t,r,n){var i,o,a=t.length,u={},l=e.currentHandlerInfos||[],h={},m=e.currentParams||{},f=e.activeTransition,p={};for(r=x.call(r),c(h,n),i=t.length-1;i>=0;i--){var d=t[i],b=d.handler,v=l[i],E=!1;if(v&&v.name===d.handler||(E=!0),d.isDynamic)if(o=s(r,b,f,!0,h))E=!0,u[b]=o;else{p[b]={};for(var g in d.params)if(d.params.hasOwnProperty(g)){var y=d.params[g];m[g]!==y&&(E=!0),p[b][g]=h[g]=y}}else if(d.hasOwnProperty("names"))if(r.length&&(E=!0),o=s(r,b,f,d.names[0],h))u[b]=o;else{var w=d.names;p[b]={};for(var _=0,C=w.length;C>_;++_){var O=w[_];p[b][O]=h[O]=h[O]||m[O]}}E&&(a=i)}if(r.length>0)throw new Error("More context objects were passed than there are dynamic segments for the route: "+t[t.length-1].handler);return{matchPoint:a,providedModels:u,params:h,handlerParams:p}}function s(e,t,r,n,i){if(e.length&&n){var o=e.pop();if(!a(o))return o;i[n]=o.toString()}else if(r)return r.resolvedModels[t]||n&&r.providedModels[t]}function a(e){return"string"==typeof e||e instanceof String||!isNaN(e)}function u(e,t,r){var n,i,s,a,u,l=e.recognizer.handlersFor(t),h={},m=o(e,l,r).matchPoint;for(u=0;u<l.length;u++)i=l[u],s=e.getHandler(i.handler),a=i.names,a.length&&(n=u>=m?r.shift():s.context,c(h,V(s,n,a)));return h}function c(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])}function l(e,t){var r=e.recognizer.handlersFor(t[0]);return A(e,"Attempting transition to "+t[0]),E(e,r,x.call(t,1),e.currentParams)}function h(e,t){var r=e.recognizer.recognize(t);return e.currentHandlerInfos,A(e,"Attempting URL transition to "+t),r?E(e,r,[],{}):i(e,new n.UnrecognizedURLError(t))}function m(e,t){var r=e.router,n=d(r.currentHandlerInfos||[],t);r.targetHandlerInfos=t,p(n.exited,function(e){var t=e.handler;delete t.context,t.exit&&t.exit()});var i=n.unchanged.slice();r.currentHandlerInfos=i,p(n.updatedContext,function(t){f(e,i,t,!1)}),p(n.entered,function(t){f(e,i,t,!0)})}function f(e,t,r,i){var o=r.handler,s=r.context;try{i&&o.enter&&o.enter(),C(e),v(o,s),o.setup&&o.setup(s),C(e)}catch(a){throw a instanceof n.TransitionAborted||b(e.router,t.concat(r),!0,["error",a,e]),a}t.push(r)}function p(e,t){for(var r=0,n=e.length;n>r;r++)t(e[r])}function d(e,t){var r,n,i,o,s={updatedContext:[],exited:[],entered:[],unchanged:[]};for(i=0,o=t.length;o>i;i++){var a=e[i],u=t[i];a&&a.handler===u.handler||(r=!0),r?(s.entered.push(u),a&&s.exited.unshift(a)):n||a.context!==u.context?(n=!0,s.updatedContext.push(u)):s.unchanged.push(a)}for(i=t.length,o=e.length;o>i;i++)s.exited.unshift(e[i]);return s}function b(e,t,r,n){if(e.triggerEvent)return e.triggerEvent(t,r,n),void 0;var i=n.shift();if(!t){if(r)return;throw new Error("Could not trigger event '"+i+"'. There are no active handlers")}for(var o=!1,s=t.length-1;s>=0;s--){var a=t[s],u=a.handler;if(u.events&&u.events[i]){if(u.events[i].apply(u,n)!==!0)return;o=!0}}if(!o&&!r)throw new Error("Nothing handled the event '"+i+"'.")}function v(e,t){e.context=t,e.contextDidChange&&e.contextDidChange()}function E(e,n,i,s,a){function u(){C(d);try{A(e,d.sequence,"Validation succeeded, finalizing transition;"),f&&f.length&&e.recognizer.hasRoute(f[f.length-1].name)&&f.length===l.matchPoint||w(d,v),e.didTransition&&e.didTransition(v),A(e,d.sequence,"TRANSITION COMPLETE."),p.resolve(v[v.length-1].handler)}catch(t){p.reject(t)}d.isAborted||(e.activeTransition=null)}function c(e){p.reject(e)}var l=o(e,n,i,s),h=n[n.length-1].handler,m=!1,f=e.currentHandlerInfos;if(e.activeTransition){if(y(e.activeTransition,h,i))return e.activeTransition;e.activeTransition.abort(),m=!0}var p=t.defer(),d=new r(e,p.promise);d.targetName=h,d.providedModels=l.providedModels,d.providedModelsArray=i,d.params=l.params,d.data=a||{},e.activeTransition=d;var v=g(e,n);return m||b(e,f,!0,["willTransition",d]),A(e,d.sequence,"Beginning validation for transition to "+d.targetName),_(d,v,0,l.matchPoint,l.handlerParams).then(u,c),d}function g(e,t){for(var r=[],n=0,i=t.length;i>n;++n){var o=t[n],s=o.isDynamic||o.names&&o.names.length;r.push({isDynamic:!!s,name:o.handler,handler:e.getHandler(o.handler)})}return r}function y(e,t,r){if(e.targetName!==t)return!1;var n=e.providedModelsArray;if(n.length!==r.length)return!1;for(var i=0,o=n.length;o>i;++i)if(n[i]!==r[i])return!1;return!0}function w(e,t){for(var r=e.router,n=(e.sequence,t[t.length-1].name),i=[],o=e.providedModelsArray.slice(),s=t.length-1;s>=0;--s){var c=t[s];if(c.isDynamic){var l=o.pop();i.unshift(a(l)?l.toString():c.context)}}var h=u(r,n,i);r.currentParams=h;var f=e.urlMethod;if(f){var p=r.recognizer.generate(n,h);"replace"===f?r.replaceURL(p):r.updateURL(p)}m(e,t)}function _(e,i,o,s,a){function u(r){return e.isAborted?(A(e.router,e.sequence,"detected abort."),t.reject(new n.TransitionAborted)):r}function c(r){return r instanceof n.TransitionAborted?t.reject(r):(e.abort(),A(p,g,E+": handling error: "+r),b(p,i.slice(0,o+1),!0,["error",r,e]),t.reject(r))}function l(){A(p,g,E+": calling beforeModel hook");var t=v.beforeModel&&v.beforeModel(e);return t instanceof r?null:t}function h(){A(p,g,E+": resolving model");var t=O(d,e,a[E],o>=s);return t instanceof r?null:t}function m(t){A(p,g,E+": calling afterModel hook"),e.resolvedModels[d.name]=t;var n=v.afterModel&&v.afterModel(t,e);return n instanceof r?null:n}function f(){return A(p,g,E+": validation succeeded, proceeding"),d.context=e.resolvedModels[d.name],_(e,i,o+1,s,a)}if(o===i.length)return t.resolve(e.resolvedModels);var p=e.router,d=i[o],v=d.handler,E=d.name,g=e.sequence;return s>o?(A(p,g,E+": using context from already-active handler"),e.resolvedModels[d.name]=e.providedModels[d.name]||d.handler.context,f()):t.resolve().then(u).then(l).then(u).then(h).then(u).then(m).then(u).then(null,c).then(f)}function C(e){if(e.isAborted)throw A(e.router,e.sequence,"detected abort."),new n.TransitionAborted}function O(e,t,r,n){var i=e.handler,o=e.name;if(!n&&i.hasOwnProperty("context"))return i.context;if(t.providedModels.hasOwnProperty(o)){var s=t.providedModels[o];return"function"==typeof s?s():s}return i.model&&i.model(r||{},t)}function A(e,t,r){e.log&&(3===arguments.length?e.log("Transition #"+t+": "+r):(r=t,e.log(r)))}function P(e,t){var r=t[0]||"/";return"/"===r.charAt(0)?h(e,r):l(e,t)}function V(e,t,r){var n={};if(a(t))return n[r[0]]=t,n;if(e.serialize)return e.serialize(t,r);if(1===r.length){var i=r[0];return n[i]=/_id$/.test(i)?t.id:t,n}}var x=Array.prototype.slice;return r.currentSequence=0,r.prototype={targetName:null,urlMethod:"update",providedModels:null,resolvedModels:null,params:null,promise:null,data:null,then:function(e,t){return this.promise.then(e,t)},abort:function(){return this.isAborted?this:(A(this.router,this.sequence,this.targetName+": transition was aborted"),this.isAborted=!0,this.router.activeTransition=null,this)},retry:function(){this.abort();var e=this.router.recognizer.handlersFor(this.targetName),t=E(this.router,e,this.providedModelsArray,this.params,this.data);return t},method:function(e){return this.urlMethod=e,this}},n.UnrecognizedURLError=function(e){this.message=e||"UnrecognizedURLError",this.name="UnrecognizedURLError"},n.TransitionAborted=function(e){this.message=e||"TransitionAborted",this.name="TransitionAborted"},n.prototype={map:function(e){this.recognizer.delegate=this.delegate,this.recognizer.map(e,function(e,t){var r=t[t.length-1].handler,n=[t,{as:r}];e.add.apply(e,n)})},hasRoute:function(e){return this.recognizer.hasRoute(e)},reset:function(){p(this.currentHandlerInfos||[],function(e){var t=e.handler;t.exit&&t.exit()}),this.currentHandlerInfos=null,this.targetHandlerInfos=null},activeTransition:null,handleURL:function(e){var t=x.call(arguments);return"/"!==e.charAt(0)&&(t[0]="/"+e),P(this,t).method(null)},updateURL:function(){throw new Error("updateURL is not implemented")},replaceURL:function(e){this.updateURL(e)},transitionTo:function(){return P(this,arguments)},replaceWith:function(){return P(this,arguments).method("replace")},paramsForHandler:function(e){return u(this,e,x.call(arguments,1))},generate:function(e){var t=u(this,e,x.call(arguments,1));return this.recognizer.generate(e,t)},isActive:function(e){var t,r,n=x.call(arguments,1),i=this.targetHandlerInfos,o=!1;if(!i)return!1;for(var s=this.recognizer.handlersFor(i[i.length-1].name),u=i.length-1;u>=0;u--)if(r=i[u],r.name===e&&(o=!0),o){if(0===n.length)break;if(r.isDynamic)if(t=n.pop(),a(t)){var c=s[u],l=c.names[0];if(""+t!==this.currentParams[l])return!1}else if(r.context!==t)return!1}return 0===n.length&&o},trigger:function(){var e=x.call(arguments);b(this,this.currentHandlerInfos,!1,e)},log:null},n})}(),function(){function e(e){this.parent=e,this.matches=[]}e.prototype={resource:function(t,r,n){if(2===arguments.length&&"function"==typeof r&&(n=r,r={}),1===arguments.length&&(r={}),"string"!=typeof r.path&&(r.path="/"+t),n){var i=new e(t);n.call(i),this.push(r.path,t,i.generate())}else this.push(r.path,t)},push:function(e,t,r){var n=t.split(".");(""===e||"/"===e||"index"===n[n.length-1])&&(this.explicitIndex=!0),this.matches.push([e,t,r])},route:function(e,t){t=t||{},"string"!=typeof t.path&&(t.path="/"+e),this.parent&&"application"!==this.parent&&(e=this.parent+"."+e),this.push(t.path,e)},generate:function(){var e=this.matches;return this.explicitIndex||this.route("index",{path:"/"}),function(t){for(var r=0,n=e.length;n>r;r++){var i=e[r];t(i[0]).to(i[1],i[2])}}}},e.map=function(t){var r=new e;return t.call(r),r},Ember.RouterDSL=e}(),function(){var e=Ember.get;Ember.controllerFor=function(e,t,r){return e.lookup("controller:"+t,r)},Ember.generateController=function(t,r,n){var i,o,s,a,u;return u=n&&Ember.isArray(n)?"array":n?"object":"basic",a="controller:"+u,i=t.lookupFactory(a).extend({isGenerated:!0,toString:function(){return"(generated "+r+" controller)"}}),o="controller:"+r,t.register(o,i),s=t.lookup(o),e(s,"namespace.LOG_ACTIVE_GENERATION")&&Ember.Logger.info("generated -> "+o,{fullName:o}),s}}(),function(){function e(e,t,r){var n=r.shift();if(!e){if(t)return;throw new Error("Could not trigger event '"+n+"'. There are no active handlers")}for(var i=!1,o=e.length-1;o>=0;o--){var s=e[o],a=s.handler;if(a._actions&&a._actions[n]){if(a._actions[n].apply(a,r)!==!0)return;i=!0}else if(a.events&&a.events[n]){if(a.events[n].apply(a,r)!==!0)return;i=!0}}if(!i&&!t)throw new Error("Nothing handled the event '"+n+"'.")}var r=t("router"),n=Ember.get,i=Ember.set,o=Ember.defineProperty,s=Ember._MetamorphView;Ember.Router=Ember.Object.extend({location:"hash",init:function(){this.router=this.constructor.router||this.constructor.map(Ember.K),this._activeViews={},this._setupLocation()},url:Ember.computed(function(){return n(this,"location").getURL()}),startRouting:function(){this.router=this.router||this.constructor.map(Ember.K);var e=this.router,t=n(this,"location"),r=this.container,i=this;this._setupRouter(e,t),r.register("view:default",s),r.register("view:toplevel",Ember.View.extend()),t.onUpdateURL(function(e){i.handleURL(e)}),this.handleURL(t.getURL())},didTransition:function(e){var t=this.container.lookup("controller:application"),r=Ember.Router._routePath(e);"currentPath"in t||o(t,"currentPath"),i(t,"currentPath",r),"currentRouteName"in t||o(t,"currentRouteName"),i(t,"currentRouteName",e[e.length-1].name),this.notifyPropertyChange("url"),n(this,"namespace").LOG_TRANSITIONS&&Ember.Logger.log("Transitioned into '"+r+"'")},handleURL:function(e){return this._doTransition("handleURL",[e])},transitionTo:function(){return this._doTransition("transitionTo",arguments)},replaceWith:function(){return this._doTransition("replaceWith",arguments)},generate:function(){var e=this.router.generate.apply(this.router,arguments);return this.location.formatURL(e)},isActive:function(){var e=this.router;return e.isActive.apply(e,arguments)},send:function(){this.router.trigger.apply(this.router,arguments)},hasRoute:function(e){return this.router.hasRoute(e)},reset:function(){this.router.reset()},_lookupActiveView:function(e){var t=this._activeViews[e];return t&&t[0]},_connectActiveView:function(e,t){var r=this._activeViews[e];r&&r[0].off("willDestroyElement",this,r[1]);var n=function(){delete this._activeViews[e]};this._activeViews[e]=[t,n],t.one("willDestroyElement",this,n)},_setupLocation:function(){var e=n(this,"location"),t=n(this,"rootURL"),r={};"string"==typeof t&&(r.rootURL=t),"string"==typeof e&&(r.implementation=e,e=i(this,"location",Ember.Location.create(r)))},_getHandlerFunction:function(){var e={},t=this.container,r=t.lookupFactory("route:basic"),i=this;return function(o){var s="route:"+o,a=t.lookup(s);if(e[o])return a;if(e[o]=!0,!a){if("loading"===o)return{};t.register(s,r.extend()),a=t.lookup(s),n(i,"namespace.LOG_ACTIVE_GENERATION")&&Ember.Logger.info("generated -> "+s,{fullName:s})}return"application"===o&&(a.events=a.events||{},a.events.error=a.events.error||Ember.Router._defaultErrorHandler),a.routeName=o,a}},_setupRouter:function(e,t){var r,n=this;e.getHandler=this._getHandlerFunction();var i=function(){t.setURL(r)};if(e.updateURL=function(e){r=e,Ember.run.once(i)},t.replaceURL){var o=function(){t.replaceURL(r)};e.replaceURL=function(e){r=e,Ember.run.once(o)}}e.didTransition=function(e){n.didTransition(e)}},_doTransition:function(e,t){t=[].slice.call(t),t[0]=t[0]||"/";var r,n=t[0],i=this;r="/"===n.charAt(0)?n:this.router.hasRoute(n)?n:t[0]=n+".index";var o=this.router[e].apply(this.router,t);return this.router.activeTransition&&this._scheduleLoadingStateEntry(),o.then(function(e){i._transitionCompleted(e)},function(){}),o},_scheduleLoadingStateEntry:function(){this._loadingStateActive||(this._shouldEnterLoadingState=!0,Ember.run.scheduleOnce("routerTransitions",this,this._enterLoadingState))},_enterLoadingState:function(){if(!this._loadingStateActive&&this._shouldEnterLoadingState){var e=this.router.getHandler("loading");e&&(e.enter&&e.enter(),e.setup&&e.setup(),this._loadingStateActive=!0)}},_exitLoadingState:function(){if(this._shouldEnterLoadingState=!1,this._loadingStateActive){var e=this.router.getHandler("loading");e&&e.exit&&e.exit(),this._loadingStateActive=!1}},_transitionCompleted:function(){this.notifyPropertyChange("url"),this._exitLoadingState()}}),Ember.Router.reopenClass({router:null,map:function(t){var i=this.router;i||(i=new r,i.callbacks=[],i.triggerEvent=e,this.reopenClass({router:i})),n(this,"namespace.LOG_TRANSITIONS_INTERNAL")&&(i.log=Ember.Logger.debug);var o=Ember.RouterDSL.map(function(){this.resource("application",{path:"/"},function(){for(var e=0;e<i.callbacks.length;e++)i.callbacks[e].call(this);t.call(this)})});return i.callbacks.push(t),i.map(o.generate()),i},_defaultErrorHandler:function(e){Ember.Logger.error("Error while loading route:",e),setTimeout(function(){throw e})},_routePath:function(e){for(var t=[],r=1,n=e.length;n>r;r++){var i=e[r].name,o=i.split(".");t.push(o[o.length-1])}return t.join(".")}})}(),function(){function e(e){var t=e.router.router.targetHandlerInfos;if(t)for(var r,n,i=0,o=t.length;o>i;i++){if(n=t[i].handler,n===e)return r;r=n}}function t(r){var n,i=e(r);if(i)return(n=i.lastRenderedTemplate)?n:t(i)}function r(e,r,n,i){i=i||{},i.into=i.into?i.into.replace(/\//g,"."):t(e),i.outlet=i.outlet||"main",i.name=r,i.template=n,i.LOG_VIEW_LOOKUPS=a(e.router,"namespace.LOG_VIEW_LOOKUPS");var o,s=i.controller;return s=i.controller?i.controller:(o=e.container.lookup("controller:"+r))?o:e.controllerName||e.routeName,"string"==typeof s&&(s=e.container.lookup("controller:"+s)),i.controller=s,i}function n(e,t,r){if(e)r.LOG_VIEW_LOOKUPS&&Ember.Logger.info("Rendering "+r.name+" with "+e,{fullName:"view:"+r.name});else{var n=r.into?"view:default":"view:toplevel";e=t.lookup(n),r.LOG_VIEW_LOOKUPS&&Ember.Logger.info("Rendering "+r.name+" with default view "+e,{fullName:"view:"+r.name})}return a(e,"templateName")||(u(e,"template",r.template),u(e,"_debugTemplateName",r.name)),u(e,"renderedName",r.name),u(e,"controller",r.controller),e}function i(e,t,r){if(r.into){var n=e.router._lookupActiveView(r.into),i=s(n,r.outlet);e.teardownOutletViews||(e.teardownOutletViews=[]),h(e.teardownOutletViews,0,0,[i]),n.connectOutlet(r.outlet,t)}else{var u=a(e,"router.namespace.rootElement");e.teardownTopLevelView&&e.teardownTopLevelView(),e.router._connectActiveView(r.name,t),e.teardownTopLevelView=o(t),t.appendTo(u)}}function o(e){return function(){e.destroy()}}function s(e,t){return function(){e.disconnectOutlet(t)}}var a=Ember.get,u=Ember.set,c=Ember.getProperties,l=(Ember.String.classify,Ember.String.fmt,Ember.EnumerableUtils.forEach),h=Ember.EnumerableUtils.replace;Ember.Route=Ember.Object.extend(Ember.ActionHandler,{exit:function(){this.deactivate(),this.teardownViews()},enter:function(){this.activate()},actions:null,events:null,mergedProperties:["events"],deactivate:Ember.K,activate:Ember.K,transitionTo:function(){var e=this.router;return e.transitionTo.apply(e,arguments)},replaceWith:function(){return this.router,this.router.replaceWith.apply(this.router,arguments)},send:function(){return this.router.send.apply(this.router,arguments)},setup:function(e){var t=this.controllerName||this.routeName,r=this.controllerFor(t,!0);r||(r=this.generateController(t,e)),this.controller=r,this.setupControllers?this.setupControllers(r,e):this.setupController(r,e),this.renderTemplates?this.renderTemplates(e):this.renderTemplate(r,e)},redirect:Ember.K,beforeModel:Ember.K,afterModel:function(e,t){this.redirect(e,t)},contextDidChange:function(){this.currentModel=this.context},model:function(e){var t,r,n,i;for(var o in e)(t=o.match(/^(.*)_id$/))&&(r=t[1],i=e[o]),n=!0;if(!r&&n)return e;if(r)return this.findModel(r,i)},findModel:function(){var e=a(this,"store");return e.find.apply(e,arguments)},store:Ember.computed(function(){var e=this.container;return this.routeName,a(this,"router.namespace"),{find:function(t,r){var n=e.lookupFactory("model:"+t);return n.find(r)}}}),serialize:function(e,t){if(!(t.length<1)){var r=t[0],n={};return/_id$/.test(r)&&1===t.length?n[r]=a(e,"id"):n=c(e,t),n}},setupController:function(e,t){e&&void 0!==t&&u(e,"model",t)},controllerFor:function(e){var t,r=this.container,n=r.lookup("route:"+e);return n&&n.controllerName&&(e=n.controllerName),t=r.lookup("controller:"+e)},generateController:function(e,t){var r=this.container;return t=t||this.modelFor(e),Ember.generateController(r,e,t)},modelFor:function(e){var t=this.container.lookup("route:"+e),r=this.router.router.activeTransition;if(r){var n=t&&t.routeName||e;if(r.resolvedModels.hasOwnProperty(n))return r.resolvedModels[n]}return t&&t.currentModel},renderTemplate:function(){this.render()},render:function(e,t){"object"!=typeof e||t||(t=e,e=this.routeName),t=t||{},e=e?e.replace(/\//g,"."):this.routeName;var o=t.view||this.viewName||e,s=this.templateName||e,u=this.container,c=u.lookup("view:"+o),l=c?c.get("template"):null;return l||(l=u.lookup("template:"+s)),c||l?(t=r(this,e,l,t),c=n(c,u,t),"main"===t.outlet&&(this.lastRenderedTemplate=e),i(this,c,t),void 0):(a(this.router,"namespace.LOG_VIEW_LOOKUPS")&&Ember.Logger.info('Could not find "'+e+'" template or view. Nothing will be rendered',{fullName:"template:"+e}),void 0)},disconnectOutlet:function(e){e=e||{},e.parentView=e.parentView?e.parentView.replace(/\//g,"."):t(this),e.outlet=e.outlet||"main";var r=this.router._lookupActiveView(e.parentView);r.disconnectOutlet(e.outlet)},willDestroy:function(){this.teardownViews()},teardownViews:function(){this.teardownTopLevelView&&this.teardownTopLevelView();var e=this.teardownOutletViews||[];l(e,function(e){e()}),delete this.teardownTopLevelView,delete this.teardownOutletViews,delete this.lastRenderedTemplate}})}(),function(){Ember.onLoad("Ember.Handlebars",function(){function e(e,r,i){return n.call(t(e,r,i),function(t,n){return null===t?r[n]:o(e,t,i)})}function t(e,t,o){function s(e,t){return"controller"===t?t:Ember.ControllerMixin.detect(e)?s(i(e,"model"),t?t+".model":"model"):t}var a=r(e,t,o),u=o.types;return n.call(a,function(e,r){return"ID"===u[r]?s(e,t[r]):null})}var r=Ember.Handlebars.resolveParams,n=Ember.ArrayPolyfills.map,i=Ember.get,o=Ember.Handlebars.get;Ember.Router.resolveParams=e,Ember.Router.resolvePaths=t})}(),function(){var e=Ember.get;Ember.set,Ember.String.fmt,Ember.onLoad("Ember.Handlebars",function(){function t(e,t){return e.hasRoute(t)||(t+=".index"),t}function r(e){var t=e.options.types,r=e.options.data;return i(e.context,e.params,{types:t,data:r})}var n=Ember.Router.resolveParams,i=Ember.Router.resolvePaths,o=Ember.ViewUtils.isSimpleClick,s=Ember.LinkView=Ember.View.extend({tagName:"a",currentWhen:null,title:null,rel:null,activeClass:"active",loadingClass:"loading",disabledClass:"disabled",_isDisabled:!1,replace:!1,attributeBindings:["href","title","rel"],classNameBindings:["active","loading","disabled"],eventName:"click",init:function(){this._super.apply(this,arguments);var t=e(this,"eventName");this.on(t,this,this._invoke);var n,i,o=this.parameters,s=o.context,a=r(o),u=a.length;for(i=0;u>i;i++)if(n=a[i],null!==n){var c=Ember.Handlebars.normalizePath(s,n,o.options.data);this.registerObserver(c.root,c.path,this,this._paramsChanged)}},_paramsChanged:function(){this.notifyPropertyChange("resolvedParams")},concreteView:Ember.computed(function(){return e(this,"parentView")}).property("parentView"),disabled:Ember.computed(function(t,r){return void 0!==r&&this.set("_isDisabled",r),r?e(this,"disabledClass"):!1}),active:Ember.computed(function(){if(e(this,"loading"))return!1;var t=e(this,"router"),r=e(this,"routeArgs"),n=r.slice(1),i=e(this,"resolvedParams"),o=this.currentWhen||i[0],s=o+".index",a=t.isActive.apply(t,[o].concat(n))||t.isActive.apply(t,[s].concat(n));return a?e(this,"activeClass"):void 0}).property("resolvedParams","routeArgs","router.url"),loading:Ember.computed(function(){return e(this,"routeArgs")?void 0:e(this,"loadingClass")}).property("routeArgs"),router:Ember.computed(function(){return e(this,"controller").container.lookup("router:main")}),_invoke:function(t){if(!o(t))return!0;if(t.preventDefault(),this.bubbles===!1&&t.stopPropagation(),e(this,"_isDisabled"))return!1;if(e(this,"loading"))return Ember.Logger.warn("This link-to is in an inactive loading state because at least one of its parameters presently has a null/undefined value, or the provided route name is invalid."),!1;var r=e(this,"router"),n=e(this,"routeArgs");e(this,"replace")?r.replaceWith.apply(r,n):r.transitionTo.apply(r,n)},resolvedParams:Ember.computed(function(){var e=this.parameters,t=e.options,r=t.types,i=t.data;return n(e.context,e.params,{types:r,data:i})}).property(),routeArgs:Ember.computed(function(){var r=e(this,"resolvedParams").slice(0),n=e(this,"router"),i=r[0];if(i){i=t(n,i),r[0]=i;for(var o=1,s=r.length;s>o;++o){var a=r[o];if(null===a||"undefined"==typeof a)return}return r}}).property("resolvedParams"),href:Ember.computed(function(){if("a"!==e(this,"tagName"))return!1;var t=e(this,"router"),r=e(this,"routeArgs");return r?t.generate.apply(t,r):e(this,"loadingHref")}).property("routeArgs"),loadingHref:"#"});s.toString=function(){return"LinkView"},Ember.Handlebars.registerHelper("link-to",function(){var e=[].slice.call(arguments,-1)[0],t=[].slice.call(arguments,0,-1),r=e.hash;
return r.disabledBinding=r.disabledWhen,r.parameters={context:this,options:e,params:t},Ember.Handlebars.helpers.view.call(this,s,e)}),Ember.Handlebars.registerHelper("linkTo",Ember.Handlebars.helpers["link-to"])})}(),function(){Ember.get,Ember.set,Ember.onLoad("Ember.Handlebars",function(e){e.OutletView=Ember.ContainerView.extend(Ember._Metamorph),e.registerHelper("outlet",function(t,r){var n,i;for(t&&t.data&&t.data.isRenderData&&(r=t,t="main"),n=r.data.view;!n.get("template.isTop");)n=n.get("_parentView");return i=r.hash.viewClass||e.OutletView,r.data.view.set("outletSource",n),r.hash.currentViewBinding="_view.outletSource._outlets."+t,e.helpers.view.call(this,i,r)})})}(),function(){Ember.get,Ember.set,Ember.onLoad("Ember.Handlebars",function(){Ember.Handlebars.registerHelper("render",function(e,t,r){var n,i,o,s,a,u,c=3===arguments.length;2===arguments.length&&(r=t,t=void 0),"string"==typeof t&&(a=Ember.Handlebars.get(r.contexts[1],t,r),u={singleton:!1}),e=e.replace(/\//g,"."),n=r.data.keywords.controller.container,i=n.lookup("router:main"),s=n.lookup("view:"+e)||n.lookup("view:default");var l=r.hash.controller;o=l?n.lookup("controller:"+l,u):n.lookup("controller:"+e,u)||Ember.generateController(n,e,a),o&&c&&o.set("model",a);var h=r.contexts[1];h&&s.registerObserver(h,t,function(){o.set("model",Ember.Handlebars.get(h,t,r))}),o.set("target",r.data.keywords.controller),r.hash.viewName=Ember.String.camelize(e),r.hash.template=n.lookup("template:"+e),r.hash.controller=o,i&&!a&&i._connectActiveView(e,s),Ember.Handlebars.helpers.view.call(this,s,r)})})}(),function(){Ember.onLoad("Ember.Handlebars",function(){function e(e,r){var n=[];r&&n.push(r);var i=e.options.types.slice(1),o=e.options.data;return n.concat(t(e.context,e.params,{types:i,data:o}))}var t=Ember.Router.resolveParams,r=Ember.ViewUtils.isSimpleClick,n=Ember.Handlebars,i=n.get,o=n.SafeString,s=Ember.ArrayPolyfills.forEach,a=(Ember.get,Array.prototype.slice),u=n.ActionHelper={registeredActions:{}},c=["alt","shift","meta","ctrl"],l=function(e,t){if("undefined"==typeof t)return r(e);var n=!0;return s.call(c,function(r){e[r+"Key"]&&-1===t.indexOf(r)&&(n=!1)}),n};u.registerAction=function(t,r,n){var o=(++Ember.uuid).toString();return u.registeredActions[o]={eventName:r.eventName,handler:function(o){if(!l(o,n))return!0;o.preventDefault(),r.bubbles===!1&&o.stopPropagation();var s=r.target;s=s.target?i(s.root,s.target,s.options):s.root,Ember.run(function(){s.send?s.send.apply(s,e(r.parameters,t)):s[t].apply(s,e(r.parameters))})}},r.view.on("willClearRender",function(){delete u.registeredActions[o]}),o},n.registerHelper("action",function(e){var t,r=arguments[arguments.length-1],n=a.call(arguments,1,-1),i=r.hash,s={eventName:i.on||"click"};s.parameters={context:this,options:r,params:n},s.view=r.data.view;var c,l;i.target?(c=this,l=i.target):(t=r.data.keywords.controller)&&(c=t),s.target={root:c,target:l,options:r},s.bubbles=i.bubbles;var h=u.registerAction(e,s,i.allowedKeys);return new o('data-ember-action="'+h+'"')})})}(),function(){if(Ember.ENV.EXPERIMENTAL_CONTROL_HELPER){var e=Ember.get,t=Ember.set;Ember.Handlebars.registerHelper("control",function(r,n,i){function o(){var e=Ember.Handlebars.get(this,n,i);t(p,"model",e),f.rerender()}2===arguments.length&&(i=n,n=void 0);var s;n&&(s=Ember.Handlebars.get(this,n,i));var a,u,c=i.data.keywords.controller,l=(i.data.keywords.view,e(c,"_childContainers")),h=i.hash.controlID;l.hasOwnProperty(h)?u=l[h]:(a=e(c,"container"),u=a.child(),l[h]=u);var m=r.replace(/\//g,"."),f=u.lookup("view:"+m)||u.lookup("view:default"),p=u.lookup("controller:"+m),d=u.lookup("template:"+r);t(p,"target",c),t(p,"model",s),i.hash.template=d,i.hash.controller=p,n&&(Ember.addObserver(this,n,o),f.one("willDestroyElement",this,function(){Ember.removeObserver(this,n,o)})),Ember.Handlebars.helpers.view.call(this,f,i)})}}(),function(){var e=Ember.get;Ember.set,Ember.ControllerMixin.reopen({transitionToRoute:function(){var t=e(this,"target"),r=t.transitionToRoute||t.transitionTo;return r.apply(t,arguments)},transitionTo:function(){return this.transitionToRoute.apply(this,arguments)},replaceRoute:function(){var t=e(this,"target"),r=t.replaceRoute||t.replaceWith;return r.apply(t,arguments)},replaceWith:function(){return this.replaceRoute.apply(this,arguments)}})}(),function(){var e=Ember.get,t=Ember.set;Ember.View.reopen({init:function(){t(this,"_outlets",{}),this._super()},connectOutlet:function(r,n){if(this._pendingDisconnections&&delete this._pendingDisconnections[r],this._hasEquivalentView(r,n))return n.destroy(),void 0;var i=e(this,"_outlets"),o=e(this,"container"),s=o&&o.lookup("router:main"),a=e(n,"renderedName");t(i,r,n),s&&a&&s._connectActiveView(a,n)},_hasEquivalentView:function(t,r){var n=e(this,"_outlets."+t);return n&&n.constructor===r.constructor&&n.get("template")===r.get("template")&&n.get("context")===r.get("context")},disconnectOutlet:function(e){this._pendingDisconnections||(this._pendingDisconnections={}),this._pendingDisconnections[e]=!0,Ember.run.once(this,"_finishDisconnections")},_finishDisconnections:function(){var r=e(this,"_outlets"),n=this._pendingDisconnections;this._pendingDisconnections=null;for(var i in n)t(r,i,null)}})}(),function(){var e=Ember.run.queues,t=Ember.ArrayPolyfills.indexOf;e.splice(t.call(e,"actions")+1,0,"routerTransitions")}(),function(){Ember.get,Ember.set,Ember.Location={create:function(e){var t=e&&e.implementation,r=this.implementations[t];return r.create.apply(r,arguments)},registerImplementation:function(e,t){this.implementations[e]=t},implementations:{}}}(),function(){var e=Ember.get,t=Ember.set;Ember.NoneLocation=Ember.Object.extend({path:"",getURL:function(){return e(this,"path")},setURL:function(e){t(this,"path",e)},onUpdateURL:function(e){this.updateCallback=e},handleURL:function(e){t(this,"path",e),this.updateCallback(e)},formatURL:function(e){return e}}),Ember.Location.registerImplementation("none",Ember.NoneLocation)}(),function(){var e=Ember.get,t=Ember.set;Ember.HashLocation=Ember.Object.extend({init:function(){t(this,"location",e(this,"location")||window.location)},getURL:function(){return e(this,"location").hash.substr(1)},setURL:function(r){e(this,"location").hash=r,t(this,"lastSetURL",r)},replaceURL:function(t){e(this,"location").replace("#"+t)},onUpdateURL:function(r){var n=this,i=Ember.guidFor(this);Ember.$(window).on("hashchange.ember-location-"+i,function(){Ember.run(function(){var i=location.hash.substr(1);e(n,"lastSetURL")!==i&&(t(n,"lastSetURL",null),r(i))})})},formatURL:function(e){return"#"+e},willDestroy:function(){var e=Ember.guidFor(this);Ember.$(window).off("hashchange.ember-location-"+e)}}),Ember.Location.registerImplementation("hash",Ember.HashLocation)}(),function(){var e=Ember.get,t=Ember.set,r=!1,n=window.history&&"state"in window.history;Ember.HistoryLocation=Ember.Object.extend({init:function(){t(this,"location",e(this,"location")||window.location),this.initState()},initState:function(){t(this,"history",e(this,"history")||window.history),this.replaceState(this.formatURL(this.getURL()))},rootURL:"/",getURL:function(){var t=e(this,"rootURL"),r=e(this,"location").pathname;return t=t.replace(/\/$/,""),r=r.replace(t,"")},setURL:function(e){var t=this.getState();e=this.formatURL(e),t&&t.path!==e&&this.pushState(e)},replaceURL:function(e){var t=this.getState();e=this.formatURL(e),t&&t.path!==e&&this.replaceState(e)},getState:function(){return n?e(this,"history").state:this._historyState},pushState:function(t){var r={path:t};e(this,"history").pushState(r,null,t),n||(this._historyState=r),this._previousURL=this.getURL()},replaceState:function(t){var r={path:t};e(this,"history").replaceState(r,null,t),n||(this._historyState=r),this._previousURL=this.getURL()},onUpdateURL:function(e){var t=Ember.guidFor(this),n=this;Ember.$(window).on("popstate.ember-location-"+t,function(){(r||(r=!0,n.getURL()!==n._previousURL))&&e(n.getURL())})},formatURL:function(t){var r=e(this,"rootURL");return""!==t&&(r=r.replace(/\/$/,"")),r+t},willDestroy:function(){var e=Ember.guidFor(this);Ember.$(window).off("popstate.ember-location-"+e)}}),Ember.Location.registerImplementation("history",Ember.HistoryLocation)}(),function(){function e(t,r,n,i){var o,s=t.name,a=t.incoming,u=t.incomingNames,c=u.length;if(n||(n={}),i||(i=[]),!n.hasOwnProperty(s)){for(i.push(s),n[s]=!0,o=0;c>o;o++)e(a[u[o]],r,n,i);r(t,i),i.pop()}}function t(){this.names=[],this.vertices={}}t.prototype.add=function(e){if(e){if(this.vertices.hasOwnProperty(e))return this.vertices[e];var t={name:e,incoming:{},incomingNames:[],hasOutgoing:!1,value:null};return this.vertices[e]=t,this.names.push(e),t}},t.prototype.map=function(e,t){this.add(e).value=t},t.prototype.addEdge=function(t,r){function n(e,t){if(e.name===r)throw new Error("cycle detected: "+r+" <- "+t.join(" <- "))}if(t&&r&&t!==r){var i=this.add(t),o=this.add(r);o.incoming.hasOwnProperty(t)||(e(i,n),i.hasOutgoing=!0,o.incoming[t]=i,o.incomingNames.push(t))}},t.prototype.topsort=function(t){var r,n,i={},o=this.vertices,s=this.names,a=s.length;for(r=0;a>r;r++)n=o[s[r]],n.hasOutgoing||e(n,t,i)},t.prototype.addEdges=function(e,t,r,n){var i;if(this.map(e,t),r)if("string"==typeof r)this.addEdge(e,r);else for(i=0;i<r.length;i++)this.addEdge(e,r[i]);if(n)if("string"==typeof n)this.addEdge(n,e);else for(i=0;i<n.length;i++)this.addEdge(n[i],e)},Ember.DAG=t}(),function(){var e=Ember.get,t=Ember.String.classify,r=Ember.String.capitalize,n=Ember.String.decamelize;Ember.DefaultResolver=Ember.Object.extend({namespace:null,normalize:function(e){var t=e.split(":",2),r=t[0],n=t[1];if("template"!==r){var i=n;return i.indexOf(".")>-1&&(i=i.replace(/\.(.)/g,function(e){return e.charAt(1).toUpperCase()})),n.indexOf("_")>-1&&(i=i.replace(/_(.)/g,function(e){return e.charAt(1).toUpperCase()})),r+":"+i}return e},resolve:function(e){var t=this.parseName(e),r=this[t.resolveMethodName];if(!t.name||!t.type)throw new TypeError("Invalid fullName: `"+e+"`, must of of the form `type:name` ");if(r){var n=r.call(this,t);if(n)return n}return this.resolveOther(t)},parseName:function(n){var i=n.split(":"),o=i[0],s=i[1],a=s,u=e(this,"namespace"),c=u;if("template"!==o&&-1!==a.indexOf("/")){var l=a.split("/");a=l[l.length-1];var h=r(l.slice(0,-1).join("."));c=Ember.Namespace.byName(h)}return{fullName:n,type:o,fullNameWithoutType:s,name:a,root:c,resolveMethodName:"resolve"+t(o)}},resolveTemplate:function(e){var t=e.fullNameWithoutType.replace(/\./g,"/");return Ember.TEMPLATES[t]?Ember.TEMPLATES[t]:(t=n(t),Ember.TEMPLATES[t]?Ember.TEMPLATES[t]:void 0)},useRouterNaming:function(e){e.name=e.name.replace(/\./g,"_"),"basic"===e.name&&(e.name="")},resolveController:function(e){return this.useRouterNaming(e),this.resolveOther(e)},resolveRoute:function(e){return this.useRouterNaming(e),this.resolveOther(e)},resolveView:function(e){return this.useRouterNaming(e),this.resolveOther(e)},resolveModel:function(r){var n=t(r.name),i=e(r.root,n);return i?i:void 0},resolveOther:function(r){var n=t(r.name)+t(r.type),i=e(r.root,n);return i?i:void 0},lookupDescription:function(e){var r=this.parseName(e);if("template"===r.type)return"template at "+r.fullNameWithoutType.replace(/\./g,"/");var n=r.root+"."+t(r.name);return"model"!==r.type&&(n+=t(r.type)),n},makeToString:function(e){return e.toString()}})}(),function(){function e(e){this._container=e}function t(e){function t(e){return n.resolve(e)}e.get("resolver");var r=e.get("resolver")||e.get("Resolver")||Ember.DefaultResolver,n=r.create({namespace:e});return t.describe=function(e){return n.lookupDescription(e)},t.makeToString=function(e,t){return n.makeToString(e,t)},t.normalize=function(e){return n.normalize?n.normalize(e):e},t}var r=Ember.get,n=Ember.set;e.deprecate=function(e){return function(){var t=this._container;return t[e].apply(t,arguments)}},e.prototype={_container:null,lookup:e.deprecate("lookup"),resolve:e.deprecate("resolve"),register:e.deprecate("register")};var i=Ember.Application=Ember.Namespace.extend(Ember.DeferredMixin,{rootElement:"body",eventDispatcher:null,customEvents:null,_readinessDeferrals:1,init:function(){this.$||(this.$=Ember.$),this.__container__=this.buildContainer(),this.Router=this.Router||this.defaultRouter(),this.Router&&(this.Router.namespace=this),this._super(),this.scheduleInitialize(),Ember.LOG_VERSION&&(Ember.LOG_VERSION=!1)},buildContainer:function(){var e=this.__container__=i.buildContainer(this);return e},defaultRouter:function(){return void 0===this.router?Ember.Router.extend():void 0},scheduleInitialize:function(){var e=this;!this.$||this.$.isReady?Ember.run.schedule("actions",e,"_initialize"):this.$().ready(function(){Ember.run(e,"_initialize")})},deferReadiness:function(){this._readinessDeferrals++},advanceReadiness:function(){this._readinessDeferrals--,0===this._readinessDeferrals&&Ember.run.once(this,this.didBecomeReady)},register:function(){var e=this.__container__;e.register.apply(e,arguments)},inject:function(){var e=this.__container__;e.injection.apply(e,arguments)},initialize:function(){},_initialize:function(){return this.isDestroyed?void 0:(this.register("router:main",this.Router),this.runInitializers(),Ember.runLoadHooks("application",this),this.advanceReadiness(),this)},reset:function(){function e(){var e=this.__container__.lookup("router:main");e.reset(),Ember.run(this.__container__,"destroy"),this.buildContainer(),Ember.run.schedule("actions",this,function(){this._initialize()})}this._readinessDeferrals=1,Ember.run.join(this,e)},runInitializers:function(){var e,t,n=r(this.constructor,"initializers"),i=this.__container__,o=new Ember.DAG,s=this;for(e=0;e<n.length;e++)t=n[e],o.addEdges(t.name,t.initialize,t.before,t.after);o.topsort(function(e){var t=e.value;t(i,s)})},didBecomeReady:function(){this.setupEventDispatcher(),this.ready(),this.startRouting(),Ember.testing||(Ember.Namespace.processAll(),Ember.BOOTED=!0),this.resolve(this)},setupEventDispatcher:function(){var e=r(this,"customEvents"),t=r(this,"rootElement"),i=this.__container__.lookup("event_dispatcher:main");n(this,"eventDispatcher",i),i.setup(e,t)},startRouting:function(){var e=this.__container__.lookup("router:main");e&&e.startRouting()},handleURL:function(e){var t=this.__container__.lookup("router:main");t.handleURL(e)},ready:Ember.K,resolver:null,Resolver:null,willDestroy:function(){Ember.BOOTED=!1,this.__container__.destroy()},initializer:function(e){this.constructor.initializer(e)}});Ember.Application.reopenClass({concatenatedProperties:["initializers"],initializers:Ember.A(),initializer:function(e){var t=r(this,"initializers");t.push(e)},buildContainer:function(r){var n=new Ember.Container;return Ember.Container.defaultContainer=new e(n),n.set=Ember.set,n.resolver=t(r),n.normalize=n.resolver.normalize,n.describe=n.resolver.describe,n.makeToString=n.resolver.makeToString,n.optionsForType("component",{singleton:!1}),n.optionsForType("view",{singleton:!1}),n.optionsForType("template",{instantiate:!1}),n.register("application:main",r,{instantiate:!1}),n.register("controller:basic",Ember.Controller,{instantiate:!1}),n.register("controller:object",Ember.ObjectController,{instantiate:!1}),n.register("controller:array",Ember.ArrayController,{instantiate:!1}),n.register("route:basic",Ember.Route,{instantiate:!1}),n.register("event_dispatcher:main",Ember.EventDispatcher),n.injection("router:main","namespace","application:main"),n.injection("controller","target","router:main"),n.injection("controller","namespace","application:main"),n.injection("route","router","router:main"),n}}),Ember.runLoadHooks("Ember.Application",Ember.Application)}(),function(){function e(e,t,r){var n,i,o;for(i=0,o=r.length;o>i;i++)n=r[i],-1===n.indexOf(":")&&(n="controller:"+n),!t.has(n)}var t=Ember.get;Ember.set,Ember.ControllerMixin.reopen({concatenatedProperties:["needs"],needs:[],init:function(){var r=t(this,"needs"),n=t(r,"length");n>0&&(e(this,this.container,r),t(this,"controllers")),this._super.apply(this,arguments)},controllerFor:function(e){return Ember.controllerFor(t(this,"container"),e)},controllers:Ember.computed(function(){var e=this;return{needs:t(e,"needs"),container:t(e,"container"),unknownProperty:function(t){var r,n,i,o=this.needs;for(n=0,i=o.length;i>n;n++)if(r=o[n],r===t)return this.container.lookup("controller:"+t);var s=Ember.inspect(e)+"#needs does not include `"+t+"`. To access the "+t+" controller from "+Ember.inspect(e)+", "+Ember.inspect(e)+" should have a `needs` property that is an array of the controllers it has access to.";throw new ReferenceError(s)}}}).readOnly()})}(),function(){Ember.DataAdapter=Ember.Object.extend({init:function(){this._super(),this.releaseMethods=Ember.A()},container:null,attributeLimit:3,releaseMethods:Ember.A(),getFilters:function(){return Ember.A()},watchModelTypes:function(e,t){var r,n=this.getModelTypes(),i=this,o=Ember.A();r=n.map(function(e){var r=i.wrapModelType(e);return o.push(i.observeModelType(e,t)),r}),e(r);var s=function(){o.forEach(function(e){e()}),i.releaseMethods.removeObject(s)};return this.releaseMethods.pushObject(s),s},watchRecords:function(e,t,r,n){var i,o=this,s=Ember.A(),a=this.getRecords(e),u=function(e){r([e])},c=a.map(function(e){return s.push(o.observeRecord(e,u)),o.wrapRecord(e)}),l=function(e,r,i,a){for(var c=r;r+a>c;c++){var l=e.objectAt(c),h=o.wrapRecord(l);s.push(o.observeRecord(l,u)),t([h])}i&&n(r,i)},h={didChange:l,willChange:Ember.K};return a.addArrayObserver(o,h),i=function(){s.forEach(function(e){e()}),a.removeArrayObserver(o,h),o.releaseMethods.removeObject(i)},t(c),this.releaseMethods.pushObject(i),i},willDestroy:function(){this._super(),this.releaseMethods.forEach(function(e){e()})},detect:function(){return!1},columnsForType:function(){return Ember.A()},observeModelType:function(e,t){var r=this,n=this.getRecords(e),i=function(){t([r.wrapModelType(e)])},o={didChange:function(){Ember.run.scheduleOnce("actions",this,i)},willChange:Ember.K};n.addArrayObserver(this,o);var s=function(){n.removeArrayObserver(r,o)};return s},wrapModelType:function(e){var t,r=this.getRecords(e);return t={name:e.toString(),count:Ember.get(r,"length"),columns:this.columnsForType(e),object:e}},getModelTypes:function(){var e=Ember.A(Ember.Namespace.NAMESPACES),t=Ember.A(),r=this;return e.forEach(function(e){for(var n in e)if(e.hasOwnProperty(n)){var i=e[n];r.detect(i)&&t.push(i)}}),t},getRecords:function(){return Ember.A()},wrapRecord:function(e){var t={object:e};return t.columnValues=this.getRecordColumnValues(e),t.searchKeywords=this.getRecordKeywords(e),t.filterValues=this.getRecordFilterValues(e),t.color=this.getRecordColor(e),t},getRecordColumnValues:function(){return{}},getRecordKeywords:function(){return Ember.A()},getRecordFilterValues:function(){return{}},getRecordColor:function(){return null},observeRecord:function(){return function(){}}})}()}(),"undefined"==typeof location||"localhost"!==location.hostname&&"127.0.0.1"!==location.hostname||Ember.Logger.warn("You are running a production build of Ember on localhost and won't receive detailed error messages. If you want full error messages please use the non-minified build provided on the Ember website.");;(function(global) {

var define, requireModule;

(function() {
  var registry = {}, seen = {};

  define = function(name, deps, callback) {
    registry[name] = { deps: deps, callback: callback };
  };

  requireModule = function(name) {
    if (seen.hasOwnProperty(name)) { return seen[name]; }
    seen[name] = {};

    if (!registry[name]) {
      throw new Error("Could not find module " + name);
    }

    var mod = registry[name],
        deps = mod.deps,
        callback = mod.callback,
        reified = [],
        exports;

    for (var i=0, l=deps.length; i<l; i++) {
      if (deps[i] === 'exports') {
        reified.push(exports = {});
      } else {
        reified.push(requireModule(resolve(deps[i])));
      }
    }

    var value = callback.apply(this, reified);
    return seen[name] = exports || value;

    function resolve(child) {
      if (child.charAt(0) !== '.') { return child; }
      var parts = child.split("/");
      var parentBase = name.split("/").slice(0, -1);

      for (var i=0, l=parts.length; i<l; i++) {
        var part = parts[i];

        if (part === '..') { parentBase.pop(); }
        else if (part === '.') { continue; }
        else { parentBase.push(part); }
      }

      return parentBase.join("/");
    }
  };

  requireModule.registry = registry;
})();

define("ember-simple-auth", 
  ["./ember-simple-auth/core","./ember-simple-auth/session","./ember-simple-auth/authenticators","./ember-simple-auth/authorizers","./ember-simple-auth/stores","./ember-simple-auth/mixins/application_route_mixin","./ember-simple-auth/mixins/authenticated_route_mixin","./ember-simple-auth/mixins/authentication_controller_mixin","./ember-simple-auth/mixins/login_controller_mixin","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __dependency7__, __dependency8__, __dependency9__, __exports__) {
    "use strict";
    var setup = __dependency1__.setup;
    var Configuration = __dependency1__.Configuration;
    var Session = __dependency2__.Session;
    var Authenticators = __dependency3__.Authenticators;
    var Authorizers = __dependency4__.Authorizers;
    var Stores = __dependency5__.Stores;
    var ApplicationRouteMixin = __dependency6__.ApplicationRouteMixin;
    var AuthenticatedRouteMixin = __dependency7__.AuthenticatedRouteMixin;
    var AuthenticationControllerMixin = __dependency8__.AuthenticationControllerMixin;
    var LoginControllerMixin = __dependency9__.LoginControllerMixin;

    /**
      Ember.SimpleAuth's main module.

      @module Ember.SimpleAuth
    */

    __exports__.setup = setup;
    __exports__.Configuration = Configuration;
    __exports__.Session = Session;
    __exports__.Authenticators = Authenticators;
    __exports__.Authorizers = Authorizers;
    __exports__.Stores = Stores;
    __exports__.ApplicationRouteMixin = ApplicationRouteMixin;
    __exports__.AuthenticatedRouteMixin = AuthenticatedRouteMixin;
    __exports__.AuthenticationControllerMixin = AuthenticationControllerMixin;
    __exports__.LoginControllerMixin = LoginControllerMixin;
  });
define("ember-simple-auth/authenticators", 
  ["./authenticators/base","./authenticators/oauth2","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var global = (typeof window !== 'undefined') ? window : {},
        Ember = global.Ember;

    var Base = __dependency1__.Base;
    var OAuth2 = __dependency2__.OAuth2;

    var Authenticators = Ember.Namespace.create({
      Base:   Base,
      OAuth2: OAuth2
    });

    __exports__.Authenticators = Authenticators;
  });
define("ember-simple-auth/authenticators/base", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var global = (typeof window !== 'undefined') ? window : {},
        Ember = global.Ember;

    /**
      The base for all authenticators. __This serves as a starting point for
      implementing custom authenticators and must not be used directly.__

      The authenticator acquires all data that makes up the session. The actual
      mechanism used to do this might e.g. be posting a set of credentials to a
      server and in exchange retrieving an access token, initiating authentication
      against an external provider like Facebook etc. and depends on the specific
      authenticator. Any data that the authenticator receives upon successful
      authentication and resolves with grom the
      [Ember.SimpleAuth.Authenticators.Base#authenticate](#Ember-SimpleAuth-Authenticators-Base-authenticate)
      method is stored in the session and can then be used by the authorizer (see
      [Ember.SimpleAuth.Authorizers.Base](#Ember-SimpleAuth-Authorizers-Base)).

      Authenticators may trigger the `'ember-simple-auth:session-updated'` event
      when any of the session properties change. The session listens to that event
      and will handle the changes accordingly.

      __Custom authenticators have to be registered with Ember's dependency
      injection container__ so that the session can retrieve an instance, e.g.:

      ```javascript
      var CustomAuthenticator = Ember.SimpleAuth.Authenticators.Base.extend({
        ...
      });
      Ember.Application.initializer({
        name: 'authentication',
        initialize: function(container, application) {
          container.register('authenticators:custom', CustomAuthenticator);
          Ember.SimpleAuth.setup(container, application);
        }
      });
      ```

      @class Base
      @namespace Authenticators
      @extends Ember.Object
      @uses Ember.Evented
    */
    var Base = Ember.Object.extend(Ember.Evented, {
      /**
        Restores the session from a set of properties. __This method is invoked by
        the session either after the application starts up and session data was
        restored from the store__ or when properties in the store have changed due
        to external events (e.g. in another tab).

        __This method returns a promise. A resolving promise will result in the
        session being authenticated.__ Any properties the promise resolves with
        will be saved by and accessible via the session. In most cases the
        `properties` argument will simply be forwarded through the promise. A
        rejecting promise indicates that authentication failed and the session
        will remain unchanged.

        `Ember.SimpleAuth.Authenticators.Base`'s always rejects as there's no
        reasonable default implementation.

        @method restore
        @param {Object} data The data to restore the session from
        @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being authenticated
      */
      restore: function(data) {
        return new Ember.RSVP.reject();
      },

      /**
        Authenticates the session with the specified `options`. These options vary
        depending on the actual authentication mechanism the authenticator
        implements (e.g. a set of credentials or a Facebook account id etc.). __The
        session will invoke this method when an action in the appliaction triggers
        authentication__ (see
        [Ember.SimpleAuth.AuthenticationControllerMixin.actions#authenticate](#Ember-SimpleAuth-AuthenticationControllerMixin-authenticate)).

        __This method returns a promise. A resolving promise will result in the
        session being authenticated.__ Any properties the promise resolves with
        will be saved by and accessible via the session. A rejecting promise
        indicates that authentication failed and the session will remain unchanged.

        `Ember.SimpleAuth.Authenticators.Base`'s implementation always returns a
        rejecting promise and thus never authenticates the session as there's no
        reasonable default behavior (for Ember.SimpleAuth's default authenticator
        see
        [Ember.SimpleAuth.Authenticators.OAuth2](#Ember-SimpleAuth-Authenticators-OAuth2)).

        @method authenticate
        @param {Object} options The options to authenticate the session with
        @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being authenticated
      */
      authenticate: function(options) {
        return new Ember.RSVP.reject();
      },

      /**
        Invalidation callback that is invoked when the session is invalidated.
        While the session will invalidate itself and clear all session properties,
        it might be necessary for some authenticators to perform additional tasks
        (e.g. invalidating an access token on the server), which should be done in
        this method.

        __This method returns a promise. A resolving promise will result in the
        session being invalidated.__ A rejecting promise will result in the session
        invalidation being intercepted and the session being left authenticated.

        `Ember.SimpleAuth.Authenticators.Base`'s implementation always returns a
        resolving promise and thus never intercepts session invalidation.

        @method invalidate
        @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being invalidated
      */
      invalidate: function() {
        return new Ember.RSVP.resolve();
      }
    });

    __exports__.Base = Base;
  });
define("ember-simple-auth/authenticators/oauth2", 
  ["./base","../utils/is_secure_url","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var global = (typeof window !== 'undefined') ? window : {},
        Ember = global.Ember;

    var Base = __dependency1__.Base;
    var isSecureUrl = __dependency2__.isSecureUrl;

    /**
      Authenticator that conforms to OAuth 2
      ([RFC 6749](http://tools.ietf.org/html/rfc6749)), specifically the _"Resource
      Owner Password Credentials Grant Type"_.

      This authenticator supports refreshing the access token automatically and
      will trigger the `'ember-simple-auth:session-updated'` event each time the
      token was refreshed.

      @class OAuth2
      @namespace Authenticators
      @extends Authenticators.Base
    */
    var OAuth2 = Base.extend({
      /**
        The endpoint on the server the authenticator acquires the access token
        from.

        @property serverTokenEndpoint
        @type String
        @default '/token'
      */
      serverTokenEndpoint: '/token',
      /**
        Sets whether the authenticator automatically refreshes access tokens.

        @property refreshAccessTokens
        @type Boolean
        @default true
      */
      refreshAccessTokens: true,
      /**
        @property _refreshTokenTimeout
        @private
      */
      _refreshTokenTimeout: null,

      /**
        Restores the session from a set of session properties; __will return a
        resolving promise when there's a non-empty `access_token` in the `data`__
        and a rejecting promise otherwise.

        This method also schedules automatic token refreshing when there are values
        for `refresh_token` and `expires_in` in the `data` and automatic token
        refreshing is not disabled (see
        [Ember.SimpleAuth.Authenticators.OAuth2#refreshAccessTokens](#Ember-SimpleAuth-Authenticators-OAuth2-refreshAccessTokens)).

        @method restore
        @param {Object} data The data to restore the session from
        @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being authenticated
      */
      restore: function(data) {
        var _this = this;
        return new Ember.RSVP.Promise(function(resolve, reject) {
          if (!Ember.isEmpty(data.access_token)) {
            var now = (new Date()).getTime();
            if (!Ember.isEmpty(data.expires_at) && data.expires_at < now) {
              reject();
            } else {
              _this.scheduleAccessTokenRefresh(data.expires_in, data.expires_at, data.refresh_token);
              resolve(data);
            }
          } else {
            reject();
          }
        });
      },

      /**
        Authenticates the session with the specified `credentials`; the credentials
        are `POST`ed to the `serverTokenEndpoint` and if they are valid the server
        returns an access token in response (see
        http://tools.ietf.org/html/rfc6749#section-4.3). __If the credentials are
        valid and authentication succeeds, a promise that resolves with the
        server's response is returned__, otherwise a promise that rejects with the
        error is returned.

        This method also schedules automatic token refreshing when there are values
        for `refresh_token` and `expires_in` in the server response and automatic
        token refreshing is not disabled (see
        [Ember.SimpleAuth.Authenticators.OAuth2#refreshAccessTokens](#Ember-SimpleAuth-Authenticators-OAuth2-refreshAccessTokens)).

        @method authenticate
        @param {Object} credentials The credentials to authenticate the session with
        @return {Ember.RSVP.Promise} A promise that resolves when an access token is successfully acquired from the server and rejects otherwise
      */
      authenticate: function(credentials) {
        var _this = this;
        return new Ember.RSVP.Promise(function(resolve, reject) {
          var data = { grant_type: 'password', username: credentials.identification, password: credentials.password };
          _this.makeRequest(data).then(function(response) {
            Ember.run(function() {
              var expiresAt = _this.absolutizeExpirationTime(response.expires_in);
              _this.scheduleAccessTokenRefresh(response.expires_in, expiresAt, response.refresh_token);
              resolve(Ember.$.extend(response, { expires_at: expiresAt }));
            });
          }, function(xhr, status, error) {
            Ember.run(function() {
              reject(xhr.responseJSON || xhr.responseText);
            });
          });
        });
      },

      /**
        Cancels any outstanding automatic token refreshes.

        @method invalidate
        @return {Ember.RSVP.Promise} A resolving promise
      */
      invalidate: function() {
        Ember.run.cancel(this._refreshTokenTimeout);
        delete this._refreshTokenTimeout;
        return new Ember.RSVP.resolve();
      },

      /**
        Sends an `AJAX` request to the `serverTokenEndpoint`. This will always be a
        _"POST_" request with content type _"application/x-www-form-urlencoded"_ as
        specified in [RFC 6749](http://tools.ietf.org/html/rfc6749).

        This method is not meant to be used directly but serves as an extension
        point to e.g. add _"Client Credentials"_ (see
        [RFC 6749, section 2.3](http://tools.ietf.org/html/rfc6749#section-2.3)).

        @method makeRequest
        @param {Object} data The data to send with the request, e.g. username and password or the refresh token
        @return {Deferred object} A Deferred object (see [the jQuery docs](http://api.jquery.com/category/deferred-object/)) that is compatible to Ember.RSVP.Promise; will resolve if the request succeeds, reject otherwise
        @protected
      */
      makeRequest: function(data) {
        if (!isSecureUrl(this.serverTokenEndpoint)) {
          Ember.Logger.warn('Credentials are transmitted via an insecure connection - use HTTPS to keep them secure.');
        }
        return Ember.$.ajax({
          url:         this.serverTokenEndpoint,
          type:        'POST',
          data:        data,
          dataType:    'json',
          contentType: 'application/x-www-form-urlencoded'
        });
      },

      /**
        @method scheduleAccessTokenRefresh
        @private
      */
      scheduleAccessTokenRefresh: function(expiresIn, expiresAt, refreshToken) {
        var _this = this;
        if (this.refreshAccessTokens) {
          var now = (new Date()).getTime();
          if (Ember.isEmpty(expiresAt) && !Ember.isEmpty(expiresIn)) {
            expiresAt = new Date(now + (expiresIn - 5) * 1000).getTime();
          }
          if (!Ember.isEmpty(refreshToken) && !Ember.isEmpty(expiresAt) && expiresAt > now) {
            Ember.run.cancel(this._refreshTokenTimeout);
            delete this._refreshTokenTimeout;
            this._refreshTokenTimeout = Ember.run.later(this, this.refreshAccessToken, expiresIn, refreshToken, expiresAt - now);
          }
        }
      },

      /**
        @method refreshAccessToken
        @private
      */
      refreshAccessToken: function(expiresIn, refreshToken) {
        var _this = this;
        var data  = { grant_type: 'refresh_token', refresh_token: refreshToken };
        this.makeRequest(data).then(function(response) {
          Ember.run(function() {
            expiresIn     = response.expires_in || expiresIn;
            refreshToken  = response.refresh_token || refreshToken;
            var expiresAt = _this.absolutizeExpirationTime(expiresIn);
            _this.scheduleAccessTokenRefresh(expiresIn, null, refreshToken);
            _this.trigger('ember-simple-auth:session-updated', Ember.$.extend(response, { expires_in: expiresIn, expires_at: expiresAt, refresh_token: refreshToken }));
          });
        }, function(xhr, status, error) {
          Ember.Logger.warn('Access token could not be refreshed - server responded with ' + error + '.');
        });
      },

      /**
        @method absolutizeExpirationTime
        @private
      */
      absolutizeExpirationTime: function(expiresIn) {
        if (!Ember.isEmpty(expiresIn)) {
          return new Date((new Date().getTime()) + (expiresIn - 5) * 1000).getTime();
        }
      }
    });

    __exports__.OAuth2 = OAuth2;
  });
define("ember-simple-auth/authorizers", 
  ["./authorizers/base","./authorizers/oauth2","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var global = (typeof window !== 'undefined') ? window : {},
        Ember = global.Ember;

    var Base = __dependency1__.Base;
    var OAuth2 = __dependency2__.OAuth2;

    var Authorizers = Ember.Namespace.create({
      Base:   Base,
      OAuth2: OAuth2
    });

    __exports__.Authorizers = Authorizers;
  });
define("ember-simple-auth/authorizers/base", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var global = (typeof window !== 'undefined') ? window : {},
        Ember = global.Ember;

    /**
      The base for all authorizers. __This serves as a starting point for
      implementing custom authorizers and must not be used directly.__

      __The authorizer preprocesses all XHR requests__ (except ones to 3rd party
      origins, see [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup)) and makes
      sure they have the required data attached that allows the server to identify
      the user making the request. This data might be a specific header, data in
      the query part of the URL, cookies etc. __The authorizer has to fit the
      authenticator__ (see
      [Ember.SimpleAuth.Authenticators.Base](#Ember-SimpleAuth-Authenticators-Base))
      as it usually relies on data that the authenticator retrieves during
      authentication and that it makes available through the session.

      @class Base
      @namespace Authorizers
      @extends Ember.Object
    */
    var Base = Ember.Object.extend({
      /**
        The session the authorizer gets the data it needs to authorize requests
        from (see [Ember.SimpleAuth.Session](#Ember-SimpleAuth-Session)).

        @property session
        @readOnly
        @type Ember.SimpleAuth.Session
        @default the session instance that is created during the Ember.js application's intialization
      */
      session: null,

      /**
        Authorizes an XHR request by adding some sort of secret information that
        allows the server to identify the user making the request (e.g. a token in
        the `Authorization` header or some other secret in the query string etc.).

        `Ember.SimpleAuth.Authorizers.Base`'s implementation does nothing as
        there's no reasonable default behavior (for Ember.SimpleAuth's default
        authorizer see
        [Ember.SimpleAuth.Authorizers.OAuth2](#Ember-SimpleAuth-Authorizers-OAuth2)).

        @method authorize
        @param {jqXHR} jqXHR The XHR request to authorize (see http://api.jquery.com/jQuery.ajax/#jqXHR)
        @param {Object} requestOptions The options as provided to the `$.ajax` method (see http://api.jquery.com/jQuery.ajaxPrefilter/)
      */
      authorize: function(jqXHR, requestOptions) {
      }
    });

    __exports__.Base = Base;
  });
define("ember-simple-auth/authorizers/oauth2", 
  ["./base","../utils/is_secure_url","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var global = (typeof window !== 'undefined') ? window : {},
        Ember = global.Ember;

    var Base = __dependency1__.Base;
    var isSecureUrl = __dependency2__.isSecureUrl;

    /**
      Authorizer that conforms to OAuth 2
      ([RFC 6749](http://tools.ietf.org/html/rfc6749)) by sending a bearer token
      ([RFC 6749](http://tools.ietf.org/html/rfc6750)) in the request's
      `Authorization` header.

      @class OAuth2
      @namespace Authorizers
      @extends Authorizers.Base
    */
    var OAuth2 = Base.extend({
      /**
        Authorizes an XHR request by sending the `access_token` property from the
        session as a bearer token in the `Authorization` header:

        ```
        Authorization: Bearer <access_token>
        ```

        @method authorize
        @param {jqXHR} jqXHR The XHR request to authorize (see http://api.jquery.com/jQuery.ajax/#jqXHR)
        @param {Object} requestOptions The options as provided to the `$.ajax` method (see http://api.jquery.com/jQuery.ajaxPrefilter/)
      */
      authorize: function(jqXHR, requestOptions) {
        if (this.get('session.isAuthenticated') && !Ember.isEmpty(this.get('session.access_token'))) {
          if (!isSecureUrl(requestOptions.url)) {
            Ember.Logger.warn('Credentials are transmitted via an insecure connection - use HTTPS to keep them secure.');
          }
          jqXHR.setRequestHeader('Authorization', 'Bearer ' + this.get('session.access_token'));
        }
      }
    });

    __exports__.OAuth2 = OAuth2;
  });
define("ember-simple-auth/core", 
  ["./session","./authenticators","./authorizers","./stores","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var Session = __dependency1__.Session;
    var Authenticators = __dependency2__.Authenticators;
    var Authorizers = __dependency3__.Authorizers;
    var Stores = __dependency4__.Stores;

    function extractLocationOrigin(location) {
      if (Ember.typeOf(location) === 'string') {
        var link = document.createElement('a');
        link.href = location;
        //IE requires the following line when url is relative.
        //First assignment of relative url to link.href results in absolute url on link.href but link.hostname and other properties are not set
        //Second assignment of absolute url to link.href results in link.hostname and other properties being set as expected
        link.href = link.href;
        location = link;
      }
      var port = location.port;
      if (Ember.isEmpty(port)) {
        //need to include the port whether its actually present or not as some versions of IE will always set it
        port = location.protocol === 'http:' ? '80' : (location.protocol === 'https:' ? '443' : '');
      }
      return location.protocol + '//' + location.hostname + (port !== '' ? ':' + port : '');
    }

    var urlOrigins     = {};
    var documentOrigin = extractLocationOrigin(window.location);
    var crossOriginWhitelist;
    function shouldAuthorizeRequest(url) {
      var urlOrigin = urlOrigins[url] = urlOrigins[url] || extractLocationOrigin(url);
      return crossOriginWhitelist.indexOf(urlOrigin) > -1 || urlOrigin === documentOrigin;
    }

    /**
      Ember.SimpleAuth's configuration object.

      @class Configuration
      @namespace $mainModule
    */
    var Configuration = Ember.Namespace.create({
      /**
        The route to transition to for authentication; should be set through
        [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup).

        @property authenticationRoute
        @readOnly
        @static
        @type String
        @default 'login'
      */
      authenticationRoute: 'login',

      /**
        The route to transition to after successful authentication; should be set
        through [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup).

        @property routeAfterAuthentication
        @readOnly
        @static
        @type String
        @default 'index'
      */
      routeAfterAuthentication: 'index',

      /**
        @property applicationRootUrl
        @static
        @private
        @type String
      */
      applicationRootUrl: null,
    });

    /**
      Sets up Ember.SimpleAuth for the application; this method __should be invoked
      in a custom initializer__ like this:

      ```javascript
      Ember.Application.initializer({
        name: 'authentication',
        initialize: function(container, application) {
          Ember.SimpleAuth.setup(container, application);
        }
      });
      ```

      @method setup
      @namespace $mainModule
      @static
      @param {Container} container The Ember.js application's dependency injection container
      @param {Ember.Application} application The Ember.js application instance
      @param {Object} [options]
        @param {String} [options.authenticationRoute] route to transition to for authentication - defaults to `'login'`
        @param {String} [options.routeAfterAuthentication] route to transition to after successful authentication - defaults to `'index'`
        @param {Array[String]} [options.crossOriginWhitelist] Ember.SimpleAuth will never authorize requests going to a different origin than the one the Ember.js application was loaded from; to explicitely enable authorization for additional origins, whitelist those origins - defaults to `[]` _(beware that origins consist of protocol, host and port (port can be left out when it is 80 for HTTP or 443 for HTTPS))_
        @param {Object} [options.authorizer] The authorizer _class_ to use; must extend `Ember.SimpleAuth.Authorizers.Base` - defaults to `Ember.SimpleAuth.Authorizers.OAuth2`
        @param {Object} [options.store] The store _class_ to use; must extend `Ember.SimpleAuth.Stores.Base` - defaults to `Ember.SimpleAuth.Stores.LocalStorage`
    **/
    var setup = function(container, application, options) {
      options                                = options || {};
      Configuration.routeAfterAuthentication = options.routeAfterAuthentication || Configuration.routeAfterAuthentication;
      Configuration.authenticationRoute      = options.authenticationRoute || Configuration.authenticationRoute;
      Configuration.applicationRootUrl       = container.lookup('router:main').get('rootURL') || '/';
      crossOriginWhitelist                   = Ember.A(options.crossOriginWhitelist || []).map(function(origin) {
        return extractLocationOrigin(origin);
      });

      container.register('ember-simple-auth:authenticators:oauth2', Authenticators.OAuth2);

      var store      = (options.store || Stores.LocalStorage).create();
      var session    = Session.create({ store: store, container: container });
      var authorizer = (options.authorizer || Authorizers.OAuth2).create({ session: session });

      container.register('ember-simple-auth:session:current', session, { instantiate: false });
      Ember.A(['model', 'controller', 'view', 'route']).forEach(function(component) {
        container.injection(component, 'session', 'ember-simple-auth:session:current');
      });

      Ember.$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
        if (shouldAuthorizeRequest(options.url)) {
          authorizer.authorize(jqXHR, options);
        }
      });
    };

    __exports__.setup = setup;
    __exports__.Configuration = Configuration;
  });
define("ember-simple-auth/mixins/application_route_mixin", 
  ["./../core","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var global = (typeof window !== 'undefined') ? window : {},
        Ember  = global.Ember;

    var Configuration = __dependency1__.Configuration;

    /**
      The mixin for the application route. This defines actions to authenticate the
      session as well as to invalidate it. These actions can be used in all
      templates like this:

      ```handlebars
      {{#if session.isAuthenticated}}
        <a {{ action 'invalidateSession' }}>Logout</a>
      {{else}}
        <a {{ action 'authenticateSession' }}>Login</a>
      {{/if}}
      ```

      While this code works it is __preferrable to use the regular `link-to` helper
      for the _'login'_ link__ as that will add the `'active'` class to the link.
      For the _'logout'_ actions of course there is no route.

      ```handlebars
      {{#if session.isAuthenticated}}
        <a {{ action 'invalidateSession' }}>Logout</a>
      {{else}}
        {{#link-to 'login'}}Login{{/link-to}}
      {{/if}}
      ```

      This mixin also defines actions that are triggered whenever the session is
      successfully authenticated or invalidated and whenever authentication or
      invalidation fails.

      @class ApplicationRouteMixin
      @namespace $mainModule
      @extends Ember.Mixin
      @static
    */
    var ApplicationRouteMixin = Ember.Mixin.create({
      activate: function() {
        var _this = this;
        this._super();
        this.get('session').on('ember-simple-auth:session-authentication-succeeded', function() {
          _this.send('sessionAuthenticationSucceeded');
        });
        this.get('session').on('ember-simple-auth:session-authentication-failed', function(error) {
          _this.send('sessionAuthenticationFailed', error);
        });
        this.get('session').on('ember-simple-auth:session-invalidation-succeeded', function() {
          _this.send('sessionInvalidationSucceeded');
        });
        this.get('session').on('ember-simple-auth:session-invalidation-failed', function(error) {
          _this.send('sessionInvalidationFailed', error);
        });
      },

      actions: {
        /**
          This action triggers transition to the `authenticationRoute` specified in
          [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup). It can be used in
          templates as shown above. It is also triggered automatically by
          [Ember.SimpleAuth.AuthenticatedRouteMixin](#Ember-SimpleAuth-AuthenticatedRouteMixin)
          whenever a route that requries authentication is accessed but the session
          is not currently authenticated.

          __For an application that works without an authentication route (e.g.
          because it opens a new window to handle authentication there), this is
          the method to override, e.g.:__

          ```javascript
          App.ApplicationRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin, {
            actions: {
              authenticateSession: function() {
                this.get('session').authenticate('authenticators:custom', {});
              }
            }
          });
          ```

          @method actions.authenticateSession
        */
        authenticateSession: function() {
          this.transitionTo(Configuration.authenticationRoute);
        },

        /**
          This action is triggered whenever the session is successfully
          authenticated. If there is a transition that was previously intercepted
          by
          [AuthenticatedRouteMixin#beforeModel](#Ember-SimpleAuth-AuthenticatedRouteMixin-beforeModel)
          it will retry that. If there is no such transition, this action
          transitions to the `routeAfterAuthentication` specified in
          [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup).

          @method actions.sessionAuthenticationSucceeded
        */
        sessionAuthenticationSucceeded: function() {
          var attemptedTransition = this.get('session.attemptedTransition');
          if (attemptedTransition) {
            attemptedTransition.retry();
            this.set('session.attemptedTransition', null);
          } else {
            this.transitionTo(Configuration.routeAfterAuthentication);
          }
        },

        /**
          This action is triggered whenever session authentication fails. The
          `error` argument is the error object that the promise the authenticator
          returns rejects with. (see
          [Ember.SimpleAuth.Authenticators.Base#authenticate](#Ember-SimpleAuth-Authenticators-Base-authenticate)).

          It can be overridden to display error messages etc.:

          ```javascript
          App.ApplicationRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin, {
            actions: {
              sessionAuthenticationFailed: function(error) {
                this.controllerFor('application').set('loginErrorMessage', error.message);
              }
            }
          });
          ```

          @method actions.sessionAuthenticationFailed
          @param {any} error The error the promise returned by the authenticator rejects with, see [Ember.SimpleAuth.Authenticators.Base#authenticate](#Ember-SimpleAuth-Authenticators-Base-authenticate)
        */
        sessionAuthenticationFailed: function(error) {
        },

        /**
          This action invalidates the session (see
          [Ember.SimpleAuth.Session#invalidate](#Ember-SimpleAuth-Session-invalidate)).
          If invalidation succeeds, it reloads the application (see
          [Ember.SimpleAuth.ApplicationRouteMixin.sessionInvalidationSucceeded](#Ember-SimpleAuth-ApplicationRouteMixin-sessionInvalidationSucceeded)).

          @method actions.invalidateSession
        */
        invalidateSession: function() {
          this.get('session').invalidate();
        },

        /**
          This action is invoked whenever the session is successfully invalidated.
          It reloads the Ember.js application by redirecting the browser to the
          application's root URL so that all in-memory data (such as Ember Data
          stores etc.) is cleared. The root URL is automatically retrieved from the
          Ember.js application's router (see
          http://emberjs.com/guides/routing/#toc_specifying-a-root-url).

          @method actions.sessionInvalidationSucceeded
        */
        sessionInvalidationSucceeded: function() {
          window.location.replace(Configuration.applicationRootUrl);
        },

        /**
          This action is invoked whenever session invalidation fails. This mainly
          serves as an extension point to add custom behavior and does nothing by
          default.

          @method actions.sessionInvalidationFailed
        */
        sessionInvalidationFailed: function(error) {
        },

        /**
          This action is invoked when an authorization error occurs (which is
          usually __when a server responds with HTTP status 401__). It invalidates
          the session and reloads the application (see
          [Ember.SimpleAuth.ApplicationRouteMixin.sessionInvalidationSucceeded](#Ember-SimpleAuth-ApplicationRouteMixin-sessionInvalidationSucceeded)).

          @method actions.authorizationFailed
        */
        authorizationFailed: function() {
          this.get('session').invalidate();
        },

        /**
          @method actions.error
          @private
        */
        error: function(reason) {
          if (reason.status === 401) {
            this.send('authorizationFailed');
          }
          return true;
        }
      }
    });

    __exports__.ApplicationRouteMixin = ApplicationRouteMixin;
  });
define("ember-simple-auth/mixins/authenticated_route_mixin", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var global = (typeof window !== 'undefined') ? window : {},
        Ember = global.Ember;

    /**
      The mixin for routes that require the session to be authenticated in order to
      be accessible. Including this mixin in a route automatically adds hooks that
      enforce the session to be authenticated and redirect to the
      `authenticationRoute` specified in
      [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup) if it is not.

      `Ember.SimpleAuth.AuthenticatedRouteMixin` performs the redirect in the
      `beforeModel` method so that in all methods executed after that the session
      is guaranteed to be authenticated. __If `beforeModel` is overridden, ensure
      that the custom implementation calls `this._super(transition)`__ so that the
      session enforcement code is actually executed.

      @class AuthenticatedRouteMixin
      @extends Ember.Mixin
      @static
    */
    var AuthenticatedRouteMixin = Ember.Mixin.create({
      /**
        This method implements the enforcement of the session being authenticated.
        If the session is not authenticated, the current transition will be aborted
        and a redirect will be triggered to the `authenticationRoute` specified in
        [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup). The method also saves
        the intercepted transition so that it can be retried after the session has
        been authenticated (see
        [Ember.SimpleAuth.ApplicationRouteMixin#sessionAuthenticationSucceeded](#Ember-SimpleAuth-ApplicationRouteMixin-sessionAuthenticationSucceeded)).

        @method beforeModel
        @param {Transition} transition The transition that lead to this route
      */
      beforeModel: function(transition) {
        if (!this.get('session.isAuthenticated')) {
          transition.abort();
          this.set('session.attemptedTransition', transition);
          transition.send('authenticateSession');
        }
      }
    });

    __exports__.AuthenticatedRouteMixin = AuthenticatedRouteMixin;
  });
define("ember-simple-auth/mixins/authentication_controller_mixin", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var global = (typeof window !== 'undefined') ? window : {},
        Ember = global.Ember;

    /**
      The mixin for the controller that handles the `authenticationRoute` specified
      in [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup)). It provides the
      `authenticate` action that will authenticate the session with the configured
      [Ember.SimpleAuth.AuthenticationControllerMixin#authenticatorFactory](#Ember-SimpleAuth-AuthenticationControllerMixin-authenticatorFactory)
      when invoked.

      @class AuthenticationControllerMixin
      @extends Ember.Mixin
    */
    var AuthenticationControllerMixin = Ember.Mixin.create({
      /**
        The authenticator factory used to authenticate the session.

        @property authenticatorFactory
        @type String
        @default null
      */
      authenticatorFactory: null,

      actions: {
        /**
          This action will authenticate the session with the configured
          [Ember.SimpleAuth.AuthenticationControllerMixin#authenticatorFactory](#Ember-SimpleAuth-AuthenticationControllerMixin-authenticatorFactory)
          (see
          [Ember.SimpleAuth.Session#authenticate](#Ember-SimpleAuth-Session-authenticate)).

          If authentication succeeds, this method triggers the
          `sessionAuthenticationSucceeded` action (see
          [Ember.SimpleAuth.ApplicationRouteMixin#sessionAuthenticationSucceeded](#Ember-SimpleAuth-ApplicationRouteMixin-sessionAuthenticationSucceeded)).
          If authentication fails it triggers the `sessionAuthenticationFailed`
          action (see
          [Ember.SimpleAuth.ApplicationRouteMixin#sessionAuthenticationFailed](#Ember-SimpleAuth-ApplicationRouteMixin-sessionAuthenticationFailed)).

          @method actions.authenticate
          @param {Object} options Any options the auhtenticator needs to authenticate the session
        */
        authenticate: function(options) {
          var _this = this;
          this.get('session').authenticate(this.get('authenticatorFactory'), options);
        }
      }
    });

    __exports__.AuthenticationControllerMixin = AuthenticationControllerMixin;
  });
define("ember-simple-auth/mixins/login_controller_mixin", 
  ["./authentication_controller_mixin","../authenticators/oauth2","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var global = (typeof window !== 'undefined') ? window : {},
        Ember = global.Ember;

    var AuthenticationControllerMixin = __dependency1__.AuthenticationControllerMixin;
    var OAuth2 = __dependency2__.OAuth2;

    /**
      A mixin to use with the controller that handles the `authenticationRoute`
      specified in
      [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup) if the used authentication
      mechanism works with a login form that asks for user credentials. It provides
      the `authenticate` action that will authenticate the session with the
      configured authenticator factory when invoked. __This is a
      specialization of
      [Ember.SimpleAuth.AuthenticationControllerMixin](#Ember-SimpleAuth-AuthenticationControllerMixin).__

      Accompanying the controller that this mixin is mixed in the application needs
      to have a `login` template with the fields `identification` and `password` as
      well as an actionable button or link that triggers the `authenticate` action,
      e.g.:

      ```handlebars
      <form {{action 'authenticate' on='submit'}}>
        <label for="identification">Login</label>
        {{input id='identification' placeholder='Enter Login' value=identification}}
        <label for="password">Password</label>
        {{input id='password' placeholder='Enter Password' type='password' value=password}}
        <button type="submit">Login</button>
      </form>
      ```

      @class LoginControllerMixin
      @extends Ember.SimpleAuth.AuthenticationControllerMixin
    */
    var LoginControllerMixin = Ember.Mixin.create(AuthenticationControllerMixin, {
      /**
        The authenticator factory used to authenticate the session.

        @property authenticatorFactory
        @type String
        @default 'ember-simple-auth:authenticators:oauth2'
      */
      authenticatorFactory: 'ember-simple-auth:authenticators:oauth2',

      actions: {
        /**
          This action will authenticate the session with the configured
          [Ember.SimpleAuth.LoginControllerMixin#authenticatorFactory](#Ember-SimpleAuth-LoginControllerMixin-authenticatorFactory)
          if both `identification` and `password` are non-empty. It passes both
          values to the authenticator.

          _The action also resets the `password` property so sensitive data does not
          stay in memory for longer than necessary._

          @method actions.authenticate
        */
        authenticate: function() {
          var data = this.getProperties('identification', 'password');
          this.set('password', null);
          this._super(data);
        }
      }
    });

    __exports__.LoginControllerMixin = LoginControllerMixin;
  });
define("ember-simple-auth/session", 
  ["./utils/flat_objects_are_equal","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var global = (typeof window !== 'undefined') ? window : {},
        Ember = global.Ember;

    var flatObjectsAreEqual = __dependency1__.flatObjectsAreEqual;

    /**
      __The session provides access to the current authentication state as well as
      any data resolved by the authenticator__ (see
      [Ember.SimpleAuth.Authenticators.Base#authenticate](#Ember-SimpleAuth-Authenticators-Base-authenticate)).
      It is created when Ember.SimpleAuth is set up (see
      [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup)) and __injected into all
      models, controllers, routes and views so that all parts of the application
      can always access the current authentication state and other data__,
      depending on the used authenticator (see
      [Ember.SimpleAuth.Authenticators.Base](#Ember-SimpleAuth-Authenticators-Base))).

      The session also provides methods to authenticate the user and to invalidate
      itself (see
      [Ember.SimpleAuth.Session#authenticate](#Ember-SimpleAuth-Session-authenticate),
      [Ember.SimpleAuth.Session#invaldiate](#Ember-SimpleAuth-Session-invaldiate)
      These methods are usually invoked through actions from routes or controllers.

      @class Session
      @extends Ember.ObjectProxy
      @uses Ember.Evented
    */
    var Session = Ember.ObjectProxy.extend(Ember.Evented, {
      /**
        The authenticator factory used to authenticate the session. This is only
        set when the session is currently authenticated.

        @property authenticatorFactory
        @type String
        @readOnly
        @default null
      */
      authenticatorFactory: null,
      /**
        The store used to persist session properties. This is assigned during
        Ember.SimpleAuth's setup and can be specified there
        (see [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup)).

        @property store
        @type Ember.SimpleAuth.Stores.Base
        @readOnly
        @default null
      */
      store: null,
      /**
        Returns whether the session is currently authenticated.

        @property isAuthenticated
        @type Boolean
        @readOnly
        @default false
      */
      isAuthenticated: false,
      /**
        @property attemptedTransition
        @private
      */
      attemptedTransition: null,
      /**
        @property content
        @private
      */
      content: {},

      /**
        @method init
        @private
      */
      init: function() {
        var _this = this;
        this.bindToStoreEvents();
        var restoredContent      = this.store.restore();
        var authenticatorFactory = restoredContent.authenticatorFactory;
        if (!!authenticatorFactory) {
          delete restoredContent.authenticatorFactory;
          this.container.lookup(authenticatorFactory).restore(restoredContent).then(function(content) {
            _this.setup(authenticatorFactory, content);
          }, function() {
            _this.store.clear();
          });
        } else {
          this.store.clear();
        }
      },

      /**
        Authentices the session with an `authenticator` and appropriate `options`.
        __This delegates the actual authentication work to the `authenticator`__
        and handles the returned promise accordingly (see
        [Ember.SimpleAuth.Authenticators.Base#authenticate](#Ember-SimpleAuth-Authenticators-Base-authenticate)).

        __This method returns a promise itself. A resolving promise indicates that
        the session was successfully authenticated__ while a rejecting promise
        indicates that authentication failed and the session remains
        unauthenticated.

        @method authenticate
        @param {String} authenticatorFactory The authenticator factory to use as it is registered with Ember's container, see [Ember's API docs](http://emberjs.com/api/classes/Ember.Application.html#method_register)
        @param {Object} options The options to pass to the authenticator; depending on the type of authenticator these might be a set of credentials, a Facebook OAuth Token, etc.
        @return {Ember.RSVP.Promise} A promise that resolves when the session was authenticated successfully
      */
      authenticate: function(authenticatorFactory, options) {
        var _this = this;
        return new Ember.RSVP.Promise(function(resolve, reject) {
          _this.container.lookup(authenticatorFactory).authenticate(options).then(function(content) {
            _this.setup(authenticatorFactory, content, true);
            resolve();
          }, function(error) {
            _this.clear();
            _this.trigger('ember-simple-auth:session-authentication-failed', error);
            reject(error);
          });
        });
      },

      /**
        Invalidates the session with the authenticator it is currently
        authenticated with (see
        [Ember.SimpleAuth.Session#authenticatorFactory](#Ember-SimpleAuth-Session-authenticatorFactory)).
        __This invokes the authenticator's `invalidate` method and handles the
        returned promise accordingly__ (see
        [Ember.SimpleAuth.Authenticators.Base#invalidate](#Ember-SimpleAuth-Authenticators-Base-invalidate)).

        __This method returns a promise itself. A resolving promise indicates that
        the session was successfully invalidated__ while a rejecting promise
        indicates that the promise returned by the `authenticator` rejected and
        thus invalidation was cancelled. In that case the session remains
        authenticated.

        @method invalidate
        @return {Ember.RSVP.Promise} A promise that resolves when the session was invalidated successfully
      */
      invalidate: function() {
        var _this = this;
        return new Ember.RSVP.Promise(function(resolve, reject) {
          var authenticator = _this.container.lookup(_this.authenticatorFactory);
          authenticator.invalidate(_this.content).then(function() {
            authenticator.off('ember-simple-auth:session-updated');
            _this.clear(true);
            resolve();
          }, function(error) {
            _this.trigger('ember-simple-auth:session-invalidation-failed', error);
            reject(error);
          });
        });
      },

      /**
        @method setup
        @private
      */
      setup: function(authenticatorFactory, content, trigger) {
        trigger = !!trigger && !this.get('isAuthenticated');
        this.setProperties({
          isAuthenticated:      true,
          authenticatorFactory: authenticatorFactory,
          content:              content
        });
        this.bindToAuthenticatorEvents();
        var data = Ember.$.extend({ authenticatorFactory: authenticatorFactory }, this.content);
        if (!flatObjectsAreEqual(data, this.store.restore())) {
          this.store.clear();
          this.store.persist(data);
        }
        if (trigger) {
          this.trigger('ember-simple-auth:session-authentication-succeeded');
        }
      },

      /**
        @method clear
        @private
      */
      clear: function(trigger) {
        trigger = !!trigger && this.get('isAuthenticated');
        this.setProperties({
          isAuthenticated:      false,
          authenticatorFactory: null,
          content:              {}
        });
        this.store.clear();
        if (trigger) {
          this.trigger('ember-simple-auth:session-invalidation-succeeded');
        }
      },

      /**
        @method bindToAuthenticatorEvents
        @private
      */
      bindToAuthenticatorEvents: function() {
        var _this = this;
        var authenticator = this.container.lookup(this.authenticatorFactory);
        authenticator.off('ember-simple-auth:session-updated');
        authenticator.on('ember-simple-auth:session-updated', function(content) {
          _this.setup(_this.authenticatorFactory, content);
        });
      },

      /**
        @method bindToStoreEvents
        @private
      */
      bindToStoreEvents: function() {
        var _this = this;
        this.store.on('ember-simple-auth:session-updated', function(content) {
          var authenticatorFactory = content.authenticatorFactory;
          if (!!authenticatorFactory) {
            delete content.authenticatorFactory;
            _this.container.lookup(authenticatorFactory).restore(content).then(function(content) {
              _this.setup(authenticatorFactory, content, true);
            }, function() {
              _this.clear(true);
            });
          } else {
            _this.clear(true);
          }
        });
      }
    });

    __exports__.Session = Session;
  });
define("ember-simple-auth/stores", 
  ["./stores/base","./stores/cookie","./stores/local_storage","./stores/ephemeral","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var global = (typeof window !== 'undefined') ? window : {},
        Ember = global.Ember;

    var Base = __dependency1__.Base;
    var Cookie = __dependency2__.Cookie;
    var LocalStorage = __dependency3__.LocalStorage;
    var Ephemeral = __dependency4__.Ephemeral;

    var Stores = Ember.Namespace.create({
      Base:         Base,
      Cookie:       Cookie,
      LocalStorage: LocalStorage,
      Ephemeral:    Ephemeral
    });

    __exports__.Stores = Stores;
  });
define("ember-simple-auth/stores/base", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var global = (typeof window !== 'undefined') ? window : {},
        Ember = global.Ember;

    /**
      The base for all store types. __This serves as a starting point for
      implementing custom stores and must not be used directly.__

      Stores may trigger the `'ember-simple-auth:session-updated'` event when
      any of the stored values change due to external actions (e.g. from another
      tab). The session listens to that event and will handle the changes
      accordingly. Whenever the event is triggered by the store, the session will
      forward all values as one object to its authenticator which might then
      invalidate the session (see
      [Ember.SimpleAuth.Authenticators.Base#restore](#Ember-SimpleAuth-Authenticators-Base-restore)).

      @class Base
      @namespace Stores
      @extends Ember.Object
      @uses Ember.Evented
    */
    var Base = Ember.Object.extend(Ember.Evented, {
      /**
        Persists the `data` in the store.

        `Ember.SimpleAuth.Stores.Base`'s implementation does nothing.

        @method persist
        @param {Object} data The data to persist
      */
      persist: function(data) {
      },

      /**
        Restores all data currently saved in the store as one plain object.

        `Ember.SimpleAuth.Stores.Base`'s implementation always returns an empty
        plain Object.

        @method restore
        @return {Object} The data currently persisted in the store.
      */
      restore: function() {
        return {};
      },

      /**
        Clears the store.

        `Ember.SimpleAuth.Stores.Base`'s implementation does nothing.

        @method clear
      */
      clear: function() {
      }
    });

    __exports__.Base = Base;
  });
define("ember-simple-auth/stores/cookie", 
  ["./base","../utils/flat_objects_are_equal","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var global = (typeof window !== 'undefined') ? window : {},
        Ember = global.Ember;

    var Base = __dependency1__.Base;
    var flatObjectsAreEqual = __dependency2__.flatObjectsAreEqual;

    /**
      Store that saves its data in session cookies.

      __In order to keep multiple tabs/windows of your application in sync, this
      store has to periodically (every 500ms) check the cookies__ for changes as
      there are no events that notify of changes in cookies. The recommended
      alternative is
      [Ember.SimpleAuth.Stores.LocalStorage](#Ember-SimpleAuth-Stores-LocalStorage)
      that also persistently stores data but instead of cookies relies on the
      `localStorage` API and does not need to poll for external changes.

      This store will trigger the `'ember-simple-auth:session-updated'` event when
      any of its cookies is changed from another tab or window.

      @class Cookie
      @namespace Stores
      @extends Stores.Base
    */
    var Cookie = Base.extend({
      /**
        The prefix to use for the store's cookie names so they can be distinguished
        from other cookies.

        @property cookieNamePrefix
        @type String
        @default 'ember_simple_auth:'
      */
      cookieNamePrefix: 'ember_simple_auth:',
      /**
        @property _secureCookies
        @private
      */
      _secureCookies: window.location.protocol === 'https:',
      /**
        @property _syncDataTimeout
        @private
      */
      _syncDataTimeout: null,

      /**
        @method init
        @private
      */
      init: function() {
        this.syncData();
      },

      /**
        Persists the `data` in session cookies.

        @method persist
        @param {Object} data The data to persist
      */
      persist: function(data) {
        for (var property in data) {
          this.write(property, data[property], null);
        }
        this._lastData = this.restore();
      },

      /**
        Restores all data currently saved in the session cookies identified by the
        `cookieNamePrefix` as one plain object.

        @method restore
        @return {Object} All data currently persisted in the session cookies
      */
      restore: function() {
        var _this = this;
        var data  = {};
        this.knownCookies().forEach(function(cookie) {
          data[cookie] = _this.read(cookie);
        });
        return data;
      },

      /**
        Clears the store by deleting all session cookies prefixed with the
        `cookieNamePrefix`.

        @method clear
      */
      clear: function() {
        var _this = this;
        this.knownCookies().forEach(function(cookie) {
          _this.write(cookie, null, (new Date(0)).toGMTString());
        });
        this._lastData = null;
      },

      /**
        @method read
        @private
      */
      read: function(name) {
        var value = document.cookie.match(new RegExp(this.cookieNamePrefix + name + '=([^;]+)')) || [];
        return decodeURIComponent(value[1] || '');
      },

      /**
        @method write
        @private
      */
      write: function(name, value, expiration) {
        var expires = Ember.isEmpty(expiration) ? '' : '; expires=' + expiration;
        var secure  = !!this._secureCookies ? ';secure' : '';
        document.cookie = this.cookieNamePrefix + name + '=' + encodeURIComponent(value) + expires + secure;
      },

      /**
        @method knownCookies
        @private
      */
      knownCookies: function() {
        var _this = this;
        return Ember.A(document.cookie.split(/[=;\s]+/)).filter(function(element) {
          return new RegExp('^' + _this.cookieNamePrefix).test(element);
        }).map(function(cookie) {
          return cookie.replace(_this.cookieNamePrefix, '');
        });
      },

      /**
        @method syncData
        @private
      */
      syncData: function() {
        var data = this.restore();
        if (!flatObjectsAreEqual(data, this._lastData)) {
          this._lastData = data;
          this.trigger('ember-simple-auth:session-updated', data);
        }
        if (!Ember.testing) {
          Ember.run.cancel(this._syncDataTimeout);
          this._syncDataTimeout = Ember.run.later(this, this.syncData, 500);
        }
      }
    });

    __exports__.Cookie = Cookie;
  });
define("ember-simple-auth/stores/ephemeral", 
  ["./base","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var global = (typeof window !== 'undefined') ? window : {},
        Ember = global.Ember;

    var Base = __dependency1__.Base;

    /**
      Store that saves its data in memory and thus __is not actually persistent__.
      This store is mainly useful for testing.

      @class Ephemeral
      @namespace Stores
      @extends Stores.Base
    */
    var Ephemeral = Base.extend({
      /**
        @method init
        @private
      */
      init: function() {
        this.clear();
      },

      /**
        Persists the `data`.

        @method persist
        @param {Object} data The data to persist
      */
      persist: function(data) {
        this._data = Ember.$.extend(data, this._data);
      },

      /**
        Restores all data currently saved as one plain object.

        @method restore
        @return {Object} All data currently persisted
      */
      restore: function() {
        return Ember.$.extend({}, this._data);
      },

      /**
        Clears the store.

        @method clear
      */
      clear: function() {
        delete this._data;
        this._data = {};
      }
    });

    __exports__.Ephemeral = Ephemeral;
  });
define("ember-simple-auth/stores/local_storage", 
  ["./base","../utils/flat_objects_are_equal","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var global = (typeof window !== 'undefined') ? window : {},
        Ember = global.Ember;

    var Base = __dependency1__.Base;
    var flatObjectsAreEqual = __dependency2__.flatObjectsAreEqual;

    /**
      Store that saves its data in the browser's `localStorage`.

      This store will trigger the `'ember-simple-auth:session-updated'` event when
      any of the keys it manages is changed from another tab or window.

      @class LocalStorage
      @namespace Stores
      @extends Stores.Base
    */
    var LocalStorage = Base.extend({
      /**
        The prefix to use for the store's keys so they can be distinguished from
        others.

        @property keyPrefix
        @type String
        @default 'ember_simple_auth:'
      */
      keyPrefix: 'ember_simple_auth:',

      /**
        @property _triggerChangeEventTimeout
        @private
      */
      _triggerChangeEventTimeout: null,

      /**
        @method init
        @private
      */
      init: function() {
        this.bindToStorageEvents();
      },

      /**
        Persists the `data` in the `localStorage`.

        @method persist
        @param {Object} data The data to persist
      */
      persist: function(data) {
        for (var property in data) {
          var key = this.buildStorageKey(property);
          localStorage.setItem(key, data[property]);
        }
        this._lastData = this.restore();
      },

      /**
        Restores all data currently saved in the `localStorage` identified by the
        `keyPrefix` as one plain object.

        @method restore
        @return {Object} All data currently persisted in the `localStorage`
      */
      restore: function() {
        var _this = this;
        var data = {};
        this.knownKeys().forEach(function(key) {
          var originalKey = key.replace(_this.keyPrefix, '');
          data[originalKey] = localStorage.getItem(key);
        });
        return data;
      },

      /**
        Clears the store by deleting all `localStorage` keys prefixed with the
        `keyPrefix`.

        @method clear
      */
      clear: function() {
        this.knownKeys().forEach(function(key) {
          localStorage.removeItem(key);
        });
        this._lastData = null;
      },

      /**
        @method buildStorageKey
        @private
      */
      buildStorageKey: function(property) {
        return this.keyPrefix + property;
      },

      /**
        @method knownKeys
        @private
      */
      knownKeys: function(callback) {
        var keys = Ember.A([]);
        for (var i = 0, l = localStorage.length; i < l; i++) {
          var key = localStorage.key(i);
          if (key.indexOf(this.keyPrefix) === 0) {
            keys.push(key);
          }
        }
        return keys;
      },

      /**
        @method bindToStorageEvents
        @private
      */
      bindToStorageEvents: function() {
        var _this = this;
        Ember.$(window).bind('storage', function(e) {
          var data = _this.restore();
          if (!flatObjectsAreEqual(data, _this._lastData)) {
            _this._lastData = data;
            Ember.run.cancel(_this._triggerChangeEventTimeout);
            _this._triggerChangeEventTimeout = Ember.run.next(_this, function() {
              this.trigger('ember-simple-auth:session-updated', data);
            });
          }
        });
      }
    });

    __exports__.LocalStorage = LocalStorage;
  });
define("ember-simple-auth/utils/flat_objects_are_equal", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var flatObjectsAreEqual = function(a, b) {
      function sortObject(object) {
        var array = [];
        for (var property in object) {
          array.push([property, object[property]]);
        }
        return array.sort(function(a, b) {
          if (a[0] < b[0]) {
            return -1;
          } else if (a[0] > b[0]) {
            return 1;
          } else {
            return 0;
          }
        });
      }
      return JSON.stringify(sortObject(a)) === JSON.stringify(sortObject(b));
    };

    __exports__.flatObjectsAreEqual = flatObjectsAreEqual;
  });
define("ember-simple-auth/utils/is_secure_url", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var isSecureUrl = function(url) {
      var link  = document.createElement('a');
      link.href = location;
      link.href = link.href;
      return link.protocol == 'https:';
    };

    __exports__.isSecureUrl = isSecureUrl;
  });
global.Ember.SimpleAuth = requireModule('ember-simple-auth');
})((typeof global !== 'undefined') ? global : window);
;(function() {
  Ember.Application.initializer({
    name: 'authentication',
    initialize: function(container, application) {
      container.register('authenticators:present', this.App.PresentAuthenticator);
      container.register('authenticators:facebook', this.App.FacebookAuthenticator);
      return Ember.SimpleAuth.setup(container, application);
    }
  });

  Ember.$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
    if (!(jqXHR.crossDomain && localStorage.getItem('ember_simple_auth:access_token') === null)) {
      return jqXHR.setRequestHeader('X-Accesstoken', localStorage.getItem('ember_simple_auth:access_token'));
    }
  });

  window.init = function() {
    this.App = Ember.Application.create({
      title: 'Present Web',
      rootElement: '#app'
    });
    this.App.Router.map(function(match) {
      this.route('login');
      this.route('comments');
      return this.route('like');
    });
    this.App.CommentsRoute = Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin);
    this.App.LikeRoute = Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin);
    this.App.LoginRoute = Ember.Route.extend({
      setupController: function(controller, model) {
        return controller.set('errorMessage', null);
      },
      actions: {
        sessionAuthenticationFailed: function(message) {
          return this.controller.set('errorMessage', message);
        },
        sessionAuthenticationSucceeded: function() {
          this.controllerFor('application').send('checkLikes');
          this.controllerFor('application').send('retrieveComments');
          this.controllerFor('application').send('registerVideo');
          return this.transitionTo('/');
        }
      }
    });
    this.App.ApplicationRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin, {
      actions: {
        authenticateFacebookSession: function() {
          return this.get('session').authenticate('authenticators:facebook', {});
        },
        invalidateFacebookSession: function() {
          return this.get('session').invalidate('authenticators:facebook', {});
        },
        invalidateSession: function() {
          return this.get('session').invalidate('authenticators:present', {});
        }
      }
    });
    this.App.ApplicationController = Ember.ObjectController.extend({
      isLiked: false,
      comment: "",
      disableCommentField: false,
      init: function() {
        if (localStorage.getItem('ember_simple_auth:access_token') !== null) {
          this.send('checkLikes');
          this.send('retrieveComments');
          return this.send('registerVideo');
        }
      },
      actions: {
        registerVideo: function() {
          var _this;
          _this = this;
          if (localStorage.getItem('ember_simple_auth:access_token') !== null) {
            return setTimeout(function() {
              return $('#present-video').bind('ended', function() {
                return Ember.$.ajax({
                  url: $('meta[name="ps:id"]').attr('content') + "/viewed",
                  type: 'POST'
                });
              });
            }, 1000);
          }
        },
        submitComment: function(evt) {
          var _this;
          _this = this;
          if (localStorage.getItem('ember_simple_auth:access_token') !== null) {
            Ember.$.ajax({
              url: $('meta[name="ps:id"]').attr('content') + "/comments",
              data: {
                comment: _this.comment
              },
              type: 'POST'
            }).then(function(response) {
              var source, template, view;
              source = $('#comment-template').html();
              template = Handlebars.compile(source);
              view = template(response);
              $(view).removeClass('hidden');
              $(view).appendTo($('.comments'));
              _this.set('comment', '');
              return _this.set('disableCommentField', false);
            });
            _this.set('disableCommentField', true);
            return _this.set('comment', 'Loading...');
          } else {
            return this.transitionToRoute('login');
          }
        },
        retrieveComments: function() {
          var _this;
          _this = this;
          return Ember.$.ajax({
            url: $('meta[name="ps:id"]').attr('content') + "/comments",
            type: 'GET'
          }).then(function(response) {
            return _.each(response, function(item) {
              var source, template, view;
              source = $('#comment-template').html();
              template = Handlebars.compile(source);
              view = template(item);
              $(view).removeClass('hidden');
              return $(view).appendTo($('.comments'));
            });
          });
        },
        checkLikes: function() {
          var _this;
          _this = this;
          return Ember.$.ajax({
            url: $('meta[name="ps:id"]').attr('content') + "/likes",
            type: 'GET'
          }).then(function(response) {
            var likes;
            likes = _.find(response, function(item) {
              return item === $('meta[name="ps:id"]').attr('content');
            });
            if (likes) {
              return _this.set('isLiked', true);
            }
          });
        },
        like: function() {
          if (localStorage.getItem('ember_simple_auth:access_token') !== null) {
            this.set('isLiked', true);
            $('#like-count').html(parseInt($('#like-count').html()) + 1);
            return Ember.$.ajax({
              url: $('meta[name="ps:id"]').attr('content') + "/like",
              type: 'POST'
            });
          } else {
            return this.transitionToRoute('login');
          }
        },
        unlike: function() {
          if (localStorage.getItem('ember_simple_auth:access_token') !== null) {
            this.set('isLiked', false);
            $('#like-count').html(parseInt($('#like-count').html()) - 1);
            return Ember.$.ajax({
              url: $('meta[name="ps:id"]').attr('content') + "/like",
              type: 'DELETE'
            });
          }
        }
      }
    });
    this.App.LoginController = Ember.Controller.extend(Ember.SimpleAuth.LoginControllerMixin, {
      authenticatorFactory: 'authenticators:present',
      shouldShowLoginViaEmail: false,
      actions: {
        showLogin: function() {
          return this.set('shouldShowLoginViaEmail', true);
        },
        dismissLogin: function() {
          return this.transitionToRoute('');
        }
      }
    });
    this.App.PresentAuthenticator = Ember.SimpleAuth.Authenticators.OAuth2.extend(Ember.Evented, {
      authenticate: function(credentials) {
        var _this;
        _this = this;
        return new Ember.RSVP.Promise(function(resolve, reject) {
          var data;
          data = {
            email: credentials.identification,
            password: CryptoJS.SHA256(credentials.password).toString(),
            client: {
              id: Math.floor((Math.random() * 9999999) + 1),
              type: "web",
              version: "1.0.0",
              os: navigator.userAgent
            }
          };
          return Ember.$.ajax({
            url: '/login',
            data: JSON.stringify(data),
            type: 'POST',
            contentType: 'application/json'
          }).then(function(response) {
            return Ember.run(function() {
              return resolve({
                access_token: response.accesstoken,
                account_id: response.client_id
              });
            });
          }, function(xhr, status, error) {
            return reject(xhr.responseJSON.reason);
          });
        });
      },
      invalidate: function() {
        var _this;
        _this = this;
        return new Ember.RSVP.Promise(function(resolve, reject) {
          return Ember.$.ajax({
            url: '/logout',
            type: 'DELETE'
          }).always(function(response) {
            return resolve();
          });
        });
      }
    });
    return this.App.FacebookAuthenticator = Ember.SimpleAuth.Authenticators.Base.extend({
      restore: function(properties) {
        return new Ember.RSVP.Promise(function(resolve, reject) {
          if (!Ember.isEmpty(localStorage.getItem('ember_simple_auth:access_token'))) {
            return resolve(properties);
          } else {
            return reject();
          }
        });
      },
      authenticate: function() {
        return new Ember.RSVP.Promise(function(resolve, reject) {
          return FB.getLoginStatus(function(fbResponse) {
            if (fbResponse.status === "connected") {
              return Ember.run(function() {
                return FB.api('/me', function(response) {
                  return Ember.run(function() {
                    var data;
                    data = {
                      email: response.email ? response.email : "",
                      password: "",
                      facebook: fbResponse.authResponse.accessToken,
                      client: {
                        id: Math.floor((Math.random() * 9999999) + 1),
                        type: "web",
                        version: "1.0.0",
                        os: navigator.userAgent
                      }
                    };
                    return Ember.$.ajax({
                      url: '/login',
                      data: JSON.stringify(data),
                      type: 'POST',
                      contentType: 'application/json'
                    }).then(function(response) {
                      return Ember.run(function() {
                        return resolve({
                          access_token: response.accesstoken,
                          account_id: response.client_id
                        });
                      });
                    }, function(xhr, status, error) {
                      return reject(xhr.responseJSON.reason);
                    });
                  });
                });
              });
            } else if (fbResponse.status === "not_authorized") {
              return reject();
            } else {
              return FB.login(function(fbResponse) {
                if (fbResponse.authResponse) {
                  return Ember.run(function() {
                    return FB.api('/me', function(response) {
                      return Ember.run(function() {
                        var data;
                        data = {
                          email: response.email ? response.email : "",
                          password: "",
                          facebook: fbResponse.authResponse.accessToken,
                          client: {
                            id: Math.floor((Math.random() * 9999999) + 1),
                            type: "web",
                            version: "1.0.0",
                            os: navigator.userAgent
                          }
                        };
                        return Ember.$.ajax({
                          url: '/login',
                          data: JSON.stringify(data),
                          type: 'POST',
                          contentType: 'application/json'
                        }).then(function(response) {
                          return Ember.run(function() {
                            return resolve({
                              access_token: response.accesstoken,
                              account_id: response.client_id
                            });
                          });
                        }, function(xhr, status, error) {
                          return reject(xhr.responseJSON.reason);
                        });
                      });
                    });
                  });
                } else {
                  return reject();
                }
              }, {
                scope: 'email,publish_actions'
              });
            }
          });
        });
      },
      invalidate: function() {
        var _this;
        _this = this;
        return new Ember.RSVP.Promise(function(resolve, reject) {
          return Ember.$.ajax({
            url: '/logout',
            type: 'DELETE'
          }).always(function(response) {
            return resolve();
          });
        });
      }
    });
  };

}).call(this);
