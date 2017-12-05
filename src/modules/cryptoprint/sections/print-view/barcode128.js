import JsBarcode from 'jsbarcode/bin/JsBarcode.js' // eslint-disable-line
var xmldom  = require('xmldom');
var DOMImplementation = xmldom.DOMImplementation;
var XMLSerializer = xmldom.XMLSerializer;
var xmlSerializer = new XMLSerializer();
var document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);





export function code128svg(text)
{
    var svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    JsBarcode(svgNode, text, { xmlDocument: document,
	  format: "code128",
  displayValue: false,
  height: 20,
  width: 2
	}); 
    //let CODE128B = JsBarcode.getModule("CODE128B");
    let xml = xmlSerializer.serializeToString(svgNode);
   return xml;
}
 