
export default class ApiInterface {
    constructor(accessToken) {
        this.accessToken = accessToken;
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

    async requestAlbums(limit=50, offset=198) {
        let fetchUrl = "https://api.spotify.com/v1/me/albums";
        let allAlbums = [];
      
        if (limit == 0) {
          console.log("Received all saved album request");
        } else {
          console.log(`received ${limit} page saved album request`)
        }
              
        while (fetchUrl) {
            try {
                const response = await axios.get(fetchUrl, {
                    headers: {
                      Authorization: `Bearer ${this.accessToken}`,
                    },
                    params: {
                      limit: limit,
                      offset: offset
                    },
                  });

            
                allAlbums = allAlbums.concat(response.data.items); // Collect all albums
                fetchUrl = response.data.next; // Update fetchUrl to the next page
                if (limit > 0) {
                    limit -= 1;
                    if (limit == 0) {
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
}