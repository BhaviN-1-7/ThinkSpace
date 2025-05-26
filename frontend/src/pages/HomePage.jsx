import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/axios';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Menu, 
  Pin, 
  Archive, 
  Tag, 
  Sparkles, 
  X,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

const HomePage = ({ onThemeChange, currentTheme }) => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showArchived, setShowArchived] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Enhanced color combinations for different themes
  const themeColors = {
    light: {
      primary: 'bg-blue-500',
      secondary: 'bg-blue-100',
      accent: 'bg-blue-200',
      text: 'text-gray-800',
      highlight: 'bg-yellow-200',
      card: 'bg-white',
      hover: 'hover:bg-blue-50'
    },
    dark: {
      primary: 'bg-blue-600',
      secondary: 'bg-blue-900',
      accent: 'bg-blue-800',
      text: 'text-gray-100',
      highlight: 'bg-yellow-800',
      card: 'bg-gray-800',
      hover: 'hover:bg-blue-900'
    },
    sunset: {
      primary: 'bg-orange-500',
      secondary: 'bg-orange-100',
      accent: 'bg-orange-200',
      text: 'text-gray-800',
      highlight: 'bg-yellow-200',
      card: 'bg-white',
      hover: 'hover:bg-orange-50'
    }
  };

  const currentColors = themeColors[currentTheme || 'light'];

  // Fetch notes from the database
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/notes');
        const fetchedNotes = response.data.map(note => ({
          ...note,
          createdAt: new Date(note.createdAt)
        }));
        setNotes(fetchedNotes);
      } catch (error) {
        console.error('Error fetching notes:', error);
        toast.error(error.response?.data?.message || 'Failed to load notes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, []);

  // Extract all unique tags
  const allTags = [...new Set(notes.flatMap(note => note.tags))];

  // Highlight matching text
  const highlightText = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <span key={i} className="bg-yellow-200 dark:bg-yellow-800">{part}</span> 
        : part
    );
  };

  // Filter notes based on search query, selected tags, and archived status
  const filteredPinnedNotes = notes.filter(note => {
    const matchesSearch = searchQuery === '' || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => note.tags.includes(tag));
    
    return note.isPinned && !note.isArchived && matchesSearch && matchesTags;
  });

  const filteredAllNotes = notes.filter(note => {
    const matchesSearch = searchQuery === '' || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => note.tags.includes(tag));
    
    return !note.isArchived && matchesSearch && matchesTags;
  });

  const filteredArchivedNotes = notes.filter(note => {
    const matchesSearch = searchQuery === '' || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => note.tags.includes(tag));
    
    return note.isArchived && matchesSearch && matchesTags;
  });

  // Toggle tag selection
  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Clear all selected tags
  const handleClearTags = () => {
    setSelectedTags([]);
  };

  // Daily motivation quotes (rotate based on day of the year)
  const dailyQuotes = [
    { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { quote: "Success is not the absence of obstacles, but the courage to push through.", author: "Unknown" },
    { quote: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
  ];

  // Calculate quote index based on the day of the year (May 25, 2025)
  const today = new Date('2025-05-25');
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  const dailyQuote = dailyQuotes[dayOfYear % dailyQuotes.length];

  const handlePinToggle = async (noteId, isPinned) => {
    try {
      const response = await api.put(`/notes/${noteId}`, { isPinned });
      setNotes(notes.map(note => 
        note._id === noteId ? { ...response.data, createdAt: new Date(response.data.createdAt) } : note
      ));
      toast.success(isPinned ? 'Note pinned!' : 'Note unpinned!');
    } catch (error) {
      console.error('Error toggling pin:', error);
      toast.error(error.response?.data?.message || 'Failed to update note');
    }
  };

  const handleArchive = async (noteId, newIsArchived) => {
    try {
      const response = await api.put(`/notes/${noteId}`, { isArchived: newIsArchived });
      setNotes(notes.map(note => 
        note._id === noteId ? { ...response.data, createdAt: new Date(response.data.createdAt) } : note
      ));
      toast.success(newIsArchived ? 'Note archived!' : 'Note unarchived!');
    } catch (error) {
      console.error('Error archiving note:', error);
      toast.error(error.response?.data?.message || 'Failed to update note');
    }
  };

  // Loading skeleton component
  const NoteSkeleton = () => (
    <div className="card shadow-md rounded-lg animate-pulse">
      <div className="card-body p-4">
        <div className="flex justify-between items-start">
          <div className="h-6 bg-base-300 rounded w-3/4"></div>
          <div className="flex space-x-2">
            <div className="h-4 bg-base-300 rounded w-16"></div>
            <div className="h-4 bg-base-300 rounded w-16"></div>
          </div>
        </div>
        <div className="space-y-2 mt-4">
          <div className="h-4 bg-base-300 rounded w-full"></div>
          <div className="h-4 bg-base-300 rounded w-5/6"></div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-2">
            <div className="h-6 bg-base-300 rounded-full w-16"></div>
            <div className="h-6 bg-base-300 rounded-full w-16"></div>
          </div>
          <div className="h-4 bg-base-300 rounded w-24"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Header with Name and Tagline */}
      <header className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-base-content">ThinkSpace</h1>
            <p className="text-sm text-base-content/70">Your digital space for thoughts and ideas</p>
          </div>
        </div>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-circle btn-ghost">
            <Plus className="w-6 h-6 text-base-content" />
          </label>
          <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52">
            <li><button onClick={() => onThemeChange('sunset')}>Sunset</button></li>
            <li><button onClick={() => onThemeChange('light')}>Light</button></li>
            <li><button onClick={() => onThemeChange('dark')}>Dark</button></li>
          </ul>
        </div>
      </header>

      {/* Horizontal Line */}
      <hr className="border-t-2 border-primary" />

      {/* Search Bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search notes, tags, or content..."
            className="input input-bordered w-full pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/50" />
        </div>
        <button className="btn btn-ghost btn-circle">
          <Menu className="w-5 h-5" />
        </button>
        <button 
          className={`btn ${showArchived ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setShowArchived(!showArchived)}
        >
          {showArchived ? 'Show Active' : 'Show Archived'}
        </button>
        <Link to="/create" className="btn btn-primary">New Note</Link>
      </div>

      {/* Main Content: Notes and Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar: Quick Tag Filtering and Daily Motivation - Now appears above on small screens */}
        <div className="lg:col-span-1 space-y-6 order-first lg:order-last">
          {/* Quick Tag Filtering Section */}
          <div className="card bg-base-100 shadow-md rounded-xl">
            <div className="card-body p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-base-content flex items-center space-x-2">
                  <Tag className="w-5 h-5" />
                  <span>Quick Tag Filtering</span>
                </h2>
                <button
                  onClick={handleClearTags}
                  className="btn btn-ghost btn-sm text-base-content/70"
                  disabled={selectedTags.length === 0}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 shadow-sm ${
                      selectedTags.includes(tag) 
                        ? `${currentColors.primary} text-white hover:opacity-90` 
                        : `${currentColors.secondary} ${currentColors.text} hover:${currentColors.accent}`
                    }`}
                  >
                    <span>#{tag}</span>
                    {selectedTags.includes(tag) && (
                      <span className="ml-1.5 text-white/80">×</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Daily Motivation Section */}
          <div className="card bg-base-100 shadow-md rounded-xl">
            <div className="card-body p-6">
              <h2 className="text-lg font-semibold text-base-content flex items-center space-x-2 mb-4">
                <Sparkles className="w-5 h-5" />
                <span>Daily Motivation</span>
              </h2>
              <div className="space-y-2">
                <p className="text-sm italic text-base-content/80">"{dailyQuote.quote}"</p>
                <p className="text-sm text-base-content/50 text-right">— {dailyQuote.author}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="lg:col-span-2">
          {!showArchived && (
            <>
              {/* Pinned Notes Section */}
              <div>
                <h2 className="text-lg font-semibold text-base-content flex items-center space-x-2">
                  <Pin className="w-5 h-5" />
                  <span>Pinned Notes</span>
                </h2>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                  {isLoading ? (
                    <>
                      <NoteSkeleton />
                      <NoteSkeleton />
                    </>
                  ) : filteredPinnedNotes.length > 0 ? (
                    filteredPinnedNotes.map(note => (
                      <Link to={`/note/${note._id}`} key={note._id}>
                        <div
                          className={`relative group card shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] rounded-lg ${currentColors.hover}`}
                          style={{ backgroundColor: note.color }}
                        >
                          <div className="card-body p-4">
                            <div className="flex justify-between items-start">
                              <h3 className="card-title text-lg font-bold">
                                {highlightText(note.title, searchQuery)}
                              </h3>
                              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handlePinToggle(note._id, !note.isPinned);
                                  }}
                                  className="text-sm flex items-center space-x-1"
                                >
                                  <Pin className="w-4 h-4" />
                                  <span>{note.isPinned ? 'unpin' : 'pin'}</span>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleArchive(note._id, true);
                                  }}
                                  className="text-sm flex items-center space-x-1"
                                >
                                  <Archive className="w-4 h-4" />
                                  <span>archive</span>
                                </button>
                              </div>
                            </div>
                            <div className="text-sm text-base-content/80">
                              {note.content.split('\n').map((line, index) => (
                                <p key={index}>{highlightText(line, searchQuery)}</p>
                              ))}
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <div className="space-x-1">
                                <div className="flex flex-wrap gap-1.5">
                                  {note.tags.map(tag => (
                                    <div 
                                      key={tag} 
                                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentColors.secondary} backdrop-blur-sm border border-base-300/50 hover:${currentColors.accent} transition-all duration-200 cursor-pointer group`}
                                    >
                                      <span className="text-primary/80 group-hover:text-primary">
                                        #{highlightText(tag, searchQuery)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <span className="text-xs text-base-content/50">© {note.createdAt.toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-8 text-base-content/50">
                      {searchQuery ? 'No matching pinned notes' : 'No pinned notes'}
                    </div>
                  )}
                </div>
              </div>

              {/* All Notes Section */}
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-base-content">All Notes</h2>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                  {isLoading ? (
                    <>
                      <NoteSkeleton />
                      <NoteSkeleton />
                      <NoteSkeleton />
                      <NoteSkeleton />
                    </>
                  ) : filteredAllNotes.length > 0 ? (
                    filteredAllNotes.map(note => (
                      <Link to={`/note/${note._id}`} key={note._id}>
                        <div
                          className={`relative group card shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] rounded-lg ${currentColors.hover}`}
                          style={{ backgroundColor: note.color }}
                        >
                          <div className="card-body p-4">
                            <div className="flex justify-between items-start">
                              <h3 className="card-title text-lg font-bold">
                                {highlightText(note.title, searchQuery)}
                              </h3>
                              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handlePinToggle(note._id, !note.isPinned);
                                  }}
                                  className="text-sm flex items-center space-x-1"
                                >
                                  <Pin className="w-4 h-4" />
                                  <span>{note.isPinned ? 'unpin' : 'pin'}</span>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleArchive(note._id, true);
                                  }}
                                  className="text-sm flex items-center space-x-1"
                                >
                                  <Archive className="w-4 h-4" />
                                  <span>archive</span>
                                </button>
                              </div>
                            </div>
                            <div className="text-sm text-base-content/80">
                              {note.content.split('\n').map((line, index) => (
                                <p key={index}>{highlightText(line, searchQuery)}</p>
                              ))}
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <div className="space-x-1">
                                <div className="flex flex-wrap gap-1.5">
                                  {note.tags.map(tag => (
                                    <div 
                                      key={tag} 
                                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentColors.secondary} backdrop-blur-sm border border-base-300/50 hover:${currentColors.accent} transition-all duration-200 cursor-pointer group`}
                                    >
                                      <span className="text-primary/80 group-hover:text-primary">
                                        #{highlightText(tag, searchQuery)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <span className="text-xs text-base-content/50">© {note.createdAt.toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-8 text-base-content/50">
                      {searchQuery ? 'No matching notes' : 'No notes found'}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Archived Notes Section */}
          {showArchived && (
            <div>
              <h2 className="text-lg font-semibold text-base-content flex items-center space-x-2">
                <Archive className="w-5 h-5" />
                <span>Archived Notes</span>
              </h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                {isLoading ? (
                  <>
                    <NoteSkeleton />
                    <NoteSkeleton />
                  </>
                ) : filteredArchivedNotes.length > 0 ? (
                  filteredArchivedNotes.map(note => (
                    <Link to={`/note/${note._id}`} key={note._id}>
                      <div
                        className={`relative group card shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] rounded-lg ${currentColors.hover}`}
                        style={{ backgroundColor: note.color }}
                      >
                        <div className="card-body p-4">
                          <div className="flex justify-between items-start">
                            <h3 className="card-title text-lg font-bold">
                              {highlightText(note.title, searchQuery)}
                            </h3>
                            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleArchive(note._id, false);
                                }}
                                className="text-sm flex items-center space-x-1"
                              >
                                <Archive className="w-4 h-4" />
                                <span>unarchive</span>
                              </button>
                            </div>
                          </div>
                          <div className="text-sm text-base-content/80">
                            {note.content.split('\n').map((line, index) => (
                              <p key={index}>{highlightText(line, searchQuery)}</p>
                            ))}
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <div className="space-x-1">
                              <div className="flex flex-wrap gap-1.5">
                                {note.tags.map(tag => (
                                  <div 
                                    key={tag} 
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentColors.secondary} backdrop-blur-sm border border-base-300/50 hover:${currentColors.accent} transition-all duration-200 cursor-pointer group`}
                                  >
                                    <span className="text-primary/80 group-hover:text-primary">
                                      #{highlightText(tag, searchQuery)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <span className="text-xs text-base-content/50">© {note.createdAt.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-8 text-base-content/50">
                    {searchQuery ? 'No matching archived notes' : 'No archived notes'}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;