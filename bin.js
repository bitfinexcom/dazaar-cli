#!/usr/bin/env node

const dazaar = require('dazaar')
const swarm = require('dazaar/swarm')
const hypercore = require('hypercore')

const market = dazaar('./dazaar')
const [ , , cmd, name ] = process.argv

if (cmd === 'sell') {
  if (!name) {
    console.error('Usage: dazaar sell <local-hypercore-path>')
    process.exit(1)
  }

  const feed = hypercore(name)

  const seller = market.sell(feed, {
    validate (remoteKey, cb) {
      console.log('This key wants our hypercore', remoteKey)
      cb(null)
    }
  })

  seller.ready(function (err) {
    if (err) throw err

    console.log('Customers should use this key to buy the feed:')
    console.log(seller.key.toString('hex'))
    console.log('(Write data to stdin to add data to the feed)')

    process.stdin.pipe(feed.createWriteStream())
    swarm(seller)
  })
} else if (cmd === 'buy') {
  if (!name) {
    console.error('Usage: dazaar buy <data key>')
    process.exit(1)
  }

  const buyer = market.buy(Buffer.from(name, 'hex'))

  buyer.on('feed', function () {
    console.log('Tailing Hypercore:')
    buyer.feed.createReadStream({ live: true }).pipe(process.stdout)
  })

  buyer.on('ready', function () {
    swarm(buyer)
  })
} else {
  market.on('ready', function () {
    console.log('dazaar command line tool')
    console.log()
    console.log('dazaar sell <local-hypercore-path>')
    console.log('  - Sell a Hypercore stored at the given path')
    console.log('    Will print a "Sales key" that a buyer should')
    console.log('    use to buy the data')
    console.log()
    console.log('dazaar buy <sales key> <local-hypercore-path>')
    console.log('  - Buy a Hypercore and store it at the given path')
    console.log()
    console.log('When providing payment for a Hypercore include the')
    console.log('following address in the payment so it can be validated:')
    console.log()
    console.log('  ' + market.buyer.toString('hex'))
    console.log()
  })
}
