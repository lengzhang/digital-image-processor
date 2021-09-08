import { useAppSelector } from "src/redux/store";

const useApp = () => {
  const { status, items } = useAppSelector((state) => state.imageItems);

  return {
    status,
    items,
  };
};

export default useApp;
