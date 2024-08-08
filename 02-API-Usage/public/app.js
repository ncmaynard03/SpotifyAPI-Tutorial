document.addEventListener('DOMContentLoaded', async () => {
    var searchButton = document.getElementById('search-button');

    searchButton.addEventListener('click', async () => {
        var query = document.getElementById('search-query').value;
        if(!query){
            alert('Please enter a search query');
            return;
        } 

        try{
            const response = await fetch('/search', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({query})
            });
            const data = await response.json();
            data.tracks.items.map(track => console.log(track.name));
            // displayResults(data.tracks.items => );
        } catch (error) {
            console.error('Error fetching search results:', error);
        }


    })

});

function displayResults(results){
    console.log('Search Results:');
    console.log(results);
}