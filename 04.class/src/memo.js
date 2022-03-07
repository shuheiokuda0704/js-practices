#!/usr/bin/env node

const { prompt } = require('enquirer')
const MemoDB = require('./memo-db.js')

module.exports = class Memo {
  constructor () {
    this.memoDb = new MemoDB('./test.db')
  }

  async list () {
    const memos = await this.memoDb.all()
    memos.forEach(memo => console.log(memo.title))

    return memos
  }

  async reference () {
    const memos = await this.memoDb.all()

    if (memos.length === 0) return

    const question = [{
      type: 'select',
      name: 'memo',
      message: 'Choose a note you want to see:',
      choices: memos.map(function (memo) {
        return { id: memo.id, title: memo.title, content: memo.content }
      }),
      result () {
        return { id: this.focused.id, title: this.focused.name, content: this.focused.content }
      }
    }]

    const answer = await prompt(question)
    console.log(answer.memo.content)
  }

  async delete () {
    const memos = await this.memoDb.all()

    if (memos.length === 0) return

    const question = [{
      type: 'select',
      name: 'memo',
      message: 'Choose a note you want to delete:',
      choices: memos.map(function (memo) {
        return { id: memo.id, title: memo.title }
      }),
      result () {
        return { id: this.focused.id, title: this.focused.name }
      }
    }]

    const answer = await prompt(question)
    await this.memoDb.delete(answer.memo.id)
  }

  async insert () {
    process.stdin.resume()
    process.stdin.setEncoding('utf8')

    const lines = []
    const reader = require('readline').createInterface({
      input: process.stdin
    })

    await reader.on('line', (line) => {
      lines.push(line)
    })
    await reader.on('close', async () => {
      await this.memoDb.insert(lines[0], lines.join('\n'))
    })
  }
}
