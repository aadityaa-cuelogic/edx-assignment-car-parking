$(document).ready(function(){
	$('#datetimepicker_intime').datetimepicker();
	$('#datetimepicker_outtime').datetimepicker();
	if(window.location.pathname === '/'){
		getCarsParkedList();
	}else if(window.location.href.indexOf("edit") > -1) {
		// console.log("here 2");
		getEditCar();
		// console.log("here 4");
	}if(window.location.href.indexOf("addnew") > -1) {
		$(".add-form").removeClass('dnone');
		$(".loading").addClass('dnone');
		console.log($('#v_number').length,'===');
		// $('#v_number').valid();
		$.validator.addMethod("alphanumeric", function(value, element) {
		        return this.optional(element) || /^[a-zA-Z0-9]+$/.test(value);
		}); 
		$("#addForm").validate({
	      rules: {
	         v_number: {
	            required: true,
	            alphanumeric: true
	          }
	         },
	         messages: {
	            v_number: "Only alphanumeric characters are allowed!"
	         }
	     });
		console.log($('#v_number').length,'==2=');
	}
});

function addNewCar(){
	var x= $("#addForm").validate();
	var errorMsg = false;
	for(var i in x.errorList){
		errorMsg = x.errorList[i].message;
	}
	var inputDiv = $(".add-form");
	var v_type = inputDiv.find('#v_type').val();
	var v_name = inputDiv.find('#v_name').val();
	var v_number = inputDiv.find('#v_number').val();
	var v_intime = inputDiv.find('#v_intime').val();
	var v_outtime = inputDiv.find('#v_outtime').val();
	if((v_type != '' && v_name != '' && v_number != '') && !(errorMsg)){// || v_outtime != '' || v_intime != ''){
		$.ajax({
			url: '/addnew/',
			type: 'post',
			data : {
				'v_type':v_type,
				'v_name':v_name,
				'v_number':v_number,
				'v_intime':moment(v_intime, "DD/MM/YYYY hh:mm A").format(),
				'v_outtime':moment(v_outtime, "DD/MM/YYYY hh:mm A").format(),
			},
			beforeSend: function(){
				$(".add-form").addClass('dnone');
				$(".loading").removeClass('dnone');
			},
			success: function(response){
				console.log(response, '====Success response===');
				$(".add-form").addClass('dnone').after('\
					<div class="alert alert-success">\
						  <strong>Success!</strong> Vehicle entry added.\
						</div>\
					');
				setTimeout(function(){
					window.location.href = '/';
				}, 3000);
			},
			error: function(response){
				console.log(response, '====Error response===');
			}
		});
	}else{
		// alert("Invalid Data");
	}
}

function addNewPage() {
	window.location.href = "/addnew/";
}

function deleteCarParked(v_id){
	var csrfmiddlewaretoken = $( "input[name='csrfmiddlewaretoken']" ).val();
	$.ajax({
		url: '/vehicle/'+v_id+'/',
		type: 'DELETE',
		data: {
			'id' : v_id
		},
		beforeSend: function(request){
			console.log(request,'====request===')
			request.setRequestHeader("X-CSRFToken", csrfmiddlewaretoken);
		},
		success: function(response){
			console.log(response,"====success delete response===");
			$("#vehicles_table").addClass('dnone').after('\
						<div class="alert alert-success">\
						  <strong>Success!</strong> Vehicle entry removed.\
						</div>\
			');
			setTimeout(function(){
				window.location.href = '/';
			}, 3000);
		},
		error: function(response){
			console.log(response,"====error delete response===");
		}
	})
}

function editCar(v_id){
	// console.log("here 1");
	window.location.href = "/edit/"+v_id;
}

