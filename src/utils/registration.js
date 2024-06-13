const { Scenes } = require('telegraf');

// Name Scene
const getName = new Scenes.BaseScene('getName');
getName.on('text', async (ctx) => {

    // cancel registration
    if(ctx.message.text == '🛑 Cancel'){
      ctx.scene.leave('getName')
      return ctx.reply('You have successfully canceled the registration. To start over, send /register command.',
        { reply_markup: { remove_keyboard: true } }
      )}
    else if (ctx.message.text == 'Help 🆘' || ctx.message.text == 'RSVP 🎟') {
        ctx.scene.leave('getName');
        ctx.reply(
            'Please provide your<b><u> FULL NAME</u></b> to proceed with the RSVP:',
            {
                reply_markup: {
                    keyboard: [['🛑 Cancel']],
                    resize_keyboard: true,
                    one_time_keyboard: true
                },
                parse_mode: "HTML"
            }
        );
        return ctx.scene.enter('getName');
    }
  
    // Input email message
    ctx.session.name = ctx.message.text
    ctx.reply(
      `📄 <b>Registration Details</b>\n\n<b>• Full Name:</b> ${ctx.session.name}` +
      '\n\nEnter <b><u>YOUR EMAIL</u></b>:',
      { reply_markup: { keyboard: [['◀️ Back', '🛑 Cancel']], resize_keyboard: true, one_time_keyboard: true },
      parse_mode: "HTML"}
      )
    await ctx.scene.leave('getName')
    ctx.scene.enter('getEmail')
  })

// Email Scene
const getEmail = new Scenes.BaseScene('getEmail');
getEmail.hears(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, async (ctx) => {
const email = ctx.message.text;
    ctx.session.email = email;
    ctx.reply(
    `📄 <b>Registration Details</b>\n\n<b>• Full Name:</b> ${ctx.session.name}\n<b>• Email:</b> ${ctx.session.email}`+
    '\n\nGreat! Now please let us know the <b><u>NO OF TICKETS</u></b> you would like to purchase?',
    { reply_markup: { keyboard: [['◀️ Back', '🛑 Cancel']], resize_keyboard: true, one_time_keyboard: true },
    parse_mode: "HTML"}
    );
      
    await ctx.scene.leave('getEmail');
    ctx.scene.enter('getTickets')
});

// Email Vaildation
getEmail.on('text', async (ctx) => {
if(ctx.message.text == '🛑 Cancel'){
    ctx.scene.leave('getEmail')
    return ctx.reply('You have successfully canceled the registration. To start over, send /register command.')
} 
else if (ctx.message.text == '◀️ Back'){
    ctx.reply(
        'Please provide <b><u>YOUR NAME</u></b> to proceed with the RSVP:',
        { reply_markup: { keyboard: [['🛑 Cancel']], resize_keyboard: true, one_time_keyboard: true },
        parse_mode: "HTML" }
        )
    ctx.scene.leave('getEmail')
    return ctx.scene.enter('getName')

}

ctx.reply('Please enter a valid email address:',
{ reply_markup: { keyboard: [['◀️ Back', '🛑 Cancel']], resize_keyboard: true, one_time_keyboard: true },
    parse_mode: "HTML"}
)})

// Ticket Scene
const getTickets = new Scenes.BaseScene('getTickets')
getTickets.hears(/^[0-9]{1}$/, async (ctx) => {
    const noOfTickets = ctx.message.text;
    ctx.session.noOfTickets = noOfTickets;
    ctx.reply(
    `📄 <b>Registration Details</b>\n\n<b>• Full Name:</b> ${ctx.session.name}`+
    `\n<b>• Email:</b> ${ctx.session.email}`+
    `\n<b>• No of Tickets:</b> ${ctx.session.noOfTickets}`+
    '\n\nDo you confirm registration?',
    { reply_markup: {
        inline_keyboard: [
            [{
                text: "Yes",
                callback_data: "confirm"
            },
            {
                text: "No",
                callback_data: "cancel"
            }]
        ]
    }, parse_mode: "HTML"}
    );
    await ctx.scene.leave('getTickets');
});

// No of Tickets Validation
getTickets.on('text', async (ctx) => {

// No of Tickets Validation
if(ctx.message.text == '🛑 Cancel'){
    ctx.scene.leave('getTickets')
    return ctx.reply('You have successfully canceled the registration. To start over, send /register command.')
} 
else if (ctx.message.text == '◀️ Back'){
    ctx.reply(
        'Please enter your email:',
        { reply_markup: { keyboard: [['🛑 Cancel']], resize_keyboard: true, one_time_keyboard: true },
        parse_mode: "HTML" }
        )
    ctx.scene.leave('getTickets')
    return ctx.scene.enter('getEmail')

}

ctx.reply('Please enter a valid number of tickets (e.g. 1, 2, 3, etc.)',
{ reply_markup: { keyboard: [['◀️ Back', '🛑 Cancel']], resize_keyboard: true, one_time_keyboard: true },
    parse_mode: "HTML"}
)})
    

module.exports = {
  getName,
  getEmail,
  getTickets
};
