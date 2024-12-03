import { Link } from 'react-router-dom'
import './homepage.css'
import { useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
const Homepage = () => {

  const [typingStatus, setTypingStatus] = useState("human1");

  // const test = async() => {
  //   await fetch("http://localhost:3000/api/test", {
  //     method: 'GET',
  //     credentials: 'include'
  //   })
  // }

  return (
    <div className='homepage'>
      <img src="./orbital.png" alt="background image" className="orbital"/>
      <div className="left">
        <h1>πGPT</h1>
        <h2>Supercharge Your Creativity and Productivity</h2>
        <h3>Hi, My name is Patrick. I am super smart and able to answer all kinds of questinos. I can assist you with composing emails, codes, essays and much more. Feel free to ask me anything at any time! </h3>
        <Link to="/dashboard">Get Started</Link>
        {/* <button onClick={test}>TEST BACKEND AUTH</button> */}
      </div>
      <div className="right">
        <div className='imgContainer'>

          <div className="bgContainer">
            <div className="bg"></div>
          </div>

          <img src="./star.png" alt="" className="bot"/>
          <div className="chat">
            <img src={typingStatus === "human1" ? "/human1.jpeg" : typingStatus === "human2" ? "/human2.jpeg" : typingStatus === "squid" ? "avatar.png" : "/star.png"} alt="User and Bot Avatar"/>
            <TypeAnimation
              sequence={[
                // Same substring at the start will only be typed out once, initially
                "Jack: What is the best restaurant in Waterloo?",
                3000, () => {
                  setTypingStatus("bot");
                },
                "Patrick: Tim Horton at DC",
                3000, () => {
                  setTypingStatus("human2");
                },
                "Lisa: What's the ranking of Engineering Undergraduate in Canada?",
                3000, () => {
                  setTypingStatus("bot");
                },
                "UWaterloo > UofT > UBC > McGill!",
                3000, () => {
                  setTypingStatus("squid");
                },
                "Do you speak Mandarin?",
                3000, () => {
                  setTypingStatus("bot");
                },
                "Yes I do!",
                3000, () => {
                  setTypingStatus("human1");
                }
              ]}
              wrapper="span"
              repeat={Infinity}
              cursor={true}
              omitDeletionAnimation={true}
            />
          </div>
        </div>

      </div>
    </div>
  )
}

export default Homepage
