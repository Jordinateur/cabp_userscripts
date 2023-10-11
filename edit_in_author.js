// ==UserScript==
// @name         Edit in Author
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.credit-agricole.fr/ca-briepicardie/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=credit-agricole.fr
// @downloadURL  https://github.com/Jordinateur/cabp_userscripts/raw/master/edit_in_author.js
// @updateURL    https://github.com/Jordinateur/cabp_userscripts/raw/master/edit_in_author.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const button_other_page = document.createElement('button');
    const button_same_page = document.createElement('button');
    const edit_url = 'https://bdig-author.ca-technologies.fr/editor.html/content/ca/cr887/npc/fr/'
    const btnWrapper = document.createElement('div')
    btnWrapper.style.position = 'fixed'
    btnWrapper.style.right = '10px'
    btnWrapper.style.bottom = '10px'
    btnWrapper.style.zIndex = '1000'
    btnWrapper.style.display = 'flex'
    button_other_page.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>'
    button_same_page.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>'
    button_other_page.addEventListener('click', () => {
        window.open(edit_url + location.href.replace('https://www.credit-agricole.fr/ca-briepicardie/',''))
    })
    button_same_page.addEventListener('click', () => {
        location.href = (edit_url + location.href.replace('https://www.credit-agricole.fr/ca-briepicardie/',''))
    })
    btnWrapper.appendChild(button_other_page)
    btnWrapper.appendChild(button_same_page)
    document.body.appendChild(btnWrapper)
})();
