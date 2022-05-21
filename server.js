import express from 'express';
import session from 'express-session';
import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

const port = 3000;
const app = express();
const saltRounds = 10;

app.use(express.json());

app.use(express.static('public'));

const client = new MongoClient('mongodb://127.0.0.1:27017');
await client.connect();
const db = client.db('bank');
const accountCollection = db.collection('account');

app.use(session({
    resave: false, 
    saveUninitialized: false, 
    
    secret: 'secret',
    cookie: {
      maxAge: 5 * 60 * 1000 
    }
  }));


  
  
  app.post('/api/account/login', async (req, res) => {
    const user = await accountCollection.findOne({ user: req.body.user });
    const passMatches = await bcrypt.compare(req.body.password, user.password);
    if (user && passMatches) {
      req.session.user = user;
      
      res.json({
        user: user.user
      });
    } else { 
      res.status(401).json({ error: 'Unauthorized' });
    }
  });

  app.get('/api/account/loggedin', async (req, res) => {
    if (req.session.user) {
      const user = await accountCollection.findOne({ 
        user: req.session.user.user });
      req.session.user = user;

      res.json({
       
        user: req.session.user
      
      });
    } else { 
      res.status(401).json({ error: 'Unauthorized' });
    }
  });

  app.post('/api/account/logout', (req, res) => {
    req.session.destroy(() => {
      res.json({
        loggedin: false
      });
    });
  });

  app.put('/api/account/update/:id', async (req, res) => {
    let account = await accountCollection.findOne({ _id: ObjectId(req.params.id) });
    account = {
      ...account,
      ...req.body
    };
    await accountCollection.updateOne({ _id: ObjectId(req.params.id) }, { $set: account });
    res.json({
      success: true,
      account
    });
  });
 



app.post('/api/account/create', async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, saltRounds);
  const account = {
    user: req.body.user,
    password: hash,
    name: req.body.name,
    total: req.body.total,
    accountnumber: req.body.accountnumber,
    accounttype: req.body.accounttype
  
  };
  await accountCollection.insertOne(account);
  res.json({
    success: true,
    account
  });
});


  app.delete('/api/account/delete/:id', async (req, res) => {
    await accountCollection.deleteOne({ _id: ObjectId(req.params.id) });
    res.status(204).send();
  });


app.listen(port, () => console.log(`Listening on port ${port}`));