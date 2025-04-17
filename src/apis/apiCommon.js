import { apiClient } from "../apis/axios";

// GET 요청
const fetchData = async () => {
  try {
    const response = await apiClient.get("/users", { page: 1, limit: 10 });
    return response.data;
  } catch (error) {
    console.error("데이터 조회 실패:", error.userMessage);
  }
};

// POST 요청
const createUser = async (userData) => {
  try {
    const response = await apiClient.post("/users", userData);
    return response.data;
  } catch (error) {
    console.error("사용자 생성 실패:", error.userMessage);
  }
};

// 파일 업로드
const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await apiClient.upload("/files/upload", formData);
    return response.data;
  } catch (error) {
    console.error("파일 업로드 실패:", error.userMessage);
  }
};

// 파일 다운로드
const downloadReport = async (reportId) => {
  try {
    await apiClient.download(
      `/reports/${reportId}`,
      {},
      `report-${reportId}.xlsx`
    );
  } catch (error) {
    console.error("파일 다운로드 실패:", error.userMessage);
  }
};
