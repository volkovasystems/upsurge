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

	@include:
		{
			"async": "async",
			"ate": "ate",
			"bodyParser": "body-parser",
			"called": "called",
			"cheson": "cheson",
			"clazof": "clazof",
			"cobralize": "cobralize",
			"comex": "comex",
			"compression": "compression",
			"cookieParser": "cookie-parser",
			"csrf": "csurf",
			"dexer": "dexer",
			"dexist": "dexist",
			"dictate": "dictate",
			"empt": "empt",
			"emver": "emver",
			"falze": "falze",
			"falzy": "falzy",
			"filled": "filled",
			"fs": "fs-extra",
			"glob": "globby",
			"gnaw": "gnaw",
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
			"redupe": "redupe",
			"ribosome": "ribosome",
			"ssbolt": "ssbolt",
			"session": "express-session",,
			"stuffed": "stuffed",
			"touche": "touche",
			"truly": "truly",
			"truu": "truu",
			"path": "path",
			"veur": "veur",
			"wichevr": "wichevr",
			"yargs": "yargs"
		}
	@end-include
*/

require( "olivant" );

const ate = require( "ate" );
const blacksea = require( "blacksea" );
const bluesea = require( "bluesea" );
const bodyParser = require( "body-parser" );
const called = require( "called" );
const cheson = require( "cheson" );
const clazof = require( "clazof" );
const cobralize = require( "cobralize" );
const comex = require( "comex" );
const compression = require( "compression" );
const cookieParser = require( "cookie-parser" );
const csrf = require( "csurf" );
const dexer = require( "dexer" );
const dexist = require( "dexist" );
const dictate = require( "dictate" );
const empt = require( "empt" );
const emver = require( "emver" );
const express = require( "express" );
const falze = require( "falze" );
const falzy = require( "falzy" );
const filled = require( "filled" );
const fs = require( "fs-extra" );
const glob = require( "globby" );
const gnaw = require( "gnaw" );
const harden = require( "harden" );
const helmet = require( "helmet" );
const http = require( "http" );
const https = require( "https" );
const jersy = require( "jersy" );
const kept = require( "kept" );
const kirov = require( "kirov" );
const komento = require( "komento" );
const llamalize = require( "llamalize" );
const loosen = require( "loosen" );
const madhatter = require( "madhatter" );
const methodOverride = require( "method-override" );
const mongoose = require( "mongoose" );
const offcache = require( "offcache" );
const pedon = require( "pedon" );
const protype = require( "protype" );
const redsea = require( "redsea" );
const redupe = require( "redupe" );
const ribosome = require( "ribosome" );
const series = require( "async" ).series;
const session = require( "express-session" );
const ssbolt = require( "ssbolt" );
const stuffed = require( "stuffed" );
const touche = require( "touche" );
const truly = require( "truly" );
const truu = require( "truu" );
const path = require( "path" );
const U200b = require( "u200b" );
const veur = require( "veur" );
const wichevr = require( "wichevr" );
const yarg = require( "yargs" );

const DEFAULT_DATABASE_POOLSIZE = 10;
const DEFAULT_DATABASE_KEEPALIVE = 500;
const DEFAULT_BODY_PARSER_LIMIT = "50mb";
const DEFAULT_PROTOCOL = "http";
const DEFAULT_DOMAIN = "localhost";
const DEFAULT_HOST = "127.0.0.1";
const DEFAULT_PORT = 8000;

