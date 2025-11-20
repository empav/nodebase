"use client";

import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from "@/components/EntityComponents";
import { useUpgradeModal } from "@/hooks/useUpgradeModal";
import { useEntitySearch } from "@/hooks/useEntitySearch";
import { type Credential, CredentialType } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import useCredentialsParams from "../hooks/useCredentialsParams";
import {
  useCreateOneCredential,
  useRemoveCredential,
  useSuspenseCredential,
  useSuspenseCredentials,
} from "../hooks/useCredentials";
import Image from "next/image";
import CredentialForm from "./CredentialForm";

export const CredentialSearch = () => {
  const [params, setParams] = useCredentialsParams();

  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });

  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search Credentials"
    />
  );
};

export const CredentialsList = () => {
  const credentials = useSuspenseCredentials();

  return (
    <EntityList
      items={credentials.data.items}
      getKey={(credential) => credential.id}
      emptyView={<CredentialEmpty />}
      renderItem={(credentials) => <CredentialItem data={credentials} />}
    />
  );
};

export const CredentialPagination = () => {
  const ws = useSuspenseCredentials();
  const [params, setParams] = useCredentialsParams();

  return (
    <EntityPagination
      disabled={ws.isFetching}
      page={ws.data.page}
      totalPages={ws.data.totalPages}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

export const CredentialHeader = ({ disabled }: { disabled?: boolean }) => {
  const createCredential = useCreateOneCredential();
  const { modal } = useUpgradeModal();

  return (
    <>
      {modal}
      <EntityHeader
        title="Credentials"
        description="Create and manage your credential"
        newButtonHref={"/credentials/new"}
        newButtonLabel="New Credential"
        disabled={disabled}
        isCreating={createCredential.isPending}
      />
    </>
  );
};

export const CredentialContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<CredentialHeader />}
      search={<CredentialSearch />}
      pagination={<CredentialPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const CredentialLoading = () => (
  <LoadingView message="Loading Credentials..." />
);

export const CredentialError = () => (
  <ErrorView message="Error loading Credentials." />
);

export const CredentialEmpty = () => {
  return (
    <EmptyView message="You have not created any Credential yet. Get started by creating your first Credential" />
  );
};

export const LOGOS: Record<CredentialType, string> = {
  [CredentialType.GEMINI]: "/logos/gemini.svg",
};

export const CredentialItem = ({ data }: { data: Credential }) => {
  const removeCredential = useRemoveCredential();

  const logo = LOGOS[data.type] || "/logos/openai.svg";

  return (
    <EntityItem
      href={`/credentials/${data.id}`}
      title={data.name}
      subtitle={
        <>
          Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })}{" "}
          &bull; Created{" "}
          {formatDistanceToNow(data.createdAt, { addSuffix: true })}{" "}
        </>
      }
      image={
        <div className="size-8 flex items-center justify-center">
          <Image src={logo} alt={data.type} height={20} width={20} />
        </div>
      }
      onRemove={() => removeCredential.mutate({ id: data.id })}
      isRemoving={removeCredential.isPending}
    />
  );
};

export const CredentialView = ({ credentialId }: { credentialId: string }) => {
  const { data: credential } = useSuspenseCredential(credentialId);

  return <CredentialForm initialData={credential} />;
};
