import { useQueryStates } from "nuqs";
import { params } from "../server/params";

const useCredentialsParams = () => {
  return useQueryStates(params);
};
export default useCredentialsParams;
