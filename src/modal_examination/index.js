import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';

const propTypes = {};

const defaultProps = {};

export default function ModalExamination(props) {
  return (
    <Modal 
      visible={true}
      title={"Тест"}
      footer={false}
    >

    </Modal>
  );
}

ModalExamination.propTypes = propTypes;
ModalExamination.defaultProps = defaultProps;