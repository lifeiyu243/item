<template>
  <div id="app">
    	<!-- <div class="ide-color">
    		<IDEColorPicker :data="colorData" @change="getColor"></IDEColorPicker>
    	</div>
    	<IDERelation></IDERelation>
    	<IDEDataDialog></IDEDataDialog>
    	<IDETextStyle></IDETextStyle>
    	<IDENumberRock :numberOption="numberOption"></IDENumberRock> -->
    	<IDEDataFilter :filter.sync="filter"></IDEDataFilter>
  </div>
</template>

<script>
import $ from '@/jquery.min.js'
export default {
  name: 'App',
  data() {
  	return {
  		colorData: {
	  		type: 'single',
	  		colors: '#333333'
	  	},
	  	filter: {
				fid: "",
				type: "",
				cid: "",
				value: ""
			},
	  	numberOption:{
        firstNumber:0,//起始值
        lastNumber:6000,//结束值
        duration:5000,//时间间隔
        easing:'linear',//swing慢快慢 linear匀速
        style:{
          "font-family": "微软雅黑",
          "color": "red",
          "font-size": "24px",
        }
      }
  	}
  },
  mounted(){

  },
  methods: {
  	getColor(param) {
  		console.log($('#app'));
  	}
  },
  watch: {
  	filter: {
        handler(newValue, oldValue) {
          console.log(newValue)
            this.$forceUpdate();
        },
        deep: true
    },
  },
  components: {
    
  }
}
</script>
<style>
	.ide-icon {
    background-image: url(./assets/ide-Icon.png);
    background-repeat: no-repeat;
    display: inline-block;
    vertical-align: middle;
    width: 14px;
    height: 14px;
}
</style>
<style scoped="scoped">
	.ide-color{
		width: 400px;
		height: 400px;
		margin: 0 auto;
	}
	
</style>
