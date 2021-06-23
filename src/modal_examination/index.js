import React, { Component, useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import SVGSuccess from '../source/svg/SVGSuccess.svg'
import SVGInfo from '../source/svg/SVGInfo.svg'
import SVGError from '../source/svg/SVGError.svg'
import styled from 'styled-components';
import { Button } from 'antd/lib/radio';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { Checkbox } from 'antd';
import { array_questions } from './questions';
import { render } from 'react-dom/cjs/react-dom.development';
import moment from 'moment';
import { EventBus } from '../utils/EventBus';

const MainContext = React.createContext();

const propTypes = {};

const defaultProps = {};

const iconStyle = {width: '40%'}

const Wrap = styled.div`
  display: flex;
  justyfy-conntent: center;
  flex-direction: column;
  align-items: center;
 
`;

const QestionsWrap = styled.div`
  display: flex;
  justify-content: space-around;
  height: 100%;
  flex-direction: column;
  align-items: flex-start;
`;

const QestionsTitle = styled.h3`
  text-align: center;
  margin: 10px 0 10px 0;
  width: 100%;
`;

const Text = styled.p`
  margin-top: 5%;
  text-align: center;
`;

function getRandomItems(array, total = 2) {
  const current = {};

  function getRnadomUniqueIndex() {
    const randomIndex = Math.floor(Math.random() * array.length);
    if (!current[randomIndex]) {
      return randomIndex
    } else {
      return getRnadomUniqueIndex();
    }
  }
  for (let i = 0; i <= total; i++) {
    const randomIndex = getRnadomUniqueIndex();
    const element = array[randomIndex];
    current[randomIndex] = element;
  }

  return Object.values(current);

}

const Qestions = ({ data = [], onChnage = new Function() }) => {
  const [value, setValue] = useState(null);

  useEffect(() => {
    onChnage(value)
  }, [value]);


  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'start',
      marginTop: 10,
      marginBottom: 10,
    }}>
      {data.map((name) =>
      (
        <Checkbox style={{ marginLeft: 0, textAlign: 'start' }} checked={name === value} onClick={() => setValue(name.trim())}>{name.trim()}</Checkbox>
      ))
      }
    </div>
  )
}


const TestBlock = ({ title, answers, correctAnswer, last  }) => {

  const [answer, setAnswer] = useState("");
  const { examinationSettings, page, setExaminationSettings } = useContext(MainContext);
  const [answerRate, setAnswerRate] = useState({ rate: 0 });

  const { nextSlide, prevSlide, getResult } = useContext(MainContext);

  useEffect(() => {
    const rate = answer === correctAnswer;
    setAnswerRate({ rate: +rate });
  }, [answer]);

  useEffect(() => {
    const update = { answers: { ...examinationSettings.answers, ...{ [title]: answerRate.rate } } }
    setExaminationSettings({ ...examinationSettings, ...update })
  }, [answerRate])

  useEffect(() => {
    console.log('examinationSettings', examinationSettings.answers)
  }, [examinationSettings])



  return (
    <QestionsWrap>
      <QestionsTitle>{title}</QestionsTitle>
      <Qestions data={answers} onChnage={setAnswer} />
      <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
        {page !== 0 ? <Button onClick={() => prevSlide()}>Назад</Button> : <div></div>}
        <Button onClick={() => last ? getResult() : nextSlide()}>Далее</Button>
      </div>
    </QestionsWrap>
  )
};


const getResultSlide = () => {
  return (
    <div>
      hi
    </div>
  )
}

const timerController = () => {
  let date = moment('01 / 01 / 1970 00:00', 'DD / MM / Y mm:ss');

  const main = {
    interval: null,
    current: null,
    start: function (callBack) {
     return new Promise(res => {
      this.current = date.add(1,'m');
      this.interval = setInterval(() => {
        const current = this.current;
        if (current.format('mm:ss') !== '00:00') {
          current.subtract(1, 'second');
          callBack(current.format('mm:ss'))
        } else {
          clearInterval(this.interval);
          res();
        }
      },1000)
     })
    }, 
    stop: function () {
      clearInterval(this.interval)
      date = moment('01 / 01 / 1970 00:00', 'DD / MM / Y mm:ss');
    },
  }
  return main;
}

