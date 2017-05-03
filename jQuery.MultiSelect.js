;(function(){ 
	$.fn.multiSelect = function(options){ 

		    var _options = {
		    	data : [],
		    	initSelect : [],
		    	text : 'text',
		    	val : 'val',
		    	desc : 'desc',
		    	search: {
		    		flag: true,
		    	    placeholder : '请输入关键词'
		    	},
		    	onChange : function() {
		    		//do something
		    	},
		    	callback : function(){
		    		//do something
		    	}
		    }

		    if (options && typeof options === 'object') {
				_options = $.extend(_options, options);
			}

		    var $this = this; 
		    
	    	$this.wrap('<div class="select-wrapper"></div>').hide();
	    	$("<div class='checks-select'><ul></ul></div>").insertAfter($this);
	    	var $wrapper = $this.closest('.select-wrapper'), 
	    	    $checks_select = $wrapper.find('.checks-select'), 
	    	    $ul = $checks_select.find('ul');
	    	$wrapper.append('<div class="selected-items-wrap"></div>');
	    	var $selected_items = $wrapper.find('.selected-items-wrap');

	    	var width = $this.outerWidth(), height = $this.outerHeight();
	    	$wrapper.css({
	    		width : width + 'px',
	    		minHeight : height + 'px'
	    	});
	    	var top = height;
	    	$checks_select.css('top' , top + 'px');

	    	//添加下拉列表
	        var check_list = '', data = _options.data;
	        for(var i = 0, len = data.length; i < len; i++) {
	        	if(!!data[i][_options.desc]) {
	        		check_list += '<li class="checkbox-li" data-name="'+ data[i][_options.text] +'"><label><div class="label-area"><input type="checkbox" value="' + data[i][_options.val] + '"><div class="checkbox-li-left" title="'+ data[i][_options.text] +'">'+ data[i][_options.text] +'</div><div class="checkbox-li-right" title="'+ data[i][_options.desc] +'">'+ data[i][_options.desc] +'</div></div></label></li>';
	        	} else {
	        		check_list += '<li class="checkbox-li" data-name="'+ data[i][_options.text] +'"><label><div class="label-area" title="'+ data[i][_options.text] +'"><input type="checkbox" value="' + data[i][_options.val] + '">'+ data[i][_options.text] +'</div></label></li>';
	        	}  
	        }

	        $ul.append(check_list);

	        //代理，处理点击事件
            $checks_select.on('click', '.checkbox-li', function() {
            	var $li = $(this), name = $li.attr('data-name'),
            	    $checkbox = $li.find('input[type="checkbox"]'),
            	    valAdd = $checkbox.val(), 
            	    valNew = "";
				if($checkbox.is(":checked") && !$li.hasClass('active')) {
					$li.addClass('active');
					$selected_items.append('<span class="selected-item" data-id="'+ $checkbox.val() +'">'+ name +'<i class="icon-close"></i></span>');
					if($this.val() == "") {
						valNew = $.trim(valAdd);
					} else {
						valNew = $.trim($this.val()) + "," + $.trim(valAdd);
					}
				} else {
					$li.removeClass('active');
					$selected_items.find('span[data-id="'+ $checkbox.val() +'"]').remove();
					if($this.val() == "") {
					    valNew = "";
					} else {
						var input_val = $.trim($this.val()),
						    valnow = $.trim(valAdd),
						    reg1 = "," + valnow, reg2 = valnow + ",", reg3 = valnow,
						    input_val = input_val.replace(reg1, "").replace(reg2, "").replace(reg3, "");
					    valNew = input_val;
					}
				}
				$this.val(valNew);
				var height = $wrapper.outerHeight();
				if(top != height) {
					top = height;
					$checks_select.css('top' , top + 'px');
				}
				if ($.isFunction(_options.onChange)) {
					_options.onChange.call($this);
				}
            });

            //删除已选的项
            $wrapper.on('click', '.selected-item .icon-close', function(e){
            	var id = $(this).closest('.selected-item').attr('data-id'),
            	    $checkbox =  $checks_select.find('input[type="checkbox"][value="'+ id +'"]');
            	$checkbox.trigger('click');
            });

            //初始显示的值
            var initData = _options.initSelect;
            for(var i = 0, len = initData.length; i < len; i++) {
            	$checks_select.find('input[type="checkbox"][value="'+ initData[i].val +'"]').trigger('click');
            }

            //显示或隐藏下拉列表
            $wrapper.click(function(e) {
                $wrapper.toggleClass('active');
                $checks_select.toggleClass('active');
            	e.stopPropagation();
            });

            $(document).click(function(){
            	$wrapper.removeClass('active');
            	$checks_select.removeClass('active');
            });

			//搜索框
	    	if(_options.search.flag) {
	    		$('<div id="search-wrapper"><input type="text" id="select-search" placeholder="'+ _options.search.placeholder +'"></div>').insertBefore($ul);
	    		$wrapper.on('click', '#select-search', function(e){
	            	var e = e || window.event;
	            	e.stopPropagation();
	            });
	            $wrapper.find('#select-search').on('keyup', function(){
	            	var $this = $(this);
	            	var timer = setTimeout(function(){
	            		clearTimeout(timer);
	            		var search_text = $this.val(), 
	            		    search_result = [], 
	            		    $check_li = $checks_select.find('li.checkbox-li'), 
	            		    $search_tip = $ul.find('li.search-no-result');
                        
                        if(search_text == '') {
                        	$check_li.removeClass('hide');
                        	if($search_tip.length == 1) {
	            				$search_tip.remove();
	            			}
                        	return;
                        }

	            		for(var i = 0, len = data.length; i < len; i++) {
	            			if(data[i][_options.text].indexOf(search_text) > -1) {
	            				search_result.push(data[i][_options.val]);
	            			}
	            		}

	            		$check_li.addClass('hide');
	            		var l = search_result.length;
	            		if(l == 0) {
	            			if($search_tip.length == 0) {
	            				$ul.append('<li class="search-no-result">暂时没有数据</li>');
	            			}		
	            		} else {
	            			if($search_tip.length == 1) {
	            				$search_tip.remove();
	            			}	
	            			for(var j = 0; j < l; j++) {
		            			$checks_select.find('li input[value="'+ search_result[j] +'"]').closest('li').removeClass('hide');
		            		}
	            		}
	            	}, 0);
	            });
	    	}

	    	//回调
            if ($.isFunction(_options.callback)) {
				_options.callback.call($this);
			}

		} 
})(jQuery);