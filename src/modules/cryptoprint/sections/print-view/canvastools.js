
export function createImageData(height, width) {
     width=width||136;
	 height=height||70;
	 return {data:new Uint8ClampedArray(height*width*4),height,width}
}


export function createcanvas() {
     //width="136" height="70" style="border:1px solid blue"
     var c = document.createElement('canvas');
     c.setAttribute('id', 'c');
     c.setAttribute('width', '136');
     c.setAttribute('height', '70');
     //c.setAttribute('style','border:1px solid blue');
     return c;
   }

export function getsize(imageData){

  var w=0,a,iw=imageData.width,h=0,data=imageData.data,x,y;
  for (y = 0; y < imageData.height; y++)
  {
    for (x = 0; x < imageData.width; x++)
    {
        var pixelPosition = (x * 4) + (y * iw * 4);
        a = data[pixelPosition+3]; //alpha
        if (a > 0) {
           if(x>w)w=x;
           if(y>h)h=y;
        }
    }
  }
  return {w:w+1,h:h+1};
}



export function setPixelSplit( random_pad, imageData1,imageData2, x, y, r, g, b, a) {
  var index = (x + y * imageData1.width) * 4;
  var index1 = (x + y * imageData1.width) ;

  if(random_pad[index1]){
    imageData1.data[index+0] = r;
    imageData1.data[index+1] = g;
    imageData1.data[index+2] = b;
    imageData1.data[index+3] = a;
  }
  else
  {
    imageData2.data[index+0] = r;
    imageData2.data[index+1] = g;
    imageData2.data[index+2] = b;
    imageData2.data[index+3] = a;
  }
}





export function setPixelAndSetPixelSplit(random_pad, imageData,  imageData1, imageData2, x, y, r, g, b, a) {
    var index = (x + y * imageData.width) * 4;
    imageData.data[index+0] = r;
    imageData.data[index+1] = g;
    imageData.data[index+2] = b;
    imageData.data[index+3] = a;
    setPixelSplit( random_pad, imageData1, imageData2, x, y, r, g, b, a)
}




export function getPixel(imageData, x, y) {
    var index = (x + y * imageData.width) * 4;
    return [
    imageData.data[index+0],
    imageData.data[index+1],
    imageData.data[index+2],
    imageData.data[index+3]];
}
export function setPixel(imageData, x, y, r, g, b, a) {
    var index = (x + y * imageData.width) * 4;
    imageData.data[index+0] = r;
    imageData.data[index+1] = g;
    imageData.data[index+2] = b;
    imageData.data[index+3] = a;
}




export function drawQRSplit(random_pad,imageData,imageData1, imageData2,x,y,qr,dotzize) {
  var rr=0,gg=0,bb=0
  var m=qr.getModuleCount();
  var xx;
  /*
  var dotzizem=dotzize-1;
  var  lefttop_pixel,
       leftbottomp_pixel,
       righttopp_pixel,
       rightbottomp_pixel,
       has_left,has_right,has_above,has_below,
       has_above_left,has_below_left,has_above_right,has_below_right;
  */

  for (var r = 0; r < m; r += 1) {
    xx=x;
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
         //{
           if(qr.isDark(r, c))setPixelAndSetPixelSplit(random_pad,imageData, imageData1, imageData2, xx+k  , y+j, rr, gg, bb, 255);
         //}
        }
      }
      xx+=dotzize;
    }
    y+=dotzize;
  }
  return y;
};



export function drawqr(imageData,x,y,qr,dotzize) {
  var rr=0,gg=0,bb=0
  var m=qr.getModuleCount();
  var xx;
  /*
  var dotzizem=dotzize-1;
  var lefttop_pixel,
      leftbottomp_pixel,
      righttopp_pixel,
      rightbottomp_pixel,
      has_left,has_right,has_above,has_below,
      has_above_left,has_below_left,has_above_right,has_below_right;
*/
  for (var r = 0; r < m; r += 1) {
    xx=x;
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
         //{
           if(qr.isDark(r, c))setPixel(imageData, xx+k  , y+j, rr, gg, bb, 255);
         //}
        }
      }
      xx+=dotzize;
    }
    y+=dotzize;
  }
  return y;
};




export function bitarr_to_ctx(a,ctx)
{
    var data = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height),
        buffer = data.data,
        len = buffer.length,
        i = 0 ,
         b,x=0;
     for(; i < len; i += 4,x++) {
        b=a[x]!==0;
        buffer[i] =  buffer[i+1] =  buffer[i+2] = b ? 0 : 255;
        buffer[i+3] = b?255:0;
    }
   ctx.putImageData(data, 0, 0);
}


export function bitarr_to_imagedata(a,data)
{
        var buffer = data.data,
        len = buffer.length,
        i = 0 ,
         b,x=0;
     for(; i < len; i += 4,x++) {
        b=a[x]!==0;
        buffer[i] =  buffer[i+1] =  buffer[i+2] = b ? 0 : 255;
        buffer[i+3] = b?255:0;
    }
}


export function imageDataToBitArray(data )
{
        var buffer = data.data,
        len = buffer.length,
        threshold = 127,
        i = 0,
        lum;
    var a= new Array(buffer.length/4)
    var x=0;
    for(; i < len; i += 4,x++) {
        lum = buffer[i] * 0.3 + buffer[i+1] * 0.59 + buffer[i+2] * 0.11;
        a[x]=lum < threshold && buffer[i+3]>127?1:0;
    }
    return a;
}


export function ctx_to_bitarr(ctx)
{
    var data = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height),
        buffer = data.data,
        len = buffer.length,
        threshold = 127,
        i = 0,
        lum;
    var a= new Array(buffer.length/4)
    var x=0;
    for(; i < len; i += 4,x++) {
        lum = buffer[i] * 0.3 + buffer[i+1] * 0.59 + buffer[i+2] * 0.11;
        a[x]=lum < threshold && buffer[i+3]>127?1:0;
    }
    return a;
}

// not used:
export function flip_pixels(imageData,width){
  var p,x,y,ix,w=0,iw=imageData.width,widthm=width-1;
  var pixelPosition,pixelPosition2;
  var part;
  for (y = 0; y < imageData.height; y++)
  {
    pixelPosition =  (0     * 4) + (y * iw * 4);
    pixelPosition2 = (width * 4) + (y * iw * 4);
    part=imageData.data.slice(pixelPosition,pixelPosition2);

    for (p=part.length-4,x = 0,ix=widthm; x < width; x++,ix--,p-=4)
    {

        pixelPosition =  (x  * 4) + (y * iw * 4);
        ///pixelPosition2 = (ix * 4) + (y * iw * 4);

        imageData.data[pixelPosition  ] = part[p];
        imageData.data[pixelPosition+1] = part[p+1];
        imageData.data[pixelPosition+2] = part[p+2];
        imageData.data[pixelPosition+3] = part[p+3];
    }
  }
  return w;
}
