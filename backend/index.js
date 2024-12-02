import express from 'express'
import ImageKit from 'imagekit';
import cors from 'cors'
import path from 'path'
import url, { fileURLToPath } from 'url'
import mongoose from 'mongoose';
import Chat from './modules/chat.js'
import UserChats from './modules/userChats.js'
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node'

const port = process.env.PORT || 3000;
const app = express();

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}))

app.use(express.json())

const connect = async() => {
    try{
        await mongoose.connect(process.env.MONGO)
        console.log("Connected to MongoDB")
    }catch(err){
        console.log(err)
    }
}


const imagekit = new ImageKit({
    urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY
  });

app.get('/api/upload', (req, res) => {
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
})


// app.get("/api/test", ClerkExpressRequireAuth(), (req, res) => {
//   const userId = req.auth.userId;
//   console.log(userId)
//   console.log("Success!")
//   res.send("Success")
// })

app.post('/api/chats', ClerkExpressRequireAuth(), async(req, res) => {

    //create a new chat
    const userId = req.auth.userId
    const { text } = req.body
    try{
        const newChat = new Chat({
            userId:userId,
            history:[{role:"user", parts:[{text}]}]
        })

        const savedChat = await newChat.save();

        //check if the userchats exists
        const userChats = await UserChats.find({userId: userId})

        //if user chat doesn't exist, create a new userChat and add the add into the array
        if(!userChats.length){
            const newUserChats = new UserChats({
                userId: userId,
                chats:[
                    {
                        _id: savedChat._id,
                        title: text.substring(0, 40)
                    }
                ]
            })
            await newUserChats.save()
        }else {
            //if exists, push the chat to the existing array
            await UserChats.updateOne({userId: userId}, {
                $push:{
                    chats: {
                        _id: savedChat._id,
                        title: text.substring(0,40)
                    }
                }
            })
            res.status(201).send(newChat._id)
        }
    }catch(err){
        console.log(err)
        res.status(500).send("Error creating chats")
    }

    //console.log(text)
})

app.get("/api/userchats", ClerkExpressRequireAuth(), async(req, res) => {
    const userId = req.auth.userId
    try{
        const userChats = await UserChats.find({userId})
        res.status(200).send(userChats[0].chats)
    }catch(err){
        console.log(err)
        res.status(500).send("Error on fetching useChats")
    }
})


app.get("/api/chats/:id", ClerkExpressRequireAuth(), async(req, res) => {
    const userId = req.auth.userId
    try{
        const chat = await Chat.findOne({ _id: req.params.id, userId})
        res.status(200).send(chat)
    }catch(err){
        console.log(err)
        res.status(500).send("Error on fetching chats")
    }
})

app.put("/api/chats/:id", ClerkExpressRequireAuth(), async(req, res) => {
    const userId = req.auth.userId
    const {question, answer, img} = req.body
    const newItems = [
        ...(question ? [{
            role: "user",
            parts: [{text:question}],
            ...(img && {img})
        }] : []),
        {
            role: "model",
            parts: [{text:answer}]
        },
    ]
    try{

        const updatedChat = await Chat.updateOne({ _id:req.params.id, userId }, {
            $push:{
                history:{
                    $each: newItems,
                }
            }
        })

        res.status(200).send(updatedChat)
    }catch(err){
        console.log(err)
        res.status(500).send("Error adding conversation")
    }
})


app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(401).send('Unauthenticated!')
})

app.use(express.static(path.join(__dirname, "../client")))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "index.html"))
})
  
app.listen(port, () => {
    connect()
    console.log(`Server is running on port ${port}`)
})