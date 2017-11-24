import {
  exportSVG,
  imageDataToPath,
  postfix,
  prefix,
  replacestr
} from './lib'
import { getEvenFrequencyPad } from './crypto'
import { createImageData, drawQRSplit, drawqr, imageDataToBitArray } from './canvastools'
import fetch from 'isomorphic-fetch'

import cheerio from 'cheerio'

import qrcodesplitter from 'ext/qrcodesplitter-generator/ts/build/ts/QRCode' // eslint-disable-line
import qrcode from 'ext/qrcodesplitter-generator/js/qrcode.js' // eslint-disable-line

// Localhost will not produce errors even when requested URL doesn't exists - issue with dev server?
const getSVG = url => fetch(url).then(res => res.text()).catch(e => console.error('Unable to load', url, 'error produced:', e))

const svgTemplates = {
  frontData: '/notes/v0.2/Layer%202%20-%20Phase%203%20-%20Front%20Data%20Placeholders.svg',
  backArtwork: '/notes/v0.2/Layer%202%20-%20Phase%202%20-%20Front%20Artwork.svg',

  backData: '/notes/v0.2/Layer%201%20-%20On%20Transparent%20Placeholders.svg',
  frontArtwork: '/notes/v0.2/Layer%202%20-%20Phase%201%20-%20Back%20Artwork.svg'
}

const tpls = {}

const svgPromises = Object.keys(svgTemplates).map(key => getSVG(svgTemplates[key]).then(text => ({key, url: svgTemplates[key], text})))
const svgDatas = Promise.all(svgPromises)
  .then(r => {
    console.log('svgs:', r)
    r.map(e => Object.assign(tpls, {[e.key]: e.text}))
    tpls.ready = true
    console.log('svg templates ready', tpls)
  })

console.log('svgs?', svgDatas)

let sHeight = 500
let sWidth = 800

