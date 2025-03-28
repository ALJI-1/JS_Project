'use strict';  

const url = "https://seido-webservice-307d89e1f16a.azurewebsites.net/api"; 

const listOfItems = document.querySelector('#list-of-items'); 

const nextButton = document.querySelector('#next-btn');  
const previousButton = document.querySelector('#prev-btn');
const pageInfo = document.querySelector('#page-info');

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


async function myFetch(url, method = null, body = null) 
{
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
        if (!res.ok) { 
            throw new Error(`Lyckades inte hämta data från API: ${res.status}`);
        }
    } 
    catch (err) 
    { 
        console.log(`Lyckades inte hämta data från API: ${err.message}`);
        alert(`Lyckades inte hämta data från API: ${err.message}`);
        return null;
    }
}


async function getMusicGroups() {

    const pageNr = currentPage -1; 
    const reqUrl = `${url}/MusicGroup/Read?flat=false&pageNr=${pageNr}&pageSize=${itemsPerPage}`;
    const data = await myFetch(reqUrl); 

    if (data) { 
        pageCount = data.pageCount; 
        fillList(data.pageItems);
        pageInfo.textContent = `Sida ${currentPage} av ${pageCount}`; 
        //previousButton.disabled = currentPage === 1;
        //nextButton.disabled = currentPage === pageCount;
    } 
}
// async function getMusicGroups(page) {
//     const pageNr = page ?? -1; // API börjar på 0, därför -1
    
//     const reqUrl = `${url}/MusicGroup/Read?flat=false&pageNr=${pageNr}&pageSize=${itemsPerPage}`; // Bygger upp URL för att hämta data
    
//     const data = await myFetch(reqUrl); // anropar myFetch med URL och sparar resultatet i variabeln data
//     if (data) { 
//         pageCount = data.pageCount; // pageCount är data som följer med från API:et och är antal sidor med 10 artister per sida
//         fillList(data.pageItems); // Anropar fillList med datan som kom med api 
//         pageInfo.textContent = `Sida ${page} av ${pageCount}`; // Ger användaren information om vilken sida de är på
        
//         // Beroende på sida så aktiveras och avaktiveras knapparna
//         previousButton.disabled = page === 1;
//         nextButton.disabled = page === pageCount;
//     } 
// }


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

// Eventlistener för knapparna. De ändrar värde på currenPage som håller koll på vart i lstan man är
// De använder arrow function / lambda för att skapa en anonym funktion 
// nextButton.addEventListener('click', async () => { 
//     if (currentPage < pageCount) {
//         currentPage++;
//         await getMusicGroups(currentPage); // anropar metoden för att fylla listan med ny data 
//     }
// });

// previousButton.addEventListener('click', async () => {
//     if (currentPage > 1) {
//         currentPage--;
//         await getMusicGroups(currentPage);
//     }
// });


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


(async () => {


        await getMusicGroups();
    })();

// (async () => {
//     document.addEventListener('DOMContentLoaded', async () => {
//         await getMusicGroups(); 
//     });
// })();
