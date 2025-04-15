"use client";

import { Card, Col, Row, Statistic } from "antd";
import DashboardLayouts from "../../DashboardLayouts";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";

const Dashboard = () => {
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
              title="Presentase Pemenuhan Dokumen"
              value={60}
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
              title="Dokumen Terpenuhi"
              value={60}
              valueStyle={{ color: "#3f8600" }}
              prefix={<ArrowUpOutlined />}
              suffix=" Dokumen"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card variant="borderless" className="border">
            <Statistic
              title="Dokumen Belum Terpenuhi"
              value={40}
              valueStyle={{ color: "#cf1322" }}
              prefix={<ArrowDownOutlined />}
              suffix=" Dokumen"
            />
          </Card>
        </Col>
      </Row>
    </DashboardLayouts>
  );
};

export default Dashboard;
