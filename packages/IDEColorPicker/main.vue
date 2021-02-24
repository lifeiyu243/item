<template>
	<div class="ide-color-picker">
		<div class="ide-color-picker-cont">
			<el-radio-group class="color-type" v-model="colorType" @change="colorTypeChange">
				<el-radio class="fl" label="single">单一色</el-radio>
				<el-radio class="fr" label="gradual">渐变色</el-radio>
			</el-radio-group>
		</div>
		
		<!--单一色-->
		<div v-if="colorType === 'single'">
			<div class="color-schemes block_condition">
				<span class="color-font">配色方案: </span>
				<el-select size="mini" v-model="nowColorSchemes" @change="colorSchemesChange" class="width140">
					<el-option v-for="item in deramColorList" :key="item.dh_id" :label="item.label" :value="item.value">
						<div class="fl deram-c-list">
							<span v-for="color in item.colorList" :key="color" class="fl deram-c-list-imt" :style="{'background': color}"></span>
						</div>
						<div class="fl deram-c-label">{{ item.label }}</div>
					</el-option>
				</el-select>
			</div>
			<div class="color_panel">
				<ul class="color-box">
					<li v-for="list in colorPanel" :key="list" :style="{background: list}" @click="chooseColorDefault(list)">
						<i class="el-icon-check" v-show="colorActive == list"></i>
					</li>
				</ul>
				<div class="color_picker">
					<span>自定义颜色</span>
					<el-color-picker show-alpha :predefine="predefineColors" @change="customcolorChange" v-model="chooseColor" size="mini" style="vertical-align: middle;">
					</el-color-picker>
				</div>
			</div>
		</div>
		
		<!--渐变色-->
		<div v-if="colorType === 'gradual'">
			<div class="block_condition">
				<span class="color-font">配色方案: </span>
				<el-select size="mini" v-model="gradualColorSet" placeholder="请选择" @change='handleGradualColor' class="width140">
					<el-option v-for="item in colorSetArr" :key="item.value" :label="item.label" :value="item.value">
						<div class="fl deram-c-list gradual-color" :style="gradualColor(item)"></div>
						<div class="fl deram-c-label">{{ item.label }}</div>
					</el-option>
				</el-select>
			</div>
			<div class="color_set_middle">
				<el-color-picker size='mini' show-alpha :predefine="predefineColors" v-model="color1" @change="customcolorChange"></el-color-picker>
				
				<div class="middle" ref="Oppset" :style="{background: '-webkit-linear-gradient(left,'+ color1 +','+ color2 +')'}"></div>
				
				<el-color-picker size='mini' show-alpha :predefine="predefineColors" v-model="color2" @change="customcolorChange"></el-color-picker>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'IDEColorPicker',
		props: {
			data: {
				type: Object,
				default: () => {
					return {
						type: 'single',
						colors: '#5182E4'
					}
				}
			}
		},
		data() {
			return {
				colorType: 'single',
				nowColorSchemes: 'schemes1',
				chooseColor: '#5182E4',
				colorActive: "#5182E4",
				color1: 'rgba(255, 255, 255, 1)',
				color2: 'rgba(37, 131, 255, 1)',
				predefineColors: [
			        '#ffffff',
			        '#000000',
			        '#5182E4',
			        '#9BCC66',
			        '#3FB27E',
			        '#F7CB4A',
			        '#F88D48',
			        '#F35352',
			        'rgb(255, 120, 0)',
			        'hsv(51, 100, 98)',
			        'hsva(120, 40, 94, 0.5)',
			        'hsl(181, 100%, 37%)',
			        'hsla(209, 100%, 56%, 0.73)',
			        '#c71585'
			    ],
			    gradualColorSet: 0,
			    colorSetArr: [{
						label: '默认',
						value: 0,
						colors: ['rgba(255, 255, 255, 1)', 'rgba(37, 131, 255, 1)']
					}, {
						label: '渐变金',
						value: 1,
						colors: ['#fad961', '#f76b1c']
					}, {
						label: '渐变绿',
						value: 2,
						colors: ['#c7ccac', '#0d9347']
					}, {
						label: '渐变蓝',
						value: 3,
						colors: ['#a3ccf8', '#4a72c9']
					}, {
						label: '渐变紫',
						value: 4,
						colors: ['#d3c3db', '#7260af']
					}, {
						label: '渐变灰',
						value: 5,
						colors: ['#cbd3da', '#5a6a7b']
				}],
				colorPanel: ["#5182E4", "#9BCC66", "#3FB27E", "#F7CB4A", "#F88D48", "#F35352", "#CE62D6", "#8954D4", "#5156B8", "#51B4F1", "#69D4DB", "#D42D6B"],
				deramColorList: [{
					label: '默认',
					value: 'schemes1',
			      	colorList: ["#5182E4", "#9BCC66", "#3FB27E", "#F7CB4A", "#F88D48", "#F35352", "#CE62D6", "#8954D4", "#5156B8", "#51B4F1", "#69D4DB", "#D42D6B"]
				},{
					label: '幽暗系',
					value: 'schemes2',
			      	colorList: ["#5182E4", "#3f64cc", "#4da2ea", "#d4e6bf", "#b7db8c", "#69d4dc", "#9acc64", "#00c5b5", "#5156b8", "#69d4de", "#4050cc", "#40b27e"],
				},{
					label: '浅色系',
					value: 'schemes3',
				    colorList: ['#fc6060', '#cf60d7', '#f44969', '#ff922f', '#ffbb10', '#f5d02f', '#14b8ff', '#28cfec', '#148dff', '#38d094', '#9ccb66', '#40b27e'],
				},{
					label: '灰色系',
					value: 'schemes4',
			      	colorList: ['#fc6060', '#ff6f24', '#ff5393', '#ffa200', '#ffe659', '#ffb559', '#00e9ff', '#41e2d8', '#4da2ea', '#00ff9a', '#aeeb69', '#bfe98e']
				},{
					label: '明亮蓝',
					value: 'schemes5',
			      	colorList: ['#ff6383', '#f367d3', '#f23178', '#ba55ff', '#ffd56a', '#f25453', '#0070ff', '#afe372', '#1152ff', '#14b8ff', '#6dacff', '#43c0cf']
				},{
					label: '互联网',
					value: 'schemes6',
			      	colorList: ['#ff6383', '#cf60d7', '#d52d6b', '#b65ff2', '#ffbb10', '#f25453', '#397eff', '#9ccb66', '#1c5fbf', '#14b8ff', '#509cff', '#43c0cf']
				},{
					label: '科技系',
					value: 'schemes7',
			      	colorList: ['#ff8a54', '#f367d3', '#f23178', '#00d3b8', '#ffd56a', '#f25453', '#14b8ff', '#afe372', '#3a64ff', '#397eff', '#6dacff', '#43c0cf']
				},{
					label: '物联网',
					value: 'schemes8',
			      	colorList: ['#FF6383', '#F367D3', '#f23178', '#BA55FF', '#ffd56a', '#f25453', '#0070FF', '#afe372', '#1152FF', '#14B8FF', '#6dacff', '#40B27E']
				}],
				
				resData: {
					type: 'single',
					colors: '#5182E4'
				}
			};
		},
		mounted() {
			this.init();
		},
		methods: {
			
			// 初始化
			init() {
				let {type, colors} = {...this.data};
				this.colorType = type || this.colorType;
				if(type == 'single') {
					this.chooseColor = colors || this.chooseColor;
					this.colorActive = colors || this.colorActive;
				}else if(type == 'gradual') {
					if(colors instanceof Array) {
						this.color1 = colors[0] || this.color1;
						this.color2 = colors[1] || this.color2;
					}
				}
				
				this.resData = this.data;
			},
			
			// 颜色改变
			change() {
				if(this.colorType == 'single') {
					this.resData.colors = this.chooseColor;
				}else if(this.colorType == 'gradual') {
					this.resData.colors = [];
					this.resData.colors[0] = this.color1;
					this.resData.colors[1] = this.color2;
				}
				this.$emit('change', this.resData)
			},
			
			// 单一色/渐变色切换
			colorTypeChange() {
				this.resData.type = this.colorType;
				this.change();
			},
			
			// 单一色:配色方案选择
			colorSchemesChange(val, index) {
				for(let i = 0; i < this.deramColorList.length; i++) {
					if(val === this.deramColorList[i].value) {
						this.colorPanel = this.deramColorList[i].colorList;
						break;
					}
				}
				
				this.chooseColor = this.colorPanel[0];
				this.colorActive = this.colorPanel[0];
				this.change();
			},
			
			// 单一色:选择颜色
			chooseColorDefault(color) {
				this.colorActive = color;
				this.chooseColor = color;
				this.change();
			},
			
			// 单一色:自定义颜色
			customcolorChange() {
				this.change();
			},
			
			// 渐变色
			handleGradualColor(val) {
				this.color1 = this.colorSetArr[val].colors[0];
				this.color2 = this.colorSetArr[val].colors[1];
				this.change();
			},
			
			// 渐变色展示
			gradualColor(item) {
				let _style = {
					'background-image': 'linear-gradient(to right,'+ item.colors[0] +','+ item.colors[1] +')'
				}
				return _style;
			}
		},
		watch: {
			data() {
				this.init()
			}
		}
	};
