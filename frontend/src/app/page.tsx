"use client"
//import { DataTable } from "@/components/ui/data-table"
import AFDataTable from '../components/AFDataTable';

// Sample data to demonstrate the table functionality
const sampleAFs: AFData[] = [
  {
    id: 1,
    numero: "AF-2025-001",
    fornecedor: "TechCorp Ltda",
    descricao: "Fornecimento de equipamentos de rede para expansão da infraestrutura",
    data_inicio: "2025-01-01",
    data_fim: "2025-12-31",
    status: true,
    valorTotal: 150000, // Value in cents for precise calculations
    quantidadeItens: 5
  },
  {
    id: 2,
    numero: "AF-2025-002", 
    fornecedor: "DataSys Solutions",
    descricao: "Serviços de conectividade e manutenção",
    data_inicio: "2025-02-15",
    data_fim: "2025-08-15",
    status: true,
    valorTotal: 89500,
    quantidadeItens: 3
  },
  {
    id: 3,
    numero: "AF-2024-045",
    fornecedor: "NetWork Brasil",
    descricao: "Infraestrutura de telecomunicações avançada",
    data_inicio: "2024-10-01",
    data_fim: "2025-03-31",
    status: false,
    valorTotal: 245000,
    quantidadeItens: 8
  },
  {
    id: 4,
    numero: "AF-2025-003",
    fornecedor: "Conecta Fibra",
    descricao: "Instalação de fibra óptica residencial",
    data_inicio: "2025-03-01",
    data_fim: "2025-09-30",
    status: true,
    valorTotal: 320000,
    quantidadeItens: 12
  },
  {
    id: 5,
    numero: "AF-2024-078",
    fornecedor: "TechCorp Ltda",
    descricao: "Upgrade de equipamentos existentes",
    data_inicio: "2024-11-15",
    data_fim: "2025-05-15",
    status: false,
    valorTotal: 178000,
    quantidadeItens: 6
  }
];

export default function Home() {
  const handleEdit = (af: AFData) => {
    router.push(`/af/${af.id}/edit`);
  };

  const handleDelete = async (af: AFData) => {
    await fetch(`/af/${af.id}`, { method: 'DELETE' });
    // Refresh data
  };

  const handleCreateItem = (af: AFData) => {
    router.push(`/af/`);
  };

  const handleShowItems = (af: AFData) => {
    router.push(`/af/${af.id}`);
  };

  return (
  <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
    <AFDataTable
      data={sampleAFs}
      onPatch={handleEdit}
      onDelete={handleDelete}
      onPost={handleCreateItem}
      onGet={handleShowItems}
    />
  </div>
  );
}
