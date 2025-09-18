import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useQueryParams = (searchTerm, debouncedSearchTerm, setSearchTerm, setCurrentPage) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize search term from URL on component mount
  useEffect(() => {
    const searchParam = searchParams.get('search') || '';
    if (searchParam !== searchTerm) {
      setSearchTerm(searchParam);
    }
  }, []); // Only run on mount

  // Update URL when debounced search term changes
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);

    if (debouncedSearchTerm) {
      newParams.set('search', debouncedSearchTerm);
    } else {
      newParams.delete('search');
    }

    // Reset to page 1 when search changes
    newParams.delete('page');
    if (setCurrentPage) {
      setCurrentPage(1);
    }

    setSearchParams(newParams);
  }, [debouncedSearchTerm, setSearchParams, setCurrentPage]);

  // Function to update page in URL
  const updatePageParam = (page) => {
    const newParams = new URLSearchParams(searchParams);
    if (page > 1) {
      newParams.set('page', page.toString());
    } else {
      newParams.delete('page');
    }
    setSearchParams(newParams);
  };

  return {
    updatePageParam,
    currentSearchParam: searchParams.get('search') || '',
    currentPageParam: parseInt(searchParams.get('page')) || 1
  };
};