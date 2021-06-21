import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import "antd/dist/antd.css";
import ModalExamination from './modal_examination';
const App = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <h3>Вы не подтвердили свой статус врача</h3>
        <p>Чтобы подтверидть его нужно пройти <a onClick={() => showModal()}>тест</a></p>
      </div>
      <ModalExamination/>
    </>
  );
};



export default App;