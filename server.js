
import express from "express"
import mongoose from "mongoose"
import authRoutes from "./routes/booksRoute"

const app=express()

/**
 *  Pending
 * Fullfilled
 * rejected
 
 */



app.get("/",(req,res)=>{
    res.status(200).send("Welcome I'm hana")
})



app.listen(5000,()=>{
    console.log("server connected")
})


