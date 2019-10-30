const express = require("express");
const app = express();

app.use(express.json());

const { PORT = 8080 } = process.env;

let currentId = 0;
let tweets = [];

const find = id => tweets.find(t => t.id == id);
const filter = id => tweets.filter(t => t.id != id);

app
  .route("/")
  .get((req, res) => res.json(tweets))
  .post((req, res) => {
    const { username, content } = req.body;
    if (!username || !content) res.sendStatus(400);
    const newTweet = {
      username,
      content,
      id: currentId
    };
    currentId += 1;
    tweets.push(newTweet);
    res.sendStatus(201);
  });

app
  .route("/:id")
  .put((req, res) => {
    const id = req.params.id;
    const { username, content } = req.body;
    const tweetToEdit = find(id);
    if (!tweetToEdit) res.sendStatus(404);
    if (!content || tweetToEdit.username != username) res.sendStatus(400);
    tweetToEdit.content = content;
    res.sendStatus(200);
  })
  .delete((req, res) => {
    const id = req.params.id;
    if (!find(id)) res.sendStatus(404);
    tweets = filter(id);
    res.sendStatus(200);
  });

app.listen(PORT, () => {
  console.log(`Application running at port ${PORT}`);
});
