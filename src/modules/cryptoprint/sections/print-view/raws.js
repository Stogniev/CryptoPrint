import {
  exportSVG,
  imageDataToPath,
  postfix,
  prefix,
  replacestr,
  generatePublicKey_ImageData,
  //generatePrivateKey_SplitImageData,
  generatePrivateKey_vlines_SplitImageData,
  createEmptySVGstr,
  text,
  cropmarkv,
  cropmarkh,
  hline,
  vline,
  barcode128
} from './lib'
import { getEvenFrequencyPad,getBitcoinKeypair } from './crypto'
 
 
import fetch from 'isomorphic-fetch'

import cheerio from 'cheerio'



function generate_set(svgDatas, publicKey = 'UNSET', privateKey = 'UNSET') {


  let privateKeySplit = getEvenFrequencyPad(privateKey, 144, 1);
  let { imageData_QR_privateKey_part1, imageData_QR_privateKey_part2} = generatePrivateKey_vlines_SplitImageData (privateKey);
  let imageData_QR_pubKey=generatePublicKey_ImageData(publicKey);


  let svg

  let nodeID = 'T01-20170000000002'
  let noteType = 'Single Private/Public Key'
  let noteTypeSubtext = 'Copy 01 of 02'
  let printerID = '2018 — Tel Aviv, Israel'

  let artworkBackDefs = svgDatas.backArtwork.match(/<defs>([\s\S]+?)<\/defs>/)[1]
  let artworkBackContent = svgDatas.backArtwork.match(/<\/defs>([\s\S]+?)<\/svg>/)[1]

  svg = svgDatas.backData

  let [svgw,svgh]=svg.match(/viewBox\s*=\s*"([^"]+)"/)[1].trim().split(/\s+/).map(a=>parseFloat(a)).slice(2);

  svg = replacestr(svg, /MMMMMM/, publicKey.substr(publicKey.length - 6))
  svg = replacestr(svg, /MMMMMM/, publicKey.substr(0, 6))
  svg = replacestr(svg, /T01-20170000000001/g, nodeID)
  svg = replacestr(svg, /2017 — Tel Aviv, Israel/g, printerID)
  svg = replacestr(svg, /Single Private\/Public Key/g, noteType)
  svg = replacestr(svg, /Copy 01\/03/g, noteTypeSubtext)
  svg = replacestr(svg, /<rect.+?id="qr_placeholder".+?<\/rect>/, imageDataToPath({
    x: 0,
    y: 115,
    data: imageData_QR_privateKey_part1,
    margin: 0,
    offset: 0,
    cellsize: 12,
    sizetype: '-2 centered',
    fill: '#000'
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
  let backa=svgDatas.backArtwork;
  let backb=svg;
  svg = prefix(svg, /<\/defs>/, artworkBackDefs)
  svg = postfix(svg, /<\/defs>/, artworkBackContent)

  let back=svg;
//

  
	
  let back_cropmarks=  hline(svgw/2,-40,2300)
                 +     hline(svgw/2,svgh+40,2300)
				 +     vline(-40,svgh/2,svgh+400)
				 +     vline(svgw+40,svgh/2,svgh+400)
                 +  cropmarkv(   0,-40)
                 + cropmarkv(svgw,-40)
				 + cropmarkv(   0,svgh+40)
				 + cropmarkv(svgw,svgh+40)
				 + cropmarkh(    -80,0)
                 + cropmarkh(svgw+80,0)
				 + cropmarkh(    -80,svgh)
				 + cropmarkh(svgw+80,svgh);
  
  backa = prefix( backa, /<\/svg>/,back_cropmarks);
  backb = prefix( backb, /<\/svg>/,back_cropmarks);
  back  = prefix( back, /<\/svg>/ ,back_cropmarks);

  var artworkFrontDefs = svgDatas.frontArtwork.match(/<defs>([\s\S]+?)<\/defs>/)[1]
  var artworkFrontContent = svgDatas.frontArtwork.match(/<\/defs>([\s\S]+?)<\/svg>/)[1]

  svg = svgDatas.frontData;
  
    [svgw,svgh]=svg.match(/viewBox\s*=\s*"([^"]+)"/)[1].trim().split(/\s+/).map(a=>parseFloat(a)).slice(2);

  svg = postfix(svg, /<g id="Print-Layouts" /, ' transform="scale(-1, 1) translate(-'+svgw+', 0)" ')

  svg = replacestr(svg, /MMMMMM/, publicKey.substr(publicKey.length - 6))
  svg = replacestr(svg, /MMMMMM/, publicKey.substr(0, 6))
  svg = replacestr(svg, /1JuNUKWC7FkyWEsnGRgR5pUtDTC6uQS2iR/g, publicKey)
  
  svg = replacestr(svg, /<text id="Public-Barcode"[\s\S]+?<\/text>/g,   barcode128(40,0,720,publicKey)  )
   
  
  svg = replacestr(svg, /<rect.+?id="qr_placeholder".+?<\/rect>/, imageDataToPath({
    x: 0,
    y: 115,
    data: imageData_QR_privateKey_part2,
    margin: 0,
    offset: 0,
    cellsize: 12,
    sizetype: '-2 centered',
    fill: '#000'
  }))
  svg = replacestr(svg, /<rect.+?id="qr_placeholder".+?<\/rect>/, imageDataToPath({
    x: 0,
    y: 0,
    data: imageData_QR_pubKey,
    margin: 0,
    offset: 0,
    cellsize: 12,
    sizetype: '1',
    fill: '#000'
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
          : '#000') + a3
        })
      })
    })

  
  let fronta=svgDatas.frontArtwork;
  let frontb=svg;
  svg = prefix(svg, /<\/defs>/, artworkFrontDefs)
  svg = postfix(svg, /<\/defs>/, artworkFrontContent)
  let front=svg;
  
  frontb = postfix(frontb, /<\/defs>/, '<g transform="scale(-1, 1) translate(-'+svgw+', 0)">')
  frontb = prefix(frontb, /<\/svg>/, '</g>')
  
	
  let front_cropmarks= hline(svgw/2,-40,2300)
                 +     hline(svgw/2,svgh+40,2300)
				 +     vline(-40,svgh/2,svgh+400)
				 +     vline(svgw+40,svgh/2,svgh+400)
                 + cropmarkv(   0,-40)
                 + cropmarkv(svgw,-40)
				 + cropmarkv(   0,svgh+40)
				 + cropmarkv(svgw,svgh+40)
				 + cropmarkh(    -80,0)
                 + cropmarkh(svgw+80,0)
				 + cropmarkh(    -80,svgh)
				 + cropmarkh(svgw+80,svgh)
				 
  
  fronta = prefix( fronta, /<\/svg>/,front_cropmarks);
  frontb = prefix( frontb, /<\/svg>/,front_cropmarks);
  front  = prefix( front, /<\/svg>/ ,front_cropmarks);
  
  return {back, front,backa, fronta,backb, frontb}
}



