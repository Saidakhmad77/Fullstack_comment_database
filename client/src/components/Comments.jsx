import './Comments.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [username, setUsername] = useState('');
  const [commentText, setCommentText] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentCommentId, setCurrentCommentId] = useState(null);

  // Fetch comments from the backend
  const fetchComments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/comment/');
      setComments(response.data); // Assuming your API returns an array of comments
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // Add a new comment
  const handleAddComment = async () => {
    if (!username || !commentText) {
      alert('Please fill in both fields');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/comment/', {
        username,
        comment_text: commentText,
      });
      setUsername('');
      setCommentText('');
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Edit a comment
  const handleEditComment = (comment) => {
    setEditMode(true);
    setCurrentCommentId(comment.comment_id);
    setUsername(comment.username);
    setCommentText(comment.comment_text);
  };

  // Update a comment
  const handleUpdateComment = async () => {
    if (!commentText) {
      alert('Please enter a comment');
      return;
    }

    try {
      await axios.put('http://localhost:5000/api/comment/', {
        comment_id: currentCommentId,
        comment_text: commentText,
      });
      setEditMode(false);
      setCurrentCommentId(null);
      setUsername('');
      setCommentText('');
      fetchComments();
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  // Delete a comment
  const handleDeleteComment = async (comment_id) => {
    try {
      await axios.delete('http://localhost:5000/api/comment/', {
        data: { comment_id },
      });
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div className="comments-container">
      <h2>Comments</h2>
      <div className="add-comment">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Comment"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        {editMode ? (
          <button className="update-button" onClick={handleUpdateComment}>
            Update Comment
          </button>
        ) : (
          <button className="add-button" onClick={handleAddComment}>
            Add Comment
          </button>
        )}
      </div>
      <table className="comments-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Comment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((comment) => (
            <tr key={comment.comment_id}>
              <td>{comment.username}</td>
              <td>{comment.comment_text}</td>
              <td>
                <button
                  className="edit-button"
                  onClick={() => handleEditComment(comment)}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteComment(comment.comment_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Comments;