function saveEditCar(){
	var inputDiv = $(".edit-form");
	var v_id = inputDiv.find("#v_id").val();
	var v_type = inputDiv.find('#v_type').val();
	var v_name = inputDiv.find('#v_name').val();
	var v_number = inputDiv.find('#v_number').val();
	var v_intime = inputDiv.find('#v_intime').val();
	var v_outtime = inputDiv.find('#v_outtime').val();
	var owner = inputDiv.find('#owner').val();
	var csrfmiddlewaretoken = $( "input[name='csrfmiddlewaretoken']" ).val();
	if(v_type != '' || v_name != '' || v_number != '' || v_id != ''){// || v_outtime != '' || v_intime != ''){
		$.ajax({
			url: '/vehicle/'+v_id+'/',
			type: 'PUT',
			data : {
				'id':v_id,
				'v_type':v_type,
				'name':v_name,
				'number':v_number,
				'intime':moment(v_intime, "DD/MM/YYYY hh:mm A").format(),
				'outtime':moment(v_outtime, "DD/MM/YYYY hh:mm A").format(),
				'owner':owner
			},
			beforeSend: function(request){
				console.log(request,'====request===')
				request.setRequestHeader("X-CSRFToken", csrfmiddlewaretoken);
				$(".edit-form").addClass('dnone');
				$(".loading").removeClass('dnone');
			},
			success: function(response){
				console.log(response, '====Success response===');
				$(".edit-form").addClass('dnone').after('\
						<div class="alert alert-success">\
						  <strong>Success!</strong> Vehicle entry updated.\
						</div>\
				');
				setTimeout(function(){
					window.location.href = '/';
				}, 3000);
			},
			error: function(response){
				$(".edit-form").addClass('dnone').after('\
						<div class="alert alert-error">\
						  <strong>Error!</strong> Invalid request.\
						</div>\
				');
				setTimeout(function(){
					// window.location.href = '/';
				}, 3000);
			}
		});
	}else{
		alert("Invalid Data");
	}
}

function getEditCar(){
	// console.log("here 3");
	var path = window.location.pathname;
	var pathArr = path.split("/");
	var v_id = pathArr[pathArr.length-2];
	$.ajax({
		url: '/vehicle/'+v_id,
		type: 'get',
		success: function(response){
			console.log(response, '===success response===');
			if(response !== undefined){
				var v_type = response.v_type;
				var v_name = response.name;
				var v_number = response.number;
				var v_intime = moment.parseZone(response.intime).format('YYYY/MM/DD, h:mm:ss A');
				var v_outtime = moment.parseZone(response.outtime).format('YYYY/MM/DD, h:mm:ss A');
				var v_id = response.id;
				var owner = response.owner;

				var inputDiv = $(".edit-form");
				inputDiv.removeClass('dnone');
				$(".loading").addClass("dnone");
				inputDiv.find('#v_type').val(v_type);
				inputDiv.find('#v_name').val(v_name);
				inputDiv.find('#v_number').val(v_number);
				inputDiv.find('#owner').val(owner);
				inputDiv.find('#v_id').val(v_id);
				$('#datetimepicker_e_intime').datetimepicker({
					defaultDate: v_intime,
					enabledDates: [
                        moment(v_intime)
                    ]
				});
				$('#datetimepicker_e_outtime').datetimepicker({
					defaultDate: v_outtime,
					enabledDates: [
                        moment(v_outtime)
                    ]
				}); 
			}

		},
		error: function(response){
			console.log(response, '===error response===');
			window.location.href = "/";
		}
	})
}

function getCarsParkedList(){
	$.ajax({
		// url:'/getparking',
		url:'/vehicle/',
		type: 'get',
		dataType: 'json',
		success: function(response){
			console.log(response,'===response===');
			var table_tr  = '<caption>Vehicles Parked</caption>\
						<thead>\
							<tr>\
								<th>Type</th>\
								<th>Name</th>\
								<th>Number</th>\
								<th>In-Time</th>\
								<th>Out-Time</th>\
								<th>Action</th>\
							</tr>\
						</thead>\
						<tbody>'
			for(var i=0; i<response.results.length; i++){
				var v_type = response.results[i].v_type;
				var v_name = response.results[i].name;
				var v_number = response.results[i].number;
				var v_intime = moment.parseZone(response.results[i].intime).format('YYYY/MM/DD, h:mm:ss a');
				var v_outtime = moment.parseZone(response.results[i].outtime).format('YYYY/MM/DD, h:mm:ss a');
				var v_id = response.results[i].id;
				table_tr += '<tr> \
								<td>'+v_type+'</td>\
								<td>'+v_name+'</td>\
								<td>'+v_number+'</td>\
								<td>'+v_intime+'</td>\
								<td>'+v_outtime+'</td>\
								<td>\
									<a class="btn btn-warning" href="/edit/'+v_id+'" role="button">Edit</a>\
									<button id="'+v_id+'" class="btn btn-danger deleteCarClick">Delete</button>\
								</td>\
							</tr>';
			}
			$("#vehicles_table").html(table_tr+'</tbody>')
			$('.deleteCarClick').on('click', function(e){
				e.preventDefault();
				var deleteId = $(this).attr('id');
			    $('#confirm').modal({ backdrop: 'static', keyboard: false })
			        .one('click', '#deleteBtn', function (e) {
			            deleteCarParked(deleteId);
			    });
			});

		},
		error:function(response){
			console.log(response,'==error==');
		}
	});
}


