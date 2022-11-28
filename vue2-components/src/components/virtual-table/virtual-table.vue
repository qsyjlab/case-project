<template>
  <div>
    <div class="table-header" ref="tableHeader">
      <table>
        <colgroup>
          {cols}
        </colgroup>
        <thead>
          <tr className="table-header-row">
            {ths}
          </tr>
        </thead>
      </table>
    </div>
  </div>
</template>
<script>

import './virtual-table.css'

export default {

  data() {
    return {};
  },
  methods: {},
};
</script>
<style scoped></style>
