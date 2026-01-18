'use client';

import Layout from '@/components/ui/Layout';
import { service, serviceDestroy } from '@/services/services';
import { Button, IconButton } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import AuthGuard from '@/components/AuthGuard';

export default function ProductList() {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [loading, setLoading] = useState(true);

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'code', headerName: 'Code', flex: 0.5 },
    {field:'description', headerName:'Description', flex:1},
    { field: 'price', headerName: 'Price', flex: 0.5 },
    { 
      field: 'category', 
      headerName: 'Category', 
      flex: 1,
      valueGetter: (value, row) => row.category ? row.category.name : '-'
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <div className="flex gap-2">
          <Link href={`/products/${params.row.id}/edit`}>
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
      const response = await service('products');
      setRows(response.data);
    } catch (error) {
      console.error('Failed to fetch products', error);
      Swal.fire('Error', 'Failed to fetch products', 'error');
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
        await serviceDestroy('products', id.toString());
        Swal.fire('Deleted!', 'Product has been deleted.', 'success');
        getData();
      } catch (error) {
        Swal.fire('Error', 'Failed to delete product', 'error');
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
          <h1 className="font-bold text-black text-2xl">Products</h1>
          <Link href="/products/create">
            <Button variant="contained">TAMBAH PRODUCT</Button>
          </Link>
        </div>
        <div style={{ height: 500, width: '100%' }}>
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