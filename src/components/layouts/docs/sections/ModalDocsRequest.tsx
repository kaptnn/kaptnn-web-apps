/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, Form, Input, DatePicker, message, Select } from "antd";
import { useDocsRequestStore } from "@/stores/useDocsRequestStore";
import { memo, useCallback, useEffect, useMemo, useTransition } from "react";
import {
  CompanyApi,
  DocsCategoryApi,
  DocsRequestApi,
  UserApi,
} from "@/utils/axios/api-service";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { useDocsCategoryStore } from "@/stores/useDocsCategory";
import { useAllUsersStore } from "@/stores/useAllUsersStore";
import { useCompanyStore } from "@/stores/useCompanyStore";

interface ModalComponentProps {
  token: string;
}

const DocsRequestModals: React.FC<ModalComponentProps> = ({ token }) => {
  const { selectedItem, modalType, closeModal } = useDocsRequestStore();
  const [form] = Form.useForm();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    loading: compLoading,
    data: compData,
    total: compTotal,
    setData: setCompData,
    setTotal: setCompTotal,
    setLoading: setCompLoading,
  } = useCompanyStore();

  const {
    loading: usersLoading,
    data: usersData,
    total: usersTotal,
    setData: setUsersData,
    setTotal: setUsersTotal,
    setLoading: setUsersLoading,
  } = useAllUsersStore();

  const {
    loading: docCatLoading,
    data: docCatData,
    total: docCatTotal,
    setData: setDocCatData,
    setTotal: setDocCatTotal,
    setLoading: setDocCatLoading,
  } = useDocsCategoryStore();

  const fetchData = useCallback(async () => {
    setCompLoading(true);
    setUsersLoading(true);
    setDocCatLoading(true);
    try {
      const [compRes, usersRes, docCatRes] = await Promise.all([
        CompanyApi.getAllCompanies({}, token),
        UserApi.getAllUsers({}, token),
        DocsCategoryApi.getAllDocsCategory({}, token),
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

      setDocCatData(docCatRes.result);
      setDocCatTotal(docCatRes.meta.totalItems);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      message.error("Failed to fetch dashboard data.");
    } finally {
      setCompLoading(false);
      setUsersLoading(false);
      setDocCatLoading(false);
    }
  }, [
    token,
    setCompLoading,
    setUsersLoading,
    setDocCatLoading,
    setCompData,
    setCompTotal,
    setUsersData,
    setUsersTotal,
    setDocCatData,
    setDocCatTotal,
  ]);

  useEffect(() => {
    fetchData();
    if ((modalType === "edit" || modalType === "view") && selectedItem) {
      form.setFieldsValue({
        ...selectedItem,
        due_date: selectedItem.due_date ? dayjs(selectedItem.due_date) : null,
      });
    } else {
      form.resetFields();
    }
  }, [modalType, selectedItem, form, fetchData]);

  const selectedCompanyId = Form.useWatch("company_id", form);
  const filteredUsers = selectedCompanyId
    ? usersData.filter((u: any) => u.company_id === selectedCompanyId)
    : usersData;

  const companyOptions = useMemo(
    () => compData.map((c) => ({ value: c.id, label: c.company_name })),
    [compData],
  );
  const userOptions = useMemo(
    () => filteredUsers.map((u) => ({ value: u.id, label: u.name })),
    [filteredUsers],
  );
  const categoryOptions = useMemo(
    () => docCatData.map((cat) => ({ value: cat.id, label: cat.name })),
    [docCatData],
  );

  const handleFinish = useCallback(async () => {
    startTransition(async () => {
      try {
        if (modalType === "view") {
          closeModal();
          return;
        }

        const values = form.getFieldsValue();
        const payload = { ...values, due_date: dayjs(values.due_date) };

        if (modalType === "create") {
          await DocsRequestApi.createDocsRequest(payload, token);
        } else if (modalType === "edit" && selectedItem) {
          await DocsRequestApi.updateDocsRequest(selectedItem.id, payload, token);
        } else if (modalType === "delete" && selectedItem) {
          await DocsRequestApi.deleteDocsRequest(selectedItem.id, token);
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
      okText={isPending ? "Tunggu Sebentar" : "OK"}
      cancelText="Batal"
      forceRender
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} scrollToFirstError>
        {(modalType === "create" || modalType === "edit") && (
          <>
            <Form.Item name="request_title" label="Judul" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="request_desc" label="Deskripsi">
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item name="company_id" label="Perusahaan">
              <Select placeholder="Pilih Perusahaan" options={companyOptions} />
            </Form.Item>
            <Form.Item name="target_user_id" label="Target Pengguna">
              <Select placeholder="Pilih Target Pengguna" options={userOptions} />
            </Form.Item>
            <Form.Item name="category_id" label="Kategori">
              <Select placeholder="Pilih Kategori Dokumen" options={categoryOptions} />
            </Form.Item>
            <Form.Item name="due_date" label="Due Date">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </>
        )}
        {modalType === "view" && selectedItem && (
          <>
            <p>
              <strong>Judul:</strong> {selectedItem.request_title}
            </p>
            <p>
              <strong>Deskripsi:</strong> {selectedItem.request_desc}
            </p>
            <p>
              <strong>Target Pengguna:</strong> {selectedItem.target_user_id}
            </p>
            <p>
              <strong>Due Date:</strong> {selectedItem.due_date}
            </p>
            <p>
              <strong>Status:</strong> {selectedItem.status}
            </p>
          </>
        )}
        {modalType === "delete" && selectedItem && (
          <p>
            Apakah Anda yakin ingin menghapus permintaan{" "}
            <strong>{selectedItem.request_title}</strong>?
          </p>
        )}
      </Form>
    </Modal>
  );
};

export default memo(DocsRequestModals);
