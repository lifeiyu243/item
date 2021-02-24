<template>
	<div id="data-filter">
		<div class="my__view__filter" :style="{height:filterHeight+'px'}">
			<unit :filter="filter" :dhId="dhId" :tb_id="tb_id" :fieldArr="fieldArr" :field="field"  @changeFilter="changeFilter" @addAndOr="addAndOr"></unit>
		</div>
	</div>
</template>
<script>
	import  uuid  from '@/common.js';
	export default {
	  name: 'IDEDataFilter',
	  props: {
	  	filter: {
			type: Object,
			required: true
		},
	  },
	  data () {
	    return {
	      tb_id:'defaultTb',
	      dhId:'defaultDh',
	      filterHeight:120,
	      andName: "and",
		  orName: "or",
		  fieldArr:[{
		  	CLASS:'#',
		  	COLCOMMENT:'字段一',
		  	COLNAME:'code1',
		  	COLTYPE:'number',
		  	FLAG:1
		  },{
		  	CLASS:'D',
		  	COLCOMMENT:'字段二',
		  	COLNAME:'code2',
		  	COLTYPE:'"varchar2"',
		  	FLAG:1
		  },{

			  
		  	CLASS:'#',
		  	COLCOMMENT:'字段三',
		  	COLNAME:'code3',
		  	COLTYPE:'number',
		  	FLAG:1
		  },{
		  	CLASS:'#',
		  	COLCOMMENT:'字段四',
		  	COLNAME:'code4',
		  	COLTYPE:'number',
		  	FLAG:1
		  }],
		  field:{
		  	fid: "fid",
			cid: "COLNAME",
			type: "CLASS",
			comment: "COLCOMMENT"
		  }
	    }
	  },
	  mounted () {
	  	this.initFilter();
	  },
	  components: {
	  	unit: resolve => {
			require(["./unit.vue"], resolve);
		}
	  },
	  methods: {
	  	initFilter() {
			if(!this.filter.fid) {
				this.filter.fid = "f" + uuid(8);
			}
		},
	  	changeFilter(filter) {
	  		debugger
			this.$emit("update:filter", filter);
		},
		//点击且（或）的时候新增
		addAndOr(filter) {
			if(this.filter.fid === filter.fid) {
				let type = filter.type === "and" ? "or" : "and";
				let fid = "f" + uuid(8);
				let newFilter = Object.assign({}, filter);
				filter = {
					fid,
					type,
					children: [
						newFilter,
						{
							fid: "f" + uuid(8),
							type: ""
						}
					]
				};
				this.$emit("update:filter", filter);
			} else {
				this.matchFilter(this.filter, filter);
			}
		},
		matchFilter(pfilter, filter, index = 0) {
			let findFlag = false;
			if(pfilter.children) {
				for(let i = 0; i < pfilter.children.length; i++) {
					let element = pfilter.children[i];
					if(element.fid === filter.fid) {
						pfilter.children.splice(i + 1, 0, {
							type: "",
							fid: "f" + uuid(8),
							value: "",
							cid: ""
						});
						break;
					}
					if(element.children) {
						this.matchFilter(element, filter, i);
					}
				}
			}
		},
	 },
	 watch: {
	  	filter: {
	        handler(newValue, oldValue) {
	            this.$forceUpdate();
	        },
	        deep: true
	    },
	  },
	}
</script>

<style>
</style>