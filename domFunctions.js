
const cn = (o,s)=>o ? o.getElementsByClassName(s) : null;
const tn = (o,s)=>o ? o.getElementsByTagName(s) : null;
const gi = (o,s)=>o ? o.getElementById(s) : null;
const ele = (t)=>document.createElement(t);
const attr = (o,k,v)=>o ? o.setAttribute(k, v) : false;
const a = (l,r)=>r.forEach(i=>attr(l, i[0], i[1]));

function inlineStyler(elm, css) {
    if (elm) {
        Object.entries(JSON.parse(css.replace(/(?<=:)\s*(\b|\B)(?=.+?;)/g, '"').replace(/(?<=:\s*.+?);/g, '",').replace(/[a-zA-Z-]+(?=:)/g, k=>k.replace(/^\b/, '"').replace(/\b$/, '"')).replace(/\s*,\s*}/g, '}'))).forEach(kv=>{
            elm.style.setProperty([kv[0]], kv[1], 'important')
        }
        );
    }
}
function topZIndexer() {
    let n = new Date().getTime() / 1000000;
    let r = (n - Math.floor(n)) * 100000;
    return (Math.ceil(n + r) * 10);
}

function topIndexHover() {
    this.style.zIndex = topZIndexer();
}
function setHTMLCSS(style_id, css_text) {
    if (document.getElementById(`${style_id}_style`))
        document.getElementById(`${style_id}_style`).outerHTML = '';
    let csselm = ele('style');
    a(csselm, [['class', `${style_id}_style`]]);
    document.head.appendChild(csselm);
    csselm.innerHTML = css_text;
}
function dragElement() {
    var el = this.parentElement.parentElement;
    el.style.zIndex = topZIndexer();
    var pos1 = 0
      , pos2 = 0
      , pos3 = 0
      , pos4 = 0;
    if (document.getElementById(this.id))
        document.getElementById(this.id).onmousedown = dragMouseDown;
    else
        this.onmousedown = dragMouseDown;
    function dragMouseDown(e) {
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }
    function elementDrag(e) {
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        el.style.top = (el.offsetTop - pos2) + "px";
        el.style.left = (el.offsetLeft - pos1) + "px";
        el.style.opacity = "0.85";
        el.style.transition = "opacity 700ms";
        el.style.zIndex = topZIndexer();
    }
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        el.style.opacity = "1";
        el.style.zIndex = topZIndexer();
    }
}

function adjustElementSize(){
    let resize_elm_ids = this.getAttribute('data-resize-id').split(/,/);
    var cbod = document.getElementById(resize_elm_ids[0]);
    var tbod = document.getElementById(resize_elm_ids[1]);
    let tbod_css = atobJSON(tbod.getAttribute('data-css'))
    let header_pxs = cbod?.firstChild.style.gridTemplateColumns.split(/\s/).map(r=> /[\d\.]+/.exec(r)?.[0]).filter(r=> r).map(r=> parseFloat(r));
    let min_width = header_pxs?.length ? header_pxs.reduce((a,b)=> a+b)+60 : 120;
    var foot_height = 0;
    var pos1 = 0,    pos2 = 0,    pos3 = 0,    pos4 = 0;
    var width = cbod.getBoundingClientRect().width;
    var height = cbod.getBoundingClientRect().height;

    if (document.getElementById(this.id)) document.getElementById(this.id).onmousedown = dragMouseDown;
    else this.onmousedown = dragMouseDown;
    function dragMouseDown(e) {
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }
    function elementDrag(e) {
        let moved_width = (width - (pos3 - e.clientX))
        let main_width = moved_width < min_width ? min_width : moved_width;
        let main_height = ((height - (pos4 - e.clientY)) - (foot_height));
        inlineStyler(cbod,`{width: ${main_width}px;${ moved_width < min_width ? '' : ' height: '+main_height+'px; '}z-index: ${topZIndexer()};}`);
        if(tbod){
            inlineStyler(tbod,`{width: ${((main_width+tbod_css.width))}px;${ moved_width < min_width ? '' : ' height: '+(main_height+tbod_css.height)+'px;'}opacity: 0.5; transiation: opacity 100ms;}`);
        }
    }
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        if(tbod) tbod.style.opacity = '1';
    }
}