function generate (publicKey = 'UNSET', privateKey = 'UNSET') {
  let randomPad = []
  let imageData1
  let imageData2
  let frontPubkeyQRData

  let privateKeySplit = getEvenFrequencyPad(privateKey, 144, 1)

  let typeNumber = 0
  let errorCorrectionLevel = 'L'
  let qr = qrcode(typeNumber, errorCorrectionLevel)
  qr.addData(privateKey)
  qr.make()

  let SplitterQRCode = qrcodesplitter.QRCode
  let SplitterErrorCorrectLevel = qrcodesplitter.ErrorCorrectLevel

  // uncomment if UTF-8 support is required.
  // QRCode.stringToBytes = com.d_project.text.stringToBytes_UTF8
  let qrPad = new SplitterQRCode() // the private key qr code splitting pad
  let qrPad2 = new SplitterQRCode() // only positioning dots for the other part of the qr code to make it beutiful
  qrPad.setErrorCorrectLevel(SplitterErrorCorrectLevel.L)
  qrPad.addData(privateKey)
  qrPad2.setErrorCorrectLevel(SplitterErrorCorrectLevel.L)
  qrPad2.addData(privateKey)
  for (typeNumber = 1; typeNumber <= 40; typeNumber++) {
    try {
      qrPad.setTypeNumber(typeNumber)
      qrPad.make()
      qrPad2.setTypeNumber(typeNumber)
      qrPad2.make(true)
      break
    } catch (e) {}
  }
  // img

  typeNumber = 0
  errorCorrectionLevel = 'M'
  let pqr = qrcode(typeNumber, errorCorrectionLevel)
  pqr.addData(publicKey)
  pqr.make()

  let imageData = createImageData()

  imageData1 = createImageData()

  imageData2 = createImageData()

  frontPubkeyQRData = createImageData()

  drawqr(imageData, 0, 0, qrPad, 1)
  // ctx.putImageData(imageData, 0, 0);  at coords 0,0
  var padOfQR = imageDataToBitArray(imageData)
  padOfQR.unshift(0)
  padOfQR.unshift(0)
  randomPad.length = 0
  Array.prototype.splice.apply(randomPad, padOfQR)

  // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  imageData = createImageData()

  /* var y = 0
  y = */
  drawQRSplit(randomPad, imageData, imageData1, imageData2, 0, 0, qr, 1) // +(8*1.75|0)

  // drawqr(imageData2, 0, 0, qrPad2, 1)
  drawqr(imageData2, 0, 0, qrPad2, 1)
  drawqr(frontPubkeyQRData, 0, 0, pqr, 1)
  imageData = null

  let span
  let svg

  //  svgTemplateFrontData="",
  //  svgTemplateFrontArtwork="",
  //  svgTemplateBackArtwork="",
  //  svgTemplateBackData=""
  span = document.createElement('span')
  span.addEventListener('click', () => {
    exportSVG(this, publicKey + '_back')
  }, false)

  let nodeID = 'T01-20170000000002'
  let noteType = 'Single Private/Public Key'
  let noteTypeSubtext = 'Copy 01 of 02'
  let printerID = '2018 — Tel Aviv, Israel'

  let artworkFrontDefs = tpls.frontArtwork.match(/<defs>([\s\S]+?)<\/defs>/)[1]
  let artworkFrontContent = tpls.frontArtwork.match(/<\/defs>([\s\S]+?)<\/svg>/)[1]

  svg = tpls.frontData

  svg = replacestr(svg, /MMMMMM/, publicKey.substr(publicKey.length - 6))
  svg = replacestr(svg, /MMMMMM/, publicKey.substr(0, 6))
  svg = replacestr(svg, /T01-20170000000001/g, nodeID)
  svg = replacestr(svg, /2017 — Tel Aviv, Israel/g, printerID)
  svg = replacestr(svg, /Single Private\/Public Key/g, noteType)
  svg = replacestr(svg, /Copy 01\/03/g, noteTypeSubtext)
  svg = replacestr(svg, /<rect.+?id="qr_placeholder".+?<\/rect>/, imageDataToPath({
    x: 0,
    y: 115,
    data: imageData1,
    margin: 0,
    offset: 0,
    cellsize: 12,
    sizetype: '-2 centered',
    fill: '#E43DB0'
  }))

  svg = replacestr(svg, /<g id="Privkey-Texts"[\s\S]+?(<g[\s\S]+?(<g[\s\S]+?<\/g>\s+)<\/g>\s+)<\/g>\s+/g, function (a) {
    var letterI = 0
    var order = []
    // search and replace just to collect x,y and order
    a.replace(/<g(.+?transform="translate\(\s*(\S+)\s*,\s*(\S+)\s*\)")?.+?>[\s\S]+?(<g[\s\S]+?<\/g>\s+)<\/g>/g, function (a, a1, a2, a3, a4) {
      let x1 = parseFloat(a2 || 0)
      let y1 = parseFloat(a3 || 0)
      a.replace(/(<tspan.+?>).+?(<\/tspan>)/g, function (a, a1, a2, a3, a4, a5, a6, a7) {
        let translate = a1.match(/<tspan.+?(x="(\S+)")?\s+(y="(\S+)")?.*?>/)
        let x2 = parseFloat(translate[2] || 0)
        let y2 = parseFloat(translate[4] || 0)
        order.push({
          c: privateKeySplit.padded[letterI],
          i: letterI,
          x: x1 + x2,
          y: y1 + y2
        })
        letterI++
          // return a1+privateKeySplit.padded[letterI++]+a2
      })
    })

      // console.log(order)
    order.sort(function (a, b) {
      if (a.y > b.y) {
        return 1
      }
      if (a.y < b.y) {
        return -1
      }

      if (a.x > b.x) {
        return 1
      }
      if (a.x < b.x) {
        return -1
      }

      return 0
    })

      // console.log(order)

      // serch and replace again (same) but now replace in order
    letterI = 0
    return a.replace(/<g(.+?transform="translate\(\s*(\S+)\s*,\s*(\S+)\s*\)")?.+?>[\s\S]+?(<g[\s\S]+?<\/g>\s+)<\/g>/g, function (a, a1, a2, a3, a4) {
      return a.replace(/(<tspan.+?>).+?(<\/tspan>)/g, function (a, a1, a2, a3, a4, a5, a6, a7) {
        return a1 + (order[letterI++].c) + a2
      })
    })
  })
  svg = prefix(svg, /<\/defs>/, artworkFrontDefs)
  svg = postfix(svg, /<\/defs>/, artworkFrontContent)

  span.innerHTML = svg
  span.getElementsByTagName('svg')[0].setAttribute('height', sHeight)
  span.getElementsByTagName('svg')[0].setAttribute('width', sWidth)

  document.getElementById('page_front_data').prepend(span)

  span = document.createElement('span')
  span.addEventListener('click', function () {
    exportSVG(this, publicKey + '_back')
  }, false)

  var artworkBackDefs = tpls.backArtwork.match(/<defs>([\s\S]+?)<\/defs>/)[1]
  var artworkBackContent = tpls.backArtwork.match(/<\/defs>([\s\S]+?)<\/svg>/)[1]

  svg = tpls.backData

  svg = postfix(svg, /<g id="Print-Layouts" /, ' transform="scale(-1, 1) translate(-1600, 0)" ')

  svg = replacestr(svg, /MMMMMM/, publicKey.substr(publicKey.length - 6))
  svg = replacestr(svg, /MMMMMM/, publicKey.substr(0, 6))
  svg = replacestr(svg, /1JuNUKWC7FkyWEsnGRgR5pUtDTC6uQS2iR/g, publicKey)
  svg = replacestr(svg, /<rect.+?id="qr_placeholder".+?<\/rect>/, imageDataToPath({
    x: 0,
    y: 115,
    data: imageData2,
    margin: 0,
    offset: 0,
    cellsize: 12,
    sizetype: '-2 centered',
    fill: '#E43DB0'
  }))
  svg = replacestr(svg, /<rect.+?id="qr_placeholder".+?<\/rect>/, imageDataToPath({
    x: 0,
    y: 0,
    data: frontPubkeyQRData,
    margin: 0,
    offset: 0,
    cellsize: 12,
    sizetype: '1',
    fill: '#E43DB0'
  }))
  svg = replacestr(svg, /<g id="Privkey-Texts-Copy"[\s\S]+?(<g[\s\S]+?(<g[\s\S]+?<\/g>\s+)<\/g>\s+)<\/g>\s+/g, // find the group that contains  the svg
    function (a) { // replace parts in it
      var letterI = 0
      var order = []

      // search and replace just to collect x,y and order

      a.replace(/<g(.+?transform="translate\(\s*(\S+)\s*,\s*(\S+)\s*\)")?>[\s\S]+?(<g[\s\S]+?<\/g>\s+)<\/g>/g, function (a, a1, a2, a3, a4) {
        // return ""

        let x1 = parseFloat(a2 || 0)
        let y1 = parseFloat(a3 || 0)
        // console.log(x1,y1)
        a.replace(/(<g.+?fill=")(.+?)(">\s+<rect.+?<\/rect>\s+<\/g>)/g, function (a, a1, a2, a3, a4, a5, a6, a7) {
          let translate = a1.match(/translate\(\s*(\S+)\s*,\s*(\S+)\s*\)/)
          let x2 = parseFloat(translate[1] || 0)
          let y2 = parseFloat(translate[2] || 0)
          order.push({
            c: privateKeySplit.marking[letterI],
            i: letterI,
            x: x1 + x2,
            y: y1 + y2
          })
          letterI++
        // return a;//''a1+(privateKeySplit.marking[letterI++]==' '?'transparent':a2)+a3
        })
      // return a
      })

    // sort by x, y
      order.sort(function (a, b) {
        if (a.y > b.y) { return 1 }
        if (a.y < b.y) {
          return -1
        }

        if (a.x > b.x) {
          return 1
        }
        if (a.x < b.x) {
          return -1
        }

        return 0
      })

    // serch and replace again (same) but now replace in order
      letterI = 0
      return a.replace(/<g id="parts\/privkey-text-blocks"( transform="translate\(\s*(\S+)\s*,\s*(\S+)\s*\)")?>[\s\S]+?(<g[\s\S]+?<\/g>\s+)<\/g>/g, function (a, a1, a2, a3, a4) {
      // return ""
        return a.replace(/(<g.+?fill=")(.+?)(">\s+<rect.+?<\/rect>\s+<\/g>)/g, function (a, a1, a2, a3, a4, a5, a6, a7) {
          return a1 + (
          order[letterI++].c === ' '
          ? 'transparent'
          : a2) + a3
        })
      })
    })

  svg = prefix(svg, /<\/defs>/, artworkBackDefs)
  svg = postfix(svg, /<\/defs>/, artworkBackContent)

  span.innerHTML = svg
  span.getElementsByTagName('svg')[0].setAttribute('height', sHeight)
  span.getElementsByTagName('svg')[0].setAttribute('width', sWidth)
  document.getElementById('page_back_on_transparent_data').prepend(span)
}

