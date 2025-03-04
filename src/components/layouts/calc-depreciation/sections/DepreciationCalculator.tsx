"use client";

import React from "react";
import DashboardLayouts from "../../DashboardLayouts";
import { Card, Col, Empty, Row, Typography } from "antd";
import DepreciationCalculatorForm from "./Form";

const { Title } = Typography;

const DepreciationCalculator = () => {
  return (
    <DashboardLayouts>
      <Row gutter={[24, 24]}>
        <Col
          span={12}
          style={{
            paddingInline: 24,
            display: "flex",
            flexDirection: "column",
            gap: 32,
          }}
        >
          <Title level={2}>Depreciation Calculator</Title>
          <DepreciationCalculatorForm />
        </Col>
        <Col span={12}>
          <Card
            className="h-min"
            style={{
              backgroundColor: "#FCFCFC",
              display: "flex",
              flexDirection: "column",
              gap: 32,
            }}
          >
            <Title level={2}>Hasil Perhitungan</Title>
            <Empty
              description={"Belum Ada Hasil Perhitungan"}
              style={{ marginTop: 32 }}
            />
          </Card>
        </Col>
      </Row>
    </DashboardLayouts>
  );
};

export default DepreciationCalculator;
