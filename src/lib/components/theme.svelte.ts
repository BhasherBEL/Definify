export type Theme = {
	dark: boolean;
};

let theme: Theme = $state({
	dark: false
});

export default theme;
