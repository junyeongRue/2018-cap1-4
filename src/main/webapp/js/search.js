/**
 * 
	환자 검색란에 검색을 했을 때 디비에서 검색해서 자동완성으로 보여주고 선택했을때는 환자가 설문에서 받은 증상들을
	자동으로 보여줌
 */
$(document).ready(function() {
	$("#searchPatient").autocomplete({
		source : function(request, response) {
			$.ajax({
				type:"GET",
				url: "searchPatientInfo",
				dataType :"json",
				data: { pName : request.term}, //request.term => text박스내에 입력된 값
				success: function(resultData) {
					response(
						$.map(resultData, function(item){
							return{
								label: item.pName +" /"+item.pNumber, //화면에 보여지는 텍스트
								value: item.pName // 실제 TEXT태그에 들어갈 값 => 똑같이 표기
							}
						})
					);
				}
			});
		},
	//조회를 위한 최소 글자수
	minLength: 1,
	select: function(event, ui) { //만약 검색리스트에서 선택하였을때 선택한 데이터에 의한 이벤트 발생
		var temp = ui.item.label;
		var getPatientNum = temp.split('/');
		callbackPatient(getPatientNum[1]); // 환자 번호로 검색하기 위함
	}
});
});

function callbackPatient(getPatientNum){ // 환자 번호로 증상과 환자 정보들을 불러오는 함수
	var sendPatientNum = getPatientNum;
	$.ajax({
		type:"GET",
		dataType: "json",
		url: "getPatientSymptoms",
		data : {"pNumber" : sendPatientNum},
		success:function(resultData){
			
			var symptomList ="";
			var patientInfo ="";
			patientInfo += "<h5 style='background-color:#EBEBEB; border: solid 5px #EBEBEB'>"+
							resultData.visitDate +"| "+resultData.pName+"("+resultData.pNumber+") 500211-20*****(F. 67세 0개월 24일) | [국민공단] | 010-5199-**** | 경기도 남양주시 화도읍 명품하우스</h5>";
			
			$.each(resultData.symptomArr ,function(index,item){
				symptomList += "<tr><td>"+item.symptom+"</td><td><button onclick='deleteLine(this);' style='float: right;'>삭제</button></td></tr>";
			});
			$("#showPsymptoms > tbody").empty();
			$("#showPsymptoms").append(symptomList);
			$("#patientInfoView").empty();
			$("#patientInfoView").append(patientInfo);
		}
	});
}

//Default Page 검색란에 입력하고 엔터눌렀을때 똑같이 검색되는 기능
$("#searchPatient").keypress(function(event){
    if ( event.which == 13 ) {
        $("#searchButton").click();
        return false;
    }
});