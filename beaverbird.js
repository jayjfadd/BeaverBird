(function() {
var BeaverBird = {}

BeaverBird.DEBUG = false;

BeaverBird.uid = function() {
  var data = this.data()
  return data.canvasFingerprint
  + ":" + data.dnt // this is actually very Browser-specific ;)
  + ":" + data.lang
  + ":" + SparkMD5.hash(data.fonts.join(":"))
}

BeaverBird.match = function(uid) {
  return BeaverBird.uid() === uid;
}

BeaverBird.data = function() {
  return {
    canvasFingerprint: BeaverBird.canvas(),
    fonts: BeaverBird.fonts(),
    userAgent: navigator.userAgent,
    dnt: navigator.doNotTrack,
    javaEnabled: navigator.javaEnabled(),
    lang: navigator.language
  }
}

BeaverBird.canvas = function() {
  var canvas = document.createElement("canvas")
  canvas.width = 280
  canvas.height = 60

  if (!this.DEBUG)
    canvas.style.display = "none"

  canvas.id = "beaver-bird-canvas"
  document.body.appendChild(canvas)

  var c = canvas.getContext("2d")
  var text = "BeaverBird is watching you"

  c.fillStyle = "rgb(178, 214, 232)"
  c.fillRect(10, 20, 60, 80)

  c.fillStyle = "#111"
  c.font = "16pt Arial"
  c.fillText(text, 2, 40)

  c.strokeStyle = "rgb(120, 186, 176)"
  c.arc(80, 10, 20, 0, Math.PI)
  c.stroke()

  var imageData = c.getImageData(0, 0, 280, 60)

  if (!this.DEBUG)
    document.body.removeChild(canvas)

  return SparkMD5.ArrayBuffer.hash(imageData.data)
}

BeaverBird.matchCanvas = function(string) {
  return string === BeaverBird.canvas()
}

BeaverBird.fonts = function(customFonts) {
  var fonts = [
    "Arial", "Times New Roman", "Helvetica", "Open Sans",
    "Source Sans Pro", "Comic Sans MS", "Century", "Century Gothic",
    "Monaco", "Lato", "Geneva", "Futura",
    "Fantasque Sans Mono", "Courier", "Courier New", "Corsiva Hebrew",
    "Comic Neue", "Cambria", "Calibri", "TI-Nspire",
    "Adobe Braille", "Adobe Hebrew", "Apple LiGothic", "Apple Farben-Emoji",
    "Avenir", "Avenir Next", "Batang", "Bell MT", "Birch Std",
    "Damascus", "Microsoft Sans Serif", "Minion Pro", "Times",
    "Roboto", "Oswald", "Droid Sans", "Droid Serif",
    "Roboto Condensed", "Ubuntu", "Raleway", "Lobster",
    "Ubuntu Condensed", "Helvetica Neue"
  ]

  if (typeof customFonts !== "undefined") {
    fonts = customFonts
  }

  var STRING = "wwzrllTNMLllllliiimmqßmmmmiiillllplö😄©_~ñ"

  // Set up default font information

  var defaults = [
    {name: "serif"},
    {name:"sans-serif"},
    {name:"monospace"}
  ]

  /*
    Yes, the span is reused, because, why not
  */

  var span = document.createElement("span")
  span.innerHTML = STRING
  span.style.fontSize = "86px"

  // span.style.display = "none"
  // will not work, but it should anyway be too fast
  //span.style.display = "hidden"

  /*
    First, the width and height of the (3) default fonts will have to be measured.
    Using them, it is possible to determine if the text was
    displayed in one of them, as a fallback, because the font itself did not exist / was
    not available
  */

  defaults.forEach(function(font) {
    span.style.fontFamily = font.name
    document.body.appendChild(span)
    font.width = span.offsetWidth
    font.height = span.offsetHeight
    document.body.removeChild(span)
  })

  if (this.DEBUG)
    console.log(defaults)

  // Search for fonts

  var foundFonts = []

  fonts.forEach(function(font) {
    var found = false

    defaults.forEach(function(defaultFont) {
      span.style.fontFamily = font + "," + defaultFont.name
      document.body.appendChild(span)
      if (span.offsetWidth !== defaultFont.width || span.offsetHeight !== defaultFont.height) {
        found = true
      }
      document.body.removeChild(span)
    })

    if (found) {
      if (BeaverBird.DEBUG)
        console.log("found font:", font)

      foundFonts.push(font)
    }
  })

  if (BeaverBird.DEBUG)
    console.log("found", foundFonts.length, "fonts")

  return foundFonts.sort()
}

BeaverBird.matchFonts = function(fonts) {
  var foundFonts = this.fonts()

  var doNotMatch = false
  fonts.forEach(function(font) {
    if (foundFonts.indexOf(font) === -1) {
      doNotMatch = true
    }
  })

  return !doNotMatch
}

/* Export */

if (typeof module !== "undefined" && module.exports) {
  module.exports = BeaverBird
}
else {
  window.BeaverBird = BeaverBird
}

// md5 implementation (https://github.com/satazor/SparkMD5)
(function(a){if(typeof exports==="object"){module.exports=a()}else{if(typeof define==="function"&&define.amd){define(a)}else{var c;try{c=window}catch(b){c=self}c.SparkMD5=a()}}}(function(c){var e=function(s,r){return(s+r)&4294967295},n=function(z,v,u,r,y,w){v=e(e(v,z),e(r,w));return e((v<<y)|(v>>>(32-y)),u)},a=function(v,u,A,z,r,y,w){return n((u&A)|((~u)&z),v,u,r,y,w)},k=function(v,u,A,z,r,y,w){return n((u&z)|(A&(~z)),v,u,r,y,w)},f=function(v,u,A,z,r,y,w){return n(u^A^z,v,u,r,y,w)},p=function(v,u,A,z,r,y,w){return n(A^(u|(~z)),v,u,r,y,w)},d=function(s,u){var t=s[0],r=s[1],w=s[2],v=s[3];t=a(t,r,w,v,u[0],7,-680876936);v=a(v,t,r,w,u[1],12,-389564586);w=a(w,v,t,r,u[2],17,606105819);r=a(r,w,v,t,u[3],22,-1044525330);t=a(t,r,w,v,u[4],7,-176418897);v=a(v,t,r,w,u[5],12,1200080426);w=a(w,v,t,r,u[6],17,-1473231341);r=a(r,w,v,t,u[7],22,-45705983);t=a(t,r,w,v,u[8],7,1770035416);v=a(v,t,r,w,u[9],12,-1958414417);w=a(w,v,t,r,u[10],17,-42063);r=a(r,w,v,t,u[11],22,-1990404162);t=a(t,r,w,v,u[12],7,1804603682);v=a(v,t,r,w,u[13],12,-40341101);w=a(w,v,t,r,u[14],17,-1502002290);r=a(r,w,v,t,u[15],22,1236535329);t=k(t,r,w,v,u[1],5,-165796510);v=k(v,t,r,w,u[6],9,-1069501632);w=k(w,v,t,r,u[11],14,643717713);r=k(r,w,v,t,u[0],20,-373897302);t=k(t,r,w,v,u[5],5,-701558691);v=k(v,t,r,w,u[10],9,38016083);w=k(w,v,t,r,u[15],14,-660478335);r=k(r,w,v,t,u[4],20,-405537848);t=k(t,r,w,v,u[9],5,568446438);v=k(v,t,r,w,u[14],9,-1019803690);w=k(w,v,t,r,u[3],14,-187363961);r=k(r,w,v,t,u[8],20,1163531501);t=k(t,r,w,v,u[13],5,-1444681467);v=k(v,t,r,w,u[2],9,-51403784);w=k(w,v,t,r,u[7],14,1735328473);r=k(r,w,v,t,u[12],20,-1926607734);t=f(t,r,w,v,u[5],4,-378558);v=f(v,t,r,w,u[8],11,-2022574463);w=f(w,v,t,r,u[11],16,1839030562);r=f(r,w,v,t,u[14],23,-35309556);t=f(t,r,w,v,u[1],4,-1530992060);v=f(v,t,r,w,u[4],11,1272893353);w=f(w,v,t,r,u[7],16,-155497632);r=f(r,w,v,t,u[10],23,-1094730640);t=f(t,r,w,v,u[13],4,681279174);v=f(v,t,r,w,u[0],11,-358537222);w=f(w,v,t,r,u[3],16,-722521979);r=f(r,w,v,t,u[6],23,76029189);t=f(t,r,w,v,u[9],4,-640364487);v=f(v,t,r,w,u[12],11,-421815835);w=f(w,v,t,r,u[15],16,530742520);r=f(r,w,v,t,u[2],23,-995338651);t=p(t,r,w,v,u[0],6,-198630844);v=p(v,t,r,w,u[7],10,1126891415);w=p(w,v,t,r,u[14],15,-1416354905);r=p(r,w,v,t,u[5],21,-57434055);t=p(t,r,w,v,u[12],6,1700485571);v=p(v,t,r,w,u[3],10,-1894986606);w=p(w,v,t,r,u[10],15,-1051523);r=p(r,w,v,t,u[1],21,-2054922799);t=p(t,r,w,v,u[8],6,1873313359);v=p(v,t,r,w,u[15],10,-30611744);w=p(w,v,t,r,u[6],15,-1560198380);r=p(r,w,v,t,u[13],21,1309151649);t=p(t,r,w,v,u[4],6,-145523070);v=p(v,t,r,w,u[11],10,-1120210379);w=p(w,v,t,r,u[2],15,718787259);r=p(r,w,v,t,u[9],21,-343485551);s[0]=e(t,s[0]);s[1]=e(r,s[1]);s[2]=e(w,s[2]);s[3]=e(v,s[3])},q=function(t){var u=[],r;for(r=0;r<64;r+=4){u[r>>2]=t.charCodeAt(r)+(t.charCodeAt(r+1)<<8)+(t.charCodeAt(r+2)<<16)+(t.charCodeAt(r+3)<<24)}return u},m=function(r){var t=[],s;for(s=0;s<64;s+=4){t[s>>2]=r[s]+(r[s+1]<<8)+(r[s+2]<<16)+(r[s+3]<<24)}return t},l=function(A){var u=A.length,r=[1732584193,-271733879,-1732584194,271733878],w,t,z,x,y,v;for(w=64;w<=u;w+=64){d(r,q(A.substring(w-64,w)))}A=A.substring(w-64);t=A.length;z=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(w=0;w<t;w+=1){z[w>>2]|=A.charCodeAt(w)<<((w%4)<<3)}z[w>>2]|=128<<((w%4)<<3);if(w>55){d(r,z);for(w=0;w<16;w+=1){z[w]=0}}x=u*8;x=x.toString(16).match(/(.*?)(.{0,8})$/);y=parseInt(x[2],16);v=parseInt(x[1],16)||0;z[14]=y;z[15]=v;d(r,z);return r},o=function(z){var t=z.length,r=[1732584193,-271733879,-1732584194,271733878],v,s,y,w,x,u;for(v=64;v<=t;v+=64){d(r,m(z.subarray(v-64,v)))}z=(v-64)<t?z.subarray(v-64):new Uint8Array(0);s=z.length;y=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(v=0;v<s;v+=1){y[v>>2]|=z[v]<<((v%4)<<3)}y[v>>2]|=128<<((v%4)<<3);if(v>55){d(r,y);for(v=0;v<16;v+=1){y[v]=0}}w=t*8;w=w.toString(16).match(/(.*?)(.{0,8})$/);x=parseInt(w[2],16);u=parseInt(w[1],16)||0;y[14]=x;y[15]=u;d(r,y);return r},j=["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"],h=function(u){var t="",r;for(r=0;r<4;r+=1){t+=j[(u>>(r*8+4))&15]+j[(u>>(r*8))&15]}return t},b=function(r){var s;for(s=0;s<r.length;s+=1){r[s]=h(r[s])}return r.join("")},i=function(r){return b(l(r))},g=function(){this.reset()};if(i("hello")!=="5d41402abc4b2a76b9719d911017c592"){e=function(r,u){var t=(r&65535)+(u&65535),s=(r>>16)+(u>>16)+(t>>16);return(s<<16)|(t&65535)}}g.prototype.append=function(r){if(/[\u0080-\uFFFF]/.test(r)){r=unescape(encodeURIComponent(r))}this.appendBinary(r);return this};g.prototype.appendBinary=function(t){this._buff+=t;this._length+=t.length;var s=this._buff.length,r;for(r=64;r<=s;r+=64){d(this._state,q(this._buff.substring(r-64,r)))}this._buff=this._buff.substr(r-64);return this};g.prototype.end=function(t){var w=this._buff,v=w.length,u,s=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],r;for(u=0;u<v;u+=1){s[u>>2]|=w.charCodeAt(u)<<((u%4)<<3)}this._finish(s,v);r=!!t?this._state:b(this._state);this.reset();return r};g.prototype._finish=function(s,w){var u=w,t,v,r;s[u>>2]|=128<<((u%4)<<3);if(u>55){d(this._state,s);for(u=0;u<16;u+=1){s[u]=0}}t=this._length*8;t=t.toString(16).match(/(.*?)(.{0,8})$/);v=parseInt(t[2],16);r=parseInt(t[1],16)||0;s[14]=v;s[15]=r;d(this._state,s)};g.prototype.reset=function(){this._buff="";this._length=0;this._state=[1732584193,-271733879,-1732584194,271733878];return this};g.prototype.destroy=function(){delete this._state;delete this._buff;delete this._length};g.hash=function(t,r){if(/[\u0080-\uFFFF]/.test(t)){t=unescape(encodeURIComponent(t))}var s=l(t);return !!r?s:b(s)};g.hashBinary=function(s,r){var t=l(s);return !!r?t:b(t)};g.ArrayBuffer=function(){this.reset()};g.ArrayBuffer.prototype.append=function(r){var u=this._concatArrayBuffer(this._buff,r),t=u.length,s;this._length+=r.byteLength;for(s=64;s<=t;s+=64){d(this._state,m(u.subarray(s-64,s)))}this._buff=(s-64)<t?u.subarray(s-64):new Uint8Array(0);return this};g.ArrayBuffer.prototype.end=function(t){var w=this._buff,v=w.length,s=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],u,r;for(u=0;u<v;u+=1){s[u>>2]|=w[u]<<((u%4)<<3)}this._finish(s,v);r=!!t?this._state:b(this._state);this.reset();return r};g.ArrayBuffer.prototype._finish=g.prototype._finish;g.ArrayBuffer.prototype.reset=function(){this._buff=new Uint8Array(0);this._length=0;this._state=[1732584193,-271733879,-1732584194,271733878];return this};g.ArrayBuffer.prototype.destroy=g.prototype.destroy;g.ArrayBuffer.prototype._concatArrayBuffer=function(u,s){var t=u.length,r=new Uint8Array(t+s.byteLength);r.set(u);r.set(new Uint8Array(s),t);return r};g.ArrayBuffer.hash=function(r,s){var t=o(new Uint8Array(r));return !!s?t:b(t)};return g}));

})()
