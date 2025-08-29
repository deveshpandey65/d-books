'use client';
import React, { useState, useEffect } from 'react';

const App = () => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('q');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [placeholder, setPlaceholder] = useState('Search for books...');


  useEffect(() => {
    const placeholders = {
      q: 'Search for books by title, author, or keyword...',
      title: 'Search by book title...',
      author: 'Search by author name...',
      subject: 'Search by subject (e.g., "science fiction" or "history")...',
      publisher: 'Search by publisher...',
      isbn: 'Search by ISBN (e.g., 9780321765723)...',
    };
    setPlaceholder(placeholders[searchType] || placeholders.q);
  }, [searchType]);

  const handleSearch = async () => {
    setBooks([]);
    setMessage('');

    if (!query.trim()) {
      setMessage('Please enter a search query.');
      return;
    }

    setLoading(true);

    try {
      const encodedQuery = encodeURIComponent(query);
      const apiUrl = `https://openlibrary.org/search.json?${searchType}=${encodedQuery}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.docs && data.docs.length > 0) {
        setBooks(data.docs);
      } else {
        setMessage('No books found. Try a different search term.');
      }

    } catch (error) {
      console.error('Fetch error:', error);
      setMessage('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };


  const BookCard = ({ book }) => {
    const coverId = book.cover_i;
    const coverUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : `https://placehold.co/180x250/cbd5e1/475569?text=No+Cover`;

    const handleImageError = (e) => {
      e.target.src = `https://placehold.co/180x250/cbd5e1/475569?text=No+Cover`;
    };

    const authorText = book.author_name ? (Array.isArray(book.author_name) ? book.author_name.join(', ') : book.author_name) : 'Unknown Author';

    return (
      <div className="book-card bg-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col">
        <img
          src={coverUrl}
          alt={`Cover of ${book.title}`}
          className="book-cover object-cover w-full h-48 md:h-64 rounded-t-2xl"
          onError={handleImageError}
        />
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight truncate">
            {book.title}
          </h3>
          <p className="text-sm text-gray-600 mb-1 leading-snug">
            <span className="font-semibold">By:</span> {authorText}
          </p>
          <p className="text-xs text-gray-500 mt-auto leading-snug">
            <span className="font-semibold">First Published:</span> {book.first_publish_year || 'N/A'}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <header className="bg-white shadow-md py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4 sm:mb-0">Alex's Book Hub</h1>
          <p className="text-gray-600 text-xl text-center">Your modern source for book discovery.</p>
        </div>
      </header>

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-2xl">
            {/* Search controls */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-10">
              <input
                type="text"
                className="flex-grow p-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <select
                className="p-4 border-2 border-gray-300 rounded-2xl bg-white focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer text-lg"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value="q">General</option>
                <option value="title">Title</option>
                <option value="author">Author</option>
                <option value="subject">Subject</option>
                <option value="publisher">Publisher</option>
                <option value="isbn">ISBN</option>
              </select>
              <button
                className="bg-blue-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 transform active:scale-95"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>

            {/* Status message display */}
            {message && (
              <div className="text-center text-gray-600 text-xl font-medium my-8 transition-opacity duration-500 opacity-100">
                {message}
              </div>
            )}

            {/* Loading spinner */}
            {loading && (
              <div className="flex justify-center items-center my-8">
                <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}

            {/* Book results grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {books.map(book => (
                <BookCard key={book.key} book={book} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-gray-300 py-8 mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">&copy; Devesh  Pandey</p>
        </div>
      </footer>
    </div>
  );
};

// This is a requirement for single-file React apps
export default App;
