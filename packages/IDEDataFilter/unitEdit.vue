<template>
	<div>
		<el-form :inline="true" class="my__form__inline" v-if="filter.comment && filter.conditionType == '1'" size="mini">
			<el-form-item>
				<el-popover width="130" trigger="click">
					<el-button type="text" size="mini" @click="addRowAnd">且条件</el-button>
					<el-button type="text" size="mini" @click="addRowOr">或条件</el-button>
					<a slot="reference" class="my__form__comment" :title="filter.comment">{{ filter.comment }}</a>
				</el-popover>
			</el-form-item>
			<el-form-item>
				<el-select v-model="filter.filterType" class="width120" placeholder="请选择" @change="changeFilter">
					<el-option-group v-for="(group,index) in options" :key="index">
						<el-option v-for="item in group.options" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-option-group>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-input v-model="filter.value" class="width160" type="number" v-if="isValueShow('num')"></el-input>
			
				<el-autocomplete class="inline-input" v-model="selectInput" v-if="isValueShow('input')" :fetch-suggestions="querySearch" placeholder="请输入内容" @select="handleSelect" @blur="blurGetValue"></el-autocomplete>
				<!--多选输入-->
				<multi-select v-if="isValueShow('multiSelect')" :url="getColumnUrl" :value.sync="filter.value" :tb_id="tbid || tb_id" :column="filter.cid" class="width180" @selectChange="selectChange"></multi-select>
				<date-picker v-if="isValueShow('date')" class="date-input width160" :date-type="dateType" v-model="filter.value" @date-change="dateChange"></date-picker>
			</el-form-item>
		</el-form>
		<el-form :inline="true" class="my__form__inline" v-else-if="filter.conditionType == '2'" size="mini">
			<el-form-item>
				<el-popover width="130" trigger="click">
					<el-button type="text" size="mini" @click="addRowAnd">且条件</el-button>
					<el-button type="text" size="mini" @click="addRowOr">或条件</el-button>
					<a slot="reference" class="my__form__comment">满足</a>
				</el-popover>
			</el-form-item>
			<!-- 表达式 -->
			<el-form-item>
				<span :title="formateExpression(filter.expression)" @click="editExpression" class="expression-span">{{formateExpression(filter.expression)}}</span>
			</el-form-item>
		</el-form>
		<el-form :inline="true" class="my__form__inline" v-else>
			<el-form-item v-if="checked == '0'">
				<select-button showTitle="添加条件" :otherShow="otherCondition" @handlerClick="handlerCondition"></select-button>
			</el-form-item>
			<!--选择字段-->
			<el-form-item v-if="checked == '1'">
				<el-select v-model="filter.cid" size="mini" class="width160" popper-class="maxwidth250" filterable placeholder="请选择字段" @change="changeFilterType">
					<el-option v-for="item in fieldArr" :title="item[field.comment]" :key="item[field.cid]" :label="item[field.comment]" :value="item[field.cid]"></el-option>
				</el-select>
			</el-form-item>
			<!--选择表达式-->
			<el-form-item class="expression-fathor" v-if="checked == '2'">
				<el-button @click="addExpression" size="mini">选择表达式</el-button>
			</el-form-item>
		</el-form>
		<div id="editCont" class="edit-cont" v-show="expressionFlag" @mousedown="mouseDown($event)" @mouseup="mouseUp($event)">
			<div class="exp-cont">
				<!-- 函数列表 -->
				<div class="fun-cont">
					<div class="tab-content">
						<label class="tab-item">
                  <span>函数</span>
              </label>
					</div>
					<div class="fun-item" :key="item.name" v-for="item in functionList">
						<el-popover placement="left-start" width="280" trigger="hover" visible-arrow=false>
							<p class="elpopfont defaule-name">{{ item.name }}</p>
							<div class="default-content">
								<span class="use-name">用 法：</span>
								<p class="use-content">{{item.usage}}</p>
							</div>
							<div class="default-content">
								<span class="use-name">说 明：</span>
								<p class="use-content use-value">{{item.desc}}</p>
							</div>
							<div class="default-content">
								<span class="use-name">示 例：</span>
								<p class="use-content use-value">{{item.demo}}</p>
							</div>
							<p slot="reference" :style="{'cursor':'pointer'}" @click="handleSelFun(item)">
								<i class="ide-icon geshihua-icon"></i> {{ item.name }}
							</p>
						</el-popover>
					</div>
				</div>
				<!-- 字段列表 -->
				<div class="col-cont">
					<div class="tab-content">
						<label class="tab-item" :class="{'tab-item-active':activeTab =='1'}" @click.stop="handleOption('1')">
                  <span>表字段</span>
              </label>
						<label class="tab-item" :class="{'tab-item-active':activeTab =='2'}" @click.stop="handleOption('2')">
                  <span>参数</span>
              </label>
					</div>
					<ul class="col-ul" v-if="activeTab == '1'">
						<li :title="item.COLCOMMENT" @click="handleSelCol(item)" :key="item.COLNAME" v-for="item in fieldArr">{{item.COLCOMMENT || item.COLNAME}}</li>
					</ul>
					<ul class="col-ul" v-if="activeTab == '2'">
						<li :title="'系统参数'+item.pm_id" @click="handleSelSys(item)" :key="item.pm_id+'sys'" v-for="item in sysParamList">{{item.pm_text || item.pm_id}}</li>
						<li :title="'自定义参数'+item.pm_id" @click="handleSelSys(item)" :key="item.pm_id+'param'" v-for="item in paramList">{{item.pm_text || item.pm_id}}</li>
					</ul>
				</div>
				<!-- 表达式编辑 -->
				<div class="expre-text">
					<div id="container" :class="{'isclass-CC': !isclassCC}" ref="container">
						<codemirror class="my-cm" ref="myCm" v-model="expression_pmtext" :options="cmOptions" @focus="focus" @blur="changeExpre" @keyup.native="keyup">
						</codemirror>
					</div>
					<label @click="syntaxCheckFun" class="syntax-check" for="">语法校验</label>
				</div>
			</div>
			<div class="foot-cont">
				<el-button @click="cancleEditCont" size="mini">取消</el-button>
				<el-button @click="saveEditCont" type="primary" size="mini">确定</el-button>
			</div>
		</div>
	</div>
