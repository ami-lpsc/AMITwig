/*!
 * AMI TWIG Engine
 *
 * Version: 0.1.0
 *
 * Copyright (c) 2014-2015 The AMI Team
 * http://www.cecill.info/licences/Licence_CeCILL-C_V1-en.html
 *
 */

'use strict';

/*-------------------------------------------------------------------------*/
/* ami.twig                                                                */
/*-------------------------------------------------------------------------*/

if(!(ami instanceof Object))
{
	var ami = {};
}

ami.twig = {};

/*-------------------------------------------------------------------------*/
/* exports.ami                                                             */
/*-------------------------------------------------------------------------*/

if(typeof exports !== 'undefined')
{
	ami.fs = require('fs');

	exports.ami = ami;
}

/*-------------------------------------------------------------------------*/
/*
 * AMI TWIG Engine
 *
 * Copyright (c) 2014-2015 The AMI Team
 * http://www.cecill.info/licences/Licence_CeCILL-C_V1-en.html
 *
 */

/*-------------------------------------------------------------------------*/
/* ami.twig.tokenizer                                                      */
/*-------------------------------------------------------------------------*/

/**
 * The AMI TWIG tokenizer
 * @namespace ami/twig/tokenizer
 */

ami.twig.tokenizer = {
	/*-----------------------------------------------------------------*/

	/**
	  * Tokenize a string
	  * @param {String} code the code
	  * @param {Number} line the line
	  * @param {Array<String>} spaces the array of spaces
	  * @param {Array<String>|Array<RegExp>} tokenDefs the array of token defs
	  * @param {Array<Number>}               tokenTypes the array of token types
	  * @param {Boolean} [error=false] throw an exception on invalid tokens
	  * @throws {String} The error description
	  * @return {Object} The resulting object
	  * @example
	  * var PLUS = 0;
	  * var EQUAL = 1;
	  * var NUMBER = 2;
	  *
	  * var result = ami.twig.tokenizer.tokenize(
	  * 	'1+2=3',
	  *	1,
	  *	[' ', '\t'],
	  *	['+', '-', '=', /[0-9]+/],
	  *	[PLUS, MINUS, EQUAL, NUMBER],
	  *	true
	  * );
	  *
	  * console.debug(result.tokens); // ['1', '+', '2', '=', '3']
	  * console.debug(result.types); // [ 2 ,  0 ,  2 ,  1 ,  2 ]
	  * console.debug(result.lines); // [ 1 ,  1 ,  1 ,  1 ,  1 ]
	  */

	tokenize: function(code, line, spaces, tokenDefs, tokenTypes, error)
	{
		if(tokenDefs.length !== tokenTypes.length)
		{
			throw '`tokenDefs.length != tokenTypes.length`';
		}

		var result_tokens = [];
		var result_types = [];
		var result_lines = [];

		var i = 0x000000000;
		var l = code.length;

		var word = '', c;

		var found;
		var token;
		var type;
		var idx;

		while(i < l)
		{
			c = code.charAt(0);

			/*-------------------------------------------------*/
			/* COUNT LINES                                     */
			/*-------------------------------------------------*/

			if(c === '\n')
			{
				line++;
			}

			/*-------------------------------------------------*/
			/* EAT SPACES                                      */
			/*-------------------------------------------------*/

			if(spaces.indexOf(c) >= 0)
			{
				if(word)
				{
					if(error)
					{
						throw 'invalid token `' + word + '`';
					}

					result_tokens.push(word);
					result_types.push((-1));
					result_lines.push(line);
					word = '';
				}

				code = code.substring(1);
				i += 1;

				continue;
			}

			/*-------------------------------------------------*/
			/* EAT REGEXES                                     */
			/*-------------------------------------------------*/

			found = false;

			for(idx in tokenDefs)
			{
				token = this._match(code, tokenDefs[idx]);

				if(token)
				{
					if(word)
					{
						if(error)
						{
							throw 'invalid token `' + word + '`';
						}

						result_tokens.push(word);
						result_types.push((-1));
						result_lines.push(line);
						word = '';
					}

					type = tokenTypes[idx];

					result_tokens.push(token);
					result_types.push(type);
					result_lines.push(line);

					code = code.substring(token.length);
					i += token.length;
					found = true;

					break;
				}
			}

			if(found)
			{
				continue;
			}

			/*-------------------------------------------------*/
			/* EAT REMAINING CHARACTERES                       */
			/*-------------------------------------------------*/

			word += c;

			code = code.substring(1);
			i += 1;

			/*-------------------------------------------------*/
		}

		if(word)
		{
			if(error)
			{
				throw 'invalid token `' + word + '`';
			}

			result_tokens.push(word);
			result_types.push((-1));
			result_lines.push(line);
			word = '';
		}

		return {
			tokens: result_tokens,
			types: result_types,
			lines: result_lines,
		};
	},

	/*-----------------------------------------------------------------*/

	_match: function(s, stringOrRegExp)
	{
		var m;

		if(stringOrRegExp instanceof RegExp)
		{
			m = s.match(stringOrRegExp);

			return m !== null && this._checkNextChar(s, (((((m[0])))))) ? (((((m[0]))))) : null;
		}
		else
		{
			m = s.indexOf(stringOrRegExp);

			return m === 0x00 && this._checkNextChar(s, stringOrRegExp) ? stringOrRegExp : null;
		}
	},

	/*-----------------------------------------------------------------*/

	_alnum: [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
		0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0,
		0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	],

	_checkNextChar: function(s, token)
	{
		var length = token.length;

		var charCode2 = s.charCodeAt(length - 0);
		var charCode1 = s.charCodeAt(length - 1);

		return isNaN(charCode2)
		       ||
		       this._alnum[charCode2] === 0
		       ||
		       this._alnum[charCode1] === 0
		;
	},

	/*-----------------------------------------------------------------*/
};

/*-------------------------------------------------------------------------*/
/*
 * AMI TWIG Engine
 *
 * Copyright (c) 2014-2015 The AMI Team
 * http://www.cecill.info/licences/Licence_CeCILL-C_V1-en.html
 *
 */

/*-------------------------------------------------------------------------*/
/* ami.twig.expr                                                           */
/*-------------------------------------------------------------------------*/

ami.twig.expr = {};

/*-------------------------------------------------------------------------*/
/* ami.twig.expr.tokens                                                    */
/*-------------------------------------------------------------------------*/

ami.twig.expr.tokens = {
	/*-----------------------------------------------------------------*/

	$init: function()
	{
		/*---------------------------------------------------------*/
		/* COMPOSITE TOKENS                                        */
		/*---------------------------------------------------------*/

		this.XXX_WITH = [
			this.STARTS_WITH,
			this.ENDS_WITH,
		];

		this.PLUS_MINUS = [
			this.PLUS,
			this.MINUS,
		];

		this.MUL_FLDIV_DIV_MOD = [
			this.MUL,
			this.FLDIV,
			this.DIV,
			this.MOD,
		];

		this.NOT_PLUS_MINUS = [
			this.NOT,
			this.PLUS,
			this.MINUS,
		];

		this.RX = [
			this.RP,			/* ONLY RP & RB1 */
			this.RB1,			/* ONLY RP & RB1 */
		];

		/*---------------------------------------------------------*/
	},

	/*-----------------------------------------------------------------*/
	/* REAL TOKENS                                                     */
	/*-----------------------------------------------------------------*/

	LOGICAL_OR: 100,
	LOGICAL_AND: 101,
	BITWISE_OR: 102,
	BITWISE_XOR: 103,
	BITWISE_AND: 104,
	IS: 105,
	IS_XXX: 106,
	CMP_OP: 107,
	STARTS_WITH: 108,
	ENDS_WITH: 109,
	MATCHES: 110,
	IN: 111,
	RANGE: 112,
	PLUS: 113,
	MINUS: 114,
	POWER: 115,
	MUL: 116,
	FLDIV: 117,
	DIV: 118,
	MOD: 119,
	NOT: 120,
	COLON: 121,
	DOT: 122,
	COMMA: 123,
	PIPE: 124,
	LP: 125,
	RP: 126,
	LB1: 127,
	RB1: 128,
	LB2: 129,
	RB2: 130,
	TERMINAL: 131,
	SID: 132,

	/*-----------------------------------------------------------------*/
	/* VIRTUAL TOKENS                                                  */
	/*-----------------------------------------------------------------*/

	LST: 200,
	DIC: 201,
	FUN: 202,
	VAR: 203,

	/*-----------------------------------------------------------------*/
};

/*-------------------------------------------------------------------------*/

ami.twig.expr.tokens.$init();

/*-------------------------------------------------------------------------*/
/* ami.twig.expr.Tokenizer                                                 */
/*-------------------------------------------------------------------------*/

