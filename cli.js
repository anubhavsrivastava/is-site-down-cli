#!/usr/bin/env node
'use strict';
const meow = require('meow');
const { isSiteDown } = require('is-site-down');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');

updateNotifier({ pkg }).notify();
const cli = meow(
	`
	Usage
	  $ issitedown <url> 
	Options
	  url         Site to check
	Examples
	  $ issitedown https://theanubhav.com
	  $ issitedown https://devtips.theanubhav.com
	  $ issitedown https://about.theanubhav.com 
`,
	{}
);

cli.flags.app = cli.input.slice(1);

const input = cli.input[0];

if (!input) {
	console.error('Error: Specify a URL');
	cli.showHelp(1);
	process.exit(1);
}

(async () => {
	isSiteDown(input, cli.flags)
		.then(response => {
			if (response.error) {
				throw response.error;
			}
			if (!response.isitdown) {
				console.log(`${input} is up and running.`);
				return;
			}
			if (response.isitdown) {
				console.log(`${input} is down.`);
				return;
			}
		})
		.catch(e => {
			console.log('Site status check failed.');

			console.log('Reason:', e);
		});
})();
