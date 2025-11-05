import { PlusIcon, SearchIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Input } from "./ui/input";

type EntityHeaderProps = {
  title: string;
  description?: string;
  newButtonLabel: string;
  disabled?: boolean;
  isCreating?: boolean;
} & (
  | { onNew: () => void; newButtonHref?: never }
  | { newButtonHref: string; onNew?: never }
  | { onNew?: never; newButtonHref?: never }
);

type EntitySearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

type EntityPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  disabled?: boolean;
};

export const EntityHeader = ({
  title,
  description,
  newButtonLabel,
  disabled,
  isCreating,
  onNew,
  newButtonHref,
}: EntityHeaderProps) => {
  return (
    <div className="flex items-center justify-between gap-x-4">
      <div className="flex flex-col">
        <h1 className="text-lg md:text-xl font-semibold">{title}</h1>
        {description ? (
          <p className="text-xs md:text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {onNew && !newButtonHref ? (
        <Button onClick={onNew} disabled={disabled || isCreating} size="sm">
          <PlusIcon className="size-4" />
          {newButtonLabel}
        </Button>
      ) : null}
      {!onNew && newButtonHref ? (
        <Button asChild size="sm">
          <Link href={newButtonHref} prefetch>
            <PlusIcon className="size-4" />
            {newButtonLabel}
          </Link>
        </Button>
      ) : null}
    </div>
  );
};

export const EntityContainer = ({
  header,
  search,
  pagination,
  children,
}: {
  header?: React.ReactNode;
  search?: React.ReactNode;
  pagination?: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <div className="p-4 md:px-10 md:py-6 h-full flex flex-col gap-y-4">
      <div className="mx-auto max-w-xl w-full flex flex-col gap-y-8 h-full">
        {header}
        <div className="flex flex-col gap-y-4 h-full">
          {search}
          {children}
        </div>
        {pagination}
      </div>
    </div>
  );
};

export const EntitySearch = ({
  value,
  onChange,
  placeholder,
}: EntitySearchProps) => {
  return (
    <div className="relative ml-auto">
      <SearchIcon className="absolute size-3.5 left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <Input
        className="max-w-[200px] bg-background shadow-none border-border pl-8"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export const EntityPagination = ({
  page,
  totalPages,
  onPageChange,
  disabled,
}: EntityPaginationProps) => {
  return (
    <div className="flex items-center justify-between gap-x-2 w-full">
      <div className="flex-1 text-sm text-muted-foreground">
        Page {page} of {totalPages || 1}
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={disabled || page <= 1}
          size="sm"
          variant="outline"
        >
          Previous
        </Button>
        <Button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={disabled || page === totalPages || totalPages === 0}
          size="sm"
          variant="outline"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
