<template>
	<div class="font-style">
		<el-dropdown class="font-style-item font-style-type" :disabled="true" size="mini" @command="fontTypeChange" trigger="click" style="cursor: pointer;">
			<span class="el-dropdown-link">
		  	  	<i class="ide-icon font-type-icon"></i>
		  	  	<span class="font-style-bborder">
		  	  		<span class="font-family">
		  	  			{{ fontFamily }}
		  	  		</span>
		  	  		<i class="el-icon-arrow-down el-icon--right"></i>
		  	  	</span>
			</span>
			<el-dropdown-menu slot="dropdown">
				<el-dropdown-item v-for="item in fontStyleList" :key="item.code" :command="item.code">
					{{ item.name }}
				</el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>
		<el-dropdown class="font-style-item font-style-size" size="mini" @command="fontSizeChange" trigger="click" style="cursor: pointer;">
			<span class="el-dropdown-link">
		  	  	<span class="font-style-bborder">
	  	  			<span class="font-style-size-drop">
	  	  				{{ fontSize }}
	  	  			</span>
					<i class="el-icon-arrow-down el-icon--right"></i>
				</span>
			</span>
			<el-dropdown-menu slot="dropdown">
				<el-dropdown-item v-for="item in fontSizeList" :key="item.code" :command="item.code">
					<span class="font-style-size-drop">
						{{ item.name }}
					</span>
				</el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>
		<div class="font-style-item font-style-color">
			<span class="font-style-color-span">
				<i class="ide-icon font-color-edit-icon"></i>
				<i class="el-icon-arrow-down el-icon--right"></i>
				<span class="font-color-now" :style="{'background-color': fontStyle.color}"></span>
			</span>
			<el-color-picker 
				v-model="fontStyle.color" 
				show-alpha 
				:predefine="predefineColors"
				@change="colorChange" 
				size="mini" 
				class="v-m">
			</el-color-picker>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'fontStyle',
		props: {
			fontStyle: {
				default: {
					fontFamily: 'inherit',
					fontSize: 'inherit',
					color: '#666'
				}
			}
		},
		data() {
			return {
				// 字体样式
				nowfontStyle: {},
				//预定义颜色
				predefineColors: [
					'#ff4500',
		          '#ff8c00',
		          '#ffd700',
		          '#90ee90',
		          '#00ced1',
		          '#1e90ff',
		          '#c71585',
		          'rgba(255, 69, 0, 0.68)',
		          'rgb(255, 120, 0)',
		          'hsv(51, 100, 98)',
		          'hsva(120, 40, 94, 0.5)',
		          'hsl(181, 100%, 37%)',
		          'hsla(209, 100%, 56%, 0.73)',
		          '#c7158577'
				],
				// 字体格式
				fontStyleList: [{
					name: '默认',
					code: 'inherit'
				}, {
					name: '微软雅黑',
					code: 'Microsoft YaHei,STXihei'
				}, {
					name: '宋体',
					code: 'SimSun,STSong'
				}, {
					name: '新宋体',
					code: 'NSimSun'
				}, {
					name: '仿宋',
					code: 'FangSong_GB2312,FangSong,STFangsong'
				}, {
					name: '楷体',
					code: 'KaiTi_GB2312,KaiTi,STKaiti'
				}, {
					name: '黑体',
					code: 'SimHei,STHeiti'
				}, {
					name: 'Arial',
					code: 'Arial'
				}, {
					name: 'Arial Black',
					code: 'Arial Black'
				}],
				
				// 字体大小
				fontSizeList: [{
					name: '默认',
					code: 'inherit'
				},{
					name: '5px',
					code: '5px'
				},{
					name: '6px',
					code: '6px'
				},{
					name: '8px',
					code: '8px'
				},{
					name: '10px',
					code: '10px'
				},{
					name: '12px',
					code: '12px'
				},{
					name: '14px',
					code: '14px'
				},{
					name: '16px',
					code: '16px'
				},{
					name: '18px',
					code: '18px'
				},{
					name: '22px',
					code: '22px'
				},{
					name: '26px',
					code: '26px'
				},{
					name: '30px',
					code: '30px'
				},{
					name: '36px',
					code: '36px'
				},{
					name: '48px',
					code: '48px'
				},{
					name: '56px',
					code: '56px'
				},{
					name: '72px',
					code: '72px'
				}]
			}
		},
		computed: {
			fontFamily() {
				let fontFamily = '默认';
				for(let i = 0; i < this.fontStyleList.length; i++){
					if(this.fontStyle.fontFamily == this.fontStyleList[i].code) {
						fontFamily = this.fontStyleList[i].name;
					}
				}
				return fontFamily;
			},
			
			fontSize() {
				let fontSize = '默认';
				for(let i = 0; i < this.fontSizeList.length; i++){
					if(this.fontStyle.fontSize == this.fontSizeList[i].code) {
						fontSize = this.fontSizeList[i].name;
					}
				}
				return fontSize;
			}
		},
		mounted() {
			this.nowfontStyle = JSON.parse(JSON.stringify(this.fontStyle));
		},
		methods: {
			// 字体样式改变
			fontTypeChange(command) {
				// console.log(this.nowfontStyle);
				// this.fontFamily = command;
				this.nowfontStyle.fontFamily = command;
				this.$emit("font-change", this.nowfontStyle);
			},
			
			// 字体大小改变
			fontSizeChange(command) { 
				// console.log(this.nowfontStyle);
				// this.fontSize = command;
				this.nowfontStyle.fontSize = command;
				this.$emit("font-change", this.nowfontStyle);
			},
			
			// 颜色改变
			colorChange() {
				this.nowfontStyle.color = this.fontStyle.color;
				this.$emit("font-change", this.nowfontStyle);
			}
		},
		watch: {
			fontStyle: {
				handler() {
					this.nowfontStyle = JSON.parse(JSON.stringify(this.fontStyle));
				},
				deep: true
			}
		}
	}
</script>

<style scoped>
	/*设置线的样式*/
	
	.font-style-item {
		/*width: 70px;*/
		display: inline-block;
	}
	.font-style-type{
		/*width: 108px;*/
	}
	
	.font-family{
		display: inline-block;
		width: 58px;
	}
	
	.font-style-color {
		width: 32px;
		margin-right: 0;
		position: relative;
	}
	
	.font-color-edit-icon {
		background-position: -936px -801px;
	}
	
	.font-type-icon {
		width: 16px;
		background-position: -960px -801px;
	}
	
	.font-style-icon {
		width: 38px;
	}
	
	.font-style-size-drop {
		display: inline-block;
		width: 38px;
	}
	
	.font-style-bborder {
		padding: 4px;
		-webkit-box-shadow: 0 -1px 0 0 rgba(81, 130, 228, .5) inset;
		box-shadow: 0 -1px 0 0 rgba(81, 130, 228, .5) inset;
	}
	
	.font-style-color .el-color-picker {
		opacity: 0;
	}
	
	.font-style-color .font-style-color-span {
		position: absolute;
		top: 3px;
	}
	
	.font-style-color .el-icon--right {
		margin-left: 0;
	}
	
	.font-color-now {
		display: block;
		width: 14px;
		height: 2px;
		background: #ccc;
		position: absolute;
		bottom: 2px;
	}
</style>