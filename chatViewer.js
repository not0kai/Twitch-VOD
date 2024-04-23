async function initChat(params){
    var {video_elm,stream_info,stream_duration,msg_cont} = params;


    function clearAllMessages(){
        if(msg_cont) {
            Array.from(tn(msg_cont,'p')).forEach(chat=> {            chat.remove()        });
        }
    }
    function removeSiteEntryChats(){
        let site_entry_chats= Array.from(tn(msg_cont,'p'));        
        if(site_entry_chats?.length) {
            let not_gen = site_entry_chats.filter(p=> p.className != 'stream-chat-message-container');
            not_gen.forEach(chat=> {            chat.remove()        })
        }
    }    
    var token_params = getTokensFromCookies();
    var messages = [];
    
    // console.log('initChat',token_params)
    // async function downloadAllChats(params){
    //     // console.log('downloadAllChats',params)
    //     var next_cursor = '';
    //     var next_offset = 0;
    //     var total_duration = Math.floor(params?.total_seconds)
    //     // console.log('Math.ceil(params?.total_seconds);',Math.ceil(params?.total_seconds))
    //     for(let i=0; i<total_duration; i++){
    //         let msgs = await getChatMessages({...{token_params:token_params,cursor:next_cursor,offset_seconds:next_offset},...params});
    //         next_cursor = msgs.at(-1).cursor;
    //         next_offset = msgs.at(-1).offset_seconds;
    //         // console.log(i);
    //         messages = unqKey([...messages,...msgs],'id');
    //         if(!msgs?.at(-1).has_next_page){
    //             break;
    //         }
    //     }
    //     // console.log(messages);
    // }
    // downloadAllChats(stream_info);


    function getRecentMessagesInMemory(){
        var msgs = messages.filter(m=> Math.ceil(m.offset_seconds) <= Math.ceil(video_elm?.currentTime))
        return msgs.reverse().slice(0,50).reverse();
    }
    
    async function addRecentMessages(){
        // console.log('addRecentMessages')
        var current_time = Math.floor(video_elm?.currentTime);
        var target_offset = current_time < 1300 ? 0 : (current_time - 1300);
        var msgs = getRecentMessagesInMemory();
        if(msgs.length){
            await delay(1000);
            clearAllMessages();
            addMessagesToDOM(msgs);
        }else{
            var msgs = await getChatMessages({...params,...stream_info,...{token_params:token_params,offset_seconds:target_offset}});
            messages = unqKey([...messages,...msgs],'id').sort((a,b)=> a.timestamp < b.timestamp ? -1 : 0).reverse().slice(0,350).reverse();
            // console.log(messages)
            let recents = messages.filter(m=> Math.ceil(m.offset_seconds) <= Math.ceil(video_elm?.currentTime)).reverse().slice(0,50).reverse()
            clearAllMessages();
            addMessagesToDOM(recents);
            // console.log('recents',recents)
        }
    }
// 
    async function altRecentMessages(){
        var current_time = Math.floor(video_elm?.currentTime-1);
        var msgs = await getChatMessages({...params,...stream_info,...{token_params:token_params,offset_seconds:current_time}});
        messages = unqKey([...messages,...msgs],'id').sort((a,b)=> a.timestamp < b.timestamp ? -1 : 0).reverse().slice(0,350).reverse();
        let recents = messages.filter(m=> Math.ceil(m.offset_seconds) <= Math.ceil(video_elm?.currentTime)).reverse().slice(0,50).reverse()
        // clearAllMessages();
        addMessagesToDOM(recents);
    }

    var last_vod_time = Math.floor(video_elm.currentTime);

    async function updateMesages(){
        let newmsgs = messages.filter(m=> Math.floor(m.offset_seconds) == Math.floor(video_elm.currentTime));
        if(newmsgs.length){
            // console.log(newmsgs);
            addMessagesToDOM(newmsgs);
        }else{
            if(Math.floor(video_elm.currentTime) != last_vod_time){
                altRecentMessages();
                last_vod_time = Math.floor(video_elm.currentTime)
            }
        }
    }

    
// console.log('video_elm',video_elm)
    video_elm.onplay = async ()=>{
        await delay(1000);
        await addRecentMessages();
    }

    // video_elm.ontimeupdate = updateMesages;
    video_elm.addEventListener('timeupdate',updateMesages)
    video_elm.onseeked = addRecentMessages;





    async function addMessagesToDOM(msgs){
        // console.log('addMessagesToDOM',msgs);
        // var current_ts_ms = Math.ceil(video_elm?.currentTime * 1000);

        
        removeSiteEntryChats();

        // console.log(msgs)
        let new_chats = msgs.filter(msg=> ((msg.offset_seconds)-1) < video_elm.currentTime);
        // console.log(['new_chats',new_chats])
        
        new_chats.filter(m=> m.commenter_display_name).forEach(m=> {
            // console.log(gi(document,m.user_info?.id));
            // console.log(m.user_info?.id);
            var chats = Array.from(document.getElementsByClassName('stream-chat-message-container'));
            if(chats.length > 350){
                chats[0].remove();
            }
            if(!gi(document,m.id)){
                let p = ele('p');
                a(p,[['id',`${m.id}`],['class','stream-chat-message-container'],['data-offset_seconds', m.offset_seconds]]);
                inlineStyler(p,`{opacity: 1; transition: opacity 0.25s ease-in-out 0s;}`);
                msg_cont.appendChild(p)
    
                let timesent = ele('span');
                p.appendChild(timesent);
                inlineStyler(timesent,`{margin-top: 50%; font-size:0.66em; cursor:pointer; color:#dbdbdb; border:2px solid transparent;}`);
                a(timesent,[['data-video_offset',Math.floor(m.offset_seconds)]]);
                timesent.innerText = parseTimeOffsetColon(m.offset_seconds);
                timesent.onclick = async ()=> {
                    video_elm.currentTime = Math.floor(m.offset_seconds);
                    await delay(333);
                    addRecentMessages();
                }
    
                if(/moderator/.test(m.is_mod)){
                    let badge = ele('span');
                    a(badge,[['class','stream-chat-badge']]);
                    p.appendChild(badge);
                    let img = ele('img');
                    a(img,[['src','https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/1']]);
                    inlineStyler(img,`{background-size: contain; background-repeat: no-repeat; background-position: center center; margin-right: 0.25rem; display: inline-block; vertical-align: middle; border-radius: 4px; border: 1px solid rgb(101, 75, 123); box-shadow: rgb(101, 75, 123) 0px 0px 0px 1px;}`);
                    badge.appendChild(img);
                }
            
                let usera = ele('a');
                p.appendChild(usera);
                a(usera,[['href',`https://twitch.tv/${m.commenter_display_name.toLowerCase()}`],['target',"_blank"],['class',"stream-chat-username-link"]]);
                let username = ele('span');
                usera.appendChild(username);
                a(username,[['class',"stream-chat-username"]]);
                inlineStyler(username,`{color: ${m.commenter_color ? m.commenter_color: 'rgb(168, 113, 73)'};}`);
                username.innerText = m.commenter_display_name;
    
                let msg_divider = ele('span');
                p.appendChild(msg_divider);
                a(msg_divider,[['class',"stream-chat-divider"]]);
                inlineStyler(msg_divider,`{color:#ffffff;}`);
                msg_divider.innerText = `: `;
                
                let msg = ele('span');
                p.appendChild(msg);
                a(msg,[['class',"stream-chat-message"]]);
                msg.innerHTML =`${m.message_body?.replace(/http(s|):\/\/\S+|\w+\.\b(co|io|net|org|biz|news|tv)\S*/g,url=> '<a href="'+url+'">'+/\w+\.\b\S*?(?=\?|$)/.exec(url)?.[0]+'</a>')}`;
                p.scrollIntoView();
            }
        })        
    }
}



