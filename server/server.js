import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import multer from 'multer'
import fs from 'fs'
import PostModel from './models/Post.js'
import TimelineModel from './models/Timeline.js'
import PDFModel from './models/PDF.js'
import ImageModel from './models/Image.js'
import mongoose from 'mongoose'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import path from 'path'
import { GridFsStorage } from 'multer-gridfs-storage';
import { GridFSBucket } from 'mongodb'


const app = express()

// Get the filename of the current module
const __filename = fileURLToPath(import.meta.url)

// Get the directory name of the current module
const __dirname = dirname(__filename)




// Load environment variables from .env file for local development
if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: '../credentials.env' });
  }


// jwt secret token
const secret = process.env.JWT_SECRET;

// hardcoded username and password from environment variables (.env file not included in repo)
const adminUser = process.env.USERNAME;
const adminPass = process.env.PASSWORD;

// get mongoDB credentials from env
const { MONGODB_USERNAME, MONGODB_PASSWORD } = process.env;

// database URI
const mongoURI = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@cluster0.y9e7wxr.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0`


// connrect to mongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error: ', err))



// Create GridFS storage configuration
const storage = new GridFsStorage({
    url: mongoURI,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
      return {
        bucketName: 'uploads', // name of the GridFS bucket
        filename: `${Date.now()}-${file.originalname}` // filename with timestamp
      }
    }
  })

const upload = multer({ storage }) //send uploads to storage

// middleware


app.use(cors({
    origin: ['https://react-express-portfolio-final-frontend.vercel.app', 'https://react-express-portfolio-final-frontend-msdeb2dib.vercel.app/', 'https://www.yfshaikh.com', 'http://localhost:5173'],
    credentials: true, // Allow cookies to be sent with requests
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// parses the JSON data in the request body and makes it available on req.body
app.use(bodyParser.json())

// parses the cookies in the incoming request and makes them available on req.cookies
app.use(cookieParser())





// MongoDB connection for GridFS
const connection = mongoose.connection;
let gfs;
connection.once('open', () => {
  //  initialize a new GridFS bucket for file storage
  gfs = new GridFSBucket(connection.db, { bucketName: 'uploads' });
});





// Serve static files from the React app
app.use(express.static(path.join(__dirname, '..', 'dist')));


app.get('/api', (req, res) => {
    return res.status(200).json({ message: "Server"})
})


//handle login
app.post('/api/login', (req, res) => {
    // Get username and password from request body
    const { username, password } = req.body

    // Check username and password
    if (username === adminUser && password === adminPass) {
        // Create JSON Web Token
        jwt.sign({ username }, secret, { expiresIn: '1h' }, (error, token) => {
            if (error) throw error

            // Send response as a cookie
            res.cookie('token', token, {
                httpOnly: false, // Ensure the cookie is accessible via JavaScript
                secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
                sameSite: 'none', // Required for cross-site cookies
                maxAge: 3600000 // 1 hour
            }).json('ok')
        });
    } else {
        res.status(401).json({ message: `Invalid username or password. Input cred: ${username} / ${password}` });
    }
})



// verify token
app.get('/api/profile', (req, res) => {
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
app.post('/api/logout', (req, res) => {
    res.cookie('token', '').json('ok')
})



// handle post creation
app.post('/api/post', upload.single('file'), async (req, res) => {
    console.log('Request Body:', req.body);
    console.log('Request File:', req.file);
    

    // Check if a file is uploaded
    if (!req.file) {
        return res.status(400).json({ error: 'Image file is required' });
    }
    

    // Access cookies
    const token = req.cookies.token

    // Verify cookie and post
    jwt.verify(token, secret, {}, async (error, info) => {
        if (error) throw error
        console.log("verified cookie")
        console.log(`file id: ${req.file.id}`)
        const {title, content} = req.body
        const postDoc = await PostModel.create({
            title: title,
            content: content,
            file: req.file.id //store the file ID from GridFS
        })
        res.json(postDoc)
    })
})



// handles put requests for posts
app.put('/api/post', upload.single('file'), async (req, res) => {

    let fileID = null

    if(req.file) {
        // if a new file is uploaded, save its ID
        fileID = req.file.id
    }

    // get cookie
    const { token } = req.cookies

    // Verify cookie and update
    jwt.verify(token, secret, {}, async (error, info) => {
        if (error) throw error
        const {title, content, id} = req.body
        const postDoc = await PostModel.findById(id);
        if (!postDoc) { return res.status(404).json({error: "Post not found"})}
        await postDoc.updateOne({
            title, 
            content,
            file: fileID ? fileID : postDoc.file
        })

        
        res.json(postDoc)
    })


})



// handles get requests for posts
app.get('/api/post', async (req, res) => {
    // find all posts from PostModel
    const posts = await PostModel.find()

    // send posts as response
    res.json(posts)
})




// get a post by ID
app.get('/api/post/:id', async (req, res) => {
    try {
        const postDoc = await PostModel.findById(req.params.id);
        if (!postDoc) return res.status(404).json({ message: 'Post not found' });
        res.json(postDoc);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
})



// Get a file by ID
app.get('/api/file/:id', (req, res) => {
    const { id } = req.params;
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' })
    const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(id))

    downloadStream.on('error', () => {
        res.status(404).json({ error: 'Error downloading the file' })
    });

    downloadStream.pipe(res)
})




// Delete a post by ID
app.delete('/api/post/:id', async (req, res) => {
    try {
      // Access cookies
      const token = req.cookies.token;
  
      // Verify token
      jwt.verify(token, secret, {}, async (error, info) => {
        if (error) return res.status(401).json({ error: 'Unauthorized' })
  
        // Find and delete the post
        const postDoc = await PostModel.findById(req.params.id);
        if (!postDoc) return res.status(404).json({ error: 'Post not found' })
  
        // Delete the associated file from GridFS
            const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' })
            const fileObjectId = new mongoose.Types.ObjectId(postDoc.file)
            bucket.delete(fileObjectId)

        // delete postDoc
        await postDoc.deleteOne();
        res.json({ message: 'Post deleted successfully' })
      })
    } catch (error) {
      res.status(500).json({ error: 'Server error' })
    }
  })


// handles get requests for timeline
app.get('/api/timeline', async (req, res) => {
    try {
        // find all timelines from PostModel
        const timelines = await TimelineModel.find()
        // send posts as response
        res.json(timelines)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching timelines', error });
    }
})



// Create a new timeline
app.post('/api/timeline', async (req, res) => {
    console.log('Request Body:', req.body);
    
    // Access cookies
    const token = req.cookies.token

    // Verify cookie and post
    jwt.verify(token, secret, {}, async (error, info) => {
        if (error) throw error
        console.log("verified cookie")
        const {title, subtitle, description, startDate, endDate} = req.body
        const timelineDoc = await TimelineModel.create({
            title,
            subtitle,
            description,
            startDate,
            endDate
        })
        res.json(timelineDoc)
    })
});

// get a timeline by ID
app.get('/api/timeline/:id', async (req, res) => {
    try {
        // find the timeline
        const timelineDoc = await TimelineModel.findById(req.params.id);
        if (!timelineDoc) return res.status(404).json({ message: 'Timeline not found' });


        res.json(timelineDoc);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
})

// handles put requests for timlines
app.put('/api/timeline', upload.none(), async (req, res) => {

    // get cookie
    const { token } = req.cookies

    // Verify cookie and update
    jwt.verify(token, secret, {}, async (error, info) => {
        if (error) throw error
        const {title, subtitle, description, startDate, endDate, id} = req.body
        const timelineDoc = await TimelineModel.findById(id);
        if (!timelineDoc) { return res.status(404).json({error: "Timeline not found"})}
        await timelineDoc.updateOne({
            title,
            subtitle,
            description,
            startDate,
            endDate
        })

        
        res.json({ message: 'Timeline updated successfully' });
    })


})


// Delete a timeline by ID
app.delete('/api/timeline/:id', async (req, res) => {
    try {
      // Access cookies
      const token = req.cookies.token;
  
      // Verify token and delete
      jwt.verify(token, secret, async (error, info) => {
        if (error) return res.status(401).json({ error: 'Unauthorized' });
  
      // Find and delete the timeline
      const timelineDoc = await TimelineModel.findById(req.params.id);
      if (!timelineDoc) return res.status(404).json({ error: 'Timeline not found' });
  
      // Delete timelineDoc
      await timelineDoc.deleteOne();
      res.json({ message: 'Timeline deleted successfully' });

      });
    } catch (error) {
      console.error('Error deleting timeline:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  




// handles get requests for pdf titles
app.get('/api/pdfTitle', async (req, res) => {
    // find all pdf titles (and image IDs) from PDFModel
    const pdfs = await PDFModel.find({})

    // send as response
    res.json(pdfs)
})

// get a pdf title by ID
app.get('/api/pdfTitle/:id', async (req, res) => {
    try {
        const pdfDoc = await PDFModel.findById(req.params.id);
        if (!pdfDoc) return res.status(404).json({ message: 'Title not found' });
        res.json(pdfDoc);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
})

 

// Get a pdf by ID
app.get('/api/pdf/:id', (req, res) => {
    const { id } = req.params;
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' })
    const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(id))
    res.setHeader('Content-Type', 'application/pdf'); // ensure the content type is set to PDF
    downloadStream.on('error', () => {
        res.status(404).json({ error: 'Error downloading the file' })
    });

    downloadStream.pipe(res)
})


// upload a pdf

app.post('/api/uploadPdf', upload.single('file'), (req, res) => {

    const { title, imageId } = req.body; // expect imageId in the request body


    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Access cookies
    const token = req.cookies.token
  
    // Verify cookie and post
    jwt.verify(token, secret, {}, async (error, info) => {
        if (error) throw error
        const pdfDoc = {
        title: title,
        file: req.file.id, // store the file ID from GridFS
        image: imageId, // store the associated image ID
        };
    
        PDFModel.create(pdfDoc)
        .then(result => res.json(result))
        .catch(err => res.status(500).json({ error: 'Failed to save PDF info' }));
    });

  });
  




// handle image uploads
app.post('/api/uploadImage', upload.single('image'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    // Access cookies
    const token = req.cookies.token
  
    // Verify cookie and post
    jwt.verify(token, secret, {}, async (error, info) => {
        const imageDoc = {
        file: req.file.id // store the file ID from GridFS
        };
    
        // Save the image information to the database
        ImageModel.create(imageDoc)
        .then(result => res.json(result))
        .catch(err => res.status(500).json({ error: 'Failed to save image info' }));
    });
  });


// fetch an image by ID
app.get('/api/image/:id', async (req, res) => {
    // get the image id from the request
    const imageId = new mongoose.Types.ObjectId(req.params.id);

    console.log(`Fetching image with ID: ${imageId}`);

    // find the image document in the collection
    const imageDoc = await ImageModel.findById(imageId);
  
    // initialize GridFSBucket
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' })

    // ppen a download stream
    const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(imageDoc.file))

    downloadStream.on('error', () => {
        res.status(404).json({ error: 'Error downloading the file' })
    });

    downloadStream.pipe(res)
  });







  
  



// for any request that doesn't match one above, send back index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
  })




const PORT = process.env.PORT || 4000 
app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`)
})
 