/*;
	@internal-method-documentation:
		This will replace filepaths with service namespace.
	@end-internal-method-documentation
*/
const overrideService = function overrideService( service ){
	/*;
		@meta-configuration:
			{
				"service": "string"
			}
		@end-meta-configuration
	*/

	let activeService = truly( service );

	if( activeService && !protype( service, STRING ) ){
		throw new Error( "invalid service name" );
	}

	return function resolveService( filePath ){
		/*;
			@meta-configuration:
				{
					"filePath:required": "string"
				}
			@end-meta-configuration
		*/

		if( falzy( filePath ) ){
			throw new Error( "invalid file path" )
		}

		if( activeService && ( /^\!/ ).test( filePath ) ){
			return filePath.replace( "**", service );

		}else{
			return filePath;
		}
	};
};

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

	option = wichevr( option, { } );

	let rootPath = option.rootPath = wichevr( option.rootPath, process.cwd( ) );

	//: These are any procedures that modify the flow of the upsurge.
	option.injective = wichevr( option.injective, { } );

	let parameter = yarg.argv;
	let service = wichevr( parameter.service, option.service );

	let resolveService = overrideService( service );

	let flow = [
		function killExistingProcess( callback ){
			Prompt( "killing existing processes" );

			dexist( "mongod", function onKill( error ){
				if( clazof( error, Error ) ){
					Issue( "killing existing mongod process", error )
						.pass( callback );

				}else{
					Prompt( "mongod processes killed" );

					callback( );
				}
			} );
		},

		function loadInitialize( callback ){
			Prompt( "loading initialize" );

			option.initialize = wichevr( option.initialize, { } );

			glob( [
					"server/**/initialize.js",
					"server/**/*-initialize.js"
				],

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
							if( filled( initializeList ) ){
								Prompt( "finished loading initialize" );

							}else{
								Prompt( "no initialize loaded" );
							}

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

			option.choice = wichevr( option.choice, { } );

			glob( [
					"server/local/option.json",
					"server/**/option.json",
					"server/**/*-option.json",
					"!server/meta/option.json"

				].map( resolveService ),

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

							OPTION = redupe( OPTION, require( optionPath ), true );

							Prompt( "option", optionPath, "loaded" );
						} );

					if( stuffed( OPTION ) ){
						if( parameter.production ){
							OPTION.environment = wichevr( OPTION.production, { } );

						}else if( parameter.staging ){
							OPTION.environment = wichevr( OPTION.staging, { } );

						}else{
							OPTION.environment = wichevr( OPTION.local, { } );
						}
					}

					if( truu( OPTION.environment ) ){
						harden( "ENVIRONMENT", OPTION.environment );

						let environment = loosen( ENVIRONMENT, true );
						Object.getOwnPropertyNames( environment )
							.forEach( ( property ) => {
								let constant = U200b( property ).replace( ".", "_" ).toUpperCase( );

								harden( constant, environment[ property ] );
							} );
					}

					harden( "OPTION", OPTION );

					if( stuffed( OPTION ) ){
						Prompt( "finished loading option" );

					}else{
						Prompt( "no option loaded" );
					}

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

			option.constant = wichevr( option.constant, { } );

			glob( [
					"server/local/constant.json",
					"server/**/constant.json",
					"server/**/-constant.json",
					"!server/meta/constant.json"

				].map( resolveService ),

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


					if( filled( constantList ) ){
						Prompt( "finished loading constant" );

					}else{
						Prompt( "no constant loaded" );
					}

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

					if( filled( utilityList ) ){
						Prompt( "finished loading utility" );

					}else{
						Prompt( "no utility loaded" );
					}

					callback( );
				} )

				.catch( function onError( error ){
					Issue( "loading utility", error )
						.pass( callback );
				} );
		},

		function loadDatabase( callback ){
			if( empt( OPTION ) ){
				Warning( "empty configuration" )
					.remind( "cannot load database" )
					.prompt( )
					.silence( );

				callback( );

				return;
			}

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

			let databaseOption = redupe( OPTION.environment.database );
			if( truly( service ) &&
				truu( OPTION.environment[ service ] ) &&
				truu( OPTION.environment[ service ].database ) )
			{
				databaseOption = redupe( OPTION.environment[ service ].database );
			}

			let database = Object.keys( databaseOption );

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
						database.forEach( function onEachDatabase( database ){
							databaseOption[ database ] = wichevr( databaseOption[ database ], { } );
							let option = databaseOption[ database ];

							if( truly( option.url ) ){
								Prompt( "cannot create database directory" )
									.remind( `${ database } will be connected via ${ option.url }` );

								return;
							}

							let directory = path.resolve( rootPath, `.${ database }-database` );

							option.directory = directory;

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
						database.forEach( function onEachDatabase( database ){
							let option = databaseOption[ database ];

							if( truly( option.url ) ){
								Prompt( "cannot create database log" )
									.remind( `${ database } will be connected via ${ option.url }` );

								return;
							}

							let logFile = path.resolve( option.directory, "database.log" );

							option.log = logFile;

							if( !kept( logFile, true ) ){
								Prompt( "creating database log", logFile );

								touche( logFile, true );

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
						database.forEach( function onEachDatabase( database ){
							let option = databaseOption[ database ];

							if( truly( option.url ) ){
								Prompt( "cannot start database server" )
									.remind( `${ database } will be connected via ${ option.url }` );

								return;
							}

							let mongoProcess = comex( "ps aux" )
								.pipe( "grep -v grep" )
								.pipe( "grep mongod" )
								.pipe( "grep", `${ database }-database` )
								.execute( true );

							let mongodbVersion = wichevr( option.version, emver( true ) );

							let mongodbPath = gnaw( `m bin ${ mongodbVersion }`, true );

							if( truly( mongoProcess ) &&
								( new RegExp( database ) ).test( mongoProcess ) &&
								( /mongod \-\-fork/ ).test( mongoProcess ) )
							{
								Prompt( "database process", database, "is already running" )
									.remind( "stopping database", database, "process" );

								try{
									comex( path.resolve( mongodbPath, "mongo" ) )
										.join( "--port", option.port )
										.join( "--eval" )
										.join( `'db.getSiblingDB( "admin" ).shutdownServer( )'` )
										.execute( true );

								}catch( error ){
									Warning( "cannot stop database process that is dead" )
										.silence( )
										.prompt( );
								}

								try{
									comex( "rm -fv" )
										.join( path.resolve( option.directory, "mongod.lock" ) )
										.execute( true );

								}catch( error ){
									Warning( "cannot remove mongod.lock file", error )
										.remind( "file does not exists" )
										.silence( )
										.prompt( );
								}
							}

							Prompt( "starting database process", database );

							comex( path.resolve( mongodbPath, "mongod" ) )
								.join( "--fork" )
								.join( "--logpath", option.log )
								.join( "--port", option.port )
								.join( "--bind_ip", option.host )
								.join( "--dbpath", option.directory )
								.join( "--smallfiles" )
								.log( option.log )
								.background( )
								.execute( true );

							option.url = `mongodb://${ option.host }:${ option.port }/${ database }`;

							Prompt( "database", database, "started" )
								.remind( "using connection", option.url );
						} );

						Prompt( "finished initializing database process" );

						callback( );

					}catch( error ){
						Issue( "starting database process", error )
							.pass( callback );
					}
				},

				function createDatabaseConnection( callback ){
					let completed = database.every( function onEachDatabase( database ){
						let option = databaseOption[ database ];

						if( falze( option ) ){
							Warning( "cannot create database connection", database )
								.remind( "empty database data", option )
								.silence( )
								.prompt( );

							return false;
						}

						if( falzy( option.url ) ){
							Warning( "cannot create database connection", database )
								.remind( "due to incomplete data", option )
								.silence( )
								.prompt( );

							return false;
						}

						harden( cobralize( database ),
							mongoose.createConnection( option.url, {
								"server": {
									"poolSize": wichevr( option.poolSize, DEFAULT_DATABASE_POOLSIZE ),
									"socketOptions": {
										"keepAlive": wichevr( option.keepAlive, DEFAULT_DATABASE_KEEPALIVE )
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
				],

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

					if( filled( modelList ) ){
						Prompt( "finished loading model" );

					}else{
						Prompt( "no model loaded" );
					}

					callback( );
				} )

				.catch( function onError( error ){
					Issue( "loading model", error )
						.pass( callback );
				} );
		},

		function loadEngine( callback ){
			Prompt( "loading engine" );

			option.engine = wichevr( option.engine, { } );

			glob( [
					"server/**/engine.js",
					"server/**/*-engine.js"
				],

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

					if( filled( engineList ) ){
						Prompt( "finished loading engine" );

					}else{
						Prompt( "no engine loaded" );
					}

					callback( );
				} )

				.catch( function onError( error ){
					Issue( "loading engine", error )
						.pass( callback );
				} );
		},

		function loadDefault( callback ){
			Prompt( "loading default" );

			option.default = wichevr( option.default, { } );

			glob( [
					"server/**/default.js",
					"server/**/*-default.js"

				].map( resolveService ),

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
							if( filled( defaultList ) ){
								Prompt( "finished loading all default" );

							}else{
								Prompt( "no default loaded" );
							}

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
			harden( "CSRF", csrf( ) );

			let environment = wichevr( OPTION.environment, { } );

			let serverOption = wichevr( environment.server, { } );
			let serviceOption = { };
			if( truly( service ) ){
				serviceOption = environment[ service ].server;
			}

			let bodyOption = truly( service )? serviceOption.body : serverOption.body;
			if( truu( bodyOption ) ){
				let limit = ( truu( bodyOption.parser ) && bodyOption.parser.limit ) || DEFAULT_BODY_PARSER_LIMIT;

				APP.use( bodyParser.urlencoded( {
					"extended": false,
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

			let compressionOption = truly( service )? serviceOption.compression : serverOption.compression;
			if( truu( compressionOption ) ){
				APP.use( compression( {
					"level": compressionOption.level
				} ) );

			}else{
				Warning( "compression middleware not configured" )
					.silence( )
					.prompt( );
			}

			let sessionOption = truly( service )? serviceOption.session : serverOption.session;
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
			let clientOption = wichevr( environment.client, { } );
			if( truly( service ) && truly( environment[ service ] ) ){
				let option = environment[ service ];
				clientOption = redupe( wichevr( option.client, { } ), clientOption, true );
			}
			if( truu( clientOption ) ){
				let environment = ribosome( function template( ){
					/*!
						var client = JSON.parse( '$client' );

						for( var property in client ){
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
						"harden@" + path.resolve( rootPath, "node_modules/harden/harden.deploy.js" )
					]
				} );

				APP.get( "/environment",
					function onGetEnvironment( request, response ){
						let done = wichevr( request.query.callback, "callback" );

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
			}else{
				Prompt( "environment service not loaded" );
			}

			//: Load dependency middleware if activated through options.
			let dependency = wichevr( environment.dependency, { } );
			if( truly( service ) &&
				truu( environment[ service ] ) &&
				truu( environment[ service ].dependency ) )
			{
				dependency = environment[ service ].dependency
			}
			if( truu( dependency ) ){
				kirov( dependency );

			}else{
				Prompt( "dependency service not loaded" );
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
				truu( environment[ service ] ) &&
				truu( environment[ service ].static ) &&
				truly( environment[ service ].static.path ) )
			{
				pathList = environment[ service ].static.path;

			}else if( truu( environment.static ) &&
				truly( environment.static.path ) )
			{
				pathList = environment.static.path;
			}
			for( let track in pathList ){
				let pathOption = pathList[ track ];

				if( track === "/" ){
					let data = wichevr( pathOption.data, clientOption );
					let redirect = wichevr( pathOption.redirect, DEFAULT_REDIRECT_PATH );

					dexer( {
						"middleware": APP,
						"rootPath": wichevr( pathOption.rootPath, rootPath ),
						"clientPath": pathOption.clientPath,
						"indexPath": pathOption.indexPath,
						"index": pathOption.index,
						"data": data,
						"redirect": redirect
					} );

				}else if( ( /^\/view/ ).test( track ) ){
					let data = wichevr( pathOption.data, clientOption );
					let redirect = wichevr( pathOption.redirect, DEFAULT_REDIRECT_PATH );

					veur( {
						"middleware": APP,
						"rootPath": wichevr( pathOption.rootPath, rootPath ),
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

			let port = wichevr( serverOption.port, DEFAULT_PORT );
			let host = wichevr( serverOption.host, DEFAULT_HOST );
			if( truly( service ) ){
				port = wichevr( serviceOption.port, port );
				host = wichevr( serviceOption.host, host );
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

			option.router = wichevr( option.router, { } );

			glob( [
					"server/**/router.js",
					"server/**/*-router.js"

				].map( resolveService ),

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

					if( filled( routerList ) ){
						Prompt( "finished loading router" );

					}else{
						Prompt( "no router loaded" );
					}

					callback( );
				} )

				.catch( function onError( error ){
					Issue( "loading router", error )
						.pass( callback );
				} );
		},

		function loadAPI( callback ){
			Prompt( "loading API" );

			option.API = wichevr( option.API, { } );

			glob( [
					"server/**/*-api.js"

				].map( resolveService ),

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

					if( filled( APIList ) ){
						Prompt( "finished loading API" );

					}else{
						Prompt( "no API loaded" );
					}

					callback( );
				} )

				.catch( function onError( error ){
					Issue( "loading API", error )
						.pass( callback );
				} );
		},

		function loadFinalizer( callback ){
			Prompt( "loading finalizer" );

			option.finalizer = wichevr( option.finalizer, { } );

			glob( [
					"server/**/finalizer.js",
					"server/**/*-finalizer.js"
				],

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
							if( filled( finalizerList ) ){
								Prompt( "finished loading finalizer" );

							}else{
								Prompt( "no finalizer loaded" );
							}

							callback( );
						} );
				} )

				.catch( function onError( error ){
					Issue( "loading finalizer", error )
						.pass( callback );
				} );
		},

		function loadTest( callback ){
			if( parameter.test && !parameter.production && !parameter.staging ){
				Prompt( "loading test" );

				option.test = wichevr( option.test, { } );

				glob( [
						"server/**/test.js",
						"server/**/*-test.js"
					],

					{ "cwd": rootPath } )

					.then( function onEachTest( testList ){
						series( dictate( testList, option.test.order )
							.map( function onEachTest( testPath ){
								return path.resolve( rootPath, testPath );
							} )
							.map( function onEachTest( testPath ){
								let error = madhatter( testPath );

								if( clazof( error, Error ) ){
									Fatal( "syntax error", error, testPath )
										.pass( callback );

								}else{
									return testPath;
								}
							} )
							.filter( truly )
							.map( function onEachTest( testPath ){
								Prompt( "loading test", testPath );

								let test = require( testPath );

								if( protype( test, FUNCTION ) ){
									return test;

								}else{
									Prompt( "test", testPath, "loaded" );
								}
							} )
							.filter( truly ),

							function lastly( ){
								if( filled( testList ) ){
									Prompt( "finished loading test" );

								}else{
									Prompt( "no test loaded" );
								}

								callback( );
							} );
					} )

					.catch( function onError( error ){
						Issue( "loading test", error )
							.pass( callback );
					} );

			}else{
				callback( );
			}
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

	blacksea( Fatal );
	bluesea( Fatal );
	redsea( Issue );

	series( flow
		.map( function onEachFlow( procedure ){
			let name = procedure.name;

			let delegate = function delegate( callback ){
				callback = called( callback );

				try{
					return procedure( callback );

				}catch( error ){
					Fatal( error )
						.remind( "process exiting" );
				}
			};

			ate( "name", name, delegate );

			return delegate;
		} ),

		function lastly( issue ){
			let environment = wichevr( OPTION.environment, { } );
			let server = wichevr( environment.server, { } );
			let rootServer = server;
			if( truly( service ) &&
		 		truly( environment[ service ] ) )
			{
				server = wichevr( environment[ service ].server, { } );
			}

			if( issue ){
				issue.remind( "failed loading application" )
					.remind( "process exiting" )
					.silence( )
					.prompt( );

			}else{
				let protocol = wichevr( server.protocol, rootServer.protocol, DEFAULT_PROTOCOL );
				let domain = wichevr( server.domain, rootServer.domain, DEFAULT_DOMAIN );
				let port = wichevr( server.port, rootServer.port, DEFAULT_PORT );

				Prompt( "finished loading application" )
					.remind( `use ${ protocol }://${ domain }:${ port }` )
					.remind( "application is now live" );
			}
		} );
};

module.exports = upsurge;
