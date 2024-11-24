<template>
  <q-item
    clickable
    :to="link"
    exact-active-class="bg-accent rounded-borders"
    active-class=""
  >
    <q-item-section
      v-if="icon"
      avatar
    >
      <q-icon :name="icon" color="secondary" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
defineOptions({
  name: 'EssentialLink'
});

export interface EssentialLinkProps {
  title: string;
  caption?: string;
  link?: string;
  icon?: string;
};

withDefaults(defineProps<EssentialLinkProps>(), {
  caption: '',
  link: '#',
  icon: '',
});
</script>
