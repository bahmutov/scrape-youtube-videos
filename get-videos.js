const fs = require('fs')

// list all YouTube videos from the given playlist
// https://developers.google.com/youtube/v3/docs/playlistItems/list

if (!process.env.GOOGLE_API_KEY) {
  console.error('GOOGLE_API_KEY not set')
  process.exit(1)
}

// the playlist id comes from the URL of the playlist
const playlistId = 'PLP9o9QNnQuAYYRpJzDNWpeuOVTwxmIxcI'
const g = require('@googleapis/youtube')
const youtube = g.youtube({
  version: 'v3',
  auth: process.env.GOOGLE_API_KEY,
})

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
  const list = videos.map((video) => {
    return {
      videoId: video.snippet.resourceId.videoId,
      title: video.snippet.title,
      description: video.snippet.description,
      publishedAt: video.snippet.publishedAt,
    }
  })

  return list
}

listVideos().then((list) => {
  // save the list to a file for later use
  fs.writeFileSync('videos.json', JSON.stringify(list, null, 2) + '\n')
}, console.error)
