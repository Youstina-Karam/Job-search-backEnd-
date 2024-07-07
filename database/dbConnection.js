import mongoose from 'mongoose'

// Connection URL
export const dbConnection = mongoose.connect('mongodb://127.0.0.1:27017/jobSearch').then(()=>{
    console.log('Connected successfully to server');
  }).catch((err=>{
    console.log('Database error :',err);
  }))