import React, { useState } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${apiUrl}/api/search`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setResults(data.results);
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Jewelry Visual Search</h1>
      </header>
      <main>
        <form onSubmit={handleSubmit}>
          <div className="upload-area">
            <input 
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {preview && (
              <div className="preview">
                <img src={preview} alt="Preview" />
              </div>
            )}
            <button type="submit" disabled={!file || loading}>
              {loading ? 'Searching...' : 'Search Similar Jewelry'}
            </button>
          </div>
        </form>

        {error && <div className="error">{error}</div>}

        {results.length > 0 && (
          <div className="results">
            <h2>Similar Items</h2>
            <div className="results-grid">
              {results.map((item) => (
                <div key={item._id} className="result-item">
                  <img src={item.imageUrl} alt="Similar jewelry" />
                  <div className="similarity">
                    Similarity: {Math.round(item.similarity * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;