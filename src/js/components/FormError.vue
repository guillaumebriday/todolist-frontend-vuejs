<template>
  <div v-if="error" class="bg-red-lightest border-t-4 border-red shadow-md text-red-dark px-6 py-3 rounded relative mb-3" role="alert">
    <div class="flex">
      <fa icon="exclamation-triangle" class="mr-2" />

      <div class="flex-grow">
        <strong class="font-bold">
          Whoops !
        </strong>
        <span class="block sm:inline">
          {{ error.message }}
        </span>
      </div>

      <span class="absolute pin-t pin-b pin-r px-4 py-3 cursor-pointer" @click.prevent="error = null">
        <fa icon="times" />
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default: null
    }
  }
}
</script>
