<template>
    <svg viewBox="0 0 8 8" width="16px" height="16px" style="fill:currentColor">
        <use :href="'#'+icon"></use>
    </svg>
</template>

<script>
export default {
  name: 'Icon',
  props: ['icon']
}
</script>
