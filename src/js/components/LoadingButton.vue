<template>
  <button :type="type" :disabled="disabled">
    <fa v-if="isLoading" icon="spinner" class="mr-1" spin />
    <fa v-else-if="icon" :icon="icon" class="mr-1" />

    <slot />
  </button>
</template>

<script>
export default {
  props: {
    isLoading: {
      type: Boolean,
      default: false
    },

    disabled: {
      type: Boolean,
      default: false
    },

    type: {
      type: String,
      default: 'submit'
    },

    icon: {
      type: String,
      default: null
    }
  }
}
</script>
