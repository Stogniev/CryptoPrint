import { getPixel } from './canvastools'
import { createImageData, drawQRSplit, drawqr, imageDataToBitArray } from './canvastools'
import qrcodesplitter from 'ext/qrcodesplitter-generator/ts/build/ts/QRCode' // eslint-disable-line
import qrcode from 'ext/qrcodesplitter-generator/js/qrcode.js' // eslint-disable-line


export function chunk (arr, len) {
  const chunks = []
  const n = arr.length
  let i = 0

  while (i < n) {
    chunks.push(arr.slice(i, i += len))
  }

  return chunks
}

export function exportSVG (svgelement, name) {
  var text = svgelement.innerHTML
  var textToSaveAsBlob = new Blob([text], {type: 'image/svg+xml'})
  var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob)

  var downloadLink = document.createElement('a')
  downloadLink.download = name + '.svg'
  downloadLink.innerHTML = 'Download File'
  downloadLink.target = '_blank'
  downloadLink.href = textToSaveAsURL
  downloadLink.onclick = function (event) {
    document.body.removeChild(event.target)
  }
  downloadLink.style.display = 'none'
  document.body.appendChild(downloadLink)

  downloadLink.click()
}

export function createEmptySVGstr ( htmlheight, htmlwidth, viewboxwidth, videwboxheight) {
  var qrSvg = ''
  qrSvg += '<svg style="border:1px solid blue" version="1.1" xmlns="http://www.w3.org/2000/svg"'
  qrSvg += ' width="' + htmlwidth + '"'
  qrSvg += ' height="' + htmlheight + '"'
  qrSvg += ' viewBox="0 0 ' + videwboxheight + ' ' + viewboxwidth + '" '
  qrSvg += ' preserveAspectRatio="xMaxYMax meet"><defs></defs>'
  qrSvg += '</svg>'
  return qrSvg
}

export function text (options) {
  var drawx = options.x || 0
  var drawy = options.y || 0
  var fontSize = options.fontSize || 14
  var lineHeight = options.lineHeight || 1.25
  var style = options.style || ''
  var fontFamily = options.fontFamily || 'Arial'
  var transform = options.transform || ''
  var text = options.text.split('\n').map(function (a, i) { return '<tspan x="' + drawx + '" y="' + (drawy + fontSize * lineHeight + i * fontSize * lineHeight) + '">' + a + '</tspan>' }).join('\n')

  return '<text x="' + drawx + '" transform="' + transform + '" y="' + drawy + '" style="' + style + '" font-family="' + fontFamily + '" font-size="' + fontSize + '">' + text + '</text>'
}

export function imageDataToPath (options) {
  var tqrSvg = '<path d="'

  var imageData = options.data
  var cellSize = options.cellsize || 2
  var drawx = options.x || 0
  var drawy = options.y || 0
  var margin = options.margin !== undefined ? options.margin : cellSize * 4

  var fill = options.fill || 'black'
  var offset = options.offset || 0

// the size will be:
// var sizeheight = height * cellSize + margin * 2;
// var sizewidth = width * cellSize + margin * 2;

  var c, mc, r, mr, rect, cellSizeRect
  if (options.sizetype === '+1') {
    offset = -1
    cellSizeRect = cellSize + 2
    rect = 'l' + cellSizeRect + ',0 0,' + cellSizeRect +       // l is line
  ' -' + cellSizeRect + ',0 0,-' + cellSizeRect + 'z '
  } else if (options.sizetype === '-2 centered') {
    drawx -= 1
    rect = 'l' + (cellSize) + ',0 0,' + (cellSize) +         // l is line
  ' -' + (cellSize - 2) + ',0 0,-' + (cellSize) + 'z '
  } else {
    rect = 'l' + cellSize + ',0 0,' + cellSize +       // l is line
  ' -' + cellSize + ',0 0,-' + cellSize + 'z '
  }

  for (r = 0; r < imageData.height; r += 1) {
    mr = r * cellSize + margin + offset + drawy
    for (c = 0; c < imageData.width; c += 1) {
      if (getPixel(imageData, c, r)[3] > 127) { // is black then add rect path
        mc = c * cellSize + margin + offset + drawx
        tqrSvg += 'M' + mc + ',' + mr + rect // M is move to
      }
    }
  }
  tqrSvg += '" stroke="transparent" fill="' + fill + '"/>'
  return tqrSvg
}

export function postfix (qrSvg, search, value) {
  return qrSvg.replace(search, function (a) { return a + value })
}

