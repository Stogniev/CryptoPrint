// import { chunk } from './lib'

import qrcodesplitter from 'ext/qrcodesplitter-generator/ts/build/ts/QRCode'
import qrcode from 'ext/qrcodesplitter-generator/js/qrcode.js'

var svgtemplate_front_data = "",
  svgtemplate_front_artwork = "",
  svgtemplate_back_artwork = "",
  svgtemplate_back_on_transparent_data = "";

function get(url) {
  return new Promise(function(ok, bad) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      try {
        if (this.readyState == 4) {
          if (this.status == 200) {
            var fn = ok;
            ok = false;
            bad = false;
            if (fn)
              fn(this.responseText);
            }
          else {
            var fn = bad;
            ok = false;
            bad = false;
            if (fn)
              fn(new Error(this.responseText.substring(0, 100)));
            }
          }

      } catch (e) {
        var fn = bad;
        ok = false;
        bad = false;
        if (fn)
          fn(e);
        }
      };
    xhttp.onerror = function(e) {
      var fn = bad;
      ok = false;
      bad = false;
      if (fn)
        fn(e);
      };
    xhttp.open("GET", url, true);
    xhttp.send();
  });
}

var donec = 0;
function get_done() {
  donec++;
  if (donec == 4)
    generate();
  }

//https://shimon.doodkin.com/files
//http://localhost/cryptoprint/SVGs

get('https://shimon.doodkin.com/files/Layer%202%20-%20Phase%203%20-%20Front%20Data%20Placeholders.svg').then(function(data) {
  svgtemplate_front_data = data;
  console.log('svgtemplate_front_data done');
  get_done();
}).catch(function(e) {
  console.log(e)
})get('https://shimon.doodkin.com/files/Layer%201%20-%20On%20Transparent%20Placeholders.svg').then(function(data) {
  svgtemplate_back_on_transparent_data = data;
  console.log('svgtemplate_back_on_transparent_data done');
  get_done();
}).catch(function(e) {
  console.log(e)
})get('https://shimon.doodkin.com/files/Layer%202%20-%20Phase%201%20-%20Back%20Artwork.svg').then(function(data) {
  svgtemplate_back_artwork = data;
  console.log('svgtemplate_back_artwork done');
  get_done();
}).catch(function(e) {
  console.log(e)
})get('https://shimon.doodkin.com/files/Layer%202%20-%20Phase%202%20-%20Front%20Artwork.svg').then(function(data) {
  svgtemplate_front_artwork = data;
  console.log('svgtemplate_front_artwork done');
  get_done();
}).catch(function(e) {
  console.log(e)
})

var crypto = window.crypto || window.msCrypto;
var random = crypto.getRandomValues.bind(crypto);

function shuffle(arr) {
  arr = arr.slice(0); // dont modify source arr
  const randomBuffer = new Uint8Array(arr.length); // short arrays only. less than 3000 in length, actually less than 255 in length as beccaus uint8
  random(randomBuffer);
  var ret = [],
    randi = 0;
  while (arr.length) {
    ret.push(arr.splice(randomBuffer[randi++] % arr.length, 1)[0])
  }
  return ret;
}

function make_pad__make_random_bool_array(length) {
  //let length=data.length/4
  var a = new Array(length);

  var randlen = Math.min(length, 3000);
  var i = 0,
    r = 0;
  const randomBuffer = new Uint8Array(randlen);
  while (i < length) {
    random(randomBuffer);
    for (r = 0; i < length && r < randlen; i++, r++) {
      a[i] = randomBuffer[r] > 127
        ? 1
        : 0;
    }
  }
  return a;
}

function bitarr_to_ctx(a, ctx) {
  var data = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height),
    buffer = data.data,
    len = buffer.length,
    threshold = 127,
    i = 0,
    b,
    x = 0;
  for (; i < len; i += 4, x++) {
    b = a[x] !== 0;
    buffer[i] = buffer[i + 1] = buffer[i + 2] = b
      ? 0
      : 255;
    buffer[i + 3] = b
      ? 255
      : 0;
  }
  ctx.putImageData(data, 0, 0);
}

function ctx_to_bitarr(canvas, ctx) {
  var data = ctx.getImageData(0, 0, canvas.width, canvas.height),
    buffer = data.data,
    len = buffer.length,
    threshold = 127,
    i = 0,
    lum;
  var a = new Array(buffer.length / 4)
  var x = 0;
  for (; i < len; i += 4, x++) {
    lum = buffer[i] * 0.3 + buffer[i + 1] * 0.59 + buffer[i + 2] * 0.11;
    a[x] = lum < threshold && buffer[i + 3] > 127
      ? 1
      : 0;
  }
  return a;
}

// the code tries to prevent frequency analysis
// by making even filed possible or by adding randomness on top of it

// the first char is version, to not throw away bits if all leters before are not L or K, i just put the first letter as is

// keys with too much repeating same letter are not too good for this. so they are rejected.

//var private_key="L5GsZnm9zguD92jeXxHJCqsojuQF45HM8N91A5JLkt5JpS6Hu9AG";
//console.log(getEvenFrequencyPad(private_key,144,1))

