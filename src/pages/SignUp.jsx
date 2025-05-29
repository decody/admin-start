import React from "react";
import { Form, Input, Button } from "antd";

const TextField = ({ name, label, rules, ...rest }) => (
  <Form.Item name={name} label={label} rules={rules}>
    <Input
      {...rest}
      style={{ border: "1px solid #d9d9d9", borderRadius: "2px" }}
    />
  </Form.Item>
);

// 유효성 검증 함수들
const validateUsername = (_, value) => {
  if (!value) {
    return Promise.reject({
      message: "아이디를 입력해주세요",
      errorCode: "EMPTY_USERNAME",
    });
  }
  if (value.length < 4) {
    return Promise.reject({
      message: "아이디는 4자 이상이어야 합니다",
      errorCode: "SHORT_USERNAME",
    });
  }
  if (value.length > 20) {
    return Promise.reject({
      message: "아이디는 20자 이하여야 합니다",
      errorCode: "LONG_USERNAME",
    });
  }
  if (!/^[a-zA-Z0-9]+$/.test(value)) {
    return Promise.reject({
      message: "아이디는 영문과 숫자만 사용할 수 있습니다",
      errorCode: "INVALID_USERNAME_FORMAT",
    });
  }
  return Promise.resolve();
};

const validatePassword = (_, value) => {
  if (!value) {
    return Promise.reject({
      message: "비밀번호를 입력해주세요",
      errorCode: "EMPTY_PASSWORD",
    });
  }
  if (value.length < 8) {
    return Promise.reject({
      message: "비밀번호는 8자 이상이어야 합니다",
      errorCode: "SHORT_PASSWORD",
    });
  }
  if (!/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(value)) {
    return Promise.reject({
      message: "비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다",
      errorCode: "INVALID_PASSWORD_FORMAT",
    });
  }
  return Promise.resolve();
};

const validateConfirmPassword = ({ getFieldValue }) => ({
  validator(_, value) {
    if (!value) {
      return Promise.reject({
        message: "비밀번호 확인을 입력해주세요",
        errorCode: "EMPTY_CONFIRM_PASSWORD",
      });
    }
    if (value !== getFieldValue("password")) {
      return Promise.reject({
        message: "비밀번호가 일치하지 않습니다",
        errorCode: "PASSWORD_MISMATCH",
      });
    }
    return Promise.resolve();
  },
});

const validatePhoneNumber = (_, value) => {
  if (!value) {
    return Promise.reject({
      message: "휴대폰 번호를 입력해주세요",
      errorCode: "EMPTY_PHONE_NUMBER",
    });
  }
  if (!/^01[0-9]{1}[0-9]{3,4}[0-9]{4}$/.test(value)) {
    return Promise.reject({
      message: "올바른 휴대폰 번호를 입력해주세요",
      errorCode: "INVALID_PHONE_NUMBER",
    });
  }
  return Promise.resolve();
};

export default function SignUp() {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log(values);
    // 여기에 회원가입 로직 구현
  };

  return (
    <div>
      <h2>회원가입</h2>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <TextField
          name="username"
          label="아이디"
          rules={[{ validator: validateUsername }]}
        />
        <TextField
          name="password"
          label="비밀번호"
          type="password"
          rules={[{ validator: validatePassword }]}
        />
        <TextField
          name="confirmPassword"
          label="비밀번호 확인"
          type="password"
          rules={[{ validator: validateConfirmPassword }]}
        />
        <TextField
          name="phoneNumber"
          label="휴대폰 번호"
          rules={[{ validator: validatePhoneNumber }]}
        />
        <Form.Item>
          <Button type="primary" htmlType="submit">
            회원가입
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
