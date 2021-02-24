<template>
	<div class="my__unit__parent">
		<div class="my__unit" :class="'my__unit__'+level">
			<div class="unit__title" v-if="filter.children && filter.children.length>0">
				<a @click="addAndOr(filter)">{{filter.type=="and"?"且":"或"}}</a>
			</div>
			<div v-else class="unit__no__title showDisplay">
				<unit-edit :fieldArr="fieldArr" :field="field" :filter="filter" :dhId="dhId" :tbid="tb_id" @addRowAnd="addNew(filter,0,'and')" @addRowOr="addNew(filter,0,'or')" @expressChange="expressChange"></unit-edit>
				<i class="el-icon-delete my__delete" @click="clearThis(filter)"></i>
			</div>

			<div class="value__unit" v-if="filter.children && filter.children.length>0">
				<div v-for="(item,index) in filter.children" :key="index">
					<unit v-if="item.children" :filter="item" :level="level+1" :fieldArr="fieldArr" :field="field" :tbid="tb_id" @addAndOr="addAndOr"></unit>
					<div v-else class="unit__content showDisplay">
						<unit-edit :fieldArr="fieldArr" :field="field" :filter="item" :dhId="dhId" :tbid="tb_id" @addRowAnd="addNew(filter,index,'and')" @addRowOr="addNew(filter,index,'or')" @expressChange="expressChange"></unit-edit>
						<i class="el-icon-delete my__delete" @click="removeThis(filter.children,index,filter)"></i>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import uuid from '@/common.js';
	export default {
		props: {
			// 字段的数组
			fieldArr: {
				type: Array,
				required: true
			},
			//进行筛选的数组
			filter: {
				type: Object,
				required: true
			},
			tb_id: {

			},
			dhId:{

			},
			level: {
				type: Number,
				default: 1
			},
			//字段相关
			field: {
				type: Object,
				required: true
			}
		},
		data() {
			return {};
		},
		components: {
			unit: resolve => {
				require(["./unit.vue"], resolve);
			},
			unitEdit: resolve => {
				require(["./unitEdit.vue"], resolve);
			}
		},
		methods: {
			expressChange(){
				let newFilter = JSON.parse(JSON.stringify(this.filter))
				this.$emit("changeFilter",newFilter);
			},
			addNew(filter, index, way = "add") {
				if(filter.children && filter.children.length > 0) {
					// console.log('if');
					if(filter.type === way) {
						filter.children.splice(index + 1, 0, {});
					} else {
						let add = filter.children.splice(index, 1)[0];
						let newFilter = [
							add,
							{
								type: "",
								fid: "f" + uuid(8),
								value: "",
								cid: ""
							}
						];
						filter.children.splice(index, 0, {
							children: newFilter,
							type: way,
							fid: "f" + uuid(8)
						});
					}
				} else {
					// console.log('else');
					let newFilter = Object.assign({}, filter);
					this.$emit("changeFilter", {
						type: way,
						fid: "f" + uuid(8),
						children: [
							newFilter,
							{
								type: "",
								fid: "f" + uuid(8),
								value: "",
								cid: ""
							}
						]
					});
				}
			},
			//点击与或或的时候
			addAndOr(filter) {
				this.$emit("addAndOr", filter);
			},
			removeThis(arr, index, filter) {
				arr.splice(index, 1);
				if(arr.length === 1) {
					let newChild = filter.children[0];
					if(newChild.children) {
						this.$set(filter, "children", newChild.children);
						this.$set(filter, "type", newChild.type);
						this.$set(filter, "fid", newChild.fid);
					} else {
						this.$delete(filter, "children");
						this.$set(filter, "value", newChild.value || "");
						this.$set(filter, "comment", newChild.comment || "");
						this.$set(filter, "cid", newChild.cid || "");
						this.$set(filter, "filterType", newChild.filterType || "");
						this.$set(filter, "conditionType", newChild.conditionType || "");
						this.$set(filter, "dataClass", newChild.dataClass || "");
						this.$set(filter, "valueType", newChild.valueType || "");
						this.$set(filter, "expression", newChild.expression || "");
					}
				}
			},
			//清空当前选择
			clearThis(filter) {
				this.$emit("changeFilter", {
					type: "",
					fid: "f" + uuid(8),
					value: '',
				});
			}
		},
		watch:{
//			dhId(newValue, oldValue){
//				this.dhId = newValue;
//			}
		}
	};
</script>
<style lang='scss' scope>
	$border: 1px solid #e6ebf0;
	.my__unit {
		display: flex;
		//width: 100%;
		.unit__title {
			border: $border;
			width: 36px;
			border-left-width: 0;
			border-top-width: 0;
			display: flex;
			justify-content: center;
			align-items: center;
			background: #f5f7f8;
			>a:hover {
				color: rgba(10, 18, 32, 0.64);
			}
			.unit__title__edit {
				border-right-width: 0;
			}
		}
		.value__unit {
			width: 100%;
			.unit__content {
				border-bottom: $border;
				height: 36px;
				line-height: 36px;
				padding-left: 8px;
				width: 100%;
				position: relative;
				>a:hover {
					color: rgba(10, 18, 32, 0.64);
				}
				.my__delete {
					position: absolute;
					top: 8px;
					right: 24px;
					font-size: 20px;
					cursor: pointer;
				}
			}
			.unit__content:hover {
				background: #f5f7f8;
			}
		}
		.showDisplay:hover {
			background: #f5f7f8;
		}
	}
	
	.my__unit__1 {
		//border: $border;
		border-bottom-width: 0;
		//width: calc(100% - 30px);
		>.unit__no__title {
			border-bottom: $border;
			width: 100%;
			position: relative;
			.my__delete {
				position: absolute;
				top: 8px;
				right: 24px;
				font-size: 20px;
				cursor: pointer;
			}
		}
	}
	
	.showDisplay:hover {
		.my__delete {
			display: block;
		}
	}
	
	.showDisplay {
		.my__delete {
			display: none;
		}
	}
</style>