function getEvenFrequencyPad(private_key, to_n_chars, seal_layers) {
  var base58c = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  var chars_arr = private_key.split('');
  var o = "";
  o += chars_arr.shift();
  var has = base58c.split('').map(function() {
    return 0;
  });

  if (seal_layers === undefined)
    seal_layers = 1;
  chars_arr.forEach(function(a) {
    has[base58c.indexOf(a)]++;
    //                          if(has[base58c.indexOf(a)]>4) throw new Error('bad private key');
  })
  var n = to_n_chars;
  var charstoadd = ''

  const randomBuffer = new Uint8Array(n); // short arrays only. less than 3000 in length, actually less than 255 in length as beccaus uint8
  random(randomBuffer);
  var ret = [],
    randi = 0;
  var sum = chars_arr.length;

  //seal
  for (var j = 0; j < seal_layers; j++) {
    for (var i = 0; i < base58c.length && sum < n; i++) {
      if (has[i] < 2) {
        has[i]++;
        sum++;
        charstoadd += base58c[i];
      }
    }
  }

  //sparkle some randomness
  for (var i = sum; i < n; i++) {
    var rand = base58c[randomBuffer[i] % base58c.length]
    has[base58c.indexOf(rand)]++;
    charstoadd += rand;
    sum++;
  }

  var charstoadd_arr = chars_arr.map(function() {
    return "_";
  }).concat(charstoadd.split('')); //.join('');

  var pad = (shuffle(charstoadd_arr).join(''));
  o += pad.replace(/_/g, function() {
    return chars_arr.shift();
  })
  pad = ('_' + pad).split('').map(function(a) {
    return a === '_'
      ? ' '
      : '\u2588';
  }).join('');
  return {padded: o, marking: pad};
}

var random_pad = [];
var random_pad2 = [];
var imageData1
var imageData2
var imageData3
var imageData4
var imageData5
var imageData6
var public_key
var private_key
setTimeout(() => {
  throw new Error
}, 0)
function getsize(imageData) {

  var w = 0,
    a,
    iw = imageData.width,
    h = 0,
    data = imageData.data;
  for (y = 0; y < imageData.height; y++) {
    for (x = 0; x < imageData.width; x++) {
      var pixelPosition = (x * 4) + (y * iw * 4);
      a = data[pixelPosition + 3]; //alpha
      if (a > 0) {
        if (x > w)
          w = x;
        if (y > h)
          h = y;
        }
      }
  }
  return {
    w: w + 1,
    h: h + 1
  };
}

function flip_pixels(imageData, width) {
  var p,
    x,
    y,
    ix,
    w = 0,
    iw = imageData.width,
    r,
    g,
    b,
    a,
    r2,
    g2,
    b2,
    a2,
    widthm = width - 1;;
  for (y = 0; y < imageData.height; y++) {
    var ar = [];
    var pixelPosition = (0 * 4) + (y * iw * 4);
    var pixelPosition2 = (width * 4) + (y * iw * 4);
    var part = imageData.data.slice(pixelPosition, pixelPosition2);

    for (p = part.length - 4, x = 0, ix = widthm; x < width; x++, ix--, p -= 4) {

      var pixelPosition = (x * 4) + (y * iw * 4);
      var pixelPosition2 = (ix * 4) + (y * iw * 4);

      imageData.data[pixelPosition] = part[p];
      imageData.data[pixelPosition + 1] = part[p + 1];
      imageData.data[pixelPosition + 2] = part[p + 2];
      imageData.data[pixelPosition + 3] = part[p + 3];
    }
  }
  return w;
}

function randomize_pad() {
  var el1 = document.getElementById('c1');
  var ctx1 = el1.getContext('2d');
  var imageData1 = ctx1.getImageData(0, 0, ctx1.canvas.width, ctx1.canvas.height);

  var pad = make_pad__make_random_bool_array(imageData1.data.length / 4);
  pad.unshift(0)
  pad.unshift(0)
  random_pad.length = 0;
  Array.prototype.splice.apply(random_pad, pad)
}

function randomize_pad2() {

  //var el1 = document.getElementById('c1');
  //var ctx1 = el1.getContext('2d');
  //var imageData1 = ctx1.getImageData(0, 0, ctx1.canvas.width, ctx1.canvas.height);

  var pad = make_pad__make_random_bool_array(imageData4.data.length / 4);
  pad.unshift(0)
  pad.unshift(0)
  random_pad2.length = 0;
  Array.prototype.splice.apply(random_pad2, pad)
}

function setPixelRandom(imageData, x, y, r, g, b, a) {
  var index = (x + y * imageData.width) * 4;
  var index1 = (x + y * imageData.width);

  if (random_pad[index1]) {
    imageData1.data[index + 0] = r;
    imageData1.data[index + 1] = g;
    imageData1.data[index + 2] = b;
    imageData1.data[index + 3] = a;
  } else {
    imageData2.data[index + 0] = r;
    imageData2.data[index + 1] = g;
    imageData2.data[index + 2] = b;
    imageData2.data[index + 3] = a;
  }
}

function getPixel(imageData, x, y) {
  index = (x + y * imageData.width) * 4;
  return [
    imageData.data[index + 0],
    imageData.data[index + 1],
    imageData.data[index + 2],
    imageData.data[index + 3]
  ];
}

function setPixel(imageData, x, y, r, g, b, a) {
  index = (x + y * imageData.width) * 4;
  imageData.data[index + 0] = r;
  imageData.data[index + 1] = g;
  imageData.data[index + 2] = b;
  imageData.data[index + 3] = a;
  setPixelRandom(imageData, x, y, r, g, b, a)
}

function setPixel2(imageData, x, y, r, g, b, a) {
  index = (x + y * imageData.width) * 4;
  imageData.data[index + 0] = r;
  imageData.data[index + 1] = g;
  imageData.data[index + 2] = b;
  imageData.data[index + 3] = a;
  setPixelRandom2(imageData, x, y, r, g, b, a)
}

