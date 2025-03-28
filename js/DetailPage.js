
'use strict';
import { musicService } from './services/service.js';
const url = "https://seido-webservice-307d89e1f16a.azurewebsites.net/api";
const _service = new musicService(url);

document.addEventListener('DOMContentLoaded', async () => {
    const albumList = document.querySelector('#listOfAlbums');
    const artistList = document.querySelector('#listOfArtists');

    console.log('Album List:', albumList); // Debugging
    console.log('Artist List:', artistList); // Debugging

    if (!albumList || !artistList) {
        console.error('One or both elements (#listOfAlbums, #listOfArtists) are missing in the DOM.');
        return;
    }

    const groupId = new URLSearchParams(window.location.search).get('id');
    if (!groupId) {
        console.error('No groupId found in the URL.');
        alert('No groupId found in the URL.');
        window.location.href = 'ListPage.html'; // Redirect to a fallback page
        return;
    }

    console.log(`Requesting data for groupId: ${groupId}`);

    try {
        // Fetch group details using the appropriate service function
        const groupDetails = await _service.readMusicGroupAsync(groupId, false);
        console.log('Group Details:', groupDetails);
        if (!groupDetails || Object.keys(groupDetails).length === 0) {
            console.error('No data found for the provided groupId.');
            alert('No data found for the provided groupId.');
            return;
        }

        console.log('Group Details:', groupDetails);

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
            console.error('Artists data is missing or invalid.');
            const li = document.createElement('li');
            li.innerText = 'No artists found.';
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
            console.error('Albums data is missing or invalid.');
            const li = document.createElement('li');
            li.innerText = 'No albums found.';
            albumList.appendChild(li);
        }
    } catch (error) {
        console.error('Error fetching group details:', error);
        alert('An error occurred while fetching group details.');
    }
});


 
// let loveAlbumsData = await _service.readAlbumsAsync(0, false, 'love');
// console.log(loveAlbumsData);
// for (const album of loveAlbumsData.pageItems) {
//   const li = document.createElement('li');
//   li.innerText = album.name;
//   albumList.appendChild(li);
// }


// let artistsData = await _service.readArtistsAsync(0, false );
// console.log(artistsData);
// for (const artist of artistsData.pageItems){
//   const li = document.createElement('li');
//   li.innerText = artist.firstName + ' ' + artist.lastName;
//   artistList.appendChild(li);
// }