export function generate_set_cheerio(svgDatas, publicKey = 'UNSET', privateKey = 'UNSET') {
 
  let privateKeySplit = getEvenFrequencyPad(privateKey, 144, 1);
  let { imageData_QR_privateKey_part1:frontPrivkeyQRData, imageData_QR_privateKey_part2:backPrivkeyQRData} = generatePrivateKey_vlines_SplitImageData (privateKey);
  let backPubkeyQRData=generatePublicKey_ImageData(publicKey);
 
 
  let svg

  //  svgTemplateBackData="",
  //  svgTemplateBackArtwork="",
  //  svgTemplateFrontArtwork="",
  //  svgTemplateFrontData=""


  svg = svgDatas.backData

  let [svgw/*,svgh*/]=svg.match(/viewBox\s*=\s*"([^"]+)"/)[1].trim().split(/\s+/).map(a=>parseFloat(a)).slice(2);

  const frontPrivKeySVG = imageDataToPath({
    x: 0,
    y: 115,
    data: frontPrivkeyQRData,
    margin: 0,
    offset: 0,
    cellsize: 12,
    sizetype: '-2 centered',
    fill: '#000'
  })

  console.log('imageDataSVG', frontPrivKeySVG)

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
  // svg = prefix(svg, /<\/defs>/, artworkBackDefs)
  // svg = postfix(svg, /<\/defs>/, artworkBackContent)
  const backa=svgDatas.backData;
  const backb=svg;
  // span.innerHTML = svg
  // span.getElementsByTagName('svg')[0].setAttribute('height', sHeight)
  // span.getElementsByTagName('svg')[0].setAttribute('width', sWidth)

  // document.getElementById('page_back_data').prepend(span)

  const back=svg;

  var artworkFrontDefs = svgDatas.frontArtwork.match(/<defs>([\s\S]+?)<\/defs>/)[1]
  var artworkFrontContent = svgDatas.frontArtwork.match(/<\/defs>([\s\S]+?)<\/svg>/)[1]

  svg = svgDatas.frontData

  svg = postfix(svg, /<g id="Print-Layouts" /, ' transform="scale(-1, 1) translate(-'+svgw+', 0)" ')

  svg = replacestr(svg, /MMMMMM/, publicKey.substr(publicKey.length - 6))
  svg = replacestr(svg, /MMMMMM/, publicKey.substr(0, 6))
  svg = replacestr(svg, /1JuNUKWC7FkyWEsnGRgR5pUtDTC6uQS2iR/g, publicKey)

  const backPrivkeyQRSVG = imageDataToPath({
    x: 0,
    y: 115,
    data: backPrivkeyQRData,
    margin: 0,
    offset: 0,
    cellsize: 12,
    sizetype: '-2 centered',
    fill: '#000'
  })
  const backPubkey = imageDataToPath({
    x: 0,
    y: 0,
    data: backPubkeyQRData,
    margin: 0,
    offset: 0,
    cellsize: 12,
    sizetype: '1',
    fill: '#000'
  })

  const $svg = cheerio.load(svg, {xmlMode: true})
  console.log('$svg:', $svg)

  $svg('rect#qr_placeholder').replaceWith(backPubkey)
  $svg('rect#privkey_qr_placeholder').replaceWith(backPrivkeyQRSVG)
  svg = $svg.html()

  
  
  // if you look at the svg generated code you see like:
  // <g id="Privkey-Texts-Copy">
  //  <g transform="translate(155,0)">
  //    <g fill="#000" transform="translate(0,10)"><rect...><\/rect>
  //  </g>
  // </g>
  //
  // so i take the x and y taken from translate of outer group, and x and y taken from translate of inner group, add them together to get full x y
  // also i note the letter and the order(the order is for debug only)
  
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
			
			// here the group can be saved
			
          })
          letterI++
        // return a;//''a1+(privateKeySplit.marking[letterI++]==' '?'transparent':a2)+a3
        })
      // return a
      })

	  
      // the letter of objects are 
	  // instead of figuring out the order and take the letter at the correct order
	  // after sorting the in decending, the order should be exect match fro the correct placing
	  
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
          : '#000') + a3
        })
      })
    })
	
  const fronta=svgDatas.frontArtwork;
  const frontb=svg;

  svg = prefix(svg, /<\/defs>/, artworkFrontDefs)
  svg = postfix(svg, /<\/defs>/, artworkFrontContent)

  const front=svg;
  return {back, front,backa,backb,fronta,frontb}
}