function setPixel1(imageData, x, y, r, g, b, a) {
  index = (x + y * imageData.width) * 4;
  imageData.data[index + 0] = r;
  imageData.data[index + 1] = g;
  imageData.data[index + 2] = b;
  imageData.data[index + 3] = a;
}

function printline(imageData, x, y, text) {
  var c1,
    c2,
    c3,
    c4,
    c5,
    c6,
    t,
    r = 0,
    g = 0,
    b = 0,
    n
  for (var c, rows, r, l = 0; l < text.length; l++, x += 6) {

    c = text.charCodeAt(l);
    rows = console_font_6x8[c];
    for (n = 0; n < 8; n++) {
      t = rows[n] >> 2;
      c6 = t & 1;
      c5 = t & 2;
      c4 = t & 4;
      c3 = t & 8;
      c2 = t & 16;
      c1 = t & 32;
      if (c1)
        setPixel2(imageData, x, y + n, r, g, b, 255);
      if (c2)
        setPixel2(imageData, x + 1, y + n, r, g, b, 255);
      if (c3)
        setPixel2(imageData, x + 2, y + n, r, g, b, 255);
      if (c4)
        setPixel2(imageData, x + 3, y + n, r, g, b, 255);
      if (c5)
        setPixel2(imageData, x + 4, y + n, r, g, b, 255);
      if (c6)
        setPixel2(imageData, x + 5, y + n, r, g, b, 255);
      }
    }
}

function printlines(imageData, x, y, text) {
  maxchars = Math.floor(imageData.width / 6);
  var lines = []
  text.replace(new RegExp(".{0," + maxchars + "}?\n|.{0," + maxchars + "}", 'g'), function(a) {
    if (a.length) {
      if (a[a.length - 1] == '\n')
        a = a.substring(0, a.length - 1);
      lines.push(a);
    };
    return "";
  })
  for (r = 0; r < lines.length; r++, y += 8) {
    printline(imageData, x, y, lines[r])
    y += (8 * 0.5 | 0);
  }
  return y;
}

function drawqr(imageData, x, y, qr, dotzize) {
  var rr = 0,
    gg = 0,
    bb = 0
  var m = qr.getModuleCount();
  var dotzizem = dotzize - 1;
  var xx;
  var lefttop_pixel,
    leftbottomp_pixel,
    righttopp_pixel,
    rightbottomp_pixel,
    has_left,
    has_right,
    has_above,
    has_below,
    has_above_left,
    has_below_left,
    has_above_right,
    has_below_right;

  for (var r = 0; r < m; r += 1) {
    xx = x;
    for (var c = 0; c < m; c += 1) {
      for (var j = 0; j < dotzize; j += 1) {
        for (var k = 0; k < dotzize; k += 1) {

          /*

            lefttop_pixel=(j==0 && k==0)
            leftbottom_pixel=(j==dotzizem && k==0)
            righttop_pixel=(j==0 && k==dotzizem)
            rightbottom_pixel=(j==dotzizem && k==dotzizem)

            has_left=    c>0   && qr.isDark(r, c-1)
            has_right=   c<m-1 && qr.isDark(r, c+1)
            has_above=   r>0   && qr.isDark(r-1, c)
            has_below=   r<m-1 && qr.isDark(r+1, c)

            has_above_left=r>0   && c>0 && qr.isDark(r-1, c-1)
            has_below_left=r<m-1 && c>0 && qr.isDark(r+1, c-1)

            has_above_right=r>0   && c<m-1 && qr.isDark(r-1, c+1)
            has_below_right=r<m-1 && c<m-1 && qr.isDark(r+1, c+1)


         if( dotzizem>3 &&
               ( lefttop_pixel && ( (!has_left)  && (!has_above_left)  && (!has_above) ) )
           ||  ( leftbottom_pixel && ( (!has_left)  && (!has_above_left)  && (!has_below) ) )
           ||  ( righttop_pixel && ( (!has_right)  && (!has_above_right)  && (!has_above) ) )
           ||  ( rightbottom_pixel && ( (!has_right)  && (!has_above_right)  && (!has_below) ) )

           )
         {

         }
         else*/
          {
            if(qr.isDark(r, c))
              setPixel(imageData, xx + k, y + j, rr, gg, bb, 255);
            }
          }
      }
      xx += dotzize;
    }
    y += dotzize;
  }
  return y;
};

function drawqr1(imageData, x, y, qr, dotzize) {
  var rr = 0,
    gg = 0,
    bb = 0
  var m = qr.getModuleCount();
  var dotzizem = dotzize - 1;
  var xx;
  var lefttop_pixel,
    leftbottomp_pixel,
    righttopp_pixel,
    rightbottomp_pixel,
    has_left,
    has_right,
    has_above,
    has_below,
    has_above_left,
    has_below_left,
    has_above_right,
    has_below_right;

  for (var r = 0; r < m; r += 1) {
    xx = x;
    for (var c = 0; c < m; c += 1) {
      for (var j = 0; j < dotzize; j += 1) {
        for (var k = 0; k < dotzize; k += 1) {

          /*

            lefttop_pixel=(j==0 && k==0)
            leftbottom_pixel=(j==dotzizem && k==0)
            righttop_pixel=(j==0 && k==dotzizem)
            rightbottom_pixel=(j==dotzizem && k==dotzizem)

            has_left=    c>0   && qr.isDark(r, c-1)
            has_right=   c<m-1 && qr.isDark(r, c+1)
            has_above=   r>0   && qr.isDark(r-1, c)
            has_below=   r<m-1 && qr.isDark(r+1, c)

            has_above_left=r>0   && c>0 && qr.isDark(r-1, c-1)
            has_below_left=r<m-1 && c>0 && qr.isDark(r+1, c-1)

            has_above_right=r>0   && c<m-1 && qr.isDark(r-1, c+1)
            has_below_right=r<m-1 && c<m-1 && qr.isDark(r+1, c+1)


         if( dotzizem>3 &&
               ( lefttop_pixel && ( (!has_left)  && (!has_above_left)  && (!has_above) ) )
           ||  ( leftbottom_pixel && ( (!has_left)  && (!has_above_left)  && (!has_below) ) )
           ||  ( righttop_pixel && ( (!has_right)  && (!has_above_right)  && (!has_above) ) )
           ||  ( rightbottom_pixel && ( (!has_right)  && (!has_above_right)  && (!has_below) ) )

           )
         {

         }
         else*/
          {
            if(qr.isDark(r, c))
              setPixel1(imageData, xx + k, y + j, rr, gg, bb, 255);
            }
          }
      }
      xx += dotzize;
    }
    y += dotzize;
  }
  return y;
};

