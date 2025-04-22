import axiosInstance from ".";
import CompanyService from "./company";
import UserService from "./user";
import DocsRequestService from "./docs/request";
import DocsCategoryService from "./docs/category";
import DocsManagerService from "./docs/manager";
import CalculatorService from "./calculator/";

const UserApi = new UserService(axiosInstance);
const AuthApi = new UserService(axiosInstance);
const CompanyApi = new CompanyService(axiosInstance);
const DocsRequestApi = new DocsRequestService(axiosInstance);
const DocsCategoryApi = new DocsCategoryService(axiosInstance);
const DocsManagerApi = new DocsManagerService(axiosInstance);
const CalculatorApi = new CalculatorService(axiosInstance);

export {
  UserApi,
  AuthApi,
  CompanyApi,
  DocsRequestApi,
  DocsCategoryApi,
  DocsManagerApi,
  CalculatorApi,
};
