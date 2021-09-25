import axios from 'axios'

async function getMovies(url) {
  let response = await axios.get(url).catch(() => {
    return null
  })

  return response ? response.data : null
}

async function parseMovies(
  max = 12,
  url = 'https://media-api-nyvemm.vercel.app/api/movies'
) {
  const movies = await getMovies(url)
  return movies ? movies.slice(0, max == -1 ? undefined : max) : []
}

async function getMovieLink(url) {
  const movie = await getMovies(
    'https://media-api-nyvemm.vercel.app/api/movies?f=' + url
  )
  return movie
}

export default { parseMovies, getMovieLink }
