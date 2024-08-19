import ApiInterface from "./apiInterface.js";

export default class Library {
    constructor(token) {
        this.api = new ApiInterface(token);

        this.artists = new Map();
        this.albums = new Map();
        this.tracks = new Map();
    }

    async getAlbums(limit = 0) {
        console.log(`Library.getAlbums(limit:${limit})`)
        var totalAlbums = this.albums.size
        await this.pullAlbums(limit, totalAlbums);

        console.log(`Pulled ${this.albums.size - totalAlbums} albums from API`)
        var arr = Array.from(this.albums.values());
        // console.log(arr)
        return arr;
    }

    async pullAlbums(limit, offset) {
        console.log(`library.pullAlbums(limit: ${limit}, offset: ${offset})`)
        var albumArray = await this.api.requestAlbums(limit, offset);
        // console.log(albumArray);
        albumArray.forEach(album => {
            this.albums.set(album.id, album)
            var newAlbum = this.albums.get(album.id)
            // console.log(newAlbum)
        })

    }

    async getTracks(limit) { 
        console.log(`Library.getTracks(limit: ${limit})`)
        var totalTracks = this.tracks.size
        await this.pullTracks(limit, totalTracks);

        console.log(`Pulled ${this.tracks.size - totalTracks} tracks from API`)
        var arr = Array.from(this.tracks.values());
        // console.log(arr);
        return arr;
    }


    async pullTracks(limit, offset) {
        console.log(`library.pullTRacks(limit: ${limit}, offset: ${offset}})`);
        var trackArray = await this.api.requestTracks(limit, offset);
        trackArray.forEach(track => {
            this.tracks.set(track.id, track)
            var newTrack = this.tracks.get(track.id)
            // console.log(newTrack);
        })
    }

}

