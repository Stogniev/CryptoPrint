export function chunk (arr, len) {
  const chunks = []
  const n = arr.length
  let i = 0

  while (i < n) {
    chunks.push(arr.slice(i, i += len))
  }

  return chunks
}


export  function http_get_promise(url) {
     return new Promise(function(ok,bad){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          try{
          if (this.readyState == 4)
          {
            if(this.status == 200)
            {
              var fn=ok;ok=false;bad=false;
              if(fn)fn(this.responseText);
            }
            else
            {
              var fn=bad;ok=false;bad=false;
              if(fn)fn(new Error(this.responseText.substring(0,100)));
            }
          }

          }
          catch(e)
          {
           var fn=bad;ok=false;bad=false;
           if(fn)fn(e);
          }
        };
        xhttp.onerror=function(e){
          var fn=bad;ok=false;bad=false;
          if(fn)fn(e);
        };
        xhttp.open("GET", url , true);
        xhttp.send();
     });
  }

export function save_svg(svgelement,name){
    var text=svgelement.innerHTML;
    var textToSaveAsBlob = new Blob([text], {type:"image/svg+xml"});
    var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);

    var downloadLink = document.createElement("a");
    downloadLink.download =  name+'.svg';
    downloadLink.innerHTML = "Download File";
    downloadLink.target   = '_blank';
    downloadLink.href = textToSaveAsURL;
    downloadLink.onclick = function(event){document.body.removeChild(event.target);};
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);

    downloadLink.click();
}

export function createSvgTag(qrSvg,parts,height,width,cellSize, margin,iheight,iwidth) {

  cellSize = cellSize || 2;
  margin = (typeof margin == 'undefined')? cellSize * 4 : margin;
  var sizeheight = height * cellSize + margin * 2;
  var sizewidth = width * cellSize + margin * 2;
  var c, mc, r, mr, rect,cellSize_rect;

  if(!qrSvg){
  qrSvg=''
  qrSvg += '<svg style="border:1px solid blue" version="1.1" xmlns="http://www.w3.org/2000/svg"';
  qrSvg += ' width="' + iwidth + '"';
  qrSvg += ' height="' + iheight + '"';
  qrSvg += ' viewBox="0 0 ' + sizewidth + ' ' + sizeheight + '" ';
  qrSvg += ' preserveAspectRatio="xMinYMin meet">';
  qrSvg += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>';
  qrSvg += '</svg>';
  }

  for(var i=0;i<parts.length; i++)
    {
       var tqrSvg=''
       var part =parts[i]
       if(part.do=='xml')
       {
         tqrSvg+=part.xml
       }
       if(part.do=='str')
       {
         tqrSvg=part.str
       }
       if(part.do=='text')
       {
         var drawx=part.x||0;
         var drawy=part.y||0;
         var fontSize=part.fontSize||14;
         var lineHeight=part.lineHeight||1.25;
         var style=part.style||"";
         var fontFamily=part.fontFamily||"Arial";
         var transform=part.transform||"";
         var text=part.text.split('\n').map(function(a,i){ return '<tspan x="'+drawx+'" y="'+(drawy+fontSize*lineHeight+i*fontSize*lineHeight)+'">'+a+'</tspan>' }).join('\n');

         tqrSvg+='<text x="'+drawx+'" transform='+transform+' y="'+drawy+'" style="'+style+'" font-family="'+fontFamily+'" font-size="'+fontSize+'">'+text+'</text>'
       }
       if(part.do=='pixels')
       {
         tqrSvg += '<path d="';

         var imageData=part.data;
         cellSize=part.cellsize;
         var drawx=part.x;
         var drawy=part.y;
         var fill=part.fill||"black";
         var offset=0;
         if(part.sizetype=='+1')
         {
              offset=-1;
              cellSize_rect=cellSize+2;
              rect = 'l' + cellSize_rect + ',0 0,'  + cellSize_rect +
                    ' -' + cellSize_rect + ',0 0,-' + cellSize_rect + 'z ';
         }
         else if(part.sizetype=='-2 centered')
         {
              drawx-=1;
              rect = 'l' + (cellSize) + ',0 0,'  + (cellSize) +
                    ' -' + (cellSize-2) + ',0 0,-' + (cellSize) + 'z ';
         }
         else
         {
              rect = 'l' + cellSize + ',0 0,'  + cellSize +
                    ' -' + cellSize + ',0 0,-' + cellSize + 'z ';
         }

         for (r = 0; r < imageData.height; r += 1) {
            mr = r * cellSize + margin+offset+drawy;
            for (c = 0; c < imageData.width; c += 1) {
              if ( getPixel(imageData, c, r)[3]>127 ) {
                mc = c*cellSize+margin+offset+drawx;
                tqrSvg += 'M' + mc + ',' + mr + rect;
              }
            }
        }
        tqrSvg += '" stroke="transparent" fill="'+fill+'"/>';
    }
      //if append
      if(part.action=='append')      qrSvg=qrSvg.replace('</svg>',tqrSvg+'</svg>');
      if(part.action=='postfix')     qrSvg=qrSvg.replace(part.search,function(a){ return a+tqrSvg } );
      if(part.action=='prefix')      qrSvg=qrSvg.replace(part.search,function(a){ return tqrSvg+a } );
      if(part.action=='replacestr')  qrSvg=qrSvg.replace(part.search,tqrSvg);
  }


  return qrSvg;
}
