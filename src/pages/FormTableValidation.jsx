import React from "react";
import FormTable from "../components/common/FormTable";
import { Form, Input, Radio, DatePicker, Button, Select, message } from "antd";
import "../styles/antd-overrides.css";
import "../styles/form-table.css";

export default function FormTableValidation() {
  const [form] = Form.useForm();

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

  const colWidths = ["15%", "35%", "15%", "35%"];

  const onChange = (date, dateString) => {
    console.log(date, dateString);
  };

  const data = [
    {
      key: "1",
      label: "재판매특약",
      type: "colspan",
      colSpan: 3,
      content: (
        <div className="resale-options full-width">
          <Form.Item
            name="re-sale"
            rules={[{ required: true, message: "재판매특약을 선택해주세요" }]}
          >
            <Radio.Group>
              <Radio value="yes">예</Radio>
              <Radio value="no">아니오</Radio>
              <Radio value="gov">정부/공공기관</Radio>
            </Radio.Group>
          </Form.Item>
        </div>
      ),
    },
    {
      key: "2",
      label: "현지법인",
      content: (
        <div className="inline-form-group">
          <Form.Item
            name="country-code"
            className="no-margin"
            rules={[{ required: true, message: "국가코드를 입력해주세요" }]}
          >
            <Input placeholder="국가코드 입력" />
          </Form.Item>
          <Form.Item
            name="foreign-company-code"
            className="no-margin"
            rules={[{ required: true, message: "국외기업코드를 입력해주세요" }]}
          >
            <Input placeholder="국외기업코드 입력" />
          </Form.Item>
          <Form.Item
            name="foreign-company-name"
            className="no-margin"
            rules={[{ required: true, message: "국외기업명을 입력해주세요" }]}
          >
            <Input placeholder="국외기업명 입력" />
          </Form.Item>
          <Button type="primary">국외업체조회</Button>
        </div>
      ),
    },
    {
      key: "3-4",
      type: "multi-column",
      columns: [
        {
          label: "신용등급",
          content: (
            <Form.Item
              name="credit-rating"
              rules={[{ required: true, message: "신용등급을 선택해주세요" }]}
            >
              <Select
                placeholder="신용등급 선택"
                className="full-width"
                popupClassName="credit-rating-dropdown"
              >
                <Select.Option value="A">A등급</Select.Option>
                <Select.Option value="B">B등급</Select.Option>
                <Select.Option value="C">C등급</Select.Option>
              </Select>
            </Form.Item>
          ),
        },
        {
          label: "소재국가명",
          content: (
            <Form.Item
              name="country-name"
              rules={[{ required: true, message: "소재국가명을 입력해주세요" }]}
            >
              <Input placeholder="소재국가명 입력" />
            </Form.Item>
          ),
        },
      ],
    },
    {
      key: "5-6",
      type: "multi-column",
      columns: [
        {
          label: "국가등급",
          content: (
            <Form.Item
              name="country-rating"
              rules={[{ required: true, message: "국가등급을 입력해주세요" }]}
            >
              <Input placeholder="국가등급 입력" />
            </Form.Item>
          ),
        },
        {
          label: "기간",
          content: (
            <Form.Item
              name="period"
              rules={[{ required: true, message: "기간을 선택해주세요" }]}
            >
              <DatePicker onChange={onChange} />
            </Form.Item>
          ),
        },
      ],
    },
    {
      key: "8",
      type: "colspan",
      label: "지급보증구분",
      colSpan: 3,
      content: (
        <div className="radio-group-container">
          <Form.Item
            name="guarantee-type"
            rules={[{ required: true, message: "지급보증구분을 선택해주세요" }]}
          >
            <Radio.Group>
              <Radio value="yes">유</Radio>
              <Radio value="no">무</Radio>
            </Radio.Group>
          </Form.Item>
        </div>
      ),
    },
    {
      key: "7",
      type: "colspan",
      label: "주소",
      colSpan: 3,
      content: (
        <Form.Item
          name="address"
          rules={[{ required: true, message: "주소를 입력해주세요" }]}
        >
          <Input placeholder="주소 입력" style={{ width: "100%" }} />
        </Form.Item>
      ),
    },
    {
      key: "9",
      type: "colspan",
      label: "상세설명",
      colSpan: 3,
      content: (
        <Form.Item
          name="description"
          rules={[{ required: true, message: "설명을 입력해주세요" }]}
        >
          <Input.TextArea
            placeholder="설명 입력"
            autoSize={{ minRows: 3, maxRows: 6 }}
            style={{ width: "100%" }}
          />
        </Form.Item>
      ),
    },
  ];

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      console.log("Form values:", values);
      message.success("폼이 성공적으로 저장되었습니다.");
    } catch (errorInfo) {
      console.log("Validation failed:", errorInfo);
      const errorFields = errorInfo.errorFields || [];

      if (errorFields.length > 0) {
        errorFields.forEach((error) => {
          message.error(error.errors[0]);
        });
      } else {
        message.error("입력값을 확인해주세요.");
      }
    }
  };

  const handleCancel = () => {
    form.resetFields();
    message.info("폼이 초기화되었습니다.");
  };

  return (
    <div className="form-container">
      <div className="header">
        <h2 className="title">폼 검증 테이블 예제</h2>
      </div>
      {
        <Form form={form} layout="vertical">
          <div className="table-container">
            <FormTable
              columns={columns}
              data={data}
              className="form-table"
              colWidths={colWidths}
            />
          </div>
          <div className="button-group">
            <Button size="large" onClick={handleCancel}>
              초기화
            </Button>
            <Button type="primary" size="large" onClick={handleSave}>
              저장
            </Button>
          </div>
        </Form>
      }
    </div>
  );
}
