<template>
	<h2>PZ Server Mod Assistant</h2>
	<p>This will help you organize the mods that you want enabled in your PZ server</p>
	<!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
	{{demo}}
	<label for="">Mod Name</label>
	<input
		class="bg-slate-200"
		v-model="inputData.inputName"
		type="text"
	>
	<label for="">Mod Id</label>
	<button class="bg-slate-200">Add</button>
	name={{inputData.inputName}}
</template>

<script>
import { ref } from "vue";

export default {
	setup() {
		const inputData = ref({ inputName: "demoName", inputId: "123" });
		const demo = ref(0);
		// expose to template and other options API hooks
		return {
			demo,
			inputData,
		};
	},

	mounted() {},
};
</script>

<style>
#app {
}
</style>
