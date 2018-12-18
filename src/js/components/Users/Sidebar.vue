<template>
  <div>
    <h2 class="text-grey font-normal text-base">
      SETTINGS
    </h2>

    <p class="my-4">
      <router-link class="no-underline hover:underline" :class="[isProfileActive ? 'text-indigo' : 'text-grey-dark']" :to="{ name: 'Profile'}" exact>
        <fa icon="user" class="mr-2" /> Profile
      </router-link>
    </p>

    <p class="my-4">
      <router-link class="no-underline hover:underline" :class="[isSecurityActive ? 'text-indigo' : 'text-grey-dark']" :to="{ name: 'Security'}" exact>
        <fa icon="key" class="mr-2" />Security
      </router-link>
    </p>
  </div>
</template>

<script>
export default {
  computed: {
    isProfileActive () {
      return this.$route.name === 'Profile'
    },

    isSecurityActive () {
      return this.$route.name === 'Security'
    }
  }
}
</script>
