<template>
  <div class="number-box">
    <button @click="sub" class="minus">-</button>
    <input @change="inNum" v-model="num" class="inp" type="text">
    <button @click="add" class="add">+</button>
  </div>
</template>

<script>
export default {
  name: 'NumberBox',
  props: {
    value: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      num: this.value
    }
  },
  methods: {
    sub () {
      if (this.value === 1) return
      this.num = this.value - 1
      this.$emit('input', this.value - 1, this.value)
    },
    add () {
      this.num = this.value + 1
      this.$emit('input', this.value + 1, this.value)
    },
    inNum (e) {
      const num = +e.target.value
      if (isNaN(num) || num < 1) {
        this.num = this.value
        return
      }
      this.$emit('input', num, this.value)
    }
  }
}
</script>

<style lang="less" scoped>
.minus, .add {
  width: 30px;
  height: 30px;
  line-height: 30px;
  border: 0;
  text-align: center;
  background-color: #efefef;
}
.inp {
  width: 40px;
  height: 30px;
  border: 0;
  margin: 0 5px;
  text-align: center;
  background-color: #efefef;
}

</style>