function parseTimeOffsetColon(s){
    // offset_seconds: 1427.737
    const timeString = (n,k)=> `${n >= 1 && n < 10 ? '0'+n.toString() : n >= 10 && n >= 1 ? n : '00'}${k}`;
    let hours = (s/3600);
    let minutes = hours.toString().replace(/\d+(?=\.)/,'');
    let seconds = 60 * parseFloat(minutes);
    let time_arr = [
        Math.floor(hours),
        Math.floor(60 * minutes),
        Math.floor(60*seconds.toString().replace(/\d+(?=\.)/,''))
    ];
    return `${timeString(time_arr[0],':')}${timeString((time_arr[1] >= 60 ? 0 : time_arr[1]),':')}${timeString((time_arr[2] >= 60 ? 0 : time_arr[2]),'')}`;
}//new version. 24 Aug 2023.-AndreB

function jsonify(str){
    let matches = str.replace(/\{|\}/g,'').match(/'[\w-]+':.+?,\s+|'[\w-]+':.+?$/g);
    return matches?.length ? matches.map(m=> m.split(/':\s/)).map(kv=> {
        return {
            [kv[0]?.trim()?.replace(/^'/,'').replace(/-/g,'_')]:kv[1]?.trim()?.replace(/,$/,'')?.replace(/^'|'$/g,'')
        }
    }).reduce((a,b)=> {return {...a,...b}}) : []
}


async function getChatMessages(params){
    var chat_messages = await requestFromBackground({
        cmd: 'vodChatExtractionAPI',
        token_params: params?.token_params,
        cursor: params?.cursor,
        offset_seconds:params?.offset_seconds,
        vod_id:params?.vod_id,
    });
    // console.log('getChatMessages',chat_messages)
    // parseChatMessages(chat_messages,params?.vod_id);

    let comments = [...parseChatMessages(chat_messages?.[1],params?.vod_id),...parseChatMessages(chat_messages?.[0],params?.vod_id)];
    // console.log(comments);
    return unqKey(comments?.filter(r=> r.message_body),'id');
}

function parseChatMessages(d,vod_id){
    let has_next_page = d?.data?.video?.comments?.pageInfo?.hasNextPage;
    return d?.data?.video?.comments?.edges?.length ? d?.data?.video?.comments?.edges?.map(r=> {
        return {
            ...{
                cursor:r?.cursor,
                message_body:r.node?.message?.fragments?.map(m=> m.text)?.length ? r.node?.message?.fragments?.map(m=> m.text).reduce((a,b)=> a+' '+b) : '',
                id: r?.node?.id,
                vod_id: vod_id,
                offset_seconds: r?.node?.contentOffsetSeconds,
                // type: r?.node?.__typename,
                created_at: r?.node?.createdAt,
                timestamp: new Date(r?.node?.createdAt).getTime(),
                // updated_at: r?.node?.updatedAt,
                video_offset_link: `https://www.twitch.tv/videos/${vod_id}?t=${parseTimeOffsetColon(r.node?.contentOffsetSeconds)}`,
                commenter_color:r?.node?.message?.userColor,
                commenter_display_name: r?.node?.commenter?.displayName,
                commenter_id: r?.node?.commenter?.id,
                has_next_page:has_next_page,
            },
        }
    }) : [];
}



async function initChatViewerApp(params){
    var {msg_cont} = params;
    let vod_viewer_elm_cont = document.getElementById('video_viewer_cont');
    let stream_info = atobJSON(vod_viewer_elm_cont.getAttribute('data-stream-btoa'));
    // console.log('initChatViewerApp',stream_info);
    
    initChat({
        msg_cont:msg_cont,
        stream_info:stream_info,
        video_elm: vod_viewer_elm_cont.getElementsByTagName('video')?.[0],
        stream_duration:vod_viewer_elm_cont.getElementsByTagName('video')?.[0],
    })
}

function getTokensFromCookies(){
    var c = document.cookie;
    return {
        video_id: /twitch\.tv\/videos\/(\d+)/.exec(window.location.href)?.[1],
        api_token: /(?<=api_token\=).+?(?=;)/.exec(c)?.[0], 
        device_id: /(?<=unique_id\=).+?(?=;)/.exec(c)?.[0],
        oauth: /(?<=%22authToken%22:%22).+?(?=%22)/.exec(c)?.[0] ? 'OAuth ' + /(?<=%22authToken%22:%22).+?(?=%22)/.exec(c)?.[0] : '',
        client_id: /(?<="Client-ID":"|clientId=").+?(?=")/.exec(Array.from(document.getElementsByTagName('script'))?.filter(i=> /(?<="Client-ID":"|clientId=").+?(?=")/.test(i.innerHTML))?.[0].innerHTML)?.[0],
        channel_login: /(?<=tv\/)\w+/.exec(document.getElementsByClassName('channel-info-content')?.[0]?.getElementsByTagName('a')?.[1]?.href)?.[0],
    };
}

