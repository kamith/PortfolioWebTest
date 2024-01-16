<script>
</script>

<button on:click>
	<slot></slot>
</button>

<style>
	button {
		color: white;
		background-color: green;
		border: none;
		padding: 10px 20px;
		font-size: 16px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	button:hover {
		background-color: darkgreen;
	}

	button:active {
		background-color: lightgreen;
	}

	button:focus {
		outline: none;
		box-shadow: 0 0 0 2px rgba(0, 128, 0, 0.5);
	}
</style>
  