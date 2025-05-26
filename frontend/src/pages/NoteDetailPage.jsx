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
    '#bfdbfe', // Pastel Blue
    '#c8f5d9', // Pastel Green
    '#fce7f3', // Pastel Pink
    '#fef9c3', // Pastel Yellow
    '#e9d5ff', // Pastel Lavender
    '#ffedd5', // Pastel Peach
    '#d1fae5', // Pastel Mint
    '#ffcccb', // Pastel Coral
    '#bae6fd', // Pastel Sky
    '#e5e7eb', // Soft Gray
  ];

  return (
    <div className="space-y-6 font-sans px-4 md:px-8 py-6 bg-base-200/30 min-h-screen">
      {/* Header with Back Button, Title, and Action Buttons */}
      <div className={`flex items-center justify-between bg-base-100 p-4 rounded-2xl shadow-sm border ${
        document.documentElement.getAttribute('data-theme') === 'forest' 
          ? 'border-white/20' 
          : 'border-base-300'
      }`}>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="btn btn-ghost btn-sm flex items-center space-x-1 hover:bg-base-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 block" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <h1 className="text-2xl font-bold text-base-content">{isEditing ? 'Edit Note' : 'Note Details'}</h1>
        </div>
        <div className="flex space-x-1 sm:space-x-2">
          <button
            onClick={handlePinToggle}
            className="btn btn-ghost btn-xs sm:btn-sm flex items-center space-x-1 hover:bg-base-200 transition-colors px-2 sm:px-3"
          >
            <Pin className="w-4 h-4 sm:w-5 sm:h-5 block" />
            <span className="hidden sm:inline">{note.isPinned ? 'Unpin' : 'Pin'}</span>
          </button>
          <button
            onClick={handleArchive}
            className="btn btn-ghost btn-xs sm:btn-sm flex items-center space-x-1 hover:bg-base-200 transition-colors px-2 sm:px-3"
          >
            <Archive className="w-4 h-4 sm:w-5 sm:h-5 block" />
            <span className="hidden sm:inline">{note.isArchived ? 'Unarchive' : 'Archive'}</span>
          </button>
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="btn btn-ghost btn-xs sm:btn-sm flex items-center space-x-1 hover:bg-base-200 transition-colors px-2 sm:px-3"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 block" />
                <span className="hidden sm:inline">Cancel</span>
              </button>
              <button
                onClick={handleUpdate}
                className="btn btn-primary btn-xs sm:btn-sm flex items-center space-x-1 hover:bg-primary/90 transition-colors px-2 sm:px-3"
              >
                <Save className="w-4 h-4 sm:w-5 sm:h-5 block" />
                <span className="hidden sm:inline">Save</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-ghost btn-xs sm:btn-sm flex items-center space-x-1 hover:bg-base-200 transition-colors px-2 sm:px-3"
              >
                <Edit className="w-4 h-4 sm:w-5 sm:h-5 block" />
                <span className="hidden sm:inline">Edit</span>
              </button>
              <button
                onClick={handleDelete}
                className="btn btn-ghost btn-xs sm:btn-sm flex items-center space-x-1 hover:bg-red-100 text-red-600 transition-colors px-2 sm:px-3"
              >
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 block" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        // Edit Mode: Optimized Layout
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Note Content Section */}
          <div className="md:col-span-2 space-y-4">
            <div className={`card bg-base-100 shadow-md rounded-2xl border ${
              document.documentElement.getAttribute('data-theme') === 'forest' 
                ? 'border-white/20' 
                : 'border-base-300'
            }`}>
              <div className="card-body p-4 sm:p-5">
                <h2 className="text-lg font-semibold text-base-content mb-3 flex items-center space-x-2">
                  <Edit className="w-5 h-5" />
                  <span>Edit Note Content</span>
                </h2>
                <input
                  type="text"
                  placeholder="Enter note title..."
                  className="input input-bordered w-full mb-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={note.title}
                  onChange={(e) => setNote({ ...note, title: e.target.value })}
                />
                <textarea
                  placeholder="Start writing your note..."
                  className="textarea textarea-bordered w-full h-48 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={note.content}
                  onChange={(e) => setNote({ ...note, content: e.target.value })}
                />
              </div>
            </div>

            {/* Tags Section */}
            <div className={`card bg-base-100 shadow-md rounded-2xl border ${
              document.documentElement.getAttribute('data-theme') === 'forest' 
                ? 'border-white/20' 
                : 'border-base-300'
            }`}>
              <div className="card-body p-4 sm:p-5">
                <h2 className="text-lg font-semibold text-base-content flex items-center space-x-2 mb-3">
                  <Tag className="w-5 h-5" />
                  <span>Manage Tags</span>
                </h2>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Add a tag..."
                    className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
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
                    className="btn btn-outline btn-sm hover:bg-primary hover:text-primary-content transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {note.tags.map((tag, index) => (
                    <div 
                      key={index} 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-base-200/50 border border-base-300/50 hover:bg-base-300/50 transition-all duration-200 cursor-pointer group"
                    >
                      <span className="text-base-content/80 group-hover:text-base-content">#{tag}</span>
                      <button
                        className="ml-1.5 text-base-content/50 hover:text-red-600 transition-colors"
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
          <div className="space-y-4">
            {/* Preview Section */}
            <div className={`card bg-base-100 shadow-md rounded-2xl border ${
              document.documentElement.getAttribute('data-theme') === 'forest' 
                ? 'border-white/20' 
                : 'border-base-300'
            }`}>
              <div className="card-body p-4 sm:p-5">
                <h2 className="text-lg font-semibold text-base-content mb-3">Preview</h2>
                <div
                  className="card rounded-2xl shadow-sm p-4 transition-all duration-200 hover:shadow-md"
                  style={{ backgroundColor: note.color === '#bfdbfe' ? '#bfdbfe' : note.color }}
                >
                  <h3 className="text-base font-semibold text-black">
                    {note.title || 'Note Title'}
                  </h3>
                  <div className="text-sm text-black/80 mt-2 leading-relaxed whitespace-pre-wrap">
                    {note.content || 'Your note content will appear here...'}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {note.tags.map((tag, index) => (
                      <div 
                        key={index} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-black/10 border border-black/20 hover:bg-black/20 transition-all duration-200"
                      >
                        <span className="text-black/80">#{tag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Note Color Section */}
            <div className={`card bg-base-100 shadow-md rounded-2xl border ${
              document.documentElement.getAttribute('data-theme') === 'forest' 
                ? 'border-white/20' 
                : 'border-base-300'
            }`}>
              <div className="card-body p-4 sm:p-5">
                <h2 className="text-lg font-semibold text-base-content flex items-center space-x-2 mb-3">
                  <Circle className="w-5 h-5" />
                  <span>Note Color</span>
                </h2>
                <div className="grid grid-cols-5 gap-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 ${note.color === color ? 'border-primary scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNote({ ...note, color })}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Options Section */}
            <div className={`card bg-base-100 shadow-md rounded-2xl border ${
              document.documentElement.getAttribute('data-theme') === 'forest' 
                ? 'border-white/20' 
                : 'border-base-300'
            }`}>
              <div className="card-body p-4 sm:p-5">
                <h2 className="text-lg font-semibold text-base-content mb-3">Options</h2>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={note.isPinned}
                    onChange={(e) => setNote({ ...note, isPinned: e.target.checked })}
                  />
                  <span className="text-base-content">Pin this note</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // View Mode: Enhanced Layout with Sidebar
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Note Card */}
          <div className="lg:col-span-3">
            <div className={`card shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01] rounded-2xl max-w-3xl w-full mx-auto border ${
              document.documentElement.getAttribute('data-theme') === 'forest' 
                ? 'border-white/20' 
                : 'border-base-300'
            }`}>
              <div className="card-body p-4 sm:p-6" style={{ backgroundColor: note.color }}>
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold text-black">{note.title}</h2>
                  {note.isPinned && (
                    <div className="badge badge-outline badge-sm text-black">Pinned</div>
                  )}
                </div>
                <div className="text-sm text-black/70 mt-2 flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Created: {formatDate(note.createdAt)}</span>
                </div>
                <div className="space-y-2 mt-4">
                  <div className="text-black/80 leading-relaxed whitespace-pre-wrap">
                    {note.content}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {note.tags.map((tag, index) => (
                      <div 
                        key={index} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-black/10 border border-black/20 hover:bg-black/20 transition-all duration-200"
                      >
                        <span className="text-black/80">#{tag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Metadata Sidebar */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className={`card bg-base-100 shadow-md rounded-2xl border ${
              document.documentElement.getAttribute('data-theme') === 'forest' 
                ? 'border-white/20' 
                : 'border-base-300'
            }`}>
              <div className="card-body p-4 sm:p-5">
                <h3 className="text-lg font-semibold text-base-content mb-3">Note Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Circle className="w-4 h-4" />
                    <span><strong>Color:</strong></span>
                    <div className="w-5 h-5 rounded-full" style={{ backgroundColor: note.color }} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4" />
                    <span><strong>Tags:</strong> {note.tags.length || 'None'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Pin className="w-4 h-4" />
                    <span><strong>Status:</strong> {note.isPinned ? 'Pinned' : 'Not Pinned'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Archive className="w-4 h-4" />
                    <span><strong>Archived:</strong> {note.isArchived ? 'Yes' : 'No'}</span>
                  </div>
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