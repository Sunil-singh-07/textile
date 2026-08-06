import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { productFormSchema } from '../../utils/productSchemas';
import { POPULAR_CATEGORIES } from '../../utils/mockLandingData';

import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Subheading, Text } from '../ui/Typography';

// Shared by the create and edit routes — the caller owns fetching/mutating,
// this component only owns the fields + client-side validation.
const ProductForm = ({ defaultValues, onSubmit, isSubmitting, submitLabel = 'Save Product' }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="space-y-4">
        <Subheading>Basics</Subheading>

        <Input
          label="Product name"
          placeholder="e.g. Combed Cotton Poplin"
          error={errors.name?.message}
          {...register('name')}
        />

        <div>
          <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-ink">
            Category
          </label>
          <select
            id="category"
            className={`w-full rounded-lg border bg-surface px-3.5 py-2.5 text-sm text-ink
              transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500
              ${errors.category ? 'border-danger' : 'border-border'}`}
            {...register('category')}
          >
            <option value="">Select a category</option>
            {POPULAR_CATEGORIES.map(({ name }) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          {errors.category && <p className="mt-1.5 text-sm text-danger">{errors.category.message}</p>}
        </div>

        <div>
          <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-ink">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            placeholder="Fabric feel, ideal use-case, care instructions…"
            className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-ink
              placeholder:text-muted/70 transition-colors focus:outline-none focus:ring-2
              focus:ring-accent-500/30 focus:border-accent-500"
            {...register('description')}
          />
        </div>
      </Card>

      <Card className="space-y-4">
        <Subheading>Pricing &amp; Stock</Subheading>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Price (₹ / metre)"
            type="number"
            step="0.01"
            min="0"
            error={errors.price?.message}
            {...register('price')}
          />
          <Input
            label="Stock (metres)"
            type="number"
            min="0"
            error={errors.stock?.message}
            {...register('stock')}
          />
        </div>
        <Text>Status is set automatically — in stock while stock &gt; 0, out of stock otherwise.</Text>
      </Card>

      <Card className="space-y-4">
        <Subheading>Specifications</Subheading>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            label="GSM"
            type="number"
            step="1"
            min="0"
            placeholder="180"
            error={errors.gsm?.message}
            {...register('gsm')}
          />
          <Input label="Width" placeholder='58"' {...register('width')} />
          <Input label="Composition" placeholder="100% Cotton" {...register('composition')} />
        </div>
        <Input
          label="Colors"
          placeholder="Indigo, Ivory, Charcoal (comma-separated)"
          {...register('colors')}
        />
        <Input
          label="Image URLs"
          placeholder="https://…, https://… (comma-separated)"
          {...register('images')}
        />
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
