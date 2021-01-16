const BaseCommand = require('../../utils/structures/BaseCommand');
const fs = require('fs');
const { send } = require('process');
const { waitForDebugger } = require('inspector');
const userData = JSON.parse(fs.readFileSync('./storage/userData.json', 'utf8'));

module.exports = class TestCommand extends BaseCommand {
  constructor() {
    super('stat', 'statistics', []);
  }

  async run(client, message, args) {
    var mentionless = message.member.user.id;
    var hasMention = -1; 
    if (message.mentions.users.first() != undefined) {
        hasMention = message.mentions.users.first().id; 
    }
  }
}