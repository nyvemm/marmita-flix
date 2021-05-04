import axios from 'axios';
import JSSoup from "jssoup";
import he from 'he';

async function getGames(url) {
    let response = await axios.get(url).catch(() => { return null })

    if (response.status !== 200) {
        console.log('Error: Fetching Data');
        return null;
    }
    return response.data
}

async function parseGames(max = 12, url = "http://rutor.info/browse/0/0/1224038/0") {

    url = url === 'http://rutor.info/search/0/8/000/0/' ? 'http://rutor.info/browse/0/0/1224038/0"' : url

    const gamesData = await getGames(url);
    let games = [];

    if (gamesData) {
        let soup = new JSSoup(gamesData, false);

        let collection = soup.findAll("table")[2].contents;

        /* Removes the table header */
        collection.shift()

        /* Define max possible if get -1 */
        max = max === -1 ? collection.length : max;

        for (let game of collection.slice(0, max)) {
            let link = game.contents[1].contents[3].attrs.href

            let name = game.contents[1].contents[3].text

            let magnet = game.contents[1].contents[1].attrs.href

            if (name.includes('RePack от FitGirl')) {

                const gameAccessData = await getGames('http://rutor.info/' + link);
                let gameSoup = new JSSoup(gameAccessData, false);

                let detailTable = gameSoup.findAll('table')[2];

                let imageUrl = detailTable.contents[1].contents[1].contents[1].attrs.src;

                games.push({
                    img: imageUrl,
                    name: he.decode(name).replace('RePack от FitGirl', ''),
                    url: magnet,
                });
            }


        }

    }
    return games;
}

export default parseGames;