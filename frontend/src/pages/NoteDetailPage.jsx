import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, 
  Pin, 
  Archive, 
  X, 
  Save, 
  Edit, 
  Trash2, 
  Tag, 
  Circle, 
  Calendar,
  Loader2
} from 'lucide-react';

const NoteDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [tagInput, setTagInput] = useState('');

  // Fetch note from the database
  useEffect(() => {
    const fetchNote = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/notes/${id}`);
        setNote({
          ...response.data,
          createdAt: new Date(response.data.createdAt)
        });
      } catch (error) {
        console.error('Error fetching note:', error);
        toast.error(error.response?.data?.message || 'Failed to load note');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNote();
  }, [id, navigate]);

  const handlePinToggle = async () => {
    try {
      const response = await api.put(`/notes/${id}`, {
        isPinned: !note.isPinned
      });
      setNote({ ...response.data, createdAt: new Date(response.data.createdAt) });
      toast.success(note.isPinned ? 'Note unpinned!' : 'Note pinned!');
    } catch (error) {
      console.error('Error toggling pin:', error);
      toast.error(error.response?.data?.message || 'Failed to update note');
    }
  };

  const handleArchive = async () => {
    try {
      const response = await api.put(`/notes/${id}`, { 
        isArchived: !note.isArchived 
      });
      setNote({ ...response.data, createdAt: new Date(response.data.createdAt) });
      toast.success(note.isArchived ? 'Note unarchived!' : 'Note archived!');
      if (!note.isArchived) {
        navigate('/');
      }
    } catch (error) {
      console.error('Error archiving note:', error);
      toast.error(error.response?.data?.message || 'Failed to update note');
    }
  };

  const handleUpdate = async () => {
    if (!note.title || !note.content) {
      toast.error('Title and content are required!');
      return;
    }

    try {
      const response = await api.put(`/notes/${id}`, note);
      setNote({ ...response.data, createdAt: new Date(response.data.createdAt) });
      toast.success('Note updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error(error.response?.data?.message || 'Failed to update note');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/notes/${id}`);
      toast.success('Note deleted successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error(error.response?.data?.message || 'Failed to delete note');
    }
  };

  const handleTagInput = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      setNote({ ...note, tags: [...note.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!note) return null;

  const formatDate = (date) => {
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).toUpperCase();
  };

  const colors = [
    '#ffffff', // White
    '#fefcbf', // Light Yellow
    '#bfdbfe', // Light Blue
    '#d1fae5', // Light Green
    '#fce7f3', // Light Pink
    '#f5f5f5', // Light Gray
    '#ffcccb', // Light Red
    '#fffacd', // Light Yellow (alternative)
    '#add8e6', // Light Blue (alternative)
    '#98fb98', // Light Green (alternative)
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header with Back Button, Title, and Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="btn btn-ghost btn-sm flex items-center space-x-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold text-base-content">{isEditing ? 'Edit Note' : 'View Note'}</h1>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handlePinToggle}
            className="btn btn-ghost btn-sm flex items-center space-x-1"
          >
            <Pin className="w-4 h-4" />
            <span>{note.isPinned ? 'Unpin' : 'Pin'}</span>
          </button>
          <button
            onClick={handleArchive}
            className="btn btn-ghost btn-sm flex items-center space-x-1"
          >
            <Archive className="w-4 h-4" />
            <span>{note.isArchived ? 'Unarchive' : 'Archive'}</span>
          </button>
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="btn btn-ghost btn-sm flex items-center space-x-1"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleUpdate}
                className="btn btn-primary btn-sm flex items-center space-x-1"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-ghost btn-sm flex items-center space-x-1"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={handleDelete}
                className="btn btn-ghost btn-sm flex items-center space-x-1"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        // Editing UI matching CreatePage.jsx
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Note Content Section */}
          <div className="md:col-span-2">
            <div className="card bg-base-100 shadow-md rounded-xl">
              <div className="card-body p-6">
                <h2 className="text-lg font-semibold text-base-content mb-4">Note Content</h2>
                <input
                  type="text"
                  placeholder="Enter note title..."
                  className="input input-bordered w-full mb-4"
                  value={note.title}
                  onChange={(e) => setNote({ ...note, title: e.target.value })}
                />
                <textarea
                  placeholder="Start writing your note..."
                  className="textarea textarea-bordered w-full h-64"
                  value={note.content}
                  onChange={(e) => setNote({ ...note, content: e.target.value })}
                />
              </div>
            </div>

            {/* Tags Section */}
            <div className="card bg-base-100 shadow-md rounded-xl mt-6">
              <div className="card-body p-6">
                <h2 className="text-lg font-semibold text-base-content flex items-center space-x-2 mb-4">
                  <Tag className="w-5 h-5" />
                  <span>Tags</span>
                </h2>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Add a tag..."
                    className="input input-bordered w-full"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInput}
                  />
                  <button
                    onClick={() => {
                      if (tagInput.trim()) {
                        setNote({ ...note, tags: [...note.tags, tagInput.trim()] });
                        setTagInput('');
                      }
                    }}
                    className="btn btn-outline btn-sm"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {note.tags.map((tag, index) => (
                    <div 
                      key={index} 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-base-200/50 backdrop-blur-sm border border-base-300/50 hover:bg-base-300/50 transition-all duration-200 cursor-pointer group"
                    >
                      <span className="text-primary/80 group-hover:text-primary">#{tag}</span>
                      <button
                        className="ml-1.5 text-base-content/50 hover:text-base-content transition-colors"
                        onClick={() => setNote({ ...note, tags: note.tags.filter(t => t !== tag) })}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Preview, Note Color, Options */}
          <div className="space-y-6">
            {/* Preview Section */}
            <div className="card bg-base-100 shadow-md rounded-xl">
              <div className="card-body p-6">
                <h2 className="text-lg font-semibold text-base-content mb-4">Preview</h2>
                <div
                  className="card rounded-xl shadow-sm p-4"
                  style={{ backgroundColor: note.color === '#ffffff' ? '#bfdbfe' : note.color }}
                >
                  <h3 className="text-base font-semibold">
                    {note.title || 'Note Title'}
                  </h3>
                  <div className="text-sm text-base-content/80 mt-2">
                    {note.content.split('\n').map((line, index) => (
                      <p key={index}>{line || 'Your note content will appear here...'}</p>
                    ))}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {note.tags.map((tag, index) => (
                      <div 
                        key={index} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-base-200/50 backdrop-blur-sm border border-base-300/50 hover:bg-base-300/50 transition-all duration-200 cursor-pointer group"
                      >
                        <span className="text-primary/80 group-hover:text-primary">#{tag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Note Color Section */}
            <div className="card bg-base-100 shadow-md rounded-xl">
              <div className="card-body p-6">
                <h2 className="text-lg font-semibold text-base-content flex items-center space-x-2 mb-4">
                  <Circle className="w-5 h-5" />
                  <span>Note Color</span>
                </h2>
                <div className="grid grid-cols-5 gap-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full border-2 ${note.color === color ? 'border-primary' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNote({ ...note, color })}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Options Section */}
            <div className="card bg-base-100 shadow-md rounded-xl">
              <div className="card-body p-6">
                <h2 className="text-lg font-semibold text-base-content mb-4">Options</h2>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={note.isPinned}
                    onChange={(e) => setNote({ ...note, isPinned: e.target.checked })}
                  />
                  <span>Pin this note</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // View Mode: Centered Note Card
        <div className="flex justify-center">
          <div className="card shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] rounded-xl max-w-4xl w-full">
            <div className="card-body p-6" style={{ backgroundColor: note.color }}>
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-base-content">{note.title}</h2>
              </div>
              {note.isPinned && (
                <div className="badge badge-outline badge-sm mt-2">Pinned</div>
              )}
              <div className="text-sm text-base-content/70 mt-2 flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Created: {formatDate(note.createdAt)}</span>
              </div>
              <div className="space-y-4 mt-4">
                <div className="text-base-content/80">
                  {note.content.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {note.tags.map((tag, index) => (
                    <div 
                      key={index} 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-base-200/50 backdrop-blur-sm border border-base-300/50 hover:bg-base-300/50 transition-all duration-200 cursor-pointer group"
                    >
                      <span className="text-primary/80 group-hover:text-primary">#{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteDetailPage;