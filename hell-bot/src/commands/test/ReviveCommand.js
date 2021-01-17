const BaseCommand = require('../../utils/structures/BaseCommand');
const fs = require('fs');
const { send } = require('process');
const { waitForDebugger } = require('inspector');
const userData = JSON.parse(fs.readFileSync('./storage/userData.json', 'utf8'));

module.exports = class ReviveCommand extends BaseCommand {
  constructor() {
    super('revive', 'revive', []);
  }

  async run(client, message, args) {
    var reviver = message.member.user.id;
    var revivee = undefined; 
    if (message.mentions.users.first() != undefined) {
        revivee = message.mentions.users.first().id; 
    }
    var diceRoll1 = Math.floor( Math.random() * 6 ) +1;
    var diceRoll2 = Math.floor( Math.random() * 6 ) +1; //Rolls two D6.
    var sumRoll = diceRoll1 + diceRoll2;

    if (!userData[reviver]) userData[reviver] = { //If they haven't been in the system, this will add them to the list.
        murderAttempt: 0,
        murderSuccess: 0,
        deathAttempt: 0,
        deathSuccess: 0,
        suicideAttempt: 0,
        suicideSuccess: 0,
        reviveAttempt: 0,
        reviveSuccess: 0,
        layer: 0
    }
    if (!userData[revivee]) userData[revivee] = { //If they haven't been in the system, this will add them to the list.
        murderAttempt: 0,
        murderSuccess: 0,
        deathAttempt: 0,
        deathSuccess: 0,
        suicideAttempt: 0,
        suicideSuccess: 0,
        reviveAttempt: 0,
        reviveSuccess: 0,
        layer: 0
    }

    userData[reviver].reviveAttempt++;  //Increments attempt by one on valid command.
    if (revivee !== undefined) { //Checks if user mentioned anyone in their revive command.
        if (sumRoll == 12) {
            userData[revivee].reviveSuccess+=2;
            userData[revivee].deathSuccess-=2;
            userData[revivee].layer-=2;
            message.channel.send('You rolled a '+ diceRoll1 +' and ' + diceRoll2 +'. '+
                                 '\nYou rolled a **' + sumRoll + '**.'+
                                 '\n**CRITICAL REVIVE.**'+
                                 '\n<@' + revivee + '> has revived twice.'); //Crit roll.

        } else if (sumRoll >= 8){
            userData[revivee].reviveSuccess++;
            userData[revivee].deathSuccess--;
            userData[revivee].layer--;
            message.channel.send('You rolled a '+ diceRoll1 +' and ' + diceRoll2 +'. '+
                                 '\nYou rolled a **' + sumRoll +'**.'+
                                 '\nYou have successfully revived <@' + revivee + '>.'); //High roll.
        
        } else if (sumRoll >= 3){
            message.channel.send('You rolled a '+ diceRoll1 +' and ' + diceRoll2 +'. '+
                                 '\nYou rolled a **' + sumRoll +'**.'+
                                 '\nYou have failed your revive attempt.'); //Low roll.

        } else if (sumRoll == 2){
            userData[revivee].deathSuccess++;
            userData[revivee].layer++;
            message.channel.send('You rolled a '+ diceRoll1 +' and ' + diceRoll2 +'. '+
                                 '\nYou rolled a **' + sumRoll + '**.'+
                                 '\n**CRITICAL FAILURE.** You killed <@' + revivee + '>. '+
                                 '\nWhy would you do that?'); //Crit fail.
        }
    } else {  //Revives yourself if you don't mention anyone.
        if (sumRoll == 12) {
            userData[reviver].reviveSuccess+=2;
            userData[reviver].deathSuccess-=2;
            message.channel.send('You rolled a '+ diceRoll1 +' and ' + diceRoll2 +'. '+
                                 '\nYou rolled a **' + sumRoll + '**.'+
                                 '\n**CRITICAL REVIVE.**'+
                                 '\nYou have revived twice. :)'); //Crit roll.

        } else if (sumRoll >= 8){
            userData[reviver].reviveSuccess++;
            userData[reviver].deathSuccess--;
            message.channel.send('You rolled a '+ diceRoll1 +' and ' + diceRoll2 +'. '+
                                 '\nYou rolled a **' + sumRoll + '**.'+
                                 '\nYou have successfully revived yourself.'); //High roll.
        
        } else if (sumRoll >= 3){
            message.channel.send('You rolled a '+ diceRoll1 +' and ' + diceRoll2 +'. '+
                                 '\nYou rolled a **' + sumRoll + '**.'+
                                 '\nYou have failed your revive attempt on yourself.'); //Low roll.

        } else if (sumRoll == 2){
            userData[reviver].deathSuccess++;
            message.channel.send('You rolled a '+ diceRoll1 +' and ' + diceRoll2 +'. '+
                                 '\nYou rolled a **' + sumRoll + '**.'+
                                 '\n**CRITICAL FAILURE.** You die.'); //Crit fail.
        } 
    } 

    fs.writeFile('./storage/userData.json', JSON.stringify(userData), (err) => { //Records stat.
        if(err) console.error(err);
    });
    }
}   