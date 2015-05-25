var obj = new Array();
var mid_code;

//初始化
//包括最顶部信息面板、初始层
//初始层包括：动态生成触发按钮、提示信息和生成下一个层的按钮
/*function init(){
	// 顶层提示层
	var div1 = $('<div>点击动态生成的按钮，这儿会有提示语~</div>');
	div1.attr("id","display_board");
	$("#lab_implementation").append(div1);
	
	// 初始层
	var div2 = $('<div></div>');
	$("#lab_implementation").append(div2);

	var num=1;
	div2.attr("class","lab_block");
	div2.text("我是初始层，我是第 "+num+"层~");
	var btn1 = $("<input type='button' />");
	btn1.attr("value","开始");
	$(btn1).bind("click",function(){
		genNext(num,btn1);
	});	

	
	var image1 = $("<image src='./image/add.png'title='点击展开'/>");
	$(image1).toggle(
		function(){
			genWidgets(div2,num);
			$(div2).find("form").first().show();				//第一次show时，设置时间无效
			$(div2).find("form").first().hide();
			$(div2).find("form").first().fadeIn(1000);
		},
		function(){
			// $(div2).find("form").first().hide(1000);		//设置时间完全无效
			// $(div2).find("form").first().show();
			// $(div2).find("form").first().fadeOut(1000); 
			removeForm(div2);
		}
	);
	
						

	$(div2).append(btn1);
	$(div2).prepend(image1);
}*/
//响应生成按钮的点击事件
function gen(){
	var widget_unit = get_object_from_choice();
	gen_widget(widget_unit);
	mid_code = object_to_json(obj);
	write_to_div(mid_code);
}
//获取多选框的选择信息
//生成javascript对象
function get_object_from_choice(){
	var widget_unit = new Object();
	var widgets = new Array();
	$("[name='widget_choice']").each(function(){
		if($(this).attr("checked")){
			widgets.push($(this).val());
		}	
	});
	//alert(widget.length);

	widget_unit.widgets = widgets;
	widget_unit.widgetNum = widgets.length;
	obj.push(widget_unit);
	return widget_unit;
}

//将object转为json字符串返回
function object_to_json(object){
	return JSON.stringify(object);
}
//在中间代码层上显示格式化的mid_code
function write_to_div(string){
	var output_str = string;
	output_str.replace(/widget/g,"a");
	$("#middle_code").text(output_str);
}

//根据widget_unit对象生成控件，添加到lab_implementation层中
function gen_widget(widget_unit){
	var widgets = widget_unit.widgets;
	
	var div = $('<div></div>');
	var form = $('<form></form>');
	
	for(var i = 0 ; i < widgets.length ; i++){
		if(widgets[i]=='input_text'){
			add_input_text(form);
		}
		if(widgets[i]=='single_choice'){
			add_single_choice(form);
		}
		if(widgets[i]=='multiple_choice'){
			add_multiple_choice(form);
		}
		if(widgets[i]=='button'){
			add_button(form);
		}
	}
	div.append(form);
	$("#lab_implementation").append(div);
}
// 添加输入框到block中
function add_input_text(block){
	var input = $("<input type='text' placeholder='随便输入一条消息，然后告诉我是真是假。' />");
	$(block).append(input);
}
// 添加单选框到block中
function add_single_choice(block){
	var radio1 = $("<input type='radio' name='truth' value='真' checked='checked' >真</input>");
	var radio2 = $("<input type='radio' name='truth' value='假' >假</input>");
	$(block).append(radio1);
	$(block).append(radio2);
}
// 添加多选框到block中
function add_multiple_choice(block){
	var checkbox1 = $("<input type='checkbox' name='a' value='真' >真</input>");
	var checkbox2 = $("<input type='checkbox' name='a' value='假' >假</input>");
	$(block).append(checkbox1);
	$(block).append(checkbox2);
}
// 添加多选框到block中
function add_button(block){
	var button = $("<input type='button' value='提交' />");
	$(block).append(button);
	$(button).click(function(){			//绑定button的点击事件,传入的block为按钮所在的表单
		widget_unit_submit(block);
	});
}
//响应控件单元内按钮的点击事件：
//1.将控件中的信息转为json字符串
//2.将字符串传给服务器
function widget_unit_submit(block){
	var message_to_server = new Object();
	var multiple_choice = new Array();
	$(block).find("input").each(function(){
		if($(this).attr("type")=="text"){
			message_to_server.text = $(this).val();
		}
		if($(this).attr("type")=="radio"){
			if($(this).attr("checked")){
				message_to_server.single_choice = $(this).val();		
			}
		}
		if($(this).attr("type")=="checkbox"){
			if($(this).attr("checked")){
				multiple_choice.push($(this).val());
			}
		}
	});
	
	if(multiple_choice.length!=0){
		message_to_server.multiple_choice = multiple_choice;
	}
	//alert(object_to_json(message_to_server));
	return send_message_to_server(object_to_json(message_to_server));
}

