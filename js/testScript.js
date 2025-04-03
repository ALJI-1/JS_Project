
'use strict';
// Hämtar hjälpmetoder från servises
import { musicService } from './services/service.js';

const url = "https://seido-webservice-307d89e1f16a.azurewebsites.net/api";
const api = musicService(url);

// Hämtar HTML-elementen som ska användas i koden
const listOfItems = document.querySelector('#list-of-items');
const nextButton = document.querySelector('#next-btn');
const previousButton = document.querySelector('#prev-btn');
const pageInfo = document.querySelector('#page-info');
const searchButton = document.getElementById('search-btn');

let currentPage = 1;
const itemsPerPage = 10;
let pageCount = 0;

searchButton.addEventListener('click', clickHandlerSearch); // Om användaren trycker på sök knappen så anropas funktionen clickHandlerSearch

// Metoden skickar en förfrågan till api med sök input och hämtar de grupper som matchar sökningen
// EFtersom den kommunicerar med api så använder jag try-catch 
async function clickHandlerSearch(event) {
    event.preventDefault();
    const searchInput = document.getElementById('search-input').value.toLowerCase();

    try {
        currentPage = 1; 
        // Använder en funktion från services. tredje argumentet är de man fått från användaren
        const data = await api.readMusicGroupsAsync(currentPage - 1, false, searchInput, itemsPerPage);

        if (data) {
            pageCount = data.pageCount;
            fillList(data.pageItems);
            pageInfo.textContent = `Sida ${currentPage} av ${pageCount}`;
            
            // Knapparna slås på och av beroende om det finns data på nästa sida
            previousButton.disabled = currentPage === 1;
            nextButton.disabled = currentPage === pageCount;

            nextButton.dataset.searchQuery = searchInput;
            previousButton.dataset.searchQuery = searchInput;
        } else {
            clearList();
            pageInfo.textContent = 'Inga resultat hittades.';
        }
    } catch (error) {
        clearList();
        pageInfo.textContent = 'Ett fel inträffade vid hämtning av data.';
    }
}

// Funktionen som anropas vid start av programmet och  som kommunicerar med api:t och hämtar musikgrupper
// Om det lyckades så anropas funktionen fillList som fyller listan med musikgrupperna. 

async function getMusicGroups(searchQuery = null) {
    const pageNr = currentPage - 1; 
    const data = await api.readMusicGroupsAsync(pageNr, false, searchQuery, itemsPerPage);

    if (data) {
        pageCount = data.pageCount;
        fillList(data.pageItems);
        pageInfo.textContent = `Sida ${currentPage} av ${pageCount}`;
        previousButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === pageCount;
    } else {
        clearList();
        pageInfo.textContent = 'Kunde inte hämta musikgrupper.';
    }
}
// Två eventlyssnare för knapparna som byter sida i listan
nextButton.addEventListener('click', async () => {
    const searchQuery = nextButton.dataset.searchQuery || null;
    if (currentPage < pageCount) {
        currentPage++;
        await getMusicGroups(searchQuery);
    }
});

previousButton.addEventListener('click', async () => {
    const searchQuery = previousButton.dataset.searchQuery || null;
    if (currentPage > 1) {
        currentPage--;
        await getMusicGroups(searchQuery);
    }
});

// Funktion som skapar ett nytt list-element varje musikgrupp som har hämtats från api, ger den lite styling och lägger till den i listan
function fillList(musicGroups) {
    // Vid varje ny byte av sida med grupper så rensas listan
    clearList();
    musicGroups.forEach((group, index) => {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        li.dataset.itemId = group.musicGroupId; // Sparar gruppens id

        if (index % 2 === 0) {// varannan rad ljusare för de estetikska
            li.classList.add('list-group-item-light');
        }

        const nameSpan = document.createElement('span');
        nameSpan.innerText = group.name;

        const detailButton = document.createElement('a');
        detailButton.classList.add('btn', 'btn-primary', 'btn-sm');
        detailButton.innerText = 'Detaljer';
        detailButton.href = `DetailPage.html?id=${group.musicGroupId}`;

        li.appendChild(nameSpan);
        li.appendChild(detailButton);
        listOfItems.appendChild(li);
    });
}

// En funktion som rensar listan på musikgrupper
function clearList() {
    while (listOfItems.firstChild) {
        listOfItems.removeChild(listOfItems.firstChild);
    }
}

// Startar sidan genomen att hämta musikgrupper asynkront
(async () => {
    await getMusicGroups();
})();