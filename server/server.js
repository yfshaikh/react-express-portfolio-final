import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import multer from 'multer'
import fs from 'fs'
import PostModel from './models/Post.js'
import mongoose from 'mongoose'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import path from 'path'

const app = express()
const PORT = process.env.PORT || 4000 

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// middleware
app.use(cors({credentials: true, origin: 'http://localhost:3000'}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
const uploadMiddleware = multer({ dest: 'uploads/'})

// Load environment variables from .env file for local development
if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: '../admin/credentials.env' });
  }

// jwt secret token
const secret = process.env.JWT_SECRET;

// hardcoded username and password from environment variables (.env file not included in repo)
const adminUser = process.env.USERNAME;
const adminPass = process.env.PASSWORD;


// MongoDB connection
const { MONGODB_USERNAME, MONGODB_PASSWORD } = process.env;
const connectionString = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@cluster0.y9e7wxr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));





app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`)
})

//handle login
app.post('/login', (req, res) => {
    // get username and password from requsest body
    const {username, password} = req.body
    console.log('test')

    // check username and password
    if (username === adminUser && password === adminPass) {
        console.log('correct')
        // create json web token
        jwt.sign({username}, secret, {}, (error, token) => {
            if(error) throw error;
            // send response as a cookie
            res.cookie('token', token).json('ok')
        })
    } else {
        console.log('wrong')
        res.status(401).json({ message: 'Invalid username or password' })
    }


})

// verify token
app.get('/profile', (req, res) => {
    // get token from request body
    // const token = req.cookies.token
    const {token} = req.cookies
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    jwt.verify(token, secret, {}, (error, info) => {
        if (error) throw error
        res.json(info)
    })
})

// handle logout (reset token)
app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok')
})

// handle post creation
app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    console.log('Request Body:', req.body);
    console.log('Request File:', req.file);

    // Check if a file is uploaded
    if (!req.file) {
        return res.status(400).json({ error: 'Image file is required' });
    }

    
    const {originalname, path} = req.file
    const parts = originalname.split('.')
    const extension = parts[parts.length - 1]
    const newPath = path + '.' + extension
    fs.renameSync(path, newPath)
    

    // Access cookies
    const token = req.cookies.token

    // Verify cookie and post
    jwt.verify(token, secret, {}, async (error, info) => {
        if (error) throw error
        const {title, content} = req.body
        const postDoc = await PostModel.create({
            title: title,
            content: content,
            file: newPath
        })
        res.json(postDoc)
    })
})

// handles put requests for posts
app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    let newPath = null
    if(req.file) {
        const {originalname, path} = req.file
        const parts = originalname.split('.')
        const extension = parts[parts.length - 1]
        newPath = path + '.' + extension
        fs.renameSync(path, newPath)
    }

    // get cookie
    const {token} = req.cookies

    // Verify cookie and update
    jwt.verify(token, secret, {}, async (error, info) => {
        if (error) throw error
        const {title, content, id} = req.body
        const postDoc = await PostModel.findById(id);
        await postDoc.updateOne({
            title, 
            content,
            file: newPath ? newPath : postDoc.file
        })

        
        res.json(postDoc)
    })


})

// handles get requests for posts
app.get('/post', async (req, res) => {
    // find all posts from PostModel
    const posts = await PostModel.find()

    // send posts as response
    res.json(posts)
})


// get a post by ID
app.get('/post/:id', async (req, res) => {
    try {
        const postDoc = await PostModel.findById(req.params.id);
        if (!postDoc) return res.status(404).json({ message: 'Post not found' });
        res.json(postDoc);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a post by ID
app.delete('/post/:id', async (req, res) => {
    try {
        console.log('delete===================================')
      // Access cookies
      const token = req.cookies.token;
  
      // Ve1rify token
      jwt.verify(token, secret, {}, async (error, info) => {
        if (error) return res.status(401).json({ error: 'Unauthorized' })
  
        // Find and delete the post
        const postDoc = await PostModel.findById(req.params.id);
        if (!postDoc) return res.status(404).json({ error: 'Post not found' })
  
        await postDoc.deleteOne();
        res.json({ message: 'Post deleted successfully' })
      })
    } catch (error) {
      res.status(500).json({ error: 'Server error' })
    }
  })
