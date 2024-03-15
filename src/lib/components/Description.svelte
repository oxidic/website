<div class="hero my-8 mx-4 border-r border-primary flex w-1/2 items-center justify-center">
	<div
		class="h-[90vh] px-8 font-mono max-w-none pt-8 pb-16 rounded-lg shadow-2xl border-t-2 border-l-4 border-base-300"
	>
		<div>
			{text}
		</div>

		<div class="flex justify-end h-[70vh] items-end">
			<a class="btn btn-primary mt-auto" href="/"
			><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
			><path fill="none" stroke="currentColor" stroke-width="2" d="m9 6l6 6l-6 6"></path></svg
			></a>
		</div>
	</div>
</div>

<script lang="ts">
    export let text: string;
</script>