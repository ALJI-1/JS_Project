'use strict';
import {musicService} from './services/service.js';

(async () => {
    // Sparar bas-URL till api
    const _service = new musicService(`https://seido-webservice-307d89e1f16a.azurewebsites.net/api`);
  
    // Läser in data från databasen
    let data = await _service.readInfoAsync();
  
   // Skriver ut data i rätt HTML-element till första sidan
    const countGroups = document.querySelector('#count-groups');
    countGroups.innerText = data.db.nrSeededMusicGroups;
  
    const countAlbums = document.querySelector('#count-albums');
    countAlbums.innerText = data.db.nrSeededAlbums;
  
    const countArtists = document.querySelector('#count-artists');
    countArtists.innerText = data.db.nrSeededArtists;
  })();