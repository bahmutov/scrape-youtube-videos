const debug = require('debug')('scrape-youtube-videos')
const fs = require('fs')

// list all YouTube videos from the given playlist
// https://developers.google.com/youtube/v3/docs/playlistItems/list

if (!process.env.GOOGLE_API_KEY) {
  console.error('GOOGLE_API_KEY not set')
  process.exit(1)
}

// the playlist id comes from the URL of the playlist
const playlistId = 'PLP9o9QNnQuAYYRpJzDNWpeuOVTwxmIxcI'
debug('scraping playlist %s', playlistId)

const g = require('@googleapis/youtube')
const youtube = g.youtube({
  version: 'v3',
  auth: process.env.GOOGLE_API_KEY,
})

const isPrivateVideo = (video) => {
  return (
    video.snippet.title === 'Private video' &&
    video.snippet.description === 'This video is private.'
  )
}
const isPublicVideo = (video) => !isPrivateVideo(video)

async function listVideos() {
  const videos = []
  let pageToken

  while (true) {
    const response = await youtube.playlistItems.list({
      playlistId,
      part: 'snippet',
      pageToken,
      maxResults: 50,
    })
    console.log('found %d video(s)', response.data.items.length)
    if (!response.data.items.length) {
      break
    }

    videos.push(...response.data.items)
    if (response.data.nextPageToken) {
      pageToken = response.data.nextPageToken
    } else {
      break
    }
  }

  console.log('total have %d video(s)', videos.length)
  const list = videos
    .filter(isPublicVideo)
    // slice just for testing and debugging
    // .slice(0, 2)
    .map((video, k) => {
      if (k < 3) {
        debug('video %d', k)
        debug('%o', video)
      }

      const videoId = video.snippet.resourceId.videoId
      return {
        videoId,
        title: video.snippet.title,
        description: video.snippet.description,
        publishedAt: video.snippet.publishedAt,
        url: `https://youtu.be/${videoId}`,
      }
    })

  return list
}

function getPlaylistVideos(filename) {
  return listVideos().then((list) => {
    console.log('filtered list with %d video(s)', list.length)
    if (filename) {
      // save the list to a file for later use
      fs.writeFileSync(filename, JSON.stringify(list, null, 2) + '\n')
      console.log('saved file %s', filename)
    }
    return list
  }, console.error)
}

module.exports = { getPlaylistVideos }
