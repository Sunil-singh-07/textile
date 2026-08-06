import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

import { onboardingApi } from '../api/onboardingApi';
import { supplierApi } from '../api/supplierApi';
import { API_ERROR_CODES } from '../utils/constants';
import {
  supplierOnboardingSchema,
  BUSINESS_TYPE_OPTIONS_SUPPLIER,
  CATEGORY_OPTIONS,
  FABRIC_TYPE_OPTIONS,
  MOQ_OPTIONS,
} from '../utils/onboardingSchemas';

import PageContainer from '../components/common/PageContainer';
import EmptyState from '../components/common/EmptyState';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import ChipMultiSelect from '../components/forms/ChipMultiSelect';

const SupplierOnboardingPage = () => {
  const navigate = useNavigate();

  // GET /suppliers/me 404s with NOT_FOUND until onboarding has been
  // completed once (see supplierController.getMyProfile) — the only
  // server-verifiable "already onboarded?" signal available, so a
  // returning supplier skips straight to the dashboard. skipErrorToast
  // suppresses the global error toast for the expected first-time 404.
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['suppliers', 'me'],
    queryFn: () => supplierApi.getMyProfile({ skipErrorToast: true }),
    retry: false,
  });

  const alreadyOnboarded = Boolean(data?.profile);
  const genuineError = isError && error?.code !== API_ERROR_CODES.NOT_FOUND;

  useEffect(() => {
    if (alreadyOnboarded) {
      navigate('/supplier/dashboard', { replace: true });
    }
  }, [alreadyOnboarded, navigate]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(supplierOnboardingSchema),
    defaultValues: {
      businessName: '',
      businessType: '',
      contactInfo: { phone: '', email: '' },
      address: { street: '', city: '', state: '', country: '', postalCode: '' },
      operatingHours: '',
      categories: [],
      fabricTypes: [],
      moq: '',
    },
  });

  const onSubmit = async (values) => {
    try {
      // POST /onboarding/supplier — upsert, so this is safe even on a retry.
      await onboardingApi.submitSupplier(values);
      toast.success('Welcome aboard — your supplier profile is live.');
      navigate('/supplier/dashboard', { replace: true });
    } catch {
      // axiosClient's response interceptor already toasts the error message.
    }
  };

  if (isLoading || alreadyOnboarded) {
    // alreadyOnboarded still renders this briefly while the effect above
    // navigates away, so the form never flashes for a returning supplier.
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (genuineError) {
    return (
      <PageContainer title="Set up your supplier profile">
        <EmptyState
          icon={AlertTriangle}
          title="Couldn't check your onboarding status"
          description="Something went wrong reaching the server. Please refresh and try again."
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Set up your supplier profile"
      description="Buyers use this to find and trust your business — takes a few minutes."
    >
      <div className="mx-auto max-w-2xl">
        <Card variant="elevated">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <Input
              label="Business Name"
              placeholder="e.g. Anandi Textile Mills"
              error={errors.businessName?.message}
              {...register('businessName')}
            />

            <Select
              label="Business Type"
              placeholder="Select a business type"
              error={errors.businessType?.message}
              {...register('businessType')}
            >
              {BUSINESS_TYPE_OPTIONS_SUPPLIER.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Select>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Contact Phone"
                type="tel"
                placeholder="+91 98765 43210"
                error={errors.contactInfo?.phone?.message}
                {...register('contactInfo.phone')}
              />
              <Input
                label="Contact Email"
                type="email"
                placeholder="business@company.com"
                error={errors.contactInfo?.email?.message}
                {...register('contactInfo.email')}
              />
            </div>

            <div className="space-y-4">
              <Input
                label="Street Address"
                placeholder="Shop / plot number, street"
                error={errors.address?.street?.message}
                {...register('address.street')}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="City"
                  error={errors.address?.city?.message}
                  {...register('address.city')}
                />
                <Input
                  label="State"
                  error={errors.address?.state?.message}
                  {...register('address.state')}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Country"
                  error={errors.address?.country?.message}
                  {...register('address.country')}
                />
                <Input
                  label="Postal Code"
                  error={errors.address?.postalCode?.message}
                  {...register('address.postalCode')}
                />
              </div>
            </div>

            <Input
              label="Operating Hours"
              placeholder="e.g. Mon-Sat, 9:00 AM - 6:00 PM"
              error={errors.operatingHours?.message}
              {...register('operatingHours')}
            />

            <Controller
              name="categories"
              control={control}
              render={({ field }) => (
                <ChipMultiSelect
                  label="Categories"
                  options={CATEGORY_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.categories?.message}
                />
              )}
            />

            <Controller
              name="fabricTypes"
              control={control}
              render={({ field }) => (
                <ChipMultiSelect
                  label="Fabric Types"
                  options={FABRIC_TYPE_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.fabricTypes?.message}
                />
              )}
            />

            <Select
              label="Minimum Order Quantity (MOQ)"
              placeholder="Select your MOQ"
              error={errors.moq?.message}
              {...register('moq')}
            >
              {MOQ_OPTIONS.map((opt) => (
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

export default SupplierOnboardingPage;