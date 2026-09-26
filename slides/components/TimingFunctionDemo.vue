<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";

const DURATION_MS = 3000;
const demoRoot = ref(null);
const replayId = ref(0);
const progress = ref(0);
const isPaused = ref(false);
let progressFrame = 0;

const curves = [
  {
    name: "linear",
    timing: "linear",
    description: "Одинаковая скорость",
  },
  {
    name: "ease",
    timing: "ease",
    description: "Мягче в начале и конце",
  },
  {
    name: "ease-in",
    timing: "ease-in",
    description: "Разгоняется к концу",
  },
  {
    name: "ease-out",
    timing: "ease-out",
    description: "Тормозит к концу",
  },
  {
    name: "ease-in-out",
    timing: "ease-in-out",
    description: "Разгон и торможение",
  },
  {
    name: "steps(5, end)",
    timing: "steps(5, end)",
    description: "Пять дискретных шагов",
  },
  {
    name: "cubic-bezier(.34, 1.56, .64, 1)",
    timing: "cubic-bezier(.34, 1.56, .64, 1)",
    description: "Перелёт и возврат",
  },
];

const roundedProgress = computed(() => Math.round(progress.value));
const transportLabel = computed(() => {
  if (progress.value >= 99.9) return "Снова";
  return isPaused.value ? "Продолжить" : "Пауза";
});

function runnerAnimations() {
  if (!demoRoot.value) return [];

  return [...demoRoot.value.querySelectorAll(".runner")]
    .map((runner) => runner.getAnimations()[0])
    .filter(Boolean);
}

function animationDuration(animation) {
  const duration = animation.effect?.getComputedTiming().duration;
  return typeof duration === "number" && Number.isFinite(duration)
    ? duration
    : DURATION_MS;
}

function syncProgress(animation) {
  const duration = animationDuration(animation);
  const currentTime =
    typeof animation.currentTime === "number" ? animation.currentTime : 0;
  progress.value = Math.min(100, Math.max(0, (currentTime / duration) * 100));
}

function stopProgressTracking() {
  if (!progressFrame) return;
  cancelAnimationFrame(progressFrame);
  progressFrame = 0;
}

function startProgressTracking() {
  stopProgressTracking();

  const update = () => {
    const animation = runnerAnimations()[0];

    if (!animation) {
      progressFrame = requestAnimationFrame(update);
      return;
    }

    syncProgress(animation);

    if (animation.playState === "finished") {
      progress.value = 100;
      isPaused.value = true;
      progressFrame = 0;
      return;
    }

    if (!isPaused.value) {
      progressFrame = requestAnimationFrame(update);
    }
  };

  progressFrame = requestAnimationFrame(update);
}

async function replay() {
  stopProgressTracking();
  replayId.value += 1;
  progress.value = 0;
  isPaused.value = false;

  await nextTick();
  await new Promise((resolve) => requestAnimationFrame(resolve));

  for (const animation of runnerAnimations()) {
    animation.currentTime = 0;
    animation.play();
  }

  startProgressTracking();
}

function togglePause() {
  const animations = runnerAnimations();
  if (!animations.length) return;

  if (isPaused.value) {
    const shouldRestart = progress.value >= 99.9;

    for (const animation of animations) {
      if (shouldRestart) animation.currentTime = 0;
      animation.play();
    }

    if (shouldRestart) progress.value = 0;
    isPaused.value = false;
    startProgressTracking();
    return;
  }

  stopProgressTracking();
  for (const animation of animations) animation.pause();
  syncProgress(animations[0]);
  isPaused.value = true;
}

function seek(event) {
  const nextProgress = Number(event.currentTarget.value);
  const animations = runnerAnimations();

  stopProgressTracking();
  for (const animation of animations) {
    animation.pause();
    animation.currentTime =
      animationDuration(animation) * (nextProgress / 100);
  }

  progress.value = nextProgress;
  isPaused.value = true;
}

onMounted(startProgressTracking);
onBeforeUnmount(stopProgressTracking);
</script>

