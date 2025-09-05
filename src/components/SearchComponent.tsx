import React, { useState, useEffect, useRef } from 'react';
import { 
  debounce
} from '../utils/simplifiedSearchUtils';
import { ICONS, getIconClass } from '../utils/iconConfig';

interface SearchComponentProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  isLoading?: boolean;
  hasSearched?: boolean;
  resultsCount?: number;
  searchTerm?: string;
  placeholder?: string;
  className?: string;
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  onSearch,
  onClear,
  isLoading = false,
  hasSearched = false,
  resultsCount = 0,
  searchTerm = '',
  placeholder = 'Поиск новостных статей...',
  className = ''
}) => {
  const [inputValue, setInputValue] = useState('');
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync input with searchTerm only when search is cleared externally
  useEffect(() => {
    if (!searchTerm && inputValue) {
      setInputValue('');
    }
  }, [searchTerm]);

  // Simple debounced search function (no validation interference)
  const debouncedSearch = debounce((query: string) => {
    if (query.trim()) {
      onSearch(query);
    }
  }, 300);

  // Handle input change (simple search)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Update the input value immediately
    setInputValue(value);

    // Trigger search if there's content
    if (value.trim()) {
      debouncedSearch(value);
    }
  };

  // Handle form submission (simple search)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue);
    }
  };

  // Handle input focus (simplified - no history display)
  const handleInputFocus = () => {
    // No action needed - no history or suggestions to show
  };

  // Handle input blur (simplified)
  const handleInputBlur = (e: React.FocusEvent) => {
    // No action needed - no dropdowns to manage
  };

  // Handle clear search (simplified)
  const handleClear = () => {
    setInputValue('');
    onClear();
    // Don't focus automatically to avoid conflicts
  };

  // Handle keyboard navigation (simplified)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      inputRef.current?.blur();
    }
  };

  return (
    <div className={`search-component position-relative ${className}`}>
      <form onSubmit={handleSubmit} className="position-relative">
        <div className="input-group shadow rounded-pill overflow-hidden">
          <span className="input-group-text bg-white border-0">
            <i className={getIconClass(isLoading ? 'SEARCH_LOADING' : 'SEARCH')}></i>
          </span>
          <input
            ref={inputRef}
            type="text"
            className="form-control border-0"
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            style={{background: 'transparent'}}
            autoComplete="off"
            spellCheck="false"
            autoCorrect="off"
            autoCapitalize="off"
          />
          <button
            type="submit"
            className="btn btn-primary border-0 px-4"
            disabled={isLoading || !inputValue.trim()}
            style={{
              background: 'linear-gradient(45deg, #007bff, #0056b3)',
              border: 'none',
              borderRadius: '0 50px 50px 0'
            }}
          >
            {isLoading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            ) : (
              <i className={getIconClass('SEARCH', 'SM') + ' me-2'}></i>
            )}
            {isLoading ? 'Поиск...' : 'Найти'}
          </button>
        </div>

        {/* No validation errors - simple search */}

        {/* Search Results Info */}
        {hasSearched && (
          <div className="d-flex justify-content-between align-items-center mt-3 px-3">
            <div className="text-muted">
              <i className={getIconClass('SEARCH', 'SM') + ' me-2'}></i>
              Найдено результатов: <strong>{resultsCount}</strong>
              {inputValue && (
                <span className="ms-2">
                  по запросу: <strong>"{inputValue}"</strong>
                </span>
              )}
            </div>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={handleClear}
              title="Очистить поиск"
            >
              <i className={getIconClass('CLEAR', 'SM') + ' me-1'}></i>
              Очистить
            </button>
          </div>
        )}
      </form>

      {/* No suggestions or history dropdowns - clean search experience */}
    </div>
  );
};

export default SearchComponent;
