<template>
  <footer class="course-footer">
    <span>Web-разработка: Frontend</span>
    <span><SlideCurrentNo /> / <SlidesTotal /></span>
  </footer>
</template>

<style scoped>
.course-footer {
  bottom: 0.9rem;
  color: var(--fg-dim);
  font-size: 0.65rem;
  letter-spacing: 0.04em;
  position: absolute;
  /* right: 1.25rem; */
  text-transform: uppercase;

  width: 100%;
  padding: 0 1.25rem;
  display: flex;
  justify-content: space-between;
}
</style>
