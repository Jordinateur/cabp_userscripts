// ==UserScript==
// @name         Edit in Author
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.credit-agricole.fr/ca-briepicardie/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=credit-agricole.fr
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const button = document.createElement('button');
    const edit_url = 'https://bdig-author.ca-technologies.fr/editor.html/content/ca/cr887/npc/fr/'
    button.innerText = "Editez-moi !"
    button.style.position = 'fixed';
    button.style.right = '10px';
    button.style.bottom = '10px';
    button.style.zIndex = '1000';
    button.addEventListener('click', () => {
        window.open(edit_url + location.href.replace('https://www.credit-agricole.fr/ca-briepicardie/',''))
    })
    document.body.appendChild(button)
})();