async function createLoadingElement(params) {
    var {id, ref_elm, display_text} = params;
    if(!document.getElementById('0ts_video_failure_warning')){
        if (document.getElementById(id)) document.getElementById(id).outerHTML = '';
        let loading_card_cont = ele('div');
        loading_card_cont.innerHTML = `<div><img id="loading207" ${/warning/.test(id) ? 'style="background:#d7496480; border-radius:50%;"' : ''} src="${icons.loading207}"></img></div>
        ${display_text ? `<div style="text-shadow: 1px 2px 3px #1c1c1c; height:0px; transform:translate(${/warning/.test(id) ? '0' : '22'}px,${/warning/.test(id) ? '-142' : '-112'}px);">` + display_text + '</div>' : ''}`;
        a(loading_card_cont, [['id', id], ['class', 'loading_card_cont']]);
        document.body.appendChild(loading_card_cont);
        
        let btn_rect = ref_elm ? ref_elm.getBoundingClientRect() : {left:300, top:100, height:300, width:300};

        inlineStyler(loading_card_cont, `{position:fixed; top:${btn_rect.top - 15}px; left:${btn_rect.left - 80}px; z-index:${topZIndexer()}; border-radius:50%; transition: all 300ms;}`);

        let loading_card_rect = loading_card_cont.getBoundingClientRect();
        if(loading_card_rect.left < 1){
            inlineStyler(loading_card_cont,`{left:${Math.abs(loading_card_rect.left)}px;}`);
        }
        if(/warning/.test(id)){
            let delay_limit = id == '0ts_video_failure_warning' ? 20333 : 5333;
            inlineStyler(loading_card_cont,`{left:${Math.abs(window.innerWidth-loading_card_rect.width)/2}px;top:100px;}`);
            
            if(/failed_warning/.test(id)){
                let cont = ele('div');
                a(cont,[['id','partnership_link_cont']]);
                document.body.appendChild(cont);
                inlineStyler(cont,`{font-size: 1.8em; top:${loading_card_rect.height + 50}px; left:${(Math.abs(window.innerWidth-loading_card_rect.width)/2)-100}px; position:fixed; z-index:${topZIndexer()}; padding: 12px; border-radius: 0.4em; box-shadow:0px 3px 3px 6px rgba(0,0,0,0.6); background:#000000;}`);
                createPartnershipHTML(cont);
                await delay(delay_limit*10);
                if (document.getElementById(id)) document.getElementById(id).outerHTML = '';
            }else{
                await delay(delay_limit);
                if (document.getElementById(id)) document.getElementById(id).outerHTML = '';
            }
        }        
        for(let i=0; i<200; i++){
            await delay(1000);
            if(document.getElementById(id)) inlineStyler(document.getElementById(id),`{z-index:${topZIndexer()};}`);
        }
        
    }
}

function createPartnershipHTML(parent_elm){
    let partnership_cont = ele('div');
    parent_elm.appendChild(partnership_cont);
    inlineStyler(partnership_cont,`{display:grid; grid-template-columns:1fr 32px; grid-gap: 8px; cursor:pointer;}`);

    let partnership_msg = ele('div');
    partnership_cont.appendChild(partnership_msg);
    inlineStyler(partnership_msg,`{text-align: right; transform:translate(0px,10px);}`);
    partnership_msg.innerHTML = `<div><span>Try </span><span style="color:#ff2261;">Streamrecorder</span><span> and never miss a VOD again→</span></div>`;
    
    let partnership_icon = ele('img');
    partnership_cont.appendChild(partnership_icon);
    a(partnership_icon,[['title','try streamrecorder'],['style','transform:translate(0px,3px);'],['class','hover_btn'],['src',"data:image/png;base64,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"]]);
    partnership_cont.onclick = ()=> {
        window.open('https://streamrecorder.io/?r=1YTHIQ')
        if(parent_elm.getAttribute('id') == 'partnership_link_cont'){ parent_elm.remove(); }
    };

}
function destroy(id){    if(gi(document,id)) gi(document,id).outerHTML = '';}