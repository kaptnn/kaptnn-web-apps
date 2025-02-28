"use client"

import React from "react";
import DashboardLayouts from "../../DashboardLayouts";
import { Card, Col, Row, Typography } from "antd";

const { Title } = Typography;

const PresentValueCalculator = () => {
  return (
    <DashboardLayouts>
      <Row gutter={[24, 24]}>
        <Col span={12}>
          <Card className="min-h-screen" style={{ backgroundColor: "#252525" }}>
            <Title style={{ color: "#FFFFFF" }}>Calculator Side</Title>
          </Card>
        </Col>
        <Col span={12}>
          <Card className="min-h-screen" style={{ backgroundColor: "#252525" }}>
            <Title style={{ color: "#FFFFFF" }}>Result Side</Title>
          </Card>
        </Col>
      </Row>
    </DashboardLayouts>
  );
};

export default PresentValueCalculator;