</script>

<style scoped>
	.fl{
		float: left;
	}
	.fr{
		float: right;
	}
	.width160{
		width: 160px;
	}
	.width140{
		width: 138px;
	}
	.width120{
		width: 120px;
	}
	.width100{
		width: 100px;
	}
	.ide-color-picker{
		width: 214px;
		height: 400px;
	}
	.color_item-list {
		width: 100%;
		min-height: 200px;
		max-height: 300px;
		overflow-y: auto;
		border-right: 1px solid #DDD;
	}
	.color_panel {
		width: 100%;
		height: 200px;
		box-sizing: border-box;
		text-align: center;
		padding-top: 0;
	}
	.color_panel ul li {
		display: inline-block;
		height: 32px;
		width: 32px;
		line-height: 32px;
		vertical-align: middle;
		margin: 13px 10px 0;
		color: #fff;
		cursor: pointer;
	}
	.color_picker {
		text-align: right;
		margin-top: 10px;
		margin-right: 12px;
	}
	.color_picker span {
		vertical-align: middle;
		font-size: 12px;
		margin-right: 10px;
		color: #666;
	}
	.ide-color-picker-cont {
		overflow: hidden;
		margin-bottom: 15px;
	}
	.color_item i {
		display: inline-block;
		vertical-align: middle;
		height: 14px;
		width: 14px;
		margin-right: 8px;
	}
	.active_tab {
		background-color: #F1F3F4;
	}
	.deram-c-list {
		width: 42px;
		margin-top: 6px;
		margin-right: 10px;
	}
	.deram-c-list-imt {
		display: block;
		width: 7px;
		height: 10px;
	}
	.color_set_top span {
		margin-right: 15px;
	}
	.color_set_middle {
		margin-top: 15px;
    	margin-left: 10px;
	}
	
	.color_set_middle div {
		height: 28px;
		display: inline-block;
		vertical-align: middle;
	}
	
	.color_set_middle .middle {
		height: 28px;
		width: 120px;
		margin-left: 10px;
		margin-right: 10px;
		vertical-align: top;
	}
	.gradual-color{
		margin-top: 8px;
		height: 15px;
	}
	.color-font{
		font-size: 12px;
	}
	.color-box{
		margin: 0;
		padding: 0;
	}
	.block_condition{
		text-align: center;
	}
	.color-type{
		margin: 0 8px;
	}
</style>