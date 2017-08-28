#!/usr/bin/env node

import 'core-js/shim';

import { Source, parse, concatAST, buildASTSchema } from 'graphql';

import * as fs from 'fs';
import * as path from 'path';
import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';
import * as chalk from 'chalk';

import { fakeSchema } from './fake_schema';
import { proxyMiddleware } from './proxy';
import { existsSync } from './utils';

import * as opn from 'opn';

const cors = require('cors');
const bodyParser = require('body-parser');

const DEFAULT_PORT = 9002;
const log = console.log;

export default async function(args) {
  let argv = {
    file: undefined,
    port: DEFAULT_PORT,
    extend: undefined,
    open: undefined,
    header: undefined,
    co: undefined,
    help: undefined,
  };
    args
    .split(' ')
    .map((arg, index) => {
      const parseArg = () => {
        const splitArg = arg.split('');
        if((splitArg[0] === '-') && (splitArg[1] === '-')) {
          splitArg.splice(0, 2);
          return splitArg.join('');
        }
      };
      const parsedArg = parseArg();
      Object.keys(argv)
        .map(obj => {
          if((index === 0) && (typeof arg === 'string')) {
            return argv.file = arg;
          }
          if((parsedArg === obj) && (['open', 'co', 'help'].indexOf(parsedArg) > -1)) {
            return argv[obj] = true;
          }
          if((parsedArg === obj) && (['extend', 'header'].indexOf(parsedArg) > -1)) {
            return argv[obj] = args.split(' ')[index + 1];
          }
        })
    });
  
	let headers = {};
	if (argv.header) {
		const headerStrings = Array.isArray(argv.header) ? argv.header : [argv.header];
		for (var str of headerStrings) {
			const index = str.indexOf(':');
			const name = str.substr(0, index);
			const value = str.substr(index + 1).trim();
			headers[name] = value;
		}
	}

	let fileArg = argv.file;
	let fileName = fileArg || (argv.extend ? './schema_extension.faker.graphql' : './schema.faker.graphql');

	const fakeDefinitionAST = readAST(path.join(__dirname, 'fake_definition.graphql'));
	const corsOptions = {};

	if (argv.co) {
		corsOptions['origin'] = argv.co;
		corsOptions['credentials'] = true;
	}

	let userIDL;
	if (existsSync(fileName)) {
		userIDL = readIDL(fileName);
	} else {
		// different default IDLs for extend and non-extend modes
		let defaultFileName = argv.extend ? 'default-extend.graphql' : 'default-schema.graphql';
		userIDL = readIDL(path.join(__dirname, defaultFileName));
	}

	function readIDL(filepath) {
		return new Source(fs.readFileSync(filepath, 'utf-8'), filepath);
	}

	function readAST(filepath) {
		return parse(readIDL(filepath));
	}

	function saveIDL(idl) {
		fs.writeFileSync(fileName, idl);
		log(`${chalk.green('✚')} schema saved to ${chalk.magenta(fileName)} on ${new Date().toLocaleString()}`);
		return new Source(idl, fileName);
	}

	if (argv.extend) {
		// run in proxy mode
		const url = argv.extend;
		proxyMiddleware(url, headers)
			.then(([schemaIDL, cb]) => {
				schemaIDL = new Source(schemaIDL, `Inrospection from "${url}"`);
				runServer(schemaIDL, userIDL, cb);
			})
			.catch(error => {
				log(chalk.red(error.stack));
				process.exit(1);
			});
	} else {
		runServer(userIDL, null, schema => {
			fakeSchema(schema);
			return { schema };
		});
	}

	function buildServerSchema(idl) {
		var ast = concatAST([parse(idl), fakeDefinitionAST]);
		return buildASTSchema(ast);
	}

	function runServer(schemaIDL: Source, extensionIDL: Source, optionsCB) {
		const app = express();

		if (extensionIDL) {
			const schema = buildServerSchema(schemaIDL);
			extensionIDL.body = extensionIDL.body.replace('<RootTypeName>', schema.getQueryType().name);
		}
		app.options('/graphql', cors(corsOptions));
		app.use(
			'/graphql',
			cors(corsOptions),
			graphqlHTTP(() => {
				const schema = buildServerSchema(schemaIDL);

				return {
					...optionsCB(schema, extensionIDL),
					graphiql: true
				};
			})
		);

		app.get('/user-idl', (_, res) => {
			res.status(200).json({
				schemaIDL: schemaIDL.body,
				extensionIDL: extensionIDL && extensionIDL.body
			});
		});

		app.use('/user-idl', bodyParser.text());

		app.post('/user-idl', (req, res) => {
			try {
				if (extensionIDL === null) schemaIDL = saveIDL(req.body);
				else extensionIDL = saveIDL(req.body);

				res.status(200).send('ok');
			} catch (err) {
				res.status(500).send(err.message);
			}
		});
		console.log(__dirname)
		app.use('/editor', express.static(path.join(__dirname, 'editor')));

		app.listen(argv.port);

		log(`\n${chalk.green('✔')} Your GraphQL Fake API is ready to use 🚀
    Here are your links:
  
    ${chalk.blue('❯')} Interactive Editor:\t http://localhost:${argv.port}/editor
    ${chalk.blue('❯')} GraphQL API:\t http://localhost:${argv.port}/graphql
  
    `);

		if (!fileArg) {
			log(
				chalk.yellow(
					`Default file ${chalk.magenta(fileName)} is used. ` + `Specify [file] parameter to change.`
				)
			);
		}

		if (argv.open) {
			setTimeout(() => opn(`http://localhost:${argv.port}/editor`), 500);
		}
	}
};
// const argv = require('yargs')
//   .usage('Usage: $0 [file]')
//   .alias('p', 'port')
//   .nargs('p', 1)
//   .describe('p', 'HTTP Port')
//   .default('p', DEFAULT_PORT)
//   .alias('e', 'extend')
//   .nargs('e', 1)
//   .describe('e', 'URL to existing GraphQL server to extend')
//   .alias('o', 'open')
//   .describe('o', 'Open page with IDL editor and GraphiQL in browser')
//   .alias('H', 'header')
//   .describe('H', 'Specify headers to the proxied server in cURL format,' +
//      'e.g.: "Authorization: bearer XXXXXXXXX"')
//   .nargs('H', 1)
//   .implies('header', 'extend')
//   .alias('co', 'cors-origin')
//   .nargs('co', 1)
//   .describe('co', 'CORS: Define Access-Control-Allow-Origin header')
//   .help('h')
//   .alias('h', 'help')
//   .epilog(`Examples:

//   # Mock GraphQL API based on example IDL and open interactive editor
//   $0 --open

//   # Extend real data from SWAPI with faked data based on extension IDL
//   $0 ./ext-swapi.grqphql --extend http://swapi.apis.guru/

//   # Extend real data from GitHub API with faked data based on extension IDL
//   $0 ./ext-gh.graphql --extend https://api.github.com/graphql \\
//   --header "Authorization: bearer <TOKEN>"`)
//   .argv
