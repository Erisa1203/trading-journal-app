import { useState, useEffect } from 'react';

const useSettingModal = (user, isFirstLogin, initialState = false) => {
  const [isSettingModalVisible, setIsSettingModalVisible] = useState(initialState);

  const toggleSettingModal = () => {
    setIsSettingModalVisible(prevVisible => !prevVisible);
  };

  useEffect(() => {
    if (user && isFirstLogin === true) {
      toggleSettingModal();
    }
  }, [user, isFirstLogin]);

  return {
    isSettingModalVisible,
    toggleSettingModal,
    setIsSettingModalVisible
  };
};

export default useSettingModal;
