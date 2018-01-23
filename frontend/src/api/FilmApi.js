class FilmApi {
    static loadFilm() {
        const url = 'http://localhost:8000/film/';
        return fetch(url, {
            mode: 'cors',
        })
        .then((response) => response.json())
        .catch(error => {
            return error;
        });
    }
}

export default FilmApi;