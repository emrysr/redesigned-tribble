<template>
    <form class="form-inline my-2 my-lg-0">
        <div class="input-group">
            <input type="text" class="form-control" :placeholder="$t('message.search')" :aria-label="$t('message.search')" aria-describedby="button-addon2">
            <div class="input-group-append">
                <button class="btn btn-success"><Icon icon="search" /></button>
            </div>
        </div>
    </form>
</template>

<script>
import Icon from '@/components/Icon'

export default {
  name: 'Search',
  components: {
    'Icon': Icon
  }
}
</script>
