import {loadNodejs,generatePages} from 'cryptoprint/sections/print-view/raws'
import util from 'util'
import fs from 'fs'
//import {Rsvg} from 'librsvg';
import RenderPDF from 'chrome-headless-render-pdf';
const writeFilePromise = util.promisify(fs.writeFile);

//function svg_to_ps(svgtext){
//	return new Promise((resolve,reject)=>{
//		// Create SVG render instance.
//		var svg = new Rsvg();
//		
//		// When finishing reading SVG, render and save as PNG image.
//		svg.on('finish', function() {
//		  //console.log('SVG width: ' + svg.width);
//		  //console.log('SVG height: ' + svg.height);
//		  resolve( svg.render({
//			format: 'ps',
//			width: svg.width,
//			height: svg.height
//		  }).data )
//		  
//		});
//		
//		svg.end(svgtext);
//
//	});
//}
//function svg_to_pdf(svgtext){
//	return new Promise((resolve,reject)=>{
//		// Create SVG render instance.
//		var svg = new Rsvg();
//		
//		// When finishing reading SVG, render and save as PNG image.
//		svg.on('finish', function() {
//		  //console.log('SVG width: ' + svg.width);
//		  //console.log('SVG height: ' + svg.height);
//		  resolve( svg.render({
//			format: 'pdf',
//			width: svg.width,
//			height: svg.height
//		  }).data )
//		  
//		});
//		
//		svg.end(svgtext);
//
//	});
//}

//function svg_to_dataUri(body) {
//	const type = 'image/svg+xml';
//	const prefix = "data:" + type + ";base64,";
//	const base64 = new Buffer(body, 'binary').toString('base64');
//	return prefix + base64;
//}
//
//async function chrome_to_pdfs(pairs,options) {
//	try{
//	    const renderer = new RenderPDF(options);
//        await renderer.spawnChrome();
//        await renderer.waitForDebugPort();
//        for (const job of pairs) {
//                //job.buff = (await renderer.renderPdf(svg_to_dataUri(filetext), renderer.generatePdfOptions())).buff;
//                job.buff = (await renderer.renderPdf(job.url, renderer.generatePdfOptions())).buff;
//        }		
//	}
//	catch(e) 
//	{
//		throw e;
//	}
//	finally
//	{
//		
//        renderer.killChrome();
//	}
//	return pairs;
//}


		
(async ()=>{


	let svgDatas = await loadNodejs();

	//console.log('svgs?', svgDatas)

	let pages=await generatePages(svgDatas);
	let  renderer=null;
		console.log('done generating')
	try{
		

		let toconvert=[];
		
		await Promise.all(pages.map( (page,i) =>
		{

			return Promise.all([ 
								 writeFilePromise(__dirname+'/out/'+i+'front.svg', page.front )    .then( ()=>  toconvert.push({ url:'file://'+__dirname+'/out/'+i+'front.svg'  ,pdf: __dirname+'/out/'+i+'front.pdf'  }  ))
							   , writeFilePromise(__dirname+'/out/'+i+'fronta.svg', page.fronta )  .then( ()=>  toconvert.push({ url:'file://'+__dirname+'/out/'+i+'fronta.svg' ,pdf: __dirname+'/out/'+i+'fronta.pdf' }  ))
							   , writeFilePromise(__dirname+'/out/'+i+'frontb.svg', page.frontb )  .then( ()=>  toconvert.push({ url:'file://'+__dirname+'/out/'+i+'frontb.svg' ,pdf: __dirname+'/out/'+i+'frontb.pdf' }  ))
							   , writeFilePromise(__dirname+'/out/'+i+'back.svg', page.back )      .then( ()=>  toconvert.push({ url:'file://'+__dirname+'/out/'+i+'back.svg'   ,pdf: __dirname+'/out/'+i+'back.pdf'   }  ))
							   , writeFilePromise(__dirname+'/out/'+i+'backa.svg', page.backa )    .then( ()=>  toconvert.push({ url:'file://'+__dirname+'/out/'+i+'backa.svg'  ,pdf: __dirname+'/out/'+i+'backa.pdf'  }  ))
							   , writeFilePromise(__dirname+'/out/'+i+'backb.svg', page.backb )    .then( ()=>  toconvert.push({ url:'file://'+__dirname+'/out/'+i+'backb.svg'  ,pdf: __dirname+'/out/'+i+'backb.pdf'  }  ))
							  ])
		}));
	 
		console.log('done saving')
		
		
	      renderer = new RenderPDF({
			   'paperHeight':(297000/25400).toFixed(2)
			  ,'paperWidth':(210000/25400).toFixed(2)
			  ,noMargins:true
			  ,printLogs:true
			  ,chromeBinary:'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
		  });
		  
		console.log('chrome spawning')
        await renderer.spawnChrome();
		
		console.log('chrome waitForDebugPort')
        await renderer.waitForDebugPort();
		
	    for (const job of toconvert) {
			console.log('converting '+job.url);

            //job.buff = (await renderer.renderPdf(svg_to_dataUri(filetext), renderer.generatePdfOptions())).buff;

            const buff = await renderer.renderPdf(job.url, renderer.generatePdfOptions());
            fs.writeFileSync(job.pdf, buff);
            renderer.log(`Saved ${job.pdf}`);
        }	
		
	}
	catch(e)
	{
		console.log(e.stack)
	}
	finally
	{
		if(renderer)
			renderer.killChrome();
	}
 
})()

 


 