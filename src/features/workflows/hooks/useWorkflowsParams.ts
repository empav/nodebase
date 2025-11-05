import { useQueryStates } from "nuqs";
import { params } from "../server/params";

const useWorkflowsParams = () => {
  return useQueryStates(params);
};
export default useWorkflowsParams;
