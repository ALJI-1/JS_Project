'use strict';

import { musicService } from './services/service.js';
const url = "https://seido-webservice-307d89e1f16a.azurewebsites.net/api";
const _service = new musicService(url);

// Jag har svurit över den här sidan. Jag har inte fått den att funka utan att använda "document.addEventListener('DOMContentLoaded', async (){}..." 
// Jag förstår vad varför jag använder den - för att alla html-element ska vara laddade innan jag försöker komma år dem. Men Jag har inte denna struktur på min andra JS-fil 
// På ListPage kör jag en iife som startar sidan men jag har inte fått det att funka här. 
// Jag har tagit hjälp av AI och den rekommenderade att använda "document.addEventListener('DOMContentLoaded', async () =>" så det gjorde jag..

document.addEventListener('DOMContentLoaded', async () => {

    const albumList = document.querySelector('#listOfAlbums');
    const artistList = document.querySelector('#listOfArtists');
    const groupName = document.querySelector('#bandName');
    const genre = document.querySelector('#musicGenre');
    const established = document.querySelector('#establishedYear');

    // i groupId sparas ett id från artisten som också finns i browserns url när man valt en specifik artist
    // UrlSearchParams läser av url i browsern. window.locaton.search specifierar att de vi kollar efter är de som finns efrter "?"
    // .get hämtar de som argumentet i parantererna matchar med i urlen som i detta fall är artistens unika id
    const groupId = new URLSearchParams(window.location.search).get('id');

    //eftersom vi kommunicerar med något externt är de bra att använda en trycatch
    try {
       
        // använder en funktion från services som jag skickar in de nyligen hämtade idt, false för att vi inte behöver den mest detaljerade datan
        const groupDetails = await _service.readMusicGroupAsync(groupId, false);

        if (!groupDetails) { // Kollar om det finns data 
            throw new Error('Ingen grupp hittades med det angivna id).');
        }

        // datan vi fick från apit fördelar vi ut rätt i html-elementen och om de är falsy så sätter vi deafaultvärden att data saknas
        groupName.value = groupDetails.name || 'Data saknas';
        genre.value = groupDetails.strGenre || 'Data saknas';
        established.value = groupDetails.establishedYear || 'Data saknas';

   
        // Här fick jag också hjälp av AI att hitta en lösning men jag förstår vad jag gör. Det första jag gör ärt att kolla att "artists" finns med som property i datan jag får från apit
        // och att artisterna finns i en array med funktionen "isArray" Sedan loopar jag med foreach för genom arrayen och varje obj i arrayen plockas ut och får 
        // en li-tag, lite styling, ett span för att printa namnen och sen läggs de till i listan
        if (groupDetails.artists && Array.isArray(groupDetails.artists)) {
            groupDetails.artists.forEach((artist, index) => {
                const li = document.createElement('li');
                li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

                const nameSpan = document.createElement('span');
                nameSpan.innerText = `${artist.firstName} ${artist.lastName}`;

                li.appendChild(nameSpan);
                artistList.appendChild(li);
            });
            // om de saknas data så skrivs de ut i listan istället
        } else {
            const li = document.createElement('li');
            li.innerText = 'Inga artister hittades.';
            artistList.appendChild(li);
        }

      // Lika som ovan men här är de album
        if (groupDetails.albums && Array.isArray(groupDetails.albums)) {
            groupDetails.albums.forEach((album, index) => {
                const li = document.createElement('li');
                li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

                if (index % 2 === 0) {
                    li.classList.add('list-group-item-light');
                }
                const nameSpan = document.createElement('span');
                nameSpan.innerText = album.name;
                li.appendChild(nameSpan);
                albumList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.innerText = 'Inga album hittades.';
            albumList.appendChild(li);
        }
    } catch (error) {
        alert('Fel vid hämtning av detaljer, fel: ', error);
    }
});
