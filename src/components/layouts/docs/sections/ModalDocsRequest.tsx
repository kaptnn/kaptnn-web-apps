/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Select,
  UploadProps,
  Upload,
} from "antd";
import { useDocsRequestStore } from "@/stores/useDocsRequestStore";
import { memo, useCallback, useEffect, useMemo, useTransition } from "react";
import {
  CompanyApi,
  DocsCategoryApi,
  DocsManagerApi,
  DocsRequestApi,
  UserApi,
} from "@/utils/axios/api-service";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { useDocsCategoryStore } from "@/stores/useDocsCategory";
import { useAllUsersStore } from "@/stores/useAllUsersStore";
import { useCompanyStore } from "@/stores/useCompanyStore";
import { InboxOutlined } from "@ant-design/icons";

interface ModalComponentProps {
  token: string;
}

const props: UploadProps = {
  name: "file",
  multiple: true,
  action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
  onChange(info) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};

const DocsRequestModals: React.FC<ModalComponentProps> = ({ token }) => {
  const { selectedItem, modalType, closeModal } = useDocsRequestStore();
  const [form] = Form.useForm();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    data: compData,
    setData: setCompData,
    setTotal: setCompTotal,
    setLoading: setCompLoading,
  } = useCompanyStore();

  const {
    data: usersData,
    setData: setUsersData,
    setTotal: setUsersTotal,
    setLoading: setUsersLoading,
  } = useAllUsersStore();

  const {
    data: docCatData,
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
        } else if (modalType === "upload_request" && selectedItem) {
          const uploadReq = await DocsManagerApi.createDocsManager(
            selectedItem.id,
            token,
          );
          if (uploadReq) {
            await DocsRequestApi.updateDocsRequest(selectedItem.id, token);
          }
        } else if (modalType === "edit_request" && selectedItem) {
          const editReq = await DocsManagerApi.updateDocsManager(
            selectedItem.id,
            token,
          );
          if (editReq) {
            await DocsRequestApi.updateDocsRequest(selectedItem.id, token);
          }
        } else if (modalType === "delete_request" && selectedItem) {
          const deleteReq = await DocsManagerApi.deleteDocsManager(
            selectedItem.id,
            token,
          );
          if (deleteReq) {
            await DocsRequestApi.updateDocsRequest(selectedItem.id, token);
          }
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
          upload_request: "Upload Permintaan Dokumen",
          edit_request: "Edit Informasi Dokumen Anda",
          delete_request: "Hapus Dokumen Anda",
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

        {modalType === "upload_request" && selectedItem && (
          <Form>
            <Upload.Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibited from uploading
                company data or other banned files.
              </p>
            </Upload.Dragger>
          </Form>
        )}

        {modalType === "edit_request" && selectedItem && <></>}

        {modalType === "delete_request" && selectedItem && <></>}
      </Form>
    </Modal>
  );
};

export default memo(DocsRequestModals);