async function load_templates(svgTemplate_urls) {
	let svgDatas={};
  svgDatas.ready=false;

  let fontsForSvg="";
  let fontMatch=false;
  let fontReplace=[];
  if(svgTemplate_urls.font)
  {
	  let fontUrl=svgTemplate_urls.font; delete svgTemplate_urls.font;
	  fontMatch=new RegExp(svgTemplate_urls.fontMatch); delete svgTemplate_urls.fontMatch;
	  fontReplace=svgTemplate_urls.fontReplace; delete svgTemplate_urls.fontReplace;
	  fontsForSvg =  await fetch(fontUrl).then( res => res.text() ); 
  }
  const getSVG_promises= Object.keys(svgTemplate_urls).map(  key => fetch(svgTemplate_urls[key]).then(res => res.text()).then( text => ({key, text: text}) ) );
  const getSVG_results = await Promise.all(getSVG_promises);

  getSVG_results.forEach( (e)=> {
	console.log(e);
    let svg=e.text;
    if(fontMatch&&svg.match(fontMatch)!==null)
    {			
	fontReplace.forEach( ([search,replace])=> { svg = replacestr(svg, search,replace);} )
      svg = prefix(svg, /<\/defs>/, fontsForSvg);											 
}
    svgDatas[e.key]=svg;

  });
  svgDatas.ready=true;
  return svgDatas;
}



