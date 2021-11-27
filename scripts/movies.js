import axios from 'axios'

async function getMovies(url, page = '') {
  const response = await axios.get(url + page).catch(() => {
    return null
  })

  return response ? response.data : null
}

async function parseMovies(max = 20, url = process.env.MOVIES_URL, page = '1') {
  const movies = await getMovies(url, page)
  return movies ? movies.slice(0, max === -1 ? undefined : max) : []
}

async function getMovieLink(url) {
  console.log(url)
  const movie = await getMovies(`${process.env.MOVIES_URL}?f=` + url)
  return movie
}

export default { parseMovies, getMovieLink }
