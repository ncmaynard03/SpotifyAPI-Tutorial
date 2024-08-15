
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

    async requestAlbums(pageLimit=50, offset=198) {
        let fetchUrl = "https://api.spotify.com/v1/me/albums";
        let allAlbums = [];
      
        if (pageLimit == 0) {
          console.log("Received all saved album request");
        } else {
          console.log(`received ${pageLimit} page saved album request`)
        }
              
        while (fetchUrl) {
            try {
                const response = await axios.get(fetchUrl, {
                    headers: {
                      Authorization: `Bearer ${this.accessToken}`,
                    },
                    params: {
                      limit: pageLimit,
                      offset: offset
                    },
                  });

            
                allAlbums = allAlbums.concat(response.data.items); // Collect all albums
                fetchUrl = response.data.next; // Update fetchUrl to the next page
                if (pageLimit > 0) {
                    pageLimit -= 1;
                    if (pageLimit == 0) {
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