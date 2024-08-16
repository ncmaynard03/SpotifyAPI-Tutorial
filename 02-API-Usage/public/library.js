import ApiInterface from "./apiInterface.js";

export default class Library {
    constructor() {
        this.api = new ApiInterface();

        this.artists = new Map();
        this.albums = new Map();
        this.tracks = new Map();
    }

    async getAlbums(limit = 0) {
        console.log(`Library.getAlbums(limit:${limit})`)
        var totalAlbums = this.albums.size
        if (totalAlbums == 0) {
            await this.pullAlbums(limit, totalAlbums);
        }

        console.log(`Pulled ${this.albums.size - totalAlbums} albums from API`)
        return Array.from(this.albums);
    }

    async pullAlbums(limit, offset) {
        console.log(`library.pullAlbums(limit: ${limit}, offset: ${offset})`)
        var albumArray = await this.api.requestAlbums();
        console.log(albumArray);
        albumArray.forEach(element => {
            console.log(element);
            this.albums.set(element.album.id, element.album)
            var album = this.albums.get(element.album.id);
            console.log(`Added album ${album.name} to library \n${album}`)
        })
    }

}