function save_svg(svgelement, name) {
  var text = svgelement.innerHTML;
  var textToSaveAsBlob = new Blob([text], {type: "image/svg+xml"});
  var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);

  var downloadLink = document.createElement("a");
  downloadLink.download = name + '.svg';
  downloadLink.innerHTML = "Download File";
  downloadLink.target = '_blank';
  downloadLink.href = textToSaveAsURL;
  downloadLink.onclick = function() {
    document.body.removeChild(event.target);
  };
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);

  downloadLink.click();
}

function createSvgTag(qrSvg, parts, height, width, cellSize, margin, iheight, iwidth) {

  cellSize = cellSize || 2;
  margin = (typeof margin == 'undefined')
    ? cellSize * 4
    : margin;
  var sizeheight = height * cellSize + margin * 2;
  var sizewidth = width * cellSize + margin * 2;
  var c,
    mc,
    r,
    mr,
    rect,
    cellSize_rect;

  if (!qrSvg) {
    qrSvg = ''
    qrSvg += '<svg style="border:1px solid blue" version="1.1" xmlns="http://www.w3.org/2000/svg"';
    qrSvg += ' width="' + iwidth + '"';
    qrSvg += ' height="' + iheight + '"';
    qrSvg += ' viewBox="0 0 ' + sizewidth + ' ' + sizeheight + '" ';
    qrSvg += ' preserveAspectRatio="xMinYMin meet">';
    qrSvg += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>';
    qrSvg += '</svg>';
  }

  for (var i = 0; i < parts.length; i++) {
    var tqrSvg = ''
    var part = parts[i]
    if (part.do == 'xml') {
        tqrSvg += part.xml
      }
      if (part.do == 'str') {
          tqrSvg = part.str
        }
        if (part.do == 'text') {
            var drawx = part.x || 0;
            var drawy = part.y || 0;
            var fontSize = part.fontSize || 14;
            var lineHeight = part.lineHeight || 1.25;
            var style = part.style || "";
            var fontFamily = part.fontFamily || "Arial";
            var transform = part.transform || "";
            var text = part.text.split('\n').map(function(a, i) {
              return '<tspan x="' + drawx + '" y="' + (
              drawy + fontSize * lineHeight + i * fontSize * lineHeight) + '">' + a + '</tspan>'
            }).join('\n');

            tqrSvg += '<text x="' + drawx + '" transform=' + transform + ' y="' + drawy + '" style="' + style + '" font-family="' + fontFamily + '" font-size="' + fontSize + '">' + text + '</text>'
          }
          if (part.do == 'pixels') {
              tqrSvg += '<path d="';

              var imageData = part.data;
              cellSize = part.cellsize;
              var drawx = part.x;
              var drawy = part.y;
              var fill = part.fill || "black";
              var offset = 0;
              if (part.sizetype == '+1') {
                offset = -1;
                cellSize_rect = cellSize + 2;
                rect = 'l' + cellSize_rect + ',0 0,' + cellSize_rect + ' -' + cellSize_rect + ',0 0,-' + cellSize_rect + 'z ';
              } else if (part.sizetype == '-2 centered') {
                drawx -= 1;
                rect = 'l' + (
                cellSize) + ',0 0,' + (
                cellSize) + ' -' + (
                cellSize - 2) + ',0 0,-' + (
                cellSize) + 'z ';
              } else {
                rect = 'l' + cellSize + ',0 0,' + cellSize + ' -' + cellSize + ',0 0,-' + cellSize + 'z ';
              }

              for (r = 0; r < imageData.height; r += 1) {
                mr = r * cellSize + margin + offset + drawy;
                for (c = 0; c < imageData.width; c += 1) {
                  if (getPixel(imageData, c, r)[3] > 127) {
                    mc = c * cellSize + margin + offset + drawx;
                    tqrSvg += 'M' + mc + ',' + mr + rect;
                  }
                }
              }
              tqrSvg += '" stroke="transparent" fill="' + fill + '"/>';
            }
            //if append
            if (part.action == 'append')
              qrSvg = qrSvg.replace('</svg>', tqrSvg + '</svg>');
            if (part.action == 'postfix')
              qrSvg = qrSvg.replace(part.search, function(a) {
                return a + tqrSvg
              });
            if (part.action == 'prefix')
              qrSvg = qrSvg.replace(part.search, function(a) {
                return tqrSvg + a
              });
            if (part.action == 'replacestr')
              qrSvg = qrSvg.replace(part.search, tqrSvg);
            }

          return qrSvg;
        }

        function fillTextMultiLine(ctx, text, textAlign, x, y, lineHeight) {
          //var lineHeight = ctx.measureText("M").width * 1.2;
          ctx.textAlign = textAlign;
          var lines = text.split("\n");
          for (var i = 0; i < lines.length; ++i) {
            y += lineHeight;
            ctx.fillText(lines[i], x, y);
          }
        }
        //console.log('hello')


