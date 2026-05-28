"use client";

import React from "react";
import { MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type AnyRecord = object;

export type DataTableColumn<T extends AnyRecord> = {
  key: keyof T;
  label: React.ReactNode;
  className?: string;
  headerClassName?: string;
  hideOnMobile?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
};

export type DataTableAction<T extends AnyRecord> = {
  label: string;
  onSelect: (row: T) => void;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: "default" | "destructive";
  disabled?: boolean;
  separatorBefore?: boolean;
};

export interface DataTableProps<T extends AnyRecord> {
  data: T[];
  columns: Array<DataTableColumn<T>>;
  actions?: Array<DataTableAction<T>>;
  className?: string;
  tableClassName?: string;
  emptyState?: React.ReactNode;
  getRowId?: (row: T, index: number) => React.Key;
}

export function DataTable<T extends AnyRecord>({
  data,
  columns,
  actions,
  className,
  tableClassName,
  emptyState,
  getRowId,
}: DataTableProps<T>) {
  const rowActions = actions ?? [];
  const hasActions = rowActions.length > 0;
  const colSpan = columns.length + (hasActions ? 1 : 0);

  return (
    <div
      className={cn(
        "w-full overflow-x-auto rounded-2xl bg-transparent",
        className
      )}
    >
      <Table className={cn("min-w-[680px]", tableClassName)}>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            {columns.map((column) => (
              <TableHead
                key={String(column.key)}
                className={cn(
                  "whitespace-nowrap",
                  column.hideOnMobile && "hidden sm:table-cell",
                  column.headerClassName
                )}
              >
                {column.label}
              </TableHead>
            ))}
            {hasActions && (
              <TableHead className="w-[72px] text-right">
                Acciones
              </TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={colSpan} className="py-10 text-center text-muted-foreground">
                {emptyState ?? "No hay registros para mostrar."}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => {
              const rowId = getRowId?.(row, index) ?? index;

              return (
                <TableRow key={rowId}>
                  {columns.map((column) => {
                    const value = row[column.key];

                    return (
                      <TableCell
                        key={String(column.key)}
                        className={cn(
                          column.hideOnMobile && "hidden sm:table-cell",
                          column.className
                        )}
                      >
                        {column.render ? column.render(value, row) : String(value ?? "")}
                      </TableCell>
                    );
                  })}

                  {hasActions && (
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="text-muted-foreground hover:text-foreground"
                            aria-label="Abrir acciones"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 min-w-56">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {rowActions.map((action) => {
                            const ActionIcon = action.icon;

                            return (
                              <DropdownMenuItem
                                key={action.label}
                                variant={action.variant}
                                disabled={action.disabled}
                                onSelect={(event) => {
                                  event.preventDefault();
                                  action.onSelect(row);
                                }}
                              >
                                {ActionIcon ? <ActionIcon className="h-4 w-4" /> : null}
                                <span>{action.label}</span>
                              </DropdownMenuItem>
                            );
                          })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default DataTable;
