<script lang="ts">
	import SvelteMarkdown from 'svelte-markdown';
	import { fade, slide } from 'svelte/transition';
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	let showPasswordPrompt: boolean = false;
	const version = __VERSION__;
	let id_value: string = '';
	let password_value: string | any;
	let doc_content: string;
	let error_str: string | undefined;
	let showDocContent: boolean = false;
	let showHelpBox: boolean = false;
	let helpContent: string;

	async function fetchDocFromId(id: string, password: string | any) {
		try {
			let docResponse: any;
			if (!password) {
				docResponse = await fetch(`/api/v0/doc?id=${id}`);
			} else {
				docResponse = await fetch(`/api/v0/doc?id=${id}&password=${password}`);
			}
			if (docResponse.status == 403) {
				error_str =
					error_str !== 'Password protected document!' && error_str !== 'Wrong password'
						? 'Password protected document!'
						: (error_str = 'Wrong password');
				console.log(
					`Uh oh! The api returned an error: \n\tError: ${error_str}\n\tCode: ${docResponse.status}\n\n(I have a feeling you know what you're doing if youre taking a look here, thats why I include this funny message! Cheers :-D)`
				);
				showPasswordPrompt = true;
				password = true;
				return;
			}
			if (docResponse.status == 404) {
				error_str = 'This document doesnt exist!';
				return;
			}
			if (docResponse.status != 200) {
				error_str = 'Unknown error occurred';
				return;
			} else {
				let docJson = await docResponse.json();
				doc_content = docJson.content;
				showDocContent = true;
				showPasswordPrompt = false;
			}
		} catch (error: Error | any) {
			if (error instanceof Error) {
				switch (error.message) {
					case 'Password Needed':
						showPasswordPrompt = true;
						break;
				}
			}
		}
	}

	async function submitInput() {
		if (id_value == '' || id_value === undefined) {
			error_str = 'Malformed input, ID is possibly missing';
			return;
		}
		let response = await fetchDocFromId(id_value, password_value);
		return response;
	}

	onMount(async () => {
		helpContent = await (await fetch('/help.md')).text();
		console.log('hey');
	});
</script>

<svelte:head>
	<link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght" rel="stylesheet" />
	<link rel="icon" type="image/svg" href="/key-white-solid.png" />
</svelte:head>

<!--Here's the prompt container!-->
{#if showDocContent == false}
	<div class="container">
		<div id="promptContainer" transition:slide={{ delay: 250, duration: 1000 }}>
			<button
				class="helpButton"
				on:click={() => {
					showHelpBox = !showHelpBox;
					console.log(helpContent);
				}}><Icon icon="material-symbols:help-outline" /></button
			>
			<!--Help button-->
			<form on:submit={submitInput}>
				<!--svelte-ignore a11y-label-has-associated-control-->
				<label>Welcome to the docs archive! <br />Enter your provided 10-character ID</label>
				<hr />
				<input placeholder="Enter your ID" bind:value={id_value} transition:slide />
				{#if showPasswordPrompt}
					<input
						id="passwordInput"
						transition:slide
						placeholder="Document password"
						bind:value={password_value}
					/>
				{/if}
				<br />
				<button class="submitButton">Submit</button>
				<!--svelte-ignore a11y-label-has-associated-control-->
				{#if error_str !== undefined && showDocContent == false}
					<br />
					<label transition:fade>{error_str}</label>
				{/if}
				<input type="submit" value="submit" />
			</form>
			{#if showHelpBox && showDocContent == false}
				<div transition:slide={{ delay: 600, duration: 600 }}>
					<SvelteMarkdown source={helpContent} />
				</div>
			{/if}
		</div>
	</div>
{/if}

{#if showDocContent}
	<div class="container">
		<div id="docContainer" transition:slide={{ delay: 1300, duration: 500 }}>
			<SvelteMarkdown source={doc_content} />
		</div>
	</div>
{/if}

<div class="infoText">
	<p style="all: unset;">This server is running Docsystem v{version}</p>
</div>

<style>
	input[type='submit'] {
		display: none;
	}

	.helpButton {
		all: unset;
		position: absolute;
		right: 10px;
		top: 5px;
		font-size: 20px;
		width: 20px;
		height: 20px;
		transition: 0.33s;
	}
	.helpButton:hover {
		opacity: 0.4;
	}

	.submitButton {
		margin: 5px;
		box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
		border-radius: 5%;
		border: 2px solid rgba(0, 0, 0, 0.24);
		font-family: 'Roboto Mono', monospace;
		transition: 0.33s;
	}
	.submitButton:hover {
		opacity: 0.8;
	}

	.infoText {
		position: fixed;
		bottom: 0;
		font-family: 'Roboto Mono', monospace;
		font-size: 0.8em;
		background-color: rgb(235, 232, 210);
		width: 100%;
		height: 15px;
		margin: 0;
	}

	#promptContainer {
		box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
		border-radius: 3%;
		border: 2px solid rgba(0, 0, 0, 0.24);
		width: 20%;
		font-family: 'Roboto Mono', monospace;
		max-height: calc(100vh - 200px);
		height: 15%;
		margin: auto;
		top: 100%;
		flex-direction: column;
		font-size: 1em;
		text-align: center;
		padding: 10px;
		background-color: rgb(235, 232, 210);
		position: relative;
		overflow-y: auto;
	}

	#docContainer {
		box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
		border-radius: 3%;
		border: 2px solid rgba(0, 0, 0, 0.24);
		width: 40%;
		font-family: 'Roboto Mono', monospace;
		max-height: 80%;
		height: 50%;
		margin: auto;
		top: 100%;
		display: flex;
		flex-direction: column;
		font-size: 1em;
		text-align: center;
		padding: 10px;
		background-color: rgb(235, 232, 210);
	}

	input {
		width: unset;
		height: unset;
		font: unset;
		color: unset;
		border: none;
		outline: none;
		box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
		border-radius: 4%;
		border: 2px solid rgba(0, 0, 0, 0.24);
		font-family: 'Roboto Mono', monospace;
	}

	.container {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
	}

	:global(body) {
		background-image: url('/bkg1.jpg');
		background-repeat: no-repeat;
		background-position: center center;
		background-attachment: fixed;
		margin: 0;
		height: 100%;
		overflow: hidden;
	}

	/**Mobile CSS Design*/
	@media (max-width: 600px) {
		#promptContainer {
			flex: 1;
			max-width: 90;
			margin: 10px;
		}
		#docContainer {
			flex: 1;
			max-width: 90;
			margin: 10px;
		}
	}

	@media (max-width: 1080px) {
		#promptContainer {
			flex: 1;
			max-width: 100;
			margin: 10px;
		}
		#docContainer {
			flex: 1;
			max-width: 100;
			margin: 10px;
		}
	}
</style>
