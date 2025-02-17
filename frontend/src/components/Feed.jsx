import React, { useState } from 'react';
import { Avatar, Card, CardHeader, CardMedia, CardContent, CardActions, IconButton, Typography, TextField, Button, Badge } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendIcon from '@mui/icons-material/Send';
import CircleIcon from '@mui/icons-material/Circle';

const postsData = [
  {
    id: 1,
    userName: 'John Doe',
    profilePic: 'https://i.pravatar.cc/150?img=1',
    content: 'Beautiful day at the beach!',
    postImage: 'https://source.unsplash.com/random/800x600',
    likes: 3,
    comments: [
      { user: 'Jane', text: 'Looks amazing!' },
      { user: 'Alice', text: 'Wish I was there!' }
    ],
    isLiked: false,
    isOnline: true
  },
  {
    id: 2,
    userName: 'Jane Smith',
    profilePic: 'https://i.pravatar.cc/150?img=2',
    content: 'Just had the best pizza ever!',
    postImage: '',
    likes: 5,
    comments: [],
    isLiked: true,
    isOnline: false
  }
];

const Feed = () => {
  const [posts, setPosts] = useState(postsData);

  const handleLike = (postId) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked
        };
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  const handleComment = (postId, comment) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId && comment.trim() !== '') {
        return {
          ...post,
          comments: [...post.comments, { user: 'You', text: comment }]
        };
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px',marginTop:"50px" }}>
      {posts.map(post => (
        <Card key={post.id} sx={{ marginBottom: '20px', borderRadius: '15px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <CardHeader
            avatar={
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  post.isOnline ? (
                    <CircleIcon sx={{ color: 'green', fontSize: '10px' }} />
                  ) : (
                    <CircleIcon sx={{ color: 'grey', fontSize: '10px' }} />
                  )
                }
              >
                <Avatar src={post.profilePic} />
              </Badge>
            }
            title={post.userName}
            subheader={post.isOnline ? 'Online' : 'Offline'}
          />
          {post.postImage && (
            <CardMedia
              component="img"
              height="300"
              image={post.postImage}
              alt="Post Image"
              sx={{ borderRadius: '10px' }}
            />
          )}
          <CardContent>
            <Typography variant="body1">{post.content}</Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton onClick={() => handleLike(post.id)}>
              {post.isLiked ? (
                <FavoriteIcon sx={{ color: 'red' }} />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
            <Typography>{post.likes} Likes</Typography>
            <IconButton>
              <ChatBubbleOutlineIcon />
            </IconButton>
            <Typography>{post.comments.length} Comments</Typography>
          </CardActions>
          <CardContent>
            {post.comments.map((comment, index) => (
              <Typography key={index} variant="body2" sx={{ marginBottom: '5px' }}>
                <strong>{comment.user}:</strong> {comment.text}
              </Typography>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <TextField
                variant="outlined"
                placeholder="Add a comment..."
                size="small"
                fullWidth
              />
              <IconButton>
                <SendIcon />
              </IconButton>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Feed;
