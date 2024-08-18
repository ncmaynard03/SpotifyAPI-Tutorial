import Library from './library.js'

document.addEventListener('DOMContentLoaded', async () => {
	console.log("Home.html DOM Loaded")


	function getQueryParam(name) {
		const urlParams = new URLSearchParams(window.location.search);
		return urlParams.get(name);
	}

	// Store the access token in localStorage
	const accessToken = getQueryParam('token');

	if (accessToken) {
		localStorage.setItem('spotifyAccessToken', accessToken);
	}

	// Now you can use the access token for API requests
	console.log('Access token stored:', localStorage.getItem('spotifyAccessToken'));

	const library = new Library(accessToken);

	const searchButton = document.getElementById('search-button');
	const allTracksButton = document.getElementById('all-saved-tracks');
	const nTracksButton = document.getElementById('n-saved-tracks');
	const allAlbumsButton = document.getElementById('all-saved-albums');
	const nAlbumsButton = document.getElementById('n-saved-albums');
	const maxPages = document.getElementById('max-pages')

	searchButton.addEventListener('click', async () => {
		data.tracks.items.map(track => console.log(track.name));
		console.log();
	})

	allAlbumsButton.addEventListener('click', async () => {
		var res = await library.getAlbums();
		displayAlbums(res);
	})

	nAlbumsButton.addEventListener('click', async () => {
		var res = await library.getAlbums(maxPages.value)
		displayAlbums(res);
	})

	allTracksButton.addEventListener('click', async () => {
		var res = await library.getTracks();
		displayTracks(res);
	})

	nTracksButton.addEventListener(`click`,  async () => {
		var res = await library.getTracks(maxPages.value)
		displayTracks(res);
	})

	maxPages.addEventListener('input', () => {
		maxPages.value = maxPages.value.replace('/[^0-9/g]', '');
		maxPages.value = Math.max(0, Math.min(500, maxPages.value));
		nTracksButton.innerText = '' + (maxPages.value * 50) + " tracks";
		nAlbumsButton.innerText = '' + (maxPages.value * 50) + " albums"
	})

});

function displayAlbums(res) {
	console.log("Display albums: \n");
	var str = ''
	var i = 0;
	// console.log(res);
	res.forEach(album => {
		str += `${`${++i}.`.padEnd(3)} ${album.artists[0].name}   -   ${album.name}\n`
	});
	console.log(str);
}

function displayTracks(res) {
	console.log("Display tracks:\n");
	var str = ''
	var i = 0;
	res.forEach(track => {
		str += `${`${++i}.`.padEnd(3)} ${track.name}  -   ${track.artists[0].name}\n`
	});
	console.log(str);
}
