const log = (...a) => console.log(...a);

window.getResult = async function (value = false) {
	value = value || document.querySelector("input#rn").value;
	if ( ! value.trim().length ) return;
	let rollNo = parseInt(value);
	vM("spinner")
	if ( Number.isNaN(rollNo)) return _renderNames( value);
	if ( (rollNo + "").length !== 12) return showErr("Roll no. should be 12 digit number !");
	let response = await fetch("http://bscresult.herokuapp.com/result/"+value),
		data = await response.json()
	if( data.error ) return showErr( data.error )
	return showResult (data,vM("result"))
}

function showResult (d) {
	if( ! d) return console.log("Result data not given");
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
	vM("err");
}

const infoGnratr = ( naam , index) => {
	let nameView = _nameView.cloneNode(true);
	let [sn, info, butt] = nameView.children
	sn.textContent = index++ +".";
	let [ nmv, rnv ] = info.children;
	let [ rn, nm ] = naam;
	nmv.textContent = nm;
	rnv.textContent = rn;
	butt.addEventListener ( "click", function (e) {
		document.querySelector("input#rn").value = rn
		getResult(rn)
	})
	return nameView;
}

window._renderNames = async function ( name ) {
	if ( ! name ) return console.log("Error : name not defined !", name);
	let names = await _get("http://bscresult.herokuapp.com/names/"+name, true);
	if ( names.length < 1 || names.error ) return showErr("Error : no student found of named '"+ name +"'")
	let index=1;
	let namesV = document.getElementById("names");
	namesV.innerHTML = "";
	for ( let naam of names ) namesV.appendChild(infoGnratr(naam, index++))
	vM("names")
}

async function brInit () {
	while (!["complete", "interactive"].includes(document.readyState)) await (new Promise(res => setTimeout(res, 50)));
	window._nameView = document.querySelector(".naam").cloneNode(true);
}

brInit ();

window.vM=function (viewid) {
	let ids = ["names","err","result","spinner"]
	if ( ! ids.includes(viewid)) return;
	ids.forEach( id => {
		let view = document.getElementById(id);view.style.display = "none"
	})
	let view = document.getElementById(viewid);
	view.style.display = "block"
	
}

function _get ( url, pj = false) {
	return new Promise( res => {
		let xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if ( this.readyState == 4 ){
				if ( this.status >= 400 ) return res({ error : this.responseText })
				if (this.status >= 200 ) return res( pj ? JSON.parse(this.responseText) : this.responseText );
				else res (false)
			}
		}
		xhr.open("GET", url);
		xhr.send();
	})
}
