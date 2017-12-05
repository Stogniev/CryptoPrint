import {loadNodejs,generatePages} from 'cryptoprint/sections/print-view/raws'

/*
(async ()=>{


let svgDatas = await loadNodejs();

console.log('svgs?', svgDatas)

generatePages(svgDatas);

	
})()

*/


var Rsvg = require('librsvg').Rsvg;
var fs = require('fs');

// Create SVG render instance.
var svg = new Rsvg();

// When finishing reading SVG, render and save as PNG image.
svg.on('finish', function() {
  console.log('SVG width: ' + svg.width);
  console.log('SVG height: ' + svg.height);
  fs.writeFile('tiger.png', svg.render({
    format: 'png',
    width: svg.width,
    height: svg.height
  }).data);
});

// Stream SVG file into render instance.
fs.createReadStream('tiger.svg').pipe(svg);
