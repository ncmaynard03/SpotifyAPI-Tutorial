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
	fastPullDisplay();


	const artistList = document.getElementById('artist-list')
	const albumList = document.getElementById('album-list')
	const trackList = document.getElementById(`track-list`)


	async function fastPullDisplay() {
		var allTracksPulled = false;
		var allAlbumsPulled = false;
		var count = 0;

		while (!allTracksPulled || !allAlbumsPulled) {
			if (!allTracksPulled) {
				count = await library.pullTracks(3);
				if (count == 0) { allTracksPulled = true }
			}
			if (!allAlbumsPulled) {
				count = await library.pullAlbums(1);
				if (count == 0) { allAlbumsPulled = true }
			}
			display();
		}
	}

	function display() {
		displayArtists();
		displayAlbums();
		displayTracks();
	}

	function displayArtists() {
		console.log("Display Artists: \n");
		let artists = library.getArtists()
		artistList.innerHTML = ""
		artists.forEach(artist => {

			const artistDiv = document.createElement("div");
			artistDiv.className = "artist";
			artistDiv.setAttribute("key", artist.id);

			const artistNameP = document.createElement("p");
			artistNameP.className = "artist-name";
			artistNameP.innerHTML = `<b>${artist.name}</b>`

			artistDiv.appendChild(artistNameP)

			artistList.appendChild(artistDiv);
		}
		)

	}

	function displayAlbums() {
		console.log("Display albums: \n");
		let albums = library.getAlbums()
		albumList.innerHTML = ""
		albums.forEach(album => {

			const albumDiv = document.createElement("div");
			albumDiv.className = "album";
			albumDiv.setAttribute("key", album.id);

			const img = document.createElement("img")
			img.src = album.imageUrl;
			img.alt = album.name
			albumDiv.appendChild(img)

			const albumInfoDiv = document.createElement("div");

			const albumNameP = document.createElement("p");
			albumNameP.className = "album-name";
			albumNameP.innerHTML = `<b>${album.name}</b>`

			albumInfoDiv.appendChild(albumNameP);

			const artistNameP = document.createElement("p");
			artistNameP.className = "artist-name";
			artistNameP.innerHTML = album.artist.name;
			albumInfoDiv.appendChild(artistNameP);

			albumDiv.appendChild(albumInfoDiv)

			albumList.appendChild(albumDiv);
		}
		)


	}

	function displayTracks() {
		console.log("Display tracks:\n");
		let tracks = library.getTracks();
		trackList.innerHTML = ""
		tracks.forEach(track => {

			const trackDiv = document.createElement("div");
			trackDiv.className = "track";
			trackDiv.setAttribute("key", track.id);

			const img = document.createElement("img")
			img.src = track.album.imageUrl;
			img.alt = track.album.name
			trackDiv.appendChild(img)

			const albumInfoDiv = document.createElement("div");

			const trackNameP = document.createElement("p");
			trackNameP.innerHTML = `<b>${track.name}</b>`
			albumInfoDiv.appendChild(trackNameP);

			const albumNameP = document.createElement("p");
			albumNameP.innerHTML = track.album.name;
			albumInfoDiv.appendChild(albumNameP);

			const artistNameP = document.createElement("p");
			artistNameP.innerHTML = `${track.artist}`;
			albumInfoDiv.appendChild(artistNameP);

			trackDiv.appendChild(albumInfoDiv)

			trackList.appendChild(trackDiv);
		})
	}
});


