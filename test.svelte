<script>
	let selected;
	
	const obj = {
		a: 123,
		b: "abc"
	}
	
	function selectChara() {
		console.log(selected);
	}
</script>

<h1>Select</h1>
<form on:submit|preventDefault={selectChara}>
	<h3>Character</h3>
	<select bind:value={selected}>
		<option value="123">test1</option>
		<option value="987">test2</option>
		<option value="xyz">test3</option>
	</select>
		<button type=submit>Submit</button>
</form>

<p>selected question {selected ? selected : '[waiting...]'}</p>