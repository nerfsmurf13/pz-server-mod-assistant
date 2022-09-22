<template>
	<h2 class="my-4 text-2xl p-4 bg-pzLightbaige rounded border border-1 border-pzDark ">PZ Server Mod Assistant</h2>
	<p class="p-4 my-4 bg-pzLightbaige rounded border border-1 border-pzDark ">This will assist you when trying to find that perfect mix of mods for your Project Zomboid dedicated server. This keeps track of your mod selection so that you dont have to keep the mods in a spreadsheet somewhere to keep things organized.</p>
	<button
		class=" p-1 border border-1 border-pzDark rounded hover:bg-pzDark hover:text-white bg-pzPurple"
		@click="showHelp=!showHelp"
	>Toggle Help!</button>
	<div
		class="mx-8 p-4 my-4 bg-pzLightbaige rounded border border-1 border-pzDark "
		v-if="showHelp"
	>
		<ol class="px-4 mb-4">
			<li>Simply open up the mods you would like to add to your server in the Project Zomboid Workshop</li>
			<li>Copy Paste the name of the Mod into the "Mod Name" field</li>
			<li>On the workshop page, look for the "Workshop ID" and "Mod ID" and copy those values into the corresponding fields below</li>
			<li>If the mod has multiple Mod IDs, click the "Add Mod ID" button and enter the additional IDs</li>
			<li>When done, click "Add" and your mod should be listed</li>
			<li>If you want to enable/disable a Mod ID within a mod, just click on the Mod ID. Green = Enabled, Red = Disabled</li>
			<li>If you want to remove a mod altogether, click "Remove Mod"</li>
			<li>Once satisfied with your configuration, click "Copy Mods" to copy the Mods text to your clipboard. Then paste it to your server config file</li>
			<li>Then click "Copy Workshop Items" to copy the WorkshopItems text to your clipboard. Then paste it to your server config file</li>
		</ol>
		<p>The data is saved automatically to your browser with every change. If you clear your browser's cache, then your mod configuration on this website will be lost</p>
	</div>
	<form @submit.prevent>
		<fieldset class="new-mod-form p-2 px-4 shadow border border-pzDark flex flex-col mt-4 rounded bg-pzLightbaige">
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
					@click="submitMod"
				>Add</button>
			</div>
			<div
				v-if="log"
				class="bg-red-500 p-4 rounded text-white text-2xl"
			>
				{{log}}
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
			class="flex flex-col bg-pzLightbaige border-pzDark p-4 w-full border shadow grow overflow-hidden rounded"
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
				<button
					class="mod-mod-list rounded p-1 mb-1 mr-1 bg-pzGreen"
					:class="{'bg-pzRed' : !subMod.active}"
					@click="updateData;subMod.active=!subMod.active"
					v-for="(subMod,index) in mod.workshopName"
					:key="index"
				>
					<span>{{subMod.name}}</span>
				</button>
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
	<div class="mod-raw-text w-full mx-2">
		<button
			@click="copyModsString(modsString)"
			class="border border-1 border-pzDark rounded hover:bg-pzDark hover:text-white bg-pzPurple  p-2 my-2"
		>Copy Mods</button>
		<textarea
			v-model="modsString"
			type=""
			rows="6"
			name=""
			:readonly="true"
			class="w-[95%] bg-slate-200 font-mono p-1"
		></textarea>
	</div>
	<div class="id-raw-text w-full my-4 mx-2">
		<button
			@click="copyIdsString(idsString)"
			class="border border-1 border-pzDark rounded hover:bg-pzDark hover:text-white bg-pzPurple  p-2 my-2"
		>Copy Workshop Items</button>
		<textarea
			v-model="idsString"
			type=""
			rows="6"
			name=""
			:readonly="true"
			class="w-[95%] w-full bg-slate-200  font-mono p-1"
		></textarea>
	</div>
	<div class="footer bg-pzGreen p-4 rounded-t text-center">Made by <a
			href="http://edwardwilliams.me"
			class="underline"
		>Edward Williams</a>! </div>
</template>



<script>
import { ref, computed, watch } from "vue";
// import ModCard from "./components/ModCard.vue";

export default {
	// components: { ModCard },
	setup() {
		//==========Var Init
		const inputData = ref({
			inputName: "",
			inputId: "",
			workshopName: [{ name: "", active: true }],
		});
		const modList = ref([]);
		let rawIds = ref("ids=");
		let rawMods = ref("mods=");
		let log = ref("");
		//==========SavesData
		function saveMods() {
			const parsed = JSON.stringify(modList.value);
			localStorage.setItem("modList", parsed);
			console.log("Data Saved");
		}

		//==========Mod Form Validation
		function submitMod() {
			function checkModIds() {
				for (const name of inputData.value.workshopName) {
					if (!name.name) {
						return false;
					}
				}
				return true;
			}
			checkModIds();
			console.log(inputData.value.inputName);
			console.log(inputData.value.inputId);
			console.log(inputData.value.workshopName[0].name);
			if (
				inputData.value.inputName &&
				inputData.value.inputId &&
				checkModIds()
			) {
				addMod();
			} else {
				console.log("Missing Data");
				showLog("Missing Data");
			}
		}

		function showLog(x) {
			log.value = x;
			setTimeout(() => {
				log.value = "";
			}, 2000);
		}

		function addMod() {
			modList.value.push({
				name: inputData.value.inputName,
				id: inputData.value.inputId,
				workshopName: inputData.value.workshopName,
				active: true,
			});
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

		let showHelp = ref(false);

		watch(
			() => [modsString.value],
			() => {
				updateData();
			}
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
			showHelp,
			log,
			showLog,
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
