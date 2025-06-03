import React, { useState } from "react";
import FormTable from "../components/common/FormTable";

// FormTableExample using the updated FormTable component
// with custom multi-column and colspan layouts
export default function FormTableExample() {
  const [showTable, setShowTable] = useState(true);

  // Note: columns are still needed for the FormTable logic for standard rows
  const columns = [
    {
      title: "항목",
      dataIndex: "label",
      key: "label",
    },
    {
      title: "내용",
      dataIndex: "content",
      key: "content",
    },
  ];

  // Define column widths for the table using colgroup
  const colWidths = [
    "15%", // 첫번째 라벨 열
    "35%", // 첫번째 내용 열
    "15%", // 두번째 라벨 열
    "35%", // 두번째 내용 열
  ];

  const data = [
    {
      key: "1",
      label: "재판매특약",
      content: (
        <div className="flex items-center gap-4">
          <label className="inline-flex items-center">
            <input type="radio" name="re-sale" className="mr-1" /> 예
          </label>
          <label className="inline-flex items-center">
            <input type="radio" name="re-sale" className="mr-1" /> 아니오
          </label>
          <label className="inline-flex items-center">
            <input type="checkbox" name="re-sale-gov" className="mr-1" /> 정부,
            공공기관 여부
          </label>
        </div>
      ),
    },
    {
      key: "2",
      label: "현지법인",
      content: (
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            className="border p-1"
            placeholder="국가코드 입력"
          />
          <input
            type="text"
            className="border p-1"
            placeholder="국외기업코드 입력"
          />
          <input
            type="text"
            className="border p-1"
            placeholder="국외기업명 입력"
          />
          <button
            type="button"
            className="bg-blue-500 text-white px-2 py-1 rounded"
          >
            국외업체조회
          </button>
        </div>
      ),
    },
    // 신용등급과 소재국가명을 하나의 tr에 배치
    {
      key: "3-4",
      type: "multi-column",
      columns: [
        {
          label: "신용등급",
          content: (
            <input
              type="text"
              className="border p-1 w-full"
              placeholder="신용등급 입력"
            />
          ),
        },
        {
          label: "소재국가명",
          content: (
            <input
              type="text"
              className="border p-1 w-full"
              placeholder="소재국가명 입력"
            />
          ),
        },
      ],
    },
    // 국가등급과 대표자명을 하나의 tr에 배치
    {
      key: "5-6",
      type: "multi-column",
      columns: [
        {
          label: "국가등급",
          content: (
            <input
              type="text"
              className="border p-1 w-full"
              placeholder="국가등급 입력"
            />
          ),
        },
        {
          label: "대표자명",
          content: (
            <input
              type="text"
              className="border p-1 w-full"
              placeholder="대표자명 입력"
            />
          ),
        },
      ],
    },
    // 지급보증구분 (colspan 3 적용)
    {
      key: "8",
      type: "colspan",
      label: "지급보증구분",
      colSpan: 3,
      content: (
        <div className="flex items-center gap-4">
          <label className="inline-flex items-center">
            <input type="radio" name="guarantee-type" className="mr-1" /> 유
          </label>
          <label className="inline-flex items-center">
            <input type="radio" name="guarantee-type" className="mr-1" /> 무
          </label>
        </div>
      ),
    },
    // 지급보증업체 (colspan 3 적용)
    {
      key: "9",
      type: "colspan",
      label: "지급보증업체",
      colSpan: 3,
      content: (
        <div className="flex flex-wrap gap-2 w-full">
          <input
            type="text"
            className="border p-1 flex-grow"
            placeholder="지급보증업체 입력"
          />
          <button
            type="button"
            className="bg-blue-500 text-white px-2 py-1 rounded"
          >
            업체검색
          </button>
        </div>
      ),
    },
    // 주소 (colspan 3 적용)
    {
      key: "7",
      type: "colspan",
      label: "주소",
      colSpan: 3,
      content: (
        <input
          type="text"
          className="border p-1 w-full"
          placeholder="주소 입력"
        />
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">양식 테이블 예제</h2>
        <div>
          <button
            onClick={() => setShowTable(!showTable)}
            className="bg-indigo-600 text-white px-3 py-1 rounded mr-2"
          >
            {showTable ? "테이블 숨기기" : "테이블 보기"}
          </button>
        </div>
      </div>

      {showTable && (
        <div className="bg-white p-4 rounded shadow  max-w-[1200px] mx-auto">
          <FormTable
            columns={columns}
            data={data}
            className="border-gray-200"
            colWidths={colWidths}
          />
        </div>
      )}
    </div>
  );
}
