import { joinRoom, type Room } from 'trystero';
import { get, writable } from 'svelte/store';

const createRoom = (appID: string) => {
  const { subscribe, set } = writable<Room | undefined>();
	let room: Room;

	return {
    subscribe,
		join: (roomId: string) => {
			room = joinRoom({ appId: appID }, roomId);
      set(room);
			console.log(room);
			room.onPeerJoin((peerId) => console.log(`${peerId} joined`));
			room.onPeerLeave((peerId) => console.log(`${peerId} left`));
			console.log(room.getPeers());
		}
	};
};

export const room = createRoom("abababa");

export const username = writable("")

export const messageLog = writable<string[]>([])