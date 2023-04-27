# scrape-youtube-videos [![scrape](https://github.com/bahmutov/scrape-youtube-videos/actions/workflows/scrape.yml/badge.svg?branch=main)](https://github.com/bahmutov/scrape-youtube-videos/actions/workflows/scrape.yml)

> Scrape YouTube playlist into Algolia index

- [Google API Node client](https://github.com/googleapis/google-api-nodejs-client)

```shell
# get the list of YouTube videos from my playlist
$ as-a . node ./bin/get-videos
# saves the videos into "videos.json" file
# make and upload records to Algolia
$ as-a . node ./upload-to-algolia.js
```

See result at [https://cypress.tips/search](https://cypress.tips/search)

## Debugging

See verbose logs by running this app with the environment variable `DEBUG=scrape-youtube-videos`
