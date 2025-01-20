'use client';

import { useEffect, useState } from 'react';
import { User } from './types/auth';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: number;
}

export default function Comments({ quizId }: { quizId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const storedComments = localStorage.getItem(`quiz_${quizId}_comments`);
    if (storedComments) {
      setComments(JSON.parse(storedComments));
    }
  }, [quizId]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    const newCommentObj = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      content: newComment.trim(),
      timestamp: Date.now(),
    };

    const updatedComments = [...comments, newCommentObj];
    localStorage.setItem(`quiz_${quizId}_comments`, JSON.stringify(updatedComments));
    setComments(updatedComments);
    setNewComment('');
  };

  const handleDeleteComment = (commentId: string) => {
    if (!user) return;
    const updatedComments = comments.filter(c => c.id !== commentId);
    localStorage.setItem(`quiz_${quizId}_comments`, JSON.stringify(updatedComments));
    setComments(updatedComments);
  };

  const canDeleteComment = (comment: Comment) => {
    if (!user) return false;
    return user.role === 'ADMIN' || user.role === 'MODERATOR' || user.id === comment.userId;
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4 mt-6">
      <h3 className="text-xl font-bold text-slate-100 mb-4">Comments</h3>

      {user ? (
        <form onSubmit={handleAddComment} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-slate-200 mb-2"
            rows={3}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Post Comment
          </button>
        </form>
      ) : (
        <p className="text-slate-400 mb-4">Sign in to leave a comment</p>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="p-3 bg-slate-700 rounded">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="font-medium text-slate-100">{comment.userName}</span>
                <span className="text-sm text-slate-400 ml-2">
                  {new Date(comment.timestamp).toLocaleDateString()}
                </span>
              </div>
              {canDeleteComment(comment) && (
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              )}
            </div>
            <p className="text-slate-200">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}