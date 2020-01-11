const f = document.getElementById("input-file");
const a = document.getElementById("download");
const info = document.getElementById("info");
const decodeButton = document.getElementById("decode");
const encodeButton = document.getElementById("encode");
const clearButton = document.getElementById("clear");
const check = document.getElementById("check");
const txt = document.getElementById("txt");

function readFile() {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsBinaryString(f.files[0]);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (event) => reject(event);
    });
}

function readText() {
    return new Promise((resolve, reject) => {
        resolve(txt.value);
    });
}

function read() {
    if (check.checked) {
        return readText();
    }
    else {
        return readFile();
    }
}

function decode(str) {
    return new Promise((resolve, reject) => {
        try {
            resolve(atob(str));
        }
        catch (error) {
            reject(error);
        }
    });
}

function encode(str) {
    return new Promise((resolve, reject) => {
        try {
            resolve(btoa(str));
        }
        catch (error) {
            reject(error);
        }
    });
}

function writeFile(str) {
    return new Promise((resolve, reject) => {
        let len = str.length;
        let bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = str.charCodeAt(i);
        }
        let filename = "";
        if (f.files.length > 0) {
            filename = f.files[0].name;
            if (filename.endsWith(".txt")) {
                filename = filename.substring(0, filename.length - 4);
            }
            else {
                filename = filename + ".txt";
            }
        }
        a.download = filename;
        a.href = URL.createObjectURL(new File([bytes.buffer], filename));
        a.click();
    });
}

function writeText(str) {
    return new Promise((resolve, reject) => {
        txt.value = str;
    });
}

function write(str) {
    if (check.checked) {
        return writeText(str);
    }
    else {
        return writeFile(str);
    }
}

function clear() {
    f.value = null;
    URL.revokeObjectURL(a.href);
    a.download = null;
    a.href = null;
    info.value = "";
    txt.value = "";
}

function failure(error) {
    alert(error);
}

function update(e) {
    let file = e.target.files[0];
    let nBytes = file.size;
    let sOutput = nBytes + " bytes";
    for (let aMultiples = ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"], nMultiple = 0, nApprox = nBytes / 1024; nApprox > 1; nApprox /= 1024, nMultiple++) {
        sOutput = nApprox.toFixed(3) + " " + aMultiples[nMultiple] + " (" + nBytes + " bytes)";
    }
    info.value = file.name + "\n" + sOutput;
}

function toggleTxt () {
    if (check.checked) {
        txt.style.display = "block";
    }
    else {
        txt.style.display = "none";
    }
}

decodeButton.addEventListener("click", () => {read().then(decode).then(writeFile).catch(failure);});
encodeButton.addEventListener("click", () => {readFile().then(encode).then(write).catch(failure);});
clearButton.addEventListener("click", clear);
f.addEventListener("input", update);
check.addEventListener("input", toggleTxt);