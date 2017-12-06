import { getPixel,createBitArrayData,setBitXYArray } from './canvastools'
import { createImageData, drawQRSplit, drawqr, imageDataToBitArray } from './canvastools'
import qrcodesplitter from 'ext/qrcodesplitter-generator/ts/build/ts/QRCode' // eslint-disable-line
import qrcode from 'ext/qrcodesplitter-generator/js/qrcode.js' // eslint-disable-line
import { code128svg } from './barcode128' 
 
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
  var text = svgelement.innerHTML.replace(/style="border:1px solid blue"/,'')
  
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
  qrSvg += '<svg style="border:1px solid blue" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="w3.org/1999/xlink"'
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
  var align = options.align || 'start'
  var text = options.text.split('\n').map(function (a, i) { return '<tspan x="' + drawx + '" y="' + (drawy + fontSize * lineHeight + i * fontSize * lineHeight) + '">' + a + '</tspan>' }).join('\n')
 
  return '<text x="' + drawx + '"  transform="' + transform + '" y="' + drawy + '" style="text-anchor: '+align+';' + style + '" font-family="' + fontFamily + '" font-size="' + fontSize + '">' + text + '</text>'
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
  let qrWidth = qr_privateKey.getModuleCount()
  
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
  // output    qr_privateKey    qrPad    qrPositionMarks  qrWidth

  //input qrPad    qrWidth
  let imageDataTemp = createImageData(  qrWidth,qrWidth  )
  drawqr(imageDataTemp, 0, 0, qrPad, 1)
  var qrPad_bitArray = imageDataToBitArray(imageDataTemp)
  imageDataTemp = null
  // output qrPad_bitArray
   
  // input qr_privateKey qrPad_bitArray qrPositionMarks   qrWidth
  let imageData_QR_privateKey       = createImageData( qrWidth,qrWidth )
  let imageData_QR_privateKey_part1 = createImageData( qrWidth,qrWidth )
  let imageData_QR_privateKey_part2 = createImageData( qrWidth,qrWidth )
  drawQRSplit(qrPad_bitArray, imageData_QR_privateKey, imageData_QR_privateKey_part1, imageData_QR_privateKey_part2, 0, 0, qr_privateKey, 1)
  drawqr(imageData_QR_privateKey_part2, 0, 0, qrPositionMarks, 1)
  imageData_QR_privateKey = null
  // output imageData_QR_privateKey_part1 imageData_QR_privateKey_part2
  return {  imageData_QR_privateKey_part1, imageData_QR_privateKey_part2}
}





export function generatePrivateKey_vlines_SplitImageData (privateKey) {

  //input privateKey
  let typeNumber = 0
  let errorCorrectionLevel = 'L'
  let qr_privateKey = qrcode(typeNumber, errorCorrectionLevel)
  qr_privateKey.addData(privateKey)
  qr_privateKey.make()
  let qrWidth = qr_privateKey.getModuleCount()
  //output qr_privateKey  qrWidth
  
  
/*
  // optionaly uncomment to have position marks:
  
  //input  privateKey
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
      //qrPad.setTypeNumber(typeNumber)
      //qrPad.make()  // if data not fits it throws an error, here
      qrPositionMarks.setTypeNumber(typeNumber) // if data fits, then this also executed
      qrPositionMarks.make(true)
      break // if all executed well then break
    } catch (e) {}
  }
  //output qrPositionMarks
*/


  //input qrWidth
  let imageData_QR_privateKey       = createImageData(  qrWidth,qrWidth  )
  let qrPad_bitArrayData=createBitArrayData(imageData_QR_privateKey.height,imageData_QR_privateKey.width)
  const bitpad_data=qrPad_bitArrayData.data, bitpad_width=qrPad_bitArrayData.width;
  for(let x=0;x<qrPad_bitArrayData.width;x++)
  {
      for(let y=0;y<qrPad_bitArrayData.height;y++)
          setBitXYArray (bitpad_data, bitpad_width, x, y, x%2===0?1:0) 
  }
  let qrPad_bitArray = qrPad_bitArrayData.data
  // output qrPad_bitArray

  // input qr_privateKey qrPad_bitArray qrPositionMarks   qrWidth
  let imageData_QR_privateKey_part1 = createImageData( qrWidth,qrWidth )
  let imageData_QR_privateKey_part2 = createImageData( qrWidth,qrWidth )
  drawQRSplit(qrPad_bitArray, imageData_QR_privateKey, imageData_QR_privateKey_part1, imageData_QR_privateKey_part2, 0, 0, qr_privateKey, 1)
  //drawqr(imageData_QR_privateKey_part2, 0, 0, qrPositionMarks, 1)  // optionaly uncomment to have position marks
  imageData_QR_privateKey = null
  // output imageData_QR_privateKey_part1 imageData_QR_privateKey_part2
  
  return {  imageData_QR_privateKey_part1, imageData_QR_privateKey_part2}
}





