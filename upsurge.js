"use strict";

/*;
	@module-license:
		The MIT License (MIT)
		@mit-license

		Copyright (@c) 2016 Richeve Siodina Bebedor
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
			"eMail": "richeve.bebedor@gmail.com",
			"repository": "https://github.com/volkovasystems/upsurge.git",
			"test": "upsurge-test.js",
			"global": true
		}
	@end-module-configuration

	@module-documentation:
	@end-module-documentation

	@example:
	@end-example

	@include:
		{
			"_": "lodash",
			"async": "async",
			"bodyParser": "body-parser",
			"called": "called",
			"child": "child_process",
			"cobralize": "cobralize",
			"compression": "compression",
			"cookieParser": "cookie-parser",
			"csrf": "csurf",
			"dictate": "dictate",
			"fs": "fs-extra",
			"harden": "harden",
			"helmet": "helmet",
			"http": "http",
			"https": "https",
			"komento": "komento",
			"llamalize": "llamalize",
			"madhatter": "madhatter",
			"methodOverride": "method-override",
			"mongoose": "mongoose",
			"offcache": "offcache",
			"olivant": "olivant",
			"ribosome": "ribosome",
			"session": "express-session",
			"path": "path",
			"util": "util",
			"yargs": "yargs"
		}
	@end-include
*/

