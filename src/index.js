import ImageApiService from './api-service';
import LoadMoreBtn from './load-more-btn';
import Notiflix from 'notiflix';



const refs = {
    searchForm: document.querySelector('#search-form'),
    btnEl: document.querySelector('button'),
    gallery: document.querySelector('.gallery'),
};

const imageApiService = new ImageApiService();
const loadMoreBtn = new LoadMoreBtn({
    selector: '[data-action="load-more"]',
    hidden: true,
});

let totalPages = null;

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetchGallery);


async function onSearch(e) {
    e.preventDefault();
    
     if (e.currentTarget.elements.searchQuery.value.trim() === '') {
        return console.warn('Field cannot be emply');
    };

    imageApiService.query = e.currentTarget.elements.searchQuery.value;

    loadMoreBtn.show();
    loadMoreBtn.disable();
    imageApiService.resetPage();

    try {
        const images = await imageApiService.fetchImage();
        totalPages =  images.totalPages;
        Notiflix.Notify.success(`Hooray! We found ${images.totalHits} images.`);
        clearGallery();
        renderGallery(images);
        loadMoreBtn.enable();
    } catch (error) {
        fetchError();
    };

    // return totalPages;  
}


async function fetchGallery() {
    loadMoreBtn.disable();

    try {
            imageApiService.incrementPage();
            const images = await imageApiService.fetchImage();
            totalPages = images.totalPages;
            
            if (imageApiService.page > totalPages) {
                loadMoreBtn.hide();
                return Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
            }

            renderGallery(images);
            loadMoreBtn.enable();
        } catch (error) {
        fetchError();
    };
     
}

function clearGallery() {
    refs.gallery.innerHTML = '';
};

function fetchError(error) {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
}

function renderGallery({ images }) {
    const markUp = images.map(image => {
        return `<div class="photo-card">
            <img src="${image.webformatURL}" alt="${image.tags}" width='100' loading="lazy" />
            <div class="info">
                <p class="info-item">
                    <b>Likes ${image.likes}</b>
                </p>
                <p class="info-item">
                    <b>Views ${image.views}</b>
                </p>
                <p class="info-item">
                    <b>Comments ${image.comments}</b>
                </p>
                <p class="info-item">
                    <b>Downloads ${image.downloads}</b>
                </p>
            </div>
        </div>`
    }).join('');

    refs.gallery.insertAdjacentHTML('beforeend', markUp) ;
};

