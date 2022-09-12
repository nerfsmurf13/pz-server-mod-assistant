<template>
	<h2 class="text-2xl p-4">PZ Server Mod Assistant</h2>
	<p class="p-4">This will help you when configuring your Project Zomboid's server.ini file for mods</p>
	<form @submit.prevent="submitMod">
		<fieldset class="new-mod-form p-2 px-4 shadow border flex flex-col m-1 rounded">
			<div class="flex flex-col mb-2">
				<label for="">Mod Name:</label>
				<input
					class="bg-slate-200 pl-2 rounded"
					v-model.trim="inputData.inputName"
					type="text"
				>
			</div>
			<div class="flex flex-col mb-2">
				<label for="">Workshop ID:</label>
				<input
					class="bg-slate-200 pl-2 rounded"
					v-model.number="inputData.inputId"
					type="number"
				>
			</div>
			<div class="">
				<label for="">Mod Id(s):</label>
				<div class="flex flex-col">
					<input
						v-for="(wsName,index) in inputData.workshopName"
						class="bg-slate-200 mb-2 pl-2 rounded"
						:key='index'
						v-model.trim="inputData.workshopName[index].name"
						type="text"
					>
				</div>
				<div>
					<div class="flex flex-col">
						<button
							:disabled="inputData.workshopName.length==1"
							:class="{'bg-red-100 text-gray-500':inputData.workshopName.length==1}"
							@click="removeModId"
							class="bg-red-500 text-white w-full text-center mb-2 rounded"
						>Remove Mod ID</button>
					</div>
					<div>
						<button
							class="bg-blue-500 text-white w-full text-center mb-2 rounded"
							@click="addModId"
						>Add Mod ID</button>
					</div>
				</div>

			</div>
			<div class="w-full flex">
				<button
					class="flex bg-green-500 text-white w-full text-center mb-2 h-10 justify-center items-center rounded"
					type="submit"
				>Add</button>
			</div>

		</fieldset>
	</form>
	<div class="mod-list-container max-w-[1024px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-4 px-2">
		<!-- <ModCard
			v-for="(mod,index) in modList"
			:mod="mod"
			:key="index"
		/> -->
		<div
			v-for="(mod,index) in modList"
			:key="index"
			class="flex flex-col bg-gray-100 p-4 w-full border shadow grow overflow-hidden"
		>
			<div class="card-mod-title flex flex-col">
				<a
					:href='workshopUrl(mod.id)'
					target="_blank"
					class="underline"
				>{{mod.name}}</a>
				{{mod.id}}
			</div>
			<div class="grow">
				<div
					class="mod-mod-list rounded p-1 my-1 bg-red-500 text-white"
					:class="{'bg-green-500' : subMod.active}"
					@click="updateData;subMod.active=!subMod.active"
					v-for="(subMod,index) in mod.workshopName"
					:key="index"
				>
					<span>{{subMod.name}}</span>
				</div>
			</div>

			<div class="w-full flex pt-2">
				<button
					@click="removeMod(mod.id)"
					class="bg-red-500 text-white p-2 rounded mx-auto"
				>Remove Mod
				</button>
			</div>
		</div>
	</div>
	<div class="mod-raw-text w-full">
		<button
			@click="copyModsString(modsString)"
			class="outline outline-1 rounded p-2 my-2"
		>Copy Mods</button>
		<textarea
			v-model="modsString"
			type=""
			rows="6"
			name=""
			:readonly="true"
			class="w-full bg-slate-200 font-mono p-1"
		></textarea>
	</div>
	<div class="id-raw-text w-full">
		<button
			@click="copyIdsString(idsString)"
			class="outline outline-1 rounded p-2 my-2"
		>Copy Workshop Items</button>
		<textarea
			v-model="idsString"
			type=""
			rows="6"
			name=""
			:readonly="true"
			class="w-full bg-slate-200  font-mono p-1"
		></textarea>
	</div>
</template>



<script>
import { ref, computed, watch } from "vue";
// import ModCard from "./components/ModCard.vue";

