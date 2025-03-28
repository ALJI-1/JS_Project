'use strict';  

import { musicService } from './services/service.js';
const url = "https://seido-webservice-307d89e1f16a.azurewebsites.net/api"; 
const api = new musicService(url);
const listOfItems = document.querySelector('#list-of-items'); 

const nextButton = document.querySelector('#next-btn');  
const previousButton = document.querySelector('#prev-btn');
const pageInfo = document.querySelector('#page-info');

const searchButton = document.querySelector('#search-btn');
//searchButton.addEventListener('click', () => api.clickHandlerSearch());
searchButton.addEventListener('click', clickHandlerSearch);

function clickHandlerSearch() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const reqUrl = `${url}/MusicGroup/Read?flat=true`; 
    api.myFetch(reqUrl)
        .then(data => { 
            if (data) { 
                const filteredGroups = data.pageItems.filter(group =>
                    group.name.toLowerCase().includes(searchInput)
                );
                fillList(filteredGroups);
            }
        });
}

let currentPage = 1; 
const itemsPerPage = 10; 
let pageCount = 0; 

nextButton.addEventListener('click', async () => {
    if (currentPage < pageCount) {
        currentPage++;
        await getMusicGroups();
    }
});

previousButton.addEventListener('click', async () => {
    if (currentPage > 1) {
        currentPage--;
        await getMusicGroups();
    }
});


async function getMusicGroups() {

    const pageNr = currentPage -1; 
    const reqUrl = `${url}/MusicGroup/Read?flat=false&pageNr=${pageNr}&pageSize=${itemsPerPage}`;
    const data = await api.myFetch(reqUrl);

    if (data) { 
        pageCount = data.pageCount; 
        fillList(data.pageItems);
        pageInfo.textContent = `Sida ${currentPage} av ${pageCount}`; 
        previousButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === pageCount;
    } 

}


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