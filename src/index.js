const { Telegraf, session, Scenes } = require('telegraf');
const { getName, getEmail, getTickets } = require('./utils/registration.js');
const { BOT_TOKEN } = require('./config.js');
const { approveJoinRequest } = require('./utils/group_invitation.js');
const { writeToDatabase } = require('./utils/database.js');
const { helpMessage, welcomePhoto, rsvpMsg, welcomeMsg, YouMustBecomeGif, groupLinkMsg } = require('./utils/event_info.js');


// Create a bot instance
const bot = new Telegraf(BOT_TOKEN);

// Create a new stage
const stage = new Scenes.Stage()

// Register the scenes
stage.register(getName);
stage.register(getEmail)
stage.register(getTickets)


// Bot Middleware
bot.use(session())
bot.use(stage.middleware())
bot.use(async (ctx, next) => {
  if(ctx.session == undefined) ctx.session = {}
  await next()
})

// Start Command
bot.start((ctx) =>
  bot.telegram.sendPhoto(ctx.message.chat.id, welcomePhoto, 
    {
    caption: welcomeMsg(ctx),
    parse_mode: "HTML",
    reply_markup: {
        keyboard: [
          ["RSVP 🎟", "Help 🆘"],
        ], resize_keyboard: true,
      },
    },)
    
  );

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

// Register Command
bot.command('register', async (ctx) => {
  bot.telegram.sendMessage(ctx.message.chat.id, rsvpMsg, {
    parse_mode: "HTML",
    reply_markup: { keyboard: [['🛑 Cancel']], resize_keyboard: true, one_time_keyboard: true }, },)
    ctx.scene.enter('getName')
  }
)

// Confirmation Ticket Request
bot.action('confirm', async (ctx) => {
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
    bot.telegram.sendAnimation(ctx.callbackQuery.from.id, YouMustBecomeGif, 
      {
      caption: groupLinkMsg,
        reply_markup: { 
        inline_keyboard: [
          [
            { text: "✅ I have joined the group", 
              callback_data: "confirm_participation" 
            }
          ]
        ]
      }, parse_mode: "HTML"}
    )}, 2000);
    
    const userData = {
      id: ctx.from.id,
      name: ctx.session.name,
      email: ctx.session.email,
      noOfTickets: ctx.session.noOfTickets
    };
    writeToDatabase(userData);
});

// Cancellation Ticket Request
bot.action('cancel', (ctx) => {
    ctx.reply('You have canceled the registration. To start over, send /register command.',
      { reply_markup: { remove_keyboard: true }});
});

// Approve Join Request
bot.action('confirm_participation', async (ctx) => {
    bot.telegram.sendChatAction(ctx.chat.id, "typing");
    await approveJoinRequest(bot, ctx, ctx.from.id);
});

// Easter Eggs Starts
bot.command('grpid', async (ctx) => {
  bot.telegram.sendMessage(ctx.message.chat.id, `Group ID: <code>${ctx.message.chat.id}</code>`,{
    parse_mode: "HTML",
  })
})
// Easter Eggs Ends

  bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop ("SIGTERM"));