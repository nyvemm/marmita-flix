import axios from 'axios';
import JSSoup from "jssoup";

async function getAnimes(url) {
    let response = await axios.get(url).catch(() => { return null })

    return response.data
}

async function parseAnimes(max = 12, url = 'https://animestorrent.com/', search = false) {
    const animesData = await getAnimes(url);
    let animes = [];

    if (animesData) {
        let soup = new JSSoup(animesData, false);
        let pagesToGo = [url];

        if (search) {
            /* Fetch all pages */
            let pages = soup.findAll("a", "page-numbers").filter(x => x.attrs.class !== "next page-numbers");
            let pagesLink = pages.map(x => x.attrs.href)
            pagesToGo = [url, ...pagesLink]
        }

        for (let link of pagesToGo) {
            let animesData = await getAnimes(link);
            let soup = new JSSoup(animesData, false);

            let collection;
            if (search) {
                collection = Array.from(soup.findAll("div", "listupd")[0].contents);
            } else {
                collection = Array.from(soup.findAll("div", "listupd")[1].contents[1].contents);
            }

            /* Remove last index */
            collection.pop()
            /* Remove first index */
            collection.shift()

            /* Define max possible if get -1 */
            max = max === -1 ? collection.length : max;

            /* If there is no animes in the database */
            if (collection[0].name === 'center') {
                return []
            }

            for (let anime of collection.slice(0, max)) {
                let animeURL = anime.contents[1].contents[1];
                let animeHeader = animeURL.contents[1];
                let animeInfo = animeURL.contents[3];

                // Anime Image Url
                let imageUrl = animeHeader.contents[animeHeader.contents.length - 2].attrs.src;
                if (imageUrl == null)
                    continue;

                // Anime URL
                let animeUrl = animeURL.attrs.href;

                // Anime Name
                let name = animeInfo.contents[1].text;

                // Anime IMDB Rating
                let rating;
                if (search) {
                    rating = animeInfo.contents[3].contents[1].contents[3].contents[0]._text
                } else {
                    rating = animeInfo.contents[5].contents[1].contents[3].contents[0]._text
                }

                //Anime Genre
                let genre = animeHeader.contents[1].contents[0]._text


                animes.push({
                    img: imageUrl,
                    name: name,
                    url: animeUrl,
                    rating: (parseFloat(rating) * 5) / 10,
                    genre: genre,
                });
            }
        }
    }
    return animes;
}

async function getAnimeLink(url) {
    const animeData = await getAnimes(url);

    let soup = new JSSoup(animeData, false);

    let description = soup.find('div', 'entry-content').contents[1].text;

    let buttons = soup.findAll('div', 'soraddl');

    buttons = buttons.map(x => {
        return {
            name: x.contents[1].contents[0].text,
            url: x.contents[3].contents[1].contents[3].contents[1].attrs.href
        }
    })

    return {
        description: description,
        links: buttons
    }

}

export default { parseAnimes, getAnimeLink };