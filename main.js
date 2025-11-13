let currentMode = 0;
let inputs = [];
let combinations = [];

function selectMode(mode) {
    currentMode = mode;
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('inputSection').style.display = 'block';
    document.getElementById('inputTitle').textContent = `Introduce ${mode} números (1-49)`;
    const grid = document.getElementById('numberGrid');
    grid.innerHTML = '';
    inputs = [];
    for (let i = 0; i < mode; i++) {
        const input = document.createElement('input');
        input.type = 'number';
        input.min = 1;
        input.max = 49;
        input.className = 'num-input';
        input.placeholder = '-';
        grid.appendChild(input);
        inputs.push(input);
    }
}

function generate() {
    const nums = inputs.map(i => parseInt(i.value)).filter(n => n >= 1 && n <= 49);
    if (nums.length !== currentMode) return alert('Completa todos los números (1-49)');
    if (new Set(nums).size !== nums.length) return alert('Sin números repetidos');

    document.getElementById('loading').style.display = 'block';
    setTimeout(() => {
        combinations = pyramid[currentMode](nums);
        showResults();
        document.getElementById('loading').style.display = 'none';
    }, 100);
}

function showResults() {
    document.getElementById('results').style.display = 'block';
    document.getElementById('count').textContent = `${combinations.length} combinaciones generadas`;
    const container = document.getElementById('combinations');
    container.innerHTML = '';
    combinations.forEach((combo, i) => {
        const card = document.createElement('div');
        card.className = 'result-card';
        card.innerHTML = `<strong>Apuesta ${i+1}</strong><div class="balls">${combo.sort((a,b)=>a-b).map(n => `<div class="ball">${n}</div>`).join('')}</div>`;
        container.appendChild(card);
    });
}

function exportTXT() {
    let txt = `AUREA SYSTEM - ${currentMode} números\n\n`;
    combinations.forEach((c, i) => {
        txt += `${String(i+1).padStart(2)}: ${c.sort((a,b)=>a-b).join(' - ')}\n`;
    });
    const blob = new Blob([txt], {type: 'text/plain'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `aurea_${currentMode}.txt`;
    a.click();
}

function reset() {
    document.getElementById('inputSection').style.display = 'none';
    document.getElementById('results').style.display = 'none';
    currentMode = 0;
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
}

const pyramid = {
    12: nums => {
        const g = nums;
        return [
            [g[0],g[2],g[3],g[5],g[7],g[8]], [g[1],g[3],g[5],g[6],g[7],g[9]],
            [g[0],g[2],g[4],g[6],g[8],g[10]], [g[1],g[3],g[5],g[7],g[9],g[11]],
            [g[0],g[2],g[4],g[6],g[8],g[9]], [g[1],g[3],g[5],g[7],g[10],g[11]],
            [g[0],g[2],g[3],g[5],g[8],g[10]], [g[1],g[4],g[6],g[7],g[9],g[11]],
            [g[0],g[3],g[4],g[6],g[9],g[10]], [g[1],g[2],g[5],g[7],g[8],g[11]],
            [g[0],g[2],g[5],g[6],g[9],g[11]], [g[1],g[3],g[4],g[7],g[8],g[10]],
            [g[0],g[4],g[5],g[7],g[10],g[11]], [g[1],g[2],g[3],g[6],g[8],g[9]],
            [g[0],g[1],g[4],g[6],g[9],g[11]], [g[2],g[3],g[5],g[7],g[8],g[10]]
        ];
    },
    13: nums => pyramid[12](nums.slice(0,12)).concat(pyramid[12](nums.slice(1))),
    14: nums => pyramid[12](nums.slice(0,12)).concat(pyramid[12](nums.slice(2))),
    15: nums => pyramid[12](nums.slice(0,12)).concat(pyramid[12](nums.slice(3)))
};