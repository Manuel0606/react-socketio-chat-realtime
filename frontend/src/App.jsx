import { useState, useEffect } from 'react'
import io from 'socket.io-client'

const socket = io('/')

const App = () => {

  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault()
    const newMessage = {
      body:message, 
      from: 'You'
    }
    setMessages([newMessage, ...messages])
    console.log('(front) Mensaje que se envía ', message)
    socket.emit('message', message)
  }
  
  const receiveMessage = (message) => setMessages((state) => [message, ...state])

  useEffect(() => {
    socket.on('message', receiveMessage)

    return () => {
      socket.off('message', receiveMessage)
    }
  }, [])

  return (
    <div className='h-screen bg-zinc-800 text-white flex items-center justify-center'>
      <form onSubmit={handleSubmit} className='bg-zinc-900 p-10'>
        <h1 className='text-2xl font-bold my-2'>Chat Real Time</h1>
        <input type="text" placeholder='Write your message...'
          className='border-2 border-zinc-500 p-2 w-full text-black'
          onChange={(e) => setMessage(e.target.value)}
        />
        <button>
          Send
        </button>
        <ul>
          {
            messages.map((message, i) => (
              <li 
                key={i} 
                className={`my-2 p-2 table text-sm rounded-md ${message.from === 'You' ? 'bg-sky-700 ml-auto' : 'bg-black'} `}
              >
                <p className='text-xs text-slate-400 block'>{message.from}: </p>{message.body}
              </li>
            ))
          }
        </ul>
      </form>
    </div>
  )
}

export default App