export default generate

export function generatePrivateQRA (publicKey = 'UNSET', privateKey = 'UNSET') {
  let randomPad = []
  let backPrivkeyQRData
  let frontPrivkeyQRData
  let frontPubkeyQRData

  let privateKeySplit = getEvenFrequencyPad(privateKey, 144, 1)

  let typeNumber = 0
  let errorCorrectionLevel = 'L'
  let qr = qrcode(typeNumber, errorCorrectionLevel)
  qr.addData(privateKey)
  qr.make()

  let SplitterQRCode = qrcodesplitter.QRCode
  let SplitterErrorCorrectLevel = qrcodesplitter.ErrorCorrectLevel

  // uncomment if UTF-8 support is required.
  // QRCode.stringToBytes = com.d_project.text.stringToBytes_UTF8
  let qrPad = new SplitterQRCode() // the private key qr code splitting pad
  let qrPad2 = new SplitterQRCode() // only positioning dots for the other part of the qr code to make it beutiful
  qrPad.setErrorCorrectLevel(SplitterErrorCorrectLevel.L)
  qrPad.addData(privateKey)
  qrPad2.setErrorCorrectLevel(SplitterErrorCorrectLevel.L)
  qrPad2.addData(privateKey)
  for (typeNumber = 1; typeNumber <= 40; typeNumber++) {
    try {
      qrPad.setTypeNumber(typeNumber)
      qrPad.make()
      qrPad2.setTypeNumber(typeNumber)
      qrPad2.make(true)
      break
    } catch (e) {}
  }
  // img

  typeNumber = 0
  errorCorrectionLevel = 'M'
  let pqr = qrcode(typeNumber, errorCorrectionLevel)
  pqr.addData(publicKey)
  pqr.make()

  let imageData = createImageData()

  backPrivkeyQRData = createImageData()

  frontPrivkeyQRData = createImageData()

  frontPubkeyQRData = createImageData()

  drawqr(imageData, 0, 0, qrPad, 1)
  // ctx.putImageData(imageData, 0, 0);  at coords 0,0
  var padOfQR = imageDataToBitArray(imageData)
  padOfQR.unshift(0)
  padOfQR.unshift(0)
  randomPad.length = 0
  Array.prototype.splice.apply(randomPad, padOfQR)

  // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  imageData = createImageData()

  /* var y = 0
  y = */
  drawQRSplit(randomPad, imageData, backPrivkeyQRData, frontPrivkeyQRData, 0, 0, qr, 1) // +(8*1.75|0)

  // drawqr(imageData2, 0, 0, qrPad2, 1)
  drawqr(frontPrivkeyQRData, 0, 0, qrPad2, 1)
  drawqr(frontPubkeyQRData, 0, 0, pqr, 1)
  imageData = null

  let span
  let svg

  //  svgTemplateFrontData="",
  //  svgTemplateFrontArtwork="",
  //  svgTemplateBackArtwork="",
  //  svgTemplateBackData=""
  span = document.createElement('span')
  span.addEventListener('click', () => {
    exportSVG(this, publicKey + '_back')
  }, false)

  svg = tpls.frontData

  const backPrivKeySVG = imageDataToPath({
    x: 0,
    y: 115,
    data: backPrivkeyQRData,
    margin: 0,
    offset: 0,
    cellsize: 12,
    sizetype: '-2 centered',
    fill: '#E43DB0'
  })

  console.log('imageDataSVG', backPrivKeySVG)

  // svg = replacestr(svg, /<rect.+?id="qr_placeholder".+?<\/rect>/, imageData1SVG)

  svg = replacestr(svg, /<g id="Privkey-Texts"[\s\S]+?(<g[\s\S]+?(<g[\s\S]+?<\/g>\s+)<\/g>\s+)<\/g>\s+/g, function (a) {
    var letterI = 0
    var order = []
    // search and replace just to collect x,y and order
    a.replace(/<g(.+?transform="translate\(\s*(\S+)\s*,\s*(\S+)\s*\)")?.+?>[\s\S]+?(<g[\s\S]+?<\/g>\s+)<\/g>/g, function (a, a1, a2, a3, a4) {
      let x1 = parseFloat(a2 || 0)
      let y1 = parseFloat(a3 || 0)
      a.replace(/(<tspan.+?>).+?(<\/tspan>)/g, function (a, a1, a2, a3, a4, a5, a6, a7) {
        let translate = a1.match(/<tspan.+?(x="(\S+)")?\s+(y="(\S+)")?.*?>/)
        let x2 = parseFloat(translate[2] || 0)
        let y2 = parseFloat(translate[4] || 0)
        order.push({
          c: privateKeySplit.padded[letterI],
          i: letterI,
          x: x1 + x2,
          y: y1 + y2
        })
        letterI++
          // return a1+privateKeySplit.padded[letterI++]+a2
      })
    })

      // console.log(order)
    order.sort(function (a, b) {
      if (a.y > b.y) {
        return 1
      }
      if (a.y < b.y) {
        return -1
      }

      if (a.x > b.x) {
        return 1
      }
      if (a.x < b.x) {
        return -1
      }

      return 0
    })

      // console.log(order)

      // serch and replace again (same) but now replace in order
    letterI = 0
    return a.replace(/<g(.+?transform="translate\(\s*(\S+)\s*,\s*(\S+)\s*\)")?.+?>[\s\S]+?(<g[\s\S]+?<\/g>\s+)<\/g>/g, function (a, a1, a2, a3, a4) {
      return a.replace(/(<tspan.+?>).+?(<\/tspan>)/g, function (a, a1, a2, a3, a4, a5, a6, a7) {
        return a1 + (order[letterI++].c) + a2
      })
    })
  })
  // svg = prefix(svg, /<\/defs>/, artworkFrontDefs)
  // svg = postfix(svg, /<\/defs>/, artworkFrontContent)

  // span.innerHTML = svg
  // span.getElementsByTagName('svg')[0].setAttribute('height', sHeight)
  // span.getElementsByTagName('svg')[0].setAttribute('width', sWidth)

  // document.getElementById('page_front_data').prepend(span)

  span = document.createElement('span')
  span.addEventListener('click', function () {
    exportSVG(this, publicKey + '_back')
  }, false)

  var artworkBackDefs = tpls.backArtwork.match(/<defs>([\s\S]+?)<\/defs>/)[1]
  var artworkBackContent = tpls.backArtwork.match(/<\/defs>([\s\S]+?)<\/svg>/)[1]

  svg = tpls.backData

  svg = postfix(svg, /<g id="Print-Layouts" /, ' transform="scale(-1, 1) translate(-1600, 0)" ')

  svg = replacestr(svg, /MMMMMM/, publicKey.substr(publicKey.length - 6))
  svg = replacestr(svg, /MMMMMM/, publicKey.substr(0, 6))
  svg = replacestr(svg, /1JuNUKWC7FkyWEsnGRgR5pUtDTC6uQS2iR/g, publicKey)

  const frontPrivkeyQRSVG = imageDataToPath({
    x: 0,
    y: 115,
    data: frontPrivkeyQRData,
    margin: 0,
    offset: 0,
    cellsize: 12,
    sizetype: '-2 centered',
    fill: '#E43DB0'
  })
  const frontPubkey = imageDataToPath({
    x: 0,
    y: 0,
    data: frontPubkeyQRData,
    margin: 0,
    offset: 0,
    cellsize: 12,
    sizetype: '1',
    fill: '#E43DB0'
  })

  const $svg = cheerio.load(svg, {xmlMode: true})
  console.log('$svg:', $svg)

  $svg('rect#qr_placeholder').replaceWith(frontPubkey)
  $svg('rect#privkey_qr_placeholder').replaceWith(frontPrivkeyQRSVG)
  svg = $svg.html()

  svg = replacestr(svg, /<g id="Privkey-Texts-Copy"[\s\S]+?(<g[\s\S]+?(<g[\s\S]+?<\/g>\s+)<\/g>\s+)<\/g>\s+/g, // find the group that contains  the svg
    function (a) { // replace parts in it
      var letterI = 0
      var order = []

      // search and replace just to collect x,y and order

      a.replace(/<g(.+?transform="translate\(\s*(\S+)\s*,\s*(\S+)\s*\)")?>[\s\S]+?(<g[\s\S]+?<\/g>\s+)<\/g>/g, function (a, a1, a2, a3, a4) {
        // return ""

        let x1 = parseFloat(a2 || 0)
        let y1 = parseFloat(a3 || 0)
        // console.log(x1,y1)
        a.replace(/(<g.+?fill=")(.+?)(">\s+<rect.+?<\/rect>\s+<\/g>)/g, function (a, a1, a2, a3, a4, a5, a6, a7) {
          let translate = a1.match(/translate\(\s*(\S+)\s*,\s*(\S+)\s*\)/)
          let x2 = parseFloat(translate[1] || 0)
          let y2 = parseFloat(translate[2] || 0)
          order.push({
            c: privateKeySplit.marking[letterI],
            i: letterI,
            x: x1 + x2,
            y: y1 + y2
          })
          letterI++
        // return a;//''a1+(privateKeySplit.marking[letterI++]==' '?'transparent':a2)+a3
        })
      // return a
      })

    // sort by x, y
      order.sort(function (a, b) {
        if (a.y > b.y) { return 1 }
        if (a.y < b.y) {
          return -1
        }

        if (a.x > b.x) {
          return 1
        }
        if (a.x < b.x) {
          return -1
        }

        return 0
      })

    // serch and replace again (same) but now replace in order
      letterI = 0
      return a.replace(/<g id="parts\/privkey-text-blocks"( transform="translate\(\s*(\S+)\s*,\s*(\S+)\s*\)")?>[\s\S]+?(<g[\s\S]+?<\/g>\s+)<\/g>/g, function (a, a1, a2, a3, a4) {
      // return ""
        return a.replace(/(<g.+?fill=")(.+?)(">\s+<rect.+?<\/rect>\s+<\/g>)/g, function (a, a1, a2, a3, a4, a5, a6, a7) {
          return a1 + (
          order[letterI++].c === ' '
          ? 'transparent'
          : a2) + a3
        })
      })
    })

  svg = prefix(svg, /<\/defs>/, artworkBackDefs)
  svg = postfix(svg, /<\/defs>/, artworkBackContent)

  span.innerHTML = svg
  span.getElementsByTagName('svg')[0].setAttribute('height', sHeight)
  span.getElementsByTagName('svg')[0].setAttribute('width', sWidth)
  document.getElementById('page_back_on_transparent_data').prepend(span)
}