const SuccessBlock = () => {
  return (
    <Wrap>
       <img src={SVGSuccess} style={iconStyle} />
       <Text>Спасибо. Вы подтвердили статус медицинского работника.</Text>
    </Wrap>
  )
};
const ErrorBlock = () => {
  const {startTest} = useContext(MainContext);
  return (
    <Wrap>
      <img src={SVGError} style={iconStyle} />
      <Text>При прохождении теста Вы допустили ошибки. Пожалуйста <a onClick={() => startTest()}>пройдите тест повторно</a></Text>
    </Wrap>
  )
}
export default function ModalExamination(props) {

  const total = 3;
  const caruselRef = useRef();
  const [page, setPage] = useState(0);
  const [testIsRun, setTestIsRun] = useState(false);
  const [testIsEnd, setTestIsEnd] = useState(false);
  const [timer, setTimer] = useState({current: null, time: timerController()});
  const [sliders, setSliders] = useState([Info]);
  const [examinationSettings, setExaminationSettings] = useState({ answers: {} });

  const nextSlide = (index) => {
    if (!index) {
      const nextPage = page + 1;
      caruselRef.current.moveTo(nextPage);
    } else {
      caruselRef.current.moveTo(index);
    }
  }

  useEffect(() => {
    if (page !== 0) nextSlide();
  }, [sliders])

  const prevSlide = () => {
    if (page !== 0) {
      const nextPage = page - 1;
      caruselRef.current.moveTo(nextPage);
    }
  }

  const getResult = () => {
    const rates = Object.values(examinationSettings.answers);
    const endRate = rates.reduce((a, b) => a + b);
 
    if (endRate === total) {
      setSliders([SuccessBlock])
      EventBus.$emit("TestSuccess", [endRate, endRate === total]);
    } else {
      setSliders([ErrorBlock])
      EventBus.$emit("TestError", [endRate, endRate === total]);
    }
    timer.time
      .stop();
    EventBus.$emit("TestFinish", [endRate, endRate === total]);
    setTimer({...timer, ...{current: null}});
    setExaminationSettings({answers: []});
    return endRate === total;
  }




  const startTest = () => {
    const items = [];
    const arr =  getRandomItems(array_questions) 
    for (let i = 0; i < total; i++) {
      const props = arr[i];
      const isLast = i === total-1;
      items.push(() => <TestBlock {...props} last={isLast} />)
    }

    setPage(0);
    timer.time
      .start((time) => {
        setTimer({...timer, ...{current: time}})
        EventBus.$emit("tick", [time]);
      })
      .then(() => {
        setSliders([ErrorBlock])
        setTimer({...timer, ...{current: null}})
        EventBus.$emit("timesUp");
      })
    setSliders(items)
    EventBus.$emit("StartTest");
  }

  const store = {
    nextSlide,
    prevSlide,
    examinationSettings,
    setExaminationSettings,
    caruselRef,
    setPage,
    testIsRun,
    timer,
    testIsEnd,
    getResult,
    setTestIsRun,
    setTestIsEnd,
    setTimer,
    sliders,
    page,
    setSliders,
    startTest
  }

  return (
    <MainContext.Provider value={store}>
      <Modal
        onCancel={() => {
          getResult();
          props.onClose && props.onClose();
        }}
        visible={props.visible && props.visible}
        title={timer.current ? `Тест осталось ${timer.current && timer.current}` : 'Тест'}
        footer={false}
      >
        <Slider />
      </Modal>
    </MainContext.Provider>
  );
}



const Slider = () => {

  const { nextSlide, caruselRef, setPage, sliders } = useContext(MainContext);

  return (
    <Carousel
      autoPlay={false}
      // swipeable={false}
      ref={caruselRef}
      showThumbs={false}
      showArrows={false}
      autoFocus={false}
      showStatus={false}
      showIndicators={false}
      onChange={setPage}
    >
      {sliders.map(Component => <Component />)}
    </Carousel>
  )
}

const Info = () => {
  const { nextSlide, startTest } = useContext(MainContext);
  return (
    <Wrap>
      <img src={SVGInfo} style={iconStyle} />
      <Text>
        На прохождение теста вам будет дана одна минута. Время начнет идти после того как
        нажмете кнопку “Далее”. <br /> Вы можете выйти из теста, но тогда попытка будет считаться
        проваленной. <br /> У вас есть 3 попытки.
      </Text>
      <Button type="primary" onClick={() => {
        startTest();
      }}>Далее</Button>
    </Wrap>
  )
}


ModalExamination.propTypes = propTypes;
ModalExamination.defaultProps = defaultProps;
