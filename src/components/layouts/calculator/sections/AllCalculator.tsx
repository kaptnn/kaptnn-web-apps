"use client";

import DashboardLayouts from "../../DashboardLayouts";
import { Card, Col, Row, Statistic } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";

const AllCalculator = () => {
  return (
    <DashboardLayouts>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card
            variant="borderless"
            className="border h-48 object-cover"
          ></Card>
        </Col>
        <Col span={8}>
          <Card variant="borderless" className="border">
            <Statistic
              title="Active"
              value={11.28}
              precision={2}
              valueStyle={{ color: "#3f8600" }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card variant="borderless" className="border">
            <Statistic
              title="Idle"
              value={9.3}
              precision={2}
              valueStyle={{ color: "#cf1322" }}
              prefix={<ArrowDownOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card variant="borderless" className="border">
            <Statistic
              title="Idle"
              value={9.3}
              precision={2}
              valueStyle={{ color: "#cf1322" }}
              prefix={<ArrowDownOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>
    </DashboardLayouts>
  );
};

export default AllCalculator;
