class FilmApi {
    static loadFilm(data) {
        const formData = new FormData();
        formData.append('json', JSON.stringify({sd:'dsds'}));

        const url = 'http://localhost:8000/film/';
        return fetch(url, {
            mode: 'cors',
            method: 'POST',
            body: formData,
        })
        .then((response) => response.json())
        .catch(error => {
            return error;
        });
    }
}

export default FilmApi;