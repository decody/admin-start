import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import { Input } from "antd";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { gridData } from "../mocks/gridData";

// 디바운스 커스텀 훅
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default function AgGrid() {
  const gridRef = useRef(); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState([]); // Set rowData to Array of Objects, one Object per Row
  const [searchTerm, setSearchTerm] = useState("");

  // 300ms 디바운스 적용
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Each Column Definition results in one Column.
  const [columnDefs, setColumnDefs] = useState([
    { field: "make", filter: true },
    { field: "model", filter: true },
    { field: "price" },
  ]);

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(() => ({
    sortable: true,
  }));

  // Example of consuming Grid Event
  const cellClickedListener = useCallback((event) => {
    console.log("cellClicked", event);
  }, []);

  // Example load data from server
  useEffect(() => {
    setRowData(gridData);
  }, []);

  // Example using Grid's API
  const buttonListener = useCallback((e) => {
    gridRef.current.api.deselectAll();
  }, []);

  // 검색 로직을 별도의 함수로 분리
  const performSearch = useCallback((searchValue) => {
    if (!searchValue.trim()) {
      setRowData(gridData);
      return;
    }

    const filteredData = gridData.filter((item) =>
      Object.values(item).some(
        (val) =>
          val.toString().toLowerCase().indexOf(searchValue.toLowerCase()) !== -1
      )
    );
    setRowData(filteredData);
  }, []);

  // 디바운스된 검색어가 변경될 때마다 검색 수행
  useEffect(() => {
    performSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, performSearch]);

  // Input.Search의 onChange 핸들러
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Enter 키 입력 핸들러
  const handlePressEnter = () => {
    performSearch(searchTerm);
  };

  return (
    <div>
      <div>
        <Input.Search
          placeholder="검색어를 입력하세요"
          onChange={handleSearchChange}
          onPressEnter={handlePressEnter}
          onSearch={handlePressEnter}
          value={searchTerm}
          style={{ width: 300, marginBottom: 16 }}
        />
      </div>
      {/* Example using Grid's API */}
      <button onClick={buttonListener}>Push Me</button>

      {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
      <div
        className="ag-theme-alpine"
        style={{ width: 800, height: 500, border: "1px solid red" }}
      >
        <AgGridReact
          ref={gridRef} // Ref for accessing Grid's API
          rowData={rowData} // Row Data for Rows
          columnDefs={columnDefs} // Column Defs for Columns
          defaultColDef={defaultColDef} // Default Column Properties
          animateRows={true} // Optional - set to 'true' to have rows animate when sorted
          rowSelection="multiple" // Options - allows click selection of rows
          onCellClicked={cellClickedListener} // Optional - registering for Grid Event
        />
      </div>
    </div>
  );
}
