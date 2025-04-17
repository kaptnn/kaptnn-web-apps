/* eslint-disable @typescript-eslint/no-unused-vars */
import { Modal, Form, Input, InputNumber, DatePicker } from "antd";
import { useAllUsersStore } from "@/stores/useAllUsersStore";

const AllUsersModals = ({
  token,
  refresh,
}: {
  token: string;
  refresh: () => void;
}) => {
  const [form] = Form.useForm();
  const {
    loading,
    selectedCompany,
    setSelectedCompany,
    modalType,
    setModalType,
  } = useAllUsersStore();

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
    ></Modal>
  );
};

export default AllUsersModals;
