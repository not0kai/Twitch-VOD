function createInitProgramBtn(){
    if(!gi(document,'init_program_btn')){
        let nav = document.getElementsByTagName('nav')?.[0];
        let search_bar = nav?.getElementsByTagName('div')?.[0] ? Array.from(nav?.getElementsByTagName('div')).filter(i=>i.getAttribute('data-a-target') == "nav-search-box")?.[0]?.parentElement?.parentElement : [];
        let main_nav = document.getElementById('main-nav');
        let init_program_btn = ele('img');
        a(init_program_btn, [['src', icons.clip1], ['id', 'init_program_btn'],['title','click for menu']]);
        inlineStyler(init_program_btn, `{cursor:pointer; transform:scale(0.7,0.7) translate(5px,-1px);}`);
        if(isTwitchtv()) search_bar.parentElement.insertBefore(init_program_btn, search_bar);
        if(isTwitctracker()) main_nav.insertBefore(init_program_btn, main_nav.firstChild);
        init_program_btn.onclick = ()=> {
            if(!gi(document,'app_options_cont')) buildMenuOptions(init_program_btn)
        }
        // init_program_btn.onclick = initBtnClicked;
        init_program_btn.onmouseenter = ()=> a(init_program_btn,[['src',icons.clip2]])
        init_program_btn.onmouseleave = ()=> a(init_program_btn,[['src',icons.clip1]])
        // init_program_btn.onmouseover = ()=> {
        //     if(!gi(document,'app_options_cont')) buildMenuOptions(init_program_btn)
        // };
        // init_program_btn.ontouchstart = ()=> {
        //     if(!gi(document,'app_options_cont')) buildMenuOptions(init_program_btn)
        // };
    }
    if (/twitch\.tv\/videos\/\d+/.test(currentUrl())) {
        if(!gi(document,'skip_sub_only_vod')){
            subOnlyVodBtn()
        }
    }
}

// async function getClips(){
//     fetch("https://gql.twitch.tv/gql", {
//     "headers": {
//         "accept": "*/*",
//         "accept-language": "en-US",
//         "client-id": "kimne78kx3ncx6brgo4mv6wki5h1ko",
//         "client-integrity": "v4.public.eyJjbGllbnRfaWQiOiJraW1uZTc4a3gzbmN4NmJyZ280bXY2d2tpNWgxa28iLCJjbGllbnRfaXAiOiI2OC41NC4yMDYuOTUiLCJkZXZpY2VfaWQiOiJoUWNVazFmbzZsSERJUTVNUmNRa2Z1ZDFITE5pVFJmTSIsImV4cCI6IjIwMjMtMDctMDhUMTE6MzM6MjZaIiwiaWF0IjoiMjAyMy0wNy0wN1QxOTozMzoyNloiLCJpc19iYWRfYm90IjoiZmFsc2UiLCJpc3MiOiJUd2l0Y2ggQ2xpZW50IEludGVncml0eSIsIm5iZiI6IjIwMjMtMDctMDdUMTk6MzM6MjZaIiwidXNlcl9pZCI6IiJ9C-uo7tEPY7ccwAhMy6uQMtHkLlxfM7ZE8RPDKvfZzGyP5oxqWttabgPCt-L89YWkrxevt9ZeJd00glRYUv5FAQ",
//         "client-session-id": "7be89a746584f70d",
//         "client-version": "6f44026b-5336-4daf-9900-c8dcd35ba9b6",
//         "content-type": "text/plain;charset=UTF-8",
//         "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Microsoft Edge\";v=\"114\"",
//         "sec-ch-ua-mobile": "?0",
//         "sec-ch-ua-platform": "\"Windows\"",
//         "sec-fetch-dest": "empty",
//         "sec-fetch-mode": "cors",
//         "sec-fetch-site": "same-site",
//         "x-device-id": "hQcUk1fo6lHDIQ5MRcQkfud1HLNiTRfM"
//     },
//     "referrer": "https://www.twitch.tv/",
//     "referrerPolicy": "strict-origin-when-cross-origin",
//     "body": "[{\"operationName\":\"ClipsCards__User\",\"variables\":{\"login\":\"nmplol\",\"limit\":20,\"criteria\":{\"filter\":\"LAST_WEEK\"}},\"extensions\":{\"persistedQuery\":{\"version\":1,\"sha256Hash\":\"b73ad2bfaecfd30a9e6c28fada15bd97032c83ec77a0440766a56fe0bd632777\"}}}]",
//     "method": "POST",
//     "mode": "cors",
//     "credentials": "omit"
//     });
// }


async function subOnlyVodBtn(){
    // if(document.getElementById('skip_sub_only_vod')) document.getElementById('skip_sub_only_vod').remove();
    let temp_btn = ele('div'); //stupid solution for runaway DOM insert due to awaiting the page load.
    document.body.appendChild(temp_btn);
    a(temp_btn,[['id','skip_sub_only_vod']]);

    await delay(2511);
    let sub_only = document.getElementsByClassName('content-overlay-gate__allow-pointers');
    if(sub_only?.length){
        if(document.getElementById('skip_sub_only_vod')) document.getElementById('skip_sub_only_vod').remove();
        sub_only[1].outerHTML = '';
        sub_only[0].innerHTML = `<div style="opacity:0.8; text-decoration: line-through;">${sub_only[0].innerText}</div><div style="height:8px;"></div><div>Just kidding</div>`;
        let view_vod_btn = ele('button');
        a(view_vod_btn,[['id','skip_sub_only_vod'],['class','content-overlay-gate__allow-pointers ScCoreButton-sc-1qn4ixc-0 ScCoreButtonPrimary-sc-1qn4ixc-1 ffyxRu dDxrgX']]);
        inlineStyler(view_vod_btn,`{cursor:pointer;}`);
        sub_only[0].parentElement.appendChild(view_vod_btn);
        view_vod_btn.innerHTML = `<div class="gn_btn ScCoreButtonLabel-sc-lh1yxp-0 iiHmsB" style="display:grid; grid-template-columns: 40px 1fr; grid-gap:4px;"><img src="${icons?.clip1}"></img><div data-a-target="tw-core-button-label-text" class="Layout-sc-nxg1ff-0 dWdTjI">Watch VOD</div></div>`;
        view_vod_btn.onclick = async ()=> {
            let video_details = await getm3u8DetailsFromCurrentVODDetails();
            buildVideoViewer(video_details);
            // initBtnClicked();
            // let vod_builder_data = await getStreamDataFromTwitchVodPage(view_vod_btn);
            // buildVideoViewerHolder(vod_builder_data)
        }
    }
}

async function initBtnClicked(){
    // console.log('initBtnClicked')
    // runProgram()
}


