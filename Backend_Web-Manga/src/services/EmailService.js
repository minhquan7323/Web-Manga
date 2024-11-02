const sendEmailCreateOrder = async (email, orderItems) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_ACCOUNT,
            pass: process.env.MAIL_PASSWORD
        }
    })
    let listItem = ''
    const attachImage = []
    orderItems.forEach((order) => {
        listItem +=
            `<div>
                    <div>You have ordered <b>${order.name}</b> with a quantity of <b>${order.amount}</b> and a price of <b>${order.price} VND</b></div>
                </div>`
        attachImage.push({ path: order.image })
    })
    let info = await transporter.sendMail({
        from: process.env.MAIL_ACCOUNT,
        to: email,
        subject: 'Thank you for ordering at Web Manga',
        text: 'hi',
        html: `<h2>Your Order Details:</h2>${listItem}`,
        attachments: attachImage
    })
}
