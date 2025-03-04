//CRUD for urls
import express from 'express';
import { Url, validateUrl } from '../models/url.js';


const router = express.Router();
router.use(express.json());

router.get('/', async (req, res) => {
    const urls = await Url.find({ isActive: true });
    res.send(urls);
});

router.get('/all', async (req, res) => {
    const urls = await Url.find();
    res.send(urls);
});

router.get('/:shortUrl', async (req, res) => {
    const url = await Url.findOne({ shortUrl: req.params.shortUrl });
    if (!url) return res.status(404).send('The url with the given shortUrl was not found');

    //if url is not active, return 404 it is outdated
    if (!url.isActive) return res.status(404).send('The url with the given shortUrl is not active');

    url.clicks++;
    await url.save();

    res.redirect(url.originalUrl);
});

router.put('/deactivate/:shortUrl', async (req, res) => {
    const url = await Url.findOne({ shortUrl: req.params.shortUrl });
    if (!url) return res.status(404).send('The url with the given shortUrl was not found');

    url.isActive = false;
    await url.save();

    res.send(url);
}
);

router.post('/', async (req, res) => {
    const { error } = validateUrl(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const url = new Url({
        originalUrl: req.body.originalUrl,
    });

    await url.save();
    res.send(url);
});

router.delete('/:shortUrl', async (req, res) => {
    const url = await Url.findOne({ shortUrl: req.params.shortUrl });
    if (!url) return res.status(404).send('The url with the given shortUrl was not found');
    
    await Url.findOneAndDelete({ shortUrl: req.params.shortUrl });
    res.send(url);

});

export {router as urlsRouter};