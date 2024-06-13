const { GROUP_ID } = require('../config.js');

// Function to approve a chat join request
const approveJoinRequest = async (bot, ctx, userId) => {
    const chatId = GROUP_ID;
    
    try {
      await bot.telegram.approveChatJoinRequest(chatId, userId);
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
    } catch (error) {
      console.error(`Failed to approve join request for user ${userId}:`, error);
  
      setTimeout(() => {
      if (error.response.description === 'Bad Request: USER_ALREADY_PARTICIPANT') {
        bot.telegram.answerCbQuery(ctx.callbackQuery.id, `We can't process your join request because you're already a member of the group.`, 
          {
            show_alert: true
          });
  
      } else if (error.description === 'Bad Request: HIDE_REQUESTER_MISSING') {
        bot.telegram.answerCbQuery(ctx.callbackQuery.id, `We can't process your join request because you didn't request to join.`, 
          {
            show_alert: true
          });
  
      } else {
        ctx.reply(`Failed to approve join request. Please try again.`);
      }
    }, 2000);
    }
  };
  
  
  module.exports = {
    approveJoinRequest
  };