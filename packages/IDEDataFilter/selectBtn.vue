<template>
	<div class="my__button">
		<div class="my__select">
			<div class="my__select__button" @click="handlerClick(showTitle)">
				<i :class="showIcon" class="my-icon"></i>
				<a>{{ showTitle }}</a>
			</div>
			<div @click.stop="popshow=!popshow" v-if="otherShow.length>0">
				<i class="my-icon el-icon-arrow-down"></i>
			</div>
		</div>
		<div v-show="popshow" class="my__select__other">
			<div v-for="(item,index) in otherShow" :key="index" class="my__select__button my__select__other__button" @click="handlerClick(item.title)">
				<i :class="item.icon" class="my-icon"></i>
				<a>{{item.title}}</a>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		props: {
			showIcon: {
				type: String,
				default: ""
			},
			showTitle: {
				type: String,
				required: true
			},
			otherShow: {
				type: Array,
				default: function() {
					return [];
				}
			}
		},
		data() {
			return {
				popshow: false,
				clickEvent: null
			};
		},
		mounted() {
			var body = document.getElementsByTagName("body")[0],
				that = this;
			this.clickEvent = body.addEventListener("click", function(e) {
				that.eventLis(e);
			});
		},
		methods: {
			handlerClick(title) {
				// this.popshow = false;
				this.$emit("handlerClick", title);
			},
			eventLis(e) {
				if(e.target.className !== "my__button") {
					this.popshow = false;
				}
			}
		},
		destroyed() {
			var body = document.getElementsByTagName("body")[0],
				that = this;
			this.clickEvent = body.removeEventListener("click", function(e) {
				that.eventLis(e);
			});
		}
	};
</script>
<style lang="scss" scoped>
	$active-color: #409eff;
	$common-color: #606266;
	$font-size: 12px;
	$background: #fff;
	$border: 1px solid #dcdfe6;
	$height: 28px;
	.my__button {
		border: $border;
		background: $background;
		border-radius: 4px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		z-index: 100;
		.my-icon {
			cursor: pointer;
			padding: 0 6px;
			font-size: $font-size;
			line-height: $height;
			color: $active-color;
		}
		.my__select {
			display: flex;
			>div {
				line-height: $height;
			}
		}
		.my__select__button {
			width: 120px;
			height: $height;
			line-height: $height;
			color: $common-color;
			cursor: pointer;
			font-size: $font-size;
			>i {
				color: $active-color;
			}
			>a {
				width: calc(100% - 40px);
				display: inline-block;
				height: 100%;
			}
		}
		.my__select__other {
			background: $background;
			min-height: 36px;
		}
		.my__select__other__button {
			width: 100%;
			border-top: 1px solid rgba(0, 0, 0, 0.1);
		}
	}
	
	.my__select__other {
		border-radius: 4px;
	}
</style>