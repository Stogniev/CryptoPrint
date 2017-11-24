import { getPixel } from './canvastools'

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

export function createEmptySVGstr (htmlwidth, htmlheight, viewboxwidth, videwboxheight) {
  var qrSvg = ''
  qrSvg += '<svg style="border:1px solid blue" version="1.1" xmlns="http://www.w3.org/2000/svg"'
  qrSvg += ' width="' + htmlwidth + '"'
  qrSvg += ' height="' + htmlheight + '"'
  qrSvg += ' viewBox="0 0 ' + viewboxwidth + ' ' + videwboxheight + '" '
  qrSvg += ' preserveAspectRatio="xMinYMin meet">'
  qrSvg += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>'
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

  return '<text x="' + drawx + '" transform=' + transform + ' y="' + drawy + '" style="' + style + '" font-family="' + fontFamily + '" font-size="' + fontSize + '">' + text + '</text>'
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

  var c, mc, r, mr, rect, cellSize_rect
  if (options.sizetype === '+1') {
    offset = -1
    cellSize_rect = cellSize + 2
    rect = 'l' + cellSize_rect + ',0 0,' + cellSize_rect +       // l is line
  ' -' + cellSize_rect + ',0 0,-' + cellSize_rect + 'z '
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
  return qrSvg = qrSvg.replace(search, value)
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
