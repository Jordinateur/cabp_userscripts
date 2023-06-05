// ==UserScript==
// @name         Select ZdG Perso
// @namespace    https://www.credit-agricole.fr/*
// @version      0.6.2
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
        if(teasers.length < 1) return
        const variants = teasers[Object.keys(teasers)[0]].details.variants
        variants.sort()
        const $ZdGWrapper = document.getElementById(Object.keys(teasers)[0])
        const $dl = document.createElement('datalist');
        $dl.id = "dl_zdg_variants"
        const $input = document.createElement('input');
        $input.style.color = 'black';
        $input.style.marginTop = '30px';
        $input.style.width = '100%';
        $input.style.padding = '6px';
        $input.style.fontSize = '120%';
        $input.setAttribute('list',$dl.id)
        if(Object.keys(teasers)[0].indexOf('operations_synthese_jcr_') === -1) {
            $input.style.position = 'absolute';
        }
        variants.forEach(variant => {
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
                    $dl.appendChild($opt.cloneNode(true));
                }
            }).catch(e => e)

        })
        $ZdGWrapper.after($dl);
        $dl.after($input);
        const handleSelection = () => {
            const $opt = document.getElementById($input.value)
            const variant = JSON.parse($opt.dataset.variant)
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
                    const pj = $opt.id.match(/mk\-(pj\d.*)\-.*/)[1]
                    const a = $opt.id.match(/\-(a\d.*)$/)[1]
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
        $input.addEventListener('change', handleSelection)
    }


    let countInt = 0;
    const waitInt = setInterval(function(){
        if(ContextHub && Object.keys(ContextHub.SegmentEngine.PageInteraction.TeaserManager.getAllTeasers()).length > 0){
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
