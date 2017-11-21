// import { chunk } from './lib'

export function generate() {
  const publicKey = '1ApT4jNxkrxXhEDiDMUQYA9cM99P6wvg6y'
  const privateKey = 'L5GsZnm9zguD92jeXxHJCqsojuQF45HM8N91A5JLkt5JpS6Hu9AG'

  let privateKeySplit = getEvenFrequencyPad(privateKey, 144, 1)
  //    console.log(private_str,privateKeySplit.marking,privateKeySplit.padded)
  let typeNumber = 0
  let errorCorrectionLevel = 'L'
  let qr = qrcode(typeNumber, errorCorrectionLevel)
  qr.addData(privateKey);
  qr.make();
  //console.log(qr)
  var qrmodulecount = qr.getModuleCount();
  /////
  var s_QRCode = com.d_project.qrcodesplitter.QRCode;
  var s_ErrorCorrectLevel = com.d_project.qrcodesplitter.ErrorCorrectLevel;
  //    var s_QRNumber = com.d_project.qrcodesplitter.QRNumber;
  //    var s_QRAlphaNum = com.d_project.qrcodesplitter.QRAlphaNum;
  //    var s_QR8BitByte = com.d_project.qrcodesplitter.QR8BitByte;
  //    var s_QRKanji = com.d_project.qrcodesplitter.QRKanji;

  // uncomment if UTF-8 support is required.
  //QRCode.stringToBytes = com.d_project.text.stringToBytes_UTF8;
  var qr_pad = new s_QRCode();
  var qr_pad2 = new s_QRCode();
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