</template>
<script>
	import { mapState, mapActions } from "vuex";
	import { codemirror } from 'vue-codemirror';
	import * as CodeMirror from 'codemirror/lib/codemirror';
	import 'codemirror/lib/codemirror.css';
	import 'codemirror/addon/hint/show-hint.css';
	import 'codemirror/mode/sql/sql';
	import 'codemirror/addon/hint/show-hint.js';
	import 'codemirror/addon/hint/sql-hint.js';
	import 'codemirror/addon/selection/active-line.js';
	import { setTimeout } from 'timers';
	export default {
		props: {
			//筛选的数组
			fieldArr: {
				type: Array,
				required: true
			},
			//字段相关
			field: {
				type: Object,
				required: true
			},
			tbid: {

			},
			dhId:{
				default: ""
			},
			//筛选的数组
			filter: {
				type: Object,
				required: true
			}
		},
		data() {
			return {
				paramList:[],
				sysParamList:[],
				columnArr: [],
				columnNumberArr: [],
				editFlag: '',
				relationleft: "",
				relationtop: "",
				selectInput: '',
				activeTab: '1',
				//表达式标识
				expressionFlag: false,
				functionList: [],
				isclassCC: false,
				cmOptions: {
					mode: {
						name: 'text/x-impala'
					},
					spellcheck: true,
					autocorrect: true,
					lineNumbers: true,
					autofocus: false,
					indentWithTabs: true,
					smartIndent: true,
					matchBrackets: true,
					showCursorWhenSelecting: true,
					lineWrapping: true,
					extraKeys: {
						"Ctrl": "autocomplete"
					},
					hintOptions: {
						tables: {}
					},
				},
				expression: '',
				expression_pmtext: '',
				compareArr: [{
						name: "等于",
						id: "CB01"
					},
					{
						name: "不等于",
						id: "CB06"
					},
					{
						name: "大于",
						id: "CB02"
					},
					{
						name: "小于",
						id: "CB03"
					},
					{
						name: "大于等于",
						id: "CB04"
					},
					{
						name: "小于等于",
						id: "CB05"
					},
					{
						name: "包含",
						id: "CV01"
					},
					{
						name: "不包含",
						id: "CV02"
					},
					{
						name: "开头包含",
						id: "CV03"
					},
					{
						name: "结尾包含",
						id: "CV04"
					},
					{
						name: "不为空",
						id: "CN02"
					},
					{
						name: "为空",
						id: "CN01"
					}
				],
				restaurants: [],
				restaurantsNum: [],
				otherCondition: [{
					icon: "",
					title: "添加表达式"
				}],
				checked: '0',
				//文本类型的选择器
				SOptions: [{
						options: [{
								id: "CL01",
								name: "属于"
							},
							{
								id: "CL02",
								name: "不属于"
							}
						]
					},
					{
						options: [{
								name: "等于",
								id: "CB01"
							},
							{
								name: "不等于",
								id: "CB06"
							}
						]
					},
					{
						options: [{
								name: "包含",
								id: "CV01"
							},
							{
								name: "不包含",
								id: "CV02"
							},
							{
								name: "开头包含",
								id: "CV03"
							},
							{
								name: "结尾包含",
								id: "CV04"
							}
						]
					},
					{
						options: [{
								name: "为空",
								id: "CN01"
							},
							{
								name: "不为空",
								id: "CN02"
							}
						]
					}
				],
				//数字类型的选择器
				DOptions: [{
						options: [{
								name: "等于",
								id: "CB01"
							},
							{
								name: "不等于",
								id: "CB06"
							}
						]
					},
					{
						options: [{
								name: "大于",
								id: "CB02"
							},
							{
								name: "小于",
								id: "CB03"
							}
						]
					},
					{
						options: [{
								name: "大于等于",
								id: "CB04"
							},
							{
								name: "小于等于",
								id: "CB05"
							}
						]
					},
					{
						options: [{
								name: "为空",
								id: "CN01"
							},
							{
								name: "不为空",
								id: "CN02"
							}
						]
					}
				],
				//日期类型的选择器
				TOptions: [{
						options: [{
								name: "等于",
								id: "CB01"
							},
							{
								name: "不等于",
								id: "CB06"
							}
						]
					},
					{
						options: [{
								name: "大于",
								id: "CB02"
							},
							{
								name: "小于",
								id: "CB03"
							}
						]
					},
					{
						options: [{
								name: "大于等于",
								id: "CB04"
							},
							{
								name: "小于等于",
								id: "CB05"
							}
						]
					},
					{
						options: [{
								name: "为空",
								id: "CN01"
							},
							{
								name: "不为空",
								id: "CN02"
							}
						]
					}
				],
				options: [],
				loading: false,
				getColumnUrl: "",
				dateType: "10",
				//判断当前类型是否变化，来决定value是否要清空
				currentType: ""
			};
		},
		methods: {
			// 获取自定义参数项列表
//			getParamTree() {
//				var _this = this;
//				this.paramList = [];
//				var data = {
//					dh_id: this.dhId,
//				};
//				if(this.dhId == ''){
//					return false;
//				}
//				this.$http.post(_this.$urls.param.readForDash,data).then(function(response) {
//					var meta = response.data;
//					if(meta.success) {
//						_this.paramList = meta.data;
//						_this.$store.commit('currentDashParamList',_this.paramList);
//						_this.zuheChang();
//					} else {
//						_this.$notify({
//							dangerouslyUseHTMLString: true,
//							message: handleError(meta),
//							duration: 6000,
//							type: 'error'
//						})
//					}
//				})
//			},
//			queryDataArrNum() {
//				let _this = this;
//				let data = {
//					column: _this.filter.cid,
//					tb_id: this.tbid || this.tb_id
//				};
//				this.$http.post(this.getColumnUrl, data).then(function(response) {
//					var meta = response.data;
//					if(meta.success) {
//						if(meta.data) {
//							_this.columnNumberArr = meta.data.reduce(
//								(list, item) => [...list, ...Object.values(item)], []
//							);
//						} else {
//							_this.columnNumberArr = [];
//						}
//						_this.zuheChangNum();
//					} else {
//						_this.$notify({
//							dangerouslyUseHTMLString: true,
//							message: handleError(meta),
//							duration: 6000,
//							type: "error"
//						});
//					}
//				});
//			},
//			queryDataArr() {
//				let _this = this;
//				let data = {
//					column: _this.filter.cid,
//					tb_id: this.tbid || this.tb_id
//				};
//				this.$http.post(this.getColumnUrl, data).then(function(response) {
//					var meta = response.data;
//					if(meta.success) {
//						if(meta.data) {
//							_this.columnArr = meta.data.reduce(
//								(list, item) => [...list, ...Object.values(item)], []
//							);
//						} else {
//							_this.columnArr = [];
//						}
//						_this.zuheChang();
//					} else {
//						_this.$notify({
//							dangerouslyUseHTMLString: true,
//							message: handleError(meta),
//							duration: 6000,
//							type: "error"
//						});
//					}
//				});
//			},
			zuheChangNum() {
				this.restaurantsNum = [];
				//push常量值
				var colArr = JSON.parse(JSON.stringify(this.columnNumberArr));
				for(var i = 0; i < colArr.length; i++) {
					let temp = {
						value: colArr[i] + '',
						pm_id: colArr[i] + ''
					};
					this.restaurantsNum.push(temp);
				}
			},
			// 组装常量
			zuheChang() {
				this.restaurants = [];
				//push常量值
				var colArr = JSON.parse(JSON.stringify(this.columnArr));
				for(var i = 0; i < colArr.length; i++) {
					let temp = {
						value: colArr[i],
						pm_id: colArr[i]
					};
					this.restaurants.push(temp);
				}
				//push系统参数
				for(var i = 0; i < this.sysParamList.length; i++) {
					let obj = {
						value: this.sysParamList[i].pm_text,
						pm_id: this.sysParamList[i].pm_id,
					};
					this.restaurants.push(obj);
				}
				//push自定义参数
				for(var i = 0; i < this.paramList.length; i++) {
					let obj = {
						value: this.paramList[i].pm_text,
						pm_id: this.paramList[i].pm_id,
					};
					this.restaurants.push(obj);
				}
			},
			editExpression() {
				this.getExpressionList();
				this.editFlag = 'edit';
				this.expressionFlag = !this.expressionFlag;
			},
			mouseDown(ev) {
				let _this = this;
				let offleft = document.getElementById('editCont').offsetLeft;
				let offtop = document.getElementById('editCont').offsetTop;
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
			handleOption(str) {
				this.activeTab = str;
			},
			//显示表达式内容
			addExpression() {
				this.expressionFlag = true;
			},
			cancleEditCont() {
				this.expressionFlag = false;
			},
			saveEditCont() {
				this.expressionFlag = false;
				this.filter.conditionType = '2';
				this.filter.expression = this.expression;
				this.$emit("expressChange");
			},
			handleSelFun(item) {
				this.isclassCC = true;
				var temp = this.monacoeditor.getValue();
				temp = temp.replace(/\s*/g, "");
				if(temp.indexOf('请在此输入表达式进行编辑') != -1) {
					temp = temp.replace('请在此输入表达式进行编辑', '');
					this.monacoeditor.setValue(temp);
				}
				let showValue = "";
				showValue = `${item.name}()`;
				this.monacoeditor.replaceSelection(showValue);
				var cursor = this.monacoeditor.getCursor();
				this.monacoeditor.setCursor({
					line: cursor.line,
					ch: cursor.ch - 1
				});
			},
			handleSelCol(item) {
				this.isclassCC = true;
				var temp = this.monacoeditor.getValue();
				temp = temp.replace(/\s*/g, "");
				if(temp.indexOf('请在此输入表达式进行编辑') != -1) {
					temp = temp.replace('请在此输入表达式进行编辑', '');
					this.monacoeditor.setValue(temp);
				}
				let showValue = "";
				showValue = `[${item.COLCOMMENT || item.COLNAME}]`;
				this.monacoeditor.replaceSelection(showValue);
			},
			handleSelSys(item) {
				this.isclassCC = true;
				var temp = this.monacoeditor.getValue();
				temp = temp.replace(/\s*/g, "");
				if(temp.indexOf('请在此输入表达式进行编辑') != -1) {
					temp = temp.replace('请在此输入表达式进行编辑', '');
					this.monacoeditor.setValue(temp);
				}
				let showValue = "";
				showValue = `{${item.pm_text}}`;
				this.monacoeditor.replaceSelection(showValue);
			},
			syntaxCheckFun() {
				var self = this;
				self.changeExpre();
				self.$message({
					message: '语法校验通过',
					type: 'success'
				});
			},
			focus() {
				this.isclassCC = true;
				let tempvalue = this.monacoeditor.getValue();
				if(tempvalue.indexOf('请在此输入表达式进行编辑') != -1) {
					tempvalue = tempvalue.replace('请在此输入表达式进行编辑', '');
					this.monacoeditor.setValue(tempvalue);
				}
			},
			formateExpression(strExp) {
				var temp = strExp;
				for(let i = 0; i < this.fieldArr.length; i++) {
					if(temp != '' && temp.indexOf('[' + this.fieldArr[i].COLNAME + ']') != -1) {
						temp = temp.replace('[' + this.fieldArr[i].COLNAME + ']', '[' + this.fieldArr[i].COLCOMMENT + ']');
					}
				}
				for(var i = 0; i < this.sysParamList.length; i++) {
					if(temp != '' && temp.indexOf('{' + this.sysParamList[i].pm_id + '}') != -1) {
						let reg = new RegExp('{' + this.sysParamList[i].pm_id + '}', 'gm');
						temp = temp.replace(reg, '{' + this.sysParamList[i].pm_text + '}');
					}
				}
				for(var i = 0; i < this.paramList.length; i++) {
					if(temp != '' && temp.indexOf('{' + this.paramList[i].pm_id + '}') != -1) {
						let reg = new RegExp('{' + this.paramList[i].pm_id + '}', 'gm');
						temp = temp.replace(reg, '{' + this.paramList[i].pm_text + '}');
					}
				}
				return temp;
			},
			changeExpre(val) {
				if(this.monacoeditor.getValue() == '') {
					this.isclassCC = false;
					this.monacoeditor.setValue('请在此输入表达式进行编辑');
				}
				this.expression = this.monacoeditor.getValue();
				for(let i = 0; i < this.fieldArr.length; i++) {
					if(this.expression != '' && this.expression.indexOf('[' + this.fieldArr[i].COLCOMMENT + ']') != -1) {
						this.expression = this.expression.replace('[' + this.fieldArr[i].COLCOMMENT + ']', '[' + this.fieldArr[i].COLNAME + ']');
					}
				}
				for(var i = 0; i < this.sysParamList.length; i++) {
					if(this.expression != '' && this.expression.indexOf('{' + this.sysParamList[i].pm_text + '}') != -1) {
						let reg = new RegExp('{' + this.sysParamList[i].pm_text + '}', 'gm');
						this.expression = this.expression.replace(reg, '{' + this.sysParamList[i].pm_id + '}');
					}
				}
				for(var i = 0; i < this.paramList.length; i++) {
					if(this.expression != '' && this.expression.indexOf('{' + this.paramList[i].pm_text + '}') != -1) {
						let reg = new RegExp('{' + this.paramList[i].pm_text + '}', 'gm');
						this.expression = this.expression.replace(reg, '{' + this.paramList[i].pm_id + '}');
					}
				}
			},
			keyup(event) {
				//英文字母触发、、219为左方括号，点是190；$是52;空格32
				if((event.keyCode >= 65 && event.keyCode <= 90) || event.keyCode == 52 || event.keyCode == 219 || event.keyCode == 190) {
					CodeMirror.commands.autocomplete(this.monacoeditor, null, {
						completeSingle: false
					});
				}
			},
			initEditor() {
				let self = this;

				function set(str) {
					var obj = {},
						words = str.split(" ");
					for(var i = 0; i < words.length; ++i) obj[words[i]] = true;
					return obj;
				}
				CodeMirror.defineMIME("text/x-impala", {
					name: "sql",
					tableHints: {},
					keywords: set("select alter $elem$ $key$ $value$ add after all analyze and archive as asc before between binary both bucket buckets by cascade case cast change cluster clustered clusterstatus collection column columns comment compute concatenate continue create cross cursor data database databases dbproperties deferred delete delimited desc describe directory disable distinct distribute drop else enable end escaped exclusive exists explain export extended external false fetch fields fileformat first format formatted from full function functions grant group having hold_ddltime idxproperties if import in index indexes inpath inputdriver inputformat insert intersect into is items join keys lateral left like limit lines load local location lock locks mapjoin materialized minus msck no_drop nocompress not of offline on option or order out outer outputdriver outputformat overwrite partition partitioned partitions percent plus preserve procedure purge range rcfile read readonly reads rebuild recordreader recordwriter recover reduce regexp rename repair replace restrict revoke right rlike row schema schemas semi sequencefile serde serdeproperties set shared show show_database sort sorted ssl statistics stored streamtable table tables tablesample tblproperties temporary terminated textfile then tmp to touch transform trigger true unarchive undo union uniquejoin unlock update use using utc utc_tmestamp view when where while with"),
					builtin: set("bool boolean long timestamp tinyint smallint bigint int float double date datetime unsigned string array struct map uniontype"),
					atoms: set("false true null unknown"),
					operatorChars: /^[*+\-%<>!=]/,
					dateSQL: set("date timestamp"),
					support: set("ODBCdotTable doubleQuote binaryNumber hexNumber"),
				});
				if(self.editFlag == 'edit') {
					var str = self.formateExpression(self.filter.expression);
					self.monacoeditor.setValue(str);
				} else {
					self.monacoeditor.setValue('请在此输入表达式进行编辑');
				}
			},
			//查询函数列表
			getExpressionList(type) {
				var _this = this;
				_this.functionList = [{
					demo:"返回字符串长度",
					desc:"返回字符串长度",
					name:"LENGTH",
					type:"01",
					usage:"LENGTH(字符串)",
				}];					
			},
			querySearchNum(queryString, cb) {
				var restaurantsNum = this.restaurantsNum;
				var results = queryString ? restaurantsNum.filter(this.createFilterNum(queryString)) : restaurantsNum;
				// 调用 callback 返回建议列表的数据
				cb(results);
			},
			querySearch(queryString, cb) {
				var restaurants = this.restaurants;
				var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
				// 调用 callback 返回建议列表的数据
				cb(results);
			},
			createFilterNum(queryString) {
				return(restaurantsNum) => {
					return((restaurantsNum.value + '').toLowerCase().indexOf((queryString + '').toLowerCase()) == 0);
				};
			},
			createFilter(queryString) {
				return(restaurant) => {
					return(restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) == 0);
				};
			},
			handleSelect(item) {
				this.filter.value = item.pm_id;
			},
			blurGetValue() {
				var tid = '';
				for(var i = 0; i < this.sysParamList.length; i++) {
					if(this.sysParamList[i].pm_text == this.selectInput) {
						tid = this.sysParamList[i].pm_id;
					}
				}
				if(tid == '') {
					this.filter.value = this.selectInput;
				} else {
					this.filter.value = tid;
				}
			},
			addRowAnd(type) {
				this.type = 'and';
				this.$emit("addRowAnd");
			},
			addRowOr() {
				this.type = 'or';
				this.$emit("addRowOr");
			},
			//当选择字段后把class,等补上
			changeFilterType(cid) {
				let _this = this;
				this.checked = '';
				this.fieldArr.forEach(element => {
					if(element[_this.field.cid] === cid) {
						this.filter.comment = element[_this.field.comment] || element[_this.field.cid];
						_this.$set(this.filter, "dataClass", element[_this.field.type]);
						this.filter.conditionType = "1";
						//0为常量，1位全局参数（这里先写死）
						this.filter.valueType = "0";
					}
				});
			},
			handlerCondition(title) {
				if(title === "添加条件") {
					this.checked = '1';
				} else {
					this.checked = '2';
				}
			},
			initOption(value) {
				let _this = this;
				switch(value) {
					// 文本类型
					case "D":
					case "D~":
						_this.$set(this, "options", Object.assign({}, this.SOptions));
						break;
						//数字类型
					case "#":
					case "#~":
						_this.$set(this, "options", Object.assign({}, this.DOptions));
						break;
						//日期类型
					case "T":
						_this.$set(this, "options", Object.assign({}, this.TOptions));
						break;
				}
			},
			//select框改变的情况
			changeFilter() {
				let filterType = this.filter.filterType;
				//根据类型判断value是否要清空
				if(filterType == "CL01" || filterType == "CL02") {
					if(Object.prototype.toString.call(this.filter.value) === "[object String]") {
						this.$set(this.filter, "value", []);
					}
				} else {
					if(Object.prototype.toString.call(this.filter.value) === "[object Array]") {
						this.$set(this.filter, "value", "");
					}
				}
//				this.queryDataArr();
			},
			// 日期改变
			dateChange(value) {

			},
			//预留接口
			selectChange(value) {}
		},
		components: {
			codemirror,
			selectButton: resolve => {
				require(["./selectBtn"], resolve);
			},
			multiSelect: resolve => {
				require(["./multiSelect"], resolve);
			},
			datePicker: resolve => {
				require(["./datePicker"], resolve);
			}
		},
		watch: {
//			dhId(){
//				this.getParamTree();
//			},
			expressionFlag() {
				if(this.expressionFlag) {
					var self = this;
					setTimeout(function() {
						self.initEditor();
					}, 100);
				}
			},
			checked() {
				if(this.checked == '2') {
					this.getExpressionList();
				}
			},
			filter(newval) {
				if(newval && !newval.comment) {
					this.checked = '0';
				}
				this.selectInput = newval.value;
				for(var i = 0; i < this.sysParamList.length; i++) {
					if(this.sysParamList[i].pm_id == newval.value) {
						this.selectInput = this.sysParamList[i].pm_text;
					}
				}
				for(var i = 0; i < this.paramList.length; i++) {
					if(this.paramList[i].pm_id == newval.value) {
						this.selectInput = this.paramList[i].pm_text;
					}
				}
			},
			//根据选择的字段判断后面select的选项
			"filter.dataClass": {
				handler(newVal) {
					let _this = this;
					_this.initOption(newVal);
				},
				deep: true,
				immediate: true
			}
		},
		mounted() {
//			this.getParamTree();
//			this.getColumnUrl = this.$urls.table.getColumnValues;
			this.restaurants = [];
			for(var i = 0; i < this.sysParamList.length; i++) {
				let obj = {
					value: this.sysParamList[i].pm_text,
					pm_id: this.sysParamList[i].pm_id,
				};
				this.restaurants.push(obj);
			}
			this.selectInput = this.filter.value;
			for(var i = 0; i < this.sysParamList.length; i++) {
				if(this.sysParamList[i].pm_id == this.filter.value) {
					this.selectInput = this.sysParamList[i].pm_text;
				}
			}
			for(var i = 0; i < this.paramList.length; i++) {
				if(this.paramList[i].pm_id == this.filter.value) {
					this.selectInput = this.paramList[i].pm_text;
				}
			}
		},
		computed: {
			monacoeditor() {
				if(this.$refs.myCm) {
					return this.$refs.myCm.codemirror
				}
			},
			//value框的显示隐藏
			isValueShow: function(value) {
				return function(value) {
					let result = false;
					if(this.filter.filterType) {
						let filterType = this.filter.filterType,
							dataClass = this.filter.dataClass;
						switch(value) {
							//数字的情况，等于，不等于。大于，小于，大于等于，<=
							case "num":
								if(
									dataClass.includes("#") &&
									(filterType == "CB01" ||
										filterType == "CB06" ||
										filterType == "CB02" ||
										filterType == "CB03" ||
										filterType == "CB04" ||
										filterType == "CB05")
								) {
									result = true;
								}
								break;
								//输入框的情况
							case "input":
								if(
									dataClass.includes("D") &&
									(filterType == "CB01" ||
										filterType == "CB06" ||
										filterType == "CV01" ||
										filterType == "CV02" ||
										filterType == "CV03" ||
										filterType == "CV04")
								) {
									result = true;
								}
								break;
								//空和不为空的情况（预留）
							case "empty":
								if(filterType == "CN01" || filterType == "CN02") {
									result = true;
								}
								break;
								//多选
							case "multiSelect":
								if(filterType == "CL01" || filterType == "CL02") {
									result = true;
								}
								break;
							case "date":
								if(
									dataClass.includes("T") &&
									(filterType == "CB01" ||
										filterType == "CB06" ||
										filterType == "CB02" ||
										filterType == "CB03" ||
										filterType == "CB04" ||
										filterType == "CB05")
								) {
									result = true;
								}
								break;
						}
					}
					return result;
				};
			},
//			...mapState("filters", {
//				tb_id: state => state.tb_id,
//				column: state => state.column
//			})
		}
	};
