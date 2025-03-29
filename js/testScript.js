// js/ListPage.js (assuming testScript.js is your ListPage.js)
'use strict';

import { musicService } from './services/service.js';

const url = "https://seido-webservice-307d89e1f16a.azurewebsites.net/api";
const api = musicService(url);

const listOfItems = document.querySelector('#list-of-items');
const nextButton = document.querySelector('#next-btn');
const previousButton = document.querySelector('#prev-btn');
const pageInfo = document.querySelector('#page-info');
const searchButton = document.getElementById('search-btn');

let currentPage = 1;
const itemsPerPage = 10;
let pageCount = 0;

searchButton.addEventListener('click', clickHandlerSearch);

async function clickHandlerSearch(event) {
    event.preventDefault(); // Prevent form submission
    const searchInput = document.getElementById('search-input').value.toLowerCase();

    try {
        currentPage = 1; // Reset to the first page for new search
        const data = await api.readMusicGroupsAsync(currentPage - 1, false, searchInput, itemsPerPage);

        if (data) {
            pageCount = data.pageCount;
            fillList(data.pageItems);
            pageInfo.textContent = `Sida ${currentPage} av ${pageCount}`;
            previousButton.disabled = currentPage === 1;
            nextButton.disabled = currentPage === pageCount;

            // Store the search input for pagination
            nextButton.dataset.searchQuery = searchInput;
            previousButton.dataset.searchQuery = searchInput;
        } else {
            clearList();
            pageInfo.textContent = 'Inga resultat hittades.';
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        clearList();
        pageInfo.textContent = 'Ett fel inträffade vid hämtning av data.';
    }
}
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

function fillList(musicGroups) {
    clearList();

    musicGroups.forEach((group, index) => {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        li.dataset.itemId = group.musicGroupId;

        if (index % 2 === 0) {
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

function clearList() {
    while (listOfItems.firstChild) {
        listOfItems.removeChild(listOfItems.firstChild);
    }
}

(async () => {
    await getMusicGroups();
})();