import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Search,
  Edit,
  Trash2,
  Eye,
  Package,
  Filter
} from 'lucide-react';

// Type definitions for our AF data structure
interface AFData {
  id: number;
  numero: string;
  fornecedor: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  status: boolean;
  valorTotal: number;
  quantidadeItens: number;
}

type SortField = keyof AFData;
type SortDirection = 'asc' | 'desc';
type StatusFilter = 'all' | 'active' | 'inactive';

interface AFDataTableProps {
  data?: AFData[];
  onPatch?: (af: AFData) => void;
  onDelete?: (af: AFData) => void;
  onPost?: (af: AFData) => void;
  onGet?: (af: AFData) => void;
}

export default function AFDataTable({
  data = sampleAFs,
  onPatch = (af) => console.log('Edit AF:', af.numero),
  onDelete = (af) => console.log('Delete AF:', af.numero),
  onPost = (af) => console.log('Create Item for AF:', af.numero),
  onGet = (af) => console.log('Show Items for AF:', af.numero)
}: AFDataTableProps) {
  // State management for table functionality
  const [sortField, setSortField] = useState<SortField>('numero');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  // Currency formatter for Brazilian Real
  const formatCurrency = (valueInCents: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valueInCents / 100);
  };

  // Date formatter for Brazilian format
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Format period display (start - end dates)
  const formatPeriod = (startDate: string, endDate: string): string => {
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  // Sorting handler with toggle behavior
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Render sort indicator for column headers
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <div className="ml-1 h-4 w-4" />; // Invisible spacer for alignment
    }
    return sortDirection === 'asc' ? 
      <ChevronUp className="ml-1 h-4 w-4 text-blue-600" /> : 
      <ChevronDown className="ml-1 h-4 w-4 text-blue-600" />;
  };

  // Comprehensive data filtering and sorting logic
  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(af => {
      // Text search across multiple fields
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        af.numero.toLowerCase().includes(searchLower) ||
        af.fornecedor.toLowerCase().includes(searchLower) ||
        af.descricao.toLowerCase().includes(searchLower);

      // Status filter logic
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'active' && af.status) ||
        (statusFilter === 'inactive' && !af.status);

      return matchesSearch && matchesStatus;
    });

    // Apply sorting with proper type handling
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle different data types appropriately
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;

      return sortDirection === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [data, searchTerm, statusFilter, sortField, sortDirection]);

  // Action handlers that could integrate with your routing system
  const handleRowAction = (action: string, af: AFData) => {
    setActiveDropdown(null); // Close dropdown after action
    
    switch (action) {
      case 'edit':
        onPatch(af);
        break;
      case 'delete':
        if (window.confirm(`Tem certeza que deseja excluir a AF ${af.numero}?`)) {
          onDelete(af);
        }
        break;
      case 'create-item':
        onPost(af);
        break;
      case 'show-items':
        onGet(af);
        break;
    }
  };

  // Close dropdowns when clicking outside
  const handleClickOutside = (e: React.MouseEvent) => {
    if (!(e.target as Element).closest('.dropdown-menu')) {
      setActiveDropdown(null);
    }
  };

  return (
    <div className="space-y-4" onClick={handleClickOutside}>
      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {/* Search input with icon */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar AF, fornecedor ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-72 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>
          
          {/* Status filter dropdown */}
          <div className="relative">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            >
              <option value="all">Todas</option>
              <option value="active">Ativas</option>
              <option value="inactive">Inativas</option>
            </select>
            <Filter className="absolute right-2 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Results counter */}
        <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
          {filteredAndSortedData.length} de {data.length} AFs
        </div>
      </div>

      {/* Main data table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {/* Sortable column headers */}
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('numero')}
                >
                  <div className="flex items-center select-none">
                    Número
                    {getSortIcon('numero')}
                  </div>
                </th>
                
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('fornecedor')}
                >
                  <div className="flex items-center select-none">
                    Fornecedor
                    {getSortIcon('fornecedor')}
                  </div>
                </th>
                
                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('data_inicio')}
                >
                  <div className="flex items-center select-none">
                    Período
                    {getSortIcon('data_inicio')}
                  </div>
                </th>
                
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                
                <th 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('valorTotal')}
                >
                  <div className="flex items-center justify-end select-none">
                    Valor Total
                    {getSortIcon('valorTotal')}
                  </div>
                </th>
                
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Itens
                </th>
                
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <Search className="h-12 w-12 text-gray-300 mb-4" />
                      <p className="text-lg font-medium text-gray-900 mb-1">Nenhuma AF encontrada</p>
                      <p className="text-sm text-gray-500">Tente ajustar os filtros ou termo de busca</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAndSortedData.map((af) => (
                  <tr key={af.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{af.numero}</div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{af.fornecedor}</div>
                    </td>
                    
                    <td className="hidden md:table-cell px-6 py-4">
                      <div 
                        className="text-sm text-gray-900 max-w-xs truncate" 
                        title={af.descricao}
                      >
                        {af.descricao}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPeriod(af.data_inicio, af.data_fim)}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        af.status 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {af.status ? "Ativa" : "Inativa"}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(af.valorTotal)}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleRowAction('show-items', af)}
                        className="inline-flex items-center justify-center w-8 h-8 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                        title={`${af.quantidadeItens} itens`}
                      >
                        {af.quantidadeItens}
                      </button>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {/* Action menu dropdown */}
                      <div className="relative dropdown-menu">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdown(activeDropdown === af.id ? null : af.id);
                          }}
                          className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                        
                        {activeDropdown === af.id && (
                          <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                            <div className="py-1">
                              <button
                                onClick={() => handleRowAction('show-items', af)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Visualizar Itens
                              </button>
                              
                              <button
                                onClick={() => handleRowAction('edit', af)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Editar AF
                              </button>
                              
                              {af.status && (
                                <button
                                  onClick={() => handleRowAction('create-item', af)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                  <Package className="mr-2 h-4 w-4" />
                                  Criar Item
                                </button>
                              )}
                              
                              <button
                                onClick={() => handleRowAction('delete', af)}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir AF
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table footer with summary information */}
      {filteredAndSortedData.length > 0 && (
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm text-gray-600">
            <div className="font-medium">
              Valor total exibido: 
              <span className="text-gray-900 ml-1">
                {formatCurrency(
                  filteredAndSortedData.reduce((sum, af) => sum + af.valorTotal, 0)
                )}
              </span>
            </div>
            <div className="flex gap-4">
              <span>
                <span className="font-medium text-green-600">
                  {filteredAndSortedData.filter(af => af.status).length}
                </span> 
                {' '}AFs ativas
              </span>
              <span>
                <span className="font-medium text-gray-600">
                  {filteredAndSortedData.filter(af => !af.status).length}
                </span>
                {' '}AFs inativas
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
