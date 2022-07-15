// ==UserScript==
// @name         Select ZdG Perso
// @namespace    https://www.credit-agricole.fr/*
// @version      0.1
// @description  Change perso
// @author       You
// @downloadURL  https://github.com/Jordinateur/cabp_userscripts/raw/master/select_zdg_perso.js
// @match        https://www.credit-agricole.fr/ca-*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mozilla.org
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    if(sessionStorage.getItem('ContextHubPersistence') !== null){
        const ctxHub = JSON.parse(sessionStorage.getItem('ContextHubPersistence'));
        const ciblages = ctxHub.store['marketing-messages'].marketingMessages
        const $ZdGWrapper = document.getElementById('_content_ca_cr887_npc_fr_particulier_operations_synthese_jcr_content_personnalisation')
        const url = 'https://www.credit-agricole.fr/content/campaigns/ca/cr887/mk-#pj#/mk-#a#/synthese-personnalisation/jcr:content/par.html'
        const $select = document.createElement('select');
        $select.style.color = 'black';
        $select.style.marginTop = '30px';
        Object.keys(ciblages).forEach(cible => {
            const $opt = document.createElement('option');
            $opt.innerHTML = cible;
            $opt.id = cible;
            $select.appendChild($opt);
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
                $ZdGWrapper.innerHTML = html;
            }).catch(e => {
                console.log(e)
                alert('Not found')
            })
        }
    }else{
        console.log('ERRRRR');
    }
})();
