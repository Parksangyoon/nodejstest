const express = require('express');
const app = express();
const bodyParser = require('body-parser');

let users = [
  {
  email: 'mim3431@naver.com',
  password: 'password',
  gender: 'men',
  first_name: 'park',
  last_name: 'sangyoon',
  year: 91,
  month: 06,
  day: 09,
  job:'student'
  }
];

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


app.get('/v1/users', (req, res) => {

  res.json(users);
  console.log("connect");

});

app.post('/v1/users', (req, res) => {
  console.log("connectpost \n");
  const user = req.body;
  users.push(user);
  res.json(users);
})

app.get('/test', (req, res) => {

  res.json(users);
  console.log("connect");

});
app.get('/users', (req, res) => {
  const limit = parseInt(req.query.limit, 10);
  if (Number.isNaN(limit)) return res.status(400).end();

  const offset = parseInt(req.query.offset, 10);
  if (Number.isNaN(offset)) return res.status(400).end();

  const results = users.filter((user, idx)=> {
    return idx < limit;
  });
  res.json(results);

});
app.get('/users/:id', (req, res)=>{
  const id = parseInt(req.params.id, 10);
  if(Number.isNaN(id)) return res.status(400).end();

  const user = users.filter(u => u.id === id)[0];
  if(user === undefined) return res.status(404).end();

  res.json(user);
});
app.post('/users', (req, res) => {
  const name = req.body.name;
  if (!name) return res.status(400).end();

  const foundUsers = users.filter(user => user.name === name);
  if (foundUsers.length > 0) return res.status(409).end();

  const id = users.reduce((max, user) => {
    return user.id > max ? user.id : max;
  }, 0) + 1;
  const user = {name, id};
  users.push(user);
  res.json(user);
})
app.put('/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if(Number.isNaN(id)) return res.status(400).end();

  const name = req.body.name;
  if (name === undefined) return res.status(400).end();

  const user = users.filter(user => user.id === id)[0];
  if (user === undefined) return res.status(404).end();

  const confilct = users.filter(user => user.name === name).length > 0;
  if (confilct) return res.status(409).end();

  user.name = name;
  res.json(user);
});
app.delete('/users/:id', (req,res) =>{
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).end();

  users = users.filter(user => user.id !== id);
  res.status(204).end();
});


app.listen(3000, () => {
    console.log(`Run at http://localhost:3000`)
});
module.exports = app;
