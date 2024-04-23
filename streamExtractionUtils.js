const tokens = getTokensFromCookies();

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

var recent_streamscharts = {};
var recent_sully = {};
async function getRecentStreamChartsData(){
    createLoadingElement({id:'tt_vod_load', ref_elm:null, display_text:'getting recent stream data'});
    let channel_login = await getChannelLogin();
    if(channel_login){
        if(recent_streamscharts[channel_login]?.length) {
            return recent_streamscharts[channel_login];
        }else {
            var recent_streams = await requestFromBackground({cmd:'getRecentStreamsFromStreamCharts',params:{channel_login:channel_login}});
            recent_streamscharts[channel_login] = recent_streams;
            // console.log(['recent_streamscharts',recent_streamscharts])
            destroy('tt_vod_load');
            return recent_streamscharts[channel_login]
        }
    }
    else {destroy('tt_vod_load'); return null;}
}
async function getRecentSullyData(){
    createLoadingElement({id:'tt_vod_load', ref_elm:null, display_text:'getting recent stream data'});
    let channel_login = await getChannelLogin();
    if(channel_login){
        if(recent_sully[channel_login]?.length) {
            return recent_sully[channel_login];
        }else {
            var recent_streams = await requestFromBackground({cmd:'getSullyStreamsData',params:{channel_login:channel_login}});
            console.log(recent_streams);
            recent_sully[channel_login] = recent_streams;
            destroy('tt_vod_load');
            return recent_sully[channel_login]
        }
    }
    else {destroy('tt_vod_load'); return null;}
}

async function getStreamInformation(){ /*retrieves livestream infomation via gql UseLive request*/
    var channel_login = await getChannelLogin();
    return await requestFromBackground({
        cmd: 'getStreamInformation',
        params: {...tokens,...{channel_login: channel_login}}
    });
}
async function getAvailableVODinfo(){ /*retrieves recent VOD infomation via gql FilterableVideoTower_Videos request*/
    var channel_login = await getChannelLogin();
    return await requestFromBackground({
        cmd: 'getAvailableVODinfo',
        params: {...tokens,...{channel_login: channel_login}}
    });
}

async function getCurrentVODDetails(){
    let vod_id = /twitch\.tv\/videos\/(\d+)/.exec(window.location.href)?.[1];
    let recent_vods = await getAvailableVODinfo();
    // console.log(['recent_vods',recent_vods])
    return recent_vods?.filter(r=> r.vod_id == vod_id)?.[0];
}
async function getM3u8DetailsFromM3u8Link(url){
    createLoadingElement({id:'tt_vod_load', ref_elm:null, display_text:'extracting from server'});
    let stream_info = getParamsFromM3u8Link(url);
    let m3u8_data = await requestFromBackground({
        cmd:'getStreamDetailsFromStreamId',
        params:stream_info,
    });
    let recent_vods = await getAvailableVODinfo();
    var checked_nuked = markNukedStreams([stream_info],recent_vods);

    if(m3u8_data?.url){
        let valid_resolutions = await requestFromBackground({
            cmd: 'getValidResolutions',
            params: m3u8_data
        });
        destroy('tt_vod_load');
        console.log(valid_resolutions)
        return {
            ...{
                stream_id:stream_info?.stream_id,
                timestamp:stream_info?.timestamp,
                channel_login:stream_info?.channel_login,
                is_live:true
            },
            ...m3u8_data,
            ...{valid_resolutions:valid_resolutions},
            ...(checked_nuked?.[0]?.vod_id ? {vod_id:checked_nuked?.[0]?.vod_id} : {}),
        }
    }
    else {destroy('tt_vod_load'); return null;}
}