</script>
<style>
	.el-autocomplete-suggestion li {
		font-size: 12px!important;
	}
	
	.isclass-CC .vue-codemirror .CodeMirror-line span {
		color: #ccc;
	}
	
	.cm-s-default {
		font-family: "微软雅黑"!important;
	}
	
	.cm-s-default .cm-header {
		color: blue;
	}
	
	.cm-s-default .cm-quote {
		color: #090;
	}
	
	.cm-s-default .cm-keyword {
		color: #0000FF;
		font-weight: bolder;
	}
	
	.cm-s-default .cm-atom {
		color: #219;
	}
	
	.cm-s-default .cm-number {
		color: #164;
	}
	
	.cm-s-default .cm-def {
		color: #00f;
	}
	
	.cm-s-default .cm-variable,
	.cm-s-default .cm-punctuation,
	.cm-s-default .cm-property,
	.cm-s-default .cm-operator {}
	
	.cm-s-default .cm-variable-2 {
		color: #05a;
	}
	
	.cm-s-default .cm-variable-3,
	.cm-s-default .cm-type {
		color: #085;
	}
	
	.cm-s-default .cm-comment {
		color: #a50;
	}
	
	.cm-s-default .cm-string {
		color: #a11;
	}
	
	.cm-s-default .cm-string-2 {
		color: #f50;
	}
	
	.cm-s-default .cm-meta {
		color: #555;
	}
	
	.cm-s-default .cm-qualifier {
		color: #555;
	}
	
	.cm-s-default .cm-builtin {
		color: #30a;
	}
	
	.cm-s-default .cm-bracket {
		color: #997;
	}
	
	.cm-s-default .cm-tag {
		color: #170;
	}
	
	.cm-s-default .cm-attribute {
		color: #00c;
	}
	
	.cm-s-default .cm-hr {
		color: #999;
	}
	
	.cm-s-default .cm-link {
		color: #00c;
	}
	
	.cm-s-default .cm-error {
		color: #f00;
	}
	
	.my__form__inline .CodeMirror {
		border: solid 1px #ccc;
		border: none;
		height: 280px;
		width: 205px;
		font-size: 15px!important;
		line-height: 1.5;
	}
	
	.my__form__inline .el-input.is-disabled .el-input__inner {
		background: #ffffff;
		cursor: pointer;
	}
	
	.CodeMirror-wrap pre span {
		font-family: "monospace"!important;
	}
	
	.CodeMirror-cursor {
		height: 24px;
	}
	
	.CodeMirror-focused {
		border: solid 1px #ccc;
		border: none;
	}
	
	.CodeMirror-hints {
		z-index: 3000;
	}
	
	.CodeMirror-gutters {
		background: #ffffff;
	}
