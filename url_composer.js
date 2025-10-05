// ==UserScript==
// @name         URL Manipulator for Credit Agricole and Author Pages
// @namespace    https://www.credit-agricole.fr/*
// @version      0.1
// @description  Tool to convert between different URL formats for Credit Agricole pages
// @author       You
// @match        https://bdig-author.ca-technologies.fr/*
// @match        https://www.credit-agricole.fr/ca-*
// @downloadURL  https://github.com/Jordinateur/cabp_userscripts/raw/master/url_composer.js
// @updateURL    https://github.com/Jordinateur/cabp_userscripts/raw/master/url_composer.js
// @grant        GM_addStyle
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';

    // Base URLs and prefixes (same as before)
    const BASE_AUTHOR = 'https://bdig-author.ca-technologies.fr/editor.html';
    const BASE_NPC = 'https://www.credit-agricole.fr';
    const NPC_PREFIX = '/ca-briepicardie';
    const AUTHOR_CONTENT_PREFIX = '/content/ca/cr887/npc/fr';

    // Create the floating button
    function createFloatingButton() {
        if (document.getElementById('url-converter-button')) return;

        const btn = document.createElement('button');
        btn.id = 'url-converter-button';
        btn.textContent = '🔄 URL Converter';
        btn.style.position = 'fixed';
        btn.style.bottom = '20px';
        btn.style.left = '20px';
        btn.style.zIndex = '9999';
        btn.style.padding = '10px 15px';
        btn.style.backgroundColor = '#3498db';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '25px';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '16px';
        btn.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';

        btn.addEventListener('click', showModal);

        document.body.appendChild(btn);
    }

    // Create the modal
    function createModal() {
        const modal = document.createElement('div');
        modal.id = 'url-converter-modal';
        modal.style.display = 'none';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        modal.style.zIndex = '10000';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';

        const content = document.createElement('div');
        content.id = 'url-converter-content';
        content.style.backgroundColor = 'white';
        content.style.padding = '20px';
        content.style.borderRadius = '8px';
        content.style.maxWidth = '900px';
        content.style.width = '90%';
        content.style.maxHeight = '90vh';
        content.style.overflow = 'auto';

        modal.appendChild(content);
        document.body.appendChild(modal);

        // Add the HTML content
        const html = `
            <h1 style="color: #2c3e50; text-align: center; margin-bottom: 30px;">Manipulateur d'URL multi-format</h1>
             <div class="notes" style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 4px; font-size: 14px; color: #666;">
                <p>1. Entrez une URL dans n'importe quel champ et les autres seront mis à jour automatiquement.</p>
                <p>2. Les formats supportés sont :</p>
                <ul style="padding-left: 20px; margin: 5px 0;">
                    <li><strong>Author:</strong> https://bdig-author.ca-technologies.fr/editor.html/content/...</li>
                    <li><strong>NPC:</strong> https://www.credit-agricole.fr/ca-briepicardie/particulier/operations/...</li>
                    <li><strong>Short NPC:</strong> /ca-briepicardie/particulier/operations/...</li>
                    <li><strong>Short Author:</strong> /content/ca/cr887/npc/fr/particulier/operations/...</li>
                </ul>
            </div>
            <div class="input-grid" style="display: grid; grid-template-columns: repeat(1, 1fr); gap: 20px;">
                <div class="form-group" style="display: flex; flex-direction: column; margin-bottom: 20px;">
                    <label for="authorUrl" style="font-weight: bold; margin-bottom: 8px; color: #2c3e50;">Author URL :</label>
                    <input type="text" id="authorUrl" placeholder="https://bdig-author.ca-technologies.fr/editor.html/content/ca/cr887/npc/fr/particulier/operations/placements/assurance-vie.html" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;">
                </div>

                <div class="form-group" style="display: flex; flex-direction: column; margin-bottom: 20px;">
                    <label for="npcUrl" style="font-weight: bold; margin-bottom: 8px; color: #2c3e50;">NPC URL :</label>
                    <input type="text" id="npcUrl" placeholder="https://www.credit-agricole.fr/ca-briepicardie/particulier/operations/placements/assurance-vie.html" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;">
                </div>

                <div class="form-group" style="display: flex; flex-direction: column; margin-bottom: 20px;">
                    <label for="shortNpc" style="font-weight: bold; margin-bottom: 8px; color: #2c3e50;">Short NPC :</label>
                    <input type="text" id="shortNpc" placeholder="/ca-briepicardie/particulier/operations/placements/assurance-vie.html" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;">
                </div>

                <div class="form-group" style="display: flex; flex-direction: column; margin-bottom: 20px;">
                    <label for="shortAuthor" style="font-weight: bold; margin-bottom: 8px; color: #2c3e50;">Short Author :</label>
                    <input type="text" id="shortAuthor" placeholder="/content/ca/cr887/npc/fr/particulier/operations/placements/assurance-vie.html" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;">
                </div>
            </div>

            <div style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">
                <button onclick="copyToClipboard('authorUrl')" style="background-color: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 16px;">Copier Author</button>
                <button onclick="copyToClipboard('npcUrl')" style="background-color: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 16px;">Copier NPC</button>
                <button onclick="copyToClipboard('shortNpc')" style="background-color: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 16px;">Copier Short NPC</button>
                <button onclick="copyToClipboard('shortAuthor')" style="background-color: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 16px;">Copier Short Author</button>
                <button id="url-converter-close-modal" style="background-color: #e74c3c; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 16px;">Fermer</button>
            </div>
        `;

        content.innerHTML = html;
    }
    const handleEsc = (e) => {
            if(e.key==='Escape') {
                closeModal();
                window.removeEventListener('keyup', handleEsc)
            }
        }
    // Show modal
    function showModal() {
        let modal = document.getElementById('url-converter-modal');
        if (!modal) {
            createModal();
            setupEventListeners();
            modal = document.getElementById('url-converter-modal');
        }
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Initialize with current page URL if it matches one of our formats
        const currentUrl = window.location.href;
        if (currentUrl.includes('bdig-author.ca-technologies.fr') && currentUrl.includes('/editor.html/')) {
            document.getElementById('authorUrl').value = currentUrl;
            updateAllFromAuthor();
        } else if (currentUrl.includes('credit-agricole.fr') && currentUrl.includes('/ca-briepicardie/particulier/operations/')) {
            document.getElementById('npcUrl').value = currentUrl;
            updateAllFromNpc();
        }
        
        window.addEventListener('keyup', handleEsc)
    }

    // Close modal
    function closeModal() {
        const modal = document.getElementById('url-converter-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
        window.removeEventListener('keyup', handleEsc)
    }
    // Event listeners for the inputs
    function setupEventListeners() {
        const authorInput = document.getElementById('authorUrl');
        const npcInput = document.getElementById('npcUrl');
        const shortNpcInput = document.getElementById('shortNpc');
        const shortAuthorInput = document.getElementById('shortAuthor');
        const closeModalButton = document.getElementById('url-converter-close-modal')
        if (authorInput) authorInput.addEventListener('input', updateAllFromAuthor);
        if (npcInput) npcInput.addEventListener('input', updateAllFromNpc);
        if (shortNpcInput) shortNpcInput.addEventListener('input', updateAllFromShortNpc);
        if (shortAuthorInput) shortAuthorInput.addEventListener('input', updateAllFromShortAuthor);
        if (closeModalButton) closeModalButton.addEventListener('click', closeModal);

        // Add to window for copy buttons
        window.copyToClipboard = function(id) {
            const input = document.getElementById(id);
            if (!input || !input.value.trim()) return;

            GM_setClipboard(input.value).then(() => {
                // Brief visual feedback
                const originalValue = input.value;
                input.value = 'Copié !';
                setTimeout(() => {
                    input.value = originalValue;
                }, 1000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
                alert('Échec de la copie. Veuillez copier manuellement.');
            });
        };

        window.updateAllFromAuthor = updateAllFromAuthor;
        window.updateAllFromNpc = updateAllFromNpc;
        window.updateAllFromShortNpc = updateAllFromShortNpc;
        window.updateAllFromShortAuthor = updateAllFromShortAuthor;
        window.closeModal = closeModal;
        
    }

    // Update functions (same as before)
    function updateAllFromAuthor() {
        const authorUrl = document.getElementById('authorUrl').value.trim();

        if (!authorUrl) {
            resetFields();
            return;
        }

        try {
            let pathStart = authorUrl.indexOf('/editor.html/');
            if (pathStart === -1) {
                throw new Error("Format Author invalide");
            }
            pathStart += '/editor.html'.length;

            const contentPath = authorUrl.substring(pathStart);

            document.getElementById('npcUrl').value = BASE_NPC + NPC_PREFIX + contentPath.replace('fr/', '');
            document.getElementById('shortNpc').value = NPC_PREFIX + contentPath.replace('fr/', '');
            document.getElementById('shortAuthor').value = AUTHOR_CONTENT_PREFIX + contentPath;
        } catch (e) {
            console.error(e);
            resetFields();
        }
    }

    function updateAllFromNpc() {
        const npcUrl = document.getElementById('npcUrl').value.trim();

        if (!npcUrl) {
            resetFields();
            return;
        }

        try {
            let pathStart = npcUrl.indexOf(NPC_PREFIX);
            if (pathStart === -1) {
                throw new Error("Format NPC invalide");
            }
            pathStart += NPC_PREFIX.length;

            const contentPath = npcUrl.substring(pathStart);

            document.getElementById('authorUrl').value = BASE_AUTHOR + AUTHOR_CONTENT_PREFIX + '/fr' + contentPath;
            document.getElementById('shortNpc').value = NPC_PREFIX + contentPath;
            document.getElementById('shortAuthor').value = AUTHOR_CONTENT_PREFIX + '/fr' + contentPath;
        } catch (e) {
            console.error(e);
            resetFields();
        }
    }

    function updateAllFromShortNpc() {
        const shortNpc = document.getElementById('shortNpc').value.trim();

        if (!shortNpc) {
            resetFields();
            return;
        }

        try {
            let pathStart = shortNpc.indexOf(NPC_PREFIX);
            if (pathStart !== 0 || !shortNpc.startsWith(NPC_PREFIX)) {
                throw new Error("Format Short NPC invalide");
            }
            pathStart += NPC_PREFIX.length;

            const contentPath = shortNpc.substring(pathStart);

            document.getElementById('authorUrl').value = BASE_AUTHOR + AUTHOR_CONTENT_PREFIX + '/fr' + contentPath;
            document.getElementById('npcUrl').value = BASE_NPC + shortNpc;
            document.getElementById('shortAuthor').value = AUTHOR_CONTENT_PREFIX + '/fr' + contentPath;
        } catch (e) {
            console.error(e);
            resetFields();
        }
    }

    function updateAllFromShortAuthor() {
        const shortAuthor = document.getElementById('shortAuthor').value.trim();

        if (!shortAuthor) {
            resetFields();
            return;
        }

        try {
            let pathStart = shortAuthor.indexOf(AUTHOR_CONTENT_PREFIX);
            if (pathStart !== 0 || !shortAuthor.startsWith(AUTHOR_CONTENT_PREFIX)) {
                throw new Error("Format Short Author invalide");
            }
            pathStart += AUTHOR_CONTENT_PREFIX.length;

            const contentPath = shortAuthor.substring(pathStart);

            document.getElementById('authorUrl').value = BASE_AUTHOR + contentPath;
            if (contentPath.startsWith('fr/')) {
                document.getElementById('npcUrl').value = BASE_NPC + NPC_PREFIX + contentPath.substring(3);
                document.getElementById('shortNpc').value = NPC_PREFIX + contentPath.substring(3);
            } else {
                throw new Error("Chemin Short Author manque la partie 'fr/'");
            }
        } catch (e) {
            console.error(e);
            resetFields();
        }
    }

    function resetFields() {
        document.getElementById('authorUrl').value = '';
        document.getElementById('npcUrl').value = '';
        document.getElementById('shortNpc').value = '';
        document.getElementById('shortAuthor').value = '';
    }

    // Main execution
    function main() {
        if (window.location.hostname.includes('bdig-author.ca-technologies.fr') ||
            window.location.hostname.includes('credit-agricole.fr')) {
            createFloatingButton();

            // Add some global styles for the modal
            const style = document.createElement('style');
            style.textContent = `
                #url-converter-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0,0,0,0.5);
                    z-index: 10000;
                    display: none;
                    justify-content: center;
                    align-items: center;
                }

                #url-converter-content {
                    background-color: white;
                    padding: 20px;
                    border-radius: 8px;
                    max-width: 900px;
                    width: 90%;
                    max-height: 90vh;
                    overflow: auto;
                }

                .input-grid {
                    display: grid;
                    grid-template-columns: repeat(1, 1fr);
                    gap: 20px;
                }

                .form-group label {
                    font-weight: bold;
                    margin-bottom: 8px;
                    color: #2c3e50;
                }

                .form-group input[type="text"] {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 16px;
                    transition: border-color 0.3s;
                }

                .form-group input[type="text"]:focus {
                    border-color: #3498db;
                    outline: none;
                    box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);
                }
            `;
            document.head.appendChild(style);
        }
    }

    main();
})();