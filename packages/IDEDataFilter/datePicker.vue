<template>
	<el-date-picker
		placeholder="选择日期"
		class="date-input-w"
      	v-model="dateValue"
      	:type="dateTypeCall()"
      	:format="dateFormatShow()"
      	:value-format="valueFormat()"
      	@change="change">
    </el-date-picker>
</template>

<script>
	export default {
		name: 'ideDatePicker',
		model: { 
	      	prop: 'value',
	      	event: 'changevalue'
	   	},
		props: {
			dateType: {
				default: '10'
			},
			value: {
				default: ''
			}
		},
		data() {
			return {
				dateValue: this.value
			}
		},
		mounted() {
			this.init()
		},
		methods: {
			// 初始化
			init() {
				this.dateValue = this.value;
			},
			
			// 筛选日期类型
			dateTypeCall() {
				switch(this.dateType) {
					case '10':
						return 'date';
						break;
						break;
					case '30':
						return 'month';
						break;
					case '50':
						return 'year';
						break;
					default:
						break;
				}
			},
			
			// 筛选日期展示格式
			dateFormatShow() {
				switch(this.dateType) {
					case '10':
						return 'yyyy-MM-dd';
						break;
					case '30':
						return 'yyyy-MM';
						break;
					case '50':
						return 'yyyy';
						break;
					default:
						break;
				}
			},
			
			// 筛选日期展示格式
			valueFormat() {
				switch(this.dateType) {
					case '10':
						return 'yyyyMMdd';
						break;
					case '30':
						return 'yyyyMM';
						break;
					case '50':
						return 'yyyy';
						break;
					default:
						break;
				}
			},
			
			// 日期改变
			change() {
				this.$emit('changevalue', this.dateValue)
				this.$emit('date-change', this.dateValue)
			}
		},
		watch: {
			value() {
				this.init()
			}
		}
	}
</script>

<style scoped>
	.date-input-w {
		width: 100%;
	}
</style>