async function load_templates_nodejs(svgTemplate_urls) {
  let svgDatas={};
  svgDatas.ready=false;

  let fontsForSvg="";
  let fontMatch=false;
  let fontReplace=[];
  let fs=require('fs');
  let fetch=function(file){
	  file=file.replace(/%20/g,' ')
	  return new Promise((resolve,reject)=>{
		  console.log(__dirname+'/../../../../../public/'+file)
		fs.readFile(__dirname+'/../../../../../public/'+file,(err,data)=>{ if(err)reject(err); else resolve({text:async ()=>data.toString()}); })  
	  });
  };
  
  if(svgTemplate_urls.font)
  {
	  let fontUrl=svgTemplate_urls.font; delete svgTemplate_urls.font;
	  fontMatch=new RegExp(svgTemplate_urls.fontMatch); delete svgTemplate_urls.fontMatch;
	  fontReplace=svgTemplate_urls.fontReplace; delete svgTemplate_urls.fontReplace;
	  fontsForSvg =  await fetch(fontUrl).then( res => res.text() ); 
  }
  const getSVG_promises= Object.keys(svgTemplate_urls).map(  key => fetch(svgTemplate_urls[key]).then(res => res.text()).then( text => ({key, text: text}) ) );
  const getSVG_results = await Promise.all(getSVG_promises);

  getSVG_results.forEach( (e)=> {
	console.log(e);
    let svg=e.text;
    if(fontMatch&&svg.match(fontMatch)!==null)
    {			
	fontReplace.forEach( ([search,replace])=> { svg = replacestr(svg, search,replace);} )
      svg = prefix(svg, /<\/defs>/, fontsForSvg);											 
}
    svgDatas[e.key]=svg;

  });
  svgDatas.ready=true;
  return svgDatas;
}


export async function loadWeb()
{
		
	const svgTemplates = {
	  backData:    '/notes/v0.1/Layer%202%20-%20Phase%203%20-%20Front%20Data%20Placeholders.svg',
	  frontArtwork:  '/notes/v0.1/Layer%202%20-%20Phase%202%20-%20Front%20Artwork.svg',
	  
	  frontData:     '/notes/v0.1/Layer%201%20-%20On%20Transparent%20Placeholders.svg',
	  backArtwork: '/notes/v0.1/Layer%202%20-%20Phase%201%20-%20Back%20Artwork.svg',

	  fontMatch:"Andale Mono|Sarpanch|Play|Sarpanch",
	  fontReplace:[ /*["LibreBarcode39Extended-Regular, Libre Barcode 39 Extended", "Barcode"]*/ ],
	  font:'/notes/v0.2/fonts.svg-part.txt'
	}
 
	return await load_templates(svgTemplates);

}

export async function loadNodejs()
{
		
	const svgTemplates = {
	  backData:    '/notes/v0.1/Layer%202%20-%20Phase%203%20-%20Front%20Data%20Placeholders.svg',
	  frontArtwork:  '/notes/v0.1/Layer%202%20-%20Phase%202%20-%20Front%20Artwork.svg',
	  
	  frontData:     '/notes/v0.1/Layer%201%20-%20On%20Transparent%20Placeholders.svg',
	  backArtwork: '/notes/v0.1/Layer%202%20-%20Phase%201%20-%20Back%20Artwork.svg',

	  fontMatch:"Andale Mono|Sarpanch|Play|Sarpanch",
	  fontReplace:[ /*["LibreBarcode39Extended-Regular, Libre Barcode 39 Extended", "Barcode"]*/ ],
	  font:'/notes/v0.2/fonts.svg-part.txt'
	}
 
	return await load_templates_nodejs(svgTemplates);

}


