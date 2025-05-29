import React from "react";
import { Table, Button, Space, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { GlobalOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Title } = Typography;

const LanguageExample = () => {
  const { t, i18n } = useTranslation();
  const currentDate = new Date();
  const numberExample = 1234567.89;
  const currencyExample = 1000000;

  // 언어 변경 핸들러
  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  // 테이블 컬럼 정의
  const columns = [
    {
      title: t("common.category"),
      dataIndex: "category",
      key: "category",
      width: "20%",
    },
    {
      title: t("common.example"),
      dataIndex: "example",
      key: "example",
      width: "80%",
    },
  ];

  // 테이블 데이터
  const data = [
    {
      key: "1",
      category: t("examples.menu"),
      example: (
        <ul>
          <li>{t("menu.home")}</li>
          <li>{t("menu.dashboard")}</li>
          <li>{t("menu.users")}</li>
          <li>{t("menu.settings")}</li>
        </ul>
      ),
    },
    {
      key: "2",
      category: t("examples.buttons"),
      example: (
        <Space>
          <Button type="primary">{t("common.save")}</Button>
          <Button>{t("common.cancel")}</Button>
          <Button danger>{t("common.delete")}</Button>
        </Space>
      ),
    },
    {
      key: "3",
      category: t("examples.auth"),
      example: (
        <ul>
          <li>{t("auth.username")}: admin</li>
          <li>{t("auth.email")}: admin@example.com</li>
          <li>{t("auth.forgotPassword")}</li>
        </ul>
      ),
    },
    {
      key: "4",
      category: t("examples.validation"),
      example: (
        <ul>
          <li>{t("validation.required")}</li>
          <li>{t("validation.invalidEmail")}</li>
          <li>{t("validation.minLength", { min: 6 })}</li>
          <li>{t("validation.maxLength", { max: 20 })}</li>
        </ul>
      ),
    },
    {
      key: "5",
      category: t("examples.dates"),
      example: (
        <ul>
          <li>
            {t("date", {
              val: currentDate,
              formatParams: { val: { format: "short" } },
            })}
          </li>
          <li>
            {t("date", {
              val: currentDate,
              formatParams: { val: { format: "long" } },
            })}
          </li>
          <li>
            {t("date", {
              val: currentDate,
              formatParams: { val: { format: "relative" } },
            })}
          </li>
          <li>
            {t("date", {
              val: currentDate,
              formatParams: { val: { format: "ago" } },
            })}
          </li>
        </ul>
      ),
    },
    {
      key: "6",
      category: t("examples.numbers"),
      example: (
        <ul>
          <li>
            {t("number", {
              val: numberExample,
              formatParams: { val: { format: "number" } },
            })}
          </li>
          <li>
            {t("currency", {
              val: currencyExample,
              formatParams: { val: { format: "currency" } },
            })}
          </li>
        </ul>
      ),
    },
    {
      key: "7",
      category: t("examples.notifications"),
      example: (
        <ul>
          <li>{t("notifications.success")}</li>
          <li>{t("notifications.error")}</li>
          <li>{t("notifications.saveSuccess")}</li>
          <li>{t("notifications.updateSuccess")}</li>
        </ul>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Space>
          <Title level={2}>
            <GlobalOutlined /> {t("examples.title")}
          </Title>
        </Space>

        <Space>
          <Button
            type={i18n.language === "ko" ? "primary" : "default"}
            onClick={() => handleLanguageChange("ko")}
          >
            🇰🇷 {t("language.ko")}
          </Button>
          <Button
            type={i18n.language === "en" ? "primary" : "default"}
            onClick={() => handleLanguageChange("en")}
          >
            🇺🇸 {t("language.en")}
          </Button>
          <Button
            type={i18n.language === "zh" ? "primary" : "default"}
            onClick={() => handleLanguageChange("zh")}
          >
            🇨🇳 {t("language.zh")}
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          bordered
          style={{ marginTop: "20px" }}
        />
      </Space>
    </div>
  );
};

export default LanguageExample;
