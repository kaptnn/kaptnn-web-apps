/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, Form, Input, DatePicker, message, InputNumber } from "antd";
import { useCompanyStore } from "@/stores/useCompanyStore";
import { memo, useCallback, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useAllUsersStore } from "@/stores/useAllUsersStore";
import { CompanyApi, UserApi } from "@/utils/axios/api-service";
import dayjs from "dayjs";

interface ModalComponentProps {
  token: string;
}

const CompanyModals: React.FC<ModalComponentProps> = ({ token }) => {
  const { selectedItem, modalType, closeModal } = useCompanyStore();
  const [form] = Form.useForm();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    setData: setCompData,
    setTotal: setCompTotal,
    setLoading: setCompLoading,
  } = useCompanyStore();

  const {
    setData: setUsersData,
    setTotal: setUsersTotal,
    setLoading: setUsersLoading,
  } = useAllUsersStore();

  const fetchData = useCallback(async () => {
    setCompLoading(true);
    setUsersLoading(true);
    try {
      const [compRes, usersRes] = await Promise.all([
        CompanyApi.getAllCompanies({}, token),
        UserApi.getAllUsers({}, token),
      ]);

      const formattedCompanies = compRes.result.map((c: any) => ({
        ...c,
        key: c.id,
        start_audit_period: new Date(c.start_audit_period).toISOString().split("T")[0],
        end_audit_period: new Date(c.end_audit_period).toISOString().split("T")[0],
      }));

      setCompData(formattedCompanies);
      setCompTotal(compRes.meta.totalItems);

      setUsersData(usersRes.result);
      setUsersTotal(usersRes.meta.totalItems);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      message.error("Failed to fetch dashboard data.");
    } finally {
      setCompLoading(false);
      setUsersLoading(false);
    }
  }, [
    token,
    setCompLoading,
    setUsersLoading,
    setCompData,
    setCompTotal,
    setUsersData,
    setUsersTotal,
  ]);

  useEffect(() => {
    fetchData();
    if ((modalType === "edit" || modalType === "view") && selectedItem) {
      form.setFieldsValue({
        ...selectedItem,
        start_audit_period: selectedItem.start_audit_period
          ? dayjs(selectedItem.start_audit_period)
          : null,
        end_audit_period: selectedItem.end_audit_period
          ? dayjs(selectedItem.end_audit_period)
          : null,
      });
    } else {
      form.resetFields();
    }
  }, [modalType, selectedItem, form, fetchData]);

  const handleFinish = useCallback(async () => {
    startTransition(async () => {
      try {
        if (modalType === "view") {
          closeModal();
          return;
        }

        const values = form.getFieldsValue();
        const payload = {
          ...values,
          start_audit_period: dayjs(values.start_audit_period),
          end_audit_period: dayjs(values.end_audit_period),
        };

        if (modalType === "create") {
          await CompanyApi.createCompany(payload, token);
        } else if (modalType === "edit" && selectedItem) {
          await CompanyApi.updateCompany(selectedItem.id, payload, token);
        } else if (modalType === "delete" && selectedItem) {
          await CompanyApi.deleteCompany(selectedItem.id, token);
        }

        router.refresh();
        closeModal();
      } catch (error: unknown) {
        if (error) {
          const errorMessage = error || "Something went wrong!";
          console.error("Login Error:", errorMessage);
        } else {
          console.error("Network Error:", error);
        }
      }
    });
  }, [closeModal, form, modalType, router, selectedItem, token]);

  return (
    <Modal
      open={!!modalType}
      title={
        {
          create: "Buat Permintaan Dokumen",
          view: "Detail Permintaan Dokumen",
          edit: "Edit Permintaan Dokumen",
          delete: "Hapus Permintaan Dokumen",
        }[modalType!]
      }
      centered
      onCancel={closeModal}
      onOk={handleFinish}
      okButtonProps={{ danger: modalType === "delete", loading: isPending }}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} scrollToFirstError>
        {(modalType === "create" || modalType === "edit") && (
          <>
            <Form.Item
              name="company_name"
              label="Nama Perusahaan"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="year_of_assignment" label="Tahun Penugasan">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <div className="grid grid-cols-2 gap-6">
              <Form.Item name="start_audit_period" label="Waktu Periode Mulai">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item name="end_audit_period" label="Waktu Periode Selesai">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </div>
          </>
        )}
        {modalType === "view" && selectedItem && (
          <>
            <p>
              <strong>Judul:</strong> {selectedItem.company_name}
            </p>
            <p>
              <strong>Deskripsi:</strong> {selectedItem.year_of_assignment}
            </p>
            <p>
              <strong>Target Pengguna:</strong> {selectedItem.start_audit_period}
            </p>
            <p>
              <strong>Due Date:</strong> {selectedItem.end_audit_period}
            </p>
          </>
        )}
        {modalType === "delete" && selectedItem && (
          <p>
            Apakah Anda yakin ingin menghapus permintaan{" "}
            <strong>{selectedItem.company_name}</strong>?
          </p>
        )}
      </Form>
    </Modal>
  );
};

export default memo(CompanyModals);
