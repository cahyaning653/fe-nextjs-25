"use client";
import React, { useEffect } from "react";
import Button from "@/components/ui/Button";
import Layout from "@/components/ui/Layout";
import { service, serviceDestroy } from "@/services/services";
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import Link from "next/link";
import Swal from 'sweetalert2';
import AuthGuard from '@/components/AuthGuard';



  export default function Page() {
    const [rows, setRows] = React.useState<GridRowsProp>([]);
    const [loading, setLoading] = React.useState(true);
    
    // Define columns inside component to access reload/state if needed, or outside + actions
    const columns: GridColDef[] = [
      { field: 'name', headerName: 'Name', flex: 1 },
      { field: 'description', headerName: 'Description', flex: 1 },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 200,
        renderCell: (params) => (
          <div className="flex gap-2">
            <Link href={`/product-category/${params.row.id}/edit`}>
              <IconButton size="small" title="Edit">
                <EditIcon fontSize="small" sx={{ color: 'gray' }} />
              </IconButton>
            </Link>
            <IconButton 
              size="small"
              onClick={() => handleDelete(params.row.id)}
              title="Delete"
            >
              <DeleteIcon fontSize="small" color="error" />
            </IconButton>
          </div>
        ),
      },
    ];

  const getData = async () => {
    setLoading(true);
    try {
        const response = await service('product_categories');
        setRows(response.data);
    } catch (error) {
        console.error("Failed to fetch data", error);
    } finally {
        setLoading(false);
    }
  };
  
  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await serviceDestroy('product_categories', id.toString());
        Swal.fire('Deleted!', 'Category has been deleted.', 'success');
        getData();
      } catch (error) {
        Swal.fire('Error', 'Failed to delete category', 'error');
      }
    }
  };
  
  useEffect(() => {
    getData();
  }, []);


  return (
    <AuthGuard>
      <Layout>
        <div className="flex w-full justify-between items-center my-4">
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-black text-2xl">Product Category</h1>
          </div>
          <Link href="/product-category/create">
          <Button variant="contained">TAMBAH KATEGORI</Button>
          </Link>
          
        </div>
         
        <div style={{ height: 400, width: '100%' }}>
          <div className="flex justify-end mb-2">
           <IconButton
            onClick={getData}
            disabled={loading}
            aria-label="refresh"
          >
            <RefreshIcon />
          </IconButton> 
          </div>   
          <DataGrid 
          
              rows={rows} 
              columns={columns} 
              loading={loading}
              getRowId={(row) => row.id}
          />
        </div>
      </Layout>
    </AuthGuard>
  );
  
}