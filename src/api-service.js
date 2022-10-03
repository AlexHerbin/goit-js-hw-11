import axios from "axios";

export default class ImageApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
        this.per_page = 40;
    }

    async fetchImage() {

        const apiInstance = axios.create({
            baseURL: 'https://pixabay.com/api/',
            params: {
                key: '30296080-c9807eed24713c3ccc4ff6a2b',
                q: `${this.searchQuery}`,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: 'true',
                page: `${this.page}`,
                per_page: `${this.per_page}`,
            },
        });

        const { data } = await apiInstance.get();
        
        const images = data.hits;
        const totalHits = data.totalHits;
        const totalPages = totalHits / this.per_page;

        if (!images.length) {
            throw new Error(`Images not found...`)
        }
    
        return { images, totalHits, totalPages }; 
    }

    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.searchQuery;
    };

    set query(newQuery) {
        this.searchQuery = newQuery;
    };
}