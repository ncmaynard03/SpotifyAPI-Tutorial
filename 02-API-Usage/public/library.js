import ApiInterface from "./apiInterface.js";

export default class Library {
    constructor() {
        this.api = new ApiInterface();
        this.artists = new Map();
        this.albums = new Map();

        this.tracks = new Map();
    }

    async getAlbums() {
        if (this.albums.size == 0) {
            await this.pullAlbums();
        }
        return Array.from(this.albums);
    }

    async pullAlbums() {
        var albumArray = await this.api.requestAlbums();
        console.log(albumArray);
        albumArray.forEach(element => {
            console.log(element);
            this.albums.set(element.album.id, element.album)
            var album = this.albums.get(element.album.id);
            console.log(`Added album ${album.name} to library \n${album}`)
        }
        )
    }

}

