function welcomeMsg(ctx) { 
  return `<b>Welcome to the Tap Apps Workshops RSVP Bot!</b> 🎉
  
Hello ${ctx.from.first_name}! Get ready to join our exclusive Tap Apps Workshops organizing by Ceylon Cash Community.

<b>Event Details:</b>
- 📅 <b>Date</b>: Friday, June 21
- 🕙 <b>Time</b>: 5:00 PM (be there by 04:30PM)
- 📍 <b>Venue</b>: <a href="https://maps.app.goo.gl/QPufAteBjLZ8s5Nr8?g_st=it">CeyCube Web3.0 Co-Working Space</a> 

<i>I am a bot that can help you with RSVPs. Here are some commands you can use:</i>

  /register - Request your free ticket and join the workshop.
  /help - Get help and usage instructions.
  
<b>Let's dive into the world of Tap Apps together, Secure your spot now!</b> 🚀`;
}

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

const welcomePhoto = "https://i.imgur.com/qt8Sjsb.png";

const rsvpMsg = `<b>Ready to Join the Tap Apps Workshops? 🚀</b>

Please provide your name to proceed with the RSVP. Here are some exciting details about the event:
        
- <b>Interactive Sessions</b>: Engage with live demonstrations and hands-on activities.
- <b>Expert Speakers</b>: Learn from industry experts and Tap Apps enthusiasts.
- <b>Networking Opportunities</b>: Connect with fellow participants and expand your network.
        
Just reply with <b><u>YOUR NAME</u></b> to secure your spot!`;

const YouMustBecomeGif = "CgACAgQAAxkBAAIEo2ZotP6TsV1K39qubr5qno0VTEvxAAJeAwACs_8sUJapI1H53mZ9NQQ";

const groupLinkMsg = `<b>Your registration is almost complete!</b>

Please join the group using the following link: https://t.me/+59q_SKsyqDMyOTQ9

Once you have joined, click the button below to confirm your participation.`;

module.exports = {
    helpMessage,
    welcomePhoto,
    rsvpMsg,
    welcomeMsg,
    YouMustBecomeGif,
    groupLinkMsg
};
