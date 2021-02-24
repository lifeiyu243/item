<template>
	<div class="tab-cont-corr">
		<div class="tab-Table-cont" v-if="associateList.length > 0">
			<div class="relation">
				<div class="flow-chart flow-chart1">
					<el-popover  ref="popover1" placement="top-end" offset="-310" trigger="hover" visible-arrow=false>
						<div>
							<p class="elpopfont"><span class="flow-chart-title">工作表名:</span> {{ '接口获取' }}</p>
							<p class="elpopfont"><span class="flow-chart-title">工作表类型:</span> {{ '接口获取' }}</p>
							<p class="elpopfont"><span class="flow-chart-title">工作表Id:</span> {{ '接口获取' }}</p>
							<p class="elpopfont"><span class="flow-chart-title">数据条数:</span> {{ '接口获取' }}</p>
							<p class="elpopfont"><span class="flow-chart-title">更新状态:</span> {{ '接口获取' }}</p>
							<p class="elpopfont"><span class="flow-chart-title">更新时间:</span> {{ '接口获取' }}</p>
						</div>
					</el-popover>
					<p v-popover:popover1 class="ellipsis-one">{{ '主节点名' }}</p>
					<i class="flow-chart-border flow-chart1-border"></i>
				</div>
				<div class="flow-chart flow-chart2">
					<p class="ellipsis-one" title="图表">子节点</p>
					<i class="flow-chart-border flow-chart2-border"></i>
				</div>
				<div class="flow-chart-children">
					<div class="h-border"></div>
					<ul>
						<li :key="index" class="flow-chart flow-chart-child" v-for="(item,index) in associateList">
							<i class="flow-chart-border flow-chart3-border"></i>
							<el-popover placement="top-end" offset="-310" width="260" trigger="hover" visible-arrow=false>
								<div>
									<p class="elpopfont"><span class="flow-chart-title">图表名称:</span> {{ item.ct_name == '' ? "未命名图表" : item.ct_name }}</p>
									<p class="elpopfont"><span class="flow-chart-title">仪表板:</span> {{ item.dh_name }}</p>
									<p class="elpopfont"><span class="flow-chart-title">文件夹:</span> {{ item.p_dh_name }}</p>
								</div>
								<p slot="reference" class="flow-chart ellipsis-one">{{ item.ct_name == '' ? "未命名图表" : item.ct_name }}</p>
							</el-popover>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>

</template>

<script>
	export default {
		name: 'IDERelation',
		props: {
			tbId: {
				default: ""
			}
		},
		data() {
			return {
				associateList: [
					{
						"ct_id":"ct_j0nhrg4r",
						"ct_name":"",
						"dh_name":"在线报告问题遗留",
						"p_dh_name":"飞飞专用",
						"query_param":{},
						"user_id":"SYSADMIN",
						"linkOff":false,
						"popOff":false,
						"owner_id":"SYSADMIN"
					},{
						"ct_id":"ct_lnih7hvg",
						"ct_name":"",
						"dh_name":"分析文档1",
						"p_dh_name":"分析报告测试专用",
						"query_param":{},
						"user_id":"SYSADMIN",
						"linkOff":false,
						"popOff":false,
						"owner_id":"SYSADMIN"
					},{
						"ct_id":"ct_wchdjqxu",
						"ct_name":"",
						"query_param":{},
						"linkOff":false,
						"popOff":false,
						"owner_id":"SYSADMIN"
					}
				]
			}
		},
		mounted() {
		}
	}
</script>

<style scoped>
	.ellipsis-one, .ellipsis-two {
		width: 100%;
		text-overflow: ellipsis;
		overflow: hidden;
		display: -webkit-box;
		    margin: 0;
	}
	.tab-cont-corr{
		margin-top: 4px;
		height: 100%;
		overflow: auto;
	}
	.text_{
    	cursor: pointer;
    	text-decoration: underline;
    }
    .tab-Table-cont{
    	overflow: hidden;
	    box-shadow: 0 0 6px 0 rgba(0,0,0,.06), 0 10px 12px 0 rgba(170,182,206,.15);
	    background: #fff;
    }
    .field-set{
    	background: #fff;
    	overflow: hidden;
    	font-size: 12px;
    }
    .field-set-head{
    	color: rgba(0,0,0,.42);
    	border-bottom: 1px solid rgba(10,18,32,.12);
    }
    .field-set-head .field-list{
    	font-weight: 700;
    }
    .field-list{
    	height: 44px;
    	padding: 10px 24px;
	    line-height: 24px;
	    text-align: left;
    }
    .field-set-cont-list{
    	color: rgba(10,18,32,.64);
    	overflow: hidden;
    	border-bottom: 1px solid rgba(10,18,32,.12);
    }
    .field-set-cont-list .field-list{
    	font-weight: 400;
    }
    .field-set-cont-list:hover{
    	background: #f3f4f5;
    }
    .field-set-cont-list:hover .old-name span{
    	box-shadow: inset 0 -1px 0 0 rgba(10,18,32,.62);
    }
    .old-name{
    	width: 56%; 
    }
    .new-name{
    	width: 22%;
    }
    .field-type{
    	width: 22%;
    }
    .h{
    	line-height: 24px;
    	margin: 20px 0 16px 6px;
    }
    .tab-Table-w{
    	padding: 16px 24px;
	    color: rgba(10,18,32,.46);
		background: #FFF;
		box-shadow: 0 0 6px 0 rgba(0,0,0,.06), 0 10px 12px 0 rgba(170,182,206,.15);
    }
    .relation{
    	width: 100%;
    	position: relative;
    	background: #fff;
		font-size: 12px;
    }
    .flow-chart{
    	width: 104px;
    	text-align: center;
    	height: 32px;
    	padding: 0 15px;
    	line-height: 32px;
    	background: #5182E4;
    	color: #fff;
    	position: relative;
    	cursor: pointer;	
    }
    .flow-chart1{
    	position: absolute;
    	top: 50%;
    	left: 50px;
    	margin-top: -16px;
    }
    .flow-chart2{
    	position: absolute;
    	top: 50%;
    	background: #fff;
    	color: #2d2f33;
    	left: 300px;
    	border: 1px solid #5182E4;
    	margin-top: -16px;
    }
    .flow-chart-children{
    	margin: 50px 0 90px 0;
    	margin-left: 550px;
    	position: relative;
    }
    .h-border{
    	height: calc(100% - 32px);
    	width: 2px;
    	background: #5182E4;
    	position: absolute;
    	top: 16px;
    	left: -45px;
    }
    .flow-chart-child{
    	margin-bottom: 30px;
    }
    .flow-chart-border{
    	width: 100px;
    	height: 2px;
    	position: absolute;
    	top: 50%;
    	margin-top: -1px;
    	background: #5182E4;
    }
    .flow-chart1-border{
    	width: 147px;
    	left: 103px;
    }
    .flow-chart2-border{
    	width: 72px;
    	left: 133px;
    }
    .flow-chart3-border{
    	width: 75px;
    	right: 143px;
    }
    .flow-chart-title{
    	display: inline-block;
    	width: 64px;
    	text-align: right;
    	margin-right: 6px;
    }
    .elpopfont{
    	font-size: 12px;
    	line-height: 24px;
    	color: rgba(10,18,32,.64);
    }
</style>