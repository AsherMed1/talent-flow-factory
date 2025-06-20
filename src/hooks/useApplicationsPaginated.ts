
import { useMemo } from 'react';
import { useApplications } from './useApplications';
import { usePagination } from './usePagination';

interface UseApplicationsPaginatedProps {
  itemsPerPage?: number;
  searchTerm?: string;
  statusFilter?: string;
}

export const useApplicationsPaginated = ({ 
  itemsPerPage = 20,
  searchTerm = '',
  statusFilter = 'all'
}: UseApplicationsPaginatedProps = {}) => {
  const { data: allApplications, isLoading, error } = useApplications();

  const filteredApplications = useMemo(() => {
    if (!allApplications) return [];
    
    return allApplications.filter(app => {
      const matchesSearch = !searchTerm || 
        app.candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [allApplications, searchTerm, statusFilter]);

  const pagination = usePagination({
    totalItems: filteredApplications.length,
    itemsPerPage,
  });

  const paginatedApplications = useMemo(() => {
    return filteredApplications.slice(pagination.startIndex, pagination.endIndex);
  }, [filteredApplications, pagination.startIndex, pagination.endIndex]);

  return {
    applications: paginatedApplications,
    allApplications: filteredApplications,
    pagination,
    isLoading,
    error,
    totalCount: filteredApplications.length,
  };
};
