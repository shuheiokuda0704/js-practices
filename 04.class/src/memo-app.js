#!/usr/bin/env node

const Memo = require('./memo.js')

const argv = require('minimist')(process.argv.slice(2))
const listOption = argv.l || false
const referenceOption = argv.r || false
const deleteOption = argv.d || false;

(() => {
  const memo = new Memo()

  if (listOption) {
    memo.list()
  } else if (referenceOption) {
    memo.reference()
  } else if (deleteOption) {
    memo.delete()
  } else {
    memo.insert()
  }
})()
