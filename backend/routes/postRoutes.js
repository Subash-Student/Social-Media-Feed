
import express from 'express';
import multer from 'multer';
import {
   getAllPosts,
   getPostById,
//    addPost,
   addLike,
   removeComment,
   removeLike,addComment,
   createPost
} from '../controller/postController.js'; 

const postRouter = express.Router();

// const storage = multer.diskStorage({
//     destination:"uploads",
//     filename :(req,file,cb)=>{
//        return cb(null,`${Date.now()} ${file.originalname}`)
//     }
// })

// const upload = multer({storage:storage}); 

postRouter.post('/add-post', multer().single("postImage"), createPost);
postRouter.get('/posts', getAllPosts);
postRouter.get('/posts/:id', getPostById);
postRouter.post('/posts/:id/like', addLike);
postRouter.delete('/posts/:id/like', removeLike);
postRouter.post('/posts/:id/comments', addComment);
postRouter.delete('/posts/:postId/comments/:commentIndex', removeComment);


export default postRouter;
