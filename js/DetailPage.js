
'use strict';
import { musicService } from './services/service.js';
const url = "https://seido-webservice-307d89e1f16a.azurewebsites.net/api";
const _service = new musicService(url);

document.addEventListener('DOMContentLoaded', async () => {
    const albumList = document.querySelector('#listOfAlbums');
    const artistList = document.querySelector('#listOfArtists');
    const groupName = document.querySelector('#bandName');
    const genre = document.querySelector('#musicGenre');
    const established = document.querySelector('#establishedYear');

    const groupId = new URLSearchParams(window.location.search).get('id');
    if (!groupId) {
        alert('Hittade ingen grupp som matchar id: ' + groupId);
        window.location.href = 'ListPage.html'; // Redirect to a fallback page
        return;
    }
    try {
        // Fetch group details using the appropriate service function
        const groupDetails = await _service.readMusicGroupAsync(groupId, false);

        if (!groupDetails || Object.keys(groupDetails).length === 0) {
            console.error('No data found for the provided groupId.');
            alert('No data found for the provided groupId.');
            return;
        }

        groupName.value = groupDetails.name || 'N/A';
        genre.value = groupDetails.strGenre || 'N/A';
        established.value = groupDetails.establishedYear || 'N/A';

        // Populate the artist list
        if (groupDetails.artists && Array.isArray(groupDetails.artists)) {
            groupDetails.artists.forEach((artist, index) => {
                const li = document.createElement('li');
                li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

                if (index % 2 === 0) {
                    li.classList.add('list-group-item-light');
                }

                const nameSpan = document.createElement('span');
                nameSpan.innerText = `${artist.firstName} ${artist.lastName}`;

                li.appendChild(nameSpan);
                artistList.appendChild(li);
            });
        } else {
            console.error('Hittar inte artister i gruppen.');
            const li = document.createElement('li');
            li.innerText = 'Inga artister hittades.';
            artistList.appendChild(li);
        }

        // Populate the album list
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
