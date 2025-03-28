'use strict';
import {musicService} from './services/service.js';

(async () => {
    // Initialize the service
    const _service = new musicService(`https://seido-webservice-307d89e1f16a.azurewebsites.net/api`);
  
    // Read Database info async
    let data = await _service.readInfoAsync();
  
    const countGroups = document.querySelector('#count-groups');
    countGroups.innerText = data.db.nrSeededMusicGroups;
  
    const countAlbums = document.querySelector('#count-albums');
    countAlbums.innerText = data.db.nrSeededAlbums;
  
    const countArtists = document.querySelector('#count-artists');
    countArtists.innerText = data.db.nrSeededArtists;
  
  })();