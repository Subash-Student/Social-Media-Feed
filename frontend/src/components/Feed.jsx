import React, { useContext, useEffect, useState } from 'react';
import { Avatar, Card, CardHeader, CardMedia, CardContent, CardActions, IconButton, Typography, TextField, Button, Badge } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendIcon from '@mui/icons-material/Send';
import CircleIcon from '@mui/icons-material/Circle';
import { StoreContext } from '../context/context';
import axios from "axios"
import DeleteIcon from '@mui/icons-material/Delete';



const Feed = () => {
  
  const { posts = [], setPosts, userData, filterOption } = useContext(StoreContext);
  const [commentsText, setCommentsText] = useState({});
  const [openKey, setOpenKey] = useState(0);
 console.log(filterOption)
  // Ensure posts is always an array
  let filtered = Array.isArray(posts) ? [...posts] : [];

  
  // Filtering and Sorting Logic
if (filterOption === "liked") {
  filtered = filtered
    .filter((post) => post.likes >= 0)
    .sort((a, b) => b.likes - a.likes); // Sort by likes in descending order
} else if (filterOption === "commented") {
  filtered = filtered
    .filter((post) => post.comments && post.comments.length >= 0)
    .sort((a, b) => b.comments.length - a.comments.length); // Sort by number of comments in descending order
} else if (filterOption === "images") {
  filtered = filtered.filter((post) => post.postImage);
} else if (filterOption === "myPost") {
  filtered = filtered.filter((post) => post.user_id == userData._id);
}


  // Like functionality
  const handleLike = async (postId) => {
    try {
      const post = posts.find((p) => p._id === postId);
      const isLiked = post.isLiked.some((id) => id == userData._id);
  
      if (isLiked) {
        // Remove like
        await axios.delete(`http://localhost:5000/api/posts/${postId}/like/${userData._id}`);
      } else {
        // Add like
        await axios.post(`http://localhost:5000/api/posts/${postId}/like/${userData._id}`);
      }
  
      // Update the local state
      const updatedPosts = posts.map((p) =>
        p._id === postId
          ? {
              ...p,
              likes: isLiked ? p.likes - 1 : p.likes + 1,
              isLiked: isLiked
                ? p.isLiked.filter((id) => id !== userData._id) // Remove user_id from isLiked
                : [...p.isLiked, userData._id], // Add user_id to isLiked
            }
          : p
      );
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };
  

  // Comment functionality
  const handleComment = async (postId) => {
    const text = commentsText[postId];
    if (!text?.trim()) return;

    try {
      const response = await axios.post(`http://localhost:5000/api/posts/${postId}/comments`, {
        user: userData.username, 
        text,
      });

      if (response.status === 201) { 
        const newComment = response.data.comment;
        // Update the local state immutably
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? { ...post, comments: [...post.comments, newComment] }
              : post
          )
        );
        // Clear the comment input for the post
        setCommentsText({ ...commentsText, [postId]: '' });
      } else {
        console.error("Failed to add comment:", response);
      }

    } catch (error) {
      console.log(error);
    }
  };

  // Delete comment functionality
  const handleDeleteComment = async (postId, commentIndex) => {
    const updatedPosts = posts.map((post) => {
      if (post._id === postId) {
        const updatedComments = [...post.comments];
        updatedComments.splice(commentIndex, 1); // Remove the comment at the specified index
        return { ...post, comments: updatedComments };
      }
      return post;
    });

    try {
      const response = await axios.delete(`http://localhost:5000/api/posts/${postId}/comments/${commentIndex}`);
    } catch (error) {
      console.log(error);
    }
    setPosts(updatedPosts);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      {(filtered || []).map(post => (
        <Card key={post._id} sx={{ marginBottom: '20px', borderRadius: '15px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <CardHeader
            avatar={
              // <Badge
              //   overlap="circular"
              //   anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              //   badgeContent={
              //     post.isOnline ? (
              //       <CircleIcon sx={{ color: 'green', fontSize: '10px' }} />
              //     ) : (
              //       <CircleIcon sx={{ color: 'grey', fontSize: '10px' }} />
              //     )
              //   }
              // >
                <Avatar src={post.profilePic} />
              // </Badge>
            }
            title={post.userName}
            // subheader={post.isOnline ? 'Online' : 'Offline'}
          />
          {post.postImage && (
            <CardMedia

              component="img"
              height="300"
              image={post.postImage}
              alt="Post Image"
              sx={{ borderRadius: '10px',objectFit:"contain" }}
            />
          )}
          <CardContent>
            <Typography variant="body1">{post.content}</Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton onClick={() => handleLike(post._id)}>
              {post.isLiked.some(id => id==userData._id) ? (
                <FavoriteIcon sx={{ color: 'red' }} />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
            <Typography>{post.likes} Likes</Typography>
            <IconButton onClick={()=>setOpenKey(prev=>prev === post._id ?0:post._id)}>
              <ChatBubbleOutlineIcon />
            </IconButton >
            <Typography style={{cursor:"pointer"}} >{post.comments.length} Comments</Typography>
          </CardActions>
          {openKey === post._id && 
          <CardContent>
          {/* Comments Section */}
          <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '8px', padding: '10px' }}>
            {post.comments.map((comment, index) => {
              // Parse the JSON string to an object
              const parsedComment = comment
              
              // Access the user and text properties
              const user = parsedComment.user; // Accessing the user name
              const text = parsedComment.text; // Accessing the comment text

              return (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <Typography variant="body2">
                    <strong>{user}:</strong> {text}
                  </Typography>
                  {user === userData.username &&
                  <IconButton onClick={() => handleDeleteComment(post._id, index)} size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                  }
                </div>
              );
            })}
          </div>

          {/* Add Comment Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
            <TextField
              variant="outlined"
              placeholder="Add a comment..."
              size="small"
              fullWidth
              value={commentsText[post._id] || ''}
              onChange={(e) => setCommentsText({ ...commentsText, [post._id]: e.target.value })}
            />
            <IconButton onClick={() => handleComment(post._id)}>
              <SendIcon />
            </IconButton>
          </div>
        </CardContent>
          }
          
        </Card>
      ))}
    </div>
  );
};

export default Feed;
