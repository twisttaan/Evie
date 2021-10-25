"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// require the needed discord.js classes
const { Client, Intents, Collection } = require("discord.js");
const fs = require("fs");
require("dotenv").config();
const DisTube = require("distube").default;
const voice = require("@discordjs/voice");
const ffmpeg = require("ffmpeg-static");
// Create a new Player (you don't need any API Key)
// create a new Discord client
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        "GUILD_MESSAGES",
        "GUILD_MEMBERS",
        Intents.FLAGS.GUILD_VOICE_STATES,
    ],
}, { shardCount: "auto" });
client.tristan = "Hey, This is a test!";
client.allEmojis = require("./botconfig/emojis.json");
client.commands = new Collection();
client.Ecommands = new Collection();
const eventFiles = fs
    .readdirSync("./events")
    .filter((file) => file.endsWith(".js"));
// Load Events
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    }
    else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}
// discord-music-player
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
client.distube = new DisTube(client, {
    emitNewSongOnly: false,
    leaveOnEmpty: false,
    leaveOnFinish: false,
    leaveOnStop: false,
    savePreviousSongs: true,
    emitAddSongWhenCreatingQueue: false,
    //emitAddListWhenCreatingQueue: false,
    searchSongs: 0,
    // youtubeCookie: config.youtubeCookie,     //Comment this line if you dont want to use a youtube Cookie
    // nsfw: true, //Set it to false if u want to disable nsfw songs
    emptyCooldown: 25,
    ytdlOptions: {
        //requestOptions: {
        //  agent //ONLY USE ONE IF YOU KNOW WHAT YOU DO!
        //},
        highWaterMark: 1024 * 1024 * 64,
        quality: "highestaudio",
        format: "audioonly",
        liveBuffer: 60000,
        dlChunkSize: 1024 * 1024 * 64,
    },
    youtubeDL: true,
    updateYouTubeDL: true,
    //  customFilters: filters,
    plugins: [
        //new SpotifyPlugin(spotifyoptions),
        new SoundCloudPlugin(),
    ],
});
// Money
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();
CurrencySystem.cs.on("debug", (debug, error) => {
    console.log(debug);
    if (error)
        console.error(error);
});
// Status
client.once("ready", () => {
    setInterval(() => {
        const activities_list = [
            `${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)} users`,
            `ur slash commands`,
            //``
        ];
        const index = Math.floor(Math.random() * (activities_list.length - 1) + 1);
        client.user.setActivity(activities_list[index], { type: "LISTENING" });
    }, 50000); //Timer
});
cs.setMongoURL("mongodb+srv://evie:IHgatYyirF8IIuJs@cluster0.dobcl.mongodb.net/mongoeconomy");
//sets default wallet amount when ever new user is created.
cs.setDefaultWalletAmount(100);
//sets default bank amount when ever new user is created.
cs.setDefaultBankAmount(1000);
// Error Message for Commands
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand())
        return;
    const command = client.commands.get(interaction.commandName);
    if (!command)
        return;
    try {
        await command.execute(interaction);
    }
    catch (error) {
        console.error(error);
        await interaction.reply({
            content: "Something went wrong! Please alert this to staff in <#884223699778150400> on https://discord.gg/SQhdgXV3rh",
            ephemeral: true,
        });
    }
});
// Load Commands
const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
}
const EcommandFiles = fs
    .readdirSync("./Ecommands")
    .filter((file) => file.endsWith(".js"));
for (const file of EcommandFiles) {
    const Ecommand = require(`./Ecommands/${file}`);
    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.Ecommands.set(Ecommand.data.name, Ecommand);
}
client.login(process.env.CLIENT_TOKEN);
