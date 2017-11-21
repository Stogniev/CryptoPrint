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
