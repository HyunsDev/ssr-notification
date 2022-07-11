import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios'

const Divver = styled.div`
  margin: 0 auto;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const Button = styled.button`
  background-color: #141424;
  color: #ffffff;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: 100ms;
  user-select: none;

  &:hover {
    background-color: #292941;
  }

  &:active {
    outline: solid 2px #acace2;
  }
`


const SecondaryButton = styled(Button)`
  background-color: #ffffff;
  color: #000000;
  border: solid 1px #979797;
  
  &:hover {
    background-color: #ffffff;
    border: solid 1px #2c2c2c;
  }

  &:active {
    outline: none;
    border: solid 1px #000000;
  }
`

const Label = styled.div`
  color: #888888;
  font-size: 12px;
`

const Line = styled.div`
  border-bottom: solid 1px #cccccc;
  width: 100%;
  margin: 20px 0px;
`

const Inputs = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
`

const Input = styled.input`
  padding: 4px;
  border-radius: 2px;

  transition: 200ms;
  outline: solid 1px #c5c5c5;

  &:focus {
    outline: solid 1px #000000;
  }
`

function SetNoti() {
  const [ notiStatus, setNotiStatus ] = useState('')

  const setNoti = async () => {

    // 알림 권한 요청
    const status = await Notification.requestPermission()

    // React 상태 업데이트
    setNotiStatus(status)

    console.log(`Status:`, status)
    if (status === 'denied') { alert('알림 설정이 거부되었습니디.'); return }

    // 서비스 워커 등록
    if (!navigator.serviceWorker) alert('serviceWorker를 지원하지 않습니다.')
    
    const worker = await navigator.serviceWorker.register('/service-worker.js')
    const subscribeOptions = {
      userVisibleOnly: true,
      applicationServerKey: process.env.REACT_APP_WEB_PUSH_PUBLIC_KEY
    }
    const pushSubscription = await worker.pushManager.subscribe(subscribeOptions)
    
    await axios.post(`${process.env.REACT_APP_NOTI_SERVER}/register` || 'http://localhost:3001/register', {
      pushSubscription
    })
  }

  return (
      <>
        <Button onClick={setNoti}>알림 설정하기</Button>
        <Label>{notiStatus}</Label>
      </>
  )
}

function Notify() {
  const [ title, setTitle ] = useState('')
  const [ body, setBody ] = useState('')
  const [ icon, setIcon ] = useState('')
  const [ tag, setTag ] = useState('')
  const [ url, setUrl ] = useState('')
  
  const [ btnText, setBtnText ] = useState('알림 전송')

  const fileTestValue = () => {
    setTitle('테스트 제목')
    setBody('HyunsDeb is Awesome')
    setIcon('https://s3.hyuns.dev/hyuns.jpg')
    setTag('#hyunsdev')
    setUrl('http://localhost:3000')
  }

  const notify = async () => {
    await axios.post(`${process.env.REACT_APP_NOTI_SERVER}/notify` || 'http://localhost:3001/notify', {
      title, body, icon, tag, url
    })

    setBtnText('🎉 전송 완료!')
    setTimeout(() => setBtnText('알림 전송'), 2000)
  }

  return (
    <Inputs>
      <Input placeholder='제목 (title)' value={title} onChange={e => setTitle(e.target.value)} />
      <Input placeholder='내용 (body)' value={body} onChange={e => setBody(e.target.value)} />
      <Input placeholder='아이콘 (icon)' value={icon} onChange={e => setIcon(e.target.value)} />
      <Input placeholder='태그 (tag)' value={tag} onChange={e => setTag(e.target.value)} />
      <Input placeholder='링크 (url)' value={url} onChange={e => setUrl(e.target.value)} />
      <Button onClick={notify}>{btnText}</Button>
      <SecondaryButton onClick={fileTestValue}>기본 테스트 값</SecondaryButton>
    </Inputs>
  )
}

function NotiList() {
  const [ notiData, setNotiData ] = useState<any[]>([])
  useEffect(() => {
    window.addEventListener('push', (event:any) => {
        let { title, body, icon, tag, url } = JSON.parse(event.data && event.data.text());
        console.log({ title, body, icon, tag, url })
    });
  }, [])

  return (
    <></>
  )

}

function App() {
  return (
    <Divver>

      <SetNoti />
      <Line />
      <Notify />
      <Line />
      <NotiList />
      
    </Divver>
  );
}

export default App;
