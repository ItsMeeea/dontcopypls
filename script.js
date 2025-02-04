document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("form");
    const exportBtn = document.getElementById("export-btn");
    const resetBtn = document.getElementById("reset-btn");

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        if (checkInputs() == true) {
            document.getElementById("big-box-right").style.display = 'block';
        
            const blockSize = parseInt(document.getElementById("blksize").value);
            const mmSize = parseInt(document.getElementById("mmsize").value);
            const isMMBlock = document.getElementById("ismmblock").checked;
            const cacheMemSize = parseInt(document.getElementById("cache-memsize").value);
            const isCacheBlock = document.getElementById("iscacheblock").checked;
            const programFlow = document.getElementById("seq").value.split(',').map(Number);
            const isSeqBlock = document.getElementById("isseqblock").checked;

            const cacheAccessTime = parseInt(document.getElementById("cachetime").value);
            const memoryAccessTime = parseInt(document.getElementById("memtime").value);

            
            const mmSizeBlocks = isMMBlock ? mmSize : Math.ceil(mmSize / blockSize);
            const cacheMemSizeBlocks = isCacheBlock ? cacheMemSize : Math.ceil(cacheMemSize / blockSize);
            const programFlowBlocks = isSeqBlock ? programFlow : programFlow.map(addr => Math.floor(addr / blockSize));
            
            const cache = new Array(cacheMemSizeBlocks).fill(null);
            let hits = 0, misses = 0;
            
            programFlowBlocks.forEach(address => {
                const index = address % cacheMemSizeBlocks;
                if (cache[index] === address) {
                    hits++;
                } else {
                    misses++;
                    cache[index] = address;
                }

            });

            const hitRatio = hits / programFlowBlocks.length;
            const missRatio = misses / programFlowBlocks.length;
            const missPenalty = (2 * cacheAccessTime) + (blockSize * memoryAccessTime);
            const avgAccessTime = (hitRatio * cacheAccessTime) + (missRatio * missPenalty);
            const totalAccessTime = isSeqBlock ? hits * (blockSize * cacheAccessTime) + misses * (cacheAccessTime + (blockSize * memoryAccessTime) + (blockSize * cacheAccessTime))
                                               : hits * cacheAccessTime + misses * (cacheAccessTime + (blockSize * memoryAccessTime) + cacheAccessTime);

            document.querySelector("#output-flex .text:nth-child(1) p").innerText = hits;
            document.querySelector("#output-flex .text:nth-child(2) p").innerText = misses;
            document.querySelector("#output-flex .text:nth-child(3) p").innerText = formatNum(missPenalty) + " nanoseconds";
            document.querySelector("#output-flex .text:nth-child(4) p").innerText = formatNum(avgAccessTime) + " nanoseconds";
            document.querySelector("#output-flex .text:nth-child(5) p").innerText = formatNum(totalAccessTime) + " nanoseconds";

            const snapshotTable = document.querySelector("tbody");
            
            document.querySelector("tbody").innerHTML = "";

            if (isMMBlock && isSeqBlock && isCacheBlock) {
                var getHeader = document.getElementById("table-header");
                if (getHeader.children[1].textContent == "MM Block") {
                    getHeader.children[1].remove();
                }
                for (let i = 0; i < cache.length; i++) {
                    const newRow = snapshotTable.insertRow();
                    newRow.insertCell(0).textContent = i;
                    newRow.insertCell(1).textContent = cache[i] !== null ? cache[i] : "Empty";
                }
            } else {
                var getHeader = document.getElementById("table-header");
                var newHeader = document.createElement('th');
                newHeader.textContent = "MM Block";
                if (getHeader.children[1].textContent == "MM Block") {
                    getHeader.children[1].remove();
                }
                getHeader.insertBefore(newHeader, getHeader.children[1]); //insert this header before data
                for (let i = 0; i < cache.length; i++) {
                    for (let j = 0; j < blockSize; j++) {
                        const newRow = snapshotTable.insertRow(); //new row
                        const blockCol = newRow.insertCell(0); //block
                        blockCol.textContent = i;

                        const mmBlockCol = newRow.insertCell(1); //MM block
                        mmBlockCol.textContent = cache[i] !== null ? cache[i] : "Empty";

                        const dataCol = newRow.insertCell(2); //data
                        dataCol.textContent = cache[i] !== null ? cache[i]*blockSize+j : "Empty"; //data
                    }
                }
            }
        }
    });

    exportBtn.addEventListener("click", function() {
        const outputText = `
Cache hits: ${document.querySelector("#output-flex .text:nth-child(1) p").innerText}
Cache misses: ${document.querySelector("#output-flex .text:nth-child(2) p").innerText}
Miss penalty: ${document.querySelector("#output-flex .text:nth-child(3) p").innerText}
Avg. access time: ${document.querySelector("#output-flex .text:nth-child(4) p").innerText}
Total access time: ${document.querySelector("#output-flex .text:nth-child(5) p").innerText}

Snapshot:
${Array.from(document.querySelectorAll("table tr")).map(row => Array.from(row.cells).map(cell => cell.innerText).join("\t")).join("\n")}
`;
        const blob = new Blob([outputText], { type: "text/plain;charset=utf-8" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "cache_simulator_output.txt";
        link.click();
    });

    resetBtn.addEventListener("click", function() {
        document.querySelectorAll("input.textbox").forEach(text => {
            text.value = "";
        });

        document.querySelectorAll("input.radio-reset").forEach(btn => {
            btn.checked = false;
        });
        document.getElementById("big-box-right").style.display = 'none';
    });

    function formatNum(num) {
        if (num % 1 !== 0) { 
            return num.toFixed(2);
        } else return num;
    }

    function checkInputs() {
        const blk = document.getElementById("blksize");
        const mm = document.getElementById("mmsize");
        const memTime = document.getElementById("memtime");
        const cacheMem = document.getElementById("cache-memsize");
        const cacheTime = document.getElementById("cachetime");
        const seq = document.getElementById("seq");
    
        const selectMM = document.querySelector('input[name="mmsize-input"]:checked');
        const selectCache = document.querySelector('input[name="cachesize"]:checked');
        const selectSeq = document.querySelector('input[name="sequence"]:checked');

        var msg = "";
        var not_empty = true;
        var validBlk = true;
        var validMM = true;

        if (!blk.value) {
            msg += "Please input block size.<br>";
            validBlk = false;
        }
        if (!mm.value) {
            msg += "Please input memory size.<br>";
            validMM = false;
        }
        if (!memTime.value) {
            msg += "Please input memory access time.<br>";
        }
        if (!selectMM) {
            msg += "Please select block or word for memory size.<br>";
        }
        if (!cacheMem.value) {
            msg += "Please input cache memory size.<br>";
        }
        if (!cacheTime.value) {
            msg += "Please input cache access time.<br>";
        }
        if (!selectCache) {
            msg += "Please select block or word for cache memory size.<br>";
        }
        if (!seq.value) {
            msg += "Please input program flow.<br>";
        } else {
            const checkInputs = seq.value.split(',');
            const isMMBlock = document.getElementById("ismmblock").checked;
            const isSeqBlock = document.getElementById("isseqblock").checked;

            var compareSize = 0;
            var allNums = true;
            var withinSize = true;
            if (isMMBlock && isSeqBlock && validMM || !isMMBlock && !isSeqBlock && validMM) { //both block/word so compare mm size
                compareSize = mm.value;
            } else if (isMMBlock && !isSeqBlock && validMM && validBlk) { //program is word so convert mm to word
                compareSize = mm.value * blk.value;
            } else if (!isMMBlock && isSeqBlock && validMM && validBlk) { //mm is word so convert mm to block
                compareSize = Math.ceil(mm.value / blk.value);
            }
            
            for (const val of checkInputs) {
                if (isNaN(val.trim()) || val.trim() === '' || parseFloat(val.trim()) < 0) {
                    allNums = false;
                }
                if (parseFloat(val.trim()) >= compareSize) {
                    withinSize = false;
                }
            }
            if (!allNums) {
                msg += "Please input positive numbers only in program flow.<br>Example: 1,2,3,4,5<br>";
            }
            if (!withinSize) {
                msg += "Kindly change one of the numbers that is outside the given size.<br>";
            }
        }
        if (!selectSeq) {
            msg += "Please select block or word for program flow.<br>";
        } 
        if (msg) {
            not_empty = false;
        }

        document.getElementById("incomplete-msg").innerHTML = msg;

        return not_empty;
    }

});

function positiveonly(userInput) {
    if (userInput.value < 1) {
        userInput.value = ''; 
    }
}
