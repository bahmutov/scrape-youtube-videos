# scrape-youtube-videos
> Scrape YouTube playlist into Algolia index

- [Google API Node client](https://github.com/googleapis/google-api-nodejs-client)

```shell
# get the list of YouTube videos from my playlist
$ as-a . node ./get-videos
# saves the videos into "videos.json" file
# make and upload records to Algolia
$ as-a . node ./upload-to-algolia.js
```

See result at [https://cypress.tips/search](https://cypress.tips/search)
