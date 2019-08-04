#!/usr/bin/env node
const path = require('path')

const {convertFiles} = require('./index.js')

const args = process.argv;

const DIR_SRC = path.resolve('./', args[2]);
const DIR_DEST = path.resolve('./', args[3]);

const CUT = args[4] === 'cut';

convertFiles({DIR_SRC, DIR_DEST, CUT})