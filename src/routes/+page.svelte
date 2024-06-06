<script lang="ts">
	import SvelteMarkdown from 'svelte-markdown';
	import { fade, scale, slide } from 'svelte/transition';
	let showPasswordPrompt: boolean = false;
	let id_value: string = '';
	let form_submitted: boolean;
	let password_value: string | any;
	let doc_content: string;
	let error_str: string | undefined;
	let showDocContent: boolean = false;

	async function fetchDocFromId(id: string, password: string | any) {
		try {
			let docResponse: any;
			let docJson: any;
			if (!password) {
				docResponse = await fetch(`/api/v0/doc?id=${id}`);
			} else {
				docResponse = await fetch(`/api/v0/doc?id=${id}&password=${password}`);
			}
			if (docResponse.status == 403) {
                error_str = (error_str !== 'Password protected document!' && error_str !== 'Wrong password') ? 'Password protected document!' : error_str = 'Wrong password';
                console.log(error_str);
				showPasswordPrompt = true;
                password = true;
				return;
			}
            if (docResponse.status == 404) {
                error_str = "This document doesnt exist!";
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
			console.log('Hello');
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
		let response = await fetchDocFromId(id_value, password_value);
		return response;
	}
</script>

<svelte:head>
	<link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght" rel="stylesheet" />
</svelte:head>

<!--Here's the prompt container!-->
{#if showDocContent == false}
	<div class="container">
		<div id="promptContainer" transition:slide={{ delay: 250, duration: 1000}}>
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
				<!--svelte-ignore a11y-label-has-associated-control-->
				{#if error_str !== undefined && showDocContent == false}
					<br />
					<label transition:fade>{error_str}</label>
				{/if}
                <input type="submit" value="submit" />
			</form>
		</div>
	</div>
{/if}

{#if showDocContent}
	<div class="container">
		<div id="docContainer" transition:slide={{delay: 1300, duration: 500}}>
            <SvelteMarkdown source={doc_content}/>
		</div>
	</div>
{/if}

<style>
    input[type="submit"] {
        display: none;
    }
	#promptContainer {
		box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
		border-radius: 3%;
		border: 2px solid rgba(0, 0, 0, 0.24);
		width: 20%;
		font-family: 'Roboto Mono', monospace;
		max-height: 20%;
		height: 15%;
		margin: auto;
		top: 100%;
		flex-direction: column;
		font-size: 1em;
		text-align: center;
		padding: 10px;
		background-color: rgb(235, 232, 210);
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
</style>
