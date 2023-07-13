// ==UserScript==
// @name         Fast Edoc DL
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.credit-agricole.fr/ca-*/*/operations/documents/edocuments.affiche.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=credit-agricole.fr
// @downloadURL  https://github.com/Jordinateur/cabp_userscripts/raw/master/fast_edoc_dl.js
// @updateURL    https://github.com/Jordinateur/cabp_userscripts/raw/master/fast_edoc_dl.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll('.icon.imgbam-picto-pdf').forEach($i => {
        let $a = document.createElement('a');
        $a.target = "_blank";
        $a.href= $i.parentNode.href.match(/ouvreTelechargement\('(.*?)%27\);.*/m)[1] + '&typeaction=telechargement'
        $a.innerHTML = '<span title="Téléchargez votre document" alt="Télécharger" class="icon imgbam-picto-pdf"></span>'
        $i.parentNode.parentNode.appendChild($a);
        $i.remove();
    })
    // Your code here...
})();
