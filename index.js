const {telegram} = require("./util/telegram");
const {openai} = require("./util/openai");

function отправить_сообшение(chatId, message, ctx) {
  telegram.telegram.sendMessage(chatId, "загружаю...").then((msgctx) => {
    try {
      openai.createCompletion({
        model: "text-davinci-003",
        prompt: message,
        temperature: 0.95,
        max_tokens: 2048,
        // top_p: 1,
        // frequency_penalty: 0,
        // presence_penalty: 0,
        // stream: true
      }).then(completion => {
        ctx.telegram.editMessageText(msgctx.chat.id, msgctx.message_id, msgctx.message_id, completion.data.choices[0].text, );
      }).catch((e) => {
        ctx.telegram.editMessageText(msgctx.chat.id, msgctx.message_id, msgctx.message_id, "реквест сломался бля");
      });
    } catch (e) {
      ctx.telegram.editMessageText(msgctx.chat.id, msgctx.message_id, msgctx.message_id, "реквест сломался бля");
    }
  });
}

telegram.on("message", async (ctx) => {
  if (
    ctx.update.message.text.toLowerCase().startsWith("что такое ") ||
    ctx.update.message.text.toLowerCase().startsWith("what is ")) {
    const message = ctx.update.message.text.toLowerCase()
      .replace('что такое ', '').replace("what is ", "");
    console.log(`${ctx.chat.id}: ${message}`)
    отправить_сообшение(ctx.chat.id, `что такое ${message}? опиши коротко`, ctx);
  }
  if (
    ctx.update.message.text.toLowerCase().startsWith("опен ") ||
    ctx.update.message.text.toLowerCase().startsWith("open ")) {
    const message = ctx.update.message.text.toLowerCase()
      .replace('опен ', '').replace('open ', '');
    console.log(`${ctx.chat.id}: ${message}`)
    отправить_сообшение(ctx.chat.id, `${message}`, ctx);
  }
});


// telegram.command("makeimg", async (ctx) => {
//   const message = ctx.update.message.text.replace('/makeimg ', '');
//   const chatId = ctx.chat.id;
//   console.log(`${chatId} [buh]: ${message}`)
//   if (message) {
//     await openai.createImage({
//       prompt: message,
//       n: 1,
//       size: "1024x1024",
//     }).then(response => {
//       ctx.sendPhoto(chatId, {source: response.data.data[0].url})
//     }).catch(() => {
//       ctx.telegram.editMessageText(msgctx.chat.id, msgctx.message_id, msgctx.message_id, "реквест сломался бля");
//     });
//   }
// });
telegram.launch();
