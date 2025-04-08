"use client";

import React, { useState } from "react";
import DashboardLayouts from "../../DashboardLayouts";
import { Card, Col, Empty, Flex, Row, Typography } from "antd";
import DepreciationCalculatorForm from "../form/Form";

const { Title, Text } = Typography;

const DepreciationCalculator = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [calculationResult, setCalculationResult] = useState<any>(null);

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
          <DepreciationCalculatorForm
            setCalculationResult={setCalculationResult}
          />
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
            {calculationResult ? (
              <Flex vertical>
                <Text strong>Metode:</Text>
                <Text> {calculationResult.metode}</Text>

                <Text strong>Biaya Per Bulan:</Text>
                <Text> {calculationResult.biaya_per_bulan} </Text>

                <Text strong>Biaya Per Tahun:</Text>
                <Text> {calculationResult.biaya_per_tahun} Tahun</Text>
              </Flex>
            ) : (
              <Empty
                description="Belum Ada Hasil Perhitungan"
                style={{ marginTop: 32 }}
              />
            )}
          </Card>
        </Col>
      </Row>
    </DashboardLayouts>
  );
};

export default DepreciationCalculator;
