<template>
  <div id="app">
    <router-link to="/">go Foo</router-link>
    <router-link to="bar">go Bar</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
// import Bar from './components/Bar'
// import Foo from './components/Foo'
export default {
  name: 'App',
  components: {
    // Bar,
    // Foo
  }
}
</script>

<style>
@font-face
{
  font-family: 'xkcd';
  src: url('./assets/fonts/xkcd-script.ttf');
}
body{
  font-family: 'xkcd';
}
</style>