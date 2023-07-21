import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json());
const timeout=(req,res,next)=>{
    req.timeout=500;
    next()
}
app.get('/numbers', async (req, res) => {
  const urlArr = req.query.url;
  if (!urlArr) {
    return res.status(400).send('The request is empty');
  }
  const urls = Array.isArray(urlArr) ? urlArr : [urlArr];
  const UrlStore = [];
  const dsStore = new Set();

  try {
    for (const u of urls) {
      try {
        new URL(u);
        UrlStore.push(u);
      } catch (error) {
        return res.status(403).json({ success: false, message: 'There is an invalid URL' });
      }
    }

    for (const u of UrlStore) {
      try {
        const response = await axios.get(u,);
        const ans = response.data.numbers;

        ans.forEach((number) => {
          if (!isNaN(number)) {
            dsStore.add(number);
          }
        });
      } catch (error) {
        return res.status(500).json({ success: false, message: 'Error fetching data from one or more URLs' });
      }
    }

    const dsStoreArr = Array.from(dsStore);
    dsStoreArr.sort((a, b) => a - b); 

    res.status(200).json({ numbers: dsStoreArr });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.listen(8008, () => {
  console.log('Server is running on port 8008');
});
