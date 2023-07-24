import NextAuth from "next-auth/next";
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
    providers:[
        GoogleProvider({
            clientId : process.env.GOOGLE_CLIENT_ID,
            clientSecret : process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    secret : "61d8db73954c305a8d4f1b177257279d"
}

export default NextAuth({
    providers:[
        GoogleProvider({
            clientId : process.env.GOOGLE_CLIENT_ID,
            clientSecret : process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    secret : "61d8db73954c305a8d4f1b177257279d"
})