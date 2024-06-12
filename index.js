require('dotenv').config();
const { Telegraf, session, Scenes } = require('telegraf');
const { message } = require("telegraf/filters");
const { inlineKeyboard } = require('telegraf/markup');


const bot = new Telegraf(process.env.BOT_TOKEN);

const stage = new Scenes.Stage()

const getName = new Scenes.BaseScene('getName')
stage.register(getName)
const getEmail = new Scenes.BaseScene('getEmail')
stage.register(getEmail)
const getTickets = new Scenes.BaseScene('getTickets')
stage.register(getTickets)


// Function to approve a chat join request
async function approveJoinRequest(ctx, userId) {
  const chatId = '-1002210661618';
  try {
    await bot.telegram.approveChatJoinRequest(chatId, userId);
    setTimeout(() => {
    ctx.reply(`Successfully approved ${ctx.from.first_name}'s join request.`)}
    , 5000);
  } catch (error) {
    console.error(`Failed to approve join request for user ${userId}:`, error);
    if (error.response.description === 'Bad Request: USER_ALREADY_PARTICIPANT') {
      bot.telegram.sendAnimation(ctx.chat.id, "CgACAgQAAxkBAAIG8WZpOYWV58eH3qZ34rL8030tx_V3AAL7AgAC8PZMU27D__eT9_FyNQQ", {
        caption: `We can't process your join request because you're already a member of the group.`,
      });
    } else if (error.description === 'Bad Request: HIDE_REQUESTER_MISSING') {
      bot.telegram.sendAnimation(ctx.chat.id, "CgACAgQAAxkBAAIHK2ZpPPNpwGgkFoeL9_BWG5atKfhnAALtBAACoEbUU3_Mb78FI5yQNQQ", {
        caption: `We can't process your join request because you didn't request to join.`,
      });
    } else {
      ctx.reply(`Failed to approve join request. Please try again.`);
    }
  }
}

bot.use(session())
bot.use(stage.middleware())
bot.use(async (ctx, next) => {
  if(ctx.session == undefined) ctx.session = {}
  await next()
})

// Help Message
const helpMessage = 
  `*📖 Help and Usage Instructions*
    
Use the following commands to interact with the bot:
    
  - */start* - Display the welcome message and get event details.
  - */register* - Request your free ticket for the Tap Apps Workshops.
  - */help* - Display this help message.
    
*How to Use This Bot:*
    
  1. *Start*: Begin by typing \`/start\` to see the welcome message and learn about the event.
  2. *Register*: Secure your spot by typing \`/register\`. You will be asked to provide your name, email, and the number of tickets you need.
  3. *Group Invitation*: After registering, you'll be automatically added to the exclusive Telegram group for the workshops.
    
If you have any questions or encounter any issues, feel free to reach out for support.
    
Happy learning and see you at the workshops! 🎓
      `;

  // Welcome Photo
  const welcomePhoto = "AgACAgUAAxkBAAIBJ2ZnUfhJlCFoaSyoY5-9RFgMvzENAALfuzEbAqQ4V1nP-CGKdsv3AQADAgADcwADNQQ";

  // RSVP Message  
  const rsvpMsg = `<b>Ready to Join the Tap Apps Workshops? 🚀</b>

  Please provide your name to proceed with the RSVP. Here are some exciting details about the event:
        
  - <b>Interactive Sessions</b>: Engage with live demonstrations and hands-on activities.
  - <b>Expert Speakers</b>: Learn from industry experts and Tap Apps enthusiasts.
  - <b>Networking Opportunities</b>: Connect with fellow participants and expand your network.
        
  Just reply with <b><u>YOUR NAME</u></b> to secure your spot!`;

