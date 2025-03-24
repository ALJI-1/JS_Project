'use strict';  

const url = "https://seido-webservice-307d89e1f16a.azurewebsites.net/api";

const listOfItems = document.querySelector('#list-of-items');
const nextButton = document.querySelector('#next-btn');
const previousButton = document.querySelector('#prev-btn');

let currentPage = 1;
const itemsPerPage = 10;
let pageCount = 0;
let nextBtn;
const pageInfo = document.querySelector('#page-info') || document.createElement('div');
if (!document.querySelector('#page-info')) {
    pageInfo.id = 'page-info';
    document.body.appendChild(pageInfo);
}
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
        } else {
            console.log(`Failed to receive data from server: ${res.status}`);
            alert(`Failed to receive data from server: ${res.status}`);
        }
    } catch (err) {
        console.log(`Failed to receive data from server: ${err.message}`);
        alert(`Failed to receive data from server: ${err.message}`);
    }
}

async function getMusicGroups(page = currentPage) {
    const reqUrl = `${url}/MusicGroup/Read?flat=false&pageNr=${page}&pageSize=${itemsPerPage}`;
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
function updateByButtons() {
    previousButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage >= pageCount;
}
nextButton.addEventListener('click', () => {
    currentPage++;
    getMusicGroups();
});

previousButton.addEventListener('click', () => {
    currentPage--;
    getMusicGroups(currentPage);
});

document.addEventListener('DOMContentLoaded', () => {
    getMusicGroups(currentPage);
});