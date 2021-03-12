const Message = require('./message.js');
const Command = require('./command.js');

class Rover {
   // Write code here!
   constructor(position) {
	   this.position = position;
	   this.mode = 'NORMAL';
	   this.generatorWatts = 110;
   }

   receiveMessage(message) {
	   
	   let commandList = message.commands

	   let result = {
		   message: message.name,
		   results: []
	   }

		for (let i = 0; i < commandList.length; i++ ) {
			if (commandList[i].commandType === 'STATUS_CHECK') {

				let roverStatus = {
					mode: this.mode,
					generatorWatts: this.generatorWatts,
					position: this.position,
				}

				let fullStatus = {
					completed: true,
					roverStatus:roverStatus
				}

				result.results.push(fullStatus)

			} if (commandList[i].commandType === 'MODE_CHANGE') {
				this.mode = commandList[i].value;
				let complete = {completed: true}
				result.results.push(complete)

			} if (commandList[i].commandType === 'MOVE') {
				if (this.mode != 'LOW_POWER') {
					this.position = commandList[i].value
					
					let complete = {completed: true}
					result.results.push(complete)

				} else {
					let fail = {completed: false}
					result.results.push(fail)
				}
			} 
		}

	   return result
   }
}

module.exports = Rover;

