chrome.runtime.onMessage.addListener((msg, sender, response) => {
    requestFromClientManager(msg).then(response);
    return true;
});
var cleanObject = (ob) => 
  Object.entries(ob).reduce((r, [k, v]) => {
    if( v != null && v != undefined && v !== "" && ( ['string','number','boolean','function','symbol'].some(opt=> typeof v == opt) || (typeof v == 'object' && ((Array.isArray(v) && v.length) || (Array.isArray(v) != true) ) ) ) ) { 
      r[k] = v; 
      return r;
    } else { 
     return r; 
    }
  }, {});
async function requestFromClientManager(msg){
    if(msg.cmd == 'getStreamDetailsFromStreamId') return await getStreamDetailsFromStreamId(msg.params);
    if(msg.cmd == 'getStreamDetailsFromVODdetails') return await getStreamDetailsFromVODdetails(msg.params);
    if(msg.cmd == 'getTSFilesFromM3u8') return await getTSFilesFromM3u8(msg.params);
    if(msg.cmd == 'getSullyStreamsData') return await getSullyStreamsData(msg.params);
    if(msg.cmd == 'getCollections') return await getCollections(msg.params);
    if(msg.cmd == 'getAvailableVODinfo') return await getAvailableVODinfo(msg.params);
    if(msg.cmd == 'getRecentStreamsFromStreamCharts') return await getRecentStreamsFromStreamCharts(msg.params);
    if(msg.cmd == 'getStreamInformation') return await getStreamInformation(msg.params);
    if(msg.cmd == 'getValidResolutions') return await getValidResolutions(msg.params);
    if(msg.cmd == 'getExactStreamStartTimeFromStreamchart') return await getExactStreamStartTimeFromStreamchart(msg.params);    
    if(msg.cmd == 'SHA1') return SHA1(msg.params);

    if(msg.cmd == 'channelVideoCore') return await channelVideoCore(msg.token_params);
    if(msg.cmd == 'vodInfo') return await vodInfo(msg.token_params);
    if(msg.cmd == 'vodChatExtractionAPI') return await vodChatExtractionAPI(msg);
    if(msg.cmd == 'getCurrentStreamInfo') return await getCurrentStreamInfo(msg.token_params);
}
var subArr = (r, n) => r.reduceRight((a,b,c,d) => [...a, d.splice(0,n)],[]);
const tryJSON = (s)=> {try{return JSON.parse(s)} catch(err){return null}};

