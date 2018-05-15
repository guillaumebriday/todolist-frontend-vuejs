<template>
  <button :type="type" :disabled="disabled">
    <i v-if="isLoading" class="fa fa-spinner fa-spin mr-1"></i>
    <i v-else-if="icon" :class="icon" class="fa mr-1"></i>

    <slot></slot>
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
