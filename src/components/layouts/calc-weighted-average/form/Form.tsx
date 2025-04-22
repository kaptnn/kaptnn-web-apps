"use client";

import { useState } from "react";
import { Button, Form, Input, Select } from "antd";
import { Controller, useForm } from "react-hook-form";

type FormValues = {
  numRows: number;
  weights: number[];
  lossRates: number[];
  goal?: number;
  calculationType: "weighted_average" | "goal_seeking";
};

const WeightedAverageCalculatorForm = () => {
  const { control, handleSubmit, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      calculationType: "weighted_average",
      numRows: 0,
      weights: [],
      lossRates: [],
      goal: undefined,
    },
  });

  const [numRows, setNumRows] = useState(0);
  const calculationType = watch("calculationType");

  const onSubmit = (data: FormValues) => {
    console.log("Form Submitted:", data);
  };

  return (
    <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
      <Form.Item label="Select Calculation Type:">
        <Controller
          name="calculationType"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              onChange={(value) => {
                field.onChange(value);
                setNumRows(0);
                setValue("numRows", 0);
                setValue("weights", []);
                setValue("lossRates", []);
                setValue("goal", undefined);
              }}
              options={[
                {
                  value: "weighted_average",
                  label: "Weighted Average Calculator",
                },
                {
                  value: "goal_seeking",
                  label: "Goal Seeking Weighted Average",
                },
              ]}
            />
          )}
        />
      </Form.Item>

      <Form.Item label="Enter the number of rows:">
        <Controller
          name="numRows"
          control={control}
          rules={{ required: "Number of rows is required" }}
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              placeholder="Enter number of rows"
              value={field.value}
              onChange={(e) => {
                const value = Math.max(0, parseInt(e.target.value, 10) || 0);
                setNumRows(value);
                field.onChange(value);
                setValue("weights", Array(value).fill(0));
                setValue("lossRates", Array(value).fill(0));
              }}
            />
          )}
        />
      </Form.Item>

      {numRows > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "12px",
          }}
        >
          {calculationType === "weighted_average" &&
            Array.from({ length: numRows }).map((_, i) => (
              <Form.Item key={`lossRates-${i}`}>
                <Controller
                  name={`lossRates.${i}`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      placeholder={`Loss Rate ${i + 1}`}
                    />
                  )}
                />
              </Form.Item>
            ))}

          {Array.from({ length: numRows }).map((_, i) => (
            <Form.Item key={`weights-${i}`}>
              <Controller
                name={`weights.${i}`}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    placeholder={`Weight ${i + 1}`}
                  />
                )}
              />
            </Form.Item>
          ))}
        </div>
      )}

      {calculationType === "goal_seeking" && (
        <Form.Item label="Enter Target Weighted Average Goal:">
          <Controller
            name="goal"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                placeholder="Enter target goal"
              />
            )}
          />
        </Form.Item>
      )}

      <Form.Item>
        <Button type="primary" htmlType="submit" className="w-full">
          {calculationType === "goal_seeking" ? "Hitung Goal Seeking" : "Hitung Weighted Average"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default WeightedAverageCalculatorForm;
