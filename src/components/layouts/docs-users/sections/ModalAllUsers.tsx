/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, Form, Input, DatePicker, message } from "antd";
import { useAllUsersStore } from "@/stores/useAllUsersStore";
import { memo, useCallback, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useCompanyStore } from "@/stores/useCompanyStore";
import { AuthApi, CompanyApi, UserApi } from "@/utils/axios/api-service";
import dayjs from "dayjs";

interface ModalComponentProps {
  token: string;
}

const AllUsersModals: React.FC<ModalComponentProps> = ({ token }) => {
  const { selectedItem, modalType, closeModal } = useAllUsersStore();
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
      form.setFieldsValue({ ...selectedItem });
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
        const payload = { ...values, due_date: dayjs(values.due_date) };

        if (modalType === "create") {
          await AuthApi.registerUser(payload, token);
        } else if (modalType === "edit" && selectedItem) {
          // NEED TO BE FIXED
          await UserApi.getAllUsers(
            {
              company_id: selectedItem.id,
            },
            token,
          );
          // NEED TO BE FIXED
        } else if (modalType === "delete" && selectedItem) {
          await UserApi.getAllUsers(
            {
              company_id: selectedItem.id,
            },
            token,
          );
        } else if (modalType === "verify" && selectedItem) {
          await UserApi.updateUserById(
            selectedItem.id,
            {
              role: selectedItem.profile.role,
              membership_status: selectedItem.profile.membership_status,
              is_verified: true,
            },
            token,
          );
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
          create: "Buat Pengguna Baru",
          view: "Detail Data Pengguna",
          edit: "Edit Data Pengguna",
          delete: "Hapus Data Pengguna",
          verify: "Verifikasi Data Pengguna",
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
            <Form.Item name="request_title" label="Judul" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="request_desc" label="Deskripsi">
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item name="due_date" label="Due Date">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </>
        )}
        {modalType === "view" && selectedItem && <></>}
        {modalType === "delete" && selectedItem && (
          <p>
            Apakah Anda yakin ingin menghapus permintaan{" "}
            <strong>{selectedItem.name}</strong>?
          </p>
        )}
        {modalType === "verify" && selectedItem && (
          <p>
            Apakah Anda yakin ingin memverifikasi data pengguna{" "}
            <strong>{selectedItem.name}</strong>?
          </p>
        )}
      </Form>
    </Modal>
  );
};

export default memo(AllUsersModals);
