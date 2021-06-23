import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'antd';
import "antd/dist/antd.css";
import ModalExamination from './modal_examination';
import { EventBus } from './utils/EventBus';
import axios from 'axios';
import sha1 from 'sha1';
import moment from 'moment';

const server = axios.create({baseURL: window.location.href});
const sold = "9ee0141942394145887628b0cd88e9ee";

const App = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    EventBus.$on('TestSuccess', (params) => {
      const secret = sha1(moment().format('DD.MM.Y-:') + sold);
      server.get(`?key=${secret}`);
      setTimeout(() => {
        window.location.reload();
      }, 2000)
    });

  }, [null])

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
      <ModalExamination visible={isModalVisible} onClose={handleCancel} />
    </>
  );
};



export default App;