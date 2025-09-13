import React, { useState, useEffect } from 'react';

interface SearchComponentProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  isLoading: boolean;
  hasSearched: boolean;
  resultsCount: number;
  searchTerm: string;
  placeholder?: string;
  className?: string;
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  onSearch,
  onClear,
  isLoading,
  hasSearched,
  resultsCount,
  searchTerm,
  placeholder = "Поиск...",
  className = ""
}) => {
  const [inputValue, setInputValue] = useState(searchTerm);

  // Update input value when searchTerm changes
  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(inputValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Clear search if input is empty
    if (!value.trim()) {
      onClear();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch(inputValue);
    }
  };

  const handleClear = () => {
    setInputValue('');
    onClear();
  };

  return (
    <div className={`search-component ${className}`}>
      <form onSubmit={handleSubmit} className="position-relative">
        <div className="input-group">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading || !inputValue.trim()}
          >
            {isLoading ? (
              <span className="loading-spinner me-2"></span>
            ) : (
              <i className="bi bi-search me-2"></i>
            )}
            {isLoading ? 'Поиск...' : 'Найти'}
          </button>
        </div>
      </form>
      
      {hasSearched && (
        <div className="mt-3 text-center">
          <div className="d-flex align-items-center justify-content-center gap-3">
            <span className="text-muted">
              {isLoading ? 'Поиск...' : `Найдено результатов: ${resultsCount}`}
            </span>
            {!isLoading && (
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={handleClear}
              >
                <i className="bi bi-x-circle me-1"></i>
                Очистить
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
