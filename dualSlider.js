
    async function dualRangeSelector(main_slider_params) {
        const cn = (o,s)=>o ? o.getElementsByClassName(s) : null;
        const tn = (o,s)=>o ? o.getElementsByTagName(s) : null;
        const gi = (o,s)=>o ? o.getElementById(s) : null;
        const ele = (t)=>document.createElement(t);
        const attr = (o,k,v)=>o.setAttribute(k, v);
        const a = (l,r)=>r.forEach(a=>attr(l, a[0], a[1]));
        const delay = (ms)=>new Promise(res=>setTimeout(res, ms));
        const RC = (elm)=>elm.getBoundingClientRect();
        const cleanObject = (ob)=>Object.entries(ob).reduce((r,[k,v])=>{
            if (v != null && v != undefined && v != "" && (typeof v == 'boolean' || typeof v == 'string' || typeof v == 'symbol' || typeof v == 'number' || typeof v == 'function' || (typeof v == 'object' && ((Array.isArray(v) && v.length) || (Array.isArray(v) != true))))) {
                r[k] = v;
                return r;
            } else {
                return r;
            }
        }
        , {});
        function topZIndexer() {
            let n = new Date().getTime() / 1000000;
            let r = (n - Math.floor(n)) * 100000;
            return (Math.ceil(n + r) * 10);
        }

        function inlineStyler(elm, css) {
            Object.entries(JSON.parse(css.replace(/\n/g, '').replace(/(?<=:)\s*(\b|\B)(?=.+?;)/g, '"').replace(/(?<=:\s*.+?);/g, '",').replace(/[a-zA-Z-]+(?=:)/g, k=>k.replace(/^\b/, '"').replace(/\b$/, '"')).replace(/\s*,\s*\}/g, '}'))).forEach(kv=>{
                elm.style[kv[0]] = kv[1]
            }
            );
        }
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
        function createDualRangeSlider(params) {
            const {add_background_color,min, max, offset, type, selection_text_suffix, displayStringTranslation, displayNumberTranslation, validateInput, id, parent_element, parent_element_left, ball_bg_color, bar_bg_color, bar_bg_color_alt, bar_height, ball_width, ball_height, ball_radius, container_padding, } = params;
            var bar_background = hexToRgb(bar_bg_color);
            var bar_background_t20 = hexToRgb(bar_bg_color_alt);
            var bar_hsl_arr = rgbToHsl(bar_background);

            var bar_highlight = `hsl(${bar_hsl_arr[0]},${bar_hsl_arr[1]}%,${80}%)`;
            var bar_shadow = `hsl(${bar_hsl_arr[0]},${25}%,${30}%)`;
            var ball_background = hexToRgb(ball_bg_color);

            var ball_hsl_arr = rgbToHsl(ball_background);
            var ball_highlight = `hsl(${ball_hsl_arr[0]},${ball_hsl_arr[1]}%,${85}%)`;
            var ball_highlight2 = `hsl(${ball_hsl_arr[0]},${ball_hsl_arr[1]}%,${70}%)`;
            var ball_shadow = `hsl(${ball_hsl_arr[0]},${25}%,${30}%)`;

            const raw_differential = (max - min);
            /* the raw range differential */
            const pixel_range_ratio = raw_differential / RC(parent_element).width;

            function setCSS2(style_id) {
                if (gi(document, `${style_id}_style`))
                    gi(document, `${style_id}_style`).outerHTML = '';
                let csselm = ele('style');
                a(csselm, [['class', `${style_id}_style`]]);
                document.head.appendChild(csselm);
                csselm.innerHTML = `
                        .slider_label {
                            width:90px;
                            border:0px solid transparent;
                            box-shadow: ${ball_shadow} 0px 1px 0px 0px, ${ball_highlight} -1px -1px 1px -0px;
                            border-radius:${ball_radius};
                            color:${bar_highlight};
                            background:${bar_background};
                            padding:3px;
                            text-align:center;
                            outline: none;
                        }
                        .slider_label:hover {
                            background:transparent;
                            background-image: linear-gradient(to bottom right, ${bar_background}, ${bar_background_t20});
                            background-size: 400% 400%;
                            animation: gradient_label 1s ease-in-out infinite;
                        }
                        .slider_label:focus {
                            box-shadow: ${(bar_shadow)} 1px 1px 1px 0px inset, ${(bar_highlight)} -1px -1px 1px 0px inset;
                        }
                        @keyframes gradient_label {
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
                        .slider_parent {
                            position: absolute;
                            height:${((ball_height + bar_height) + (container_padding * 2))}px;
                            width:${RC(parent_element).width}px;
                            border-radius:0.2em;
                            user-select: none;
                            display: grid;
                            grid-template-rows:${container_padding}px ${ball_height + bar_height}px ${container_padding}px;
                            grid-gap:0px;
                        }
                        .slider_container {
                            position: absolute;
                            top:${container_padding - (bar_height / 2)}px;
                            height:${bar_height}px;
                            width:${RC(parent_element).width}px;
                            border-radius:0.2em;
                            box-shadow: ${(bar_shadow)} 1px 1px 1px 0px inset, ${(bar_highlight)} -1px -1px 1px 0px inset;
                        }
                        .slider_ball {
                            border-radius:${ball_radius};
                            box-shadow: ${ball_shadow} 0px 1px 0px 0px, ${ball_highlight} -1px -1px 1px -0px;
                            background:${ball_background};
                            width:${ball_width}px;
                            height:${ball_height}px;
                            cursor:pointer;
                            text-align:center;
                        }
                        .slider_ball:hover {
                            box-shadow: ${ball_shadow} 1px 1px 1px 0px, ${ball_highlight2} -2px -1.2px 2px -0px;
                        }
                        .slider_ball:active {
                            box-shadow: ${(ball_shadow)} 1px 1px 1px 0px inset, ${(ball_highlight)} -1px -1px 1px 0px inset;
                        }
                        `;
            }
            setCSS2(`${id}_slider_css`);

            function recalibrateValue(left) {
                return left + ((ball_width / 2) * pixel_range_ratio)
            }
            function recalculatePosition(left) {
                return (left - ((parent_element_left + Math.abs(parent_element_left - RC(slider_parent).left))));
            }

            /* slider html elements */
            const slider_parent = ele('div');
            parent_element.appendChild(slider_parent);
            a(slider_parent, [['id', id], ['class', 'slider_parent']]);
            if(add_background_color) inlineStyler(slider_parent,`{background:${add_background_color};}`);
            // box-shadow:0px 4px 4px 8px rgba(0,0,0,0.6);
            // console.log((parent_element_left+ Math.abs(parent_element_left-RC(slider_parent).left)))
            const upper_container = ele('div');
            slider_parent.appendChild(upper_container);
            a(upper_container, [['id', `${id}_upper_container`]]);

            const slider_label_1 = ele('input');
            a(slider_label_1, [['id', 'slider_label_1'], ['class', 'slider_label']]);
            inlineStyler(slider_label_1, `{position: absolute; left:${recalculatePosition(RC(parent_element).left)}px;}`);
            slider_label_1.value = displayStringTranslation((recalculatePosition(RC(parent_element).left) * pixel_range_ratio));
            upper_container.appendChild(slider_label_1);
            slider_label_1.onblur = updateSliderInfoWithInputVals;
            slider_label_1.onkeyup = updateIfEnter;

            const slider_label_2 = ele('input');
            a(slider_label_2, [['id', 'slider_label_2'], ['class', 'slider_label']]);
            inlineStyler(slider_label_2, `{position: absolute; transform:translate(-80px,0px); left:${RC(parent_element).width}px;}`);
            slider_label_2.value = displayStringTranslation((RC(parent_element).width * pixel_range_ratio));
            upper_container.appendChild(slider_label_2);
            slider_label_2.onblur = updateSliderInfoWithInputVals;
            slider_label_2.onkeyup = updateIfEnter;

            const slider_container = ele('div');
            a(slider_container, [['class', 'slider_container'], ['id', `${id}_slider_container`]]);
            inlineStyler(slider_container, `{background-image: linear-gradient(to right, ${bar_background} 100%, ${bar_background} 100%);}`)
            slider_parent.appendChild(slider_container);
            slider_container.onmouseenter = ballSlider;
            const slide_ball_1 = ele('div');
            a(slide_ball_1, [['id', `${id}_slide_ball_1`], ['class', 'slider_ball']]);
            inlineStyler(slide_ball_1, `{position: absolute; transform:translate(-${Math.floor(ball_width / 2)}px,-${(ball_height - bar_height) / 2}px); left:${recalculatePosition(RC(parent_element).left)}px;}`);
            slider_container.appendChild(slide_ball_1);
            slide_ball_1.onmouseenter = ballSlider;

            const slide_ball_2 = ele('div');
            a(slide_ball_2, [['id', `${id}_slide_ball_2`], ['class', 'slider_ball']]);
            inlineStyler(slide_ball_2, `{position: absolute; transform:translate(-${Math.floor(ball_width / 2)}px,-${(ball_height - bar_height) / 2}px); left:${RC(parent_element).width}px;}`);
            //(ball_width/2)
            slider_container.appendChild(slide_ball_2);
            slide_ball_2.onmouseenter = ballSlider;

            const label_translate_y = (Math.abs(RC(slider_label_1).bottom - RC(slide_ball_1).top) * 2) + (ball_height + RC(slider_label_1).height);
            /*ensures the y-axis shift on overlap is always the mirror of the top distance regardless of the input parameters*/

            const lower_container = ele('div');
            slider_parent.appendChild(lower_container);
            a(lower_container, [['id', `${id}_lower_container`]]);
            const range_selection_display = ele('div');
            a(range_selection_display, [['id', `${id}_range_selection_display`], ['data-position', 'og']]);
            inlineStyler(range_selection_display, `{transform:translate(${ball_width}px,${(RC(lower_container).height * 0.6)}px); color:${ball_background};}`);
            lower_container.appendChild(range_selection_display);
            range_selection_display.innerText = displayStringTranslation(max) + selection_text_suffix;
            inlineStyler(range_selection_display, `{width: ${range_selection_display.innerText.length * 8.5}px; border-radius: ${ball_radius}; text-align:center; transition: background 3000ms;}`);
            // const selection_label_translate = label_translate_y + () 

            function adustRangeSelectionLabelPalcement(label_elm) {
                // gi(document,`${id}_range_selection_display`)
                let label_elm_rect = RC(label_elm);
                let range_selection_display_rect = RC(range_selection_display);
                //console.log([label_elm_rect,range_selection_display_rect])
                if (// range_selection_display.getAttribute('data-position') == 'og'
                // &&
                // label_elm_rect.bottom >= range_selection_display_rect.top
                // && 
                label_elm_rect.left <= (range_selection_display_rect.left + (range_selection_display.innerText.length * 8))) {
                    inlineStyler(range_selection_display, `{transform:translate(${ball_width}px,${(RC(lower_container).height) + label_elm_rect.height}px);background-image: linear-gradient(to left, transparent, transparent, ${bar_highlight});
                            background-size: 400% 400%;
                            animation: gradient_label 3s ease-in-out infinite;}`);
                } else {
                    // range_selection_display.setAttribute('data-position','og');
                    inlineStyler(range_selection_display, `{transform:translate(${ball_width}px,${(RC(lower_container).height * 0.6)}px); background: transparent;}`);
                }
            }
            async function bounceTransition(elm, transition_params) {
                var {start, end, jump, css_start, css_end, interval, jump_css, jump_end} = transition_params;
                inlineStyler(elm, `{transition: all ${interval}ms; ${css_start}${jump}${css_end}; ${jump_css ? jump_css : ''}}`);
                await delay(interval);
                // inlineStyler(elm,`{transition: all ${interval}ms; ${css_start}${(end-(jump/2))}${css_end};}`);
                // await delay(interval);
                inlineStyler(elm, `{transition: all ${interval}ms; ${css_start}${end}${css_end}; ${jump_end ? jump_end : ''}}`);
                await delay(interval);
                inlineStyler(elm, `{transition: all 0ms;}`);
            }
            function updateIfEnter(e) {
                if (/enter/i.test(e.key))
                    updateSliderInfoWithInputVals();
            }
            async function updateSliderInfoWithInputVals() {
                let ball1 = gi(document, `${id}_slide_ball_1`);
                let ball2 = gi(document, `${id}_slide_ball_2`);
                let labels = Array.from(cn(document, 'slider_label'));
                let label_elms = labels.sort((ba,bb)=>displayNumberTranslation(ba.value) < displayNumberTranslation(bb.value) ? -1 : 0);
                let label_1_val = displayNumberTranslation(label_elms[0].value) < min ? min : displayNumberTranslation(label_elms[0].value);
                let label_2_val = displayNumberTranslation(label_elms[1].value) > max ? max : displayNumberTranslation(label_elms[1].value);

                inlineStyler(ball1, `{left:${(label_1_val) / pixel_range_ratio}px;}`);
                inlineStyler(ball2, `{left:${(label_2_val) / pixel_range_ratio}px;}`);
                label_elms.forEach(elm=>{
                    let label_val = displayNumberTranslation(elm.value);
                    let adjusted_label_val = label_val >= max ? max : label_val <= min ? min : label_val;
                    //console.log(adjusted_label_val,max);
                    let label_val_out_of_scope = label_val >= max || label_val <= min;

                    if (label_val < min) {
                        elm.value = displayStringTranslation((recalculatePosition(RC(parent_element).left) * pixel_range_ratio));
                        bounceTransition(elm, {
                            start: (label_val / pixel_range_ratio),
                            end: (adjusted_label_val / pixel_range_ratio),
                            jump: -90,
                            css_start: 'left:',
                            css_end: 'px',
                            interval: 100,
                            jump_css: ` background:${bar_background_t20};`,
                            jump_end: ` background: ${bar_background};`,
                        });
                    }
                    if (label_val > max) {
                        elm.value = displayStringTranslation((RC(parent_element).width * pixel_range_ratio));
                        bounceTransition(elm, {
                            start: (label_val / pixel_range_ratio),
                            end: (adjusted_label_val / pixel_range_ratio),
                            jump: 90,
                            css_start: 'left:',
                            css_end: 'px',
                            interval: 100,
                            jump_css: ` background:${bar_background_t20};`,
                            jump_end: ` background: ${bar_background};`,
                        })
                    }

                    inlineStyler(elm, `{left:${(adjusted_label_val / pixel_range_ratio)}px;}`);
                }
                );
                await delay(11);
                updateBackgroundOnly();
            }
            function ballSlider(event) {
                var reconcileLeft = (n)=>(n - ((parent_element_left + Math.abs(parent_element_left - RC(slider_parent).left)))) + (ball_width / 2);

                let el = this;
                let left_pos = reconcileLeft(RC(el).left);
                var pos1 = 0
                  , pos2 = 0
                  , pos3 = 0
                  , pos4 = 0;
                if (document.getElementById(this.id))
                    document.getElementById(this.id).onmousedown = dragMouseDown;

                function dragMouseDown(e) {
                    if (this.id == `${id}_slider_container`) {
                        let cposx = recalculatePosition(e.clientX);
                        let balls = Array.from(cn(document, 'slider_ball'));
                        let ball_pos = balls.map(ball=>Math.abs(cposx - recalculatePosition(RC(ball).left)));
                        let move_this_ball = balls[ball_pos.findIndex(i=>i == Math.min(...ball_pos))];
                        let new_left_pos = stickLeftIfNear(cposx);
                        inlineStyler(move_this_ball, `{left:${new_left_pos}px;}`);
                        updateBackground();
                    } else {
                        pos3 = recalculatePosition(e.clientX);
                        document.onmouseup = closeDragElement;
                        document.onmousemove = elementDrag;
                    }
                }
                function elementDrag(e) {
                    pos1 = pos3 - recalculatePosition(e.clientX);
                    pos3 = recalculatePosition(e.clientX);
                    inlineStyler(el, `{left:${stickLeftIfNear(pos3)}px;}`);
                    updateBackground();
                }
                function closeDragElement() {
                    updateBackground()
                    document.onmouseup = null;
                    document.onmousemove = null;
                }
            }
            /*end ballSlider*/

            function stickLeftIfNear(cposx) {
                return (cposx >= (0) && cposx <= (RC(gi(document, `${id}_slider_container`)).width) ? (cposx) : cposx >= (0) && (cposx <= (RC(gi(document, `${id}_slider_container`)).width * 0.90)) ? (RC(gi(document, `${id}_slider_container`)).width) : (cposx >= (RC(gi(document, `${id}_slider_container`)).width * 0.10)) ? (RC(gi(document, `${id}_slider_container`)).width) : (0))
            }

            function updateBackgroundOnly() {
                let balls = Array.from(cn(document, 'slider_ball'));
                let balls_elms = balls.sort((ba,bb)=>(RC(ba).left) < (RC(bb).left) ? -1 : 0);
                let slider_cont = gi(document, `${id}_slider_container`);
                let slider_width = RC(slider_cont).width;
                let start_bar = Math.min(...balls_elms.map(b=>recalculatePosition(RC(b).left)));
                let end_bar = Math.max(...balls_elms.map(b=>recalculatePosition(RC(b).left)));
                inlineStyler(slider_cont, `{background-image: linear-gradient(to right, ${bar_background_t20} ${start_bar}px, ${bar_background} ${start_bar}px, ${bar_background} ${end_bar}px, ${bar_background} ${end_bar}px, ${bar_background_t20} ${end_bar}px, ${bar_background_t20} ${slider_width}px);}`);
            }
            function updateBackground() {
                let balls = Array.from(cn(document, 'slider_ball'));
                let balls_elms = balls.sort((ba,bb)=>(RC(ba).left) < (RC(bb).left) ? -1 : 0);
                let slider_cont = gi(document, `${id}_slider_container`);
                let slider_width = RC(slider_cont).width;
                let start_bar = Math.min(...balls_elms.map(b=>recalculatePosition(RC(b).left)));
                let end_bar = Math.max(...balls_elms.map(b=>recalculatePosition(RC(b).left)));

                let start_ball = balls_elms.filter(b=>recalculatePosition(RC(b).left) == start_bar)[0];
                let end_ball = balls_elms.filter(b=>recalculatePosition(RC(b).left) == end_bar)[0];

                let mid_bar = ((slider_width - end_bar) - Math.abs(start_bar + end_bar));

                inlineStyler(slider_cont, `{background-image: linear-gradient(to right, ${bar_background_t20} ${start_bar}px, ${bar_background} ${start_bar}px, ${bar_background} ${end_bar}px, ${bar_background} ${end_bar}px, ${bar_background_t20} ${end_bar}px, ${bar_background_t20} ${slider_width}px);}`);

                let labels = Array.from(cn(document, 'slider_label'));
                let label_elms = labels.sort((ba,bb)=>recalculatePosition(RC(ba).left) < recalculatePosition(RC(bb).left) ? -1 : 0);

                let labels_pos = labels.map(elm=>recalculatePosition(RC(elm).left));

                let start_label_pos = Math.min(...label_elms.map(b=>recalculatePosition(RC(b).left)));
                let end_label_pos = Math.max(...label_elms.map(b=>recalculatePosition(RC(b).left)));

                let start_label = label_elms.filter(b=>recalculatePosition(RC(b).left) == start_label_pos)[0];
                let end_label = label_elms.filter(b=>recalculatePosition(RC(b).left) == end_label_pos)?.length == 1 ? label_elms.filter(b=>recalculatePosition(RC(b).left) == end_label_pos)[0] : label_elms.filter(b=>recalculatePosition(RC(b).left) == end_label_pos)[1];
                let start_label_width = RC(start_label).width;
                let end_label_width = RC(end_label).width;
                let max_label_width = Math.max(...[start_label_width, end_label_width]);
                let label_dif = Math.abs(start_label_pos - end_label_pos)

                let switch_label = max_label_width >= label_dif;
                let is_bottom_translation = !/0px\)/.test(end_label.style.transform);
                let translation_transition = switch_label ? 'transition: all 0ms ease-out; ' : 'transition: all 0ms; ';
                let left_ball_x = (RC(end_label).width / 3);

                // console.log(['y',(RC(start_label).bottom - RC(start_ball).top)])
                // let label_translate_y = (Math.abs(RC(start_label).bottom - RC(start_ball).top)) + (ball_height + RC(end_label).height);
                //((bar_height*2)+(ball_height))
                inlineStyler(start_label, `{transition: all 0ms; transform: translateY(0px); left:${(start_bar)}px;}`);
                inlineStyler(end_label, `{${translation_transition} transform: translate(-${left_ball_x}px,${(switch_label ? label_translate_y : 0)}px); left:${(end_bar)}px;}`);

                adustRangeSelectionLabelPalcement(end_label)
                let start_val = (recalibrateValue((start_bar) * pixel_range_ratio));
                let end_val = (recalibrateValue(((end_bar) * pixel_range_ratio)));
                start_label.value = displayStringTranslation(start_val);
                end_label.value = displayStringTranslation(end_val);

                let range_display_pos = ((start_bar) >= (RC(gi(document, `${id}_slider_container`)).width - start_bar) ? start_bar - ((start_bar - end_bar) + 80) : start_bar + (((end_bar - start_bar) / 2)));
                range_selection_display.innerText = displayStringTranslation(((end_val - start_val))) + selection_text_suffix;
            }
            /*end updateBackground*/

        }
        /*end createDualRangeSlider*/

        createDualRangeSlider(main_slider_params)
    }