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
			"child": "child_process",
			"cobralize": "cobralize",
			"compression": "compression",
			"cookieParser": "cookie-parser",
			"csrf": "csurf",
			"dexer": "dexer",
			"dexist": "dexist",
			"dictate": "dictate",
			"fs": "fs-extra",
			"harden": "harden",
			"helmet": "helmet",
			"http": "http",
			"https": "https",
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
			"path": "path",
			"util": "util",
			"yargs": "yargs"
		}
	@end-include
*/

var _ = require( "lodash" );
var ate = require( "ate" );
var bodyParser = require( "body-parser" );
var called = require( "called" );
var child = require( "child_process" );
var cobralize = require( "cobralize" );
var compression = require( "compression" );
var cookieParser = require( "cookie-parser" );
var csrf = require( "csurf" );
var dexer = require( "dexer" );
var dexist = require( "dexist" );
var dictate = require( "dictate" );
var express = require( "express" );
var glob = require( "globby" );
var fs = require( "fs-extra" );
var harden = require( "harden" );
var helmet = require( "helmet" );
var http = require( "http" );
var https = require( "https" );
var kept = require( "kept" );
var kirov = require( "kirov" );
var komento = require( "komento" );
var llamalize = require( "llamalize" );
var madhatter = require( "madhatter" );
var methodOverride = require( "method-override" );
var mongoose = require( "mongoose" );
var offcache = require( "offcache" );
var Olivant = require( "olivant" );
var pedon = require( "pedon" );
var ribosome = require( "ribosome" );
var series = require( "async" ).series;
var session = require( "express-session" );
var ssbolt = require( "ssbolt" );
var path = require( "path" );
var util = require( "util" );

