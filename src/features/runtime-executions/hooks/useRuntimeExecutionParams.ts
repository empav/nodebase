import { useQueryStates } from "nuqs";
import { params } from "../server/params";

const useRuntimeExecutionParams = () => {
  return useQueryStates(params);
};
export default useRuntimeExecutionParams;
