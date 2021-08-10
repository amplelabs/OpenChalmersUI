<template>
  <v-autocomplete
    v-model="model"
    :items="items"
    :loading="isLoading"
    :search-input.sync="search"
    color="white"
    hide-no-data
    hide-selected
    item-text="name"
    item-value="id"
    label="Service Provider"
    placeholder="Type name of Service Provider..."
    append-icon="search"
    return-object
    outline
  ></v-autocomplete>
</template>

<script>
  export default {
    props: {
      value: {
        type: Object,
        required: true,
      },
    },
    data: () => ({
      nameLimit: 60,
      entries: [],
      isLoading: false,
      model: null,
      search: null,
    }),

    computed: {
      fields() {
        if (!this.model) return [];

        return Object.keys(this.model).map(key => ({
          key,
          value: this.model[key] || 'n/a',
        }));
      },
      items() {
        return this.entries.map((entry) => {
          const name = entry.name.length > this.nameLimit
            ? `${entry.name.slice(0, this.nameLimit)}...`
            : entry.name;

          return Object.assign({}, entry, { name });
        });
      },
    },

    watch: {
      search() {
        // Items have already been loaded
        if (this.items.length > 0) return;

        // Items have already been requested
        if (this.isLoading) return;

        this.isLoading = true;

        // Lazily load input items
        fetch('https://c9hrm3u8uk.execute-api.us-east-1.amazonaws.com/dev/getOrg')
          .then(res => res.json())
          .then((res) => {
            this.entries = res.entries;
          })
          .catch(() => {
            this.entries = [];
          })
          .finally(() => (this.isLoading = false));
      },
      model() {
        this.$emit('input', this.model);
      },
    },
  };
</script>
