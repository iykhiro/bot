const { Client, GatewayIntentBits, REST, Routes, ApplicationCommandOptionType } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
    console.log(`Bot conectado como ${client.user.tag}`);

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    try {
        console.log('Iniciando registro de comandos de slash.');

        await rest.put(
            Routes.applicationCommands(client.user.id),
            {
                body: [
                    {
                        name: 'avatar',
                        description: 'Mostra o avatar do usuário selecionado ou de quem executou o comando.',
                        options: [
                            {
                                name: 'user',
                                description: 'Selecione um usuário.',
                                type: ApplicationCommandOptionType.User,
                                required: false
                            }
                        ]
                    }
                ],
            }
        );

        console.log('Comandos registrados com sucesso.');
    } catch (error) {
        console.error('Erro ao registrar comandos:', error);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === 'avatar') {
        const user = options.getUser('user') || interaction.user;
        await interaction.reply({
            content: user.displayAvatarURL({ dynamic: true, size: 1024 }),
            ephemeral: true
        });
    }
});

client.login(process.env.DISCORD_TOKEN);