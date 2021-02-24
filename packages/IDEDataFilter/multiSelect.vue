<template>
	<div>
		<el-select v-model="showVal" multiple collapse-tags placeholder="请选择" :filterable="true" :loading="loading" @visible-change="getColumnValues" @change="changeValue" :size="size" clearable @clear="clearSelect">
			<div class="myCheckbox">
				<el-checkbox v-model="checked" :size="size" @change="allCheck">全选</el-checkbox>
			</div>
			<el-option-group v-for="group in options" :key="group.label" :label="group.label">
				<el-option v-for="item in group.option" :key="item.pm_id" :label="item.showValue" :value="item.pm_id">
				</el-option>
			</el-option-group>
		</el-select>
	</div>
</template>
<script>
	import { mapState, mapActions } from "vuex";
	export default {
		props: {
			url: {
				type: String,
				required: true
			},
			value: {
				type: Array,
				required: true
			},
			tb_id: {
				type: String,
				required: true
			},
			column: {
				type: String,
				required: true
			},
			ctId: {
				type: String
			},
			dateType: {
				type: String
			},
			queryParam: {

			},
			size: {
				type: String,
				default: "mini"
			}
		},
		data() {
			return {
				loading: false,
				columnArr: [],
				showVal: [],
				checked: false,
				options: [],
			};
		},
		mounted() {
			if(JSON.stringify(this.options) == '[]') {
				this.sysParamList.forEach(element => {
					element['showValue'] = element.pm_text;
				});
				var obj2 = {
					label: '系统参数',
					option: this.sysParamList
				};
				this.options.push(obj2);
			}
			//自定义参数
			this.paramList.forEach(element => {
				element['showValue'] = element.pm_text;
			});
			var obj0 = {
				label: '自定义参数',
				option: this.paramList
			};
			this.options.push(obj0);
			
			if(!!this.value){
				this.showVal = [...this.value]
			}
		},
		computed: {
			...mapState("filters", {
				columnState: state => state.column
			}),
			// 全局参数项
			gParamList() {
				return this.$store.state.globalSearch.gParamList;
			},
			//系统参数
			sysParamList() {
				return this.$store.state.globalSearch.sysParamList;
			},
			paramList(){
				return this.$store.state.datasheet.paramList;
			}
		},
		methods: {
			...mapActions("filters", ["setColumnProperty"]),
			//select框弹出事件和隐藏事件，隐藏的时候跑出一个方法，弹出的时候获取下拉列表数据
			getColumnValues(visible) {
				if(!visible) {
					this.$emit("selectChange", this.showVal);
				} else {
					let _this = this;
					this.loading = true;
					let data = {
						column: _this.column
					};
					if(this.ctId) {
						data.ctId = this.ctId;
						data.dateType = this.dateType;
						data.queryParam = this.queryParam;
					} else {
						data.tb_id = _this.tb_id;
					}
					this.$http.post(this.url, data).then(function(response) {
						_this.loading = false;
						var meta = response.data;
						if(meta.success) {
							if(meta.data) {
								_this.columnArr = meta.data.reduce(
									(list, item) => [...list, ...Object.values(item)], []
								);
							} else {
								_this.columnArr = [];
							}
							_this.setColumnProperty({
								property: _this.tb_id + _this.column,
								columnArr: _this.columnArr
							});
							_this.zuheChang();
						} else {
							_this.$notify({
								dangerouslyUseHTMLString: true,
								message: handleError(meta),
								duration: 6000,
								type: "error"
							});
						}
					});
				}
			},
			// 组装常量
			zuheChang() {
				var colArr = JSON.parse(JSON.stringify(this.columnArr));
				if(JSON.stringify(this.options).indexOf('常量值') != -1) {
					this.options.splice(0, 1);
				}
				var obj3 = {
					label: '常量值',
					option: []
				};
				for(var i = 0; i < colArr.length; i++) {
					let temp = {
						showValue: colArr[i],
						pm_id: colArr[i]
					};
					obj3.option.push(temp);
				}
				this.options.unshift(obj3);
				//自定义参数
				if(JSON.stringify(this.options).indexOf('自定义参数') != -1) {
					this.options.splice(this.options.length - 1, 1);
				}
				this.paramList.forEach(element => {
					element['showValue'] = element.pm_text;
				});
				var obj2 = {
					label: '自定义参数',
					option: this.paramList
				};
				this.options.push(obj2);
			},
			//
			changeValue(val) {
				this.checked = val.length == this.columnArr.length ? true : false;
				this.$emit("selectChange", this.showVal);
				this.$emit("update:value", val);
			},
			//全选
			allCheck(val) {
				this.showVal = val ? this.columnArr : [];
				this.changeValue(this.showVal);
			},
			clearSelect() {
				this.checked = false;
			}
		},
		watch: {
			value:{
				handler(newName, oldName) {
					if(!!this.value){
						this.showVal = [...this.value];
					}

				},
				immediate: true,
				deep: true
			}
		}
	};
</script>
<style>
	.myCheckbox .el-checkbox__label {
		font-size: 12px;
	}
</style>

<style lang="scss" scoped>
	.myCheckbox {
		padding: 0 0 0 20px;
		position: relative;
		float: right;
		top: 5px;
		right: 10px;
	}
	
	/deep/ .el-tag.el-tag--info:nth-child(1) {
		max-width: 90px;
		overflow: hidden;
		vertical-align: middle;
	}
</style>