export function cropmarkv(x,y)
{
	//viewBox="0 0 33 33"
	
   return '<g transform="translate(-16 -16) translate('+x+' '+y+')">'
    +'\r\n <g transform="translate(-257 -73) scale(.70805)">'
	+'\r\n <path fill="#fff" fill-rule="evenodd" stroke="#fff" d="M410 126h-16m-16 0h-15"/>'
	+'\r\n <path fill="#fff" d="M388 103v47h-4v-47z"/>'
	+'\r\n <circle cx="126" cy="-386" r="9" fill="#fff" transform="rotate(90)"/>'
	+'\r\n <circle cx="126" cy="-386" r="8" stroke="#000" stroke-linecap="round" stroke-linejoin="bevel" transform="rotate(90)"/>'
	+'\r\n <path fill="none" stroke="#000" d="M386 103v16"/>'
	+'\r\n <path fill="#fff" fill-rule="evenodd" stroke="#fff" d="M386 119v15"/>'
	+'\r\n <path fill="none" stroke="#000" d="M386 134v16"/>'
	+'\r\n <circle cx="126" cy="-386" r="15" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="bevel" transform="rotate(90)"/>'
	+'\r\n </g>'
	
	+'\r\n</g>'
}

export function cropmarkh(x,y)
{
	//viewBox="0 0 33 33"
	
    return '<g transform="translate(-16 -16) translate('+x+' '+y+')">'
    +'\r\n <g transform="translate(-257 -73) scale(.70805)">'
    +'\r\n <path fill="#fff" fill-rule="evenodd" stroke="#fff" d="M386 103v16m0 15v16"/>'
    +'\r\n <path fill="#fff" d="M363 124h47v4h-47z"/>'
    +'\r\n <circle cx="386" cy="126" r="9" fill="#fff"/>'
    +'\r\n <circle cx="386" cy="126" r="8" stroke="#000" stroke-linecap="round" stroke-linejoin="bevel"/>'
    +'\r\n <path fill="none" stroke="#000" d="M363 126h15"/>'
    +'\r\n <path fill="#fff" fill-rule="evenodd" stroke="#fff" d="M378 126h16"/>'
    +'\r\n <path fill="none" stroke="#000" d="M394 126h16"/>'
    +'\r\n <circle cx="386" cy="126" r="15" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="bevel"/>'
    +'\r\n </g>'
	+'</g>'
}


export function hline(x,y,w)
{

    return '<g transform=" translate('+x+' '+y+')">'
    +'\r\n <g fill="none" stroke="#000"><path d="M-'+(w/2)+' 3h'+w+'"/></g>'
	+'</g>'
}


export function vline(x,y,h)
{

    return '<g transform=" translate('+x+' '+y+')">'
    +'\r\n <g fill="none" stroke="#000"><path d="M2-'+(h/2)+'v'+h+'"/></g>'
	+'</g>'
}


export function barcode128(x,y,width,text)
{
	let svg=code128svg(text,2,40);
	let [svgw/*,svgh*/]=svg.match(/viewBox\s*=\s*"([^"]+)"/)[1].trim().split(/\s+/).map(a=>parseFloat(a)).slice(2);

	var svgbarcode=svg.match(/<svg [^>]+>([\s\S]+?)<\/svg>/)[1]
  //console.log(JsBarcode); 
    return '<g transform="translate(0 '+width+') translate('+x+' '+y+')">'
    +'<g transform="rotate(-90)">'
    +'<g transform="scale('+(width/svgw).toFixed(8)+')">'
    +svgbarcode
	+'</g>'
	+'</g>'
	+'</g>'
}



