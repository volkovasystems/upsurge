"use strict";

/*;
	@module-license:
		The MIT License (MIT)
		@mit-license

		Copyright (@c) 2017 Richeve Siodina Bebedor
		@email: richeve.bebedor@gmail.com

		Permission is hereby granted, free of charge, to any person obtaining a copy
		of this software and associated documentation files (the "Software"), to deal
		in the Software without restriction, including without limitation the rights
		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		copies of the Software, and to permit persons to whom the Software is
		furnished to do so, subject to the following conditions:

		The above copyright notice and this permission notice shall be included in all
		copies or substantial portions of the Software.

		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		SOFTWARE.
	@end-module-license

	@module-configuration:
		{
			"package": "upsurge",
			"path": "upsurge/upsurge.js",
			"file": "upsurge.js",
			"module": "upsurge",
			"author": "Richeve S. Bebedor",
			"contributors": [
				"John Lenon Maghanoy <johnlenonmaghanoy@gmail.com>"
			],
			"eMail": "richeve.bebedor@gmail.com",
			"repository": "https://github.com/volkovasystems/upsurge.git",
			"test": "upsurge-test.js",
			"global": true
		}
	@end-module-configuration

	@module-documentation:
		Default server resources loading procedure based on standard practice.

		Currently, default support for mongodb/mongoose.
	@end-module-documentation

	@todo:
		Use gnaw for any commands.
	@end-todo

	@include:
		{
			"_": "lodash",
			"async": "async",
			"ate": "ate",
			"bodyParser": "body-parser",
			"called": "called",
			"cheson": "cheson",
			"child": "child_process",
			"clazof": "clazof",
			"cobralize": "cobralize",
			"compression": "compression",
			"cookieParser": "cookie-parser",
			"csrf": "csurf",
			"dexer": "dexer",
			"dexist": "dexist",
			"dictate": "dictate",
			"falze": "falze",
			"falzy": "falzy",
			"fs": "fs-extra",
			"harden": "harden",
			"helmet": "helmet",
			"http": "http",
			"https": "https",
			"jersy": "jersy",
			"kept": "kept",
			"kirov": "kirov",
			"komento": "komento",
			"llamalize": "llamalize",
			"madhatter": "madhatter",
			"methodOverride": "method-override",
			"mongoose": "mongoose",
			"offcache": "offcache",
			"Olivant": "olivant",
			"pedon": "pedon",
			"ribosome": "ribosome",
			"ssbolt": "ssbolt",
			"session": "express-session",
			"truly": "truly",
			"truu": "truu",
			"path": "path",
			"util": "util",
			"veur": "veur",
			"yargs": "yargs"
		}
	@end-include
*/

require( "olivant" );

const _ = require( "lodash" );
const ate = require( "ate" );
const bodyParser = require( "body-parser" );
const called = require( "called" );
const cheson = require( "cheson" );
const child = require( "child_process" );
const clazof = require( "clazof" );
const cobralize = require( "cobralize" );
const compression = require( "compression" );
const cookieParser = require( "cookie-parser" );
const csrf = require( "csurf" );
const dexer = require( "dexer" );
const dexist = require( "dexist" );
const dictate = require( "dictate" );
const express = require( "express" );
const falze = require( "falze" );
const falzy = require( "falzy" );
const fs = require( "fs-extra" );
const glob = require( "globby" );
const harden = require( "harden" );
const helmet = require( "helmet" );
const http = require( "http" );
const https = require( "https" );
const jersy = require( "jersy" );
const kept = require( "kept" );
const kirov = require( "kirov" );
const komento = require( "komento" );
const llamalize = require( "llamalize" );
const madhatter = require( "madhatter" );
const methodOverride = require( "method-override" );
const mongoose = require( "mongoose" );
const offcache = require( "offcache" );
const pedon = require( "pedon" );
const protype = require( "protype" );
const ribosome = require( "ribosome" );
const series = require( "async" ).series;
const session = require( "express-session" );
const ssbolt = require( "ssbolt" );
const truly = require( "truly" );
const truu = require( "truu" );
const path = require( "path" );
const util = require( "util" );
const veur = require( "veur" );
const yarg = require( "yargs" );