// Start Command
bot.start((ctx) =>
  bot.telegram.sendPhoto(ctx.message.chat.id, welcomePhoto, 
    {
    caption: `<b>Welcome to the Tap Apps Workshops RSVP Bot!</b> 🎉
    
Hello ${ctx.from.first_name}! Get ready to join our exclusive Tap Apps Workshops organizing by Ceylon Cash Community.

<i>I am a bot that can help you with RSVPs. Here are some commands you can use:</i>

    /register - Request your free ticket and join the workshop.
    /help - Get help and usage instructions.
    
<b>Let's dive into the world of Tap Apps together, Secure your spot now!</b> 🚀`,
    parse_mode: "HTML",
    reply_markup: {
        keyboard: [
          ["RSVP 🎟", "Help 🆘"],
        ], resize_keyboard: true,
      },
    },console.log(ctx.message))
    
  );

  // Hidden Command for Check Group ID
  bot.command('grpid', async (ctx) => {
    bot.telegram.sendMessage(ctx.message.chat.id, `Group ID: <code>${ctx.message.chat.id}</code>`,{
      parse_mode: "HTML",
    })
  })

  // Help Buton
  bot.hears('Help 🆘', (ctx) => {
    bot.telegram.sendMessage(ctx.message.chat.id, helpMessage, { 
      parse_mode: "Markdown",
      reply_markup: { remove_keyboard: true } });
    }
  )

  // Help Command
  bot.help((ctx) => {
      bot.telegram.sendMessage(ctx.message.chat.id, helpMessage, { parse_mode: "Markdown" });
  });


  // Register Button
  bot.hears('RSVP 🎟', async (ctx) => {
    bot.telegram.sendMessage(ctx.message.chat.id, rsvpMsg, {
      parse_mode: "HTML",
      reply_markup: { keyboard: [['🛑 Cancel']], resize_keyboard: true, one_time_keyboard: true }, },)
      ctx.scene.enter('getName')
    }
  )

   // Register Button
   bot.command('register', async (ctx) => {
    bot.telegram.sendMessage(ctx.message.chat.id, rsvpMsg, {
      parse_mode: "HTML",
      reply_markup: { keyboard: [['🛑 Cancel']], resize_keyboard: true, one_time_keyboard: true }, },)
      ctx.scene.enter('getName')
    }
  )

  // // Get Name Start Command
  // getName.command('start', async (ctx) => {
  //   ctx.reply(
  //     'Please provide <b><u>YOUR NAME</u></b> to proceed with the RSVP:',
  //     { reply_markup: { keyboard: [['🛑 Cancel']], resize_keyboard: true, one_time_keyboard: true },
  //   parse_mode: "HTML" }
  //   )
  //   await ctx.scene.leave('getEduc')
  //   ctx.scene.enter('getName')
  // })

  // Get Name Scene
  getName.on('text', async (ctx) => {

    // cancel registration
    if(ctx.message.text == '🛑 Cancel'){
      ctx.scene.leave('getName')
      return ctx.reply('You have successfully canceled the registration. To start over, send /register command.',
        { reply_markup: { remove_keyboard: true } }
      )
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

  // Get Email Scene
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

  // Get No of Tickets Scene
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
    
  // Handle confirm registration
  bot.action('confirm', (ctx) => {
    bot.telegram.sendChatAction(ctx.chat.id, "choose_sticker");
    setTimeout(() => {
      try {
      bot.telegram.deleteMessage(ctx.chat.id, ctx.update.callback_query.message.message_id);
      } catch (error) {
        console.error(`Failed to delete message:`, error);
        next();
      }
    }, 5000); // 5000 milliseconds = 5 seconds
    setTimeout(() => {
      bot.telegram.sendAnimation(ctx.callbackQuery.from.id, "CgACAgQAAxkBAAIEo2ZotP6TsV1K39qubr5qno0VTEvxAAJeAwACs_8sUJapI1H53mZ9NQQ", 
        {
        caption: `<b>Your registration is almost complete!</b>` + 
        `\n\nPlease join the group using the following link: https://t.me/+59q_SKsyqDMyOTQ9`
        + `\n\nOnce you have joined, click the button below to confirm your participation.`,
         reply_markup: { 
          inline_keyboard: [
            [
              { text: "✅ I have joined the group", 
                callback_data: "confirm_participation" 
              }
            ]
          ]
        }, parse_mode: "HTML"}
    )
    }, 2000); // 5000 milliseconds = 5 seconds
    });
    
  bot.action('cancel', (ctx) => {
    ctx.reply('You have canceled the registration. To start over, send /register command.',
      { reply_markup: { remove_keyboard: true }});
  });

bot.action('confirm_participation', async (ctx) => {
  bot.telegram.sendSticker(ctx.chat.id, 'CAACAgEAAxkBAAIFg2Zov_yyPaE_qE-5b-LYL7jZa_dOAALKAQACCafZRl5-64cebkGpNQQ')
  setTimeout(() => {
  bot.telegram.sendMessage(ctx.chat.id,  `📄 <b>Registration Details</b>\n\n<b>• Full Name:</b> ${ctx.session.name}`+
    `\n<b>• Email:</b> ${ctx.session.email}`+
    `\n<b>• No of Tickets:</b> ${ctx.session.noOfTickets}`+ 
    `\n\n<b>Thank you for confirming your participation!</b>`,
    { reply_markup: { remove_keyboard: true }, 
    parse_mode: "HTML" }
  )
  }, 1000);
  setTimeout( async () => {
    bot.telegram.sendChatAction(ctx.chat.id, "typing");
  await approveJoinRequest(ctx, ctx.from.id); // Approve the join request here
  }, 5000);
}
);

 
  // bot.on(message("animation"), async ctx => {
  //   ctx.replyWithHTML("<b>Bold</b>, <a href='google.com'>italic</a>, and __underlines__\\!");
  //   bot.telegram.sendPoll(ctx.message.chat.id, "Do you like this bot?", ["Yes", "No"], { is_anonymous: false });
  //   bot.telegram.sendQuiz(ctx.message.chat.id, "Do you like this bot?", ["Yes", "No"], { correct_option_id: 0 });
  //   bot.telegram.sendPhoto(ctx.message.chat.id, "AgACAgUAAxkBAAIBJ2ZnUfhJlCFoaSyoY5-9RFgMvzENAALfuzEbAqQ4V1nP-CGKdsv3AQADAgADcwADNQQ", { caption: "Random photo" });
  //   console.log(ctx.message);
  // });

  bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop ("SIGTERM"));