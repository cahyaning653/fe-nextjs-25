'use client';

import Layout from '@/components/ui/Layout';
import { service, serviceDestroy } from '@/services/services';
import { Button, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import AuthGuard from '@/components/AuthGuard';

export default function ProductVariantList() {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [loading, setLoading] = useState(true);

  const columns: GridColDef[] = [
    { 
      field: 'product_name', 
      headerName: 'Product', 
      flex: 1,
      valueGetter: (value, row) => row.product ? row.product.name : '-'
    },
    { field: 'name', headerName: 'Variant Name', flex: 1 },
    
    { field: 'description', headerName: 'Description', flex: 1 },
    
    
    
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <div className="flex gap-2">
          <Link href={`/product-variants/${params.row.id}/edit`}>
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
      const response = await service('product_variants');
      // callAPI returns full object if keys > 2 (which is the case for variants API), 
      // or just the data array if keys <= 2. 
      // Handle both cases to be safe.
      const data = response.data.data || response.data;
      setRows(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch variants', error);
      Swal.fire('Error', 'Failed to fetch variants', 'error');
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
        await serviceDestroy('product_variants', id.toString());
        Swal.fire('Deleted!', 'Variant has been deleted.', 'success');
        getData();
      } catch (error) {
        Swal.fire('Error', 'Failed to delete variant', 'error');
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
          <h1 className="font-bold text-black text-2xl">Product Variants</h1>
          <Link href="/product-variants/create">
            <Button variant="contained">TAMBAH VARIANT</Button>
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