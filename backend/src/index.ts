import dotenv from 'dotenv';
dotenv.config()
import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors'; 
import crypto from 'crypto';
import { ContentModel, UserModel, LinkModel } from './db';

 
const JWT_SECRET = process.env.JWT_SECRET!;
 
const MONGO_URI = process.env.MONGO_URI !;
 

mongoose.connect(MONGO_URI).then(() => console.log("✅ MongoDB connected")).catch(err => console.error("❌ Connection failed:", err.message));
  
mongoose.connection.on('connected', () => console.log('Mongoose connected'));
mongoose.connection.on('error', err => console.error('Mongoose connection error:', err));
mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));


 
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ✅ Extend Express Request
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

 
 
function auth(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers['token'] as string | undefined;

  if (!token) {
    res.status(401).json({ message: "Token missing" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    req.userId = decoded.id;
 
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

 
 
app.post('/api/v1/signup', async (req: Request, res: Response): Promise<void> => {
 
  try {
    const { name, email, password } = req.body;
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, name: user.name });
  } catch (err: any) {
 
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error during signup', error: err.message || err });
 
  }
});

// ✅ Signin
app.post('/api/v1/signin', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, name: user.name });
  } catch (err: any) {
    res.status(500).json({ message: 'Server error during signin', error: err.message || err });
  }
});

// ✅ Get content
app.get('/api/v1/content', auth, async (req: Request, res: Response): Promise<void> => {
  try {
    const content = await ContentModel.find({ userId: req.userId });
    res.json({ content });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch content',  erroe: err.message || err });
  }
});

// ✅ Create content
app.post('/api/v1/content', auth, async (req: Request, res: Response): Promise<void> => {
  try {
 
    const {id, type, link, title } = req.body;
    const content = await ContentModel.create({
      id,
      type,
      link,
      title,
      userId: req.userId
    });
    res.status(201).json({ message: 'Content saved', content });
  } catch (err:any) {
    res.status(500).json({ message: 'Failed to save content', error: err.message || err });  
}});

// ✅ Delete content
app.delete("/api/v1/content/:id", auth, async (req: Request, res: Response): Promise<void> => {
  try {
 
    const id = parseInt(req.params.id);
 

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid numeric content ID" });
      return;
    }

    const content = await ContentModel.findOneAndDelete({ id, userId: req.userId });

    if (!content) {
      res.status(404).json({ message: "Content not found for the given ID" });
      return;
    }

    res.status(200).json({ message: `Content with ID ${id} has been deleted successfully.` });
  } catch (err: any) {
    res.status(500).json({ message: "Internal Server Error", error: err?.message || err });
  }
});

 
app.post("/api/v1/brain/share", auth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { share } = req.body;

    if (share) {
      const existingLink = await LinkModel.findOne({ userId: req.userId });

      if (existingLink) {
        res.json({ hash: existingLink.hash });
        return;
      }

      const hash = crypto.randomBytes(5).toString('hex');
      await LinkModel.create({ userId: req.userId, hash });

      res.json({ hash });
    } else {
      await LinkModel.deleteOne({ userId: req.userId });
      res.json({ message: "Removed link" });
    }
  } catch (err: any) {
    res.status(500).json({ message: "Internal Server Error", error: err?.message || err });
  }
});

// ✅ View shared content
app.get("/api/v1/brain/:shareLink", async (req: Request, res: Response): Promise<void> => {
  try {
    const { shareLink: hash } = req.params;
    const link = await LinkModel.findOne({ hash });

    if (!link) {
      res.status(404).json({ message: "Invalid or expired share link" });
      return;
    }

    const content = await ContentModel.find({ userId: link.userId });
    const user = await UserModel.findById(link.userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({ name: user.name, content });
  } catch (err: any) {
    res.status(500).json({ message: "Internal Server Error", error: err?.message || err });
  }
});
 

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app;
