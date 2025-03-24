'use strict';  

const url = "https://seido-webservice-307d89e1f16a.azurewebsites.net/api";

const listOfItems = document.querySelector('#list-of-items');
const nextButton = document.querySelector('#next-btn');
const previousButton = document.querySelector('#prev-btn');
const pageInfo = document.querySelector('#page-info');

let currentPage = 1;
const itemsPerPage = 10;
let pageCount = 0;

async function myFetch(url, method = null, body = null) {
    try {
        method ??= 'GET';
        let res = await fetch(url, {
            method: method,
            headers: { 'content-type': 'application/json' },
            body: body ? JSON.stringify(body) : null
        });
        if (res.ok) {
            console.log(`${method} Request successful @ ${url}`);
            let data = await res.json();
            return data;
        } 
        else {
            console.log(`Failed to receive data from server: ${res.status}`);
            alert(`Failed to receive data from server: ${res.status}`);
            return null;
        }
    } 
    catch (err) 
    {
        console.log(`Failed to receive data from server: ${err.message}`);
        alert(`Failed to receive data from server: ${err.message}`);
        return null;
    }
}


async function getMusicGroups() {
    const pageNr = currentPage - 1;
    const reqUrl = `${url}/MusicGroup/Read?flat=false&pageNr=${pageNr}&pageSize=${itemsPerPage}`;
    const data = await myFetch(reqUrl);
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
    for (const group of musicGroups) {
        const li = document.createElement('li');
        li.dataset.itemId = group.musicGroupId; // Unikt ID för varje grupp
        const a = document.createElement('a');
        a.innerText = group.name;
        a.href = `DetailPage.html?id=${group.musicGroupId}`; // Länk till detaljsida
        li.appendChild(a);
        listOfItems.appendChild(li);
    }
}

function clearList() {
    while (listOfItems.firstChild) {
        listOfItems.removeChild(listOfItems.firstChild);
    }
}

nextButton.addEventListener('click', () => {
    if (currentPage < pageCount) {
        currentPage++;
        getMusicGroups();
    }
});

previousButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        getMusicGroups();
    }
});
function searchMusicGroups() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const reqUrl = `${url}/MusicGroup/Read?flat=true`;
    myFetch(reqUrl)
        .then(data => {
            if (data) {
                const filteredGroups = data.pageItems.filter(group =>
                    group.name.toLowerCase().includes(searchInput)
                );
                fillList(filteredGroups);
            }
        });
}

document.addEventListener('DOMContentLoaded', () => {
    getMusicGroups(currentPage);
});