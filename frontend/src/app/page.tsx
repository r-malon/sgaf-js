"use client"
import { DataTable } from "@/components/data-table"
import { AFDialogForm } from "@/components/af-dialog-form"
//import AFDataTable from '../components/AFDataTable';
import { columns, AF } from "./columns"
import useSWR from 'swr'

const srv = "http://[::1]:3001"
const fetcher = (...args) => fetch(...args).then(res => res.json())

function useAF() {
  const { data, error, isLoading } = useSWR(`${srv}/af`, fetcher)
 
  return {
    af: data,
    isLoading,
    isError: error
  }
}

export default function Home() {
  const { af, isLoading, isError } = useAF()

  if (isLoading) return <h1>Loading...</h1>
  if (isError) return <Error />

  const handleEdit = (af: AFData) => {
    router.push(`${srv}/af/${af.id}/edit`);
  };

  const handleDelete = async (af: AFData) => {
    await fetch(`${srv}/af/${af.id}`, { method: 'DELETE' });
    // Refresh data
  };

  const handleCreateItem = (af: AFData) => {
    router.push(`${srv}/af/`);
  };

  const handleShowItems = (af: AFData) => {
    router.push(`${srv}/af/${af.id}`);
  };

  return (
  <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
    <AFDialogForm />
    <DataTable
      columns={columns}
      data={af}
      onPatch={handleEdit}
      onDelete={handleDelete}
      onPost={handleCreateItem}
      onGet={handleShowItems}
    />
  </div>
  );
}