function send_message_to_server(string){
	
}
/*
//在lab_implementation末尾加入动态生成的控件
function genWidgets(){
	var div = $('<div></div>');
	var form = $('<form></form>');
	form.hide();
	var input = $("<input type='text' placeholder='随便输入一条消息，然后告诉我是真是假。'/>");
	var btn = $("<input type='button' value='提 交' />");
	var radio1 = $("<input type='radio' name='truth' value='真' checked='checked'>真</input>");
	var radio2 = $("<input type='radio' name='truth' value='假'>假</input>");
	$(form).append(input);
	$(form).append(radio1);
	$(form).append(radio2);
	$(form).append(btn);
	form.show();
	$("#lab_implementation").append(form);
	// $(block).find("input").first().after(form);
	// $(block).find("img").first().attr("src","./image/remove.png");
	// $(block).find("img").first().attr("title","收起");
	
	$(btn).click(function(){
		$("#display_board").text("你告诉我一个消息：\""+input.val()+" \"，这是"+form.find(":checked").val()+"的~ 你还指望我会说什么 = =");
	});
}

//删除block中动态生成的控件
function removeForm(block){
	$(block).find("form").first().remove();
	$(block).find("img").first().attr("src","./image/add.png");
	$(block).find("img").first().attr("title","展开");
}
//定义点击按钮的事件,点击生成下一个层
//num 为当前层数
//btn为当前按钮
function genNext(num,btn){
	num+=1;
	var this_div = $(btn).parent();
	var div = $('<div></div>');
	div.attr("class","lab_block");
	if($(this_div).find("div").length==0){
		div.text("我是第"+num+"层~");	
	}else{
		div.text("我也是第"+num+"层~");	
	}
	
		var image = $("<image src='./image/add.png'title='点击展开'/>");
	$(image).toggle(
		function(){
			genWidgets(div,num);
			$(div).find("form").first().show();				//第一次show时，设置时间无效
			$(div).find("form").first().hide();
			$(div).find("form").first().fadeIn(1000);
		},
		function(){
			removeForm(div);
		}
	);
		
	var btn = $("<input type='button' />");
	btn.attr("value","生成新层");
	$(this_div).append(div);
	$(div).append(btn);
	$(div).prepend(image);
	$(btn).bind("click",function(){
		genNext(num,btn);
	});
}*/
//保存控件
function save(){

}
//加载控件
function reload(){

}
//清除当前控件
function clear_widget(){
	while(obj.length!=0){
		obj.pop();		
	}
	mid_code = object_to_json(obj);
	write_to_div(mid_code);
}
//清除lab_implementation层中所有内容
function clear_div(){
	$("#lab_implementation").children().remove();
}

function mid_code_display(){
	if($("#middle_code").is(":hidden")){
		$("#middle_code").show(300);
		$("#mid_code_display").text("隐藏中间代码");	
	}else{
		$("#middle_code").hide(300);
		$("#mid_code_display").text("显示中间代码");	
	}
}
