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

// Kullanıcıların uyarı durumunu tutan bir nesne
const uyariDurumu = {};

// Mesajları dinleyin ve argo kelime kontrolü yapın
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const mesaj = msg.text;

  // Mesajın argo kelime içerip içermediğini kontrol et
  if (mesaj) {
    const mesajKucukHarf = mesaj.toLowerCase(); // Büyük/küçük harf duyarlılığını kaldırmak için
    let argoBulundu = false;

    for (let kelime of argoKelimeler) {
      if (mesajKucukHarf.includes(kelime)) {
        argoBulundu = true;
        break; // İlk argo kelime bulduğunda döngüden çık
      }
    }

    if (argoBulundu) {
      if (!uyariDurumu[userId]) {
        // İlk argo kullanımı, uyarı ver
        uyariDurumu[userId] = 1;
        await bot.sendMessage(
          chatId,
          "Lütfen mesajlarınızda argo kelimeler kullanmayın. Bir kez daha argo kelime kullanırsanız banlanacaksınız."
        );
      } else if (uyariDurumu[userId] === 1) {
        // İkinci argo kullanımı, kullanıcıyı banla
        try {
          await bot.kickChatMember(chatId, userId);
          await bot.sendMessage(chatId, "Argo kullanımından dolayı kullanıcı banlandı.");
        } catch (err) {
          console.error("Kullanıcıyı banlama sırasında bir hata oluştu:", err);
          await bot.sendMessage(
            chatId,
            "Kullanıcıyı banlama sırasında bir hata oluştu. Lütfen yetkilerinizi kontrol edin."
          );
        }
      }
    }
  }
});
