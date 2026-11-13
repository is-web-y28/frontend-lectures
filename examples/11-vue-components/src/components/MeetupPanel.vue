<template>
  <section class="panel">
    <header><h3><slot name="title">Frontend Meetup</slot></h3><div><slot name="actions" /></div></header>
    <slot />
  </section>
</template>
