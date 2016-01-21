// "npm start" to launch the generation
import ioServer from 'socket.io';
import _ from 'lodash';

export class PrettyGoodChat {
	constructor() {
		this.io = ioServer.listen(8080);
		this.users = [];
		this.indexId = 0;

		this.io.on('connection', (socket) => {
			this.indexId++;

			// create the current user
			let user = {
				id: this.indexId,
				name: `User ${this.indexId}`,
				time: 0
			};

			console.log(`"User ${this.indexId}" is connected`);

			// save the current user into users array
			this.users.push(user);

			// pass users array to current user
			socket.emit('init', this.users);

			// tell others users that a new one has join
			socket.broadcast.emit('user-connected', user);

			// when the current user is disconnected
			socket.on('disconnect', () => {
				console.log('user disconnected');

				// remove current user from users list
				_.remove(this.users, (u) => {
					return u.id === user.id;
				});

				// notice all users that current user has been disconnected
				socket.broadcast.emit('user-disconnected', user);
			});
		});
	}
}
