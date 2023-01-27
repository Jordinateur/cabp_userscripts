// ==UserScript==
// @name         Select ZdG Perso
// @namespace    https://www.credit-agricole.fr/*
// @version      0.3
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
    if(sessionStorage.getItem('ContextHubPersistence') !== "{}"){
        const ctxHub = JSON.parse(sessionStorage.getItem('ContextHubPersistence'));
        const ciblages = ctxHub.store['marketing-messages'].marketingMessages
        const idCR = document.cookie.match(/caisse\-regionale=(.*?);/)[1]
        const crPath = document.cookie.match(/cr\-path=(.*?);/)[1]
        const idCreator = document.location.href.split(crPath)[1].split('.')[0].split('/').join('_')
        const $ZdGWrapper = document.getElementById('_content_ca_'+idCR+'_npc_fr_'+idCreator+'_jcr_content_personnalisation') || document.querySelector('[id^="_content_ca_'+idCR+'_npc_fr_'+idCreator+'_jcr_content"]')
        const synthese = document.getElementById('_content_ca_'+idCR+'_npc_fr_'+idCreator+'_jcr_content_personnalisation') !== null
        const url = synthese ? 'https://www.credit-agricole.fr/content/campaigns/ca/'+idCR+'/mk-#pj#/mk-#a#/synthese-personnalisation/jcr:content/par.html' : 'https://www.credit-agricole.fr/content/campaigns/ca/'+idCR+'/mk-#pj#/mk-#a#/'+idCreator.split('_')[idCreator.split('_').length - 1]+'-new_zdg/jcr:content/par.html'
        const $select = document.createElement('select');
        $select.style.color = 'black';
        $select.style.marginTop = '30px';
        $select.style.width = '100%';
        $select.style.padding = '6px';
        $select.style.fontSize = '120%';
        if(!synthese) $select.style.position = 'absolute';
        Object.keys(ciblages).forEach(cible => {
            const pj = cible.split('-')[1];
            const a = cible.split('-')[2];
            fetch(url.replace('#pj#',pj).replace('#a#',a)).then(raw => {
                if(raw.status == 200) {
                     const $opt = document.createElement('option');
                    $opt.innerHTML = cible;
                    $opt.id = cible;
                    $select.appendChild($opt);
                }
            }).catch(e => e)

        })
        $ZdGWrapper.after($select);
        $select.onchange = () => {
            const pj = $select.value.split('-')[1];
            const a = $select.value.split('-')[2];
            fetch(url.replace('#pj#',pj).replace('#a#',a)).then(raw => {
                if(raw.status != 200) {
                    const $opt = document.getElementById($select.value)
                    $opt.parentNode.removeChild($opt)
                    return null
                }
                return raw.text()
            }).then(html => {
                $ZdGWrapper.innerHTML = html ? html : "<p>Erreur</p>";
                if(html){
                    const $npc_vars = $ZdGWrapper.querySelectorAll('[data-vp]')
                    console.log($npc_vars)
                    $npc_vars.forEach(vp => {
                        let var_path = vp.getAttribute('data-vp').replace('/','.')
                        var_path = var_path.replace('marketing-messages','marketing-messages.marketingMessages.mk-'+pj+'-'+a+'.customValues')
                        vp.innerHTML = resolve(var_path,ctxHub.store)
                    })
                }
            }).catch(e => {
                console.log(e)
                alert('Not found')
            })
        }
    }else{
        console.log('ERRRRR');
    }
})();
