const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000;

app.get('/sc', (req, res) => {
  const query = req.query.query;

  axios.get(`https://m.soundcloud.com/search/sounds?q=${query}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0',
    }
  })
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);

      const links = [];

      $('script#__NEXT_DATA__').each((index, element) => {
        const jsonData = JSON.parse($(element).html());
        const tracks = jsonData.props.pageProps.initialStoreState.entities.tracks;
        for (const key in tracks) {
          const track = tracks[key];
          const permalinkUrl = track.data.permalink_url;
          links.push({ url: permalinkUrl });
        }
      });

      res.json(links);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
//scrape by jonell Magallanes 