export function generate () {
  const publicKey = '1ApT4jNxkrxXhEDiDMUQYA9cM99P6wvg6y'
  const privateKey = 'L5GsZnm9zguD92jeXxHJCqsojuQF45HM8N91A5JLkt5JpS6Hu9AG'

  let privateKeySplit = getEvenFrequencyPad(privateKey, 144, 1)
  //    console.log(private_str,privateKeySplit.marking,privateKeySplit.padded)
  let typeNumber = 0
  let errorCorrectionLevel = 'L'
  let qr = qrcode(typeNumber, errorCorrectionLevel)
  qr.addData(privateKey)
  qr.make()
  // console.log(qr)
  // let qrmodulecount = qr.getModuleCount()
  // ///
  let sQRCode = qrcodesplitter.QRCode
  var s_ErrorCorrectLevel = qrcodesplitter.ErrorCorrectLevel
  //    var s_QRNumber = com.d_project.qrcodesplitter.QRNumber;
  //    var s_QRAlphaNum = com.d_project.qrcodesplitter.QRAlphaNum;
  //    var s_QR8BitByte = com.d_project.qrcodesplitter.QR8BitByte;
  //    var s_QRKanji = com.d_project.qrcodesplitter.QRKanji;

  // uncomment if UTF-8 support is required.
  //QRCode.stringToBytes = com.d_project.text.stringToBytes_UTF8;
  var qr_pad = new sQRCode();
  var qr_pad2 = new sQRCode();
  qr_pad.setErrorCorrectLevel(s_ErrorCorrectLevel.L);
  qr_pad.addData(privateKey);
  qr_pad2.setErrorCorrectLevel(s_ErrorCorrectLevel.L);
  qr_pad2.addData(privateKey);
  for (typeNumber = 1; typeNumber <= 40; typeNumber++) {
    try {
      qr_pad.setTypeNumber(typeNumber);
      qr_pad.make();
      qr_pad2.setTypeNumber(typeNumber);
      qr_pad2.make(true);
      break;
    } catch (e) {}
  }
  // img

  ////////

  //console.log(qrmodulecount)
  typeNumber = 0
  errorCorrectionLevel = 'M'
  var pqr = qrcode(typeNumber, errorCorrectionLevel);
  pqr.addData(publicKey);
  pqr.make();

  //<canvas id="c1" width="146" height="80" style="border:1px solid blue"></canvas>
  //<canvas id="c2" width="146" height="80" style="border:1px solid blue"></canvas> <br>
  //<canvas id="c3" width="146" height="80" style="border:1px solid blue"></canvas> <br>

  function createcanvas() {
    //width="136" height="70" style="border:1px solid blue"
    var c = document.createElement('canvas');
    c.setAttribute('id', 'c');
    c.setAttribute('width', '136');
    c.setAttribute('height', '70');
    //c.setAttribute('style','border:1px solid blue');
    return c;
  }

  var el = createcanvas(); //document.getElementById('c');
  //el.setAttribute('height',qrmodulecount)
  //el.setAttribute('width',qrmodulecount)
  var ctx = el.getContext('2d');
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  var imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

  var el1 = createcanvas(); //document.getElementById('c1');
  el1.setAttribute('height', el.getAttribute('height'))
  el1.setAttribute('width', el.getAttribute('width'))
  var ctx1 = el1.getContext('2d');
  ctx1.clearRect(0, 0, ctx1.canvas.width, ctx1.canvas.height);
  imageData1 = ctx1.getImageData(0, 0, ctx1.canvas.width, ctx1.canvas.height);

  var el2 = createcanvas(); //document.getElementById('c2');
  el2.setAttribute('height', el.getAttribute('height'))
  el2.setAttribute('width', el.getAttribute('width'))
  var ctx2 = el2.getContext('2d');
  ctx2.clearRect(0, 0, ctx2.canvas.width, ctx2.canvas.height);
  imageData2 = ctx2.getImageData(0, 0, ctx2.canvas.width, ctx2.canvas.height);

  var el3 = createcanvas(); //document.getElementById('c3');
  el3.setAttribute('height', el.getAttribute('height'))
  el3.setAttribute('width', el.getAttribute('width'))
  var ctx3 = el3.getContext('2d');
  ctx3.clearRect(0, 0, ctx3.canvas.width, ctx3.canvas.height);
  imageData3 = ctx3.getImageData(0, 0, ctx3.canvas.width, ctx3.canvas.height);

  //randomize_pad()

  drawqr1(imageData, 0, 0, qr_pad, 1)
  ctx.putImageData(imageData, 0, 0); // at coords 0,0
  var pad_of_qr = ctx_to_bitarr(el, ctx)
  pad_of_qr.unshift(0)
  pad_of_qr.unshift(0)
  random_pad.length = 0;
  Array.prototype.splice.apply(random_pad, pad_of_qr)

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

  var y = 0;
  y = drawqr(imageData, 0, 0, qr, 1) //+(8*1.75|0)

  drawqr1(imageData2, 0, 0, qr_pad2, 1)
  drawqr1(imageData3, 0, 0, pqr, 1)
  imageData = null;
  //y=printlines(imageData,0,y,publicStr)+(8*1.75|0)
  //y=printlines(imageData4,0,0,private_str)

  // ctx_size=getsize(imageData);
  ctx1_size = getsize(imageData1);
  ctx2_size = getsize(imageData2);
  ctx3_size = getsize(imageData3);
  //flip_pixels(imageData1,qrmodulecount)
  //bitarr_to_ctx(random_pad2,ctx5)
  // copy the image data back onto the canvas

  //ctx .putImageData(imageData,  0, 0);  at coords 0,0
  ctx1.putImageData(imageData1, 0, 0); // at coords 0,0
  ctx2.putImageData(imageData2, 0, 0); // at coords 0,0
  ctx3.putImageData(imageData3, 0, 0); // at coords 0,0

  //console.log(ctx1_width,ctx2_width,ctx3_width,ctx4_width,ctx5_width,ctx6_width)

  //  svgtemplate_front_data="",
  //  svgtemplate_front_artwork="",
  //  svgtemplate_back_artwork="",
  //  svgtemplate_back_on_transparent_data="";
  var span = document.createElement('span');
  span.addEventListener('click', function() {
    save_svg(this, publicKey + '_back');
  }, false);

  var bill_id = 'T01-20170000000002'
  var bill_type = 'Single Private/Public Key'
  var bill_type_subtext = 'Copy 01 of 02'
  var printhouse_id = '2018 — Tel Aviv, Israel'

  var artwork_front_defs = svgtemplate_front_artwork.match(/<defs>([\s\S]+?)<\/defs>/)[1]
  var artwork_front_content = svgtemplate_front_artwork.match(/<\/defs>([\s\S]+?)<\/svg>/)[1]

  artwork_front_content = '<g transform="scale(-1, 1) translate(-1600, 0)" >' + artwork_front_content + '</g>'
  //privateKeySplit.marking,privateKeySplit.padded

  span.innerHTML = createSvgTag(svgtemplate_front_data, [

    {
      do : 'str',
        action: 'replacestr',
        search: /MMMMMM/,
        str: publicKey.substr(publicKey.length - 6)
    }, {
      do : 'str',
        action: 'replacestr',
        search: /MMMMMM/,
        str: publicKey.substr(0, 6)
    }, {
      do : 'str',
        action: 'replacestr',
        search: /T01-20170000000001/g,
        str: bill_id
    }, {
      do : 'str',
        action: 'replacestr',
        search: /2017 — Tel Aviv, Israel/g,
        str: printhouse_id
    }, {
      do : 'str',
        action: 'replacestr',
        search: /Single Private\/Public Key/g,
        str: bill_type
    }, {
      do : 'str',
        action: 'replacestr',
        search: /Copy 01\/03/g,
        str: bill_type_subtext
    }, {
      do : 'pixels',
        action: 'replacestr',
        search: /<rect.+?id="qr_placeholder".+?<\/rect>/,
        x: 0,
        y: 115,
        data: imageData1,
        cellsize: 12,
        sizetype: '-2 centered',
        fill: '#E43DB0'
    }, {
      do : 'str',
        action: 'replacestr',
        search: /<g id="Privkey-Texts"[\s\S]+?(<g[\s\S]+?(<g[\s\S]+?<\/g>\s+)<\/g>\s+)<\/g>\s+/g,
        str: function(a) {
          var letter_i = 0;
          var order = [];
          a.replace(/<g(.+?transform="translate\(\s*(\S+)\s*,\s*(\S+)\s*\)")?.+?>[\s\S]+?(<g[\s\S]+?<\/g>\s+)<\/g>/g, function(a, a1, a2, a3, a4) {
            var x1 = parseFloat(a2 || 0),
              y1 = parseFloat(a3 || 0);
            a.replace(/(<tspan.+?>).+?(<\/tspan>)/g, function(a, a1, a2, a3, a4, a5, a6, a7) {
              var translate = a1.match(/<tspan.+?(x="(\S+)")?\s+(y="(\S+)")?.*?>/)
                var x2 = parseFloat(translate[2] || 0),
                  y2 = parseFloat(translate[4] || 0)
                order.push({
                  c: privateKeySplit.padded[letter_i],
                  i: letter_i,
                  x: x1 + x2,
                  y: y1 + y2
                });
                letter_i++
                //return a1+privateKeySplit.padded[letter_i++]+a2
              })
            })

            console.log(order)
            order.sort(function(a, b) {
              if (a.y > b.y)
                return 1;
              if (a.y < b.y)
                return -1;

              if (a.x > b.x)
                return 1;
              if (a.x < b.x)
                return -1;

              return 0
            })
            console.log(order)

            letter_i = 0;
            return a.replace(/<g(.+?transform="translate\(\s*(\S+)\s*,\s*(\S+)\s*\)")?.+?>[\s\S]+?(<g[\s\S]+?<\/g>\s+)<\/g>/g, function(a, a1, a2, a3, a4) {
              return a.replace(/(<tspan.+?>).+?(<\/tspan>)/g, function(a, a1, a2, a3, a4, a5, a6, a7) {
                return a1 + (order[letter_i++].c) + a2
              })
            });
          }
        }, {
        do : 'str',
          action: 'prefix',
          search: /<\/defs>/,
          str: artwork_front_defs
      }, {
        do : 'str',
          action: 'postfix',
          search: /<\/defs>/,
          str: artwork_front_content
      }

      //    ,{do:'str'  ,action:'replacestr', search:/█+/g ,str:publicKey }
      //    ,{do:'str'  ,action:'replacestr', search:/1JuNUKWC7FkyWEsnGRgR5pUtDTC6uQS2iR/g ,str:publicKey }
      //    ,{do:'str'  ,action:'replacestr', search:/<text id="__PRIVKEY__FULL__"[\s\S]+?\/text>/ ,str:'' }
      // {do:'pixels',action:'append',to_id:'', x:20                                          ,y:20 ,data:imageData3,cellsize:6,sizetype:'1'}
      //     {do:'pixels',action:'append',to_id:'', x:70                                            ,y:(70*8-(ctx1_size.h*11))/2,data:imageData1,cellsize:11,sizetype:'1'}
      //    ,{do:'pixels',action:'append',to_id:'', x:136*8-(ctx1_size.w*11)-70                     ,y:(70*8-(ctx1_size.h*11))/2,data:imageData2,cellsize:11,sizetype:'1'}
      //    ,{do:'text'  ,action:'append',to_id:'', y:(-60)                                          ,x: -(   ((70*8))-30    )  ,text: chunk(publicKey ,4).join('-') ,fontSize:19,fontFamily:'lucida console', style:'font-weight:bold', lineHeight:1.25, transform: "matrix(0,-1,-1,0,0,0)" }
      //,{do:'text'  ,action:'append',to_id:'', y:(136*8-60)                                          ,x: -(   ((70*8))-30    )  ,text: chunk(publicKey ,4).join('-') ,fontSize:19,fontFamily:'lucida console', style:'font-weight:bold', lineHeight:1.25, transform: "matrix(0,-1,1,0,0,0)" }
      //,{do:'pixels',action:'append',to_id:'', x:20+   (ctx1_size.w*11)+20                     ,y:220 ,data:imageData5,cellsize:3,sizetype:'1'}
      //,{do:'pixels',action:'append',to_id:'', x:136*8-(ctx1_size.w*11)-20-(ctx6_size.w*3)-20   ,y:220 ,data:imageData6,cellsize:3,sizetype:'1'}
    ], imageData1.height * 1, imageData1.width, 8, 0, imageData1.height * 2 * 1 * 1.5, imageData1.width * 2 * 1.5)
    document.getElementById('page_front_data').appendChild(span);

    var span = document.createElement('span');
    span.addEventListener('click', function() {
      save_svg(this, publicKey + '_back');
    }, false);

    var artwork_back_defs = svgtemplate_back_artwork.match(/<defs>([\s\S]+?)<\/defs>/)[1]
    var artwork_back_content = svgtemplate_back_artwork.match(/<\/defs>([\s\S]+?)<\/svg>/)[1]

    span.innerHTML = createSvgTag(svgtemplate_back_on_transparent_data, [

      {
        do : 'str',
          action: 'replacestr',
          search: /MMMMMM/,
          str: publicKey.substr(publicKey.length - 6)
      }, {
        do : 'str',
          action: 'replacestr',
          search: /MMMMMM/,
          str: publicKey.substr(0, 6)
      }, {
        do : 'str',
          action: 'replacestr',
          search: /1JuNUKWC7FkyWEsnGRgR5pUtDTC6uQS2iR/g,
          str: publicKey
      }, {
        do : 'pixels',
          action: 'replacestr',
          search: /<rect.+?id="qr_placeholder".+?<\/rect>/,
          x: 0,
          y: 115,
          data: imageData2,
          cellsize: 12,
          sizetype: '-2 centered',
          fill: '#E43DB0'
      }, {
        do : 'pixels',
          action: 'replacestr',
          search: /<rect.+?id="qr_placeholder".+?<\/rect>/,
          x: 0,
          y: 0,
          data: imageData3,
          cellsize: 12,
          sizetype: '1',
          fill: '#E43DB0'
      }, {
        do : 'str',
          action: 'replacestr',
          search: /<g id="Privkey-Texts-Copy"[\s\S]+?(<g[\s\S]+?(<g[\s\S]+?<\/g>\s+)<\/g>\s+)<\/g>\s+/g,
          str: function(a) {
            var letter_i = 0;
            var order = [];
            //return
            a.replace(/<g(.+?transform="translate\(\s*(\S+)\s*,\s*(\S+)\s*\)")?>[\s\S]+?(<g[\s\S]+?<\/g>\s+)<\/g>/g, function(a, a1, a2, a3, a4) {
              //return "";

              var x1 = parseFloat(a2 || 0),
                y1 = parseFloat(a3 || 0);
              //console.log(x1,y1)
              a.replace(/(<g.+?fill=")(.+?)(">\s+<rect.+?<\/rect>\s+<\/g>)/g, function(a, a1, a2, a3, a4, a5, a6, a7) {
                var translate = a1.match(/translate\(\s*(\S+)\s*,\s*(\S+)\s*\)/)
                  var x2 = parseFloat(translate[1] || 0),
                    y2 = parseFloat(translate[2] || 0)
                  order.push({
                    c: privateKeySplit.marking[letter_i],
                    i: letter_i,
                    x: x1 + x2,
                    y: y1 + y2
                  });
                  letter_i++
                  // return a;//''a1+(privateKeySplit.marking[letter_i++]==' '?'transparent':a2)+a3
                })
                // return a;
              })

              order.sort(function(a, b) {
                if (a.y > b.y)
                  return 1;
                if (a.y < b.y)
                  return -1;

                if (a.x > b.x)
                  return 1;
                if (a.x < b.x)
                  return -1;

                return 0
              })

              letter_i = 0;
              return a.replace(/<g id="parts\/privkey-text-blocks"( transform="translate\(\s*(\S+)\s*,\s*(\S+)\s*\)")?>[\s\S]+?(<g[\s\S]+?<\/g>\s+)<\/g>/g, function(a, a1, a2, a3, a4) {
                //return "";
                return a.replace(/(<g.+?fill=")(.+?)(">\s+<rect.+?<\/rect>\s+<\/g>)/g, function(a, a1, a2, a3, a4, a5, a6, a7) {
                  return a1 + (
                    order[letter_i++].c == ' '
                    ? 'transparent'
                    : a2) + a3
                })
              });
            }
          }, {
          do : 'str',
            action: 'prefix',
            search: /<\/defs>/,
            str: artwork_back_defs
        }, {
          do : 'str',
            action: 'postfix',
            search: /<\/defs>/,
            str: artwork_back_content
        }

        //    {do:'str'  ,action:'replacestr', search:/█+/g ,str:publicKey }
        //   ,{do:'pixels',action:'replacestr',search:/<path.+?__PUBKEY_QR__.+?\/path>/, x:250           ,y:245 ,data:imageData3,cellsize:12,sizetype:'1', fill:'#4A4A4A'}
        //   ,{do:'str'  ,action:'replacestr', search:/1JuNUKWC7FkyWEsnGRgR5pUtDTC6uQS2iR/g ,str:publicKey }
        //   ,{do:'str'  ,action:'replacestr', search:/1JuNUK/g ,str:publicKey.substr(0,6) }
        //   ,{do:'str'  ,action:'replacestr', search:/uQS2iR/g ,str:publicKey.substr(publicKey.length-6) }
        //   ,{do:'pixels',action:'replacestr',search:/<path.+?__FRONT_PRIVKEY_QR__.+?\/path>/, x: -1.00574713  ,y:185,data:imageData2,cellsize:12,sizetype:'-2centered', fill:'#4A4A4A'}

        //     ,{do:'text'  ,action:'append',to_id:'', x:130+((ctx1_size.w)*11 - ctx3_size.w*8)/2                                          ,y: ((70*8-(ctx3_size.h*8))/2) + ctx3_size.h*8 +25  ,text: chunk(publicKey.substr(0,16),4).join('-')+'\n' +chunk(publicKey.substr(16),4).join('-') ,fontSize:22,fontFamily:'lucida console', style:'font-weight:bold', lineHeight:1.25}
        //    ,{do:'text'  ,action:'append',to_id:'', y:(20)                                          ,x: -(   ((70*8))-30    )  ,text: chunk(publicKey ,4).join('-') ,fontSize:19,fontFamily:'lucida console', style:'font-weight:bold', lineHeight:1.25, transform: "matrix(0,-1,1,0,0,0)" }
        //
        //  ,{do:'pixels',action:'append',to_id:'', x:20                                          ,y:220,data:imageData1,cellsize:8,sizetype:'1'}
        //  ,{do:'pixels',action:'append',to_id:'', x:136*8-(ctx1_size.w*8)-20                     ,y:220,data:imageData2,cellsize:8,sizetype:'1'}
        //
        //  ,{do:'pixels',action:'append',to_id:'', x:20+   (ctx1_size.w*8)+20                     ,y:220 ,data:imageData5,cellsize:3,sizetype:'1'}
        //  ,{do:'pixels',action:'append',to_id:'', x:136*8-(ctx1_size.w*8)-20-(ctx6_size.w*3)-20   ,y:220 ,data:imageData6,cellsize:3,sizetype:'1'}
      ], imageData1.height * 1, imageData1.width, 8, 0, imageData1.height * 2 * 1 * 1.5, imageData1.width * 2 * 1.5)

      document.getElementById('page_back_on_transparent_data').appendChild(span);

    }

    // the code tries to prevent frequency analysis
    // by making even filed possible or by adding randomness on top of it

    // the first char is version, to not throw away bits if all leters before are not L or K, i just put the first letter as is

    // keys with too much repeating same letter are not too good for this. so they are rejected.

    //var private_key="L5GsZnm9zguD92jeXxHJCqsojuQF45HM8N91A5JLkt5JpS6Hu9AG";
    //console.log(getEvenFrequencyPad(private_key,144,1))

    function getEvenFrequencyPad(private_key, to_n_chars, seal_layers) {
      var base58c = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
      var chars_arr = private_key.split('');
      var o = "";
      o += chars_arr.shift();
      var has = base58c.split('').map(function() {
        return 0;
      });

      if (seal_layers === undefined)
        seal_layers = 1;
      chars_arr.forEach(function(a) {
        has[base58c.indexOf(a)]++;
        //                          if(has[base58c.indexOf(a)]>4) throw new Error('bad private key');
      })
      var n = to_n_chars;
      var charstoadd = ''

      const randomBuffer = new Uint8Array(n); // short arrays only. less than 3000 in length, actually less than 255 in length as beccaus uint8
      random(randomBuffer);
      var ret = [],
        randi = 0;
      var sum = chars_arr.length;

      //seal
      for (var j = 0; j < seal_layers; j++) {
        for (var i = 0; i < base58c.length && sum < n; i++) {
          if (has[i] < 2) {
            has[i]++;
            sum++;
            charstoadd += base58c[i];
          }
        }
      }

      //sparkle some randomness
      for (var i = sum; i < n; i++) {
        var rand = base58c[randomBuffer[i] % base58c.length]
        has[base58c.indexOf(rand)]++;
        charstoadd += rand;
        sum++;
      }

      var charstoadd_arr = chars_arr.map(function() {
        return "_";
      }).concat(charstoadd.split('')); //.join('');

      var pad = (shuffle(charstoadd_arr).join(''));
      o += pad.replace(/_/g, function() {
        return chars_arr.shift();
      })
      pad = ('_' + pad).split('').map(function(a) {
        return a === '_'
          ? ' '
          : '\u2588';
      }).join('');
      return {padded: o, marking: pad};
    }
