
var crypto= window.crypto ||  window.msCrypto;
var random =crypto.getRandomValues.bind(crypto);


export function shuffle(arr) {
    arr=arr.slice(0); // dont modify source arr
    const  randomBuffer = new Uint8Array(arr.length); // short arrays only. less than 3000 in length, actually less than 255 in length as beccaus uint8
    random(randomBuffer);
    var ret=[],randi=0;
    while(arr.length){
     ret.push(arr.splice(randomBuffer[randi++]%arr.length,1)[0])
    }
    return ret;
}


// the code tries to prevent frequency analysis
// by making even filed possible or by adding randomness on top of it

// the first char is version, to not throw away bits if all leters before are not L or K, i just put the first letter as is

// keys with too much repeating same letter are not too good for this. so they are rejected.

//var private_key="L5GsZnm9zguD92jeXxHJCqsojuQF45HM8N91A5JLkt5JpS6Hu9AG";
//console.log(getEvenFrequencyPad(private_key,144,1))

export function getEvenFrequencyPad(private_key,to_n_chars,seal_layers)
{
 var base58c='123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
 var chars_arr=private_key.split('');
 var o="";
 o+=chars_arr.shift();
 var has=base58c.split('').map(function(){ return 0; });

 if(seal_layers===undefined)seal_layers=1;
 chars_arr.forEach(function(a){ has[base58c.indexOf(a)]++;
     //                          if(has[base58c.indexOf(a)]>4) throw new Error('bad private key');
 })
 var n=to_n_chars;
 var charstoadd=''

 const  randomBuffer = new Uint8Array(n); // short arrays only. less than 3000 in length, actually less than 255 in length as beccaus uint8
 random(randomBuffer);
 var ret=[],randi=0;
 var sum=chars_arr.length;

 //seal
 for(var j=0;j<seal_layers;j++){
  for(var i=0;i<base58c.length&&sum <n;i++)
  {
   if(has[i]<2){
    has[i]++;
    sum++;
    charstoadd+=base58c[i];
   }
  }
 }

 //sparkle some randomness
 for(var i=sum;i<n;i++)
 {
  var rand=base58c[randomBuffer[i] % base58c.length]
  has[base58c.indexOf(rand)]++;
  charstoadd+=rand;
  sum++;
 }

  var charstoadd_arr=chars_arr.map(function(){return "_";}).concat(charstoadd.split(''));//.join('');


 var pad=(shuffle(charstoadd_arr).join(''));
 o+=pad.replace(/_/g,function(){return chars_arr.shift();})
 pad=('_'+pad).split('').map(function(a){return a==='_'?' ':'\u2588';}).join('');
 return {padded:o,marking:pad};
}

 
