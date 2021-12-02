const log = (...a) => console.log(...a);

async function getResult () {
	document.querySelector("#spnr").style.display = "block";
	log("Getting result");
	let rollNo = document.querySelector("input#rn").value;
	let response = await fetch("/result/"+rollNo),
		data = await response.json()
	log(data);
	document.querySelector("#spnr").style.display = "none";
}