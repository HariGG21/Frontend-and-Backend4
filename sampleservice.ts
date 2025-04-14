import nodemailer from "nodemailer"
import path from "path"

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
    user: "hariggait@gmail.com",
    pass: "hles osbo qive nror"
    }
})

const mailOptions ={
    from:'hariggait@gmail.com',
    to:'ggharisms@gmail.com',
    subject:'Test Email from Nodemailer with Attachment',
    text:"This is a test email sent from Nodemailer using Gmail with an attachment!",
    html:'<h1>Hello guysssss</h1>',
    attachments :[
        {
            filename:"src/use.txt",
            path:path.join(__dirname,'src/use.txt')
        }
    ]
}

transporter.sendMail(mailOptions,(error,info)=>{
    if(error){
        console.log('Error:',error)
    }
    else{
        console.log('Email sent:',info.response)
    }
})
