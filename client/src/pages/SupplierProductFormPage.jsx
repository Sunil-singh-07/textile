import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

import { productApi } from '../api/productApi';
import { toProductPayload, productToFormValues } from '../utils/productSchemas';

import PageContainer from '../components/common/PageContainer';
import EmptyState from '../components/common/EmptyState';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';
import ProductForm from '../components/supplier/ProductForm';

const EMPTY_DEFAULTS = productToFormValues(null);

// Same route pattern as the rest of the app (e.g. CheckoutPage): one page,
// react-query for data, react-hook-form + zod for the form itself. `id` is
// only present on the edit route (/supplier/products/:id/edit).
const SupplierProductFormPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['products', 'detail', id],
    queryFn: () => productApi.getById(id),
    enabled: isEditMode,
  });

  const invalidateProductQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard', 'supplier'] });
  };

  const createMutation = useMutation({
    mutationFn: (payload) => productApi.create(payload),
    onSuccess: () => {
      toast.success('Product created');
      invalidateProductQueries();
      navigate('/supplier/products', { replace: true });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload) => productApi.update(id, payload),
    onSuccess: () => {
      toast.success('Product updated');
      invalidateProductQueries();
      navigate('/supplier/products', { replace: true });
    },
  });

  const handleSubmit = (values) => {
    const payload = toProductPayload(values);
    if (isEditMode) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  const backLink = (
    <Link
      to="/supplier/products"
      className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink"
    >
      <ChevronLeft className="h-4 w-4" />
      Back to My Products
    </Link>
  );

  if (isEditMode && isLoading) {
    return (
      <PageContainer title="Edit Product">
        {backLink}
        <Card className="space-y-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </Card>
      </PageContainer>
    );
  }

  if (isEditMode && isError) {
    return (
      <PageContainer title="Edit Product">
        {backLink}
        <EmptyState
          icon={AlertTriangle}
          title="Couldn't load this product"
          description="It may have been deleted, or something went wrong reaching the server."
        />
      </PageContainer>
    );
  }

  const defaultValues = isEditMode ? productToFormValues(data?.product) : EMPTY_DEFAULTS;

  return (
    <PageContainer
      title={isEditMode ? 'Edit Product' : 'Add Product'}
      description={isEditMode ? 'Update your listing details, pricing, and stock.' : 'List a new fabric in your catalog.'}
    >
      {backLink}
      <ProductForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        submitLabel={isEditMode ? 'Save Changes' : 'Create Product'}
      />
    </PageContainer>
  );
};

export default SupplierProductFormPage;
