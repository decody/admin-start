import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Input, Button, Checkbox, message } from "antd";
import { apiClient } from "../apis/axios";
import { useTranslation } from "react-i18next";
import {
  LOGIN_ERROR_MESSAGES,
  TOKEN_ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  NOTIFICATION_MESSAGES,
} from "../configs/errorMessages";

export default function SignIn() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [loginBlocked, setLoginBlocked] = useState(false);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      validateToken(token);
    }
  }, [navigate]);

  useEffect(() => {
    let timer;
    if (loginBlocked && blockTimeRemaining > 0) {
      timer = setTimeout(() => {
        setBlockTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (blockTimeRemaining === 0 && loginBlocked) {
      setLoginBlocked(false);
      setLoginAttempts(0);
    }

    return () => clearTimeout(timer);
  }, [loginBlocked, blockTimeRemaining]);

  const validateToken = async (token) => {
    try {
      await apiClient.get("/auth/me");
      navigate("/");
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    }
  };

  const onFinish = async (values) => {
    if (loginBlocked) {
      message.error(
        LOGIN_ERROR_MESSAGES.AUTH.LOGIN_BLOCKED(blockTimeRemaining)
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post("/auth/login", values);
      const { accessToken, refreshToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setLoginAttempts(0);
      showNotification(
        NOTIFICATION_MESSAGES.TITLES.LOGIN_SUCCESS,
        SUCCESS_MESSAGES.LOGIN
      );
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      handleLoginFailure(error, values);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginFailure = (error, formData) => {
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);

    if (newAttempts >= 5) {
      handleLoginBlocking();
    } else if (error.response) {
      message.error(error.userMessage || getErrorMessageByStatus(error));
      if (error.response.status === 401) {
        form.setFieldsValue({ username: formData.username, password: "" });
      }
    } else {
      message.error(
        error.userMessage || LOGIN_ERROR_MESSAGES.NETWORK.REQUEST_FAILED
      );
    }
  };

  const handleLoginBlocking = () => {
    setLoginBlocked(true);
    setBlockTimeRemaining(60);
    message.error(LOGIN_ERROR_MESSAGES.AUTH.ATTEMPT_LIMIT_EXCEEDED);
    form.resetFields();
  };

  const getErrorMessageByStatus = (error) => {
    const status = error.response.status;
    if (LOGIN_ERROR_MESSAGES.HTTP_STATUS[status]) {
      return status === 401 && error.response.data.message
        ? error.response.data.message
        : LOGIN_ERROR_MESSAGES.HTTP_STATUS[status];
    }
    return (
      error.response.data.message || LOGIN_ERROR_MESSAGES.GENERAL.LOGIN_FAILED
    );
  };

  const showNotification = (title, message) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body: message, icon: "/logo.png" });
    } else if (
      "Notification" in window &&
      Notification.permission !== "denied"
    ) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, { body: message, icon: "/logo.png" });
        }
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-2xl">
        <div>
          <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900">
            {t("auth.login")}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t("auth.loginPrompt")}
          </p>
          {loginBlocked && (
            <div className="mt-2 text-center text-sm">
              <p className="text-red-600 font-medium">
                {blockTimeRemaining}초 후에 다시 시도할 수 있습니다.
              </p>
            </div>
          )}
        </div>

        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          layout="vertical"
          className="mt-8 space-y-6"
        >
          <Form.Item
            name="username"
            label={t("auth.username")}
            rules={[
              {
                required: true,
                message: LOGIN_ERROR_MESSAGES.FORM_VALIDATION.EMPTY_USERNAME,
              },
              {
                max: 20,
                message: LOGIN_ERROR_MESSAGES.FORM_VALIDATION.USERNAME_TOO_LONG,
              },
            ]}
          >
            <Input
              disabled={loginBlocked || isLoading}
              placeholder="아이디를 입력하세요"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={t("auth.password")}
            rules={[
              {
                required: true,
                message: LOGIN_ERROR_MESSAGES.FORM_VALIDATION.EMPTY_PASSWORD,
              },
              {
                min: 8,
                message:
                  LOGIN_ERROR_MESSAGES.FORM_VALIDATION.PASSWORD_TOO_SHORT,
              },
            ]}
          >
            <Input.Password
              disabled={loginBlocked || isLoading}
              placeholder="비밀번호를 입력하세요"
            />
          </Form.Item>

          <div className="flex items-center justify-between">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox disabled={loginBlocked}>
                {t("auth.rememberMe")}
              </Checkbox>
            </Form.Item>

            <a
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              href="#"
            >
              {t("auth.forgotPassword")}
            </a>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={isLoading || loginBlocked}
              className="w-full"
            >
              {isLoading
                ? t("auth.loginProcessing")
                : loginBlocked
                ? t("auth.retry")
                : t("auth.login")}
            </Button>
          </Form.Item>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              {t("auth.noAccount")}
              <Link
                to="/signup"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                {t("auth.signup")}
              </Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
}
