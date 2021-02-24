<template>
  <div class="hello">
    <span id="numberRock">
        {{numberOption.lastNumber}} 
      </span>
  </div>
</template>
<script>
	import $ from '@/jquery.min.js';
export default {
  name: 'IDENumberRock',
  props: {
    numberOption:{
      default:{}
    }
  },
  data () {
    return {
      
    }
  },
  mounted () {
    this.init();
  },
  methods: {
    init(){
      var self = this;
      this.$nextTick(()=> {
            var gdom = document.getElementById('numberRock');
            if(gdom){
              $('#'+'numberRock').numberRock({
                lastNumber:self.numberOption.lastNumber,
                firstNumber:self.numberOption.firstNumber,
                duration:self.numberOption.duration * 1,
                easing:self.numberOption.easing
              });
              gdom.style.color = self.numberOption.style.color || '#333';
              gdom.style.fontFamily = self.numberOption.style['font-family'] || "微软雅黑";
              gdom.style.fontSize = self.numberOption.style['font-size'] || '14px';
            }
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
