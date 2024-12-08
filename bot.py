from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, filters, ContextTypes

# Argo kelimeler listesi
ARGO_KELIMELER = ["argo1", "argo2", "argo3"]

# Bot tokeninizi buraya ekleyin
TOKEN = "BOT_API_TOKEN"

# Start komutunu tanımlayın
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Merhaba! Ben bir argo tespit botuyum.")

# Mesajları kontrol eden fonksiyon
async def kontrol_mesaj(update: Update, context: ContextTypes.DEFAULT_TYPE):
    mesaj = update.message.text.lower()
    for kelime in ARGO_KELIMELER:
        if kelime in mesaj:
            await update.message.reply_text(
                f"Uyarı: Mesajınızda uygunsuz bir kelime tespit edildi: '{kelime}'. Lütfen dikkatli olun!"
            )
            break

# Ana fonksiyon
async def main():
    app = ApplicationBuilder().token(TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, kontrol_mesaj))
    
    print("Bot çalışıyor...")
    await app.run_polling()

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())