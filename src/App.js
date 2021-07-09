import React, { useEffect, useState } from 'react';
import { Modal, Button, message } from 'antd';
import "antd/dist/antd.css";
import ModalExamination from './modal_examination';
import { EventBus } from './utils/EventBus';
import axios from 'axios';
import sha1 from 'sha1';
import moment from 'moment';
import Attempts from './utils/Attempts/index';

 
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
      }, 2000);
    });
    EventBus.$on('TestSuccess', (params) => {
      const secret = sha1(moment().format('DD.MM.Y-:') + sold);
      server.get(`?key=${secret}`);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    });
    EventBus.$on('TestError', ([rate, bool]) => {
       if (!bool) {
        const data = Attempts.get();
        const counter = (data && data.counter) ? data.counter : 0;
        counter <= 3 && Attempts.update({counter: counter+1, date: moment()});
       }
    });
    window.getTestValidationModal = showModal;
  }, [null]);

  const showModal = () => {
    const data = Attempts.get();
    if (data && data.date) {
      moment(data.date).diff(moment(), 'day') >= 1 && Attempts.clear();
    }
 
    !Attempts.isObsolete() ? setIsModalVisible(true) : message.error('Попытки исчерпаны! \nПопробуйте пройти тест завтра', 5);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return <ModalExamination visible={isModalVisible} onClose={handleCancel} /> ; 
};



export default App;