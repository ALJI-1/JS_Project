
'use strict';

export function musicService(baseUrl) {

    // MyFetch-funktionen som jag fått från kursmaterialet. Med lite små ändringar
    async function myFetch(url, method = null, body = null) 
    {
        try {
       
            method ??= 'GET'; 
            let res = await fetch(url, {
                method: method,
                headers: { 'content-type': 'application/json',
                    'User-Agent': 'YourAppName/1.0', },
                body: body ? JSON.stringify(body) : null 
            });
    
            if (res.ok) { 
                let data = await res.json(); 
                return data; 
            } 
            if (!res.ok) { 
                throw new Error(`Lyckades inte hämta data från API: ${res.status}`);
            }
        } 
        catch (err) 
        { 
            alert(`Lyckades inte hämta data från API: ${err.message}`);
            return null;
        }
    }
    // Funktionen som tar in sökordet från användaren och sen använder myfetch för att hämta just 
    // de grupper som mathar ordet. 
    function clickHandlerSearch() {
        const searchInput = document.getElementById('search-input').value.toLowerCase();
        const reqUrl = `${baseUrl}/MusicGroup/Read?flat=true`; 
        myFetch(reqUrl)
            .then(data => { // .then bestämmer vad som ska göras efter att myfetch-anropet har kört klart. Finns de data så går vi in i if-satsen
                if (data) { 
                    const filteredGroups = data.pageItems.filter(group => // Här skapas en ny array med .filter som filtrerar så att bara grupper som mathar kommer med
                        group.name.toLowerCase().includes(searchInput)
                    );
                    fillList(filteredGroups);
                }
            });
    }

    async function readItemsAsync(reqUrl, pageNr, flat, filter, pageSize) {
        reqUrl += `?flat=${flat}&pageNr=${pageNr}&pageSize=${pageSize}`;
        if (filter != null) {
            reqUrl += `&filter=${filter}`;
        }
        return await myFetch(reqUrl);
    }

    async function readItemAsync(reqUrl, id, flat) {
        reqUrl += `?flat=${flat}&id=${id}`;
        return await myFetch(reqUrl);
    }

    async function readItemDtoAsync(reqUrl, id, flat) {
        reqUrl += `?id=${id}`;
        return await myFetch(reqUrl);
    }

    async function updateItemAsync(reqUrl, id, newItem) {
        reqUrl += `/${id}`;
        return await myFetch(reqUrl, 'PUT', newItem);
    }

    async function createItemAsync(reqUrl, newItem) {
        return await myFetch(reqUrl, 'POST', newItem);
    }

    async function deleteItemAsync(reqUrl, id) {
        reqUrl += `/${id}`;
        return await myFetch(reqUrl, 'DELETE');
    }

    async function upsertItemAsync(reqUrl, newItem) {
        return await myFetch(reqUrl, 'POST', newItem);
    }

    // Public methods
    return {
        async readInfoAsync() {
            return await myFetch(`${baseUrl}/Guest/Info`);
        },

        async readMusicGroupsAsync(pageNr, flat = false, filter = null, pageSize = 10) {
            return await readItemsAsync(`${baseUrl}/MusicGroup/Read`, pageNr, flat, filter, pageSize);
        },

        async readMusicGroupAsync(id, flat = true) {
            return await readItemAsync(`${baseUrl}/MusicGroup/ReadItem`, id, flat);
        },

        async readMusicGroupDtoAsync(id) {
            return await readItemDtoAsync(`${baseUrl}/MusicGroup/ReadItemDto`, id);
        },

        async updateMusicGroupAsync(id, newItem) {
            return await updateItemAsync(`${baseUrl}/MusicGroup/UpdateItem`, id, newItem);
        },

        async createMusicGroupAsync(newItem) {
            return await createItemAsync(`${baseUrl}/MusicGroup/CreateItem`, newItem);
        },

        async deleteMusicGroupAsync(id) {
            return await deleteItemAsync(`${baseUrl}/MusicGroup/DeleteItem`, id);
        },

        async readAlbumsAsync(pageNr, flat = false, filter = null, pageSize = 10) {
            return await readItemsAsync(`${baseUrl}/Album/Read`, pageNr, flat, filter, pageSize);
        },

        async readAlbumAsync(id, flat = true) {
            return await readItemAsync(`${baseUrl}/Album/ReadItem`, id, flat);
        },

        async readAlbumDtoAsync(id) {
            return await readItemDtoAsync(`${baseUrl}/Album/ReadItemDto`, id);
        },

        async updateAlbumAsync(id, newItem) {
            return await updateItemAsync(`${baseUrl}/Album/UpdateItem`, id, newItem);
        },

        async createAlbumAsync(newItem) {
            return await createItemAsync(`${baseUrl}/Album/CreateItem`, newItem);
        },

        async deleteAlbumAsync(id) {
            return await deleteItemAsync(`${baseUrl}/Album/DeleteItem`, id);
        },

        async readArtistsAsync(pageNr, flat = false, filter = null, pageSize = 10) {
            return await readItemsAsync(`${baseUrl}/Artist/Read`, pageNr, flat, filter, pageSize);
        },

        async readArtistAsync(id, flat = true) {
            return await readItemAsync(`${baseUrl}/Artist/ReadItem`, id, flat);
        },

        async readArtistDtoAsync(id, flat = true) {
            return await readItemDtoAsync(`${baseUrl}/Artist/ReadItemDto`, id);
        },

        async updateArtistAsync(id, newItem) {
            return await updateItemAsync(`${baseUrl}/Artist/UpdateItem`, id, newItem);
        },

        async upsertArtistAsync(newItem) {
            return await upsertItemAsync(`${baseUrl}/Artist/UpsertItem`, newItem);
        },

        async deleteArtistAsync(id) {
            return await deleteItemAsync(`${baseUrl}/Artist/DeleteItem`, id);
        }, 
        myFetch, 
        clickHandlerSearch,

    };
}



    