</style>

<style lang="scss" scoped>
	.tab-content .tab-item-active {
		color: #0066ff;
		/* font-weight: 700; */
		border-bottom: 1px solid #0066FF;
	}
	
	.tab-content {
		padding: 0px 15px;
		height: 37px;
		border-bottom: 1px solid #ccc;
	}
	
	.tab-content .tab-item {
		display: inline-block;
		min-width: 50px;
		line-height: 37px;
		// padding-bottom: 5px;
		text-align: center;
		cursor: pointer;
		max-width: 100px;
		overflow: hidden;
		margin-right: 10px;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	
	.fun-item {
		line-height: 36px;
	}
	
	.tab-item {
		font-size: 13px;
	}
	
	.syntax-check {
		color: #2184FF;
		cursor: pointer;
		text-decoration: underline;
		position: absolute;
		right: 20px;
		bottom: 20px;
	}
	
	.my__form__inline .expression-fathor {
		position: relative;
	}
	
	#container {
		height: 85%;
		width: 100%;
		text-align: left;
		position: relative;
	}
	
	.col-ul {
		display: block;
		height: 85%;
		overflow: auto;
	}
	
	.col-ul li {
		line-height: 36px;
		white-space: nowrap;
		display: inline-block;
		text-overflow: ellipsis;
		overflow: hidden;
		width: 100%;
		padding: 0 10px 0 15px;
		cursor: pointer;
	}
	
	.exp-cont {
		border: 1px solid #e8eaed;
		height: calc(100% - 45px);
		cursor: auto;
	}
	
	.fun-cont {
		height: 100%;
		display: inline-block;
	}
	
	.col-cont,
	.expre-text {
		border-left: 1px solid #e8eaed;
		height: 100%;
		display: inline-block;
	}
	
	.fun-cont,
	.col-cont {
		width: 170px;
		overflow: auto;
	}
	
	.expre-text {
		width: calc(100% - 350px);
		overflow: auto;
		position: relative;
	}
	
	.foot-cont {
		line-height: 45px;
		text-align: right;
	}
	
	.edit-cont {
		width: 600px;
		height: 400px;
		position: fixed;
		bottom: 0px;
		z-index: 1004;
		background: #fff;
		border-radius: 2px;
		box-shadow: 0 1px 5px 0 rgba(35, 46, 64, .2);
		padding: 20px;
		padding-bottom: 0px;
		cursor: move;
	}
	::-webkit-scrollbar{
		height: 4px;
	}
	.expression-span {
		border-radius: 4px;
		border: 1px solid #DCDFE6;
		line-height: 28px;
		height: 32px;
		display: inline-block;
		padding-left: 5px;
		cursor: pointer;
		white-space: nowrap;
		overflow-x: auto;
		overflow-y: hidden;
		width: 400px;
	}
	
	.my__form__inline {
		width: 100%;
		height: 36px;
		padding: 2px 0 2px 8px;
		.my__form__comment {
			width: 70px;
			text-overflow: ellipsis;
			display: inline-block;
			overflow: hidden;
			white-space: nowrap;
		}
	}
</style>