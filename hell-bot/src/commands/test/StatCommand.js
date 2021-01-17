const BaseCommand = require('../../utils/structures/BaseCommand');
const fs = require('fs');
const { send } = require('process');
const { waitForDebugger } = require('inspector');
const userData = JSON.parse(fs.readFileSync('./storage/userData.json', 'utf8'));

module.exports = class TestCommand extends BaseCommand {
  constructor() {
    super('stats', 'statistics', []);
  }

  async run(client, message, args) {
    var mentionless = message.member.user.id;
    var hasMention = undefined; 
    if (message.mentions.users.first() != undefined) {
        hasMention = message.mentions.users.first().id; 
    }

    if (!userData[mentionless]) userData[mentionless] = { //If they haven't been in the system, this will add them to the list.
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
    if (!userData[hasMention]) userData[hasMention] = { //If they haven't been in the system, this will add them to the list.
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

    if (hasMention !== undefined) {    //Stats for mentioning someone
      message.channel.send('They are currently in layer ' + userData[hasMention].layer +' of hell.'+
                           '\nThere has been ' + userData[hasMention].deathAttempt + ' attempts on their life.'+
                           '\nThey have died ' + userData[hasMention].deathSuccess + ' times.'+
                           '\n\nThey have attempted ' + userData[hasMention].murderAttempt + ' murders.' +
                           '\nThey have gotten ' + userData[hasMention].murderSuccess + ' kills.' +
                           '\n\nThey have attempted ' + userData[hasMention].reviveAttempt + ' revives.' +
                           '\nThey have gotten revived ' + userData[hasMention].reviveSuccess + ' times.');
    } else{ //checks stats for you if you don't mention anyone.
      message.channel.send('You are currently in layer ' + userData[mentionless].layer +' of hell.'+
                           '\nThere has been ' + userData[mentionless].deathAttempt + ' attempts on your life.'+
                           '\nYou have died ' + userData[mentionless].deathSuccess + ' times.'+
                           '\n\nYou have attempted ' + userData[mentionless].murderAttempt + ' murders.' +
                           '\nYou have gotten ' + userData[mentionless].murderSuccess + ' kills.' +
                           '\n\nYou have attempted ' + userData[mentionless].reviveAttempt + ' revives.' +
                           '\nYou have gotten revived ' + userData[mentionless].reviveSuccess + ' times.');
    }
  }
}