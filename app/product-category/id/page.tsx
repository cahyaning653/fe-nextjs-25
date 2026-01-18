"use client";

import Layout from "@/components/components/Layout";
import { serviceShow, serviceUpdate } from "@/services/services";
import { Button, TextField } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function EditProductCategory() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    serviceShow("product-categories", id).then((res) => {
      setData(res.data);
    });
  }, [id]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    await serviceUpdate("product-categories", formData, id);
    Swal.fire("Success", "Category updated", "success");
    router.push("/product-category");
  };

  if (!data) return <Layout>Loading...</Layout>;

  return (
    <Layout>
      <h1 className="text-2xl font-bold">Edit Product Category</h1>

      <form onSubmit={submit} className="space-y-4 mt-4">
        <TextField
          name="name"
          label="Name"
          defaultValue={data.name}
          required
          fullWidth
        />
        <TextField
          name="description"
          label="Description"
          defaultValue={data.description}
          fullWidth
        />

        <div className="flex justify-end gap-2">
          <Button onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" variant="contained">
            Update
          </Button>
        </div>
      </form>
    </Layout>
  );
}