ami.twig.expr.Tokenizer = function(code, line) {
	/*-----------------------------------------------------------------*/

	this._spaces = [' ', '\t', '\n', '\r'];

	/*-----------------------------------------------------------------*/

	this._tokenDefs = [
		'or', 'and',
		'b-or', 'b-xor', 'b-and',
		'is',
		'defined', 'null', 'empty', 'iterable', 'even', 'odd',
		'===', '==', '!==', '!=', '<=', '>=', '<', '>',
		/^starts\s+with/, /^ends\s+with/,
		'matches',
		'in', '..',
		'+', '-', '**', '*', '//', '/', '%',
		'not',
		':', '.', ',', '|',
		'(', ')', '[', ']', '{', '}',
		/^[0-9]+\.[0-9]+/, /^[0-9]+/, /^'(\\'|[^\'])*'/, /^"(\\"|[^\"])*"/,
		/^[a-zA-Z_$][a-zA-Z0-9_$]*/,
	];

	/*-----------------------------------------------------------------*/

	this._tokenTypes = [
		ami.twig.expr.tokens.LOGICAL_OR, ami.twig.expr.tokens.LOGICAL_AND,
		ami.twig.expr.tokens.BITWISE_OR, ami.twig.expr.tokens.BITWISE_XOR, ami.twig.expr.tokens.BITWISE_AND,
		ami.twig.expr.tokens.IS,
		ami.twig.expr.tokens.IS_XXX, ami.twig.expr.tokens.IS_XXX, ami.twig.expr.tokens.IS_XXX, ami.twig.expr.tokens.IS_XXX, ami.twig.expr.tokens.IS_XXX, ami.twig.expr.tokens.IS_XXX,
		ami.twig.expr.tokens.CMP_OP, ami.twig.expr.tokens.CMP_OP, ami.twig.expr.tokens.CMP_OP, ami.twig.expr.tokens.CMP_OP, ami.twig.expr.tokens.CMP_OP, ami.twig.expr.tokens.CMP_OP, ami.twig.expr.tokens.CMP_OP, ami.twig.expr.tokens.CMP_OP,
		ami.twig.expr.tokens.STARTS_WITH, ami.twig.expr.tokens.ENDS_WITH,
		ami.twig.expr.tokens.MATCHES,
		ami.twig.expr.tokens.IN, ami.twig.expr.tokens.RANGE,
		ami.twig.expr.tokens.PLUS, ami.twig.expr.tokens.MINUS, ami.twig.expr.tokens.POWER, ami.twig.expr.tokens.MUL, ami.twig.expr.tokens.FLDIV, ami.twig.expr.tokens.DIV, ami.twig.expr.tokens.MOD,
		ami.twig.expr.tokens.NOT,
		ami.twig.expr.tokens.COLON, ami.twig.expr.tokens.DOT, ami.twig.expr.tokens.COMMA, ami.twig.expr.tokens.PIPE,
		ami.twig.expr.tokens.LP, ami.twig.expr.tokens.RP, ami.twig.expr.tokens.LB1, ami.twig.expr.tokens.RB1, ami.twig.expr.tokens.LB2, ami.twig.expr.tokens.RB2,
		ami.twig.expr.tokens.TERMINAL, ami.twig.expr.tokens.TERMINAL, ami.twig.expr.tokens.TERMINAL, ami.twig.expr.tokens.TERMINAL,
		ami.twig.expr.tokens.SID,
	];

	/*-----------------------------------------------------------------*/

	this.$init = function(code, line)
	{
		/*---------------------------------------------------------*/

		var result = ami.twig.tokenizer.tokenize(
			code,
			line,
			this._spaces,
			this._tokenDefs,
			this._tokenTypes,
			true
		);

		/*---------------------------------------------------------*/

		this.tokens = result.tokens;
		this.types = result.types;

		this.i = 0;

		/*---------------------------------------------------------*/
	};

	/*-----------------------------------------------------------------*/

	this.next = function(n)
	{
		this.i += n || 1;
	};

	/*-----------------------------------------------------------------*/

	this.isEmpty = function()
	{
		return this.i >= this.tokens.length;
	};

	/*-----------------------------------------------------------------*/

	this.peekToken = function()
	{
		return this.tokens[this.i];
	};

	/*-----------------------------------------------------------------*/

	this.peekType = function()
	{
		return this.types[this.i];
	};

	/*-----------------------------------------------------------------*/

	this.checkType = function(type)
	{
		if(this.i < this.tokens.length)
		{
			var TYPE = this.types[this.i];

			return (type instanceof Array) ? (type.indexOf(TYPE) >= 0) : (type === TYPE);
		}

		return false;
	};

	/*-----------------------------------------------------------------*/

	this.$init(code, line);

	/*-----------------------------------------------------------------*/
};

/*-------------------------------------------------------------------------*/
/* ami.twig.expr.Compiler                                                  */
/*-------------------------------------------------------------------------*/

/**
 * The AMI TWIG expression compiler
 * @see An online <a href="http://cern.ch/ami/twig/" target="_blank">demo</a>.
 * @class ami/twig/expr/Compiler
 * @param {String} code the code
 * @param {Number} line the line
 * @throws {String} The error description
 */

ami.twig.expr.Compiler = function(code, line) {
	/*-----------------------------------------------------------------*/

	this.$init = function(code, line)
	{
		/*---------------------------------------------------------*/

		this.tokenizer = new ami.twig.expr.Tokenizer(
			this.code = code,
			this.line = line
		);

		/*---------------------------------------------------------*/

		this.rootNode = this.parseFilter();

		if(!this.tokenizer.isEmpty())
		{
			throw 'syntax error, line `' + this.line + '`, unexpected token `' + this.tokenizer.peekToken() + '`';
		}

		/*---------------------------------------------------------*/
	};

	/*-----------------------------------------------------------------*/

	/**
	  * Dump the abstract abstract syntax tree to a dot diagram
	  * @returns {String} The dot diagram
	  */

	this.dump = function()
	{
		return this.rootNode.dump();
	};

	/*-----------------------------------------------------------------*/

	this.parseFilter = function()
	{
		var left = this.parseLogicalOr(), node;

		/*---------------------------------------------------------*/
		/* Filter : LogicalOr '|' FunVar                           */
		/*---------------------------------------------------------*/

		while(this.tokenizer.checkType(ami.twig.expr.tokens.PIPE))
		{
			this.tokenizer.next();

			node = this.parseFunVar(true);

			node.list.unshift(left);

			left = node;
		}

		/*---------------------------------------------------------*/
		/*        | LogicalOr                                      */
		/*---------------------------------------------------------*/

		return left;
	},

	/*-----------------------------------------------------------------*/

	this.parseLogicalOr = function()
	{
		var left = this.parseLogicalAnd(), right, node;

		/*---------------------------------------------------------*/
		/* LogicalOr : LogicalAnd 'or' LogicalOr                   */
		/*---------------------------------------------------------*/

		if(this.tokenizer.checkType(ami.twig.expr.tokens.LOGICAL_OR))
		{
			node = new ami.twig.expr.Node(this.tokenizer.peekType(), this.tokenizer.peekToken());
			this.tokenizer.next();

			right = this.parseLogicalOr();

			node.nodeLeft = left;
			node.nodeRight = right;

			left = node;
		}

		/*---------------------------------------------------------*/
		/*           | LogicalAnd                                  */
		/*---------------------------------------------------------*/

		return left;
	};

	/*-----------------------------------------------------------------*/

	this.parseLogicalAnd = function()
	{
		var left = this.parseBitwiseOr(), right, node;

		/*---------------------------------------------------------*/
		/* LogicalAnd : BitwiseOr 'and' LogicalAnd                 */
		/*---------------------------------------------------------*/

		if(this.tokenizer.checkType(ami.twig.expr.tokens.LOGICAL_AND))
		{
			node = new ami.twig.expr.Node(this.tokenizer.peekType(), this.tokenizer.peekToken());
			this.tokenizer.next();

			right = this.parseLogicalAnd();

			node.nodeLeft = left;
			node.nodeRight = right;

			left = node;
		}

		/*---------------------------------------------------------*/
		/*            | BitwiseOr                                  */
		/*---------------------------------------------------------*/

		return left;
	};

	/*-----------------------------------------------------------------*/

	this.parseBitwiseOr = function()
	{
		var left = this.parseBitwiseXor(), right, node;

		/*---------------------------------------------------------*/
		/* BitwiseOr : BitwiseXor 'b-or' BitwiseOr                 */
		/*---------------------------------------------------------*/

		if(this.tokenizer.checkType(ami.twig.expr.tokens.BITWISE_OR))
		{
			node = new ami.twig.expr.Node(this.tokenizer.peekType(), this.tokenizer.peekToken());
			this.tokenizer.next();

			right = this.parseBitwiseOr();

			node.nodeLeft = left;
			node.nodeRight = right;

			left = node;
		}

		/*---------------------------------------------------------*/
		/*           | BitwiseXor                                  */
		/*---------------------------------------------------------*/

		return left;
	};

	/*-----------------------------------------------------------------*/

	this.parseBitwiseXor = function()
	{
		var left = this.parseBitwiseAnd(), right, node;

		/*---------------------------------------------------------*/
		/* BitwiseXor : BitwiseAnd 'b-xor' parseBitwiseXor         */
		/*---------------------------------------------------------*/

		if(this.tokenizer.checkType(ami.twig.expr.tokens.BITWISE_XOR))
		{
			node = new ami.twig.expr.Node(this.tokenizer.peekType(), this.tokenizer.peekToken());
			this.tokenizer.next();

			right = this.parseBitwiseXor();

			node.nodeLeft = left;
			node.nodeRight = right;

			left = node;
		}

		/*---------------------------------------------------------*/
		/*            | BitwiseAnd                                 */
		/*---------------------------------------------------------*/

		return left;
	};

	/*-----------------------------------------------------------------*/

	this.parseBitwiseAnd = function()
	{
		var left = this.parseComp(), right, node;

		/*---------------------------------------------------------*/
		/* BitwiseAnd : Comp 'b-and' BitwiseAnd                    */
		/*---------------------------------------------------------*/

		if(this.tokenizer.checkType(ami.twig.expr.tokens.BITWISE_AND))
		{
			node = new ami.twig.expr.Node(this.tokenizer.peekType(), this.tokenizer.peekToken());
			this.tokenizer.next();

			right = this.parseBitwiseAnd();

			node.nodeLeft = left;
			node.nodeRight = right;

			left = node;
		}

		/*---------------------------------------------------------*/
		/*            | Comp                                       */
		/*---------------------------------------------------------*/

		return left;
	};

	/*-----------------------------------------------------------------*/

	this.parseComp = function()
	{
		var left = this.parseAddSub(), right, node, swap;

		/*---------------------------------------------------------*/
		/* Comp : AddSub 'is' 'not'? ('defined' | 'null' | ...)    */
		/*---------------------------------------------------------*/

		/**/ if(this.tokenizer.checkType(ami.twig.expr.tokens.IS))
		{
			node = new ami.twig.expr.Node(this.tokenizer.peekType(), this.tokenizer.peekToken());
			this.tokenizer.next();

			/* swap 'is' and 'not' */
			swap = node;
			/* swap 'is' and 'not' */

			if(this.tokenizer.checkType(ami.twig.expr.tokens.NOT))
			{
				node = new ami.twig.expr.Node(this.tokenizer.peekType(), this.tokenizer.peekToken());
				this.tokenizer.next();

				node.nodeLeft = null;
				node.nodeRight = swap;
			}

			if(this.tokenizer.checkType(ami.twig.expr.tokens.IS_XXX))
			{
				right = new ami.twig.expr.Node(this.tokenizer.peekType(), this.tokenizer.peekToken());
				this.tokenizer.next();

				swap.nodeLeft = left;
				swap.nodeRight = right;
			}
			else
			{
				throw 'syntax error, line `' + this.line + '`, keyword `defined`, `null`, `empty`, `iterable`, `even` or `odd` expected';
			}

			left = node;
		}

		/*---------------------------------------------------------*/
		/*      | AddSub ('===' | '==' | ...) AddSub               */
		/*---------------------------------------------------------*/

		else if(this.tokenizer.checkType(ami.twig.expr.tokens.CMP_OP))
		{
			node = new ami.twig.expr.Node(this.tokenizer.peekType(), this.tokenizer.peekToken());
			this.tokenizer.next();

			right = this.parseAddSub();

			node.nodeLeft = left;
			node.nodeRight = right;

			left = node;
		}

		/*---------------------------------------------------------*/
		/*      | AddSub ('starts' | 'ends') `with` AddSub         */
		/*---------------------------------------------------------*/

		else if(this.tokenizer.checkType(ami.twig.expr.tokens.XXX_WITH))
		{
			node = new ami.twig.expr.Node(this.tokenizer.peekType(), this.tokenizer.peekToken());
			this.tokenizer.next();

			right = this.parseAddSub();

			node.nodeLeft = left;
			node.nodeRight = right;

			left = node;
		}

		/*---------------------------------------------------------*/
		/*      | AddSub 'matches' AddSub                          */
		/*---------------------------------------------------------*/

		else if(this.tokenizer.checkType(ami.twig.expr.tokens.MATCHES))
		{
			node = new ami.twig.expr.Node(this.tokenizer.peekType(), this.tokenizer.peekToken());
			this.tokenizer.next();

			right = this.parseAddSub();

			node.nodeLeft = left;
			node.nodeRight = right;

			left = node;
		}

		/*---------------------------------------------------------*/
		/*      | AddSub 'in' X                                    */
		/*---------------------------------------------------------*/

		else if(this.tokenizer.checkType(ami.twig.expr.tokens.IN))
		{
			node = new ami.twig.expr.Node(this.tokenizer.peekType(), this.tokenizer.peekToken());
			this.tokenizer.next();

			right = this.parseX();

			node.nodeLeft = left;
			node.nodeRight = right;

			left = node;
		}

		/*---------------------------------------------------------*/
		/*      | AddSub                                           */
		/*---------------------------------------------------------*/

		return left;
	};

	/*-----------------------------------------------------------------*/

	this.parseAddSub = function()
	{
		var left = this.parseMulDiv(), right, node;

		/*---------------------------------------------------------*/
		/* AddSub : MulDiv ('+' | '-') AddSub                      */
		/*---------------------------------------------------------*/

		if(this.tokenizer.checkType(ami.twig.expr.tokens.PLUS_MINUS))
		{
			node = new ami.twig.expr.Node(this.tokenizer.peekType(), this.tokenizer.peekToken());
			this.tokenizer.next();

			right = this.parseAddSub();

			node.nodeLeft = left;
			node.nodeRight = right;

			left = node;
		}

		/*---------------------------------------------------------*/
		/*        | MulDiv                                         */
		/*---------------------------------------------------------*/

		return left;
	};

	/*-----------------------------------------------------------------*/

	this.parseMulDiv = function()
	{
		var left = this.parsePower(), right, node;

		/*---------------------------------------------------------*/
		/* MulDiv : Power ('*' | '//' | '/' | '%') MulDiv          */
		/*---------------------------------------------------------*/

		if(this.tokenizer.checkType(ami.twig.expr.tokens.MUL_FLDIV_DIV_MOD))
		{
			node = new ami.twig.expr.Node(this.tokenizer.peekType(), this.tokenizer.peekToken());
			this.tokenizer.next();

			right = this.parseMulDiv();

			node.nodeLeft = left;
			node.nodeRight = right;

			left = node;
		}

		/*---------------------------------------------------------*/
		/*        | Power                                          */
		/*---------------------------------------------------------*/

		return left;
	};

	/*-----------------------------------------------------------------*/

	this.parsePower = function()
	{
		var left = this.parseNotPlusMinus(), right, node;

		/*---------------------------------------------------------*/
		/* Power : NotPlusMinus '**' Power                         */
		/*---------------------------------------------------------*/

		if(this.tokenizer.checkType(ami.twig.expr.tokens.POWER))
		{
			node = new ami.twig.expr.Node(this.tokenizer.peekType(), this.tokenizer.peekToken());
			this.tokenizer.next();

			right = this.parsePower();

			node.nodeLeft = left;
			node.nodeRight = right;

			left = node;
		}

		/*---------------------------------------------------------*/
		/*       | NotPlusMinus                                    */
		/*---------------------------------------------------------*/

		return left;
	};

	/*-----------------------------------------------------------------*/

	this.parseNotPlusMinus = function()
	{
		var left = null, right, node;

		/*---------------------------------------------------------*/
		/* NotPlusMinus : ('not' | '-' | '+') Y                    */
		/*---------------------------------------------------------*/

		if(this.tokenizer.checkType(ami.twig.expr.tokens.NOT_PLUS_MINUS))
		{
			node = new ami.twig.expr.Node(this.tokenizer.peekType(), this.tokenizer.peekToken());
			this.tokenizer.next();

			right = this.parseY();

			node.nodeLeft = left;
			node.nodeRight = right;

			return node;
		}

		/*---------------------------------------------------------*/
		/*              | Y                                        */
		/*---------------------------------------------------------*/

		return this.parseY();
	};

	/*-----------------------------------------------------------------*/

	this.parseX = function()
	{
		var node;

		/*---------------------------------------------------------*/
		/* X : Array | Object | FunVar | Terminal                  */
		/*---------------------------------------------------------*/

		if((node = this.parseArray())) {
			return node;
		}

		if((node = this.parseObject())) {
			return node;
		}

		if((node = this.parseFunVar())) {
			return node;
		}

		if((node = this.parseTerminal())) {
			return node;
		}

		/*---------------------------------------------------------*/
		/* SYNTAX ERROR                                            */
		/*---------------------------------------------------------*/

		throw 'syntax error, line `' + this.line + '`, syntax error or tuncated expression';

		/*---------------------------------------------------------*/
	};

	/*-----------------------------------------------------------------*/

	this.parseY = function()
	{
		var node;

		/*---------------------------------------------------------*/
		/* X : Group | Array | Object | FunVar | Terminal          */
		/*---------------------------------------------------------*/

		if((node = this.parseGroup())) {
			return node;
		}

		if((node = this.parseArray())) {
			return node;
		}

		if((node = this.parseObject())) {
			return node;
		}

		if((node = this.parseFunVar())) {
			return node;
		}

		if((node = this.parseTerminal())) {
			return node;
		}

		/*---------------------------------------------------------*/
		/* SYNTAX ERROR                                            */
		/*---------------------------------------------------------*/

		throw 'syntax error, line `' + this.line + '`, syntax error or tuncated expression';

		/*---------------------------------------------------------*/
	};

	/*-----------------------------------------------------------------*/

	this.parseGroup = function()
	{
		var node;

		/*---------------------------------------------------------*/
		/* Group : '(' Filter ')'                                  */
		/*---------------------------------------------------------*/

		if(this.tokenizer.checkType(ami.twig.expr.tokens.LP))
		{
			this.tokenizer.next();

			node = this.parseFilter();

			if(this.tokenizer.checkType(ami.twig.expr.tokens.RP))
			{
				this.tokenizer.next();

				return node;
			}
			else
			{
				throw 'syntax error, line `' + this.line + '`, `)` expected';
			}
		}

		/*---------------------------------------------------------*/

		return null;
	};

	/*-----------------------------------------------------------------*/

	this.parseArray = function()
	{
		var node, L;

		/*---------------------------------------------------------*/
		/* Array : '[' Singlets ']'                                */
		/*---------------------------------------------------------*/

		if(this.tokenizer.checkType(ami.twig.expr.tokens.LB1))
		{
			this.tokenizer.next();

			L = this._parseSinglets();

			if(this.tokenizer.checkType(ami.twig.expr.tokens.RB1))
			{
				this.tokenizer.next();

				node = new ami.twig.expr.Node(ami.twig.expr.tokens.LST, 'Array');
				node.list = L;
				return node;
			}
			else
			{
				throw 'syntax error, line `' + this.line + '`, `]` expected';
			}
		}

		/*---------------------------------------------------------*/

		return null;
	};

	/*-----------------------------------------------------------------*/

	this.parseObject = function()
	{
		var node, D;

		/*---------------------------------------------------------*/
		/* Object : '{' Doublets '}'                               */
		/*---------------------------------------------------------*/

		if(this.tokenizer.checkType(ami.twig.expr.tokens.LB2))
		{
			this.tokenizer.next();

			D = this._parseDoublets();

			if(this.tokenizer.checkType(ami.twig.expr.tokens.RB2))
			{
				this.tokenizer.next();

				node = new ami.twig.expr.Node(ami.twig.expr.tokens.DIC, 'Object');
				node.dict = D;
				return node;
			}
			else
			{
				throw 'syntax error, line `' + this.line + '`, `}` expected';
			}
		}

		/*---------------------------------------------------------*/

		return null;
	};

	/*-----------------------------------------------------------------*/

	this.parseFunVar = function(isFilter)
	{
		var node, L;

		var qid = '';

		if(this.tokenizer.checkType(ami.twig.expr.tokens.SID))
		{
			qid += this.tokenizer.peekToken();
			this.tokenizer.next();

			while(this.tokenizer.checkType(ami.twig.expr.tokens.DOT))
			{
				qid += this.tokenizer.peekToken();
				this.tokenizer.next();

				if(this.tokenizer.checkType(ami.twig.expr.tokens.SID))
				{
					qid += this.tokenizer.peekToken();
					this.tokenizer.next();
				}
				else
				{
					throw 'syntax error, line `' + this.line + '`, qid expected';
				}
			}

			/*-------------------------------------------------*/
			/* RESERVED IDENTIFIERS                            */
			/*-------------------------------------------------*/

			if(qid === 'true'
			   ||
			   qid === 'false'
			 ) {
				return new ami.twig.expr.Node(ami.twig.expr.tokens.TERMINAL, qid);
			}

			/*-------------------------------------------------*/
			/* FunVar : SID ('.' SID)* '(' Singlets ')'        */
			/*-------------------------------------------------*/

			if(this.tokenizer.checkType(ami.twig.expr.tokens.LP))
			{
				this.tokenizer.next();

				L = this._parseSinglets();

				if(this.tokenizer.checkType(ami.twig.expr.tokens.RP))
				{
					this.tokenizer.next();
				}
				else
				{
					throw 'syntax error, line `' + this.line + '`, `)` expected';
				}

				node = new ami.twig.expr.Node(ami.twig.expr.tokens.FUN, 'ami.twig.stdlib.' + qid);
				node.list = L;
				return node;
			}

			/*-------------------------------------------------*/
			/*        | SID ('.' SID)* '[' Singlets ']'        */
			/*-------------------------------------------------*/

			if(this.tokenizer.checkType(ami.twig.expr.tokens.LB1))
			{
				this.tokenizer.next();

				L = this._parseSinglets();

				if(this.tokenizer.checkType(ami.twig.expr.tokens.RB1))
				{
					this.tokenizer.next();
				}
				else
				{
					throw 'syntax error, line `' + this.line + '`, `]` expected';
				}

				node = new ami.twig.expr.Node(ami.twig.expr.tokens.VAR, ((((((('_.'))))))) + qid);
				node.list = L;
				return node;
			}

			/*-------------------------------------------------*/
			/*        | SID ('.' SID)*                         */
			/*-------------------------------------------------*/

			if(isFilter)
			{
				node = new ami.twig.expr.Node(ami.twig.expr.tokens.FUN, 'ami.twig.stdlib.' + qid);
				node.list = [  ];
				return node;
			}
			else
			{
				node = new ami.twig.expr.Node(ami.twig.expr.tokens.VAR, ((((((('_.'))))))) + qid);
				node.list = null;
				return node;
			}

			/*-------------------------------------------------*/
		}

		/*---------------------------------------------------------*/

		return null;
	};

	/*-----------------------------------------------------------------*/

	this._parseSinglets = function()
	{
		var result = [];

		while(this.tokenizer.checkType(ami.twig.expr.tokens.RX) === false)
		{
			this._parseSinglet(result);

			if(this.tokenizer.checkType(ami.twig.expr.tokens.COMMA) === true)
			{
				this.tokenizer.next();
			}
			else
			{
				break;
			}
		}

		return result;
	};

	/*-----------------------------------------------------------------*/

	this._parseDoublets = function()
	{
		var result = {};

		while(this.tokenizer.checkType(ami.twig.expr.tokens.RB2) === false)
		{
			this._parseDoublet(result);

			if(this.tokenizer.checkType(ami.twig.expr.tokens.COMMA) === true)
			{
				this.tokenizer.next();
			}
			else
			{
				break;
			}
		}

		return result;
	};

	/*-----------------------------------------------------------------*/

	this._parseSinglet = function(result)
	{
		result.push(this.parseFilter());
	},

	/*-----------------------------------------------------------------*/

	this._parseDoublet = function(result)
	{
		if(this.tokenizer.checkType(ami.twig.expr.tokens.TERMINAL))
		{
			var key = this.tokenizer.peekToken();
			this.tokenizer.next();

			if(this.tokenizer.checkType(ami.twig.expr.tokens.COLON))
			{
/*				var colon = this.tokenizer.peekToken();
 */				this.tokenizer.next();

				/*-----------------------------------------*/

				result[key] = this.parseFilter();

				/*-----------------------------------------*/
			}
			else
			{
				throw 'syntax error, line `' + this.line + '`, `:` expected';
			}
		}
		else
		{
			throw 'syntax error, line `' + this.line + '`, terminal expected';
		}
	},

	/*-----------------------------------------------------------------*/

	this.parseTerminal = function()
	{
		var left, right, node;

		/*---------------------------------------------------------*/
		/* Terminal : TERMINAL | RANGE                             */
		/*---------------------------------------------------------*/

		if(this.tokenizer.checkType(ami.twig.expr.tokens.TERMINAL))
		{
			left = new ami.twig.expr.Node(this.tokenizer.peekType(), this.tokenizer.peekToken());
			this.tokenizer.next();

			if(this.tokenizer.checkType(ami.twig.expr.tokens.RANGE))
			{
				node = new ami.twig.expr.Node(((ami.twig.expr.tokens.RANGE)), this.tokenizer.peekToken());
				this.tokenizer.next();

				if(this.tokenizer.checkType(ami.twig.expr.tokens.TERMINAL))
				{
					right = new ami.twig.expr.Node(this.tokenizer.peekType(), this.tokenizer.peekToken());
					this.tokenizer.next();

					node.nodeLeft = left;
					node.nodeRight = right;

					return node;
				}
			}
			else
			{
				return left;
			}
		}

		/*---------------------------------------------------------*/

		return null;
	};

	/*-----------------------------------------------------------------*/

	this.$init(code, line);

	/*-----------------------------------------------------------------*/
};

/*-------------------------------------------------------------------------*/
/* ami.twig.expr.Node                                                      */
/*-------------------------------------------------------------------------*/

ami.twig.expr.Node = function(nodeType, nodeValue) {
	/*-----------------------------------------------------------------*/

	this.$init = function(nodeType, nodeValue)
	{
		this.nodeType = nodeType;
		this.nodeValue = nodeValue;
		this.nodeLeft = null;
		this.nodeRight = null;
		this.list = null;
		this.dict = null;
	};

	/*-----------------------------------------------------------------*/

	this._dump = function(nodes, edges, pCnt)
	{
		var i, cnt = pCnt[0], CNT;

		nodes.push('\tnode' + cnt + ' [label="' + this.nodeValue.replace(/"/g, '\\"') + '"];');

		if(this.nodeLeft)
		{
			CNT = ++pCnt[0];
			edges.push('\tnode' + cnt + ' -> node' + CNT + ';');
			this.nodeLeft._dump(nodes, edges, pCnt);
		}

		if(this.nodeRight)
		{
			CNT = ++pCnt[0];
			edges.push('\tnode' + cnt + ' -> node' + CNT + ';');
			this.nodeRight._dump(nodes, edges, pCnt);
		}

		if(this.list)
		{
			for(i in this.list)
			{
				CNT = ++pCnt[0];
				edges.push('\tnode' + cnt + ' -> node' + CNT + ' [label="[' + i.replace(/"/g, '\\"') + ']"];');
				this.list[i]._dump(nodes, edges, pCnt);
			}
		}

		if(this.dict)
		{
			for(i in this.dict)
			{
				CNT = ++pCnt[0];
				edges.push('\tnode' + cnt + ' -> node' + CNT + ' [label="[' + i.replace(/"/g, '\\"') + ']"];');
				this.dict[i]._dump(nodes, edges, pCnt);
			}
		}
	};

	/*-----------------------------------------------------------------*/

	this.dump = function()
	{
		var nodes = [];
		var edges = [];

		this._dump(nodes, edges, [0]);

		return 'digraph ast {\n\trankdir=TB;\n' + nodes.join('\n') + '\n' + edges.join('\n') + '\n}';
	};

	/*-----------------------------------------------------------------*/

	this.$init(nodeType, nodeValue);

	/*-----------------------------------------------------------------*/
};

/*-------------------------------------------------------------------------*/
/*
 * AMI TWIG Engine
 *
 * Copyright (c) 2014-2015 The AMI Team
 * http://www.cecill.info/licences/Licence_CeCILL-C_V1-en.html
 *
 */

/*-------------------------------------------------------------------------*/
/* ami.twig.ajax                                                           */
/*-------------------------------------------------------------------------*/

/**
 * The AMI TWIG Ajax
 * @namespace ami/twig/ajax
 */

ami.twig.ajax = {
	/*-----------------------------------------------------------------*/

	get: function(fileName, done, fail)
	{
		if(typeof exports !== 'undefined')
		{
			/*-------------------------------------------------*/
			/* NODEJS                                          */
			/*-------------------------------------------------*/

			try
			{
				var txt = ami.fs.readFileSync(fileName, 'utf8');

				if(done) {
					done(txt);
				}
			}
			catch(err)
			{
				if(fail) {
					fail(err);
				}
			}

			/*-------------------------------------------------*/
		}
		else
		{
			/*-------------------------------------------------*/
			/* BROWSER                                         */
			/*-------------------------------------------------*/

			var xmlHttpRequest = new XMLHttpRequest();

			xmlHttpRequest.open('GET', fileName, false);
			xmlHttpRequest.send();

			/*-------------------------------------------------*/

			if(xmlHttpRequest.status === 200)
			{
				if(done) {
					done(xmlHttpRequest.responseText);
				}
			}
			else
			{
				if(fail) {
					fail(xmlHttpRequest.responseText);
				}
			}

			/*-------------------------------------------------*/
		}
	},

	/*-----------------------------------------------------------------*/
};

/*-------------------------------------------------------------------------*/
/*
 * AMI TWIG Engine
 *
 * Copyright (c) 2014-2015 The AMI Team
 * http://www.cecill.info/licences/Licence_CeCILL-C_V1-en.html
 *
 */

/*-------------------------------------------------------------------------*/
/* ami.twig.engine                                                         */
/*-------------------------------------------------------------------------*/

/**
 * The AMI TWIG Engine
 * @namespace ami/twig
 */

ami.twig.engine = {
	/*-----------------------------------------------------------------*/

	STATEMENT_RE: /\{\%\s*([a-zA-Z]+)\s*(.*?)\s*\%\}/m,

	VARIABLE_RE: /\{\{\s*(.*?)\s*\}\}/g,

	/*-----------------------------------------------------------------*/

	STACK_ITEM_IF_TRY_AGAIN: 0,
	STACK_ITEM_IF_TRUE_DONE: 1,
	STACK_ITEM_IF_TRUE_TODO: 2,
	STACK_ITEM_FOR: 3,
	STACK_ITEM_FILTER: 4,
	STACK_ITEM_0: 5,

	/*-----------------------------------------------------------------*/

	_newStackItem: function(type, symb, iter)
	{
		if(!symb) {
			symb = (null);
		}

		if(!iter) {
			iter = [null];
		}

		return {
			type: type,
			symb: symb,
			iter: iter,
		};
	},

	/*-----------------------------------------------------------------*/

	_showContent: function(stack)
	{
		/*---------------------------------------------------------*/

		var lastIndex = stack.length - 1;

		/*---------------------------------------------------------*/

		if(stack[lastIndex].type === this.STACK_ITEM_IF_TRY_AGAIN
		   ||
		   stack[lastIndex].type === this.STACK_ITEM_IF_TRUE_DONE
		 ) {
			return false;
		}

		/*---------------------------------------------------------*/

		for(var i = 0; i < lastIndex; i++)
		{
			if(stack[i].type === this.STACK_ITEM_IF_TRY_AGAIN)
			{
				return false;
			}
		}

		/*---------------------------------------------------------*/

		return true;
	},

	/*-----------------------------------------------------------------*/

	render: function(s, dict)
	{
		/*---------------------------------------------------------*/

		var result = '';

		/*---------------------------------------------------------*/
		/*                                                         */
		/*---------------------------------------------------------*/

		var stack = [this._newStackItem(this.STACK_ITEM_0)], lastStackItem;

		/*---------------------------------------------------------*/

		var column_nr = 0;
		var COLUMN_NR = 0;

		var line = 1;

		/*---------------------------------------------------------*/

		var parts, symb, expr, DICT, i;

		/*---------------------------------------------------------*/
		/*                                                         */
		/*---------------------------------------------------------*/

		for(;; s = s.substr(COLUMN_NR))
		{
			/*-------------------------------------------------*/
			/*                                                 */
			/*-------------------------------------------------*/

			lastStackItem = stack[stack.length - 1];

			/*-------------------------------------------------*/
			/*                                                 */
			/*-------------------------------------------------*/

			var m = s.match(this.STATEMENT_RE);

			/*-------------------------------------------------*/

			if(m === null)
			{
				/*-----------------------------------------*/
				/* GET LINE NUMBER                         */
				/*-----------------------------------------*/

				for(i in s)
				{
					if(s[i] === '\n')
					{
						line++;
					}
				}

				/*-----------------------------------------*/
				/* GENERATE HTML                           */
				/*-----------------------------------------*/

				if(this._showContent(stack))
				{
					result += s.replace(this.VARIABLE_RE, function(match, expression) {

						return ami.twig.expr.interpreter.eval(
							new ami.twig.expr.Compiler(expression, line), dict
						);
					});
				}

				/*-----------------------------------------*/
				/* CHECK FOR NON-CLOSED BLOCKS             */
				/*-----------------------------------------*/

				var msg = [];

				for(i = 1; i < stack.length; i++)
				{
					var x = stack[i].type;

					/**/ if(x === this.STACK_ITEM_IF_TRY_AGAIN
					        ||
					        x === this.STACK_ITEM_IF_TRUE_DONE
					        ||
					        x === this.STACK_ITEM_IF_TRUE_TODO
					 ) {
					 	msg.push('missing keyword `endif`');
					 }
					 else if(x === this.STACK_ITEM_FOR)
					 {
					 	msg.push('missing keyword `endfor`');
					 }
					 else if(x === this.STACK_ITEM_FILTER)
					 {
					 	msg.push('missing keyword `endfilter`');
					 }
				}

				if(msg.length > 0)
				{
					throw 'syntax error, line `' + line + '`, ' + msg.join(', ');
				}

				/*-----------------------------------------*/

				return result;
			}

			/*-------------------------------------------------*/

			var match = m[0];
			var keyword = m[1];
			var expression = m[2];

			/*-------------------------------------------------*/
			/* GET POSITION AND LINE NUMBER                    */
			/*-------------------------------------------------*/

			column_nr = m.index + 0x0000000000;
			COLUMN_NR = m.index + match.length;

			for(i in match)
			{
				if(match[i] === '\n')
				{
					line++;
				}
			}

			/*-------------------------------------------------*/
			/*                                                 */
			/*-------------------------------------------------*/

			var showContent = this._showContent(stack);

			/*-------------------------------------------------*/
			/* GENERATE HTML                                   */
			/*-------------------------------------------------*/

			if(showContent)
			{
				var SYMB = lastStackItem.symb;
				var ITER = lastStackItem.iter;

				if(SYMB)
				{
					/* CLONE */
					DICT = {}; for(i in dict) DICT[i] = dict[i];
					/* CLONE */

					for(i in ITER)
					{
						DICT[SYMB] = ITER[i];

						result += s.substr(0, column_nr).replace(this.VARIABLE_RE, function(match, expression) {

							return ami.twig.expr.interpreter.eval(
								new ami.twig.expr.Compiler(expression, line), DICT
							);
						});
					}
				}
				else
				{
					result += s.substr(0, column_nr).replace(this.VARIABLE_RE, function(match, expression) {

						return ami.twig.expr.interpreter.eval(
							new ami.twig.expr.Compiler(expression, line), dict
						);
					});
				}
			}

			/*-------------------------------------------------*/
			/* INCLUDE KEYWORD                                 */
			/*-------------------------------------------------*/

			/**/ if(keyword === 'include')
			{
				if(showContent)
				{
					/*---------------------------------*/

					var only_subexpr;

					expression = expression.trim();

					if((m = expression.match(/(only)$/)))
					{
						expression = expression.substr(expression, expression.length - m[0].length - 1);
						
						only_subexpr = m[1];
					}
					else
					{
						only_subexpr = null;
					}

					/*---------------------------------*/

					var with_subexpr;

					expression = expression.trim();

					if((m = expression.match(/with\s+(([a-zA-Z_$]|{).*)/)))
					{
						expression = expression.substr(expression, expression.length - m[0].length - 1);

						with_subexpr = m[1];
					}
					else
					{
						with_subexpr = null;
					}

					/*---------------------------------*/

					var FILENAME = ami.twig.expr.interpreter.eval(
						new ami.twig.expr.Compiler(expression, line), dict
					);

					if(with_subexpr)
					{
						DICT = ami.twig.expr.interpreter.eval(
							new ami.twig.expr.Compiler(with_subexpr, line), dict
						);

						if(!(DICT instanceof Object))
						{
							throw 'runtime error, line `' + line + '`, dictionary expected';
						}
					}
					else
					{
						DICT = {};
					}

					if(!only_subexpr)
					{
						for(i in dict) DICT[i] = dict[i];
					}

					/*---------------------------------*/

					ami.twig.ajax.get(
						FILENAME,
						function(data) {
							result += ami.twig.engine.render(data, DICT);
						},
						function(/**/) {
							throw 'runtime error, line `' + line + '`, could not open `' + FILENAME + '`';
						}
					);

					/*---------------------------------*/
				}
			}

			/*-------------------------------------------------*/
			/* SET KEYWORD                                     */
			/*-------------------------------------------------*/

			else if(keyword === 'set')
			{
				/*-----------------------------------------*/

				parts = expression.split('=');

				/*-----------------------------------------*/

				symb = parts[0].trim();
				expr = parts[1].trim();

				var value = ami.twig.expr.interpreter.eval(new ami.twig.expr.Compiler(expr, line), dict);

				/*-----------------------------------------*/

				dict[symb] = value;

				/*-----------------------------------------*/
			}

			/*-------------------------------------------------*/
			/* IF KEYWORD                                      */
			/*-------------------------------------------------*/

			else if(keyword === 'if')
			{
				stack.push(this._newStackItem(ami.twig.expr.interpreter.eval(new ami.twig.expr.Compiler(expression, line), dict) ? this.STACK_ITEM_IF_TRUE_TODO : this.STACK_ITEM_IF_TRY_AGAIN));
			}

			/*-------------------------------------------------*/
			/* ELSEIF KEYWORD                                  */
			/*-------------------------------------------------*/

			else if(keyword === 'elseif')
			{
				if(lastStackItem.type !== this.STACK_ITEM_IF_TRY_AGAIN
				   &&
				   lastStackItem.type !== this.STACK_ITEM_IF_TRUE_DONE
				   &&
				   lastStackItem.type !== this.STACK_ITEM_IF_TRUE_TODO
				 ) {
					throw 'syntax error, line `' + line + '`, missing keyword `if`';
				}

				/**/ if(lastStackItem.type === this.STACK_ITEM_IF_TRY_AGAIN)
				{
					lastStackItem.type = ami.twig.expr.interpreter.eval(new ami.twig.expr.Compiler(expression, line), dict) ? this.STACK_ITEM_IF_TRUE_TODO : this.STACK_ITEM_IF_TRY_AGAIN;
				}
				else if(lastStackItem.type === this.STACK_ITEM_IF_TRUE_TODO)
				{
					lastStackItem.type = this.STACK_ITEM_IF_TRUE_DONE;
				}
			}

			/*-------------------------------------------------*/
			/* ELSE KEYWORD                                    */
			/*-------------------------------------------------*/

			else if(keyword === 'else')
			{
				if(lastStackItem.type !== this.STACK_ITEM_IF_TRY_AGAIN
				   &&
				   lastStackItem.type !== this.STACK_ITEM_IF_TRUE_DONE
				   &&
				   lastStackItem.type !== this.STACK_ITEM_IF_TRUE_TODO
				 ) {
					throw 'syntax error, line `' + line + '`, missing keyword `if`';
				}

				/**/ if(lastStackItem.type === this.STACK_ITEM_IF_TRY_AGAIN)
				{
					lastStackItem.type = this.STACK_ITEM_IF_TRUE_TODO;
				}
				else if(lastStackItem.type === this.STACK_ITEM_IF_TRUE_TODO)
				{
					lastStackItem.type = this.STACK_ITEM_IF_TRUE_DONE;
				}
			}

			/*-------------------------------------------------*/
			/* ENDIF KEYWORD                                   */
			/*-------------------------------------------------*/

			else if(keyword === 'endif')
			{
				if(lastStackItem.type !== this.STACK_ITEM_IF_TRY_AGAIN
				   &&
				   lastStackItem.type !== this.STACK_ITEM_IF_TRUE_DONE
				   &&
				   lastStackItem.type !== this.STACK_ITEM_IF_TRUE_TODO
				 ) {
					throw 'syntax error, line `' + line + '`, missing keyword `if`';
				}

				stack.pop();
			}

			/*-------------------------------------------------*/
			/* FILTER KEYWORD                                  */
			/*-------------------------------------------------*/

			else if(keyword === 'for')
			{
				/*-----------------------------------------*/

				parts = expression.split('in');

				/*-----------------------------------------*/

				symb = parts[0].trim();
				expr = parts[1].trim();

				var iter = ami.twig.expr.interpreter.eval(new ami.twig.expr.Compiler(expr, line), dict);

				/*-----------------------------------------*/

				if(!(iter instanceof Array)
				   &&
				   !(iter instanceof Object)
				   &&
				   !(iter instanceof String) && !(typeof iter === 'string')
				 ) {
					throw 'runtime error, line `' + line + '`, `' + symb + '` must be iterable';
				}

				/*-----------------------------------------*/

				stack.push(this._newStackItem(this.STACK_ITEM_FOR, symb, iter));

				/*-----------------------------------------*/
			}

			/*-------------------------------------------------*/
			/* ENDFOR KEYWORD                                  */
			/*-------------------------------------------------*/

			else if(keyword === 'endfor')
			{
				if(lastStackItem.type !== this.STACK_ITEM_FOR)
				{
					throw 'syntax error, line `' + line + '`, missing keyword `for`';
				}

				stack.pop();
			}

			/*-------------------------------------------------*/
			/* FILTER KEYWORD                                  */
			/*-------------------------------------------------*/

			else if(keyword === 'filter')
			{
				stack.push(this._newStackItem(this.STACK_ITEM_FILTER));
			}

			/*-------------------------------------------------*/
			/* ENDFILTER KEYWORD                               */
			/*-------------------------------------------------*/

			else if(keyword === 'endfilter')
			{
				if(lastStackItem.type !== this.STACK_ITEM_FILTER)
				{
					throw 'syntax error, line `' + line + '`, missing keyword `filter`';
				}

				stack.pop();
			}

			/*-------------------------------------------------*/
			/* UNKNOWN KEYWORD                                 */
			/*-------------------------------------------------*/

			else
			{
				throw 'syntax error, line `' + line + '`, unknown keyword `' + keyword + '`';
			}

			/*-------------------------------------------------*/
		}

		/*---------------------------------------------------------*/
	},

	/*-----------------------------------------------------------------*/
};

/*-------------------------------------------------------------------------*/
/*
 * AMI TWIG Engine
 *
 * Copyright (c) 2014-2015 The AMI Team
 * http://www.cecill.info/licences/Licence_CeCILL-C_V1-en.html
 *
 */

/*-------------------------------------------------------------------------*/
/* ami.twig.stdlib                                                         */
/*-------------------------------------------------------------------------*/

/**
 * The AMI TWIG StdLib
 * @namespace ami/twig/stdlib
 */

ami.twig.stdlib = {
	/*-----------------------------------------------------------------*/
	/* VARIABLES                                                       */
	/*-----------------------------------------------------------------*/

	'isDefined': function(x)
	{
		return typeof x !== 'undefined';
	},

	/*-----------------------------------------------------------------*/

	'isNull': function(x)
	{
		return x === null;
	},

	/*-----------------------------------------------------------------*/

	'isEmpty': function(x)
	{
		return (x === null || x === false) || (x === '' || x === [] || x === {});
	},

	/*-----------------------------------------------------------------*/

	'isNumber': function(x)
	{
		return x instanceof Number || typeof x === 'number';
	},

	/*-----------------------------------------------------------------*/

	'isString': function(x)
	{
		return x instanceof String || typeof x === 'string';
	},

	/*-----------------------------------------------------------------*/

	'isIterable': function(x)
	{
		return x instanceof Array
		       ||
		       x instanceof Object
		       ||
		       x instanceof String || typeof x === 'string'
		;
	},

	/*-----------------------------------------------------------------*/

	'isEven': function(x)
	{
		return this.isNumber(x) && (x & 1) === 0;
	},

	/*-----------------------------------------------------------------*/

	'isOdd': function(x)
	{
		return this.isNumber(x) && (x & 1) === 1;
	},

	/*-----------------------------------------------------------------*/
	/* ITERABLES                                                       */
	/*-----------------------------------------------------------------*/

	'isInObject': function(x, y)
	{
		if(y instanceof Array
		   ||
		   y instanceof String || typeof y === 'string'
		 ) {
		 	return y.indexOf(x) >= 0;
		}

		if(y instanceof Object)
		{
			return x in y;
		}

		return false;
	},

	/*-----------------------------------------------------------------*/

	'isInRange': function(x, x1, x2)
	{
		/**/ if(this.isNumber(x1)
		        &&
		        this.isNumber(x2)
		 ) {
			return ((((((((x))))))) >= (((((((x1))))))))
			       &&
			       ((((((((x))))))) <= (((((((x2))))))))
			;
		}
		else if(this.isString(x1) && x1.length === 1
		        &&
		        this.isString(x2) && x2.length === 1
		 ) {
			return (x.charCodeAt(0) >= x1.charCodeAt(0))
			       &&
			       (x.charCodeAt(0) <= x2.charCodeAt(0))
			;
		}

		return false;
	},

	/*-----------------------------------------------------------------*/

	'range': function(x1, x2, step)
	{
		var i;

		var result = [];

		if(!step)
		{
			step = 1;
		}

		/**/ if(this.isNumber(x1)
		        &&
		        this.isNumber(x2)
		 ) {
			for(i = (((((((x1))))))); i <= (((((((x2))))))); i += step)
			{
				result.push(/*---------------*/(i));
			}
		}
		else if(this.isString(x1) && x1.length === 1
		        &&
		        this.isString(x2) && x2.length === 1
		 ) {
			for(i = x1.charCodeAt(0); i <= x2.charCodeAt(0); i += step)
			{
				result.push(String.fromCharCode(i));
			}
		}

		return result;
	},

	/*-----------------------------------------------------------------*/

	'length': function(x)
	{
		return this.isIterable(x) ? x.length : 0;
	},

	/*-----------------------------------------------------------------*/

	'first': function(x)
	{
		return this.isIterable(x) && x.length > 0 ? x[0x0000000000] : '';
	},

	/*-----------------------------------------------------------------*/

	'last': function(x)
	{
		return this.isIterable(x) && x.length > 0 ? x[x.length - 1] : '';
	},

	/*-----------------------------------------------------------------*/
	/* STRINGS                                                         */
	/*-----------------------------------------------------------------*/

	'default': function(s1, s2)
	{
		if(this.isString(s1)
		   &&
		   this.isString(s2)
		 ) {
			return this.isEmpty(s1) === false ? s1 : s2;
		}

		return '';
	},

	/*-----------------------------------------------------------------*/

	'startsWith': function(s1, s2)
	{
		if(this.isString(s1)
		   &&
		   this.isString(s2)
		 ) {
			var base = 0x0000000000000000000;

			return s1.indexOf(s2, base) === base;
		}

		return false;
	},

	/*-----------------------------------------------------------------*/

	'endsWith': function(s1, s2)
	{
		if(this.isString(s1)
		   &&
		   this.isString(s2)
		 ) {
			var base = s1.length - s2.length;

			return s1.indexOf(s2, base) === base;
		}

		return false;
	},

	/*-----------------------------------------------------------------*/

	'match': function(s, regex)
	{
		if(this.isString(s)
		   &&
		   this.isString(regex)
		 ) {
			var len = regex.     length     ;
			var idx = regex.lastIndexOf('/');

			if(len < 2
			   ||
			   idx < 0
			   ||
			   regex.charAt(0) !== '/'
			 ) {
				throw 'invalid regular expression `' + regex + '`';
			}

			return new RegExp(
				regex.substring(0x1, idx + 0)
				,
				regex.substring(idx + 1, len)
			).test(s);
		}

		return false;
	},

	/*-----------------------------------------------------------------*/

	'lower': function(s)
	{
		return this.isString(s) ? s.toLowerCase() : '';
	},

	/*-----------------------------------------------------------------*/

	'upper': function(s)
	{
		return this.isString(s) ? s.toUpperCase() : '';
	},

	/*-----------------------------------------------------------------*/

	'trim': function(s)
	{
		return this.isString(s) ? s.trim() : '';
	},

	/*-----------------------------------------------------------------*/

	'escape': function(s, mode)
	{
		if(this.isString(s))
		{
			/**/ if(!mode
			        ||
				mode === 'html'
				||
				mode === 'html_attr'
			 ) {
				s = s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
			}
			else if(mode === 'js')
			{
				s = s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/"/g, '\\\"').replace(/'/g, '\\\'');
			}
			else if(mode === 'url')
			{
				s = encodeURIComponent(s);
			}
		}

		return s;
	},

	/*-----------------------------------------------------------------*/

	'raw': function(s)
	{
		return s;
	},

	/*-----------------------------------------------------------------*/

	'replace': function(s, dict)
	{
		if(this.isString(s) && dict instanceof Object)
		{
			var t = '';

			var i = 0x000000;
			var l = s.length;

			while(i < l)
			{
				for(var key in dict)
				{
					if(s.substring(i).indexOf(key) === 0)
					{
						t += dict[key];

						i += key.length;

						continue;
					}
				}

				t += s.charAt(i++);
			}

			return t;
		}

		return s;
	},

	/*-----------------------------------------------------------------*/
	/* NUMBERS                                                         */
	/*-----------------------------------------------------------------*/

	'abs': function(x)
	{
		return Math.abs(x);
	},

	/*-----------------------------------------------------------------*/

	'min': function()
	{
		/*---------------------------------------------------------*/

		var args = (arguments.length === 1) && (arguments[0] instanceof Array || arguments[0] instanceof Object) ? arguments[0]
		                                                                                                         : arguments
		;

		/*---------------------------------------------------------*/

		var result = Number.POSITIVE_INFINITY;

		for(var i in args)
		{
			var arg = args[i];

			if(this.isNumber(arg) == false)
			{
				return Number.NaN;
			}

			if(result > arg)
			{
				result = arg;
			}
		}

		/*---------------------------------------------------------*/

		return result;
	},

	/*-----------------------------------------------------------------*/

	'max': function()
	{
		/*---------------------------------------------------------*/

		var args = (arguments.length === 1) && (arguments[0] instanceof Array || arguments[0] instanceof Object) ? arguments[0]
		                                                                                                         : arguments
		;

		/*---------------------------------------------------------*/

		var result = Number.NEGATIVE_INFINITY;

		for(var i in args)
		{
			var arg = args[i];

			if(this.isNumber(arg) == false)
			{
				return Number.NaN;
			}

			if(result < arg)
			{
				result = arg;
			}
		}

		/*---------------------------------------------------------*/

		return result;
	},

	/*-----------------------------------------------------------------*/
};

/*-------------------------------------------------------------------------*/
/*
 * AMI TWIG Engine
 *
 * Copyright (c) 2014-2015 The AMI Team
 * http://www.cecill.info/licences/Licence_CeCILL-C_V1-en.html
 *
 */

/*-------------------------------------------------------------------------*/
/* ami.twig.expr.interpreter                                               */
/*-------------------------------------------------------------------------*/

/**
 * The AMI TWIG expression interpreter
 * @see An online <a href="http://cern.ch/ami/twig/" target="_blank">demo</a>.
 * @namespace ami/twig/expr/interpreter
 */

ami.twig.expr.interpreter = {
	/*-----------------------------------------------------------------*/

	_getJS: function(node)
	{
		var i;
		var x;
		var s;

		var left;
		var right;

		var operator;

		/*---------------------------------------------------------*/
		/* LST, DIC, FUNS, VARS, TERMINALS                         */
		/*---------------------------------------------------------*/

		if(node.nodeLeft === null
		   &&
		   node.nodeRight === null
		 ) {
			if(node.list)
			{
			 	/*-----------------------------------------*/

				s = '';

				for(i in node.list)
				{
					s += ',' + this._getJS(node.list[i]);
				}

				if(s)
				{
					s = s.substr(1);
				}

			 	/*-----------------------------------------*/

				/**/ if(node.nodeType === ami.twig.expr.tokens.LST)
				{
					return /*------------*/ '[' + s + ']';
				}
				else if(node.nodeType === ami.twig.expr.tokens.FUN)
				{
					return node.nodeValue + '(' + s + ')';
				}
				else if(node.nodeType === ami.twig.expr.tokens.VAR)
				{
					return node.nodeValue + '[' + s + ']';
				}

			 	/*-----------------------------------------*/

				throw 'internal error';

			 	/*-----------------------------------------*/
			}

			if(node.dict)
			{
			 	/*-----------------------------------------*/

				s = '';

				for(i in node.dict)
				{
					s += ',' + i + ':' + this._getJS(node.dict[i]);
				}

				if(s)
				{
					s = s.substr(1);
				}

			 	/*-----------------------------------------*/

				/**/ if(node.nodeType === ami.twig.expr.tokens.DIC)
				{
					return '{' + s + '}';
				}

			 	/*-----------------------------------------*/

				throw 'internal error';

			 	/*-----------------------------------------*/
			}

			return node.nodeValue;
		}

		/*---------------------------------------------------------*/
		/* UNIARY OPERATORS                                        */
		/*---------------------------------------------------------*/

		if(node.nodeLeft !== null
		   &&
		   node.nodeRight === null
		 ) {
			operator = (node.nodeType !== ami.twig.expr.tokens.NOT) ? node.nodeValue : '!';

			return operator + '(' + this._getJS(node.nodeLeft) + ')';
		}

		if(node.nodeLeft === null
		   &&
		   node.nodeRight !== null
		 ) {
			operator = (node.nodeType !== ami.twig.expr.tokens.NOT) ? node.nodeValue : '!';

			return operator + '(' + this._getJS(node.nodeRight) + ')';
		}

		/*---------------------------------------------------------*/
		/* BINARY OPERATORS                                        */
		/*---------------------------------------------------------*/

		if(node.nodeLeft !== null
		   &&
		   node.nodeRight !== null
		 ) {
			switch(node.nodeType)
			{
				/*-----------------------------------------*/

				case ami.twig.expr.tokens.IS:

					left = this._getJS(node.nodeLeft);

					switch(node.nodeRight.nodeType)
					{
						case ami.twig.expr.tokens.DEFINED:
							return 'ami.twig.stdlib.isDefined(' + left + ')';

						case ami.twig.expr.tokens.NULL:
							return 'ami.twig.stdlib.isNull(' + left + ')';

						case ami.twig.expr.tokens.EMPTY:
							return 'ami.twig.stdlib.isEmpty(' + left + ')';

						case ami.twig.expr.tokens.ITERABLE:
							return 'ami.twig.stdlib.isIterable(' + left + ')';

						case ami.twig.expr.tokens.EVEN:
							return 'ami.twig.stdlib.isEven(' + left + ')';

						case ami.twig.expr.tokens.ODD:
							return 'ami.twig.stdlib.isOdd(' + left + ')';
					}

					throw 'internal error';

				/*-----------------------------------------*/

				case ami.twig.expr.tokens.IN:

					if(node.nodeRight.nodeType !== ami.twig.expr.tokens.RANGE)
					{
						left = this._getJS(node.nodeLeft);
						right = this._getJS(node.nodeRight);

						return 'ami.twig.stdlib.isInObject(' + left + ',' + right + ')';
					}
					else
					{
						x = this._getJS(node.nodeLeft);

						left = node.nodeRight.nodeLeft.nodeValue;
						right = node.nodeRight.nodeRight.nodeValue;

						return 'ami.twig.stdlib.isInRange(' + x + ',' + left + ',' + right + ')';
					}

				/*-----------------------------------------*/

				case ami.twig.expr.tokens.STARTS_WITH:

					left = this._getJS(node.nodeLeft);
					right = this._getJS(node.nodeRight);

					return 'ami.twig.stdlib.startsWith(' + left + ',' + right + ')';

				/*-----------------------------------------*/

				case ami.twig.expr.tokens.ENDS_WITH:

					left = this._getJS(node.nodeLeft);
					right = this._getJS(node.nodeRight);

					return 'ami.twig.stdlib.endsWith(' + left + ',' + right + ')';

				/*-----------------------------------------*/

				case ami.twig.expr.tokens.MATCHES:

					left = this._getJS(node.nodeLeft);
					right = this._getJS(node.nodeRight);

					return 'ami.twig.stdlib.match(' + left + ',' + right + ')';

				/*-----------------------------------------*/

				case ami.twig.expr.tokens.RANGE:

					left = this._getJS(node.nodeLeft);
					right = this._getJS(node.nodeRight);

					return 'ami.twig.stdlib.range(' + left + ',' + right + ')';

				/*-----------------------------------------*/

				case ami.twig.expr.tokens.FLDIV:

					left = this._getJS(node.nodeLeft);
					right = this._getJS(node.nodeRight);

					return 'Math.floor(' + left + '/' + right + ')';

				/*-----------------------------------------*/

				case ami.twig.expr.tokens.POWER:

					left = this._getJS(node.nodeLeft);
					right = this._getJS(node.nodeRight);

					return 'Math.pow(' + left + ',' + right + ')';

				/*-----------------------------------------*/

				case ami.twig.expr.tokens.LOGICAL_OR:
					operator = '||';
					break;

				/*-----------------------------------------*/

				case ami.twig.expr.tokens.LOGICAL_AND:
					operator = '&&';
					break;

				/*-----------------------------------------*/

				case ami.twig.expr.tokens.BITWISE_OR:
					operator = '|';
					break;

				/*-----------------------------------------*/

				case ami.twig.expr.tokens.BITWISE_XOR:
					operator = '^';
					break;

				/*-----------------------------------------*/

				case ami.twig.expr.tokens.BITWISE_AND:
					operator = '&';
					break;

				/*-----------------------------------------*/

				default:
					operator = node.nodeValue;
					break;

				/*-----------------------------------------*/
			}

			left = this._getJS(node.nodeLeft);
			right = this._getJS(node.nodeRight);

			return '(' + left + operator + right + ')';
		}

		/*---------------------------------------------------------*/
	},

	/*-----------------------------------------------------------------*/

	/**
	  * Convert a compiled TWIG expression to JavaScript
	  * @param {String} expr the compiled expression
	  * @returns {String} The JavaScript result
	  */

	getJS: function(expr)
	{
		return '(function() { return ' + this._getJS(expr.rootNode) + '; }())';
	},

	/*-----------------------------------------------------------------*/

	/**
	  * Evaluate the compiled TWIG expression
	  * @param {String} expr the compiled expression
	  * @param {Object} [dict] the dictionary of definitions
	  * @returns {?} The evaluated result
	  */

	eval: function(expr, _)
	{
		if(!_) _ = {};

		return eval(this.getJS(expr));
	},

	/*-----------------------------------------------------------------*/
};

/*-------------------------------------------------------------------------*/
