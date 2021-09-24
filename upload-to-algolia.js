const algoliasearch = require('algoliasearch')
const videos = require('./videos.json')

const { APPLICATION_ID, ADMIN_API_KEY, INDEX_NAME } = process.env
if (!APPLICATION_ID || !ADMIN_API_KEY || !INDEX_NAME) {
  console.error('Algolia app/key not set')
  console.error('Skipping uploading records')
  process.exit(1)
}

const client = algoliasearch(APPLICATION_ID, ADMIN_API_KEY)
const index = client.initIndex(INDEX_NAME)

const scrapedTimestamp = +new Date()
const records = []
videos.forEach((video) => {
  const url = `https://youtu.be/${video.videoId}`
  // each video generates 2 records
  const titleRecord = {
    content: video.title,
    url,
    hierarchy: {
      lvl0: video.title,
    },
    type: 'content',
    scrapedTimestamp,
    objectID: video.videoId + '_title',
  }

  const descriptionRecord = {
    content: video.description,
    url,
    hierarchy: {
      lvl0: video.title,
    },
    type: 'content',
    scrapedTimestamp,
    objectID: video.videoId + '_description',
  }

  records.push(titleRecord)
  records.push(descriptionRecord)
})

console.log('%s: adding %d records', INDEX_NAME, records.length)
index
  .saveObjects(records, {
    // each record should already have an objectID
    autoGenerateObjectIDIfNotExist: false,
  })
  .then(console.log, console.error)
