// ==UserScript==
// @name         Select ZdG Perso
// @namespace    https://www.credit-agricole.fr/*
// @version      0.5
// @description  Change perso
// @author       You
// @downloadURL  https://github.com/Jordinateur/cabp_userscripts/raw/master/select_zdg_perso.js
// @updateURL    https://github.com/Jordinateur/cabp_userscripts/raw/master/select_zdg_perso.js
// @match        https://www.credit-agricole.fr/ca-*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mozilla.org
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    function resolve(path, obj) {
        return path.split('.').reduce(function(prev, curr) {
            return prev ? prev[curr] : null
        }, obj || self)
    }

    function createZdGSelector(){
        const ctxHub = JSON.parse(sessionStorage.getItem('ContextHubPersistence'))
        const teasers = ContextHub.SegmentEngine.PageInteraction.TeaserManager.getAllTeasers()
        const variants = teasers[Object.keys(teasers)[0]].details.variants.sort()

        const $ZdGWrapper = document.getElementById(Object.keys(teasers)[0])
        const $select = document.createElement('select');
        $select.style.color = 'black';
        $select.style.marginTop = '30px';
        $select.style.width = '100%';
        $select.style.padding = '6px';
        $select.style.fontSize = '120%';
        if(Object.keys(teasers)[0].indexOf('operations_synthese_jcr_') === -1) $select.style.position = 'absolute';
        variants.forEach(variant => {
            console.log(variant)
            fetch(variant.url).then(raw => {
                if(raw.status == 200) {
                     const $opt = document.createElement('option');
                     const segments = variant.segments

                    if(segments.length > 0){
                        const mkpj = segments[0].split('/')[segments[0].split('/').length - 1]
                        $opt.innerHTML = mkpj
                        $opt.id = mkpj
                    }else{
                        $opt.innerHTML = "ZdG_Selector_" + variant.title;
                        $opt.id = "ZdG_Selector_" + variant.title;
                    }
                    $opt.dataset.variant = JSON.stringify(variant)
                    $select.appendChild($opt);
                }
            }).catch(e => e)

        })
        $ZdGWrapper.after($select);
        $select.onchange = () => {
            const $opt = document.getElementById($select.value)
            const variant = JSON.parse($opt.dataset.variant)
            console.log(variant.url)
            fetch(variant.url + "?r=" + Math.ceil(Math.random() * 100)).then(raw => {
                if(raw.status != 200) {
                    $opt.parentNode.removeChild($opt)
                    return null
                }
                return raw.text()
            }).then(html => {
                $ZdGWrapper.innerHTML = html ? html : "<p>Erreur</p>";
                if(html){
                    const $npc_vars = $ZdGWrapper.querySelectorAll('[data-vp]')
                    //console.log($npc_vars)
                    const pj = $opt.id.match(/mk\-(pj\d.*)\-.*/)[1]
                    const a = $opt.id.match(/\-(a\d.*)$/)[1]
                    //console.log(pj,a)
                    $npc_vars.forEach(vp => {
                        let var_path = vp.getAttribute('data-vp').replace('/','.')
                        var_path = var_path.replace('marketing-messages','marketing-messages.marketingMessages.mk-'+pj+'-'+a+'.customValues')
                        vp.innerHTML = resolve(var_path,ctxHub.store)
                    })
                    // Respect script injection
                    const scripts = $ZdGWrapper.getElementsByTagName('script')
                    if(scripts.length > 0){
                        const $s = scripts[0]
                        const $$s = document.createElement('script');
                        $$s.src = $s.src
                        $ZdGWrapper.appendChild($$s);
                    }
                }
            }).catch(e => {
                console.log(e)
                alert('Not found')
            })
        }
    }

    //createZdGSelector();
    let countInt = 0;
    const waitInt = setInterval(function(){
        if(Object.keys(ContextHub.SegmentEngine.PageInteraction.TeaserManager.getAllTeasers()).length > 0){
            clearInterval(waitInt)
            createZdGSelector()
        }else{
            if(countInt > 5){
                clearInterval(waitInt)
            }else{
                countInt++
            }
        }
    })
})();
