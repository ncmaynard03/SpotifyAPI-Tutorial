export default class ApiInterface {
    constructor(pageLimit=0) {
        this.pageLimit = pageLimit;
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

    async requestAlbums(limit=0) {
        if (limit == 0) {
            console.log('\nPosting all saved album request')
        } else {
            console.log(`\nPosting ${limit} page saved album request`)
        }

        try {
            var response = await fetch('/saved-albums', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'limit': limit
                })
            }
            );
            const data = await response.json()
            return data;
        } catch (error) {
            console.error('error fetching tracks: ' + error);
        }
    }
}