export function prefix (qrSvg, search, value) {
  return qrSvg.replace(search, function (a) { return value + a })
}

export function replacestr (qrSvg, search, value) {
  qrSvg = qrSvg.replace(search, value)
  return qrSvg
}

export function createSvgTag (qrSvg, parts, height, width, iheight, iwidth) {
  if (!qrSvg) {
    qrSvg += createEmptySVGstr(iwidth, iheight, width, height)
  }

  for (var i = 0; i < parts.length; i++) {
    var partsvg = ''
    var part = parts[i]
    if (part.do === 'xml') {
      partsvg += part.xml
    }
    if (part.do === 'str') {
      partsvg = part.str
    }
    if (part.do === 'text') {
      partsvg += text(part)
    }
    if (part.do === 'pixels') {
      partsvg += imageDataToPath(part)
    }
// if append
    if (part.action === 'postfix') qrSvg = postfix(qrSvg, part.search, partsvg)
    if (part.action === 'prefix') qrSvg = prefix(qrSvg, part.search, partsvg)
    if (part.action === 'replacestr') qrSvg = replacestr(qrSvg, part.search, partsvg)
  }

  return qrSvg
}

export function generatePublicKey_ImageData (publicKey) {
  //input publicKey
  let typeNumber = 0
  let errorCorrectionLevel = 'M'
  let qr_publicKey = qrcode(typeNumber, errorCorrectionLevel)
  qr_publicKey.addData(publicKey)
  qr_publicKey.make()
  //let qrWidth = qr_publicKey.getModuleCount()
  let imageData_QR_pubKey = createImageData( /* qrWidth,qrWidth */)
  drawqr(imageData_QR_pubKey, 0, 0, qr_publicKey, 1)
  //output imageData_QR_pubKey
  return imageData_QR_pubKey;
}


export function generatePrivateKey_SplitImageData (privateKey) {

  //input privateKey
  let typeNumber = 0
  let errorCorrectionLevel = 'L'
  let qr_privateKey = qrcode(typeNumber, errorCorrectionLevel)
  qr_privateKey.addData(privateKey)
  qr_privateKey.make()

  let SplitterQRCode = qrcodesplitter.QRCode
  let SplitterErrorCorrectLevel = qrcodesplitter.ErrorCorrectLevel

  // uncomment if UTF-8 support is required.
  // QRCode.stringToBytes = com.d_project.text.stringToBytes_UTF8
  let qrPad = new SplitterQRCode() // the private key qr code splitting pad
  let qrPositionMarks = new SplitterQRCode() // only positioning dots for the other part of the qr code to make it beutiful
  qrPad.setErrorCorrectLevel(SplitterErrorCorrectLevel.L)
  qrPad.addData(privateKey)
  qrPositionMarks.setErrorCorrectLevel(SplitterErrorCorrectLevel.L)
  qrPositionMarks.addData(privateKey)
  for (typeNumber = 1; typeNumber <= 40; typeNumber++) { // find minimum size data fits
    try {
      qrPad.setTypeNumber(typeNumber)
      qrPad.make()  // if data not fits it throws an error, here
      qrPositionMarks.setTypeNumber(typeNumber) // if data fits, then this also executed
      qrPositionMarks.make(true)
      break // if all executed well then break
    } catch (e) {}
  }
  // output    qr_privateKey    qrPad    qrPositionMarks

  //input qrPad
  let imageDataTemp = createImageData()
  drawqr(imageDataTemp, 0, 0, qrPad, 1)
  var qrPad_bitArray = imageDataToBitArray(imageDataTemp)
  imageDataTemp = null
  // output qrPad_bitArray
   
  // input qr_privateKey qrPad_bitArray qrPositionMarks
  //let qrWidth = qr_privateKey.getModuleCount()
  let imageData_QR_privateKey       = createImageData( /* qrWidth,qrWidth */ )
  let imageData_QR_privateKey_part1 = createImageData( /* qrWidth,qrWidth */)
  let imageData_QR_privateKey_part2 = createImageData( /* qrWidth,qrWidth */)
  drawQRSplit(qrPad_bitArray, imageData_QR_privateKey, imageData_QR_privateKey_part1, imageData_QR_privateKey_part2, 0, 0, qr_privateKey, 1)
  drawqr(imageData_QR_privateKey_part2, 0, 0, qrPositionMarks, 1)
  imageData_QR_privateKey = null
  // output imageData_QR_privateKey_part1 imageData_QR_privateKey_part2
  return {  imageData_QR_privateKey_part1, imageData_QR_privateKey_part2}
}