// CustomHook.js
import { useState } from 'react';

const useContent = () => {
  const [data, setData] = useState(null);

  const setDataFromChild = (childData) => {
    setData(childData);
  };

  return { data, setDataFromChild };
};

export default useContent;
