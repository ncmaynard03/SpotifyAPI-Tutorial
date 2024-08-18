
export default class ApiInterface {
    constructor(accessToken) {
        this.accessToken = accessToken;
        console.log("new API Interface with token: " + accessToken)
    }

    async requestSearch(query) {
        if (!query) {
            console.log("No search query entered")
            return;
        }

        try {
            const response = await fetch('/search', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({ query })
            });

            const data = await response.json();
            return data;

        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    }

    async requestAlbums(pages, offset) {
        let fetchUrl = "https://api.spotify.com/v1/me/albums";
        let allAlbums = [];

        if (pages == 0) {
            console.log("Received all saved album request");
        } else {
            console.log(`received ${pages} page saved album request`)
        }

        while (fetchUrl) {
            try {
                const response = await axios.get(fetchUrl, {
                    headers: {
                        Authorization: `Bearer ${this.accessToken}`,
                    },
                    params: {
                        limit: 50,
                        offset: offset
                    },
                });

                const albumsOnly = response.data.items.map(item => item.album);
                allAlbums = allAlbums.concat(albumsOnly);

                fetchUrl = response.data.next; // Update fetchUrl to the next page
                if (pages > 0) {
                    pages -= 1;
                    if (pages == 0) {
                        fetchUrl = null;
                    }
                }
            } catch (error) {
                console.error("Failed to fetch albums:", error);
                break;
            }
        }

        return allAlbums;
    }

    async requestTracks(pages, offset){
        let fetchUrl = "https://api.spotify.com/v1/me/tracks";
        let allTracks = [];

        if (pages == 0) {
            console.log("Received all saved track request");
        } else {
            console.log(`received ${pages} page saved track request`)
        }

        while (fetchUrl) {
            try {
                const response = await axios.get(fetchUrl, {
                    headers: {
                        Authorization: `Bearer ${this.accessToken}`,
                    },
                    params: {
                        limit: 50,
                        offset: offset
                    },
                });

                const tracksOnly = response.data.items.map(item => item.track);
                allTracks = allTracks.concat(tracksOnly);

                fetchUrl = response.data.next; 
                if (pages > 0) {
                    pages -= 1;
                    if (pages == 0) {
                        fetchUrl = null;
                    }
                }
            } catch (error) {
                console.error("Failed to fetch tracks:", error);
                break;
            }
        }

        return allTracks;
    }
}