import ApiInterface from "./apiInterface.js";

export default class Library {
    constructor(token) {
        this.api = new ApiInterface(token);

        this.artists = new Map();
        this.albums = new Map();
        this.tracks = new Map();
    }

    addNewAlbum(albumJson, saved=false){
        console.log("addNewAlbum: " + albumJson.name)
        var artistId = albumJson.artists[0].id;
        var artist = this.artists.get(artistId);
        if(!artist){
            console.log("artist not found")
            var artist = new Artist(albumJson.artists[0]);
            this.artists.set(artistId, artist);
            console.log("added artist " + artist.name)
        }
        
        var albumId = albumJson.id;
        var album = this.albums.get(albumId);
        if(!album){
            console.log("album not found")
            album = new Album(albumJson, artist, this, saved);
            this.albums.set(albumId, album);
            console.log("Added album " + album.name)
        }
        artist.addAlbum(album);
    }

    addNewTrack(trackJson, saved=false){
        console.log("addNewTrack: " + trackJson.name)
        var albumId = trackJson.album.id;
        var album = this.albums.get(albumId)
        if(!album){
            console.log("Album not found, adding");
            this.addNewAlbum(trackJson.album);
            album = this.albums.get(albumId);
        }

        var track = new Track(trackJson, album, this, saved);
        this.tracks.set(trackJson.id, track);
        album.addTrack(track);
        console.log(`${track}`);
    }

    getArtists(){
        var arr = Array.from(this.artists.values());
        console.log(`Got ${arr.length} artists from Library`)
        return arr;
    }

    getAlbums() {
        var arr = Array.from(this.albums.values());
        console.log(`Got ${arr.length} albums from Library`)
        return arr;
    }

    getTracks() {
        var arr = Array.from(this.tracks.values());
        console.log(`Got ${arr.length} tracks from Library`)
        return arr;
    }

    async pullAlbums(limit) {
        var offset = limit == 0 ? 0 : this.albums.size;
        console.log(`library.pullAlbums(limit: ${limit}, offset: ${offset})`)
        var albumArray = await this.api.requestAlbums(limit, offset);
        albumArray.forEach(albumJson => {
            var album = this.albums.get(albumJson.id);
            if(!album){
                this.addNewAlbum(albumJson, true);
                album = this.albums.get(albumJson.id)
            } else {
                album.saved = true;
            }

            console.log(`${album.artist}`)
            console.log(`${album}`)
        })
        return albumArray.length
    }

    async pullTracks(limit) {
        var offset = limit == 0 ? 0 : this.tracks.size;
        console.log(`library.pullTracks(limit: ${limit}, offset: ${offset}})`);
        var trackArray = await this.api.requestTracks(limit, limit == 0 ? 0 : offset);
        trackArray.forEach(trackJson => {
            var track = this.tracks.get(trackJson.id)
            if(!track){
                this.addNewTrack(trackJson);
                track = this.tracks.get(trackJson.id);
            }
        })
        return trackArray.length

    }

    
}

class Album {
    constructor(json, artist, library, saved = false) {
        this.library = library
        this.artist = artist;
        this.savedTracks = [];
        this.allTracks = [];

        this.name = json.name;
        this.id = json.id;
        this.imageUrl = json.images[0].url;
        this.totalTracks = json.total_tracks;
        this.showAllTracks = false;
        this.saved = saved;

    }

    addTrack(track, saved = false) {

        track.artist = this.artist;
        track.album = this;
        track.saved = saved;

        if (!this.hasTrack(track.id)) {
            this.allTracks.push(track);
            this.allTracks.sort((a, b) => a.trackNumber - b.trackNumber);
        }

        if (saved && !this.savedTracks.includes(track)) {
            this.savedTracks.push(track);
            this.savedTracks.sort((a, b) => a.trackNumber - b.trackNumber);
            this.artist.addTrack(track);
        }
    }

    async getTracks() {
        //return only saved tracks?
        if (!this.showAllTracks) {
            return this.savedTracks;
        }

        //pulls tracks if not all are saved
        if (this.allTracks.length != this.totalTracks) {
            console.log("pulling tracks for album: " + this.name);
            await this.library.pullAlbumTracksFromSpotify(this);
        }

        //return all tracks
        return this.allTracks;
    }

    async save() {
        await this.library.saveAlbum(this);
    }

    hasTrack(id) {
        return this.allTracks.some((track) => track.id === id);
    }

    toString() {
        return `${this.name} - ${this.artist || "No artist"}`
    }
}

class Artist {
    constructor(json) {
        this.name = json.name;
        this.id = json.id;
        this.albums = []; 
        this.tracks = [];
        console.log(`New artist: ${this}`)
    }

    addAlbum(album) {
        if (this.has(album.id)) return;
        console.log(`Adding album ${album.name} to ${this.name}`)
        this.albums.push(album);
    }

    addTrack(track) {
        if (this.has(track.id)) return;
        console.log(`Adding ${track.name} to ${this.name}`)
        this.tracks.push(track);
    }

    has(id) {
        return this.tracks.some(track => track.id === id) || this.albums.some(album => album.id === id);
    }

    toString() {
        return this.name
    }
}

class Track {
    constructor(json, album, library, saved = false) {
        this.album = album;
        this.artist = album.artist;
        this.id = json.id;
        this.name = json.name;
        this.trackNumber = json.track_number;
        this.saved = saved;
        this.library = library;

    }

    async save() {
        await this.library.saveTrack(this);
        this.album.addTrack(this, true);
    }

    async queue() {
        console.log("Queueing track: " + this.name);
        await this.library.queueTrack(this);
    }

    toString(){
        return `${this.name} - ${this.artist || "No artist"}`
    }
}