import { Link } from 'react-router-dom'
import './chatList.css'
import { useQuery } from '@tanstack/react-query'

const ChatList = () => {

  const { isPending, error, data } = useQuery({
    queryKey: ['userChats'],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/userchats`,{
        credentials:"include"
      }).then((res) =>
        res.json(),
      ),
  })

  return (
    <div className='chatList'>
      <span className="title">DASHBOARD</span>
        <Link to="/dashboard">Create a new Chat</Link>
        <Link to="/">Explore Patrick Chat</Link>
        <Link to="/">Contact</Link>
        <hr />
        <span className="title">RECENT CHATS</span>
        <div className="list">
            {isPending ? "Loading" : error ? "Something went wrong!" : data?.map((chat) => (
              <Link to={`/dashboard/chats/${chat._id}`} key={chat._id}>
                <div style={{display: 'flex', justifyContent:"space-between"}}>{chat.title}
                  <span>
                    <img src='/delete.png' alt='' style={{width: "16px", height:"16px"}}/>
                  </span>
                </div>
              </Link>
            ))}
        </div>
        <hr />
        <div className="upgrade">
            <img src="/avatar.png" alt=""/>
            <div className="texts">
                <span>Update to Patrick AI pro <br></br></span>
                <span>Get Unlimited Access to all Features</span>
            </div>
        </div>

    </div>
  )
}

export default ChatList
