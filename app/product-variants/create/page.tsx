'use client';

import Layout from '@/components/ui/Layout';
import { service, serviceStore } from '@/services/services';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function ProductVariantCreate() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchProducts = async () => {
      try {
        const response = await service('products');
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products');
      }
    };
    fetchProducts();
  }, []);

  if (!mounted) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      await serviceStore('product_variants', formData);
      Swal.fire('Success', 'Variant created successfully', 'success');
      router.push('/product-variants');
    } catch (error: any) {
      Swal.fire('Error', error?.response?.data?.message || 'Failed to create variant', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-black text-2xl font-bold mb-4">Create Product Variant</h1>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormControl fullWidth variant="standard" required>
            <InputLabel>Product</InputLabel>
            <Select name="product_id" defaultValue="">
              {products.map((prod) => (
                <MenuItem key={prod.id} value={prod.id}>
                  {prod.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField name="name" label="Variant Name" variant="standard" required fullWidth />
          
          <TextField 
            name="description" 
            label="Description" 
            variant="standard" 
            fullWidth 
            multiline 
            rows={2} 
            className="md:col-span-2"
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outlined" color="secondary" onClick={() => router.back()} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Saving...' : 'Submit'}
          </Button>
        </div>
      </form>
    </Layout>
  );
}