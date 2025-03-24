'use strict';

const url = "https://seido-webservice-307d89e1f16a.azurewebsites.net/api";

let currentPage = 0;
let pageCount = 0;
let listOfItems;
let prevBtn;
let nextBtn;
let pageInfo;

async function myFetch(url, method = null, body = null) {
    try {
        method ??= 'GET';
        let res = await fetch(url, {
            method: method,
            headers: { 'content-type': 'application/json' },
            body: body ? JSON.stringify(body) : null
        });
        if (res.ok) {
            console.log(`\n${method} Request successful @ ${url}`);
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

function clearList() {
    while (listOfItems.firstChild) {
        listOfItems.removeChild(listOfItems.firstChild);
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

async function getMusicGroups() {
    const reqUrl = `${url}/MusicGroup/Read?flat=false&pageNr=${currentPage}&pageSize=10`;
    const data = await myFetch(reqUrl);
    if (data) {
        pageCount = data.pageCount;
        fillList(data.pageItems);
        pageInfo.textContent = `Sida ${currentPage + 1} av ${pageCount}`;
        prevBtn.disabled = currentPage === 0;
        nextBtn.disabled = currentPage === pageCount - 1;
    }
}

function init() {
    listOfItems = document.getElementById('list-of-items');
    prevBtn = document.getElementById('prev-btn');
    nextBtn = document.getElementById('next-btn');
    pageInfo = document.getElementById('page-info');
    prevBtn.addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage -= 1;
            getMusicGroups();
        }
    });
    nextBtn.addEventListener('click', () => {
        if (currentPage < pageCount - 1) {
            currentPage += 1;
            getMusicGroups();
        }
    });
    getMusicGroups();
}

document.addEventListener('DOMContentLoaded', init);