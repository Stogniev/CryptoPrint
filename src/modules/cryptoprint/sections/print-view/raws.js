import { save_svg, get,  imageData_to_path  ,postfix,prefix,replacestr   } from './lib'
import { getEvenFrequencyPad } from './crypto'
import { createImageData, drawqr_split, drawqr, imagedata_to_bitarr } from './canvastools'
import fetch from 'isomorphic-fetch'

import qrcodesplitter from 'ext/qrcodesplitter-generator/ts/build/ts/QRCode' // eslint-disable-line
import qrcode from 'ext/qrcodesplitter-generator/js/qrcode.js' // eslint-disable-line

//setTimeout(()=>{throw new Error},0)

const templates = {
  frontData: 'https://shimon.doodkin.com/files/Layer%202%20-%20Phase%203%20-%20Front%20Data%20Placeholders.svg',
  frontArtwork: 'https://shimon.doodkin.com/files/Layer%202%20-%20Phase%202%20-%20Front%20Artwork.svg',

  backData: 'https://shimon.doodkin.com/files/Layer%201%20-%20On%20Transparent%20Placeholders.svg',
  backArtwork: 'https://shimon.doodkin.com/files/Layer%202%20-%20Phase%201%20-%20Back%20Artwork.svg'
}

let sHeight = 300
let sWidth = 400

let svgtemplate_front_data = '',
  svgtemplate_front_artwork = '',
  svgtemplate_back_artwork = '',
  svgtemplate_back_on_transparent_data = ''

var donec = 0;
function get_done() {
  donec++;
  if (donec === 4)
    console.log('svg templates loaded')
    //generate();
  }

//https://shimon.doodkin.com/files
//http://localhost/cryptoprint/SVGs

get('https://shimon.doodkin.com/files/Layer%202%20-%20Phase%203%20-%20Front%20Data%20Placeholders.svg').then(function(data) {
  svgtemplate_front_data = data;
  console.log('svgtemplate_front_data done');
  get_done();
}).catch(function(e) {
  console.log(e)
});

get('https://shimon.doodkin.com/files/Layer%201%20-%20On%20Transparent%20Placeholders.svg').then(function(data) {
  svgtemplate_back_on_transparent_data = data;
  console.log('svgtemplate_back_on_transparent_data done');
  get_done();
}).catch(function(e) {
  console.log(e)
});

get('https://shimon.doodkin.com/files/Layer%202%20-%20Phase%201%20-%20Back%20Artwork.svg').then(function(data) {
  svgtemplate_back_artwork = data;
  console.log('svgtemplate_back_artwork done');
  get_done();
}).catch(function(e) {
  console.log(e)
});

get('https://shimon.doodkin.com/files/Layer%202%20-%20Phase%202%20-%20Front%20Artwork.svg').then(function(data) {
  svgtemplate_front_artwork = data;
  console.log('svgtemplate_front_artwork done');
  get_done();
}).catch(function(e) {
  console.log(e)
});

