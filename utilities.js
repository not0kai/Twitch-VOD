async function requestFromBackground(obj) { return new Promise((res,rej)=> chrome.runtime.sendMessage(obj, response=> res(response)) ) }

const subArr = (r,n)=>r.reduceRight((a,b,c,d)=>[...a, d.splice(0, n)], []);
const btoaJSON = (s)=>btoa(encodeURIComponent(JSON.stringify(s)))
const atobJSON = (s)=>JSON.parse(decodeURIComponent(atob(s)))

function chopSequence(logs,key){
    let next_logs = [[logs[0]]];
    for(let i=1; i<logs.length; i++){
        if(logs[i][key] == logs[(i-1)][key] +1) next_logs.at(-1).push(logs[i]);
        else next_logs.push([logs[i]])
    }
    return next_logs;
}
const delay = (ms)=>new Promise(res=>setTimeout(res, ms));
const rando = (n)=>Math.round(Math.random() * n);
var unqHsh = (a,o) => a.filter(i=> o.hasOwnProperty(i) ? false : (o[i] = true));
function unqKey(array,key){  var q = [];  var map = new Map();  for (const item of array) {    if(!map.has(item[key])){        map.set(item[key], true);        q.push(item);    }  }  return q;}

var cleanObject = (ob) => ob ?
  Object.entries(ob).reduce((r, [k, v]) => {
    if( v != null && v != undefined && v !== "" && ( ['string','number','boolean','function','symbol'].some(opt=> typeof v == opt) || (typeof v == 'object' && ((Array.isArray(v) && v.length) || (Array.isArray(v) != true) ) ) ) ) { 
      r[k] = v; 
      return r;
    } else { 
     return r; 
    }
  }, {}) : null;


function rgbToHsl(s) {
    var rgbv = rgbVals(s);
    var r = rgbv[0] / 255
      , g = rgbv[1] / 255
      , b = rgbv[2] / 255;
    var max = Math.max(r, g, b)
      , min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if (max == min) {
        h = s = 0;
        // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
        case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
        case g:
            h = (b - r) / d + 2;
            break;
        case b:
            h = (r - g) / d + 4;
            break;
        }
        h /= 6;
    }
    return [Math.floor(h * 360), Math.floor(s * 100), Math.floor(l * 100)];
}

