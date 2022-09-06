<template>
	<div class="flex flex-col bg-gray-100 p-4 w-full border shadow grow overflow-hidden">
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
</template>

<script>
export default {
	name: "ModCard",
	props: {
		mod: Object,
	},
	setup(props) {
		console.log(props.title);
		function workshopUrl(x) {
			return `https://steamcommunity.com/sharedfiles/filedetails/?id=${x}`;
		}
		return {
			workshopUrl,
		};
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