export default {
	// components: { ModCard },
	setup() {
		const inputData = ref({
			inputName: "",
			inputId: "",
			workshopName: [{ name: "", active: true }],
		});
		const modList = ref([]);
		let rawIds = ref("ids=");
		let rawMods = ref("mods=");

		function saveMods() {
			const parsed = JSON.stringify(modList.value);
			localStorage.setItem("modList", parsed);
			console.log("Data Saved");
			// console.log(parsed);
		}

		//==========Mod Form Validation
		function submitMod() {
			console.log(inputData.value.inputName);
			console.log(inputData.value.inputId);
			console.log(inputData.value.workshopName[0].name);
			if (
				inputData.value.inputName &&
				inputData.value.inputId &&
				inputData.value.workshopName[0].name
			) {
				addMod();
			} else {
				console.log("Missing Data");
			}
		}

		function addMod() {
			modList.value.push({
				name: inputData.value.inputName,
				id: inputData.value.inputId,
				workshopName: inputData.value.workshopName,
				active: true,
			});
			// console.log(modList.value);
			inputData.value.inputName = "";
			inputData.value.inputId = "";
			inputData.value.workshopName = [{ name: "", active: true }];

			updateData();
		}

		function removeMod(x) {
			console.log(x);
			for (const key in modList.value) {
				if (x === modList.value[key].id) {
					modList.value.splice(key, 1);
				}
			}
			saveMods();
		}

		function rollCall() {
			let modString = "";
			let idString = "";
			for (const item of modList.value) {
				var activeCount = 0;
				for (const subitem of item.workshopName) {
					if (subitem.active) {
						activeCount = activeCount + 1;
						modString = modString + subitem.name + ",";
					}
				}
				if (activeCount) {
					idString = idString + item.id + ";";
				}
			}
			modString = "Mods=" + modString;
			rawMods.value = modString;
			idString = "WorkshopItems=" + idString;
			rawIds.value = idString;
		}

		//==========Generates the string of "Mods=" on the DOM
		const modsString = computed(() => {
			let list = "";
			if (modsStringArr.value.length > 0) {
				for (const mod of modsStringArr.value) {
					for (const subMod of mod.workshopName) {
						if (subMod.active) {
							list = list + subMod.name + ",";
						}
					}
				}
			}
			return "Mods=" + list;
		});

		const copyModsString = async (x) => {
			try {
				await navigator.clipboard.writeText(x);
				console.log("Mods Copied!");
			} catch ($e) {
				console.log($e);
			}
		};

		const idsString = computed(() => {
			let list = "";
			for (const mod of modsStringArr.value) {
				let pass = false;
				for (const subMod of mod.workshopName) {
					if (subMod.active) {
						pass = true;
					}
				}
				if (pass) {
					list = list + mod.id + ";";
				}
			}
			return "WorkshopItems=" + list;
		});

		const copyIdsString = async (x) => {
			try {
				await navigator.clipboard.writeText(x);
				console.log("WorkshopItems Copied!");
			} catch ($e) {
				console.log($e);
			}
		};

		const modsStringArr = computed(() => {
			return modList.value.filter((result) => {
				return result.active == true;
			});
		});

		function addModId() {
			inputData.value.workshopName.push({ name: "", active: true });
		}

		function removeModId() {
			inputData.value.workshopName.pop();
		}

		function workshopUrl(x) {
			return `https://steamcommunity.com/sharedfiles/filedetails/?id=${x}`;
		}

		function updateData() {
			setTimeout(() => {
				rollCall();
			}, 200);
			setTimeout(() => {
				saveMods();
			}, 300);
		}

		watch(
			() => [modsString.value],
			() => {
				updateData();
			}
			// const idsStringArr = computed(() => {
			// 	return modList.value.filter((result) => {
			// 		return result.active == true;
			// 	});
		);

		return {
			modList,
			inputData,
			addMod,
			rawIds,
			rawMods,
			modsString,
			idsString,
			workshopUrl,
			addModId,
			removeMod,
			saveMods,
			removeModId,
			rollCall,
			updateData,
			modsStringArr,
			copyModsString,
			copyIdsString,
			submitMod,
		};
	},

	mounted() {
		console.log("localStorage Loaded");
		// console.log(localStorage);
		if (localStorage.getItem("modList")) {
			try {
				this.modList = JSON.parse(localStorage.getItem("modList"));
			} catch (e) {
				localStorage.removeItem("modList");
			}
		}
	},
};
</script>

<style>
</style>
