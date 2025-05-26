import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, 
  Tag, 
  Circle, 
  Save,
  Loader2
} from 'lucide-react';

const CreatePage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [note, setNote] = useState({
    title: '',
    content: '',
    tags: [],
    color: '#ffffff'
  });
  const [tagInput, setTagInput] = useState('');

  const colors = [
    '#bfdbfe', // Pastel Blue
    '#c8f5d9', // Pastel Green
    '#fce7f3', // Pastel Pink
    '#fef9c3', // Pastel Yellow
    '#e9d5ff', // Pastel Lavender
    '#ffedd5', // Pastel Peach
    'orange', // Pastel Mint
    '#ffcccb', // Pastel Coral
    '#bae6fd', // Pastel Sky
    '#e5e7eb', // Soft Gray
  ];

  const handleTagInput = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      setNote({ ...note, tags: [...note.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!note.title || !note.content) {
      toast.error('Title and content are required!');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await api.post('/notes', {
        title: note.title,
        content: note.content,
        tags: note.tags,
        color: note.color
      });

      if (response.data) {
        toast.success('Note created successfully!');
        navigate('/');
      }
    } catch (error) {
      console.error('Error creating note:', error);
      toast.error(error.response?.data?.message || 'Failed to create note');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans px-4 md:px-8 py-6 bg-base-200/30 min-h-screen">
      {/* Header with Back Button and Title */}
      <div className="flex items-center bg-base-100 p-4 rounded-2xl shadow-sm">
        <button
          onClick={() => navigate('/')}
          className="btn btn-ghost btn-sm flex items-center space-x-1 hover:bg-base-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <h1 className="text-2xl font-bold text-base-content ml-4">Create New Note</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Note Content Section */}
        <div className="md:col-span-2 space-y-4">
          <div className="card bg-base-100 shadow-md rounded-2xl border border-base-300">
            <div className="card-body p-5">
              <h2 className="text-lg font-semibold text-base-content mb-3">Note Content</h2>
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
          <div className="card bg-base-100 shadow-md rounded-2xl border border-base-300">
            <div className="card-body p-5">
              <h2 className="text-lg font-semibold text-base-content flex items-center space-x-2 mb-3">
                <Tag className="w-5 h-5" />
                <span>Tags</span>
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
          <div className="card bg-base-100 shadow-md rounded-2xl border border-base-300">
            <div className="card-body p-5">
              <h2 className="text-lg font-semibold text-base-content mb-3">Preview</h2>
              <div
                className="card rounded-2xl shadow-sm p-4 transition-all duration-200 hover:shadow-md"
                style={{ backgroundColor: note.color === '#ffffff' ? '#bfdbfe' : note.color }}
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
          <div className="card bg-base-100 shadow-md rounded-2xl border border-base-300">
            <div className="card-body p-5">
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

          {/* Save Note Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn btn-primary w-full rounded-2xl flex items-center justify-center space-x-2 hover:bg-primary/90 transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Note</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;