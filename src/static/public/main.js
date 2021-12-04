const log = (...a) => console.log(...a);

async function getResult () {
	document.querySelector("#spinner").style.display = "block";
	document.querySelector("#err").style.display = "none";
	document.querySelector("#result").style.display = "none";
	log("Getting result");
	let rollNo = document.querySelector("input#rn").value;
	let response = await fetch("/result/"+rollNo),
		data = await response.json()
	log(data, data.error);
	if( data.error ) return showErr( data.error )
	return showResult (data)
}

function showResult (d) {
	if( ! d) return console.log("Result data not given");
	document.getElementById("err").style.display = "none";
	document.getElementById("spinner").style.display = "none";
	let reslt = document.getElementById("result")
	reslt.style.display = "block"
	reslt.style.opacity = "0"
	reslt.style.transition = "0.5s"
	reslt.innerHTML = `
			<div class="details bg-fff p t-c">
				<table border="1px" class="t-c rc-s d-ib">
					<th colspan="2"> Personal Details </th>
					<tr><td>Name </td><td> ${d.name.replace(" ", "")} </td></tr>
					<tr><td>Roll No. </td><td>${parseInt(d.rollno)}</td></tr>
					<tr><td>Subject </td><td>${d.sub}</td></tr>
					<tr><td>Result </td><td class="dnw"> ${d.result} </td></tr>
					<tr><td>Marks </td><td> ${d.tm} </td></tr>
				</table>
			</div>
			<div class="marks bg-fff p t-c">
				<table border="1px">
					<th colspan="6" class="dnw rc-s">MARKS</th>
					<tr><th>Sub</th><th>I</th><th>II</th><th>III</th><th>Prac.</th><th>Total</th></tr>
					<tr><td>${d.sub[0]}</td><td>${d[d.sub[0]][0]}</td><td>${d[d.sub[0]][1]}</td><td>${d[d.sub[0]][2]}</td><td>${d[d.sub[0]][3]}</td><td>${d[d.sub[0]][4]}</td></tr>
					<tr><td>${d.sub[1]}</td><td>${d[d.sub[1]][0]}</td><td>${d[d.sub[1]][1]}</td><td>${d[d.sub[1]][2]}</td><td>${d[d.sub[1]][3]}</td><td>${d[d.sub[1]][4]}</td></tr>
					<tr><td>${d.sub[2]}</td><td>${d[d.sub[2]][0]}</td><td>${d[d.sub[2]][1]}</td><td>${d[d.sub[2]][2]}</td><td>${d[d.sub[2]][3]}</td><td>${d[d.sub[2]][4]}</td></tr>
				</table>
			</div>
        </div>
	`
	setTimeout (()=>document.getElementById("result").style.opacity = "1", 500);
}

function showErr (err){
	if( ! err) return console.log("Error data not given");
	document.getElementById("err").innerHTML = err;
	document.getElementById("spinner").style.display = "none";
	document.getElementById("result").style.display = "none";
	setTimeout (() => document.getElementById("err").style.display = "block" , 100);
}