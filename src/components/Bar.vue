<template>
  <div id="bar">{{name}}</div>
</template>

<script>
export default {
  name: 'Bar',
  data () {
    return {
      name: 'bar'
    }
  }
}
</script>

<style>
#bar{
  background: red;
}
</style>