<script lang="ts">
	import { goto } from '$app/navigation';
	import { username } from '$lib/store';
	import { get } from 'svelte/store';
	import { joinRoom, selfId } from 'trystero';

	if ($username === '') goto('/');

	type PeerProfile = {
		id: string;
		name: string;
		joined: number;
	};

	let messageLog: string[] = [];
	let rawMessage = '';

	const config = { appId: 'tttest' };
	const room = joinRoom(config, 'room0');

	let peerList: PeerProfile[] = [];
	const [sendProfile, getProfile] = room.makeAction('profile');
	const [sendMessage, getMessage] = room.makeAction('message');

	const selfProfile: PeerProfile = {
		id: selfId,
		name: $username,
		joined: Date.now()
	};

	let selfJoined = false;

	room.onPeerJoin((peerId) => {
		sendProfile(selfProfile, peerId);
		selfJoined = true;
	});

	room.onPeerLeave((peerId) => {
		let leaver = peerList.find((peer) => peer.id === peerId);
		messageLog = [...messageLog, `${leaver?.name} has left`];
		selfJoined = false;
		peerList = peerList.filter((peer) => peer.id != leaver?.id);
	});

	getProfile((data, peerId) => {
		let otherProfile = data as PeerProfile;
		peerList = [...peerList, otherProfile];
		if (otherProfile.joined > selfProfile.joined) {
			messageLog = [...messageLog, `${otherProfile.name} has joined`];
		}
	});

	getMessage((data, peerId) => {
		let recievedMessage = data as string;
		let sender = peerList.find((peer) => peer.id === peerId)?.name;
		messageLog = [...messageLog, `${sender}: ${recievedMessage}`];
	});
</script>

<div style="display: flex; width: 100%;">
	<div style="flex-grow: 1; margin: 5px;">
		Peers:
		<ul>
			{#each peerList as peer}
				<li>{peer.name}</li>
			{/each}
		</ul>
	</div>

	<div style="flex-grow: 1;">
		<input type="text" bind:value={rawMessage} />
		<button
			on:click={() => {
				sendMessage(rawMessage);
				messageLog = [...messageLog, `me: ${rawMessage}`];
				rawMessage = '';
			}}
			>Send
		</button>
		<button
			on:click={() => {
				room.leave();
				goto('/');
			}}
			>Leave Room
		</button>
		<span
			>{selfJoined
				? `Connected with ${peerList.length} peers!`
				: 'Waiting for a peer to join this room...'}</span
		>

		<ul>
			{#each messageLog as message}
				<li>{message}</li>
			{/each}
		</ul>
	</div>
</div>
