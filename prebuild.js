let fs = require('fs')
let appache = './public/tpl.manifest.appcache'

let f = fs.readFileSync(appache, 'utf8')

f = f + '\n# ' + Date.now() + '\n'

console.log('Update manifest.appcache...')
fs.writeFileSync(appache.replace('tpl.', ''), f)

let manifestJson = './public/tpl.manifest.json'
let json = require(manifestJson)

let env = process.env.NODE_ENV || 'development'

if (env === 'staging') {
  json.icons[0].src = 'images/app-icon/icon-stage.png'
  json.name = json.name + ' - STAGING'
} else if (env === 'development') {
  json.icons[0].src = 'images/app-icon/icon-dev.png'
  json.name = json.name + ' - DEVELOPMENT'
}

let str = JSON.stringify(json, 1, 1)

console.log('Update manifest.json...')
fs.writeFileSync(manifestJson.replace('tpl.', ''), str)

console.log('ENV:', env)