// function deleteCarParked(v_id){
// 	$.ajax({
// 		url: '/delete/',
// 		type: 'post',
// 		data: {
// 			'v_id' : v_id
// 		},
// 		success: function(response){
// 			console.log(response,"====success delete response===");
// 			$("#vehicles_table").addClass('dnone').after('\
// 						<div class="alert alert-success">\
// 						  <strong>Success!</strong> Vehicle entry removed.\
// 						</div>\
// 			');
// 			setTimeout(function(){
// 				window.location.href = '/';
// 			}, 3000);
// 		},
// 		error: function(response){
// 			console.log(response,"====error delete response===");
// 		}
// 	})
// }


// function saveEditCar(){
// 	var inputDiv = $(".edit-form");
// 	var v_id = inputDiv.find("#v_id").val();
// 	var v_type = inputDiv.find('#v_type').val();
// 	var v_name = inputDiv.find('#v_name').val();
// 	var v_number = inputDiv.find('#v_number').val();
// 	var v_intime = inputDiv.find('#v_intime').val();
// 	var v_outtime = inputDiv.find('#v_outtime').val();
// 	if(v_type != '' || v_name != '' || v_number != '' || v_id != ''){// || v_outtime != '' || v_intime != ''){
// 		$.ajax({
// 			url: '/saveedit/',
// 			type: 'post',
// 			data : {
// 				'v_id':v_id,
// 				'v_type':v_type,
// 				'v_name':v_name,
// 				'v_number':v_number,
// 				'v_intime':moment(v_intime, "DD/MM/YYYY hh:mm A").format(),
// 				'v_outtime':moment(v_outtime, "DD/MM/YYYY hh:mm A").format(),
// 				'csrfmiddlewaretoken':$( "#csrfmiddlewaretoken" ).val()
// 			},
// 			beforeSend: function(){
// 				$(".edit-form").addClass('dnone');
// 				$(".loading").removeClass('dnone');
// 			},
// 			success: function(response){
// 				console.log(response, '====Success response===');
// 				$(".edit-form").addClass('dnone').after('\
// 						<div class="alert alert-success">\
// 						  <strong>Success!</strong> Vehicle entry updated.\
// 						</div>\
// 				');
// 				setTimeout(function(){
// 					window.location.href = '/';
// 				}, 3000);
// 			},
// 			error: function(response){
// 				$(".edit-form").addClass('dnone').after('\
// 						<div class="alert alert-error">\
// 						  <strong>Error!</strong> Invalid request.\
// 						</div>\
// 				');
// 				setTimeout(function(){
// 					window.location.href = '/';
// 				}, 3000);
// 			}
// 		});
// 	}else{
// 		alert("Invalid Data");
// 	}
// }

