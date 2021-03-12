const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.


describe("Rover class", function() {

  // 7 tests here!
	it("constructor sets position and default values for mode and generatorWatts", function() {
		let rover = new Rover(1);
    	expect(rover.mode).toEqual('NORMAL');
		expect(rover.generatorWatts).toEqual(110);
		expect(rover.position).toEqual(1);
	})

	it("response returned by receiveMessage contains name of message", function() {
		let rover = new Rover(12);
		let commands = [new Command('STATUS_CHECK'), new Command('MOVE', 20)];
		let newMessage = new Message('Hello World', commands)
		
		let response = rover.receiveMessage(newMessage)

		expect(response.message).toEqual('Hello World')
	})
	
	it("response returned by receiveMessage includes two results if two commands are sent in the message", function() {
		let rover = new Rover(123);
		let commands = [new Command('STATUS_CHECK'), new Command('MOVE', 20)];
    	let message = new Message('Test message with two commands', commands);
		let response = rover.receiveMessage(message)

		expect(response.results.length).toEqual(2)
	})

	it("responds correctly to status check command", function() {
		let rover = new Rover(1234);
		let commands = [new Command('STATUS_CHECK')];
    	let message = new Message('Another message!', commands);
		let response = rover.receiveMessage(message)

		expect(response).toEqual(
			{message: 'Another message!',
			results: [ 
				{ completed: true, 
				roverStatus: { mode: 'NORMAL', generatorWatts: 110, position: 1234 }
				}]
			}
		)
	})

	it("responds correctly to mode change command", function() {
		let rover = new Rover(12345);
		let commands = [new Command('MODE_CHANGE', 'LOW_POWER')];
    	let message = new Message('Whats up?', commands);
		let response = rover.receiveMessage(message)

		expect(response.results[0].completed).toEqual(true)

		expect(rover.mode).toEqual('LOW_POWER')
	})

	it("responds with false completed value when attempting to move in LOW_POWER mode", function() {
		let rover = new Rover(123456);
		let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('MOVE', 20)];
    	let message = new Message('Lets Go!', commands);
		let response = rover.receiveMessage(message)

		expect(response.results[1].completed).toEqual(false)

		expect(rover.position).toEqual(123456)
	})

	it("responds with position for move command", function() {
		let rover = new Rover(1234567);
		let commands = [new Command('MODE_CHANGE', 'NORMAL'), new Command('MOVE', 20)];
    	let message = new Message('Now Lets Go!', commands);
		rover.receiveMessage(message)

		expect(rover.position).toEqual(20)
	})

});
