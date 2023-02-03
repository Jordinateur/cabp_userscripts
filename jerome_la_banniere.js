// ==UserScript==
// @name         Jerome la bannière
// @namespace    http://tampermonkey.net/
// @downloadURL  https://github.com/Jordinateur/cabp_userscripts/raw/master/jerome_la_banniere.js
// @updateURL    https://github.com/Jordinateur/cabp_userscripts/raw/master/jerome_la_banniere.js
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.credit-agricole.fr/ca-briepicardie/*
// @grant        none
// ==/UserScript==


function showImageInput(){
    var wrapper = document.createElement('div');
    var input = document.createElement('input');
    input.type = 'file';
    input.style.position = 'absolute';
    input.style.left = '50%';
    input.style.top = '50%';
    input.style.transform = 'translate(-50%,-50%)';
    wrapper.style.position = 'absolute';
    wrapper.style.width = '100%';
    wrapper.style.height = '100%';
    wrapper.style.zIndex = '100';
    wrapper.style.top = '0';
    wrapper.style.left = '0';
    wrapper.style.background = 'rgba(255,255,255,.3)';
    wrapper.appendChild(input);
    document.body.appendChild(wrapper);
    input.addEventListener('change', (e) => {
        if (input.files && input.files[0]) {
            var banner_elements = Array.prototype.slice.call(document.querySelectorAll('.owl-item div.PushCommunication-backgroundWrapper > div'))
            var url = URL.createObjectURL(input.files[0]);
            for(var i = 0; i < banner_elements.length; i++){
                banner_elements[i].style.backgroundImage = "url('"+url+"')";
            }
            setTimeout(()=>{ URL.revokeObjectURL(url) }, 2000)
        }
        document.body.removeChild(wrapper);
    })
    return input;
}


(function() {
    'use strict';
    setTimeout(function(){
        var banner_elements = Array.prototype.slice.call(document.querySelectorAll('.owl-item div.PushCommunication-backgroundWrapper > div'))
        console.log(banner_elements)
        var clicked = false;
        if(banner_elements && banner_elements.length > 0){
            for(var i = 0; i < banner_elements.length; i++){
                var banner_element = banner_elements[i];
                var change_me = document.createElement('button');
                change_me.innerText = 'Changez moi !'
                change_me.style.position = 'absolute';
                change_me.style.zIndex = '100';
                change_me.onclick = () => {
                    if(!clicked) showImageInput()
                    clicked = true;
                }
                banner_element.appendChild(change_me)
                banner_element.style.border = '1px solid red';
            }
        }
    },2000)
})();
