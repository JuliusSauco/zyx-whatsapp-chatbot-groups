let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i;
export async function before(m, { isAdmin, isBotAdmin }) {
  if (m.isBaileys && m.fromMe) return !0;
  if (!m.isGroup) return !1;
  let chat = global.db.data.chats[m.chat];
  let delet = m.key.participant;
  let bang = m.key.id;
  let bot = global.db.data.settings[this.user.jid] || {};
  const isGroupLink = linkRegex.exec(m.text);
  const grupo = `https://chat.whatsapp.com`;
  if (isAdmin && chat.antiLink && m.text.includes(grupo))
    return m.reply(
      "*「 𝐀𝐍𝐓𝐈 𝐋𝐈𝐍𝐊𝐒 」* El modo *antilink* está activo en este grupo, se te permite enviar por ser administrador."
    );
  if (chat.antiLink && isGroupLink && !isAdmin) {
    if (isBotAdmin) {
      const linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(
        m.chat
      )}`;
      if (m.text.includes(linkThisGroup)) return !0;
    }
    await conn.sendButton(
      m.chat,
      `*「 𝐀𝐍𝐓𝐈 𝐋𝐈𝐍𝐊𝐒 」*\nEl modo *antilink* está activo, ${await this.getName(
        m.sender
      )} Serás eliminado por mandar enlaces en este grupo. Habla con algún administrador.${
        isBotAdmin
          ? ""
          : "\n\n*[❗𝐈𝐍𝐅𝐎❗]* Zyx Bot no tiene administrador, por lo tanto, no puede eliminar integrantes."
      }`,
      author,
      ["𝙳𝙴𝚂𝙰𝙲𝚃𝙸𝚅𝙰𝚁 𝙰𝙽𝚃𝙸𝙻𝙸𝙽𝙺𝚂", "/disable antilink"],
      m
    );
    if (isBotAdmin && bot.restrict) {
      await conn.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: bang,
          participant: delet,
        },
      });
      let responseb = await conn.groupParticipantsUpdate(
        m.chat,
        [m.sender],
        "remove"
      );
      if (responseb[0].status === "404") return;
    } else if (!bot.restrict)
      return m.reply(
        "*[❗𝐈𝐍𝐅𝐎❗]* El dueño de Zyx Bot tiene restringido el bot, habilitar con (#𝚎𝚗𝚊𝚋𝚕𝚎 𝚛𝚎𝚜𝚝𝚛𝚒𝚌𝚝), contacte con el dueño."
      );
  }
  return !0;
}
