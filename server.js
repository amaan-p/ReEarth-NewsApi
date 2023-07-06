const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');

const app = express();

const searchString = 'recycling'; // What we want to search
const encodedString = encodeURI(searchString); // What we want to search for in URI encoding

const AXIOS_OPTIONS = {
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36',
  }, // Adding the User-Agent header as one way to prevent the request from being blocked
  params: {
    q: encodedString, // Our encoded search string
    tbm: 'nws', // Parameter defines the type of search you want to do ("nws" means news)
    hl: 'en', // Parameter defines the language to use for the Google search
    gl: 'in', // Parameter defines the country to use for the Google search
  },
};

app.get('/news', (req, res) => {
  axios
    .get('http://google.com/search', AXIOS_OPTIONS)
    .then(({ data }) => {
      const $ = cheerio.load(data);

      const allNewsInfo = Array.from($('.WlydOe')).map((el) => {
        return {
          link: $(el).attr('href'),
          source: $(el).find('.CEMjEf span').text().trim(),
          title: $(el).find('.nDgy9d').text().trim().replace('\n', ''),
          snippet: $(el).find('.GI74Re').text().trim().replace('\n', ''),
          imgURL: $(el).find('#div_img img').text().trim().replace('\n', ''),
          date: $(el).find('span').text().trim(),
        };
      });

      res.json(allNewsInfo);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    });
});

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