export function generatePages(svgDatas) {
	
  //let sHeight = 500
  //let sWidth = 800


  const pages=[];
  const notes=[];
  
  for(let i=0,notes_to_create=3;i<notes_to_create;i++)
  {
	  let {publicKey, privateKey}=getBitcoinKeypair();
	  let note=generate_set(svgDatas, publicKey, privateKey);
	  //let note=generate_set_cheerio(svgDatas, publicKey, privateKey);
	  notes.push(note);
  }

  // selecting max height:
  
  // 21   * 100 dpi=2100
  // 29.7 * 100 dpi=2970 // lets try this
  
  // 21   * 150 dpi=3150
  // 29.7 * 150 dpi=4455


  // example page height of images them selves
  // 1  page_height_used  840 1600
  // 2  page_height_used 1680 1600
  // 3  page_height_used 2520 1600
  
  // 4  page_height_used 3360 1600
  // 5  page_height_used 4200 1600
  // 6  page_height_used 5040 1600
  // 7  page_height_used 5880 1600
  // 8  page_height_used 6720 1600
  // 9  page_height_used 7560 1600
  // 10 page_height_used 8400 1600

  let page_width=2100; // max width = 2100
  let page_width_used=0; // max width = 2100
  let page_height=2970;
  let page_height_used=0;
  let marginv=120;
  let marginh=150;
  
  let front_defs,back_defs,fronta_defs,backa_defs,frontb_defs,backb_defs;
  let front_content,back_content,fronta_content,backa_content,frontb_content,backb_content;
  
  for(let i=0;i<notes.length;i++)
  {
	  //let note=generate_set(svgDatas, publicKey, privateKey);
	  let note=notes[i];
	  let [fw,fh]=note.front.match(/viewBox\s*=\s*"([^"]+)"/)[1].trim().split(/\s+/).map(a=>parseFloat(a)).slice(2);
	  
	  if(page_width_used<fw)page_width_used=fw;
	  page_height_used+=fh+marginv;
	  let done=false;
	  if(page_height_used>page_height||i===0)
	  {
		done=true; if(i===0) done=false;
		page_height_used=fh+marginv;//(i===0?0:marginv)
		front_defs=[];
		back_defs=[];
		front_content=[];
		back_content=[];
		
		fronta_defs=[];
		backa_defs=[];
		fronta_content=[];
		backa_content=[];
		
		frontb_defs=[];
		backb_defs=[];
		frontb_content=[];
		backb_content=[];
	  }
	  if(i===notes.length-1) done=true;
	  
      let bdefs = note.front.match(/<defs>([\s\S]+?)<\/defs>/)[1]
      let bcontent = note.front.match(/<\/defs>([\s\S]+?)<\/svg>/)[1]
	  
	  if(!front_defs.includes(bdefs))front_defs.push(bdefs);
	  front_content.push('<g transform="translate('+marginh+', '+(page_height_used-fh)+')" >'+bcontent+'</g>');
	  
	  
	  let fdefs = note.back.match(/<defs>([\s\S]+?)<\/defs>/)[1]
      let fcontent = note.back.match(/<\/defs>([\s\S]+?)<\/svg>/)[1]
	  	  
	  if(!back_defs.includes(fdefs))back_defs.push(fdefs);
	  back_content.push('<g transform="translate('+(page_width-page_width_used-marginh)+', '+(page_height_used-fh)+')" >'+fcontent+'</g>');
	  
	  
	  
	  
	  	  
      let badefs = note.fronta.match(/<defs>([\s\S]+?)<\/defs>/)[1]
      let bacontent = note.fronta.match(/<\/defs>([\s\S]+?)<\/svg>/)[1]
	  
	  if(!fronta_defs.includes(badefs))fronta_defs.push(badefs);
	  fronta_content.push('<g transform="translate('+marginh+', '+(page_height_used-fh)+')" >'+bacontent+'</g>');
	  
	  
	  let fadefs = note.backa.match(/<defs>([\s\S]+?)<\/defs>/)[1]
      let facontent = note.backa.match(/<\/defs>([\s\S]+?)<\/svg>/)[1]
	  	  
	  if(!backa_defs.includes(fadefs))backa_defs.push(fadefs);
	  backa_content.push('<g transform="translate('+(page_width-page_width_used-marginh)+', '+(page_height_used-fh)+')" >'+facontent+'</g>');
	  
	  
	  
	  
	  
	  
	  	  
      let bbdefs = note.frontb.match(/<defs>([\s\S]+?)<\/defs>/)[1]
      let bbcontent = note.frontb.match(/<\/defs>([\s\S]+?)<\/svg>/)[1]
	  
	  if(!frontb_defs.includes(bbdefs))frontb_defs.push(bbdefs);
	  frontb_content.push('<g transform="translate('+marginh+', '+(page_height_used-fh)+')" >'+bbcontent+'</g>');
	  
	  
	  let fbdefs = note.backb.match(/<defs>([\s\S]+?)<\/defs>/)[1]
      let fbcontent = note.backb.match(/<\/defs>([\s\S]+?)<\/svg>/)[1]
	  	  
	  if(!backb_defs.includes(fbdefs))backb_defs.push(fbdefs);
	  backb_content.push('<g transform="translate('+(page_width-page_width_used-marginh)+', '+(page_height_used-fh)+')" >'+fbcontent+'</g>');
	  
	  
	  
	  if(done){
		let front=createEmptySVGstr( (page_height/10)+'mm', (page_width/10)+'mm', page_height, page_width );
		let back=createEmptySVGstr( (page_height/10)+'mm' , (page_width/10)+'mm', page_height, page_width );
		
		let fronta=createEmptySVGstr( (page_height/10)+'mm', (page_width/10)+'mm', page_height, page_width );
		let backa=createEmptySVGstr( (page_height/10)+'mm' , (page_width/10)+'mm', page_height, page_width );
		
		let frontb=createEmptySVGstr( (page_height/10)+'mm', (page_width/10)+'mm', page_height, page_width );
		let backb=createEmptySVGstr( (page_height/10)+'mm' , (page_width/10)+'mm', page_height, page_width );
		
		front = prefix(front, /<\/defs>/, front_defs.join('\r\n\r\n\r\n'))
		front = postfix(front, /<\/defs>/, front_content.join('\r\n\r\n\r\n')+text({x:page_width-50,y:marginv+50,fontSize:70,text:"front",align:'end'}) )
		
		back = prefix(back, /<\/defs>/, back_defs.join('\r\n\r\n\r\n'))
		back = postfix(back, /<\/defs>/, back_content.join('\r\n\r\n\r\n')+text({x:50,y:marginv+50,fontSize:70,text:"back"}))
		
		
		
		fronta = prefix(fronta, /<\/defs>/, fronta_defs.join('\r\n\r\n\r\n'))
		fronta = postfix(fronta, /<\/defs>/, fronta_content.join('\r\n\r\n\r\n')+text({x:page_width-50,y:marginv+50,fontSize:70,text:"fronta",align:'end'}))

		backa = prefix(backa, /<\/defs>/, backa_defs.join('\r\n\r\n\r\n'))
		backa = postfix(backa, /<\/defs>/, backa_content.join('\r\n\r\n\r\n')+text({x:50,y:marginv+50,fontSize:70,text:"backa"}))
		
		
		
		frontb = prefix(frontb, /<\/defs>/, frontb_defs.join('\r\n\r\n\r\n'))
		frontb = postfix(frontb, /<\/defs>/, frontb_content.join('\r\n\r\n\r\n')+text({x:page_width-50,y:marginv+50,fontSize:70,text:"frontb",align:'end'}))

		backb = prefix(backb, /<\/defs>/, backb_defs.join('\r\n\r\n\r\n'))
		backb = postfix(backb, /<\/defs>/, backb_content.join('\r\n\r\n\r\n')+text({x:50,y:marginv+50,fontSize:70,text:"backb"}))
		
  
		
        pages.push({front,back ,fronta,backa  ,frontb,backb })
	  }
	  console.log("page_height_used",page_height_used,page_width_used,front_defs.length,front_content.length)
  }
  return pages;
}

