const BaseCommand = require('../../utils/structures/BaseCommand');
const fs = require('fs');
const { send } = require('process');
const { waitForDebugger } = require('inspector');
const userData = JSON.parse(fs.readFileSync('./storage/userData.json', 'utf8'));

module.exports = class SuicideCommand extends BaseCommand {
    constructor() {
      super('suicide', 'suicide', []);
    }
  
    async run(client, message, args) {
      var suicide = message.member.user.id; //Person who wrote the message
      var diceRoll1 = Math.floor( Math.random() * 6 ) +1;
      var diceRoll2 = Math.floor( Math.random() * 6 ) +1; //Rolls two D6.
      var sumRoll = diceRoll1 + diceRoll2; //Adds the two rolls
  
      if (!userData[suicide]) userData[suicide] = { //If they haven't been in the system, this will add them to the list.
          murderAttempt: 0,
          murderSuccess: 0,
          deathAttempt: 0,
          deathSuccess: 0,
          suicideAttempt: 0,
          suicideSuccess: 0,
          reviveAttempt: 0,
          reviveSuccess: 0
      }

        userData[suicide].deathAttempt++;
        userData[suicide].suicideAttempt++;
        if (sumRoll == 12) {
            userData[suicide].suicideSuccess+=2;
            userData[suicide].deathSuccess+=2;
            //fs.writeFile('./storage/userData.json', JSON.stringify(userData));
            message.channel.send('You rolled a '+ diceRoll1 +' and ' + diceRoll2 +'. \nYou rolled a **' + sumRoll + '**.\n**CRITICAL SUICIDE.**'); //Crit roll.

        } else if (sumRoll >= 8){
            userData[suicide].suicideSuccess++;
            userData[suicide].deathSuccess++;
            //fs.writeFile('./storage/userData.json', JSON.stringify(userData));
            message.channel.send('You rolled a '+ diceRoll1 +' and ' + diceRoll2 +'. \nYou rolled a **' + sumRoll + '**.\nYou have successfully killed yourself.'); //High roll.
        
        } else if (sumRoll >= 3){
            message.channel.send('You rolled a '+ diceRoll1 +' and ' + diceRoll2 +'. \nYou rolled a **' + sumRoll + '**.\nYou have failed your suicide attempt.'); //Low roll.

        } else if (sumRoll == 2){
            userData[suicide].deathSuccess--;
            //fs.writeFile('./storage/userData.json', JSON.stringify(userData));
            message.channel.send('You rolled a '+ diceRoll1 +' and ' + diceRoll2 +'. \nYou rolled a **' + sumRoll + '**.\n**CRITICAL FAILURE.** You revive.'); //Crit fail.
        } else {
            message.channel.send('Error.')
        }

    fs.writeFile('./storage/userData.json', JSON.stringify(userData), (err) => { //Records murder stat.
        if(err) console.error(err);
    });
    }
}