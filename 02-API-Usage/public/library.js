import ApiInterface from "./apiInterface.js";

export default class Library {
    constructor(accessToken) {
        this.accessToken = accessToken;
        this.api = new ApiInterface(this.accessToken);
        this.artists = new Map();
        this.albums = new Map();
        this.tracks = new Map();
    }

    async getAlbums() {
        console.log("getting albums from library...")
        if (this.albums.size == 0) {
            await this.pullAlbums();
        }
        console.log("returning " + this.albums.size + " albums from library"  + "\n")
        return Array.from(this.albums.values());
    }

    async pullAlbums() {
        console.log("pulling albums from Spotify...")
        var albumArray = await this.api.requestAlbums();
        console.log(albumArray);
        albumArray.forEach(element => {
            // console.log(element);
            this.albums.set(element.album.id, element.album)
            var album = this.albums.get(element.album.id);
            console.log(`Added album ${album.name} to library \n`)
        }
        )
        console.log("Albums pulled")
    }

}

