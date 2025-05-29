import React, { useState, useRef, useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default function NestedAgGrid() {
  const gridRef = useRef();

  const [columnDefs] = useState([
    { field: "id", filter: true },
    { field: "make", filter: true },
    { field: "model", filter: true },
    { field: "price", filter: true },
    { field: "year", filter: true },
    { field: "color", filter: true },
    { field: "mileage", filter: true },
  ]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    flex: 1,
    filter: true,
  }));

  const treeData = [
    {
      id: 1,
      make: "Toyota",
      model: "Corolla",
      price: 20000,
      year: 2020,
      color: "Red",
      mileage: 15000,
      children: [
        {
          id: 2,
          make: "Toyota",
          model: "Camry",
          price: 25000,
          year: 2021,
          color: "Blue",
          mileage: 10000,
        },
        {
          id: 3,
          make: "Toyota",
          model: "RAV4",
          price: 30000,
          year: 2022,
          color: "Green",
          mileage: 5000,
        },
      ],
    },
    {
      id: 4,
      make: "Honda",
      model: "Civic",
      price: 22000,
      year: 2021,
      color: "Blue",
      mileage: 10000,
      children: [
        {
          id: 5,
          make: "Honda",
          model: "Accord",
          price: 28000,
          year: 2022,
          color: "Black",
          mileage: 8000,
        },
      ],
    },
  ];

  const buttonListener = useCallback(() => {
    gridRef.current.api.deselectAll();
  }, []);

  return (
    <div>
      <button onClick={buttonListener}>Clear Selection</button>

      <div
        className="ag-theme-alpine"
        style={{ width: 1000, height: 500, border: "1px solid red" }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={treeData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          treeData={true}
          animateRows={true}
          groupDefaultExpanded={-1}
          getDataPath={(data) => {
            return data.id.toString().split("-");
          }}
          autoGroupColumnDef={{
            headerName: "Model",
            minWidth: 300,
            cellRendererParams: {
              suppressCount: true,
            },
          }}
        />
      </div>
    </div>
  );
}
