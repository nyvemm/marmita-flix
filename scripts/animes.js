import axios from 'axios'

async function getAnimes(url) {
  const response = await axios.get(url).catch(() => {
    return null
  })

  return response ? response.data : null
}

async function parseAnimes(
  max = 12,
  url = 'https://media-api-nyvemm.vercel.app/api/animes'
) {
  const animes = await getAnimes(url)
  return animes ? animes.slice(0, max == -1 ? undefined : max) : []
}

async function getAnimeLink(url) {
  const anime = await getAnimes(
    'https://media-api-nyvemm.vercel.app/api/animes?f=' + url
  )
  return anime
}

export default { parseAnimes, getAnimeLink }
