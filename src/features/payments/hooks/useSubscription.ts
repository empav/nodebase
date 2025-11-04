import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";

export const useSubscription = () => {
  return useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      return await authClient.customer.state();
    },
  });
};

export const useHasActiveSubscription = () => {
  const { data: customerState, isLoading, ...rest } = useSubscription();

  const hasActiveSubscription =
    customerState?.data?.activeSubscriptions &&
    customerState?.data?.activeSubscriptions.length > 0;

  return {
    hasActiveSubscription,
    subscription: customerState?.data?.activeSubscriptions?.[0],
    isLoading,
    ...rest,
  };
};