function buildChatContainer(){
    if (gi(document, 'chat-message-cont')) gi(document, 'chat-message-cont').outerHTML = '';
    var cont = ele('div');
    a(cont, [['id', 'chat-message-cont']]);
    inlineStyler(cont, `{position: fixed; top: 0px; height: ${(window.innerHeight * 0.8)}px; width: ${window.innerWidth/3}px; left:${window.innerWidth/2}px; z-index: ${topZIndexer()}; background: ${head_color}; border-radius: 0.4em; border: 2px solid ${purple_2};}`);
    document.body.appendChild(cont);
    cont.onmouseover = topIndexHover;

    let header = document.createElement('div');
    cont.appendChild(header);
    inlineStyler(header, `{padding: 4px; display: grid; grid-template-columns: 28px 1fr; grid-gap:8px; background: linear-gradient(to top left, transparent, transparent, transparent, ${purple_2}); user-select: none;}`);

    let cls_btn = document.createElement('div');
    cls_btn.innerHTML = icons.close;
    header.appendChild(cls_btn);
    inlineStyler(cls_btn, `{transform: translate(0px,2px) scale(1.4,1.4); cursor: pointer;}`);
    cls_btn.onclick = ()=>{        cont.remove();    };

    let mover = document.createElement('div');
    inlineStyler(mover, `{text-align: center; cursor: move; padding:4px; font-size:1.2em;}`);
    header.appendChild(mover);
    mover.onmouseover = dragElement;
    // var vod_viewer_elm_cont = document.getElementById('video_viewer_cont');
    // var info = atobJSON(vod_viewer_elm_cont.getAttribute('data-stream-btoa'));
    // mover.innerText = `Chat from ${info?.timestamp ? dateString(info?.timestamp) : info?.channel_login}`;
    mover.innerText = `Chat History`;

    let tbody = document.createElement('div');
    cont.appendChild(tbody);
    let tbod_offset = -((header.getBoundingClientRect().height+16));
    // console.log(['tbod_offset',tbod_offset]);
    a(tbody, [['id', 'stream-chat-messages'],['data-css',btoaJSON({height:tbod_offset,width:-4})]]);
    inlineStyler(tbody, `{padding: 0px; height:${(window.innerHeight * 0.8) + tbod_offset}px; overflow:auto;}`);

    let footer = ele('div');
    cont.appendChild(footer);
    inlineStyler(footer, `{display:grid; grid-template-columns:1fr 12px; grid-gap:0px; background: linear-gradient(to bottom right, transparent, transparent, transparent, ${purple_2}); user-select: none;}`);
    // let titles = original_title || title ? unqHsh([original_title,title].filter(t=> t),{}).reduce((a,b)=> a+'<br>'+b) : '';
    let footer_label = ele('div');
    inlineStyler(footer_label, `{cursor:move; text-align:center; width:100%; height: 12px;}`);
    footer.appendChild(footer_label);
    footer_label.onmouseover = dragElement;

    let foot_resizer = ele('div');
    a(foot_resizer,[['data-resize-id','chat-message-cont,stream-chat-messages'],['id','chat-message-foot_resizer']]);
    inlineStyler(foot_resizer,`{width:12px; height: 12px; cursor:nw-resize;}`)
    footer.appendChild(foot_resizer);
    foot_resizer.innerHTML = icons.resize;
    foot_resizer.onmouseover = adjustElementSize;
    alignChatElmToVODElm();
    initChatViewerApp({
        msg_cont:tbody
    });
}
function alignChatElmToVODElm(){
    var chat_elm = document.getElementById('chat-message-cont');
    var vod_elm = document.getElementById('video_viewer_cont');
    var recent_streams_elm = document.getElementById('recent_streams_container');
    if(recent_streams_elm) inlineStyler(recent_streams_elm,`{top:${window.innerHeight*.88}px;}`);
    inlineStyler(chat_elm,`{top:0px;left:0px;width:${Math.floor(window.innerWidth*.33)}px;}`);
    inlineStyler(vod_elm,`{top:0px;left:${Math.floor(window.innerWidth*.33)}px;width:${Math.floor(window.innerWidth*.66)}px;}`);
    inlineStyler(vod_elm.getElementsByTagName('video')?.[0],`{width:${Math.floor(window.innerWidth*.66)-8}px;}`);
}


// initChat(params){
//     var {video_elm,stream_info,stream_duration,msg_cont}

// {
//     vod_id: "2022426018",
//     channel_login: "chudlogic",
//     timestamp: 1704371918000,
//     total_seconds: 32014.963,
// }
