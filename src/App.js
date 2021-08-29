import './App.css';
import { useEffect, useState } from 'react';
import { Input, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import RobotIcon from './assets/robot-icon.jpg';
import uniqid from 'uniqid';
import { animateScroll as scroll } from 'react-scroll';
import axios from 'axios'

const API_URL = 'http://4085-2804-14d-1289-a118-ec9e-1386-41fa-2101.ngrok.io/'
function App() {
  const [questions, setQuestions] = useState([
    'Você deseja que o seu celular seja à prova d\'água?\n1 - Sim\n0 - Não\n',
    'Qual o nível de qualidade que você deseja em sua câmera?\n0 - Bom\n1 - Médio\n2 - Não importa\n',
    'O que você espera de desempenho no seu celular?\n0 - Bom\n1 - Médio\n2 - Não importa\n',
    'Você deseja que o seu aparelho tenha tecnologia 5G?\n1 - Sim\n0 - Não\n',
    'Quanto de memória RAM você quer que o seu celular tenha?',
    'Quanto de armazenamento você quer que o seu celular tenha?',
    'Qual o tamanho da tela que você deseja que o seu celular tenha? (polegadas)',
    'Você quer que o seu celular tenha sensor de digital?\n1 - Sim\n0 - Não\n',
    'Quanto de bateria você deseja que o seu celular tenha?',
  ])

  const [end, setEnd] = useState(false)

  // const delay = async (time) => {
  //   await new Promise(resolve => setTimeout(resolve, time));
  // }

  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([{
    message: 'Qual é o preço máximo que você quer pagar no celular?',
    class: 'robot',
  }])

  const [inputMessage, setInputMessage] = useState('')
  const [data, setData] = useState([])
  const [resData, setResData] = useState(null)

  useEffect(() => {
    scroll.scrollToBottom({
      containerId: "scroll",
      duration: 200
    });
  })

  useEffect(() => {
    if (resData) {
      setMessages((oldarray) => [...oldarray, { message: resData, class: 'robot' }])
      setResData(null)
    }
  }, [messages, resData])

  useEffect(() => {
    if (end) {
      const answerForm = async () => {
        setLoading(true)
        const { data: responseData } = await axios({
          url: `${API_URL}`,
          method: 'POST',
          data: {
            data,
          },
          headers: { "Access-Control-Allow-Origin": "*" }
        })
        setLoading(false)
        setResData(responseData)
      }
      answerForm()
    }
  }, [data, end])


  const handleSubmit = async () => {
    if (!questions.length) {
      setEnd(true)
    }

    if (inputMessage !== '') {
      const question = questions.shift()
      setQuestions(questions)
      setData(oldarray => [...oldarray, inputMessage])
      setMessages(oldarray => [...oldarray, {
        message: inputMessage,
        class: 'person'
      }])

      if (question !== undefined) {
        setMessages(oldarray => [...oldarray, {
          message: question,
          class: 'robot'
        }])
      }
      setLoading(true)
      setInputMessage('')
      setLoading(false)
    }
  }

  return (
    <div className="background">
      <div className="chat-area">
        <div className="header-area">
          <div className="robot-area">
            <img src={RobotIcon} alt="#" style={{ width: '60px' }} />
            <div style={{ marginLeft: '10px', fontSize: '18px' }}>
              Sérgio
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="online-circle" />
                <p style={{ fontSize: '12px', margin: 0, marginLeft: '5px' }}>Online</p>
              </div>
            </div>
          </div>
          <Button onClick={() => document.location.reload()}>Resetar</Button>
        </div>

        <div className="message-area" id="scroll">
          <div style={{ display: 'flex', width: '100%', justifyContent: 'start' }}>
            <div className="robot-message">
              Olá, meu nome é Sérgio, o robô que te ajuda a comprar o celular
              que atende a sua necessidade!
            </div>
          </div>
          {messages.map((item) => (
            <div
              key={uniqid.time()}
              style={
                {
                  display: 'flex',
                  width: '100%',
                  justifyContent: item.class === 'robot' ? 'start' : 'flex-end',
                  marginTop: '10px'
                }}
            >
              <div className={`${item.class}-message`}>
                {item.message}
              </div>
            </div>
          ))}

          {loading &&
            (
              <div style={{ display: 'flex', width: '100%', justifyContent: 'start', }}>
                <div className="loading-message">
                  <div className="dot" />
                  <div className="dot" />
                  <div className="dot" />
                </div>
              </div>
            )}

        </div>

        <div className="input-area">
          <Input
            placeholder="Digite a sua mensagem..."
            bordered={false}
            onPressEnter={handleSubmit}
            onChange={(e) => setInputMessage(e.target.value)}
            value={inputMessage}
            disabled={end}
          />
          <div className="send-button" onClick={handleSubmit}>
            <SendOutlined style={{ fontSize: '25px', color: '#004d99' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
