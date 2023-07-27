<script lang="ts">
	import { goto } from '$app/navigation';
	import { username } from '$lib/store';
</script>

<input type="text" bind:value={$username} />
<button
	on:click={() => {
		goto('/chat');
	}}>Join</button
>
