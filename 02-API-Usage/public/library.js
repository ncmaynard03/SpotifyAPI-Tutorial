import ApiInterface from "./apiInterface.js";

export default class Library {
    constructor(token) {
        this.api = new ApiInterface(token);

        this.artists = new Map();
        this.selectedArtistIds = [];
        this.savedAlbums = new Map();
        this.selectedAlbumIds = [];
        this.savedTracks = new Map();
        this.selectedTrackIds = [];
    }

    addNewAlbum(albumJson, saved = false) {
        var artistId = albumJson.artists[0].id;
        var artist = this.artists.get(artistId);
        if (!artist) {
            var artist = new Artist(albumJson.artists[0]);
            this.artists.set(artistId, artist);
        }

        var albumId = albumJson.id;
        var album = this.savedAlbums.get(albumId);
        if (!album) {
            album = new Album(albumJson, artist, this, saved);
            this.savedAlbums.set(albumId, album);
        }
        artist.addAlbum(album);
    }

    addNewTrack(trackJson, saved = false) {
        var albumId = trackJson.album.id;
        var album = this.savedAlbums.get(albumId)
        if (!album) {
            this.addNewAlbum(trackJson.album);
            album = this.savedAlbums.get(albumId);
        }

        var track = new Track(trackJson, album, this, saved);
        this.savedTracks.set(trackJson.id, track);
        album.addTrack(track, saved);
    }

    getArtists() {
        var arr = Array.from(this.artists.values());
        console.log(`Got ${arr.length} artists from Library`)
        return arr;
    }

    getAlbums() {
        var arr = []
        console.log(`${this.selectedArtistIds.length} selected artists`)
        if (this.selectedArtistIds.length == 0) {
            this.getArtists().forEach(artist => {
                console.log("\nAlbums from " + artist + ": ")
                artist.albums.forEach(album => {
                    console.log(`${album}`);
                    arr.push(album);
                })
            })
        } else {
            this.selectedArtistIds.forEach(artistId => {
                var artist = this.artists.get(artistId);
                artist.albums.forEach(album => {
                    console.log(`${album}`);
                    arr.push(album);
                })
            })
        }
        console.log(`Got ${arr.length} albums from Library`)
        return arr;
    }

    getTracks() {
        var arr = []
        console.log(`${this.selectedAlbumIds.length} selected albums`)
        if(this.selectedAlbumIds.length == 0){
            this.getAlbums().forEach(album => {
                console.log(`${album}`)
                console.log(album.getTracks());
                album.getTracks().forEach(track => {
                    arr.push(track)
                })
            })
        } else {
            this.selectedAlbumIds.forEach(id => {
                var album = this.savedAlbums.get(id)
                album.getTracks().forEach(track => {
                    arr.push(track);
                })
            })
        }
        console.log(`Got ${arr.length} tracks from Library`)
        return arr;
    }

    async pullAlbums(limit) {
        var offset = limit == 0 ? 0 : this.savedAlbums.size;
        console.log(`library.pullAlbums(limit: ${limit}, offset: ${offset})`)
        var albumArray = await this.api.requestAlbums(limit, offset);
        albumArray.forEach(albumJson => {
            var album = this.savedAlbums.get(albumJson.id);
            if (!album) {
                this.addNewAlbum(albumJson, true);
                album = this.savedAlbums.get(albumJson.id)
            } else {
                album.saved = true;
            }

        })
        return albumArray.length
    }

    async pullTracks(limit) {
        var offset = limit == 0 ? 0 : this.savedTracks.size;
        console.log(`library.pullTracks(limit: ${limit}, offset: ${offset}})`);
        var trackArray = await this.api.requestTracks(limit, limit == 0 ? 0 : offset);
        trackArray.forEach(trackJson => {
            var track = this.savedTracks.get(trackJson.id)
            if (!track) {
                this.addNewTrack(trackJson);
                track = this.savedTracks.get(trackJson.id);
            }
        })
        return trackArray.length

    }

    handleArtistClick(artistId, ctrl) {
        //if artist already selected, remove it
        if (this.selectedArtistIds.includes(artistId)) {
            let index = this.selectedArtistIds.indexOf(artistId);
            this.selectedArtistIds.splice(index, 1);
            let artist = this.artists.get(artistId);

            //if any of removed artist's albums are selected, unselect those
            artist.albums.forEach((album) => {
                if (this.selectedAlbumIds.includes(album.id)) {
                    let albumInd = this.selectedAlbumIds.indexOf(album.id);
                    this.selectedAlbumIds.splice(albumInd, 1);
                }
            })
        }
        //if artist not already selected
        else {
            //if ctrl not pressed, clear selected artists and albums
            if (!ctrl) {
                this.selectedArtistIds = [];
                this.selectedAlbumIds = [];
            }
            //add artist to selected
            this.selectedArtistIds.push(artistId);
        }
    }

    handleAlbumClick(albumId, ctrl) {
        console.log("handling click: " + this.albums.get(albumId).name)
        //if album selected, remove it
        if (this.selectedAlbumIds.includes(albumId)) {
            let index = this.selectedAlbumIds.indexOf(albumId);
            this.selectedAlbumIds.splice(index, 1);
        }
        //if not selected, 
        else {
            //if ctrl not pressed, clear selected albums
            if (!ctrl) {
                this.selectedAlbumIds = [];
            }
            this.selectedAlbumIds.push(albumId);
        }
    }

    handleTrackClick(track, ctrl) {
        console.log("handling click: " + track.name)
        //if track selected, remove it
        if (this.selectedTrackIds.includes(track.id)) {
            let index = this.selectedTrackIds.indexOf(track.id);
            this.selectedTrackIds.splice(index, 1);
        }
        //if not selected, 
        else {
            //if ctrl not pressed, clear selected tracks
            if (!ctrl) {
                this.selectedTrackIds = [];
            }
            this.selectedTrackIds.push(track.id);
        }
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

    addTrack(track) {

        track.artist = this.artist;
        track.album = this;

        if (!this.hasTrack(track.id)) {
            this.allTracks.push(track);
            this.allTracks.sort((a, b) => a.trackNumber - b.trackNumber);
        }

        if (track.saved && !this.savedTracks.includes(track)) {
            this.savedTracks.push(track);
            this.savedTracks.sort((a, b) => a.trackNumber - b.trackNumber);
            this.artist.addTrack(track);
        }
    }

    getTracks() {
        //return only saved tracks?
        if (!this.showAllTracks) {
            console.log(this.savedTracks);
            return this.savedTracks;
        }

        //pulls tracks if not all are saved
        if (this.allTracks.length != this.totalTracks) {
            console.log("pulling tracks for album: " + this.name);
            // await this.library.pullAlbumTracksFromSpotify(this);
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
    }

    addAlbum(album) {
        if (this.has(album.id)) return;
        this.albums.push(album);
    }

    addTrack(track) {
        if (this.has(track.id)) return;
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

    toString() {
        return `${this.name} - ${this.artist || "No artist"}`
    }
}