var _ = require( "lodash" );
var async = require( "async" );
var bodyParser = require( "body-parser" );
var called = require( "called" );
var child = require( "child_process" );
var cobralize = require( "cobralize" );
var compression = require( "compression" );
var cookieParser = require( "cookie-parser" );
var csrf = require( "csurf" );
var dictate = require( "dictate" );
var express = require( "express" );
var glob = require( "globby" );
var fs = require( "fs-extra" );
var harden = require( "harden" );
var helmet = require( "helmet" );
var http = require( "http" );
var https = require( "https" );
var komento = require( "komento" );
var llamalize = require( "llamalize" );
var madhatter = require( "madhatter" );
var methodOverride = require( "method-override" );
var mongoose = require( "mongoose" );
var offcache = require( "offcache" );
var olivant = require( "olivant" );
var ribosome = require( "ribosome" );
var session = require( "express-session" );
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
		function loadInitialize( callback ){
			Prompt( "loading initialize" );

			callback = called( callback );

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
					async.series( dictate( initializeList, option.initialize.order )
						.map( function onEachInitialize( initializePath ){
							return path.resolve( rootPath, initializePath );
						} )
						.map( function onEachInitialize( initializePath ){
							var error = madhatter( initializePath );

							if( error ){
								Fatal( "syntax error", error, initializePath );

							}else{
								return initializePath;
							}
						} )
						.map( function onEachInitialize( initializePath ){
							Prompt( "loading initialize", initializePath );

							var initialize = require( initializePath );

							if( initialize == "function" ){
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
					callback( Issue( "loading initialize", error ) );
				} );
		},

		function loadOption( callback ){
			var localOptionFile = path.resolve( rootPath, "server/local/_option.js" );

			if( !fs.existsSync( localOptionFile ) ){
				Warning( "no local option file found", localOptionFile ).prompt( );
			}

			Prompt( "loading option" );

			callback = called( callback );

			option.option = option.option || { };

			glob( [
					"server/local/_option.js",
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

					dictate( optionList, option.option.order )
						.forEach( function onEachOption( optionPath ){
							Prompt( "loading option", optionPath );

							var _optionPath = path.resolve( rootPath, optionPath );

							OPTION = _( _.cloneDeep( OPTION ) )
								.extend( _.cloneDeep( require( _optionPath ) ) )
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
					callback( Issue( "loading option", error ) );
				} );
		},

		function loadConstant( callback ){
			var localConstantFile = path.resolve( rootPath, "server/local/_constant.js" );

			if( !fs.existsSync( localConstantFile ) ){
				Warning( "no local constant file found", localConstantFile ).prompt( );
			}

			Prompt( "loading constant" );

			callback = called( callback );

			option.constant = option.constant || { };

			glob( [
					"server/local/_constant.js",
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
						.forEach( function onEachConstant( constantPath ){
							Prompt( "loading constant", constantPath );

							var constantOption = require( path.resolve( rootPath, constantPath ) );

							for( var property in constantOption ){
								harden( cobralize( property ), constantOption[ property ] );
							}

							Prompt( "constant", constantPath, "loaded" );
						} );

					Prompt( "finished loading constant" );

					callback( );
				} )

				.catch( function onError( error ){
					callback( Issue( "loading constant", error ) );
				} );
		},

		function loadUtility( callback ){
			Prompt( "loading utility" );

			callback = called( callback );

			harden( "UTILITY", { } );

			glob( [
					"server/utility/*.js"
				],

				{ "cwd": rootPath } )

				.then( function onEachUtility( utilityList ){
					utilityList.forEach( function onEachUtility( utilityPath ){
						Prompt( "loading utility", utilityPath );

						var utilityName = utilityPath.match( /([a-z0-9-_]+)\.js$/ )[ 1 ];
						utilityName = llamalize( utilityName );

						require( path.resolve( rootPath, utilityPath ) );

						Prompt( "utility", utilityPath, "loaded" );
					} );

					Prompt( "finished loading utility" );

					callback( );
				} )

				.catch( function onError( error ){
					callback( Issue( "loading utility", error ) );
				} );
		},

		function loadDatabase( callback ){
			callback = called( callback );

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

			async.series( [
				function createDatabaseDirectory( callback ){
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

								if( !fs.existsSync( directory ) ){
									Prompt( "creating database directory:", directory );

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
					Prompt( "creating database log" );

					try{
						_.each( database,
							function onEachDatabase( database ){
								if( option[ database ].url ){
									return;
								}

								var logFile = path.resolve( option[ database ].directory, "database.log" );

								option[ database ].log = logFile;

								if( !fs.existsSync( logFile ) ){
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

								var mongodbVersion = child.execSync( "m --stable" )
									.toString( )
									.replace( /\s/g, "" );

								var mongodbPath = child.execSync( "m bin @version"
									.replace( "@version", mongodbVersion ) )
									.toString( )
									.replace( /\s/g, "" );

								var _option = option[ database ];

								if( ( new RegExp( database ) ).test( mongoProcess ) &&
									( /mongod \-\-fork/ ).test( mongoProcess ) )
								{
									Prompt( "database process", database, "is already running" );

									Prompt( "stopping database", database, "process" );

									child.execSync( [
										path.resolve( mongodbPath, "mongo" ),
											"--port", _option.port,
											"--eval",
											"'db.getSiblingDB( \"admin\" ).shutdownServer( )'"
									].join( " " ) );

									child.execSync( [
										"rm -fv",
										path.resolve( _option.directory, "mongod.lock" )
									].join( " " ) );
								}

								Prompt( "starting database process", database );

								var command = [
									path.resolve( mongodbPath, "mongod" ),
										"--fork",
										"--logpath", _option.log,
										"--port", _option.port,
										"--bind_ip", _option.host,
										"--dbpath", _option.directory,
										"--smallfiles",
										"&>", _option.log,
										"&"
								].join( " " );

								child.execSync( command );

								_option.url = [
									"mongodb:/",
									_option.host + ":" + _option.port,
									database
								].join( "/" );

								Prompt( "database", database, "started with connection", _option.url );
							} );

						Prompt( "finished initializing database process" );

						setTimeout( function onTimeout( ){
							callback( );
						}, 5000 );

					}catch( error ){
						callback( Issue( "starting database process", error ) );
					}
				},

				function createDatabaseConnection( callback ){
					_.each( database,
						function onEachDatabase( database ){
							harden( cobralize( database ),
								mongoose.createConnection( option[ database ].url, {
									"server": {
										"poolSize": option[ database ].poolSize || 5,
										"socketOptions": {
											"keepAlive": option[ database ].keepAlive || 500
										}
									}
								} ) );
						} );

					callback( );
				}
			],
				function lastly( error ){
					if( error ){
						callback( Issue( "loading database", error ) );

					}else{
						Prompt( "finished loading database" );

						callback( );
					}
				} );
		},

		function loadModel( callback ){
			Prompt( "loading model" );

			callback = called( callback );

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
					modelList.forEach( function onEachModel( modelPath ){
						Prompt( "loading model", modelPath );

						require( path.resolve( rootPath, modelPath ) );

						Prompt( "model", modelPath, "loaded" );
					} );

					Prompt( "finished loading model" );

					callback( );
				} )

				.catch( function onError( error ){
					callback( Issue( "loading model", error ) );
				} );
		},

		function loadEngine( callback ){
			Prompt( "loading engine" );

			callback = called( callback );

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
					.forEach( function onEachEngine( enginePath ){
						Prompt( "loading engine", enginePath );

						require( path.resolve( rootPath, enginePath ) );

						Prompt( "engine", enginePath, "loaded" );
					} );

					Prompt( "finished loading engine" );

					callback( );
				} )

				.catch( function onError( error ){
					callback( Issue( "loading engine", error ) );
				} );
		},

		function loadDefault( callback ){
			Prompt( "loading default" );

			callback = called( callback );

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
					async
						.series( dictate( defaultList, option.default.order )
							.map( function onEachDefault( defaultPath ){
								Prompt( "loading default", defaultPath );

								return require( path.resolve( rootPath, defaultPath ) );
							} ),

						function lastly( ){
							Prompt( "finished loading all default" );

							callback( );
						} );
				} )

				.catch( function onError( error ){
					callback( Issue( "loading default", error ) );
				} );
		},

		function loadServer( callback ){
			Prompt( "loading server" );

			callback = called( callback );

			//: Create a global express app.
			harden( "APP", express( ) );

			/*;
				This will let us bind csrf middleware anywhere in the api.
			*/
			harden( "CSRF", csrf( { "cookie": true } ) );

			if( OPTION.environment.server.body ){
				APP.use( bodyParser.urlencoded( {
					"extended": true,
					"limit": OPTION.environment.server.body.parser.limit
				} ) );

				APP.use( bodyParser.json( {
					"limit": OPTION.environment.server.body.parser.limit
				} ) );

			}else{
				Warning( "body parser middleware not configured" ).prompt( );
			}

			APP.use( cookieParser( ) );

			APP.use( methodOverride( ) );

			if( OPTION.environment.server.compression ){
				APP.use( compression( {
					"level": OPTION.environment.server.compression.level
				} ) );

			}else{
				Warning( "compression middleware not configured" ).prompt( );
			}

			if( OPTION.environment.server.session ){
				//: This is the default session store.
				harden( "SESSION_STORE", { } );
				if( OPTION.environment.server.session.engine == "mongo-store" ){
					var MongoStore = require( "connect-mongo" )( session );
					SESSION_STORE[ "mongo-store" ] = new MongoStore( OPTION.environment.server.session.store );
				}

				APP.use( session( {
					"saveUninitialized": true,
					"resave": true,

					"proxy": OPTION.environment.server.session.proxy,
					"secret": OPTION.environment.server.session.secret,

					"cookie": OPTION.environment.server.session.cookie,

					/*;
						Enable us to use different session store engines.
					*/
					"store": SESSION_STORE[ OPTION.environment.server.session.engine ]
				} ) );

			}else{
				Warning( "session middleware not configured" ).prompt( );
			}

			//: For security purposes.
			APP.use( helmet( ) );

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
			if( OPTION.environment.client ){
				var environment = ribosome( function template( ){
					/*!
						var client = JSON.parse( "$client" );

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
						var callback = request.query.callback || "callback";

						if( !( /^\w$/ ).test( callback.toString( ) ) ){
							Issue( "invalid callback" )
								.prompt( )
								.send( response );

							return;
						}

						var _environment = komento( function template( ){
							/*!
								( {{{environment}}} )( );
							*/
						}, { "environment": environment.toString( ) } )
							.replace( /\$client/g, JSON.stringify( OPTION.environment.client ) )
							.replace( /\$callback/g, callback );

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
							.send( new Buffer( _environment ) );
					} );
			}

			if( service &&
				OPTION.environment[ service ].static &&
				OPTION.environment[ service ].static.path )
			{
				var pathList = OPTION.environment[ service ].static.path;

				for( var _path in pathList ){
					APP.use( _path, express.static( path.resolve( rootPath, pathList[ _path ] ) ) );
				}

			}else if( OPTION.environment.static &&
				OPTION.environment.static.path )
			{
				var pathList = OPTION.environment.static.path;

				for( var _path in pathList ){
					APP.use( _path, express.static( path.resolve( rootPath, pathList[ _path ] ) ) );
				}
			}

			var port = OPTION.environment.server.port;
			var host = OPTION.environment.server.host;
			if( service ){
				port = OPTION.environment[ service ].server.port || port;
				host = OPTION.environment[ service ].server.host || host;
			}

			APP.listen( port, host,

				function onListen( error ){
					if( error ){
						callback( Issue( "loading server", error ) );

					}else{
						Prompt( "finished loading server" );

						callback( );
					}
				} );
		},

		function loadRouter( callback ){
			Prompt( "loading router" );

			callback = called( callback );

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
						.forEach( function onEachRouter( routerPath ){
							Prompt( "loading router", routerPath );

							require( path.resolve( rootPath, routerPath ) );

							Prompt( "router", routerPath, "loaded" );
						} );

					Prompt( "finished loading router" );

					callback( );
				} )

				.catch( function onError( error ){
					callback( Issue( "loading router", error ) );
				} );
		},

		function loadAPI( callback ){
			Prompt( "loading API" );

			callback = called( callback );

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
						.forEach( function onEachAPI( APIPath ){
							Prompt( "loading API", APIPath );

							require( path.resolve( rootPath, APIPath ) );

							Prompt( "API", APIPath, "loaded" );
						} );

					Prompt( "finished loading API" );

					callback( );
				} )

				.catch( function onError( error ){
					callback( Issue( "loading API", error ) );
				} );
		},

		function loadFinalizer( callback ){
			Prompt( "loading finalizer" );

			callback = called( callback );

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
					async.series( dictate( finalizerList, option.finalizer.order )
						.map( function onEachFinalizer( finalizerPath ){
							Prompt( "loading finalizer", finalizerPath );

							var finalizer = require( path.resolve( rootPath, finalizerPath ) );

							if( finalizer == "function" ){
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
					callback( Issue( "loading finalizer", error ) );
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

	async.series( flow,
		function lastly( issue ){
			if( issue ){
				issue.remind( "failed loading application" ).remind( "process exiting" );

			}else{
				var protocol = OPTION.environment.server.protocol;
				var domain = OPTION.environment.server.domain;
				var port = OPTION.environment.server.port;
				if( service ){
					protocol = OPTION.environment[ service ].server.protocol || protocol;
					domain = OPTION.environment[ service ].server.domain || domain;
					port = OPTION.environment[ service ].server.port || port;
				}

				Prompt( "finished loading application" )
					.remind( "application is now live, use",
						protocol + "://" + domain + ":" + port );
			}
		} );
};

module.exports = upsurge;
