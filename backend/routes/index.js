var express = require('express');
const { load, save } = require('../utils/data')
const webPush = require('web-push')

var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', function(req, res, next) {
  const subscribeData = load('data/subscribe.json')
  subscribeData[req.body.pushSubscription.keys.auth] = req.body.pushSubscription
  save('data/subscribe.json', subscribeData)
  res.status(204).send();
});

router.post('/notify', async (req, res, next) => {
  const { title, body, icon, tag, url } = req.body

  const options = {
    TTL: 24 * 60 * 60,
    vapidDetails: {
      subject: 'http://localhost:3001', // 서버 주소
      publicKey: process.env.WEB_PUSH_PUBLIC_KEY,
      privateKey: process.env.WEB_PUSH_PRIVATE_KEY,
    },
  };

  const payload = JSON.stringify({
    title,
    body,
    icon: icon || 'https://s3.hyuns.dev/hyuns.jpg',
    tag,
    url,
    ...req.query,
  });

  try {
    await Promise.all(Object.values(load('data/subscribe.json')).map((t) => webPush.sendNotification(t, payload, options)));
  } catch (e) {
    console.error(e);
  }

  res.status(204).send();
})

module.exports = router;
