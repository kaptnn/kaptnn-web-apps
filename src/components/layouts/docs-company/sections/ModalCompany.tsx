/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, Form, Input, InputNumber, DatePicker, message } from "antd";
import { useCompanyStore } from "@/stores/useCompanyStore";
import { useEffect } from "react";
import { createCompanySchema } from "@/utils/constants/company";
import axiosInstance from "@/utils/axios";

const CompanyModals = ({ token, refresh }: { token: string; refresh: () => void }) => {
  const [form] = Form.useForm();
  const { loading, selectedCompany, setSelectedCompany, modalType, setModalType } = useCompanyStore();

  useEffect(() => {
    if (selectedCompany) {
      form.setFieldsValue({
        ...selectedCompany,
        start_audit_period: selectedCompany.start_audit_period ? selectedCompany.start_audit_period : null,
        end_audit_period: selectedCompany.end_audit_period ? selectedCompany.end_audit_period : null,
      });
    } else {
      form.resetFields();
    }
  }, [selectedCompany, form]);

  const handleFinish = async (values: any) => {
    const payload = {
      ...values,
      start_audit_period: values.start_audit_period?.toISOString(),
      end_audit_period: values.end_audit_period?.toISOString(),
    };

    const result = createCompanySchema.safeParse(payload);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      form.setFields(
        Object.entries(errors).map(([name, msgs]) => ({
          name,
          errors: msgs || [],
        })),
      );
      return;
    }

    try {
      await axiosInstance.post("/v1/companies/", result.data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Company created");
      form.resetFields();
      refresh();
      setSelectedCompany(null);
    } catch (err) {
      message.error("Failed to create company");
      console.error(err);
    }
  };

  return (
    <Modal
      open={!!modalType}
      title={
        modalType === "create"
          ? "Tambah Perusahaan"
          : modalType === "edit"
            ? "Edit Perusahaan"
            : modalType === "view"
              ? "Detail Perusahaan"
              : modalType === "delete"
                ? "Hapus Perusahaan"
                : ""
      }
      centered
      onCancel={() => {
        setModalType(null);
        setSelectedCompany(null);
      }}
      onOk={() => {
        if (modalType === "delete") {
          alert("handle delete");
        } else {
          form.submit();
        }
      }}
      okButtonProps={{
        danger: modalType === "delete",
        loading,
      }}
    >
      {modalType === "view" && selectedCompany && (
        <div>
          <p>
            <strong>Nama:</strong> {selectedCompany.company_name}
          </p>
          <p>
            <strong>Tahun Penugasan:</strong> {selectedCompany.year_of_assignment}
          </p>
          <p>
            <strong>Awal Audit:</strong> {selectedCompany.start_audit_period}
          </p>
          <p>
            <strong>Akhir Audit:</strong> {selectedCompany.end_audit_period}
          </p>
        </div>
      )}

      {(modalType === "create" || modalType === "edit") && (
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="company_name" label="Nama Perusahaan" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="year_of_assignment" label="Tahun Penugasan" rules={[{ required: true }]}>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <div className="grid grid-cols-2 gap-6">
            <Form.Item name="start_audit_period" label="Awal Periode Audit" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="end_audit_period" label="Akhir Periode Audit" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </div>
        </Form>
      )}

      {modalType === "delete" && selectedCompany && (
        <p>
          Are you sure you want to delete <strong>{selectedCompany.company_name}</strong>?
        </p>
      )}
    </Modal>
  );
};

export default CompanyModals;
