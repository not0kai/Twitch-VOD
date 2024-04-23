var currentUrl = ()=> window.location.href;
var isTwitchtv = ()=> /twitch\.tv\//.test(currentUrl());
var isTwitctracker = ()=> /twitchtracker\.com/.test(currentUrl());


var better_twitch_page_change_monitor_object = {
    id: 'init_program_btn',
    fn: createInitProgramBtn,
    page_context: {
        href: window.location.href
    }
};
function monitorURLChangesVodClipper() {
    const url = window.location.href;
    let channel_login = /twitchtracker.com\/(\w+)\/streams\/(\d+)/.exec(currentUrl())?.[1];
    if(!document.getElementById('init_program_btn')){
        createInitProgramBtn()
    }
    if(url != better_twitch_page_change_monitor_object?.page_context?.href) createInitProgramBtn()
    if(channel_login && (!recent_streamscharts[channel_login] || !recent_streamscharts[channel_login]?.length)) getRecentStreamChartsData()
}
if (/twitch\.tv\b/.test(window.location.href)) {
    
    window.onload = ()=>{
        document.body.onmousemove = monitorURLChangesVodClipper;
        createInitProgramBtn()        
    }
}

async function runProgram(){
    let live_ps = Array.from(document.getElementsByTagName('main')?.[0].getElementsByTagName('p')).filter(p=> p.innerText == 'LIVE');
    if(/videos\/\d+/.test(window.location.href)) {
        let video_details = await getm3u8DetailsFromCurrentVODDetails();
        buildVideoViewer(video_details)
    }
    if(
        /twitch\.tv\/\w+/.test(currentUrl())
        &&
        !/twitch\.tv\/videos|twitch\.tv\/\w+\/videos/.test(currentUrl())
        &&
        live_ps?.length
    ){
        // console.log(currentUrl())
        let stream_details = await getM3u8DetailsFromCurrentLiveStream();
        buildVideoViewer(stream_details);
    }
        
}

