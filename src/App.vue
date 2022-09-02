<template>
	<h2>PZ Server Mod Assistant</h2>
	<p>This will help you organize the mods that you want enabled in your PZ server</p>
	<!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
	<div class="new-mod-form p-2">
		<label for="">Mod Name</label>
		<input
			class="bg-slate-200 m-2"
			v-model="inputData.inputName"
			type="text"
		>
		<label for="">Mod Id</label>
		<input
			class="bg-slate-200 m-2"
			v-model="inputData.inputId"
			type="text"
		>
		<button
			class="bg-slate-200 m-2"
			@click="addMod"
		>Add</button>
	</div>

	name={{inputData.inputName}}
	<div class="mod-list-container">
		<div
			v-for="(mod,index) in modList"
			:key="index"
		>{{mod.name}}-{{mod.id}}</div>
	</div>

</template>



<script>
import { ref } from "vue";

export default {
	setup() {
		const inputData = ref({ inputName: "", inputId: "" });
		const modList = ref([]);
		function addMod() {
			modList.value.push({
				name: inputData.value.inputName,
				id: inputData.value.inputId,
			});
		}

		return {
			modList,
			inputData,
			addMod,
		};
	},

	mounted() {},
};
</script>

<style>
</style>