const DEFAULT_DATABASE_POOLSIZE = 10;
const DEFAULT_DATABASE_KEEPALIVE = 500;
const DEFAULT_BODY_PARSER_LIMIT = "50mb";

/*;
	@option:
		{
			"rootPath": "string",
			"injective": {
				"order": [
					"[string]",
					"object"
				],
				"list": "[function]"
			}
		}
	@end-option
*/
const upsurge = function upsurge( option ){
	/*;
		@meta-configuration:
			{
				"option": "object"
			}
		@end-meta-configuration
	*/

	option = truu( option )? option : { };

	option.rootPath = option.rootPath || process.cwd( );

	let rootPath = option.rootPath;

	//: These are any procedures that modify the flow of the upsurge.
	option.injective = truu( option.injective )? option.injective : { };

	let parameter = yarg.argv;
	let service = parameter.service || option.service;

	let flow = [
		function killExistingProcess( callback ){
			dexist( "mongod", function onKill( error ){
				if( clazof( error, Error ) ){
					Issue( "killing existing mongod process", error )
						.pass( callback );

				}else{
					callback( );
				}
			} );
		},

		function loadInitialize( callback ){
			Prompt( "loading initialize" );

			option.initialize = truu( option.initialize )? option.initialize : { };

			glob( [
					"server/**/initialize.js",
					"server/**/*-initialize.js"

				].map( function onEachPattern( pattern ){
					if( truly( service ) ){
						return pattern.replace( "**", service );

					}else{
						return pattern;
					}
				} ),

				{ "cwd": rootPath } )

				.then( function onEachInitialize( initializeList ){
					series( dictate( initializeList, option.initialize.order )
						.map( function onEachInitialize( initializePath ){
							return path.resolve( rootPath, initializePath );
						} )
						.map( function onEachInitialize( initializePath ){
							let error = madhatter( initializePath );

							if( clazof( error, Error ) ){
								Fatal( "syntax error", error, initializePath )
									.pass( callback );

							}else{
								return initializePath;
							}
						} )
						.filter( truly )
						.map( function onEachInitialize( initializePath ){
							Prompt( "loading initialize", initializePath );

							let initialize = require( initializePath );

							if( protype( initialize, FUNCTION ) ){
								return initialize;

							}else{
								Prompt( "initialize", initializePath, "loaded" );
							}
						} )
						.filter( truly ),

						function lastly( ){
							Prompt( "finished loading initialize" );

							callback( );
						} );
				} )

				.catch( function onError( error ){
					Issue( "loading initialize", error )
						.pass( callback );
				} );
		},

		function loadOption( callback ){
			let localOptionFile = path.resolve( rootPath, "server/local/option.json" );

			if( !kept( localOptionFile, true ) ){
				Warning( "no local option file found", localOptionFile )
					.silence( )
					.prompt( );
			}

			Prompt( "loading option" );

			option.choice = truu( option.choice )? option.choice : { };

			glob( [
					"!server/meta/option.json",
					"server/local/option.json",
					"server/**/option.json",
					"server/**/*-option.json"

				].map( function onEachPattern( pattern ){
					if( truly( service ) ){
						return pattern.replace( "**", service );

					}else{
						return pattern;
					}
				} ),

				{ "cwd": rootPath } )

				.then( function onEachOption( optionList ){
					let OPTION = { };

					dictate( optionList, option.choice.order )
						.map( function onEachOption( optionPath ){
							return path.resolve( rootPath, optionPath );
						} )
						.map( function onEachOption( optionPath ){
							let error = cheson.evaluate( jersy( optionPath, true ) );

							if( clazof( error, Error ) ){
								Fatal( "syntax error", error, optionPath )
									.pass( callback );

							}else{
								return optionPath;
							}
						} )
						.filter( truly )
						.forEach( function onEachOption( optionPath ){
							Prompt( "loading option", optionPath );

							let option = require( optionPath );

							OPTION = _( _.cloneDeep( OPTION ) )
								.extend( _.cloneDeep( option ) )
								.value( );

							Prompt( "option", optionPath, "loaded" );
						} );

					if( parameter.production ){
						OPTION.environment = truu( OPTION.production )? OPTION.production : { };

					}else if( parameter.staging ){
						OPTION.environment = truu( OPTION.staging )? OPTION.staging : { };

					}else{
						OPTION.environment = truu( OPTION.local )? OPTION.local : { };
					}

					harden( "OPTION", OPTION );

					Prompt( "finished loading option" );

					callback( );
				} )

				.catch( function onError( error ){
					Issue( "loading option", error )
						.pass( callback );
				} );
		},

		function loadConstant( callback ){
			let localConstantFile = path.resolve( rootPath, "server/local/constant.json" );

			if( !kept( localConstantFile, true ) ){
				Warning( "no local constant file found", localConstantFile )
					.silence( )
					.prompt( );
			}

			Prompt( "loading constant" );

			option.constant = truu( option.constant )? option.constant : { };

			glob( [
					"!server/meta/constant.json",
					"server/local/constant.json",
					"server/**/constant.json",
					"server/**/-constant.json"

				].map( function onEachPattern( pattern ){
					if( truly( service ) ){
						return pattern.replace( "**", service );

					}else{
						return pattern;
					}
				} ),

				{ "cwd": rootPath } )

				.then( function onEachConstant( constantList ){
					dictate( constantList, option.constant.order )
						.map( function onEachConstant( constantPath ){
							return path.resolve( rootPath, constantPath );
						} )
						.map( function onEachConstant( constantPath ){
							let error = cheson.evaluate( jersy( constantPath, true ) );

							if( clazof( error, Error ) ){
								Fatal( "syntax error", error, constantPath )
									.pass( callback );

							}else{
								return constantPath;
							}
						} )
						.filter( truly )
						.forEach( function onEachConstant( constantPath ){
							Prompt( "loading constant", constantPath );

							let constantOption = require( constantPath );

							for( let property in constantOption ){
								harden( cobralize( property ), constantOption[ property ] );
							}

							Prompt( "constant", constantPath, "loaded" );
						} );

					Prompt( "finished loading constant" );

					callback( );
				} )

				.catch( function onError( error ){
					Issue( "loading constant", error )
						.pass( callback );
				} );
		},

		function loadUtility( callback ){
			Prompt( "loading utility" );

			harden( "UTILITY", { } );

			glob( [
					"server/utility/*.js"
				],

				{ "cwd": rootPath } )

				.then( function onEachUtility( utilityList ){
					utilityList
						.map( function onEachUtility( utilityPath ){
							return path.resolve( rootPath, utilityPath );
						} )
						.map( function onEachUtility( utilityPath ){
							let error = madhatter( utilityPath );

							if( clazof( error, Error ) ){
								Fatal( "syntax error", error, utilityPath )
									.pass( callback );

							}else{
								return utilityPath;
							}
						} )
						.filter( truly )
						.forEach( function onEachUtility( utilityPath ){
							Prompt( "loading utility", utilityPath );

							let utilityName = utilityPath.match( /([a-z0-9-_]+)\.js$/ )[ 1 ];
							utilityName = llamalize( utilityName );

							require( utilityPath );

							Prompt( "utility", utilityPath, "loaded" );
						} );

					Prompt( "finished loading utility" );

					callback( );
				} )

				.catch( function onError( error ){
					Issue( "loading utility", error )
						.pass( callback );
				} );
		},

		function loadDatabase( callback ){
			if( truly( service ) &&
				( falze( OPTION.environment[ service ] ) ||
				falze( OPTION.environment[ service ].database ) ) )
			{
				Prompt( "specific service does not require to load a database" )
					.remind( "no database configuration given" );

				callback( );

				return;
			}

			Prompt( "loading database" );

			let option = _.cloneDeep( OPTION.environment.database );
			if( truly( service ) &&
				truu( OPTION.environment[ service ] ) &&
				truu( OPTION.environment[ service ].database ) )
			{
				option = _.cloneDeep( OPTION.environment[ service ].database );
			}

			let database = _.keys( option );

			series( [
				function createDatabaseDirectory( callback ){
					if( pedon.WINDOWS ){
						Warning( "creating database directory not currently supported" )
							.silence( )
							.prompt( );

						callback( );

						return;
					}

					Prompt( "creating database directory" );

					try{
						_.each( database,
							function onEachDatabase( database ){
								if( option[ database ].url ){
									return;
								}

								let databaseDirectoryName = "." + database + "-database";
								let directory = path.resolve( rootPath, databaseDirectoryName );

								option[ database ].directory = directory;

								if( !kept( directory, true ) ){
									Prompt( "creating database directory", directory );

									fs.mkdirSync( directory );

									Prompt( "database directory", directory, "created" )

								}else{
									Prompt( "database directory", directory, "ready" );
								}
							} );

						Prompt( "finished creating database directory" );

						callback( );

					}catch( error ){
						callback( Issue( "creating database directory", error ) );
					}
				},

				function createDatabaseLog( callback ){
					if( pedon.WINDOWS ){
						Warning( "creating database log not currently supported" )
							.silence( )
							.prompt( );

						callback( );

						return;
					}

					Prompt( "creating database log" );

					try{
						_.each( database,
							function onEachDatabase( database ){
								if( option[ database ].url ){
									return;
								}

								let logFile = path.resolve( option[ database ].directory, "database.log" );

								option[ database ].log = logFile;

								if( !kept( logFile, true ) ){
									Prompt( "creating database log", logFile );

									fs.closeSync( fs.openSync( logFile, "w" ) );

									Prompt( "database log", logFile, "created" );

								}else{
									Prompt( "database log", logFile, "ready" );
								}
							} );

						Prompt( "finished creating database log" );

						callback( );

					}catch( error ){
						callback( Issue( "creating database log", error ) );
					}
				},

				function startDatabase( callback ){
					if( pedon.WINDOWS ){
						Warning( "starting database not currently supported" )
							.silence( )
							.prompt( );

						callback( );

						return;
					}

					Prompt( "initializing database process" );

					try{
						_.each( database,
							function onEachDatabase( database ){
								if( option[ database ].url ){
									return;
								}

								let mongoProcess = child.execSync( [
									"ps aux",
									"grep mongod",
									"grep " + database
								].join( " | " ) ).toString( );

								let mongodbVersion = option[ database ].version ||
									child.execSync( "m --stable" )
										.toString( )
										.replace( /\s/g, "" );

								let mongodbPath = child.execSync( "m bin @version"
									.replace( "@version", mongodbVersion ) )
									.toString( )
									.replace( /\s/g, "" );

								let choice = option[ database ];

								if( ( new RegExp( database ) ).test( mongoProcess ) &&
									( /mongod \-\-fork/ ).test( mongoProcess ) )
								{
									Prompt( "database process", database, "is already running" );

									Prompt( "stopping database", database, "process" );

									try{
										child.execSync( [
											path.resolve( mongodbPath, "mongo" ),
												"--port", choice.port,
												"--eval",
												`'db.getSiblingDB( "admin" ).shutdownServer( )'`
										].join( " " ) );

									}catch( error ){
										Warning( "cannot stop database process that is dead" )
											.silence( )
											.prompt( );
									}

									try{
										child.execSync( [
											"rm -fv",
											path.resolve( choice.directory, "mongod.lock" )
										].join( " " ) );

									}catch( error ){
										Warning( "cannot remove mongod.lock file", error )
											.remind( "file does not exists" )
											.silence( )
											.prompt( );
									}
								}

								Prompt( "starting database process", database );

								let command = [
									path.resolve( mongodbPath, "mongod" ),
										"--fork",
										"--logpath", choice.log,
										"--port", choice.port,
										"--bind_ip", choice.host,
										"--dbpath", choice.directory,
										"--smallfiles",
										"&>", choice.log,
										"&"
								].join( " " );

								child.execSync( command );

								choice.url = [
									"mongodb:/",
									choice.host + ":" + choice.port,
									database
								].join( "/" );

								Prompt( "database", database, "started" )
									.remind( "using connection", choice.url );
							} );

						Prompt( "finished initializing database process" );

						callback( );

					}catch( error ){
						Issue( "starting database process", error )
							.pass( callback );
					}
				},

				function createDatabaseConnection( callback ){
					let completed = _.every( database,
						function onEachDatabase( database ){
							if( falze( option[ database ] ) ){
								Warning( "cannot create database connection", database )
									.remind( "empty database data", option[ database ] )
									.silence( )
									.prompt( );

								return false;
							}

							if( falzy( option[ database ].url ) ){
								Warning( "cannot create database connection", database )
									.remind( "due to incomplete data", option[ database ] )
									.silence( )
									.prompt( );

								return false;
							}

							harden( cobralize( database ),
								mongoose.createConnection( option[ database ].url, {
									"server": {
										"poolSize": option[ database ].poolSize || 10,
										"socketOptions": {
											"keepAlive": option[ database ].keepAlive || 500
										}
									}
								} ) );

							return true;
						} );

					if( !completed ){
						Issue( "creating database connection not completed" )
							.pass( callback );

					}else{
						callback( );
					}
				}
			],
				function lastly( error ){
					if( error ){
						Issue( "loading database", error )
							.pass( callback );

					}else{
						Prompt( "finished loading database" );

						callback( );
					}
				} );
		},

		function loadModel( callback ){
			Prompt( "loading model" );

			glob( [
					"server/**/model.js",
					"server/**/*-model.js"

				].map( function onEachPattern( pattern ){
					if( truly( service ) ){
						return pattern.replace( "**", service );

					}else{
						return pattern;
					}
				} ),

				{ "cwd": rootPath } )

				.then( function onEachModel( modelList ){
					modelList
						.map( function onEachModel( modelPath ){
							return path.resolve( rootPath, modelPath );
						} )
						.map( function onEachModel( modelPath ){
							let error = madhatter( modelPath );

							if( clazof( error, Error ) ){
								Fatal( "syntax error", error, modelPath )
									.pass( callback );

							}else{
								return modelPath;
							}
						} )
						.filter( truly )
						.forEach( function onEachModel( modelPath ){
							Prompt( "loading model", modelPath );

							require( modelPath );

							Prompt( "model", modelPath, "loaded" );
						} );

					Prompt( "finished loading model" );

					callback( );
				} )

				.catch( function onError( error ){
					Issue( "loading model", error )
						.pass( callback );
				} );
		},

		function loadEngine( callback ){
			Prompt( "loading engine" );

			option.engine = truu( option.engine )? option.engine : { };

			glob( [
					"server/**/engine.js",
					"server/**/*-engine.js"

				].map( function onEachPattern( pattern ){
					if( truly( service ) ){
						return pattern.replace( "**", service );

					}else{
						return pattern;
					}
				} ),

				{ "cwd": rootPath } )

				.then( function onEachEngine( engineList ){
					dictate( engineList, option.engine.order )
						.map( function onEachEngine( enginePath ){
							return path.resolve( rootPath, enginePath );
						} )
						.map( function onEachEngine( enginePath ){
							let error = madhatter( enginePath );

							if( clazof( error, Error ) ){
								Fatal( "syntax error", error, enginePath )
									.pass( callback );

							}else{
								return enginePath;
							}
						} )
						.filter( truly )
						.forEach( function onEachEngine( enginePath ){
							Prompt( "loading engine", enginePath );

							require( enginePath );

							Prompt( "engine", enginePath, "loaded" );
						} );

					Prompt( "finished loading engine" );

					callback( );
				} )

				.catch( function onError( error ){
					Issue( "loading engine", error )
						.pass( callback );
				} );
		},

		function loadDefault( callback ){
			Prompt( "loading default" );

			option.default = truu( option.default )? option.default : { };

			glob( [
					"server/**/default.js",
					"server/**/*-default.js"

				].map( function onEachPattern( pattern ){
					if( truly( service ) ){
						return pattern.replace( "**", service );

					}else{
						return pattern;
					}
				} ),

				{ "cwd": rootPath } )

				.then( function onEachDefault( defaultList ){
					series( dictate( defaultList, option.default.order )
							.map( function onEachDefault( defaultPath ){
								return path.resolve( rootPath, defaultPath );
							} )
							.map( function onEachDefault( defaultPath ){
								let error = madhatter( defaultPath );

								if( clazof( error, Error ) ){
									Fatal( "syntax error", error, defaultPath )
										.pass( callback );

								}else{
									return defaultPath;
								}
							} )
							.filter( truly )
							.map( function onEachDefault( defaultPath ){
								Prompt( "loading default", defaultPath );

								return require( defaultPath );
							} ),

						function lastly( ){
							Prompt( "finished loading all default" );

							callback( );
						} );
				} )

				.catch( function onError( error ){
					Issue( "loading default", error )
						.pass( callback );
				} );
		},

		function loadServer( callback ){
			Prompt( "loading server" );

			//: Create a global express app.
			harden( "APP", express( ) );

			/*;
				This will let us bind csrf middleware anywhere in the api.
			*/
			harden( "CSRF", csrf( { "cookie": true } ) );

			let serverOption = OPTION.environment.server;
			let serviceServerOption = null;
			if( truly( service ) ){
				serviceServerOption = OPTION.environment[ service ].server;
			}

			let bodyOption = truly( service )? serviceServerOption.body : serverOption.body;
			if( truu( bodyOption ) ){
				let limit = ( truu( bodyOption.parser ) && bodyOption.parser.limit ) ||
					DEFAULT_BODY_PARSER_LIMIT;

				APP.use( bodyParser.urlencoded( {
					"extended": true,
					"limit": limit
				} ) );

				APP.use( bodyParser.json( {
					"limit": limit
				} ) );

			}else{
				Warning( "body parser middleware not configured" )
					.silence( )
					.prompt( );
			}

			APP.use( cookieParser( ) );

			APP.use( methodOverride( ) );

			let compressionOption = truly( service )?
				serviceServerOption.compression :
				serverOption.compression;
			if( truu( compressionOption ) ){
				APP.use( compression( {
					"level": compressionOption.level
				} ) );

			}else{
				Warning( "compression middleware not configured" )
					.silence( )
					.prompt( );
			}

			let sessionOption = truly( service )?
				serviceServerOption.session :
				serverOption.session;
			if( truu( sessionOption ) ){
				//: This is the default session store.
				harden( "SESSION_STORE", { } );
				if( sessionOption.engine == "mongo-store" ){
					let MongoStore = require( "connect-mongo" )( session );
					SESSION_STORE[ "mongo-store" ] = new MongoStore( sessionOption.store );
				}

				APP.use( session( {
					"saveUninitialized": true,
					"resave": true,

					"proxy": sessionOption.proxy,
					"secret": sessionOption.secret,

					"cookie": sessionOption.cookie,

					/*;
						Enable us to use different session store engines.
					*/
					"store": SESSION_STORE[ sessionOption.engine ]
				} ) );

			}else{
				Warning( "session middleware not configured" )
					.silence( )
					.prompt( );
			}

			//: For security purposes.
			APP.use( helmet( ) );

			//: This will handle the entire request-response error.
			ssbolt( APP );

			APP.get( "/ping",
				function onPing( request, response ){
					Prompt( "ping", new Date( ) )
						.send( response );
				} );

			/*;
				In order we send the client public environment variables
					we will expose this path.

				This should be added in the header of the html file.

				<script src="/environment" type="text/javascript"></script>

				Contents of this function will expose
					constant variables to the global scope.

				Modify client variables in option.client property.
			*/
			let clientOption = OPTION.environment.client;
			if( truly( service ) ){
				clientOption = _.defaultsDeep
					( _.cloneDeep( OPTION.environment[ service ].client || { } ),
						_.cloneDeep( OPTION.environment.client ) );
			}
			if( truu( clientOption ) ){
				let environment = ribosome( function template( ){
					/*!
						let client = JSON.parse( '$client' );

						for( let property in client ){
							harden( property, client[ property ], window );
						}

						if( typeof $callback == "function" ){
							let callback = $callback;

							callback( null, client );
						}
					*/
				}, {
					"name": "environment",
					"dependency": [
						"harden@" + path.resolve( rootPath, "node_modules/harden/harden.js" )
					]
				} );

				APP.get( "/environment",
					function onGetEnvironment( request, response ){
						let done = request.query.callback || "callback";

						if( !( /^\w+$/ ).test( done.toString( ) ) ){
							Issue( "invalid callback", done )
								.silent( )
								.prompt( )
								.send( response );

							return;
						}

						let field = komento( function template( ){
							/*!
								( {{{ environment }}} )( );
							*/
						},

						{ "environment": environment.toString( ) } )

						.replace( /\$client/g, JSON.stringify( clientOption ) )
						.replace( /\$callback/g, done );

						let error = madhatter( field );
						if( clazof( error, Error ) ){
							Bug( "malformed environment script", error, field )
								.silent( )
								.prompt( )
								.send( response );

							return;
						}

						offcache( response )
							.status( 200 )
							.set( {
								"Content-Type": [
										"application/javascript",
										"charset=UTF-8"
									].join( ";" ),

								"Content-Disposition": [
										"attachment",
										"filename=environment.js"
									].join( ";" )
							} )
							.send( new Buffer( field ) );
					} );
			}

			//: Load dependency middleware if activated through options.
			let dependency = OPTION.environment.dependency;
			if( truly( service ) &&
				truu( OPTION.environment[ service ] ) &&
				truu( OPTION.environment[ service ].dependency ) )
			{
				dependency = OPTION.environment[ service ].dependency
			}
			if( truu( dependency ) ){
				kirov( dependency );
			}

			//: Configure default redirect path.
			if( truu( clientOption.default ) &&
				truu( clientOption.default.redirect ) &&
				truly( clientOption.default.redirect.path ) )
			{
				harden( "DEFAULT_REDIRECT_PATH", clientOption.default.redirect.path );

			}else{
				harden( "DEFAULT_REDIRECT_PATH", "/view/status/page" );
			}

			let pathList = [ ];
			if( truly( service ) &&
				truu( OPTION.environment[ service ] ) &&
				truu( OPTION.environment[ service ].static ) &&
				truly( OPTION.environment[ service ].static.path ) )
			{
				pathList = OPTION.environment[ service ].static.path;

			}else if( truu( OPTION.environment.static ) &&
				truly( OPTION.environment.static.path ) )
			{
				pathList = OPTION.environment.static.path;
			}
			for( let track in pathList ){
				let pathOption = pathList[ track ];

				if( track === "/" ){
					let data = truu( pathOption.data )? pathOption.data : clientOption;
					let redirect = truly( pathOption.redirect )? pathOption.redirect : DEFAULT_REDIRECT_PATH

					dexer( {
						"middleware": APP,
						"rootPath": truly( pathOption.rootPath )? pathOption.rootPath : rootPath,
						"clientPath": pathOption.clientPath,
						"indexPath": pathOption.indexPath,
						"index": pathOption.index,
						"data": data,
						"redirect": redirect
					} );

				}else if( ( /^\/view/ ).test( track ) ){
					let data = truu( pathOption.data )? pathOption.data : clientOption;
					let redirect = truly( pathOption.redirect )? pathOption.redirect : DEFAULT_REDIRECT_PATH

					veur( {
						"middleware": APP,
						"rootPath": truly( pathOption.rootPath )? pathOption.rootPath : rootPath,
						"clientPath": pathOption.clientPath,
						"viewPath": pathOption.viewPath,
						"view": pathOption.view,
						"index": pathOption.index,
						"data": data,
						"redirect": redirect
					} );

				}else{
					let staticPath = path.resolve( rootPath, pathList[ track ] );

					APP.use( track, express.static( staticPath ) );
				}
			}

			let port = serverOption.port;
			let host = serverOption.host;
			if( truly( service ) ){
				port = serviceServerOption.port || port;
				host = serviceServerOption.host || host;
			}
			APP.listen( port, host,
				function onListen( error ){
					if( clazof( error, Error ) ){
						Issue( "loading server", error )
							.pass( callback );

					}else{
						Prompt( "finished loading server" );

						callback( );
					}
				} );
		},

		function loadRouter( callback ){
			Prompt( "loading router" );

			let APIRouter = express.Router( );
			harden( "API", APIRouter );
			APP.use( "/api/:key", APIRouter );

			option.router = truu( option.router )? option.router : { };

			glob( [
					"server/**/router.js",
					"server/**/*-router.js"

				].map( function onEachPattern( pattern ){
					if( truly( service ) ){
						return pattern.replace( "**", service );

					}else{
						return pattern;
					}
				} ),

				{ "cwd": rootPath } )

				.then( function onEachRouter( routerList ){
					dictate( routerList, option.router.order )
						.map( function onEachRouter( routerPath ){
							return path.resolve( rootPath, routerPath );
						} )
						.map( function onEachRouter( routerPath ){
							let error = madhatter( routerPath );

							if( clazof( error, Error ) ){
								Fatal( "syntax error", error, routerPath )
									.pass( callback );

							}else{
								return routerPath;
							}
						} )
						.filter( function onEachRouter( routerPath ){
							return !!routerPath;
						} )
						.forEach( function onEachRouter( routerPath ){
							Prompt( "loading router", routerPath );

							require( routerPath );

							Prompt( "router", routerPath, "loaded" );
						} );

					Prompt( "finished loading router" );

					callback( );
				} )

				.catch( function onError( error ){
					Issue( "loading router", error )
						.pass( callback );
				} );
		},

		function loadAPI( callback ){
			Prompt( "loading API" );

			option.API = truu( option.API )? option.API : { };

			glob( [
					"server/**/*-api.js"

				].map( function onEachPattern( pattern ){
					if( truly( service ) ){
						return pattern.replace( "**", service );

					}else{
						return pattern;
					}
				} ),

				{ "cwd": rootPath } )

				.then( function onEachAPI( APIList ){
					dictate( APIList, option.API.order )
						.map( function onEachAPI( APIPath ){
							return path.resolve( rootPath, APIPath );
						} )
						.map( function onEachAPI( APIPath ){
							let error = madhatter( APIPath );

							if( clazof( error, Error ) ){
								Fatal( "syntax error", error, APIPath )
									.pass( callback );

							}else{
								return APIPath;
							}
						} )
						.filter( function onEachAPI( APIPath ){
							return !!APIPath;
						} )
						.forEach( function onEachAPI( APIPath ){
							Prompt( "loading API", APIPath );

							require( APIPath );

							Prompt( "API", APIPath, "loaded" );
						} );

					Prompt( "finished loading API" );

					callback( );
				} )

				.catch( function onError( error ){
					Issue( "loading API", error )
						.pass( callback );
				} );
		},

		function loadFinalizer( callback ){
			Prompt( "loading finalizer" );

			option.finalizer = truu( option.finalizer )? option.finalizer : { };

			glob( [
					"server/**/finalizer.js",
					"server/**/*-finalizer.js"

				].map( function onEachPattern( pattern ){
					if( truly( service ) ){
						return pattern.replace( "**", service );

					}else{
						return pattern;
					}
				} ),

				{ "cwd": rootPath } )

				.then( function onEachFinalizer( finalizerList ){
					series( dictate( finalizerList, option.finalizer.order )
						.map( function onEachFinalizer( finalizerPath ){
							return path.resolve( rootPath, finalizerPath );
						} )
						.map( function onEachFinalizer( finalizerPath ){
							let error = madhatter( finalizerPath );

							if( clazof( error, Error ) ){
								Fatal( "syntax error", error, finalizerPath )
									.pass( callback );

							}else{
								return finalizerPath;
							}
						} )
						.filter( truly )
						.map( function onEachFinalizer( finalizerPath ){
							Prompt( "loading finalizer", finalizerPath );

							let finalizer = require( finalizerPath );

							if( protype( finalizer, FUNCTION ) ){
								return finalizer;

							}else{
								Prompt( "finalizer", finalizerPath, "loaded" );
							}
						} )
						.filter( truly ),

						function lastly( ){
							Prompt( "finished loading finalizer" );

							callback( );
						} );
				} )

				.catch( function onError( error ){
					Issue( "loading finalizer", error )
						.pass( callback );
				} );
		}
	];

	if( truu( option.injective ) ){
		if( truu( option.injective.list ) ){
			flow = flow.concat( option.injective.list );
		}

		if( truu( option.injective.order ) ){
			flow = dictate( flow, option.injective.order );
		}
	}

	series( flow
		.map( function onEachFlow( procedure ){
			let name = procedure.name;

			let delegate = function delegate( callback ){
				callback = called( callback );

				return procedure( callback );
			};

			ate( "name", name, delegate );

			return delegate;
		} ),

		function lastly( issue ){
			let server = OPTION.environment.server;
			let rootServer = server;
			if( service ){
				server = OPTION.environment[ service ].server;
			}

			if( issue ){
				issue.remind( "failed loading application" )
					.remind( "process exiting" )
					.silence( )
					.prompt( );

			}else{
				let protocol = server.protocol || rootServer.protocol;
				let domain = server.domain || rootServer.domain;
				let port = server.port || rootServer.port;

				Prompt( "finished loading application" )
					.remind( `use ${ protocol }://${ domain }:${ port }` )
					.remind( "application is now live" );
			}
		} );
};

module.exports = upsurge;
