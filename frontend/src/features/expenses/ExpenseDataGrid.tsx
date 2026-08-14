import CurrencyDisplay from "@/shared/components/ui/CurrencyDisplay";
import type { Expense } from "./expenses.types";
import type { GridColDef } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
interface ExpenseDataGridProps {
  expenses: Expense[];
  isLoading: boolean;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

export default function ExpenseDataGrid({
  expenses,
  isLoading,
  onEdit,
  onDelete,
}: ExpenseDataGridProps) {
  const columns: GridColDef<Expense>[] = [
    {
      field: "date",
      headerName: "Date",
      width: 130,
      renderCell: (params) =>
        new Date(params.row.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      minWidth: 160,
    },
    {
      field: "categoryName",
      headerName: "Category",
      width: 160,
      renderCell: (params) => (
        <span
          className="badge badge-sm"
          style={{ backgroundColor: params.row.categoryColor, color: "#fff" }}
        >
          {params.row.categoryName}
        </span>
      ),
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 140,
      renderCell: (params) => <CurrencyDisplay amount={params.row.amount} />,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 160,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div className="flex gap-2">
          <button
            type="button"
            className="btn btn-xs btn-ghost"
            onClick={() => onEdit(params.row)}
          >
            Edit
          </button>
          <button
            type="button"
            className="btn btn-xs btn-error"
            onClick={() => onDelete(params.row)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <DataGrid
        rows={expenses}
        columns={columns}
        loading={isLoading}
        getRowId={(row) => row.id}
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
              page: 0,
            },
          },
        }}
        disableRowSelectionOnClick
      />
    </div>
  );
}