function generate() {

  var random_pad = [];
  var imageData1
  var imageData2
  var imageData3

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
  // /
  let splitter_QRCode = qrcodesplitter.QRCode
  var splitter_ErrorCorrectLevel = qrcodesplitter.ErrorCorrectLevel
  //    var s_QRNumber = com.d_project.qrcodesplitter.QRNumber;
  //    var s_QRAlphaNum = com.d_project.qrcodesplitter.QRAlphaNum;
  //    var s_QR8BitByte = com.d_project.qrcodesplitter.QR8BitByte;
  //    var s_QRKanji = com.d_project.qrcodesplitter.QRKanji;

  // uncomment if UTF-8 support is required.
  //QRCode.stringToBytes = com.d_project.text.stringToBytes_UTF8;
  var qr_pad = new splitter_QRCode(); // the private key qr code splitting pad
  var qr_pad2 = new splitter_QRCode(); // only positioning dots for the other part of the qr code to make it beutiful
  qr_pad.setErrorCorrectLevel(splitter_ErrorCorrectLevel.L);
  qr_pad.addData(privateKey);
  qr_pad2.setErrorCorrectLevel(splitter_ErrorCorrectLevel.L);
  qr_pad2.addData(privateKey);
  for (typeNumber = 1; typeNumber <= 40; typeNumber++) {
    try {
      qr_pad.setTypeNumber(typeNumber)
      qr_pad.make()
      qr_pad2.setTypeNumber(typeNumber)
      qr_pad2.make(true)
      break;
    } catch (e) {}
  }
  // img

  ////////

  //console.log(qrmodulecount)
  typeNumber = 0
  errorCorrectionLevel = 'M'
  var pqr = qrcode(typeNumber, errorCorrectionLevel)
  pqr.addData(publicKey)
  pqr.make()

  //<canvas id="c1" width="146" height="80" style="border:1px solid blue"></canvas>
  //<canvas id="c2" width="146" height="80" style="border:1px solid blue"></canvas> <br>
  //<canvas id="c3" width="146" height="80" style="border:1px solid blue"></canvas> <br>

  //var el = createcanvas(); //document.getElementById('c');
  //el.setAttribute('height',qrmodulecount)
  //el.setAttribute('width',qrmodulecount)
  //var ctx = el.getContext('2d');
  //ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  var imageData =  createImageData();//ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

  //var el1 = createcanvas(); //document.getElementById('c1');
  //el1.setAttribute('height', el.getAttribute('height'))
  //el1.setAttribute('width', el.getAttribute('width'))
  //var ctx1 = el1.getContext('2d');
  //ctx1.clearRect(0, 0, ctx1.canvas.width, ctx1.canvas.height);
  imageData1 =  createImageData();// ctx1.getImageData(0, 0, ctx1.canvas.width, ctx1.canvas.height);

  //var el2 = createcanvas(); //document.getElementById('c2');
  //el2.setAttribute('height', el.getAttribute('height'))
  //el2.setAttribute('width', el.getAttribute('width'))
  //var ctx2 = el2.getContext('2d');
  //ctx2.clearRect(0, 0, ctx2.canvas.width, ctx2.canvas.height);
  imageData2 =  createImageData();//ctx2.getImageData(0, 0, ctx2.canvas.width, ctx2.canvas.height);

  //var el3 = createcanvas(); //document.getElementById('c3');
  //el3.setAttribute('height', el.getAttribute('height'))
  //el3.setAttribute('width', el.getAttribute('width'))
  //var ctx3 = el3.getContext('2d');
  //ctx3.clearRect(0, 0, ctx3.canvas.width, ctx3.canvas.height);
  imageData3 =  createImageData();//ctx3.getImageData(0, 0, ctx3.canvas.width, ctx3.canvas.height);

  drawqr(imageData, 0, 0, qr_pad, 1)
  //ctx.putImageData(imageData, 0, 0); // at coords 0,0
  var pad_of_qr = imagedata_to_bitarr(imageData)
  pad_of_qr.unshift(0)
  pad_of_qr.unshift(0)
  random_pad.length = 0;
  Array.prototype.splice.apply(random_pad, pad_of_qr)

  //ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  imageData = createImageData();//ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

  /*var y = 0;
  y = */drawqr_split(random_pad, imageData, imageData1, imageData2, 0, 0, qr, 1) //+(8*1.75|0)

  // drawqr(imageData2, 0, 0, qr_pad2, 1)
  drawqr(imageData3, 0, 0, pqr, 1)
  imageData = null;

  // ctx_size=getsize(imageData);
  //var ctx1_size = getsize(imageData1);
  //var ctx2_size = getsize(imageData2);
  //var ctx3_size = getsize(imageData3);

  // copy the image data back onto the canvas

  //ctx .putImageData(imageData,  0, 0);  at coords 0,0
  //ctx1.putImageData(imageData1, 0, 0); // at coords 0,0
  //ctx2.putImageData(imageData2, 0, 0); // at coords 0,0
  //ctx3.putImageData(imageData3, 0, 0); // at coords 0,0

  //console.log(ctx1_width,ctx2_width,ctx3_width,ctx4_width,ctx5_width,ctx6_width)

  var span,svg;

  //  svgtemplate_front_data="",
  //  svgtemplate_front_artwork="",
  //  svgtemplate_back_artwork="",
  //  svgtemplate_back_on_transparent_data="";
  span = document.createElement('span');
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
      //if(svg=='')
	//svg=createEmptySVGstr(imageData1.width,imageData1.height,
	//                          imageData1.width,imageData1.height);

	svg=svgtemplate_front_data;

	svg=replacestr(svg, /MMMMMM/, publicKey.substr(publicKey.length-6) )
	svg=replacestr(svg, /MMMMMM/, publicKey.substr(0,6) )
	svg=replacestr(svg, /T01-20170000000001/g, bill_id )
	svg=replacestr(svg, /2017 — Tel Aviv, Israel/g, printhouse_id )
	svg=replacestr(svg, /Single Private\/Public Key/g, bill_type )
	svg=replacestr(svg, /Copy 01\/03/g, bill_type_subtext )
    svg=replacestr(svg, /<rect.+?id="qr_placeholder".+?<\/rect>/  ,  imageData_to_path( {x: 0, y:115, data:imageData1, margin:0, offset:0, cellsize:12,sizetype:'-2 centered', fill:'#E43DB0'} )  )

	svg=replacestr(svg, /<g id="Privkey-Texts"[\s\S]+?(<g[\s\S]+?(<g[\s\S]+?<\/g>\s+)<\/g>\s+)<\/g>\s+/g,
      function(a){
        var letter_i=0;
        var order=[];
		// search and replace just to collect x,y and order
		a.replace(/<g(.+?transform="translate\(\s*(\S+)\s*,\s*(\S+)\s*\)")?.+?>[\s\S]+?(<g[\s\S]+?<\/g>\s+)<\/g>/g,function(a,a1,a2,a3,a4){
          var x1=parseFloat(a2||0),y1=parseFloat(a3||0);
           a.replace(/(<tspan.+?>).+?(<\/tspan>)/g,function(a,a1,a2,a3,a4,a5,a6,a7 ){
            var translate=a1.match(/<tspan.+?(x="(\S+)")?\s+(y="(\S+)")?.*?>/)
            var x2=parseFloat(translate[2]||0),  y2=parseFloat(translate[4]||0)
            order.push({c:privateKeySplit.padded[letter_i],i:letter_i,x:x1+x2,y:y1+y2});
            letter_i++
            //return a1+privateKeySplit.padded[letter_i++]+a2
          })
        })

        // console.log(order)
        order.sort(function(a,b){
          if(a.y>b.y) return 1;
          if(a.y<b.y) return -1;

          if(a.x>b.x) return 1;
          if(a.x<b.x) return -1;

          return 0
        })

        //console.log(order)

        // serch and replace again (same) but now replace in order
        letter_i=0;
        return a.replace(/<g(.+?transform="translate\(\s*(\S+)\s*,\s*(\S+)\s*\)")?.+?>[\s\S]+?(<g[\s\S]+?<\/g>\s+)<\/g>/g,function(a,a1,a2,a3,a4){
          return a.replace(/(<tspan.+?>).+?(<\/tspan>)/g,function(a,a1,a2,a3,a4,a5,a6,a7 ){
            return a1+(order[letter_i++].c)+a2
          })
        });
      }

	)
	svg=prefix(svg, /<\/defs>/, artwork_front_defs )
	svg=postfix(svg, /<\/defs>/, artwork_front_content )

	span.innerHTML = svg;
	span.getElementsByTagName("svg")[0].setAttribute('height',sHeight)
	span.getElementsByTagName("svg")[0].setAttribute('width',sWidth)

	document.getElementById('page_front_data').appendChild(span);

    span = document.createElement('span');
    span.addEventListener('click', function() {
      save_svg(this, publicKey + '_back');
    }, false);

    var artwork_back_defs=svgtemplate_back_artwork.match(/<defs>([\s\S]+?)<\/defs>/)[1]
    var artwork_back_content=svgtemplate_back_artwork.match(/<\/defs>([\s\S]+?)<\/svg>/)[1]


    svg=svgtemplate_back_on_transparent_data;
    svg=replacestr(svg, /MMMMMM/ , publicKey.substr(publicKey.length-6) )
    svg=replacestr(svg, /MMMMMM/  ,  publicKey.substr(0,6) )
    svg=replacestr(svg,  /1JuNUKWC7FkyWEsnGRgR5pUtDTC6uQS2iR/g ,  publicKey )
    svg=replacestr(svg, /<rect.+?id="qr_placeholder".+?<\/rect>/  ,  imageData_to_path( {x: 0, y:115, data:imageData2, margin:0, offset:0, cellsize:12, sizetype:'-2 centered', fill:'#E43DB0'} )  )
    svg=replacestr(svg, /<rect.+?id="qr_placeholder".+?<\/rect>/  ,  imageData_to_path( {x: 0, y:0, data:imageData3, margin:0, offset:0, cellsize:12, sizetype:'1', fill:'#E43DB0'}  ) )
    svg=replacestr(svg,

		/<g id="Privkey-Texts-Copy"[\s\S]+?(<g[\s\S]+?(<g[\s\S]+?<\/g>\s+)<\/g>\s+)<\/g>\s+/g  ,  // find the group that contains  the svg

		function(a) { // replace parts in it
			var letter_i=0;
			var order=[];

			// search and replace just to collect x,y and order

			a.replace(/<g(.+?transform="translate\(\s*(\S+)\s*,\s*(\S+)\s*\)")?>[\s\S]+?(<g[\s\S]+?<\/g>\s+)<\/g>/g,function(a,a1,a2,a3,a4){
			   //return "";

			   var x1=parseFloat(a2||0),y1=parseFloat(a3||0);
				//console.log(x1,y1)
				a.replace(/(<g.+?fill=")(.+?)(">\s+<rect.+?<\/rect>\s+<\/g>)/g,function(a,a1,a2,a3,a4,a5,a6,a7 ){
				 var translate=a1.match(/translate\(\s*(\S+)\s*,\s*(\S+)\s*\)/)
				 var x2=parseFloat(translate[1]||0),  y2=parseFloat(translate[2]||0)
				 order.push({c:privateKeySplit.marking[letter_i],i:letter_i,x:x1+x2,y:y1+y2});
				 letter_i++
				 // return a;//''a1+(privateKeySplit.marking[letter_i++]==' '?'transparent':a2)+a3
			  })
			   // return a;
			})

			// sort by x, y
			order.sort(function(a,b){
			  if(a.y>b.y) return 1;
			  if(a.y<b.y) return -1;

			  if(a.x>b.x) return 1;
			  if(a.x<b.x) return -1;

			  return 0
			})

			// serch and replace again (same) but now replace in order
			letter_i=0;
			return a.replace(/<g id="parts\/privkey-text-blocks"( transform="translate\(\s*(\S+)\s*,\s*(\S+)\s*\)")?>[\s\S]+?(<g[\s\S]+?<\/g>\s+)<\/g>/g,function(a,a1,a2,a3,a4){
			   //return "";
			   return a.replace(/(<g.+?fill=")(.+?)(">\s+<rect.+?<\/rect>\s+<\/g>)/g,function(a,a1,a2,a3,a4,a5,a6,a7 ){
				  return a1+(order[letter_i++].c===' '?'transparent':a2)+a3
			  })
			});
		  }

	)


    svg=prefix(svg,  /<\/defs>/  , artwork_back_defs  )
    svg=postfix(svg, /<\/defs>/  , artwork_back_content  )

	span.innerHTML = svg;
	span.getElementsByTagName("svg")[0].setAttribute('height', sHeight)
	span.getElementsByTagName("svg")[0].setAttribute('width', sWidth)
      document.getElementById('page_back_on_transparent_data').appendChild(span);

    }

    export default generate
