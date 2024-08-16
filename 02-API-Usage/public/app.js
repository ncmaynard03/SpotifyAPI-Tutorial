import Library from './library.js'
document.addEventListener('DOMContentLoaded', async () => {
	const library = new Library();

	const searchButton = document.getElementById('search-button');
	const allTracksButton = document.getElementById('all-saved-tracks');
	const nTracksButton = document.getElementById('n-saved-tracks');
	const allAlbumsButton = document.getElementById('all-saved-albums');
	const nAlbumsButton = document.getElementById('n-saved-albums');
	const maxSaved = document.getElementById('max-saved')

	searchButton.addEventListener('click', async () => {
		data.tracks.items.map(track => console.log(track.name));
		console.log();
	})

	allAlbumsButton.addEventListener('click',  () => {
		var res = library.getAlbums();
		displayAlbums(res);
	})
	
	nAlbumsButton.addEventListener('click', async () => {
		var res = await library.getAlbums(maxSaved.value)
		displayAlbums(res);
	})
	
	maxSaved.addEventListener('input', () => {
		maxSaved.value = maxSaved.value.replace('/[^0-9/g]', '');
		maxSaved.value = Math.min(10000, maxSaved.value);
		maxSaved.value = Math.max(0, maxSaved.value);
		nTracksButton.innerText = '' + maxSaved.value + " pages";
		nAlbumsButton.innerText = '' + maxSaved.value + " pages"
	})

});

function displayAlbums(res) {
	console.log("Display albums: \n" );
	var str = ''
	var i = 0;
	console.log(res);
	res.forEach(element => {
		str += `${`${++i}.`.padEnd(3)} ${element.album.artists[0].name}   -   ${element.album.name}\n`
	});
	console.log(str);
}
