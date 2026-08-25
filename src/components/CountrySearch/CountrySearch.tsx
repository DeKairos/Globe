import { useState, useRef, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { allCountries } from '@store/countries';
import type { CountryCode } from '@app-types/country';

export interface CountrySearchProps {
  label: 'From' | 'To';
  value: CountryCode;
  onChange: (code: CountryCode) => void;
  onFavorite: (code: CountryCode) => void;
  isFavorite: boolean;
  disabled?: boolean;
}

export function CountrySearch({
  label,
  value,
  onChange,
  onFavorite,
  isFavorite,
  disabled,
}: CountrySearchProps) {
  const countries = useStore(allCountries);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredCountries = countries
    .filter((c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        listRef.current &&
        !listRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && filteredCountries.length > 0) {
      setHighlightedIndex(0);
    } else {
      setHighlightedIndex(-1);
    }
  }, [isOpen, filteredCountries, searchTerm]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredCountries.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredCountries[highlightedIndex]) {
          selectCountry(filteredCountries[highlightedIndex].code as CountryCode);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
      case 'Tab':
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        break;
    }
  };

  const selectCountry = (code: CountryCode) => {
    onChange(code);
    setSearchTerm('');
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onFavorite(value);
  };

  const currentCountry = countries.find((c) => c.code === value);

  return (
    <div className="relative" role="combobox" aria-label={`Select ${label} country`} aria-expanded={isOpen}>
      <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
        {label} Country
      </label>

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          className="input-search pr-16"
          placeholder="Search country..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-autocomplete="list"
          aria-controls="country-list"
          aria-activedescendant={
            highlightedIndex >= 0 ? `country-option-${highlightedIndex}` : undefined
          }
        />

        <button
          type="button"
          className={`btn-icon absolute right-2 top-1/2 -translate-y-1/2 ${
            isFavorite ? 'bg-yellow-500/20 border-yellow-500/50' : ''
          }`}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? `Remove ${label} from favorites` : `Add ${label} to favorites`}
          aria-pressed={isFavorite}
          disabled={disabled}
        >
          {isFavorite ? '⭐' : '☆'}
        </button>
      </div>

      {isOpen && searchTerm && (
        <div
          ref={listRef}
          id="country-list"
          role="listbox"
          className="absolute z-50 w-full mt-2 glass-card max-h-96 overflow-y-auto"
        >
          {filteredCountries.length === 0 ? (
            <div className="p-4 text-center text-[var(--text-secondary)]">
              No countries found
            </div>
          ) : (
            filteredCountries.map((country, index) => (
              <button
                key={country.code}
                id={`country-option-${index}`}
                role="option"
                aria-selected={index === highlightedIndex}
                className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                  index === highlightedIndex ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
                onClick={() => selectCountry(country.code as CountryCode)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <span className="text-2xl">{country.flag}</span>
                <span className="flex-1 font-medium">{country.name}</span>
                <span className="text-xs text-[var(--text-secondary)] uppercase">{country.code}</span>
              </button>
            ))
          )}
        </div>
      )}

      {!searchTerm && currentCountry && (
        <div className="mt-2 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <span className="text-xl">{currentCountry.flag}</span>
          <span className="font-medium">{currentCountry.name}</span>
          <span className="px-2 py-0.5 rounded bg-white/10 text-xs">{currentCountry.code}</span>
        </div>
      )}
    </div>
  );
}