<template>
  <div>
    {{name}},
    {{this.$store.state.username}}
  </div>
</template>

<script>
export default {
  name: 'Foo',
  data () {
    return {
      name: 'foo'
    }
  },
  asyncData (store) {
    return store.dispatch('asyncChangeName', 'Tom')
  },
  methods: {
    onClick () {
      alert('msg')
    }
  }
}
</script>