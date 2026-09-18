const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const express = require('express'); // Necesario para mantener vivo el bot en Render

// Servidor web simple para que Render no apague el bot por inactividad
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Sky Bot está activo y funcionando 24/7.');
});

app.listen(PORT, () => {
    console.log(`Servidor web interno corriendo en el puerto ${PORT}`);
});

// Inicializar el cliente de Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent // Obligatorio para leer pings
    ]
});

// ID del Owner para el sistema anti-ping
const OWNER_ID = '1426990393802887290';

// Definición de los Slash Commands
const commands = [
    new SlashCommandBuilder()
        .setName('reglas')
        .setDescription('Muestra las normas generales y de convivencia de Sky Bot.'),
    
    new SlashCommandBuilder()
        .setName('reglasstaff')
        .setDescription('Muestra el reglamento oficial y las funciones para los rangos del staff.')
].map(command => command.toJSON());

// Evento cuando el bot está listo
client.once('ready', async () => {
    // AQUÍ ESTÁ EL MENSAJE QUE PEDISTE:
    console.log("SKY BOT ONLINE!");

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    try {
        console.log('Registrando comandos de barra (/) en Discord...');
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );
        console.log('¡Comandos de barra registrados exitosamente!');
    } catch (error) {
        console.error('Error al registrar comandos:', error);
    }
});

// Manejador de los Comandos de Barra (Embeds)
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'reglas') {
        const embedReglas = new EmbedBuilder()
            .setColor('#3498DB')
            .setTitle('<a:luna:1545550535560659004> Normas Generales de Sky Bot')
            .setDescription(
                '<a:azulito:1544034607052357723> • Una sola cuenta por usuario.\n' +
                '<a:azulito:1544034607052357723> • Prohibido el contenido NSFW, violento o discriminatorio.\n' +
                '<a:azulito:1544034607052357723> • No promociones sin permiso del staff.\n' +
                '<a:azulito:1544034607052357723> • No compartas información personal.\n' +
                '<a:azulito:1544034607052357723> • Los tickets solo deben abrirse por motivos válidos.\n\n' +
                
                '## <a:luna:1545550535560659004> **Conducta y Convivencia**\n' +
                '<a:xd:1542363895577182238> • Trato respetuoso siempre.\n' +
                '<a:xd:1542363895577182238> • Nada de insultos, acoso o toxicidad.\n' +
                '<a:xd:1542363895577182238> • Evita spam, flood y mensajes repetitivos.\n' +
                '<a:xd:1542363895577182238> • Usa cada canal para su función.\n' +
                '<a:xd:1542363895577182238> • No pings innecesarios al staff.\n' +
                '<a:xd:1542363895577182238> • Lenguaje adecuado y sin provocaciones.\n\n' +

                '## <a:luna:1545550535560659004> **Identidad y Contenido Visual** 🚫\n' +
                '<a:moradito:1544034439883923478> • Avatares, nombres y estados deben ser aptos para todo público.\n' +
                '<a:moradito:1544034439883923478> • Prohibidas imágenes +18, perturbadoras u ofensivas. El staff puede pedir cambios obligatorios. 🔞\n\n' +

                '## <a:luna:1545550535560659004> **Interacción con el Staff**\n' +
                '<a:rosita:1544034536088670282> • Respeta las decisiones del equipo.\n' +
                '<a:rosita:1544034536088670282> • No pidas rangos o roles.\n' +
                '<a:rosita:1544034536088670282> • Prohibido hacerse pasar por staff.\n\n' +

                '## <a:luna:1545550535560659004> **Seguridad y Actividades**\n' +
                '• No envíes links por MD sin autorización. Prohibidas estafas o doxxeo. 📵\n' +
                '• Prohibido el spam en sorteos, eventos y reacciones ofensivas.'
            )
            .setFooter({ text: 'Sky Bot • Seguridad y Convivencia' })
            .setTimestamp();

        await interaction.reply({ embeds: [embedReglas] });
    } 
    
    else if (commandName === 'reglasstaff') {
        const embedStaff = new EmbedBuilder()
            .setColor('#9B59B6')
            .setTitle('<a:reglas:1542562108552642667> REGLAS GENERALES DEL STAFF')
            .setDescription(
                '**Todos los rangos deben cumplir estas reglas:**\n' +
                '<a:luna:1545550535560659004> - Respetar a los miembros y al resto del staff.\n' +
                '<a:luna:1545550535560659004> - No abusar de los permisos.\n' +
                '<a:luna:1545550535560659004> - No filtrar información interna del staff.\n' +
                '<a:luna:1545550535560659004> - No favorecer amigos/conocidos en reportes o postulaciones.\n' +
                '<a:luna:1545550535560659004> - No discutir asuntos internos del staff en canales públicos.\n' +
                '<a:luna:1545550535560659004> - Respetar siempre a los rangos superiores.\n' +
                '<a:luna:1545550535560659004> - Si hay dudas contactar a un advisor.\n' +
                '<a:luna:1545550535560659004> - Cualquier abuso de rango sera demote sin aviso.\n\n' +

                '### <@&1542569421854351360> (Trial Helper)\n' +
                '<:th:1542570952028852274> En período de prueba.\n' +
                '**Qué hace:** Resolver dudas, orientar usuarios, tickets generales.\n' +
                '**NO atiende:** Promociones, postulaciones, VIP, donaciones, reportes.\n\n' +

                '### <@&1542499817840844923> (Helper)\n' +
                'Ayuda a los miembros y colabora con tickets de consultas, alianzas y reportes (con superior).\n\n' +

                '### <@&1542499752183070861> (Moderador)\n' +
                'Mantiene el orden, supervisa canales y atiende reportes, alianzas, consultas y donaciones.\n\n' +

                '📖 **Guía de Sanciones:** Cada staff usa palabra clave (ej. fyp, xos). Spam masivo = 2h | Spam = 1h | Raid = ban | nsfw = mute y warn.'
            )
            .setFooter({ text: 'Sky Bot • Panel del Staff' })
            .setTimestamp();

        await interaction.reply({ embeds: [embedStaff] });
    }
});

// Evento Anti-Ping al Owner y Mute automático de 10 segundos
client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.guild) return;

    if (message.mentions.has(OWNER_ID)) {
        try {
            await message.reply('¡Hey, No hagas ping al owner!');

            const member = message.member;

            if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return;
            if (!member.moderatable) return;

            // Timeout de 10 segundos
            await member.timeout(10 * 1000, 'Hacer ping al owner del servidor');

        } catch (error) {
            console.error('Error al intentar mutear:', error);
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
