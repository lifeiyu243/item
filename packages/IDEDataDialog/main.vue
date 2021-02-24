<template>
	<div id="data-dialog"  @click="upResize" @click.stop="" :style="{'width':width,'height':height,'left': relationleft, 'top': relationtop}">
		<p id="drag-header" @mousedown="mouseDown($event)" @mouseup="mouseUp($event)">数据项</p>
		<div id="dialog-content">
			<p>弹窗内容</p>
		</div>
		<div class="resize-border" unselectable="on" onselectstart="return false;" @mousedown.stop="downHandleSize($event)" @mouseup.stop="upResize($event)"></div>
	</div>
</template>

<script>
	export default {
		name: "IDEDataDialog",
		data() {
			return {
				relationleft: "",
				relationtop: "",
				width:'170px',
				height:'250px'
			}
		},
		methods: {
			downHandleSize(){
				let _this = this;
				let offleft = document.getElementById('data-dialog').getBoundingClientRect().x;
				let offtop = document.getElementById('data-dialog').getBoundingClientRect().y;
				document.onmousemove = (event) => {
					let oEvent = event || window.event;
					_this.width = oEvent.clientX - offleft + 'px';
					_this.height = oEvent.clientY - offtop + 'px';
					if((oEvent.clientX - offleft) < 170){
						_this.width = '170px';
					}
					if((oEvent.clientY - offtop) < 250){
						_this.height = '250px';
					}
				};
			},
			upResize(){
				document.onmousemove = null;
				document.onmouseup = null;
			},
			mouseDown(ev) {
				let _this = this;
				let offleft = document.getElementById('data-dialog').offsetLeft;
				let offtop = document.getElementById('data-dialog').offsetTop;
				let diffX = ev.clientX - offleft;
				let diffY = ev.clientY - offtop;
				document.onmousemove = (event) => {
					let oEvent = event || window.event;
					_this.relationleft = oEvent.clientX - diffX + 'px';
					_this.relationtop = oEvent.clientY - diffY + 'px';
				};
			},

			mouseUp() {
				document.onmousemove = null;
				document.onmouseup = null;
			},
		}
	}
</script>

<style scoped>
	#data-dialog{
		position: relative;
	}
	#dialog-content {
		overflow-y: auto;
		height: calc(100% - 65px);
		position: relative;
	}
	
	#data-dialog {
		height: 250px;
		width: 170px;
		position: absolute;
		float: left;
		top: 106px;
		left: 214px;
		z-index: 10;
		box-shadow: 0 0 5px #333333;
		background: #ffffff;
	}
	.resize-border{
		height:5px;
		background: #ffffff;
		width: 100%;
		bottom: 0px;
		position: absolute;
		cursor: se-resize;
	}
	#drag-header {
		line-height: 32px;
		padding-left: 10px;
		background: #EEF1F6;
		cursor: move;
		position: relative;
		top: -1px;
		margin:0;
	}
</style>