// function getEditCar(){
// 	// console.log("here 3");
// 	var path = window.location.pathname;
// 	var pathArr = path.split("/");
// 	var v_id = pathArr[pathArr.length-2];
// 	$.ajax({
// 		url: '/getedit/'+v_id,
// 		type: 'get',
// 		success: function(response){
// 			// console.log(response, '===success response===');
// 			if(response.vehicle_list !== undefined){
// 				var v_type = response.vehicle_list[0].type;
// 				var v_name = response.vehicle_list[0].name;
// 				var v_number = response.vehicle_list[0].number;
// 				// var v_intime = response.vehicle_list[0].intime;
// 				// var v_outtime = response.vehicle_list[0].outtime;
// 				var v_intime = moment.parseZone(response.vehicle_list[0].intime).format('YYYY/MM/DD, h:mm:ss A');
// 				var v_outtime = moment.parseZone(response.vehicle_list[0].outtime).format('YYYY/MM/DD, h:mm:ss A');
// 				var v_id = response.vehicle_list[0].id;

// 				var inputDiv = $(".edit-form");
// 				inputDiv.removeClass('dnone');
// 				$(".loading").addClass("dnone");
// 				inputDiv.find('#v_type').val(v_type);
// 				inputDiv.find('#v_name').val(v_name);
// 				inputDiv.find('#v_number').val(v_number);
// 				// inputDiv.find('#v_intime').val(v_intime);
// 				// inputDiv.find('#v_outtime').val(v_outtime);
// 				inputDiv.find('#v_id').val(v_id);
// 				$('#datetimepicker_e_intime').datetimepicker({
// 					defaultDate: v_intime,
// 					enabledDates: [
//                         moment(v_intime)
//                     ]
// 				});
// 				$('#datetimepicker_e_outtime').datetimepicker({
// 					defaultDate: v_outtime,
// 					enabledDates: [
//                         moment(v_outtime)
//                     ]
// 				}); 
// 			}

// 		},
// 		error: function(response){
// 			console.log(response, '===error response===');
// 			window.location.href = "/";
// 		}
// 	})
// }

// function getCarsParkedList(){
// 	$.ajax({
// 		// url:'/getparking',
// 		url:'/vehicle/',
// 		type: 'get',
// 		dataType: 'json',
// 		success: function(response){
// 			console.log(response,'===response===');
// 			var table_tr  = '<caption>Vehicles Parked</caption>\
// 						<thead>\
// 							<tr>\
// 								<th>Type</th>\
// 								<th>Name</th>\
// 								<th>Number</th>\
// 								<th>In-Time</th>\
// 								<th>Out-Time</th>\
// 								<th>Action</th>\
// 							</tr>\
// 						</thead>\
// 						<tbody>'
// 			for(var i=0; i<response.vehicle_list.length; i++){
// 				var v_type = response.vehicle_list[i].type;
// 				var v_name = response.vehicle_list[i].name;
// 				var v_number = response.vehicle_list[i].number;
// 				// var v_intime = response.vehicle_list[i].intime;
// 				var v_intime = moment.parseZone(response.vehicle_list[i].intime).format('YYYY/MM/DD, h:mm:ss a');
// 				var v_outtime = moment.parseZone(response.vehicle_list[i].outtime).format('YYYY/MM/DD, h:mm:ss a');
// 				// var v_outtime = response.vehicle_list[i].outtime;
// 				var v_id = response.vehicle_list[i].id;
// 				table_tr += '<tr> \
// 								<td>'+v_type+'</td>\
// 								<td>'+v_name+'</td>\
// 								<td>'+v_number+'</td>\
// 								<td>'+v_intime+'</td>\
// 								<td>'+v_outtime+'</td>\
// 								<td>\
// 									<a class="btn btn-warning" href="/edit/'+v_id+'" role="button">Edit</a>\
// 									<button id="'+v_id+'" class="btn btn-danger deleteCarClick">Delete</button>\
// 								</td>\
// 							</tr>';
// 			}
// 			$("#vehicles_table").html(table_tr+'</tbody>')
// 			$('.deleteCarClick').on('click', function(e){
// 				e.preventDefault();
// 				var deleteId = $(this).attr('id');
// 			    $('#confirm').modal({ backdrop: 'static', keyboard: false })
// 			        .one('click', '#deleteBtn', function (e) {
// 			            deleteCarParked(deleteId);
// 			    });
// 			});

// 		},
// 		error:function(response){
// 			console.log(response,'==error==');
// 		}
// 	});
// }