async function fetchTexts(arr){
    let res = await Promise.all(arr.map(e => fetch(e)));
    return await Promise.all(res.map(async (e) => {
        let text = await e.text();
        return {
            text: text,
            url:e.url
        }
    }));    
}
function getHighestKey(ob){
    var nums = Object.keys(ob).map(d=> /^\d+/.exec(d)?.[0] ? /^\d+/.exec(d)?.[0] : 0 ).map(d=> parseInt(d));
    var largest = Math.max(...nums).toString();
    return Object.keys(ob).filter(i=> new RegExp(largest.toString()).test(i))[0];
}
function SHA1(msg) {    const rotate_left = (n,s)=> ( n<<s ) | (n>>>(32-s));    function cvt_hex(val) {        var str='';        var i, v;        for( i=7; i>=0; i-- ) {            v = (val>>>(i*4))&0x0f;            str += v.toString(16);        }        return str;    };    function Utf8Encode(string) {        string = string.replace(/\r\n/g,'\n');        var utftext = '';        for (var n = 0; n < string.length; n++) {            var c = string.charCodeAt(n);            if (c < 128) {                utftext += String.fromCharCode(c);            }            else if((c > 127) && (c < 2048)) {                utftext += String.fromCharCode((c >> 6) | 192);                utftext += String.fromCharCode((c & 63) | 128);            }            else {                utftext += String.fromCharCode((c >> 12) | 224);                utftext += String.fromCharCode(((c >> 6) & 63) | 128);                utftext += String.fromCharCode((c & 63) | 128);            }        }        return utftext;    };    var blockstart;    var i, j;    var W = new Array(80);    var H0 = 0x67452301;    var H1 = 0xEFCDAB89;    var H2 = 0x98BADCFE;    var H3 = 0x10325476;    var H4 = 0xC3D2E1F0;    var A, B, C, D, E;    var temp;    msg = Utf8Encode(msg);    var msg_len = msg.length;    var word_array = new Array();    for( i=0; i<msg_len-3; i+=4 ) {        j = msg.charCodeAt(i)<<24 | msg.charCodeAt(i+1)<<16 |        msg.charCodeAt(i+2)<<8 | msg.charCodeAt(i+3);        word_array.push( j );    }    switch( msg_len % 4 ) {        case 0:        i = 0x080000000;        break;        case 1:        i = msg.charCodeAt(msg_len-1)<<24 | 0x0800000;        break;        case 2:        i = msg.charCodeAt(msg_len-2)<<24 | msg.charCodeAt(msg_len-1)<<16 | 0x08000;        break;        case 3:        i = msg.charCodeAt(msg_len-3)<<24 | msg.charCodeAt(msg_len-2)<<16 | msg.charCodeAt(msg_len-1)<<8 | 0x80;        break;    }    word_array.push( i );    while( (word_array.length % 16) != 14 ) word_array.push( 0 );    word_array.push( msg_len>>>29 );    word_array.push( (msg_len<<3)&0x0ffffffff );    for ( blockstart=0; blockstart<word_array.length; blockstart+=16 ) {        for( i=0; i<16; i++ ) W[i] = word_array[blockstart+i];        for( i=16; i<=79; i++ ) W[i] = rotate_left(W[i-3] ^ W[i-8] ^ W[i-14] ^ W[i-16], 1);        A = H0;        B = H1;        C = H2;        D = H3;        E = H4;        for( i= 0; i<=19; i++ ) {            temp = (rotate_left(A,5) + ((B&C) | (~B&D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;            E = D;            D = C;            C = rotate_left(B,30);            B = A;            A = temp;        }        for( i=20; i<=39; i++ ) {            temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;            E = D;            D = C;            C = rotate_left(B,30);            B = A;            A = temp;        }        for( i=40; i<=59; i++ ) {            temp = (rotate_left(A,5) + ((B&C) | (B&D) | (C&D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;            E = D;            D = C;            C = rotate_left(B,30);            B = A;            A = temp;        }        for( i=60; i<=79; i++ ) {            temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;            E = D;            D = C;            C = rotate_left(B,30);            B = A;            A = temp;        }        H0 = (H0 + A) & 0x0ffffffff;        H1 = (H1 + B) & 0x0ffffffff;        H2 = (H2 + C) & 0x0ffffffff;        H3 = (H3 + D) & 0x0ffffffff;        H4 = (H4 + E) & 0x0ffffffff;    }    var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);    return temp.toLowerCase();}



function parseCollections(d,channel_login){
    return d?.data?.user?.collections?.edges?.map(p=> {
        // // https://d2nvs31859zcd8.cloudfront.net/995669b2d3195f985414_tr4d3r10_37168110440_2965085204/chunked/highlight-814626335.m3u8       
        return p?.node?.items?.edges?.map(r=> {
            let m3u8_path = /\w+\.cloudfront.net\/\w{20}_\w+_\d+_\d+(?=\/)/.exec(r?.node?.animatedPreviewURL)?.[0];
            let m3u8_tokens = (/(?<=\/)\w{20}_\w+_\d+_\d+(?=\/)/.exec(r?.node?.previewThumbnailURL)?.[0] || /(?<=\/)\w{20}_\w+_\d+_\d+(?=\/)/.exec(r?.node?.animatedPreviewURL)?.[0])?.split(/_/);
            let m3u8_server = /\w+(?=\.cloudfront.net\/\w{20}_\w+_\d+_\d+\/)/.exec(r?.node?.animatedPreviewURL)?.[0];
            return {
                collection_title:p?.node?.title,
                collection_id:p?.node?.id,
                vod_id:r?.node?.id,
                published_at:r.node?.publishedAt,
                timestamp:r.node?.publishedAt ? new Date(r.node?.publishedAt).getTime() : m3u8_tokens?.[3] ? m3u8_tokens?.[3] * 1000 : null,
                published_at:r.node?.publishedAt,
                title:r.node?.title,
                seconds:r.node?.lengthSeconds,
                animated_preview_url:r?.node?.animatedPreviewURL,
                view_count:r?.node?.viewCount,
                preview_url:r?.node?.previewThumbnailURL,
                m3u8_path:m3u8_path,
                m3u8_tokens:m3u8_tokens,
                stream_id: m3u8_tokens?.[2],
                hash: m3u8_tokens?.[0],
                stream_start_seconds: m3u8_tokens?.[3],
                m3u8_server:m3u8_server,
                midpath:`${m3u8_tokens?.[0]}_${channel_login}_${m3u8_tokens?.[2]}_${m3u8_tokens?.[3]}`,
                channel_login:channel_login,
                end_path:`highlight-${r?.node?.id}`,
            }
        })
        
    })
    
}

async function getClipInformation(){
    var res = await fetch("https://gql.twitch.tv/gql", {
        "headers": {
          "accept": "*/*",
          "accept-language": "en-US",
          "authorization": "OAuth 15mauiculs9kt96d0qfokptn0bo6ic",
          "client-id": "kimne78kx3ncx6brgo4mv6wki5h1ko",
          "client-integrity": "v4.public.eyJjbGllbnRfaWQiOiJraW1uZTc4a3gzbmN4NmJyZ280bXY2d2tpNWgxa28iLCJjbGllbnRfaXAiOiI0NS4xOTYuMzQuMzAiLCJkZXZpY2VfaWQiOiJoUWNVazFmbzZsSERJUTVNUmNRa2Z1ZDFITE5pVFJmTSIsImV4cCI6IjIwMjMtMTEtMTdUMDk6MDk6NDZaIiwiaWF0IjoiMjAyMy0xMS0xNlQxNzowOTo0NloiLCJpc19iYWRfYm90IjoiZmFsc2UiLCJpc3MiOiJUd2l0Y2ggQ2xpZW50IEludGVncml0eSIsIm5iZiI6IjIwMjMtMTEtMTZUMTc6MDk6NDZaIiwidXNlcl9pZCI6IjI2NjIzOTM0NiJ9T-v2sqOuzPnfGsA5c1oy6iagF9WdCMa2Cv7DT7U14xab94NLnL1MQ06o_tXMmE56-1ZcnVAfRgfGGiP6MOOYBg",
          "client-session-id": "9b66696fd29061d6",
          "client-version": "cc42a385-abf2-4687-902a-7cbd78a8e9c9",
          "content-type": "text/plain;charset=UTF-8",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "x-device-id": "hQcUk1fo6lHDIQ5MRcQkfud1HLNiTRfM"
        },
        "referrer": "https://www.twitch.tv/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": "{\"operationName\":\"ChannelClipCore\",\"variables\":{\"clipSlug\":\"IcyBreakableDelicataTooSpicy-RnrKLybQI3W9K_AD\"},\"extensions\":{\"persistedQuery\":{\"version\":1,\"sha256Hash\":\"9796f0a2f336c1e8a78d8ff362291cc2d43bbb1036d39f146d22d636f03f641d\"}}}",
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
      });
}



async function getCollections(params){
    var {channel_login} = params;
    var res = await fetch("https://gql.twitch.tv/gql", {
      "headers": {
        "accept": "*/*",
        "accept-language": "en-US",
        "client-id": "kimne78kx3ncx6brgo4mv6wki5h1ko",
        "content-type": "text/plain;charset=UTF-8",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "x-device-id": "hQcUk1fo6lHDIQ5MRcQkfud1HLNiTRfM"
      },
      "referrer": "https://www.twitch.tv/",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": `{\"operationName\":\"ChannelCollectionsContent\",\"variables\":{\"ownerLogin\":\"${channel_login}\",\"limit\":75},\"extensions\":{\"persistedQuery\":{\"version\":1,\"sha256Hash\":\"447aec6a0cc1e8d0a8d7732d47eb0762c336a2294fdb009e9c9d854e49d484b9\"}}}`,
      "method": "POST",
      "mode": "cors",
      "credentials": "omit"
    });
    var d = await res.json();
    // console.log(d);
    let parsed = parseCollections(d,channel_login)?.flat();
    // console.log(parsed);
    return parsed;
}

async function getAvailableHighlights(params){
    var {device_id,client_id,oauth,vod_id,channel_login} = params;
    var res = await fetch("https://gql.twitch.tv/gql", {
    "headers": {
        "accept": "*/*",
        "accept-language": "en-US",
        "client-id": client_id,
        "content-type": "text/plain;charset=UTF-8",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "x-device-id": device_id,
    },
    "referrer": "https://www.twitch.tv/",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": `[{\"operationName\":\"FilterableVideoTower_Videos\",\"variables\":{\"limit\":75,\"channelOwnerLogin\":\"${channel_login}\",\"broadcastType\":\"HIGHLIGHT\",\"videoSort\":\"TIME\"},\"extensions\":{\"persistedQuery\":{\"version\":1,\"sha256Hash\":\"a937f1d22e269e39a03b509f65a7490f9fc247d7f83d6ac1421523e3b68042cb\"}}}]`,
    "method": "POST",
    "mode": "cors",
    "credentials": "omit"
    });
    var d = await res.json();
    // console.log(d);
    // console.log(parseHighlights(d))
    return d;
}
function parseHighlights(d){
    return d?.[0]?.data?.user?.videos?.edges?.map(r=> {
        let m3u8_path = /\w+\.cloudfront.net\/\w{20}_\w+_\d+_\d+(?=\/)/.exec(r?.node?.animatedPreviewURL)?.[0];
        let m3u8_tokens = (/(?<=\/)\w{20}_\w+_\d+_\d+(?=\/)/.exec(r?.node?.previewThumbnailURL)?.[0] || /(?<=\/)\w{20}_\w+_\d+_\d+(?=\/)/.exec(r?.node?.animatedPreviewURL)?.[0])?.split(/_/);
        let m3u8_server = /\w+(?=\.cloudfront.net\/\w{20}_\w+_\d+_\d+\/)/.exec(r?.node?.animatedPreviewURL)?.[0];
        return {
            vod_id:r.node?.id,
            timestamp:r.node?.publishedAt ? new Date(r.node?.publishedAt).getTime() : m3u8_tokens[3] ? m3u8_tokens[3] * 1000 : null,
            published_at:r.node?.publishedAt,
            title:r.node?.title,
            seconds:r.node?.lengthSeconds,
            animated_preview_url:r?.node?.animatedPreviewURL,
            view_count:r?.node?.viewCount,
            preview_url:r?.node?.previewThumbnailURL,
            m3u8_path:m3u8_path,
            m3u8_tokens:m3u8_tokens,
            stream_id: m3u8_tokens[2],
            hash: m3u8_tokens[0],
            stream_start_seconds: m3u8_tokens[3],
            m3u8_server:m3u8_server,
            midpath:`${m3u8_tokens[0]}_${channel_login}_${m3u8_tokens[2]}_${m3u8_tokens[3]}`,
            channel_login:channel_login
        }
    });
}
async function getVideoPlaybackAccessToken(params){
    var {device_id,client_id,oauth,vod_id,channel_login} = params;
    var res = await fetch("https://gql.twitch.tv/gql", {
        "headers": {
          "accept": "*/*",
          "accept-language": "en-US",
          "client-id": client_id,
          "content-type": "text/plain;charset=UTF-8",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "x-device-id": device_id,
        },
        "referrer": "https://www.twitch.tv/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": `{\"operationName\":\"PlaybackAccessToken\",\"variables\":{\"isLive\":false,\"login\":\"\",\"isVod\":true,\"vodID\":\"${vod_id}\",\"playerType\":\"channel_home_carousel\"},\"extensions\":{\"persistedQuery\":{\"version\":1,\"sha256Hash\":\"0828119ded1c13477966434e15800ff57ddacf13ba1911c129dc2200705b0712\"}}}`,
        "method": "POST",
        "mode": "cors",
        "credentials": "omit"
      });
    var d = await res.json();
    // console.log(d);
    return d;
}

// fetch("https://usher.ttvnw.net/vod/1759483506.m3u8?acmb=e30%3D&allow_source=true&p=5837649&play_session_id=785f0dac74dd369fdf2dc9c33c14d855&player_backend=mediaplayer&playlist_include_framerate=true&reassignments_supported=true&sig=3398da6bc52af83be1482c4c75b3db528e7643e8&supported_codecs=avc1&token=%7B%22authorization%22%3A%7B%22forbidden%22%3Afalse%2C%22reason%22%3A%22%22%7D%2C%22chansub%22%3A%7B%22restricted_bitrates%22%3A%5B%5D%7D%2C%22device_id%22%3A%22hQcUk1fo6lHDIQ5MRcQkfud1HLNiTRfM%22%2C%22expires%22%3A1688716304%2C%22https_required%22%3Atrue%2C%22privileged%22%3Afalse%2C%22user_id%22%3Anull%2C%22version%22%3A2%2C%22vod_id%22%3A1759483506%7D&transcode_mode=cbr_v1&cdm=wv&player_version=1.20.0", {
//   "headers": {
//     "accept": "application/x-mpegURL, application/vnd.apple.mpegurl, application/json, text/plain"
//   },
//   "referrer": "",
//   "referrerPolicy": "strict-origin-when-cross-origin",
//   "body": null,
//   "method": "GET",
//   "mode": "cors",
//   "credentials": "omit"
// });


async function getStreamInformation(params){
    var {device_id,client_id,oauth,vod_id,channel_login} = params;
    var res = await fetch("https://gql.twitch.tv/gql", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US",
            "authorization": oauth ? oauth : 'undefined',
            "client-id": client_id,
            "content-type": "text/plain;charset=UTF-8",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "cache-control": "no-cache"
        },
        "referrer": "https://www.twitch.tv/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": `[{\"operationName\":\"UseLive\",\"variables\":{\"channelLogin\":\"${channel_login ? channel_login : ''}\"},\"extensions\":{\"persistedQuery\":{\"version\":1,\"sha256Hash\":\"639d5f11bfb8bf3053b424d9ef650d04c4ebb7d94711d644afb08fe9a0fad5d9\"}}}]`,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    });
    var d = await res.json();
    // console.log(['getStreamInformation',d]);
    let outob = {
        stream_id: d[0]?.data?.user?.stream?.id,
        timestamp: new Date(d[0]?.data?.user?.stream?.createdAt).getTime(),
        start_timestamp_seconds: d[0]?.data?.user?.stream?.createdAt ? Math.floor(new Date(d[0]?.data?.user?.stream?.createdAt).getTime()/1000) : null,
    };
    return {
        ...params,
        ...outob,
        ...{
            hash:SHA1(`${channel_login ? channel_login : login}_${outob.stream_id}_${outob.start_timestamp_seconds}`).slice(0,20)
        }
    }
}
// async function getChannelDetails(){

// }

async function getSullyStreamsData(params){
    var texts = await fetchTexts([`https://sullygnome.com/channel/${params?.channel_login}/30/streams`]);
    var channel_id = /(?<=PageInfo.{1,1000}?"id":)\d+/.exec(texts?.[0]?.text)?.[0]
    var res = await fetch(`https://sullygnome.com/api/tables/channeltables/streams/90/${channel_id}/%20/1/1/desc/0/100`);
    var d = await res.json();
    var parsed = d?.data?.map(r=> {
        return {
            ...{
                channel_login:r?.channelurl,
                stream_id:/(?<=stream\/)\d+/.exec(r?.streamUrl)?.[0] || r?.streamId,
                timestamp:new Date(r?.startDateTime).getTime(),
                timestamp_seconds: Math.floor(new Date(r?.startDateTime).getTime()/1000),
            },
            ...r
        }
    }).filter(r=> r.timestamp > (new Date().getTime() - (86400000*61))); /*filteres to last 60 days of streams*/
    // console.log(parsed);
    return parsed;    
}


async function getRecentStreamsFromStreamCharts(params){/* get 20 recent streams from streamcharts */
    var {channel_login} = params;
    var res = await fetch(`https://streamscharts.com/channels/${channel_login}/streams`);
    var text = await res.text();
    var text_blocks = text.match(/<tr[\s\S\n]+?<\/tr>/gi);
    var rows = text_blocks?.[0] ? Array.from(text_blocks)?.map(html=> {
        let atag = /<a href="https:\/\/streamscharts.com\/channels\/\w+\/streams[\s\S\n]+?<\/a>/i.exec(html)?.[0];
        let thumbnail = /<img src="(.+?)"/.exec(html)?.[1];
        let date_str = /LIVE<\/span>([\s\S\n]+?\d)<\/span>/i.exec(atag)?.[1] ? /LIVE<\/span>([\s\S\n]+?\d)<\/span>/i.exec(atag)?.[1]?.trim() : /<span class="text-sm font-bold">([\s\S\n]+?)<\/span>/.exec(atag)?.[1]?.trim();
        let target_date = /\d{4},\s+\d{2}:\d{2}/.test(date_str) ? new Date(date_str) : getAmbuiousDate(date_str);
        let stream_start_timestamp = target_date.getTime() + (-(target_date.getTimezoneOffset()*60000));
        let spans = atag?.match(/<span[\s+\S+\n]+?<\/span>/gi) ? Array.from(atag.match(/<span[\s+\S+\n]+?<\/span>/gi)).map(span=> span?.replace(/<span[\s+\S+\n]+?>/,'').replace(/<\/span>/,'').trim()) : [];
        let duration = /([\d\sh]+\d+[mh])[\s\S\n]{0,325}?<div class="t_p">/i.exec(html)?.[1]?.trim();
        return cleanObject({
            stream_id:/https:\/\/streamscharts.com\/channels\/\w+\/streams\/(\d+)/.exec(atag)?.[1],
            title:spans?.at(-1),
            timestamp:stream_start_timestamp,
            timestamp_seconds:Math.floor(stream_start_timestamp/1000),
            channel_login:channel_login,
            stream_start_date: new Date(stream_start_timestamp),
            date_str:date_str,
            thumbnail_url:thumbnail,
            duration:duration,
        })
    })?.filter(r=> r.stream_id) : [];
    return rows;
}



async function getAvailableVODinfo(params){/* retrieves the most recent available vods (up to 75)*/
    var {device_id,client_id,oauth,vod_id,channel_login} = params;
    let res = await fetch("https://gql.twitch.tv/gql", {
        "headers": {
          "accept": "*/*",
          "accept-language": "en-US",
          "authorization": oauth,
          "client-id": client_id,
          "content-type": "text/plain;charset=UTF-8",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "x-device-id": device_id,
        },
        "referrer": "https://www.twitch.tv/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": `[{\"operationName\":\"FilterableVideoTower_Videos\",\"variables\":{\"limit\":75,\"channelOwnerLogin\":\"${channel_login}\",\"broadcastType\":\"ARCHIVE\",\"videoSort\":\"TIME\"},\"extensions\":{\"persistedQuery\":{\"version\":1,\"sha256Hash\":\"a937f1d22e269e39a03b509f65a7490f9fc247d7f83d6ac1421523e3b68042cb\"}}}]`,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    });
    var d = await res.json()
    // console.log(d);
    let vods = d?.[0]?.data?.user?.videos?.edges?.map(r=> {
        let m3u8_path = /\w+\.cloudfront.net\/\w{20}_\w+_\d+_\d+(?=\/)/.exec(r?.node?.animatedPreviewURL)?.[0];
        let m3u8_tokens = (/(?<=\/)\w{20}_\w+_\d+_\d+(?=\/)/.exec(r?.node?.previewThumbnailURL)?.[0] || /(?<=\/)\w{20}_\w+_\d+_\d+(?=\/)/.exec(r?.node?.animatedPreviewURL)?.[0])?.split(/_/);
        let m3u8_server = /\w+(?=\.cloudfront.net\/\w{20}_\w+_\d+_\d+\/)/.exec(r?.node?.animatedPreviewURL)?.[0];
        return {
            vod_id:r.node?.id,
            timestamp:r.node?.publishedAt ? new Date(r.node?.publishedAt).getTime() : m3u8_tokens[3] ? m3u8_tokens[3] * 1000 : null,
            published_at:r.node?.publishedAt,
            title:r.node?.title,
            seconds:r.node?.lengthSeconds,
            animated_preview_url:r?.node?.animatedPreviewURL,
            view_count:r?.node?.viewCount,
            preview_url:r?.node?.previewThumbnailURL,
            m3u8_path:m3u8_path,
            m3u8_tokens:m3u8_tokens,
            stream_id: m3u8_tokens[2],
            hash: m3u8_tokens[0],
            stream_start_seconds: m3u8_tokens[3],
            m3u8_server:m3u8_server,
            midpath:`${m3u8_tokens[0]}_${channel_login}_${m3u8_tokens[2]}_${m3u8_tokens[3]}`,
            channel_login:channel_login
        }
    });
    return vods;
}

async function fetchStreamGuesses(params){
    var {extendby,stream_id,timestamp,channel_login,end_path} = params;
// console.log(['fetchStreamGuesses',params])
    // var data; 
    var server_ids = ['d2vjef5jvl6bfs', 'd1ymi26ma8va5x', 'd2e2de1etea730', 'dqrpb9wgowsf5', 'ds0h3roq6wcgc', 'd2nvs31859zcd8', 'd2aba1wr3818hz', 'd3c27h4odz752x', 'dgeft87wbj63p', 'd1m7jfoe9zdc1j', 'd3vd9lfkzbru3h', 'd1mhjrowxxagfy', 'ddacn6pr5v0tl', 'd3aqoihi2n8ty8'];
    // console.log(Array(Math.abs(extendby)).fill().map((_,i)=> extendby > 0 ? (i+1) : i+extendby));

    let biglist = extendby ? Array(Math.abs(extendby)).fill().map((_,i)=> extendby > 0 ? i : i+extendby)
    .map(i=> {
        var seconds = Math.floor(timestamp/1000) + i;
        let hash = SHA1(`${channel_login}_${stream_id}_${seconds}`).slice(0,20);
        return server_ids.map(id=> 
            `https://${id}.cloudfront.net/${hash}_${channel_login}_${stream_id}_${seconds}/chunked/${end_path ? end_path : 'index-dvr'}.m3u8`);
    }) : server_ids.map(id=>
        `https://${id}.cloudfront.net/${(SHA1(`${channel_login}_${stream_id}_${Math.floor(timestamp/1000)}`).slice(0,20))}_${channel_login}_${stream_id}_${Math.floor(timestamp/1000)}/chunked/${end_path ? end_path : 'index-dvr'}.m3u8`);
    let bulk_url_list = biglist.flat().flat();
    let chunked = subArr(bulk_url_list,40);
    // console.log(bulk_url_list)
    return await chunkedFetch(chunked);
    // return data;
}
async function chunkedFetch(chunked){
    // console.log(chunked);
    var data = {};
    for(let i=0; i<chunked.length; i++){
        let check_listed = await fetchTexts(chunked[i]);
        let filtered = check_listed?.filter(r=> /[\d\.]+,\n\d+(-\w+|\b)\.ts/.test(r.text))
        if(filtered?.[0]) {
            data = {
                ...parseTsfileInformation(filtered?.[0]?.text),
                ...{url:filtered?.[0].url}
            }
            if(data?.url){ break; }
        }
    }
    return data;
}
async function getStreamDetailsFromStreamId(params){
    var check1 = await fetchStreamGuesses({...params,...{extendby:0}});
    if(check1?.url) return check1;
    var check2 = await fetchStreamGuesses({...params,...{extendby:61}}); 
    if(check2?.url) return check2;
    var check3 = await fetchStreamGuesses({...params,...{extendby:-61}}); 
    if(check3?.url) return check3;
    // var check4 = await fetchStreamGuesses({...params,...{timestamp:(params.timestamp-60000),extendby:-60}}); 
    // if(check4?.url) return check4;
    // var check5 = await fetchStreamGuesses({...params,...{timestamp:(params.timestamp+60000),extendby:+60}}); 
    // if(check5?.url) return check5;
    else return null;
}

async function getStreamDetailsFromVODdetails(params){
    var {m3u8_server,m3u8_path,midpath,end_path} = params
    let server_ids = ['d2vjef5jvl6bfs', 'd1ymi26ma8va5x', 'd2e2de1etea730', 'dqrpb9wgowsf5', 'ds0h3roq6wcgc', 'd2nvs31859zcd8', 'd2aba1wr3818hz', 'd3c27h4odz752x', 'dgeft87wbj63p', 'd1m7jfoe9zdc1j', 'd3vd9lfkzbru3h', 'd1mhjrowxxagfy', 'ddacn6pr5v0tl', 'd3aqoihi2n8ty8'].filter(id=> id != m3u8_server);
    let check_listed = await fetchTexts([`https://${m3u8_path}/chunked/${end_path ? end_path : 'index-dvr'}.m3u8`])
    let filtered = check_listed?.filter(r=> /[\d\.]+,\n\d+(-\w+|\b)\.ts/.test(r.text))
    if(filtered?.[0]) {
        return {
            ...parseTsfileInformation(filtered?.[0]?.text),
            ...{url:filtered?.[0].url}
        }
    }else{
        let check_all = await fetchTexts(server_ids.map(id=> `https://${id}.cloudfront.net/${midpath}/chunked/${end_path ? end_path : 'index-dvr'}.m3u8`));
        let identified = check_all?.filter(r=> /[\d\.]+,\n\d+(-\w+|\b)\.ts/.test(r.text));
        if(identified?.[0]){
            return {
                ...parseTsfileInformation(identified?.[0]?.text),
                ...{url:identified?.[0].url}
            }
        }
    }

}

function parseTsfileInformation(text){
    let fragments = text.match(/[\d\.]+,\n\d+(-\w+|\b)\.ts/g)?.[0] ? Array.from(text.match(/[\d\.]+,\n\d+(-\w+|\b)\.ts/g)).map(r=> {
        return {
            i:/(\d+)[\.-\w]+ts/.exec(r)?.[1],
            path:/\d+[\.-\w]+ts/.exec(r)?.[0],
            s:/[\d\.]+/.exec(r)?.[0] ? parseFloat(/[\d\.]+/.exec(r)?.[0]) : 0
        }
    }) : [];
    // console.log(fragments)
    return {
        total_seconds:/(?<=TOTAL-SECS:)[\d\.]+/.test(text) ? parseFloat(/(?<=TOTAL-SECS:)[\d\.]+/.exec(text)?.[0]) : 0,
        fragments:fragments,
        head_text:/^[\s\S\n]+?TOTAL-SECS:/.exec(text)?.[0],
        foot_text:/#EXT-X-ENDLIST[\s\S\n]+/.exec(text)?.[0],
    }
}

async function getValidResolutions(params){
    var {url} = params;
    // var res_opts = ['1080', '864', '810', '720', '648', '616', '540', '480', '432', '392', '360', '160'].map(r=> {
    //     let fps = ['10','20','24','25','29.97','30','48','50','59.94','60'].reverse()
    //     return fps.map(f=> `${r}p${f}`)
    // }).flat();
    var res_opts = ['1080', '864', '810', '720', '648', '616', '540', '480', '432', '392', '360', '160'].map(r=> {
        let fps = ['24','30','48','50','60'].reverse()
        return fps.map(f=> `${r}p${f}`)
    }).flat();
    // "1080p60","864p60","810p60","720p60","720p30","648p60","616p60","540p60","480p30","432p60","432p30","392p60","392p30","360p30","160p30",
    var options = [...["chunked"],...res_opts,...["audio_only"]].map(opt=> {
            // let end_path = //.exec(url)?.[0];
            return url.replace(/\/\w+\/(?=[\w\d-]+.m3u8)/,`/${opt}/`)
        });
    let responses = await fetchTexts(options);
    let mapped = responses.map(opt=> {
        return {
            is_valid: /[\d\.]+,\n\d+(-\w+|\b)\.ts/.test(opt.text),
            key:/\w+(?=\/[\w\d-]+\.m3u8)/.exec(opt.url)?.[0],
            url:opt.url,
        }
    }).filter(opt=> opt.is_valid).map(opt=> {return {[opt.key]:opt.url}})
    // console.log(['getvalidres',mapped?.length ? mapped.reduce((a,b)=> {return {...a,...b}}) : null])
    return mapped?.length ? mapped.reduce((a,b)=> {return {...a,...b}}) : null;
}

async function getTSFilesFromM3u8(params){
    let res = await fetchTexts([params.url]);
    return parseTsfileInformation(res?.[0]?.text);
}


function getTimestampFromDDMMYYTime(date_str){
    // console.log(['date_str',date_str]);
    let ddmmyytttt = /(\d{2})-(\d{2})-(\d{4})\s+(\d{2}:\d.+)/.exec(date_str);
    let timestamp = new Date(`${ddmmyytttt[3]}-${ddmmyytttt[2]}-${ddmmyytttt[1]} ${ddmmyytttt[4]}`).getTime();
    // return timestamp
    // console.log(['ddmmyytttt',ddmmyytttt]);
    return timestamp + (-(new Date(`${ddmmyytttt[3]}-${ddmmyytttt[2]}-${ddmmyytttt[1]} ${ddmmyytttt[4]}`).getTimezoneOffset()*60000))
}

async function getExactStreamStartTimeFromStreamchart(params){
    var {channel_login,stream_id} = params;
    var res = await fetch(`https://streamscharts.com/channels/${channel_login}/streams/${stream_id}`);
    var text = await res.text();
    var date_str = /<time[\s\S]+?datetime="(.+?)"/i.exec(text)?.[1];
    var titles = tryJSON(/Status&quot;.+?data&quot;:(\[{.+?\}\])/.exec(text)?.[1]?.replace(/&quot;/g,'"'))?.filter(r=> r.value)?.map(r=> r.value);
    // console.log(['titles',titles])
    if(!date_str){
        return await twitchtrackerDateFallback(params);
    }else{
        return {titles:titles,timestamp:getTimestampFromDDMMYYTime(date_str)};
    }
    // console.log(['getTimestampFromDDMMYYTime(date_str)',getTimestampFromDDMMYYTime(date_str)])
    
}

async function twitchtrackerDateFallback(params){
    var {channel_login,stream_id} = params;
    var milsec_offset = ()=> (-(new Date().getTimezoneOffset())) * 60000;
    var res = await fetch(`https://twitchtracker.com/${channel_login}/streams/${stream_id}`);
    var text = await res.text();
    var match_str = /stream-timestamp-dt.+?<\//i.exec(text)?.[0];
    var date_str = /(?<=>).+?(?=<)/.exec(match_str)?.[0]?.trim();
    // console.log(['date_str',date_str])
    var timestamp = new Date(date_str).getTime() + milsec_offset();
    // console.log([new Date(timestamp),timestamp]);
    return {titles:[],timestamp:timestamp};
    
}

// async fuy
// stream-timestamp-dt
function getAmbuiousDate(date_string){
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var now = new Date();
    var now_year = now.getFullYear(), now_month_index = now.getMonth();
    let now_month = months[now_month_index];
    let target_month_index = months.findIndex(m=> new RegExp(m,'i').test(date_string));
    let target_month = months[target_month_index];
    if(now_month == 'Jan' && target_month_index > now_month_index){
        return new Date(`${date_string?.replace(/,/, ' '+(now_year-1)+',')}`)
    }else{
        return new Date(`${date_string?.replace(/,/, ' '+(now_year)+',')}`)
    }
}


async function vodChatExtractionAPI(params){
    // console.log('vodChatExtractionAPI',params)
    var {token_params,cursor,offset_seconds,vod_id} = params;
    var {oauth, client_id, api_token, device_id} = token_params;
    // console.log(content_offset_seconds)
    var res = await
    fetch("https://gql.twitch.tv/gql", {
    "headers": {
        "accept": "*/*",
        "accept-language": "en-US",
        "authorization": oauth,
        "client-id": client_id,
        "content-type": "text/plain;charset=UTF-8",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site"
    },
    "referrer": "https://www.twitch.tv/",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": `[{\"operationName\":\"VideoCommentsByOffsetOrCursor\",\"variables\":{\"videoID\":\"${vod_id}\",${offset_seconds ? '\"contentOffsetSeconds\":'+(offset_seconds-1) : '\"contentOffsetSeconds\":0'}},\"extensions\":{\"persistedQuery\":{\"version\":1,\"sha256Hash\":\"b70a3591ff0f4e0313d126c6a1502d79a1c02baebb288227c582044aa76adf6a\"}}},{\"operationName\":\"VideoCommentsByOffsetOrCursor\",\"variables\":{\"videoID\":\"${vod_id}\",${offset_seconds && cursor ? '\"cursor\":\"'+cursor+'\"' : '\"contentOffsetSeconds\":0'}},\"extensions\":{\"persistedQuery\":{\"version\":1,\"sha256Hash\":\"b70a3591ff0f4e0313d126c6a1502d79a1c02baebb288227c582044aa76adf6a\"}}}]`,
    // "body": `[{\"operationName\":\"VideoCommentsByOffsetOrCursor\",\"variables\":{\"videoID\":\"${vod_id}\",${cursor ? '\"cursor\":\"'+cursor+'\"' : '\"contentOffsetSeconds\":0'}},\"extensions\":{\"persistedQuery\":{\"version\":1,\"sha256Hash\":\"b70a3591ff0f4e0313d126c6a1502d79a1c02baebb288227c582044aa76adf6a\"}}}]`,
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
    });
    // console.log(d);
    var d = await res.json();
    // console.log(d);
    return d;
}


async function channelVideoCore(params){
    var {video_id, oauth, client_id, api_token, device_id, channel_login} = params;
    var res = await fetch("https://gql.twitch.tv/gql", {
    "headers": {
        "accept": "*/*",
        "accept-language": "en-US",
        "authorization": oauth,
        "client-id": client_id,
        "content-type": "text/plain;charset=UTF-8",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
    },
    "referrer": "https://www.twitch.tv/",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": `{\"operationName\":\"ChannelVideoCore\",\"variables\":{\"videoID\":\"${video_id}\"},\"extensions\":{\"persistedQuery\":{\"version\":1,\"sha256Hash\":\"cf1ccf6f5b94c94d662efec5223dfb260c9f8bf053239a76125a58118769e8e2\"}}}`,
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
    });
    var d = await res.json();
    return {
        vod_id:d?.data?.video?.id,
        channel_login:d?.data?.video?.owner?.login,
        channel_id:d?.data?.video?.owner?.id,
        stream_id:d?.data?.video?.owner?.stream?.id,
        stream_view_count:d?.data?.video?.owner?.stream?.viewersCount,
    }
}
async function vodInfo(params){
    var {vod_id, oauth, client_id, api_token, device_id, channel_login} = params; //vod_id was video_id
    var res = await fetch("https://gql.twitch.tv/gql", {
    "headers": {
        "accept": "*/*",
        "accept-language": "en-US",
        "authorization": oauth,
        "client-id": client_id,
        "content-type": "text/plain;charset=UTF-8",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site"
    },
    "referrer": "https://www.twitch.tv/",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": `{\"operationName\":\"FilterableVideoTower_Videos\",\"variables\":{\"limit\":75,\"channelOwnerLogin\":\"${channel_login}\",\"broadcastType\":\"ARCHIVE\",\"videoSort\":\"TIME\"},\"extensions\":{\"persistedQuery\":{\"version\":1,\"sha256Hash\":\"a937f1d22e269e39a03b509f65a7490f9fc247d7f83d6ac1421523e3b68042cb\"}}}`,
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
  });  
    var d = await res.json();
    let vods = d?.data?.user?.videos?.edges?.map(r=> {
        let m3u8_path = /\w+\.cloudfront.net\/\w{20}_\w+_\d+_\d+(?=\/)/.exec(r?.node?.animatedPreviewURL)?.[0];
        let m3u8_tokens = (/(?<=\/)\w{20}_\w+_\d+_\d+(?=\/)/.exec(r?.node?.previewThumbnailURL)?.[0] || /(?<=\/)\w{20}_\w+_\d+_\d+(?=\/)/.exec(r?.node?.animatedPreviewURL)?.[0])?.split(/_/);
        let m3u8_server = /\w+(?=\.cloudfront.net\/\w{20}_\w+_\d+_\d+\/)/.exec(r?.node?.animatedPreviewURL)?.[0];
        return {
            vod_id:r.node?.id,
            timestamp:m3u8_tokens[3] ? m3u8_tokens[3] * 1000 : new Date(r.node?.publishedAt).getTime(),
            published_at:r.node?.publishedAt,
            title:r.node?.title,
            seconds:r.node?.lengthSeconds,
            duration:r.node?.lengthSeconds,
            animated_preview_url:r?.node?.animatedPreviewURL,
            view_count:r?.node?.viewCount,
            preview_url:r?.node?.previewThumbnailURL,
            m3u8_path:m3u8_path,
            m3u8_tokens:m3u8_tokens,
            stream_id: m3u8_tokens[2],
            hash: m3u8_tokens[0],
            stream_start_seconds: m3u8_tokens[3],
            m3u8_server:m3u8_server,
            midpath:`${m3u8_tokens[0]}_${channel_login}_${m3u8_tokens[2]}_${m3u8_tokens[3]}`,
            channel_login:channel_login
        }
    })?.filter(r=> r.vod_id == vod_id)?.[0]; //was video_id
    return vods;
}

async function getCurrentStreamInfo(params){
    var {client_id,oauth,device_id,channel_login} = params;
    var res = await fetch("https://gql.twitch.tv/gql", {
        "headers": {
          "accept": "*/*",
          "accept-language": "en-US",
          "authorization": oauth,
          "client-id": client_id,
          "content-type": "text/plain;charset=UTF-8",
          "sec-ch-ua-mobile": "?0",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "x-device-id": device_id
        },
        "referrer": "https://www.twitch.tv/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": `[{\"operationName\":\"ChannelVideoLength\",\"variables\":{\"channelLogin\":\"${channel_login}\"},\"extensions\":{\"persistedQuery\":{\"version\":1,\"sha256Hash\":\"ac644fafd686f2cb0e3864075af7cf3bb33f4e0525bf84921b10eabaa4e048b5\"}}}]`,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
      });
    var d = await res.json();
    var video_id = d?.[0]?.data?.user?.videos?.edges?.map(i=> i?.node?.id)?.[0];
    // console.log(video_id);
    return video_id;
}