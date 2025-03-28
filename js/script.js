'use strict';  

const url = "https://seido-webservice-307d89e1f16a.azurewebsites.net/api"; // bas-url för API

const listOfItems = document.querySelector('#list-of-items'); // Hämtar id från HTML där listan ska fyllas
// Hämtar id från HTML för knappar och sidinformation
const nextButton = document.querySelector('#next-btn');  
const previousButton = document.querySelector('#prev-btn');
const pageInfo = document.querySelector('#page-info');

let currentPage = 1; // Startvärde för sidnummer
const itemsPerPage = 10; // Antal artister per sida
let pageCount = 0; // variabel som används för att räkna antal sidor

// Metod för att asyncront hämta data från API och returnerar data i JSON format om den lyckas, annars null. 
// inparameter url är adressen till api. method är vilken typ av request (GET i detta fall),
// body är jag lite osäker på men läst att man kan skicka med data om man vill. "url" är den enda obligatoriska parametern.
async function myFetch(url, method = null, body = null) 
{
    // Använder try-catch för att hantera fel
    try {
        // Om method är null så får den värde GET som är ett standardvärde för att hämta data
        method ??= 'GET'; 

        // Fetch-metod som levererar en Promise 
        let res = await fetch(url, {

            // Detta behövs för att API:et ska förstå att det är JSON-data som skickas
            method: method,
            headers: { 'content-type': 'application/json' },
            body: body ? JSON.stringify(body) : null // Om body inte är null så konverteras värdet till JSON innan det skickas
        });

        if (res.ok) { // Om det gick att hämta data, res.ok är en egenskap som finns i fetch
            console.log(`${method} Request successful @ ${url}`); // Skriver ut i konsollen att det gick att hämta data
            let data = await res.json(); // väntar på att data ska hämtas med await, sparas i variabeln res och parsas till JSON
            return data; // Returnerar data
        } 
        if (!res.ok) { // om det inte gick att hämta data så kastas ett fel
            throw new Error(`Lyckades inte hämta data från API: ${res.status}`);
        }
    } 
    catch (err) 
    { // Loggar och upplyser användaren om att det inte gick att hämta data, kan bero på olika saker som parsing, nätverksfel, api:t etc.
        console.log(`Lyckades inte hämta data från API: ${err.message}`);
        alert(`Lyckades inte hämta data från API: ${err.message}`);
        return null;
    }
}

// async funktion som hämtar data från API:et och fyller listan med data
async function getMusicGroups() {
    const pageNr = currentPage -1; // API börjar på 0, därför -1
    
    const reqUrl = `${url}/MusicGroup/Read?flat=false&pageNr=${pageNr}&pageSize=${itemsPerPage}`; // Bygger upp URL för att hämta data
    //const reqUrl = `${url}/MusicGroup/Read?flat=false&pageNr=2&pageSize=10`; // Bygger upp URL för att hämta data
    
    const data = await myFetch(reqUrl); // anropar myFetch med URL och sparar resultatet i variabeln data
    if (data) { 
        pageCount = data.pageCount; // pageCount är data som följer med från API:et och är antal sidor med 10 artister per sida
        fillList(data.pageItems); // Anropar fillList med datan som kom med api 
        pageInfo.textContent = `Sida ${currentPage} av ${pageCount}`; // Ger användaren information om vilken sida de är på
        
        // Beroende på sida så aktiveras och avaktiveras knapparna
        previousButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === pageCount;
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

// funktion som fyller listan med musikgrupperna
function fillList(musicGroups) {
    
    clearList(); // anropar metoden för att rensa listan från tidigare data

    // Loopar igenom varje grupp och skapar ett li-element för varje grupp
    musicGroups.forEach((group, index) => {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        li.dataset.itemId = group.musicGroupId; // skapar ett unikt ID för varje grupp
        
        // Zebra-stripes: varannan rad får en ljusare bakgrund (bootstrap)
        if (index % 2 === 0) {
            li.classList.add('list-group-item-light');
        }

        // Skapa ett span-element för namnet
        const nameSpan = document.createElement('span');
        nameSpan.innerText = group.name; // Texten är namnet på gruppen

        // Skapa en knapp för detaljer
        const detailButton = document.createElement('a');
        detailButton.classList.add('btn', 'btn-primary', 'btn-sm'); // Bootstrap-styling för knappen
        detailButton.innerText = 'Detaljer';
        detailButton.href = `DetailPage.html?id=${group.musicGroupId}`; // länk till detaljsida

        // Lägger till namnet och knappen i li-taggen, och li-taggen i listan
        li.appendChild(nameSpan);
        li.appendChild(detailButton);
        listOfItems.appendChild(li);
    });
}
 // en metod som rensar listan från alla element, används innan listan ska fyllas med ny data
function clearList() {
    while (listOfItems.firstChild) { // Om det finns något element i listofitems så körs loopen
        listOfItems.removeChild(listOfItems.firstChild); // Tar bort första elementet i listan tills det inte finns något kvar
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

// En metod som söker i all data från api för att hitta det användaren söker efter
function searchMusicGroups() {
    const searchInput = document.getElementById('search-input').value.toLowerCase(); // hämtar värdet från sökfältet
    const reqUrl = `${url}/MusicGroup/Read?flat=true`; // reqUrl är adressen till api:et för att hämta all data
    myFetch(reqUrl)
        .then(data => { // metod som hanterar asynkrona metoder i JS.
            if (data) { // om det finns data
                // ett uttryck som filtrerar grupper. om söksträngen finns i namnet på gruppen så läggs den till i en ny array
                const filteredGroups = data.pageItems.filter(group =>
                    group.name.toLowerCase().includes(searchInput)
                );
                fillList(filteredGroups); // anropar metoden för att fylla listan med filtrerad data
            }
        });
}

(async () => {
    document.addEventListener('DOMContentLoaded', async () => {
        const nextButton = document.querySelector('#next-btn');
        const previousButton = document.querySelector('#prev-btn');

        // event listeners for the buttons
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

        // Fetch and display the initial data
        await getMusicGroups();
    });
})();
// (async () => {
//     document.addEventListener('DOMContentLoaded', async () => {
//         await getMusicGroups(); 
//     });
// })();
