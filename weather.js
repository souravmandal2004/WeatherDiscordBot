const {SlashCommandBuilder, EmbedBuilder} = require ("discord.js");
const weather = require ("weather-js");

module.exports = {
    data: new SlashCommandBuilder ()
    .setName ('Weather')
    .setDescription ("Gets the weather of the given area")
    .addStringOption (option => option.setName ("location").setDescription ("The location to check the weather of").setRequired (true))
    .addStringOption (option => option.setName ("degree-type").setDescription ("Select what degree type you would like").addChoices ({name: "FahrenHeight", value: "F"}, {name:"Celcius", value: "C"}).setRequired (true)),
    async execute (interactions) {
        const {options} = interactions;
        const location = options.getString ("location");
        const degree = options.getString ("degree-type");

        await interactions.reply ( {content: `<a:Loading:1087045463980658751> Gathering your weather data...`});

        await weather.find ({ search: `${location}`, degreeType: `${degree}`}, async function (error, result) {
            setTimeout ( () => {
                if (error) {
                    console.log (error);
                    interactions.editReply ( {content: `${error} | Because we are pulling data, sometimes timeouts happen! Try this command again.`});
                }
                else {
                    if (result.length == 0) {
                        return interactions.editReply ({content: `{I coudn't find the weather of ${location}!}`});
                    }
                    else {
                        const temp = result[0].current.temperature;
                        const type = result[0].current.skytext;
                        const name = result[0].location.name;
                        const feel = result[0].current.feelslike;
                        const icon = result[0].current.imageUrl;
                        const wind = result[0].current.winddisplay;
                        const day = result[0].current.day;
                        const alert = result[0].location.alert || "None";

                        const embed = new EmbedBuilder ()
                        .setColor ("Blue")
                        .setTitle (`Current weather of ${name}`)
                        .addFields ({name: "Temperature", value: `${temp}`})
                        .addFields ({name: "Feels like", value: `${feel}`})
                        .addFields ({name: "Weather", value: `${type}`})
                        .addFields ({name: "Current alerts", value: `${alert}`})
                        .addFields ({name: "Week day", value: `${day}`})
                        .addFields ({name: "Wind speed & direction", value: `${wind}`})
                        .setThumbnail (icon)

                        interactions.editReply ({ content:"", embeds: [embed]});
                    }
                }
            }, 2000);
        })
    }   
}