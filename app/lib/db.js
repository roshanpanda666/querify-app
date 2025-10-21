import dotenv from 'dotenv';

// Force reload and override
dotenv.config({ override: true });

export const{USERNAME,PASSWORD}=process.env

// console.log(process.env.USERNAME, process.env.PASSWORD);

export const connectionSRT="mongodb+srv://"+USERNAME+":"+PASSWORD+"@cluster0.oangzv8.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0"