<template>
	<div id="text-style-setting">
		<div class="el-item-set">
			<font-setting :is-disabled="false" :font-style="fontStyle" @font-change="fontChange"></font-setting>
		</div>

		<div class="el-item-set">
			<span class="text-align-" :class="{'text-align-active': textStyle.align == 'left'}" title="居左" @click="textSiteChange('align', 'left')"><i class="ide-icon text-left-icon"></i></span>
			<span class="text-align-" :class="{'text-align-active': textStyle.align == 'center'}" title="居中" @click="textSiteChange('align', 'center')"><i class="ide-icon text-center-icon"></i></span>
			<span class="text-align-" :class="{'text-align-active': textStyle.align == 'right'}" title="居右" @click="textSiteChange('align', 'right')"><i class="ide-icon text-right-icon"></i></span>
			<!--<span class="text-align-" :class="{'text-align-active': textStyle.align == 'justify'}" title="两端对齐" @click="textSiteChange('align', 'justify')"><i class="ide-icon text-right-icon"></i></span>-->
		</div>

		<div class="el-item-set">
			<span class="text-align-" :class="{'text-align-active': textStyle.weight == 'bold'}" title="加粗" @click="textSiteChange('weight')"><i class="ide-icon text-bold-icon"></i></span>
			<span class="text-align-" :class="{'text-align-active': textStyle.style == 'italic'}" title="斜体" @click="textSiteChange('style')"><i class="ide-icon text-style-icon"></i></span>
			<span class="text-align-" :class="{'text-align-active': textStyle.decoration == 'underline'}" title="下划线" @click="textSiteChange('decoration')"><i class="ide-icon text-decoration-icon"></i></span>
		</div>
	</div>
</template>

<script>
	export default {
		name: "IDETextStyle",
		data() {
			return {
				fontStyle: {
					fontFamily: 'inherit',
					fontSize: 'inherit',
					color: '#666'
				},
				textStyle: {
					align: 'center',
					decoration: 'none',
					style: 'normal',
					weight: 'normal'
				},
			}
		},
		components: {
			'font-setting': resolve => {
				require(['./fontSetting.vue'], resolve)
			},
		},
		methods: {
			textSiteChange(type, align) {
				switch (type){
					case 'weight':
						this.textStyle.weight === 'normal' ? this.textStyle.weight = 'bold' : this.textStyle.weight = 'normal';
						break;
					case 'decoration':
						this.textStyle.decoration === 'none' ? this.textStyle.decoration = 'underline' : this.textStyle.decoration = 'none';
						break;
					case 'style':
						this.textStyle.style === 'normal' ? this.textStyle.style = 'italic' : this.textStyle.style = 'normal';
						break;
					case 'align':
						this.textStyle.align = align;
						break;
					default:
						break;
				}
			},
			// 文本字体设置
			fontChange(obj) {
				this.fontStyle = obj;
			},
		}
	}
</script>

<style scoped="scoped">
	.el-item-set{
		margin-bottom: 10px;
	}
	/*文本居左、居中、居右图标*/
	.text-align-{
		display: inline-block;
		width: 26px;
		height: 26px;
		margin: 0 10px;
		cursor: pointer;
		text-align: center;
		border-radius: 2px;
	}
	.text-align-:hover{
		background: #fff;
	}
	.text-align-active{
		background: #fff;
		box-shadow: inset 0 0 0 2px rgba(81,130,228,.6);
	}
	.text-left-icon{
		width: 16px;
		height: 16px;
		margin-top: 4px;
		background-position: -965px -853px;
	}
	.text-center-icon{
		width: 16px;
		height: 16px;
		margin-top: 4px;
		background-position: -939px -853px;
	}
	.text-right-icon{
		width: 16px;
		height: 16px;
		margin-top: 4px;
		background-position: -993px -853px;
	}
	.text-bold-icon{
		width: 16px;
		height: 16px;
		margin-top: 4px;
		background-position: -985px -800px;
	}
	.text-style-icon{
		width: 16px;
		height: 16px;
		margin-top: 4px;
		background-position: -1033px -800px;
	}
	.text-decoration-icon{
		width: 16px;
		height: 16px;
		margin-top: 4px;
		background-position: -1009px -800px;
	}
</style>