// ==UserScript==
// @name         MarketRollit
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://bdig-author.ca-technologies.fr/editor.html/content/ca/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ca-technologies.fr
// @downloadURL  https://github.com/Jordinateur/cabp_userscripts/raw/master/marketrollit.js
// @updateURL    https://github.com/Jordinateur/cabp_userscripts/raw/master/marketrollit.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const markets = ['particulier','banque-privee','professionnel','agriculteur','association','entreprise','collectivites-publiques']
    setTimeout(() => {
        const $nav = document.querySelector('.editor-GlobalBar.js-editor-PanelHeader.editor-panel-header')
        const dropdown_html = `<select id="market_it">${markets.map(m => "<option "+(location.href.includes('/'+m+'/') ? 'selected="selected"' : '')+">"+m+"</option>").join("")}</select><button id="market_it_all" style="font-size: 150%;padding: 5px;background: none;outline: none;border: none;">🧨</button>`
        const $div = document.createElement('div')
        $div.innerHTML += dropdown_html
        $div.style.marginLeft = '150px';
        $div.style.width = '220px';
        $nav.querySelector('coral-actionbar').appendChild($div)
        //$nav.querySelector('.coral3-ActionBar-primary').innerHTML += dropdown_html
        const $select = document.getElementById('market_it')
        $select.style.margin = "8px"
        $select.style.padding = "4px"
        $select.style.fontSize = "105%"
        $select.addEventListener('change', (e) => {
            if(location.href.indexOf($select.value) !== -1){
            }else{
                markets.forEach(m => {
                   if(location.href.indexOf(m) !== -1){
                       window.open(location.href.replace(m,$select.value))
                   }
                })
            }
        })
        document.getElementById('market_it_all').onclick = function(){
            markets.forEach(am => {
                if(location.href.indexOf(am) === -1){
                    markets.forEach(bm => {
                        if(location.href.indexOf(bm) !== -1){
                            window.open(location.href.replace(bm,am))
                        }
                    })
                }
            })
        }
    },2000)
    // Your code here...
})();
