const BaseCommand = require('../../utils/structures/BaseCommand');
const fs = require('fs');
const { send } = require('process');
const { waitForDebugger } = require('inspector');
var userData = JSON.parse(fs.readFileSync('./storage/userData.json', 'utf8'));

module.exports = class KillCommand extends BaseCommand {
  constructor() {
    super('kill', 'murder', []);
  }

  async run(client, message, args) {
    var murderer = message.member.user.id;
    var victim = message.mentions.users.first().id; // Sets victim.
    var diceRoll1 = Math.floor( Math.random() * 6 ) +1;
    var diceRoll2 = Math.floor( Math.random() * 6 ) +1; //Rolls two D6.
    var sumRoll = diceRoll1 + diceRoll2;

    if (!userData[murderer]) userData[murderer] = { //If they haven't attempted a murder, this will add them to the list.
        murderAttempt: 0,
        murderSuccess: 0,
        deathAttempt: 0,
        deathSuccess: 0
    }
    if (!userData[victim]) userData[victim] = { //If they haven't been attempted to get killed yet, this will add them to the list.
        murderAttempt: 0,
        murderSuccess: 0,
        deathAttempt: 0,
        deathSuccess: 0
    }

    if (victim !== undefined) { //Checks if user mentioned anyone in their kill command.
        userData[murderer].murderAttempt++; //Increments attempt by one on valid command.
        userData[victim].deathAttempt++;

        if (sumRoll == 12) {
            userData[murderer].murderSuccess++;
            userData[murderer].murderSuccess++;
            userData[victim].deathSuccess++;
            userData[victim].deathSuccess++;
            fs.writeFile('./storage/userData.json', JSON.stringify(userData));
            message.channel.send('You rolled a '+ diceRoll1 +' and ' + diceRoll2 +'. \nYou have critically murdered. <@'+ victim + '> has died ' + userData[victim].deathSuccess + ' time(s).'); //Crit roll.

        } else if (sumRoll >= 8){
            userData[murderer].murderSuccess++;
            userData[victim].deathSuccess++;
            fs.writeFile('./storage/userData.json', JSON.stringify(userData));
            message.channel.send('You rolled a '+ diceRoll1 +' and ' + diceRoll2 +'. \nYou have successfully murdered. <@'+ victim + '> has died ' + userData[victim].deathSuccess + ' time(s).'); //High roll.
        
        } else if (sumRoll >= 3){
            message.channel.send('You rolled a '+ diceRoll1 +' and ' + diceRoll2 +'. \nYou have failed your murder attempt.'); //Low roll.

        } else if (sumRoll == 2){
            userData[murderer].deathAttempt++;
            userData[murderer].deathSuccess++;
            fs.writeFile('./storage/userData.json', JSON.stringify(userData));
            message.channel.send('You rolled a '+ diceRoll1 +' and ' + diceRoll2 +'. \nYou have critically failed. You die. <@'+ murderer + '> has died ' + userData[murderer].deathSuccess + ' time(s).'); //Crit fail.
        }
    } else {
        message.channel.send('You did not mention anyone. Please try again.')
    }

    fs.writeFile('./storage/userData.json', JSON.stringify(userData), (err) => { //Records murder stat.
        if(err) console.error(err);
    });
}}   