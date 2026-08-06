import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { onboardingApi } from '../api/onboardingApi';
import {
  buyerOnboardingSchema,
  BUSINESS_TYPE_OPTIONS_BUYER,
  INDUSTRY_OPTIONS,
  CATEGORY_OPTIONS,
  FABRIC_TYPE_OPTIONS,
  ORDER_QTY_OPTIONS,
  BUDGET_RANGE_OPTIONS,
} from '../utils/onboardingSchemas';

import PageContainer from '../components/common/PageContainer';
import Card from '../components/ui/Card';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import ChipMultiSelect from '../components/forms/ChipMultiSelect';

const BuyerOnboardingPage = () => {
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(buyerOnboardingSchema),
    defaultValues: {
      businessType: '',
      industry: '',
      categoriesOfInterest: [],
      fabricPreferences: [],
      typicalOrderQty: '',
      budgetRange: '',
    },
  });

  const onSubmit = async (values) => {
    try {
      // POST /onboarding/buyer — an upsert, so revisiting this page and
      // submitting again later is harmless; no completion check needed.
      await onboardingApi.submitBuyer(values);
      toast.success('Welcome aboard — your buyer profile is set up.');
      navigate('/buyer/dashboard', { replace: true });
    } catch {
      // axiosClient's response interceptor already toasts the error message.
    }
  };

  return (
    <PageContainer
      title="Tell us about your business"
      description="A few details help suppliers understand what you're sourcing — takes about a minute."
    >
      <div className="mx-auto max-w-2xl">
        <Card variant="elevated">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <Select
              label="Business Type"
              placeholder="Select a business type"
              error={errors.businessType?.message}
              {...register('businessType')}
            >
              {BUSINESS_TYPE_OPTIONS_BUYER.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Select>

            <Select
              label="Industry"
              placeholder="Select your industry"
              error={errors.industry?.message}
              {...register('industry')}
            >
              {INDUSTRY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Select>

            <Controller
              name="categoriesOfInterest"
              control={control}
              render={({ field }) => (
                <ChipMultiSelect
                  label="Categories of Interest"
                  options={CATEGORY_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.categoriesOfInterest?.message}
                />
              )}
            />

            <Controller
              name="fabricPreferences"
              control={control}
              render={({ field }) => (
                <ChipMultiSelect
                  label="Fabric Preferences"
                  options={FABRIC_TYPE_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.fabricPreferences?.message}
                />
              )}
            />

            <Select
              label="Typical Order Quantity"
              placeholder="Select a typical order size"
              error={errors.typicalOrderQty?.message}
              {...register('typicalOrderQty')}
            >
              {ORDER_QTY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Select>

            <Select
              label="Budget Range"
              placeholder="Select a budget range"
              error={errors.budgetRange?.message}
              {...register('budgetRange')}
            >
              {BUDGET_RANGE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Select>

            <Button type="submit" isLoading={isSubmitting} className="w-full" size="lg">
              Complete Onboarding
            </Button>
          </form>
        </Card>
      </div>
    </PageContainer>
  );
};

export default BuyerOnboardingPage;