<template>
  <section
    ref="demoRoot"
    class="timing-function-demo"
    aria-label="Визуальное сравнение временных функций CSS"
  >
    <div class="controls">
      <p>Одинаковые начало, конец и длительность: <code>3000ms</code></p>
      <label class="scrubber">
        <span>Позиция</span>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          :value="progress"
          :aria-valuetext="`${roundedProgress}%`"
          @input="seek"
        />
        <output>{{ roundedProgress }}%</output>
      </label>
      <div class="transport">
        <button type="button" @click="togglePause">
          {{ transportLabel }}
        </button>
        <button type="button" @click="replay">Сначала</button>
      </div>
    </div>

    <div class="lanes">
      <div v-for="curve in curves" :key="curve.name" class="lane">
        <div class="curve-label">
          <code>{{ curve.name }}</code>
          <span>{{ curve.description }}</span>
        </div>

        <div class="track" aria-hidden="true">
          <span
            :key="`${curve.name}-${replayId}`"
            class="runner"
            :style="{ '--timing': curve.timing }"
          >
            <span class="dot"></span>
          </span>
        </div>
      </div>
    </div>

    <p class="hint">
      Приостановите движение или перетащите шкалу. В одной позиции видно,
      как временная функция распределяет одинаковую длительность.
    </p>
  </section>
</template>

<style scoped>
.timing-function-demo {
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
  justify-content: center;
  gap: 0.55rem;
  color: var(--fg);
}

.controls {
  display: grid;
  grid-template-columns: auto minmax(11rem, 1fr) auto;
  align-items: center;
  gap: 0.65rem;
}

.controls p,
.hint {
  margin: 0;
  color: var(--fg-dim);
  font-size: 0.7rem;
}

.scrubber {
  display: grid;
  grid-template-columns: auto minmax(7rem, 1fr) 2.25rem;
  gap: 0.35rem;
  align-items: center;
  color: var(--fg-dim);
  font-size: 0.64rem;
}

.scrubber input {
  width: 100%;
  accent-color: var(--accent);
  cursor: ew-resize;
}

.scrubber input:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 0.15rem;
}

.scrubber output {
  color: var(--accent-deep, var(--accent));
  font-family: var(--font-mono);
  font-weight: 800;
  text-align: end;
}

.transport {
  display: flex;
  gap: 0.35rem;
}

button {
  border: var(--surface-border);
  border-radius: 0.35rem;
  background: color-mix(in oklab, var(--accent) 12%, var(--surface-bg));
  color: var(--accent-deep, var(--accent));
  cursor: pointer;
  font: inherit;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  white-space: nowrap;
}

button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 0.2rem;
}

.lanes {
  display: grid;
  gap: 0.35rem;
}

.lane {
  display: grid;
  grid-template-columns: minmax(10rem, 0.85fr) minmax(0, 2fr);
  align-items: center;
  gap: 0.6rem;
}

.curve-label {
  display: grid;
  gap: 0;
}

.curve-label code {
  color: var(--accent-deep, var(--accent));
  font-weight: 800;
  font-size: 0.72rem;
  line-height: 1.1;
}

.curve-label span {
  color: var(--fg-dim);
  font-size: 0.62rem;
  line-height: 1.2;
}

.track {
  position: relative;
  min-width: 0;
  height: 1.35rem;
  overflow: hidden;
  border: var(--surface-border);
  border-radius: 999px;
  background: color-mix(in oklab, var(--surface-bg) 88%, var(--accent));
}

.track::before {
  position: absolute;
  inset: 50% 0 auto;
  height: 1px;
  background: color-mix(in oklab, var(--fg) 25%, transparent);
  content: "";
}

.runner {
  position: absolute;
  inset: 0.275rem auto auto 0.2rem;
  width: calc(90% - 1rem);
  animation: travel 3000ms var(--timing) both;
}

.dot {
  display: block;
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 0.2rem color-mix(in oklab, var(--accent) 22%, transparent);
}

.hint {
  text-align: center;
  line-height: 1.25;
}

@keyframes travel {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(100%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .runner {
    animation-duration: 1ms;
  }
}
</style>
