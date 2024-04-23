var headernavcolor = ()=>'#18181b';
var head_color = '#18181b';
var purple_trans = '#772fe2de';
var purple_1 = '#772ce8';
var purple_2 = '#772ce885';
var purple_3 = '#772ce825';
var purple_4 = '#772ce810';

var purple_light_trans = '#7d39e199';
var bright_green = '#43de6d85';
var blue_trans = `#1f4dc472`;

setHTMLCSS('download_vod_css', `
.gn_btn {
    border-radius:0.8em;
    border:2px solid #52074a;
    padding:6px;
    cursor:pointer;
    font-size: 1.2em;
}
.gn_btn:hover {
    background:#41003a;
}
.hover_opt {
    border-radius:0.2em;
    padding:8px;
    cursor:pointer;
    font-size: 1.2em;
}
.hover_opt:hover {
    background:#b290ae;
}
#audio_muted {
    background-size: 8px 8px;
    background-position: 0 0, 4px 4px;     
    background-image: radial-gradient(#f542b915 25%, transparent 25%, transparent 75%, #f542b915 75%, #f542b915), radial-gradient(#f542b915 25%, transparent 25%, transparent 75%, #f542b915 75%, #f542b915); 
    animation: muted_gradient 16s ease-in infinite;
}
@keyframes muted_gradient {
    0% {
        background-size: 8px 8px;
        background-position: 0 0, 4px 4px;
    }
    50% {
        background-size: 6px 6px;
        background-position: 0 0, 3px 3px;
    }
    100% {
        background-size: 8px 8px;
        background-position: 0 0, 4px 4px;
    }
}
#extraction-psuedo-notifier {
    background: linear-gradient(to bottom, transparent 10%, ${purple_3} 100%);
}
.preview_img {
    transform:translate(0px,-0px);
    animation: preview_img 12s ease-in-out infinite;
}
@keyframes preview_img {
    0% {
        transform:translate(0px,-45px);
    }
    20% {
        transform:translate(0px,-90px);
    }
    40% {
        transform:translate(0px,-135px);
    }
    60% {
        transform:translate(0px,-180px);
    }
    80% {
        transform:translate(0px,-225px);
    }
    100% {
        transform:translate(0px,-270px);
    }
    120% {
        transform:translate(0px,-315px);
    }
    140% {
        transform:translate(0px,-360px);
    }
    160% {
        transform:translate(0px,-405px);
    }
    180% {
        transform:translate(0px,-450px);
    }
    200% {
        transform:translate(0px,-0px);
    }
}
.stream_download_option_engaged {
    background:${purple_4};
    background: linear-gradient(to bottom right, transparent, transparent, transparent, ${purple_4});
    box-shadow: #0d0b0f 1px 2px 1px 0px inset, ${purple_2} -1px -0px 0px 0px inset;
}
.loading_card_cont {
    background-image: linear-gradient(to top, ${purple_2} 100%, transparent 100%);
    background-size: 400% 400%;
    animation: gradient_loading 40s ease infinite;
}
@keyframes gradient_loading {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}
.stream_download_options {
    padding: 6px;
    border-radius:0.2em;
    background: linear-gradient(to bottom right, ${purple_3}, transparent, transparent, transparent);
    box-shadow: #0d0b0f 0px 1px 1px 0px, ${purple_1} -1px -0px 1px -0px;
}
.stream_download_options:hover {
    background: linear-gradient(to bottom right, ${purple_4}, transparent, transparent, transparent);
    box-shadow: #0d0b0f 1px 2px 1px 0px, ${purple_1} -1px -1px 1px -0px;
}
.stream_download_options:active{
    background: linear-gradient(to bottom right, transparent, transparent, transparent, ${purple_4});
    box-shadow: #0d0b0f 2px 4px 1px 0px inset, ${purple_2} -1px -1px 1px 0px inset;
}
.res_option {
    font-size: 1.1em;
    text-align: center; 
    user-select: none;
    text-align:center;
    cursor:pointer;
    border:1px solid transparent;
    transition: all 111ms;
    height: 2em;
    transform: translate(0px,4px);
}
.unchecked:hover {
    border-radius:0.2em;
    background: linear-gradient(to bottom right, ${purple_4}, transparent, transparent, transparent);
    box-shadow: #0d0b0f 1px 2px 1px 0px, ${purple_1} -1px -1px 1px -0px;
}
.res_option:active {
    background:${purple_4};
    background: linear-gradient(to bottom right, transparent, transparent, transparent, ${purple_4});
    box-shadow: #0d0b0f 2px 4px 1px 0px inset, ${purple_2} -1px -1px 1px 0px inset;
}
.unchecked {
    border-radius:0.2em;
    background: linear-gradient(to bottom right, ${purple_3}, transparent, transparent, transparent);
    box-shadow: #0d0b0f 0px 1px 1px 0px, ${purple_1} -1px -0px 1px -0px;
}
.checked {
    background:${purple_4};
    background: linear-gradient(to bottom right, transparent, transparent, transparent, ${purple_4});
    box-shadow: #0d0b0f 1px 2px 1px 0px inset, ${purple_2} -1px -0px 0px 0px inset;
}
.dl_btn {
    user-select: none;
    padding: 12px;
    font-size:1.5em;
    color:${purple_1};
    text-align:center;
    cursor:pointer;
    border:1px solid transparent;
    border-radius:0.2em;
    background: linear-gradient(to bottom right, ${purple_3}, transparent, transparent, transparent);
    box-shadow: #0d0b0f 0px 1px 1px 0px, ${purple_1} -1px -0px 1px -0px;
}
.dl_btn:hover {
    border-radius:0.2em;
    background: linear-gradient(to bottom right, ${purple_3}, transparent, transparent, transparent);
    box-shadow: #0d0b0f 1px 2px 1px 0px, ${purple_1} -1px -1px 1px -0px;
}
.dl_btn:active {
    background:${purple_4};
    background: linear-gradient(to bottom right, transparent, transparent, transparent, ${purple_4});
    box-shadow: #0d0b0f 1px 3px 1px 0px inset, ${purple_2} -1px -1px 0px 0px inset;
}

#init_vod_clip_btn {
    transition: all 111ms;
    border-radius:1em;
    box-shadow: #0d0b0f 0px 1px 1px 0px, ${purple_1} -1px -0px 1px -0px;
}
#init_vod_clip_btn:hover {
    border-radius:1.3em;
    box-shadow: ${purple_1} 2px 0px 2px 0px, ${purple_1} -2px -0px 2px -0px;
}
#init_vod_clip_btn:active {
    border-radius:1.3em;
    box-shadow: #0d0b0f 1px 2px 1px 0px inset, ${purple_1} -1px -1px 2px 1px inset;
}

.dualslider {
    -webkit-appearance: none;
    -moz-apperance: none;
    background:${purple_1};
    height:20px;
    border-radius: 0.2em;
    outline-color: ${purple_1};
    outline-width: 1px;
    outline-style:outset;
    outline-offset: 0px;
}
.dualslider[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    background-color: ${head_color};
    width: 10px;
    height: 30px;
    border: 1px solid ${purple_1};
    border-radius: 0.2em;
}
.quickli_options_container_main {
    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23a6d5, #23d5ab);
    background-size: 400% 400%;
    animation: gradient_quickli 3s ease infinite;
}
@keyframes gradient_quickli {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}
`);