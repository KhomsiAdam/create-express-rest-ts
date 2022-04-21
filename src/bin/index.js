#!/usr/bin/env node

const { execSync } = require('child_process');

const runCommand = (command) => {
  try {
    execSync(`${command}`, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Failed to execute ${command}`, error);
    return false;
  }
  return true;
};

const repositoryName = process.argv[2];
const gitCheckout = `git clone --depth 1 https://github.com/KhomsiAdam/create-express-ts-rest-api ${repositoryName}`;
const dependencies = `cd ${repositoryName} && yarn`;

console.log(`Creating new express typescript REST API project: ${repositoryName}...`);

const checkedOut = runCommand(gitCheckout);
if (!checkedOut) process.exit(-1);

console.log('Installing dependencies...');

const installedDeps = runCommand(dependencies);
if (!installedDeps) process.exit(-1);

console.log('Project is ready! Follow the instructions in README.md to get started.');
