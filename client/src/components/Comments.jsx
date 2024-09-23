import './Comments.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Comments = () => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState({ username: '', comment_text: '' });
    const [editComment, setEditComment] = useState({ comment_id: '', comment_text: '' });
  

    useEffect(() => {
      fetchComments();
    }, []);
  
    const fetchComments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/comment/');
        setComments(response.data); 
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
  
    const handleAddComment = async () => {
      if (!newComment.username || !newComment.comment_text) return; 
      try {
        await axios.post('http://localhost:5000/api/comment/', newComment);
        setNewComment({ username: '', comment_text: '' });
        fetchComments();
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    };
  
    const handleEditClick = (comment) => {
      setEditComment({ comment_id: comment.comment_id, comment_text: comment.comment_text });
    };
  
    const handleUpdateComment = async () => {
      if (!editComment.comment_text) return; // Prevent empty update
      try {
        await axios.put('http://localhost:5000/api/comment/', editComment);
        setEditComment({ comment_id: '', comment_text: '' });
        fetchComments();
      } catch (error) {
        console.error('Error updating comment:', error);
      }
    };
  
    const handleDeleteComment = async (id) => {
      try {
        await axios.delete('http://localhost:5000/api/comment/', {
          data: { comment_id: id },
        });
        fetchComments();
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    };
  
    return (
      <div className="comments-container">
        <h2>Comments</h2>
  
        {/* Add New Comment Section */}
        <div className="add-comment">
          <input
            type="text"
            placeholder="Username"
            value={newComment.username}
            onChange={(e) => setNewComment({ ...newComment, username: e.target.value })}
          />
          <input
            type="text"
            placeholder="Comment"
            value={newComment.comment_text}
            onChange={(e) => setNewComment({ ...newComment, comment_text: e.target.value })}
          />
          <button className="add-button" onClick={handleAddComment}>
            Add Comment
          </button>
        </div>
  
        {/* Comments List */}
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
                <td>
                  {editComment.comment_id === comment.comment_id ? (
                    <input
                      type="text"
                      value={editComment.comment_text}
                      onChange={(e) =>
                        setEditComment({ ...editComment, comment_text: e.target.value })
                      }
                    />
                  ) : (
                    comment.comment_text
                  )}
                </td>
                <td>
                  {editComment.comment_id === comment.comment_id ? (
                    <button className="update-button" onClick={handleUpdateComment}>
                      Update
                    </button>
                  ) : (
                    <>
                      <button className="edit-button" onClick={() => handleEditClick(comment)}>
                        Edit
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteComment(comment.comment_id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default Comments;