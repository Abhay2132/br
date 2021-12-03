const log = (...a) => console.log(...a);

async function getResult () {
	document.querySelector("#spinner").style.display = "block";
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
	reslt.style.transition = "0.5s"
	reslt.innerHTML = `
			<div class="details bg-fff p t-c">
				<table border="1px" class="t-c rc-s d-ib">
					<th colspan="2"> Personal Details </th>
					<tr><td>Name </td><td> ${d.name.replace(" ", "")} </td></tr>
					<tr><td>Roll No. </td><td>${parseInt(d.rollno)}</td></tr>
					<tr><td>Result </td><td class="dnw"> ${d.result} </td></tr>
					<tr><td>Marks </td><td> ${d.tm} </td></tr>
				</table>
			</div>
			<div class="marks bg-fff p t-c">
				<table border="1px">
					<th colspan="6" class="dnw rc-s">MARKS</th>
					<tr><th>Sub</th><th>I</th><th>II</th><th>III</th><th>Prac.</th><th>Total</th></tr>
					<tr><td> P </td><td>${d.p1}</td><td>${d.p2}</td><td>${d.p3}</td><td>${d.pp}</td><td>${d.pt}</td></tr>
					<tr><td>C </td><td>${d.c1}</td><td>${d.c2}</td><td>${d.c3}</td><td>${d.cp}</td><td>${d.ct}</td></tr>
					<tr><td>M </td><td>${d.m1}</td><td>${d.m2}</td><td>${d.m3}</td><td>${d.mp}</td><td>${d.mt}</td></tr>
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