var argv = require( "yargs" ).argv;

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
var upsurge = function upsurge( option ){
	/*;
		@meta-configuration:
			{
				"option": "object"
			}
		@end-meta-configuration
	*/

	option = option || { };

	option.rootPath = option.rootPath || process.cwd( );

	var rootPath = option.rootPath;

	//: These are any procedures that modify the flow of the upsurge.
	option.injective = option.injective || { };

	var service = argv.service || option.service;

	var flow = [
		function killExistingProcess( callback ){
			dexist( "mongod", function onKill( error ){
				if( error ){
					Issue( "error killing existing mongod process", error )
						.pass( callback );

				}else{
					callback( );
				}
			} );
		},

		function loadInitialize( callback ){
			Prompt( "loading initialize" );

			option.initialize = option.initialize || { };

			glob( [
					"server/**/initialize.js",
					"server/**/*-initialize.js"

				].map( function onEachPattern( pattern ){
					if( service ){
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
							var error = madhatter( initializePath );

							if( error ){
								Fatal( "syntax error", error, initializePath )
									.pass( callback );

							}else{
								return initializePath;
							}
						} )
						.filter( function onEachInitialize( initializePath ){
							return !!initializePath;
						} )
						.map( function onEachInitialize( initializePath ){
							Prompt( "loading initialize", initializePath );

							var initialize = require( initializePath );

							if( typeof initialize == "function" ){
								return initialize;

							}else{
								Prompt( "initialize", initializePath, "loaded" );
							}
						} )
						.filter( function onEachInitialize( initialize ){
							return !!initialize;
						} ),

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
			var localOptionFile = path.resolve( rootPath, "server/local/option.js" );

			if( !kept( localOptionFile, true ) ){
				Warning( "no local option file found", localOptionFile )
					.silence( )
					.prompt( );
			}

			Prompt( "loading option" );

			option.choice = option.choice || { };

			glob( [
					"server/local/option.js",
					"server/**/option.js",
					"server/**/*-option.js"

				].map( function onEachPattern( pattern ){
					if( service ){
						return pattern.replace( "**", service );

					}else{
						return pattern;
					}
				} ),

				{ "cwd": rootPath } )

				.then( function onEachOption( optionList ){
					var OPTION = { };

					dictate( optionList, option.choice.order )
						.map( function onEachOption( optionPath ){
							return path.resolve( rootPath, optionPath );
						} )
						.map( function onEachOption( optionPath ){
							var error = madhatter( optionPath );

							if( error ){
								Fatal( "syntax error", error, optionPath )
									.pass( callback );

							}else{
								return optionPath;
							}
						} )
						.filter( function onEachOption( optionPath ){
							return !!optionPath;
						} )
						.forEach( function onEachOption( optionPath ){
							Prompt( "loading option", optionPath );

							var option = require( optionPath );

							OPTION = _( _.cloneDeep( OPTION ) )
								.extend( _.cloneDeep( option ) )
								.value( );

							Prompt( "option", optionPath, "loaded" );
						} );

					if( argv.production ){
						OPTION.environment = OPTION.production || { };

					}else if( argv.staging ){
						OPTION.environment = OPTION.staging || { };

					}else{
						OPTION.environment = OPTION.local || { };
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
			var localConstantFile = path.resolve( rootPath, "server/local/constant.js" );

			if( !kept( localConstantFile, true ) ){
				Warning( "no local constant file found", localConstantFile )
					.silence( )
					.prompt( );
			}

			Prompt( "loading constant" );

			option.constant = option.constant || { };

			glob( [
					"server/local/constant.js",
					"server/**/constant.js",
					"server/**/-constant.js"

				].map( function onEachPattern( pattern ){
					if( service ){
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
							var error = madhatter( constantPath );

							if( error ){
								Fatal( "syntax error", error, constantPath )
									.pass( callback );

							}else{
								return constantPath;
							}
						} )
						.filter( function onEachConstant( constantPath ){
							return !!constantPath;
						} )
						.forEach( function onEachConstant( constantPath ){
							Prompt( "loading constant", constantPath );

							var constantOption = require( constantPath );

							for( var property in constantOption ){
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
							var error = madhatter( utilityPath );

							if( error ){
								Fatal( "syntax error", error, utilityPath )
									.pass( callback );

							}else{
								return utilityPath;
							}
						} )
						.filter( function onEachUtility( utilityPath ){
							return !!utilityPath;
						} )
						.forEach( function onEachUtility( utilityPath ){
							Prompt( "loading utility", utilityPath );

							var utilityName = utilityPath.match( /([a-z0-9-_]+)\.js$/ )[ 1 ];
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
			if( service &&
				!( OPTION.environment[ service ] &&
				OPTION.environment[ service ].database ) )
			{
				Prompt( "specific service does not require to load a database" );

				callback( );

				return;
			}

			Prompt( "loading database" );

			var option = _.cloneDeep( OPTION.environment.database );
			if( service &&
				OPTION.environment[ service ] &&
				OPTION.environment[ service ].database )
			{
				option = _.cloneDeep( OPTION.environment[ service ].database );
			}

			var database = _.keys( option );

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

								var databaseDirectoryName = "." + database + "-database";
								var directory = path.resolve( rootPath, databaseDirectoryName );

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

								var logFile = path.resolve( option[ database ].directory, "database.log" );

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

								var mongoProcess = child.execSync( [
									"ps aux",
									"grep mongod",
									"grep " + database
								].join( " | " ) ).toString( );

								var mongodbVersion = option[ database ].version ||
									child.execSync( "m --stable" )
										.toString( )
										.replace( /\s/g, "" );

								var mongodbPath = child.execSync( "m bin @version"
									.replace( "@version", mongodbVersion ) )
									.toString( )
									.replace( /\s/g, "" );

								var choice = option[ database ];

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
												"'db.getSiblingDB( \"admin\" ).shutdownServer( )'"
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

								var command = [
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
					var completed = _.every( database,
						function onEachDatabase( database ){
							if( !option[ database ].url ){
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
					if( service ){
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
							var error = madhatter( modelPath );

							if( error ){
								Fatal( "syntax error", error, modelPath )
									.pass( callback );

							}else{
								return modelPath;
							}
						} )
						.filter( function onEachModel( modelPath ){
							return !!modelPath;
						} )
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

			option.engine = option.engine || { };

			glob( [
					"server/**/engine.js",
					"server/**/*-engine.js"

				].map( function onEachPattern( pattern ){
					if( service ){
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
							var error = madhatter( enginePath );

							if( error ){
								Fatal( "syntax error", error, enginePath )
									.pass( callback );

							}else{
								return enginePath;
							}
						} )
						.filter( function onEachEngine( enginePath ){
							return !!enginePath;
						} )
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

			option.default = option.default || { };

			glob( [
					"server/**/default.js",
					"server/**/*-default.js"

				].map( function onEachPattern( pattern ){
					if( service ){
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
								var error = madhatter( defaultPath );

								if( error ){
									Fatal( "syntax error", error, defaultPath )
										.pass( callback );

								}else{
									return defaultPath;
								}
							} )
							.filter( function onEachDefault( defaultPath ){
								return !!defaultPath;
							} )
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

			var serverOption = OPTION.environment.server;
			var serviceServerOption = null;
			if( service ){
				serviceServerOption = OPTION.environment[ service ].server;
			}

			var bodyOption = ( service )? serviceServerOption.body : serverOption.body;
			if( bodyOption ){
				APP.use( bodyParser.urlencoded( {
					"extended": true,
					"limit": bodyOption.parser.limit
				} ) );

				APP.use( bodyParser.json( {
					"limit": bodyOption.parser.limit
				} ) );

			}else{
				Warning( "body parser middleware not configured" )
					.silence( )
					.prompt( );
			}

			APP.use( cookieParser( ) );

			APP.use( methodOverride( ) );

			var compressionOption = ( service )?
				serviceServerOption.compression :
				serverOption.compression;
			if( compressionOption ){
				APP.use( compression( {
					"level": compressionOption.level
				} ) );

			}else{
				Warning( "compression middleware not configured" )
					.silence( )
					.prompt( );
			}

			var sessionOption = ( service )? serviceServerOption.session : serverOption.session;
			if( sessionOption ){
				//: This is the default session store.
				harden( "SESSION_STORE", { } );
				if( sessionOption.engine == "mongo-store" ){
					var MongoStore = require( "connect-mongo" )( session );
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
			var clientOption = OPTION.environment.client;
			if( service ){
				clientOption = _.defaultsDeep
					( _.cloneDeep( OPTION.environment[ service ].client || { } ),
						_.cloneDeep( OPTION.environment.client ) );
			}
			if( clientOption ){
				var environment = ribosome( function template( ){
					/*!
						var client = JSON.parse( '$client' );

						for( var property in client ){
							harden( property, client[ property ], window );
						}

						if( typeof $callback == "function" ){
							var callback = $callback;

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
						var done = request.query.callback || "callback";

						if( !( /^\w+$/ ).test( done.toString( ) ) ){
							Issue( "invalid callback", done )
								.silent( )
								.prompt( )
								.send( response );

							return;
						}

						var field = komento( function template( ){
							/*!
								( {{{environment}}} )( );
							*/
						},

						{ "environment": environment.toString( ) } )

						.replace( /\$client/g, JSON.stringify( clientOption ) )
						.replace( /\$callback/g, done );

						var error = madhatter( field );
						if( error ){
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
			var dependency = OPTION.environment.dependency;
			if( service &&
				OPTION.environment[ service ].dependency )
			{
				dependency = OPTION.environment[ service ].dependency
			}
			if( dependency ){
				kirov( dependency );
			}

			//: Configure default redirect path.
			if( clientOption.default &&
				clientOption.default.redirect &&
				clientOption.default.redirect.path )
			{
				harden( "DEFAULT_REDIRECT_PATH", clientOption.default.redirect.path );

			}else{
				harden( "DEFAULT_REDIRECT_PATH", "/view/status/page" );
			}

			var pathList = [ ];
			if( service &&
				OPTION.environment[ service ].static &&
				OPTION.environment[ service ].static.path )
			{
				pathList = OPTION.environment[ service ].static.path;

			}else if( OPTION.environment.static &&
				OPTION.environment.static.path )
			{
				pathList = OPTION.environment.static.path;
			}
			for( var track in pathList ){
				if( track == "/" ){
					var indexPath = path.resolve( rootPath, pathList[ track ] );

					dexer( {
						"app": APP,
						"path": track,
						"index": indexPath,
						"data": clientOption,
						"redirect": DEFAULT_REDIRECT_PATH
					} );

				}else{
					var staticPath = path.resolve( rootPath, pathList[ track ] );

					APP.use( track, express.static( staticPath ) );
				}
			}

			var port = serverOption.port;
			var host = serverOption.host;
			if( service ){
				port = serviceServerOption.port || port;
				host = serviceServerOption.host || host;
			}
			APP.listen( port, host,
				function onListen( error ){
					if( error ){
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

			var APIRouter = express.Router( );
			harden( "API", APIRouter );
			APP.use( "/api/:key", APIRouter );

			option.router = option.router || { };

			glob( [
					"server/**/router.js",
					"server/**/*-router.js"

				].map( function onEachPattern( pattern ){
					if( service ){
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
							var error = madhatter( routerPath );

							if( error ){
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

			option.API = option.API || { };

			glob( [
					"server/**/*-api.js"

				].map( function onEachPattern( pattern ){
					if( service ){
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
							var error = madhatter( APIPath );

							if( error ){
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

			option.finalizer = option.finalizer || { };

			glob( [
					"server/**/finalizer.js",
					"server/**/*-finalizer.js"

				].map( function onEachPattern( pattern ){
					if( service ){
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
							var error = madhatter( finalizerPath );

							if( error ){
								Fatal( "syntax error", error, finalizerPath )
									.pass( callback );

							}else{
								return finalizerPath;
							}
						} )
						.filter( function onEachFinalizer( finalizerPath ){
							return !!finalizerPath;
						} )
						.map( function onEachFinalizer( finalizerPath ){
							Prompt( "loading finalizer", finalizerPath );

							var finalizer = require( finalizerPath );

							if( typeof finalizer == "function" ){
								return finalizer;

							}else{
								Prompt( "finalizer", finalizerPath, "loaded" );
							}
						} )
						.filter( function onEachFinalizer( finalizer ){
							return !!finalizer;
						} ),

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

	if( option.injective ){
		if( option.injective.list ){
			flow = flow.concat( option.injective.list );
		}

		if( option.injective.order ){
			flow = dictate( flow, option.injective.order );
		}
	}

	series( flow
		.map( function onEachFlow( procedure ){
			var name = procedure.name;

			var delegate = function delegate( callback ){
				callback = called( callback );

				return procedure( callback );
			};

			ate( "name", name, delegate );

			return delegate;
		} ),

		function lastly( issue ){
			var server = OPTION.environment.server;
			var rootServer = server;
			if( service ){
				server = OPTION.environment[ service ].server;
			}

			if( issue ){
				issue
					.remind( "failed loading application" )
					.remind( "process exiting" )
					.silence( )
					.prompt( );

			}else{
				var protocol = server.protocol || rootServer.protocol;
				var domain = server.domain || rootServer.domain;
				var port = server.port || rootServer.port;

				Prompt( "finished loading application" )
					.remind( "use", protocol + "://" + domain + ":" + port )
					.remind( "application is now live" );
			}
		} );
};

module.exports = upsurge;
