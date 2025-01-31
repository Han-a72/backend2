import mongoose from "mongoose"


export const connectToDB=async()=>{

    try {
     await mongoose.connect("mongodb+srv://hanaaman921:hana123@hana-cluster.8oo9n.mongodb.net/books-collection?retryWrites=true&w=majority")
     console.log("database connected")

        
    } catch (error) {
        
        console.log(error)
    }


}