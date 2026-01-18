'use client';

import Layout from '@/components/ui/Layout';
import { service, serviceStore } from '@/services/services';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function ProductCreate() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchCategories = async () => {
      try {
        const response = await service('product_categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories');
      }
    };
    fetchCategories();
  }, []);

  if (!mounted) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      await serviceStore('products', formData);
      Swal.fire('Success', 'Product created successfully', 'success');
      router.push('/products');
    } catch (error: any) {
      Swal.fire('Error', error?.response?.data?.message || 'Failed to create product', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-black text-2xl font-bold mb-4">Create Product</h1>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField name="name" label="Name" variant="standard" required fullWidth />
          <TextField name="code" label="Code" variant="standard" required fullWidth />
          <TextField name="price" label="Price" type="number" variant="standard" required fullWidth slotProps={{ htmlInput: { min: 0 } }} />
          
          <FormControl fullWidth variant="standard" required>
            <InputLabel>Category</InputLabel>
            <Select name="product_category_id" defaultValue="">
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
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