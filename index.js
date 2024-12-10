const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");

// Token'ınızı ortam değişkenlerinden alın
const token = process.env.BOT_TOKEN;

// Botu polling yöntemi ile başlatın
const bot = new TelegramBot(token, { polling: true });

// .txt dosyasındaki argo kelimeleri okuyup bir diziye dönüştürün
const argoKelimeler = fs
  .readFileSync("argo_kelimeler.txt", "utf-8")
  .split("\n")
  .map((kelime) => kelime.trim().toLowerCase())
  .filter((kelime) => kelime.length > 0);

// Mesajları dinleyin ve argo kelime kontrolü yapın
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const mesaj = msg.text;

  // Mesajın argo kelime içerip içermediğini kontrol et
  if (mesaj) {
    const mesajKucukHarf = mesaj.toLowerCase(); // Büyük/küçük harf duyarlılığını kaldırmak için

    for (let kelime of argoKelimeler) {
      if (mesajKucukHarf.includes(kelime)) {
        // Eğer argo kelime bulunduysa kullanıcıya uyarı gönder
        bot.sendMessage(
          chatId,
          "Lütfen mesajlarınızda argo kelimeler kullanmayın.",
        );
        break; // İlk argo kelime bulduğunda döngüden çık
      }
    }
  }
});
