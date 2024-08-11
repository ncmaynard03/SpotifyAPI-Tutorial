document.addEventListener('DOMContentLoaded', async () => {
	const searchButton = document.getElementById('search-button');
	const allTracksButton = document.getElementById('all-saved-tracks');
	const nTracksButton = document.getElementById('n-saved-tracks');
	const maxSaved = document.getElementById('max-saved')

	searchButton.addEventListener('click', async () => {
		var query = document.getElementById('search-query').value;
		if (!query) {
			alert('Please enter a search query');
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
			data.tracks.items.map(track => console.log(track.name));
			console.log();
		} catch (error) {
			console.error('Error fetching search results:', error);
		}


	})

	allTracksButton.addEventListener('click', async () => {
		try {
			var response = await fetch('/all-tracks');
			console.log(response.data);
		} catch (error){
			console.error('error fetching tracks: ' + error);
		}
	})

	maxSaved.addEventListener('input', () => {
		maxSaved.value = maxSaved.value.replace('/[^0-9/g]', '');
		maxSaved.value = Math.min(10000, maxSaved.value);
		maxSaved.value = Math.max(0, maxSaved.value);
		nTracksButton.innerText = '' + maxSaved.value + " tracks";
		

	})






});

function displayResults(results) {
	console.log('Search Results:');
	console.log(results);
}
