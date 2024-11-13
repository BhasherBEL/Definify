export async function searchDictionary(word: string) {
	const response = (await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)).json();

	return response;
}
