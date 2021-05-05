import axios from 'axios';

async function getGames(url) {
    let response = await axios.get(url).catch(() => { return null })

    return response ? response.data : null
}

async function parseGames(max = 12, url = "https://media-api-nyvemm.vercel.app/api/games") {
    const games = await getGames(url);
    return games.slice(0, max == -1 ? undefined : max);
}


export default parseGames;