async function getM3u8DetailsFromCurrentLiveStream(){
    createLoadingElement({id:'tt_vod_load', ref_elm:null, display_text:'getting stream id'});
    var stream_info = await getStreamInformation();
    destroy('tt_vod_load');
    // let recent_vods = await getAvailableVODinfo();
    // var checked_nuked = markNukedStreams([stream_info],recent_vods);
    
    createLoadingElement({id:'tt_vod_load', ref_elm:null, display_text:'extracting from server'});
    let m3u8_data = await requestFromBackground({
        cmd:'getStreamDetailsFromStreamId',
        params:stream_info,
    });
    if(m3u8_data?.url){
        let valid_resolutions = await requestFromBackground({
            cmd: 'getValidResolutions',
            params: m3u8_data
        });
        destroy('tt_vod_load');
        return {
            ...{
                stream_id:stream_info?.stream_id,
                timestamp:stream_info?.timestamp,
                channel_login:stream_info?.channel_login,
                is_live:true
            },
            ...m3u8_data,
            ...{valid_resolutions:valid_resolutions},
            // ...(checked_nuked?.[0]?.vod_id ? {vod_id:checked_nuked?.[0]?.vod_id} : {}),
        }
    }
    else {destroy('tt_vod_load'); return null;}
}
async function getm3u8DetailsFromCurrentVODDetails(){
    createLoadingElement({id:'tt_vod_load', ref_elm:null, display_text:'getting stream id'});
    let current_vod_details = await getCurrentVODDetails();
    if(current_vod_details?.animated_preview_url){
        destroy('tt_vod_load');
        createLoadingElement({id:'tt_vod_load', ref_elm:null, display_text:'searching server for vod'});
        let m3u8_data = await requestFromBackground({
            cmd: 'getStreamDetailsFromVODdetails',
            params: current_vod_details
        });
        if(m3u8_data?.url){
            let valid_resolutions = await requestFromBackground({
                cmd: 'getValidResolutions',
                params: m3u8_data
            });
            destroy('tt_vod_load');
            return {
                ...m3u8_data,
                ...{valid_resolutions:valid_resolutions},
                ...(current_vod_details?.vod_id ? {vod_id:current_vod_details?.vod_id,channel_login:current_vod_details?.channel_login} : {}),
            }
        }
    }
}
async function getStreamDetailsFromStreamInfo(params){
    let m3u8_data = await requestFromBackground({
        cmd:'getStreamDetailsFromStreamId',
        params:params,
    });
    let recent_vods = await getAvailableVODinfo();
    var checked_nuked = markNukedStreams([params],recent_vods);
    if(m3u8_data?.url){
        let valid_resolutions = await requestFromBackground({
            cmd: 'getValidResolutions',
            params: m3u8_data
        });
        let stream_url_tokens = (/(?<=\/)\w{20}_\w+_\d+_\d+(?=\/)/.exec(m3u8_data?.url)?.[0] || /(?<=\/)\w{20}_\w+_\d+_\d+(?=\/)/.exec(m3u8_data?.url)?.[0])?.split(/_/);
        return {
            ...{
                stream_id:params?.stream_id,
                timestamp:stream_url_tokens[3],
                channel_login:params?.channel_login,
            },
            ...m3u8_data,
            ...{valid_resolutions:valid_resolutions},
            ...(checked_nuked?.[0]?.vod_id ? {vod_id:checked_nuked?.[0]?.vod_id} : {}),
        }
    }
    else return null;
}

async function getTSFilesFromM3u8(params){
    return await requestFromBackground({
        cmd: 'getTSFilesFromM3u8',
        params: params
    });
}



async function getVODfromTwitchTracker(params){
// console.log(['params',params])
    createLoadingElement({id:'tt_vod_load', ref_elm:null, display_text:'getting stream id'});
    let stream_info = await requestFromBackground({cmd:'getExactStreamStartTimeFromStreamchart',params:params});
    destroy('tt_vod_load');
// console.log(['stream_info',stream_info])
    createLoadingElement({id:'tt_vod_load', ref_elm:null, display_text:'checking vods'});
    let recent_vods = await requestFromBackground({cmd:'getAvailableVODinfo',params:{...params,...stream_info}});
// console.log(['recent_vods',recent_vods])
    let stream_information = markStreamFromVods({...params,...stream_info},recent_vods);
    createLoadingElement({id:'tt_vod_load', ref_elm:null, display_text:'Searching Twitch Server'});
    let stream_data = await getStreamDetailsFromStreamInfo(stream_information);
    destroy('tt_vod_load');
// console.log(['stream_data',stream_data])
    if(!stream_data) createLoadingElement({id:'failed_warning', ref_elm:null, display_text:`<div style="text-align:center;">sorry. VOD doesn't exist <br> on server. ¯\\_(ツ)_/¯</div>'`})
    return {...stream_data,...(params?.timestamp ? {timestamp:params?.timestamp} : {})};
}