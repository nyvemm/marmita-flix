import axios from 'axios';
import JSSoup from "jssoup";

async function getMovies(url) {
    let response = await axios.get(url).catch(() => { return null })

    return response.data
}

async function parseMovies(max = 12, url = "https://ondeeubaixo.org/") {
    const moviesData = await getMovies(url);
    let movies = [];

    if (moviesData) {
        let soup = new JSSoup(moviesData, false);
        let collection = soup.findAll("div", "capa_larga");

        /* Define max possible if get -1 */
        max = max === -1 ? collection.length : max;

        for (let movie of collection.slice(0, max)) {
            const movieURL = movie.contents[1];
            const movieHeader = movie.contents[2];
            const movieInfo = movieHeader.contents[3];

            // Movie Image Url
            let imageUrl = movieURL.contents[0].attrs.src;

            // Movie Url
            let movieUrl = movieURL.attrs.href;

            // Movie Name
            let name = movieHeader.contents[1].text;

            // Movie IMDB Rating
            let rating;
            try {
                rating = movieInfo.contents[25]._text.replace(
                    ": ",
                    ""
                );
            } catch (error) {
                rating = '0.0'
            }


            //Movie Genre
            let genre = movieInfo.contents[8]._text
                .replace(": ", "")
                .split(",")[0];

            movies.push({
                img: imageUrl,
                name: name,
                url: movieUrl,
                rating: (parseFloat(rating) * 5) / 10,
                genre: genre,
            });
        }
    }
    return movies;
}

async function getMovieLink(url) {
    const movieData = await getMovies(url);

    let soup = new JSSoup(movieData, false);

    let description = soup.findAll('p').filter(x => x.parent.attrs.id === 'sinopse')[0].contents[2]._text;

    let buttons = soup.findAll('a').filter(x => x.parent.attrs.id === 'lista_download')
    buttons = buttons.map(x => {
        return {
            name: x.previousElement.name !== 'br' ? x.previousElement._text : x.contents[0]._text,
            url: x.previousElement.name !== 'br' ? x.attrs.href : x.attrs.href
        }
    })

    /* Remove repeated numbers */
    buttons = buttons.filter(x => {
        return buttons.map(y => y.name).filter(z => z === x.name).length < 2;
    })

    return {
        description: description.trim().substring(2),
        links: buttons
    }
}

export default { parseMovies, getMovieLink };