function cmyk2rgb(s) {
    let cmyk = cmykVals(s).map(v=>v / 100);
    let r = Math.round(255 * (1 - cmyk[0]) * (1 - cmyk[3]));
    let g = Math.round(255 * (1 - cmyk[1]) * (1 - cmyk[3]));
    let b = Math.round(255 * (1 - cmyk[2]) * (1 - cmyk[3]));
    return `rgb(${r},${g},${b})`
}
function hexToRgb(s) {
    let c = s.replace(/(?<=^#\w{6})\d{2}/, '');
    let opacity = /(?<=^#\w{6})\d{2}/.exec(s)?.[0] ? parseInt(/(?<=^#\w{6})\d{2}/.exec(s)?.[0]) / 100 : 1;
    if (/^#([a-f0-9]{3}){1,2}$/.test(c)) {
        if (c.length == 4) {
            c = '#' + [c[1], c[1], c[2], c[2], c[3], c[3]].join('');
        }
        c = '0x' + c.substring(1);
        return `rgb(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')},${opacity})`;
    }
    return '';
}
function rgb2cmyk(s) {
    const cmy = (x)=>1 - (x / 255);
    const cmyk = (x)=>Math.round(((x - k) / (1 - k)) * 100);
    const rgb = /(?<=rgb\()(\d+),\s*(\d+),\s*(\d+)/i.exec(s);
    let k = Math.min(cmy(rgb[1]), Math.min(cmy(rgb[2]), cmy(rgb[3])));
    return `cmyk(${cmyk(cmy(rgb[1]))}%, ${cmyk(cmy(rgb[2]))}%, ${cmyk(cmy(rgb[3]))}%, ${Math.round(k * 100)}%)`
}

function cmykVals(s) {
    return s.match(/\d+(?=%)/g)?.[0] ? Array.from(s.match(/\d+(?=%)/g)).map(n=>parseInt(n)) : false;
}
function rgbVals(s) {
    return Array.from(s.match(/[\d\.]+/g)).map(r=>Math.round(parseFloat(r)))
}

async function parseURI(d) {
    var reader = new FileReader();
    reader.readAsDataURL(d);
    return new Promise((res,rej)=> reader.onload = (e)=>res(e.target.result))
}
function dateString(d) {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var date = new Date(d);
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}
function parseTimeOffset(s){
    // content_offset_seconds: 1427.737
    const timeString = (n,k)=> `${n >= 1 && n < 10 ? '0'+n.toString() : n >= 10 && n >= 1 ? n : '00'}${k}`;
    let hours = (s/3600);
    let minutes = hours.toString().replace(/\d+(?=\.)/,'');
    let seconds = 60 * parseFloat(minutes);
    let time_arr = [
        Math.floor(hours),
        Math.floor(60 * minutes),
        Math.floor(60*seconds.toString().replace(/\d+(?=\.)/,''))
    ];
    return `${timeString(time_arr[0],'h')}${timeString((time_arr[1] >= 60 ? 0 : time_arr[1]),'m')}${timeString((time_arr[2] >= 60 ? 0 : time_arr[2]),'s')}`;
}//new version. 24 Aug 2023.-AndreB

function getTimeValueFromInputString(s) {
    const intFromStringTime = (v,k)=>new RegExp(`(\\d+)${k}`,'i').exec(v)?.[0]?.replace(/^0/, '') ? parseInt(new RegExp(`(\\d+)${k}`,'i').exec(v)?.[0]?.replace(/^0/, '')) : 0;
    const intFromColonTime = (v)=>v.split(/:/).map(i=>i.trim()).filter(i=>/\d+/.test(s)).map(i=>parseInt(i));
    let sh = /:/.test(s) ? intFromColonTime(s).at(-3) * 3600 : intFromStringTime(s, 'h') * 3600;
    let sm = /:/.test(s) ? intFromColonTime(s).at(-2) * 60 : intFromStringTime(s, 'm') * 60;
    let ss = /:/.test(s) ? intFromColonTime(s).at(-1) : intFromStringTime(s, 's');
    return (sh + sm + ss);
}

const unqDiveKey = (a,o,keys) => a.filter(i=> o.hasOwnProperty(dive(i,keys)) ? false : (o[dive(i,keys)] = true) );
const dive = (ob,keys)=> keys.map(itm=> ob = ob?.[itm] ).at(-1);
function getParamsFromM3u8Link(url){//ISSUE timestamp will b inaccurate here for collections and highlights as they do not use timestamps as the key
    return {
        hash:/cloudfront.net\/(\w+)_(\w+)_(\d+)_(\d+)/.exec(url)?.[1],
        channel_login:/cloudfront.net\/(\w+)_(\w+)_(\d+)_(\d+)/.exec(url)?.[2],
        stream_id:/cloudfront.net\/(\w+)_(\w+)_(\d+)_(\d+)/.exec(url)?.[3],
        timestamp:/cloudfront.net\/(\w+)_(\w+)_(\d+)_(\d+)/.exec(url)?.[4] ? parseInt(/cloudfront.net\/(\w+)_(\w+)_(\d+)_(\d+)/.exec(url)?.[4])*1000 : null,
        timestamp_start:/cloudfront.net\/(\w+)_(\w+)_(\d+)_(\d+)/.exec(url)?.[4] ? parseInt(/cloudfront.net\/(\w+)_(\w+)_(\d+)_(\d+)/.exec(url)?.[4])*1000 : null,
        stream_start_seconds:/cloudfront.net\/(\w+)_(\w+)_(\d+)_(\d+)/.exec(url)?.[4] ? parseInt(/cloudfront.net\/(\w+)_(\w+)_(\d+)_(\d+)/.exec(url)?.[4]) : /cloudfront.net\/(\w+)_(\w+)_(\d+)_(\d+)/.exec(url)?.[4],
        server_id:/\w+(?=\.cloudfront)/.exec(url)?.[0],
        url:url,
    }
}
function getTokensFromCookies() {
    var c = document.cookie;
    return {
        video_id: /twitch\.tv\/videos\/(\d+)/.exec(window.location.href)?.[1],
        channel_login: !/twitch\.tv\/videos\/(\d+)|twitch\.tv\/\w+\/videos/.test(window.location.href) ? /(?<=tv\/)\w+/.exec(window.location.href)?.[0] : null,
        api_token: /(?<=api_token\=).+?(?=;)/.exec(c)?.[0],
        device_id: /(?<=unique_id\=).+?(?=;)/.exec(c)?.[0],
        authorization: /(?<=%22authToken%22:%22).+?(?=%22)/.exec(c)?.[0] ? 'OAuth ' + /(?<=%22authToken%22:%22).+?(?=%22)/.exec(c)?.[0] : '',
        oauth: /(?<=%22authToken%22:%22).+?(?=%22)/.exec(c)?.[0] ? 'OAuth ' + /(?<=%22authToken%22:%22).+?(?=%22)/.exec(c)?.[0] : '',
        client_id: /(?<="Client-ID":"|clientId=").+?(?=")/.exec(Array.from(document.getElementsByTagName('script'))?.filter(i=>/(?<="Client-ID":"|clientId=").+?(?=")/.test(i.innerHTML))?.[0].innerHTML)?.[0] || "kimne78kx3ncx6brgo4mv6wki5h1ko",
        user_id: /%22id%22:%22(\d+)%/.exec(c)?.[1],
    };
}
async function getChannelLogin(){
  var channelHref = ()=> Array.from(
      document.getElementsByClassName('channel-info-content')?.[0]?.getElementsByTagName('section')?.[0]?.getElementsByTagName('a')).filter(r=> /(?<=tv\/)\w+/.test(r?.href))?.[1]?.href;
  let channel_login = /(?<=tv\/)\w+/.exec(channelHref())?.[0];
  // console.log(['channel_login',channel_login])
  if(channel_login){
      // console.log(channelHref())
      return channel_login;
  }else{
      // console.log(channelHref())
      await delay(2111);
      return /(?<=tv\/)\w+/.exec(channelHref())?.[0];
  }
}


async function getDownloadableArrayBuffer(url) {
  function getResBlob(url) {
      return new Promise((res)=>{
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.responseType = 'arraybuffer';
          xhr.onload = function(e) {
              if (this.status == 200) {
                  res(this.response)
              } else {
                  res(false);
              }
          };
          xhr.send();
      })
  }
  return await getResBlob(url);
}

const getLiveTimeFromDOM = ()=> document.getElementsByClassName('live-time')[0] ? getTimeValueFromInputString(document.getElementsByClassName('live-time')[0].innerText) : null;